'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

import AnalysisPanel from '@/components/worker/analysis-panel';
import WorkerPanel from '@/components/worker/worker-panel';
import WorkerToggle from '@/components/worker/worker-toggle';
import RuleBuilder from '@/components/worker/rule-builder';
import ActionList from '@/components/worker/action-list';
import ActionHistory from '@/components/worker/action-history';
import ConnectionPanel from '@/components/worker/connection-panel';
import AddConnectionModal from '@/components/worker/add-connection-modal';
import ConfigurePluginModal from '@/components/worker/configure-plugin-modal';
import type { WorkerAction, WorkerAnalysis } from '@/services/worker-client.service';
import { WorkerClientService } from '@/services/worker-client.service';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';

interface RuleParams {
	min_usd?: number;
	target_pct?: number;
	target?: {
		SOL?: number;
		USDC?: number;
	};
}

interface Rule {
	id: string;
	enabled: boolean;
	params: RuleParams;
}

interface Connections {
	oauth: string[];
	api_keys: string[];
}

interface Config {
	mode: 'suggest' | 'auto';
	rules: Rule[];
	connections: Connections;
}

interface HistoryAction extends WorkerAction {
	executedAt: Date;
	accepted: boolean;
	status: 'accepted' | 'rejected';
}

interface Plugin {
	id: string;
	name: string;
	icon: string;
	price: string;
	description: string;
	category: string;
	authType: 'oauth' | 'api_key';
	configFields?: Array<{
		name: string;
		label: string;
		type: string;
		required?: boolean;
		default?: string | number;
		description?: string;
	}>;
}

interface WorkerProps {
	agentId: string;
	initialWorkerAnalysis: WorkerAnalysis[];
	initialAnalysisActions: WorkerAction[];
}

export default function Worker({ agentId, initialWorkerAnalysis, initialAnalysisActions }: WorkerProps) {
	const workerClientService = new WorkerClientService(agentId);
	const [config, setConfig] = useState<Config | null>(null);
	const [actions, setActions] = useState<WorkerAction[] | null>(null);
	const [history, setHistory] = useState<HistoryAction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isExecuting, setIsExecuting] = useState(false);
	const [showAddConnection, setShowAddConnection] = useState(false);
	const [selectedPluginToConnect, setSelectedPluginToConnect] = useState<Plugin | null>(null);

	const { data: workerAnalysis, isLoading: isWorkerAnalysisLoading } = useQuery({
		queryKey: QUERY_KEYS.WORKER_ANALYSIS.list(),
		queryFn: () => workerClientService.getWorkerAnalysis(),
		initialData: initialWorkerAnalysis,
	});

	const { data: workerActions, isLoading: isWorkerActionsLoading } = useQuery({
		queryKey: QUERY_KEYS.WORKER_ACTIONS.list(),
		queryFn: () => workerClientService.getWorkerActionsByAnalysisId(workerAnalysis[0].id),
		initialData: initialAnalysisActions,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: no need to define dependencies
	useEffect(() => {
		fetchWorkerConfig();
		// fetchProposals();
	}, []);

	const fetchWorkerConfig = async () => {
		setTimeout(() => {
			setConfig({
				mode: 'suggest',
				rules: [
					{ id: 'sell_dust', enabled: true, params: { min_usd: 15 } },
					{ id: 'take_profit', enabled: true, params: { target_pct: 25 } },
					{
						id: 'rebalance',
						enabled: false,
						params: { target: { SOL: 0.6, USDC: 0.4 } },
					},
				],
				connections: {
					oauth: ['jupiter'],
					api_keys: ['defi_provider_x'],
				},
			});
			setIsLoading(false);
		}, 1000);
	};

	const handleModeChange = (newMode: 'suggest' | 'auto') => {
		if (config) {
			setConfig({ ...config, mode: newMode });
		}
	};

	const handleRuleUpdate = (ruleId: string, updates: Partial<Rule>) => {
		if (config) {
			const updatedRules = config.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule));
			setConfig({ ...config, rules: updatedRules });
		}
	};

	const handleActionResponse = async (action: WorkerAction, accepted: boolean) => {
		setIsExecuting(true);

		setTimeout(() => {
			// Remove from proposals
			if (actions) {
				setActions(actions.filter((p) => p.id !== action.id));
			}

			// Add to history with timestamp and status
			setHistory([
				{
					...action,
					executedAt: new Date(),
					accepted: accepted,
					status: accepted ? 'accepted' : 'rejected',
				},
				...history,
			]);

			setIsExecuting(false);
		}, 1500);
	};

	const handleValidateAll = async () => {
		if (!actions || actions.length === 0) return;

		setIsExecuting(true);

		setTimeout(() => {
			// Move all proposals to history as accepted
			const acceptedActions: HistoryAction[] = actions.map((action) => ({
				...action,
				executedAt: new Date(),
				accepted: true,
				status: 'accepted',
			}));

			setHistory([...acceptedActions, ...history]);
			setActions([]);
			setIsExecuting(false);
		}, 2000);
	};

	const handleRefresh = () => {
		setIsLoading(true);
		fetchWorkerConfig();
	};

	const handleAddConnection = (plugin: Plugin) => {
		setShowAddConnection(false);
		setSelectedPluginToConnect(plugin);
	};

	const handleConnectionComplete = () => {
		setSelectedPluginToConnect(null);
		fetchWorkerConfig();
		alert('Connection added successfully! ✅');
	};

	const handleRemoveConnection = (connectionId: string) => {
		if (confirm('Remove this connection?')) {
			if (config) {
				const updatedConnections = { ...config.connections };

				if (updatedConnections.oauth) {
					updatedConnections.oauth = updatedConnections.oauth.filter((id) => id !== connectionId);
				}
				if (updatedConnections.api_keys) {
					updatedConnections.api_keys = updatedConnections.api_keys.filter((id) => id !== connectionId);
				}

				setConfig({ ...config, connections: updatedConnections });
				alert('Connection removed! 🗑️');
			}
		}
	};

	if (isWorkerAnalysisLoading || isWorkerActionsLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24 pb-12'>
				<div className='text-center'>
					<div
						className='w-16 h-16 border-4 border-sendo-orange border-t-transparent mx-auto mb-4'
						style={{ borderRadius: 0 }}
					/>
					<p className='text-foreground/60 text-sm uppercase title-font'>LOADING WORKER...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background text-foreground pt-24 pb-12'>
			<div className='max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-20'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='mb-12 md:mb-16'
				>
					<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
						<div>
							<h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 title-font'>
								WORKER{' '}
								<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>
									DASHBOARD
								</span>
							</h1>
							<p className='text-lg sm:text-xl md:text-2xl text-foreground/60'>
								Automate your trading strategy. Never miss an exit again 🎯
							</p>
						</div>

						<Button
							onClick={handleRefresh}
							className='bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 text-foreground h-12 px-6'
							style={{ borderRadius: 0 }}
						>
							<RefreshCw className='w-5 h-5 mr-2' />
							<span className='title-font'>REFRESH</span>
						</Button>
					</div>

					{config && <WorkerToggle mode={config.mode} onModeChange={handleModeChange} />}
				</motion.div>

				{/* Analysis Section - Full Width */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.8 }}
				>
					<AnalysisPanel analysis={workerAnalysis && workerAnalysis.length > 0 ? workerAnalysis[0] : null} />
				</motion.div>

				<div className='grid lg:grid-cols-3 gap-6 md:gap-8'>
					{/* Left Column - Actions & History */}
					<div className='lg:col-span-2 space-y-6 md:space-y-8'>
						{/* Actions Section */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							{config && workerActions && (
								<ActionList
									actions={workerActions}
									onAccept={(action) => handleActionResponse(action, true)}
									onReject={(action) => handleActionResponse(action, false)}
									onValidateAll={handleValidateAll}
									isExecuting={isExecuting}
									mode={config.mode}
								/>
							)}
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.8 }}
						>
							<ActionHistory history={history} />
						</motion.div>
					</div>

					{/* Right Column - Stats, Rules & Connections */}
					<div className='space-y-6 md:space-y-8'>
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.8 }}
						>
							<WorkerPanel />
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4, duration: 0.8 }}
						>
							{config && <RuleBuilder rules={config.rules} onRuleUpdate={handleRuleUpdate} />}
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5, duration: 0.8 }}
						>
							{config && (
								<ConnectionPanel
									connections={config.connections}
									onAddConnection={() => setShowAddConnection(true)}
									onRemoveConnection={handleRemoveConnection}
								/>
							)}
						</motion.div>
					</div>
				</div>
			</div>

			{showAddConnection && (
				<AddConnectionModal onClose={() => setShowAddConnection(false)} onSelectPlugin={handleAddConnection} />
			)}

			{selectedPluginToConnect && (
				<ConfigurePluginModal
					plugin={selectedPluginToConnect}
					onClose={() => setSelectedPluginToConnect(null)}
					onComplete={handleConnectionComplete}
				/>
			)}
		</div>
	);
}
