'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

import WorkerPanel from '@/components/worker/worker-panel';
import WorkerToggle from '@/components/worker/worker-toggle';
import RuleBuilder from '@/components/worker/rule-builder';
import ActionList from '@/components/worker/action-list';
import ActionHistory from '@/components/worker/action-history';
import ConnectionPanel from '@/components/worker/connection-panel';
import AddConnectionModal from '@/components/worker/add-connection-modal';
import ConfigurePluginModal from '@/components/worker/configure-plugin-modal';

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

interface Proposal {
	type: string;
	tokens?: string[];
	token?: string;
	size_pct?: number;
	est_usd: number;
	reason: string;
	priority: 'low' | 'medium' | 'high';
}

interface HistoryAction extends Proposal {
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

export default function Worker() {
	const [config, setConfig] = useState<Config | null>(null);
	const [proposals, setProposals] = useState<Proposal[] | null>(null);
	const [history, setHistory] = useState<HistoryAction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isExecuting, setIsExecuting] = useState(false);
	const [showAddConnection, setShowAddConnection] = useState(false);
	const [selectedPluginToConnect, setSelectedPluginToConnect] = useState<Plugin | null>(null);

	useEffect(() => {
		fetchWorkerConfig();
		fetchProposals();
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

	const fetchProposals = async () => {
		setTimeout(() => {
			setProposals([
				{
					type: 'SELL_DUST',
					tokens: ['XYZ', 'ABC', 'DEF'],
					est_usd: 42.1,
					reason: 'Tokens below $15 threshold detected',
					priority: 'low',
				},
				{
					type: 'TAKE_PROFIT',
					token: 'BONK',
					size_pct: 15,
					est_usd: 380.0,
					reason: 'BONK is within 8% of ATH - take profits',
					priority: 'high',
				},
				{
					type: 'TAKE_PROFIT',
					token: 'WIF',
					size_pct: 20,
					est_usd: 520.0,
					reason: 'WIF reached your 25% profit target',
					priority: 'medium',
				},
			]);
		}, 1500);
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

	const handleActionResponse = async (proposal: Proposal, accepted: boolean) => {
		setIsExecuting(true);

		setTimeout(() => {
			// Remove from proposals
			if (proposals) {
				setProposals(proposals.filter((p) => p !== proposal));
			}

			// Add to history with timestamp and status
			setHistory([
				{
					...proposal,
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
		if (!proposals || proposals.length === 0) return;

		setIsExecuting(true);

		setTimeout(() => {
			// Move all proposals to history as accepted
			const acceptedProposals: HistoryAction[] = proposals.map((proposal) => ({
				...proposal,
				executedAt: new Date(),
				accepted: true,
				status: 'accepted',
			}));

			setHistory([...acceptedProposals, ...history]);
			setProposals([]);
			setIsExecuting(false);
		}, 2000);
	};

	const handleRefresh = () => {
		setIsLoading(true);
		fetchProposals();
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

	if (isLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center pt-24 pb-12'>
				<div className='text-center'>
					<div
						className='w-16 h-16 border-4 border-[#FF6B00] border-t-transparent mx-auto mb-4'
						style={{ borderRadius: 0 }}
					/>
					<p className='text-foreground/60 text-sm uppercase' style={{ fontFamily: 'TECHNOS, sans-serif' }}>
						LOADING WORKER...
					</p>
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
							<h1
								className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2'
								style={{ fontFamily: 'TECHNOS, sans-serif' }}
							>
								WORKER{' '}
								<span className='bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent'>
									DASHBOARD
								</span>
							</h1>
							<p className='text-lg sm:text-xl md:text-2xl text-foreground/60'>
								Automate your trading strategy. Never miss an exit again 🎯
							</p>
						</div>

						<Button
							onClick={handleRefresh}
							className='bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-[#FF6B00]/50 text-foreground h-12 px-6'
							style={{ borderRadius: 0 }}
						>
							<RefreshCw className='w-5 h-5 mr-2' />
							<span style={{ fontFamily: 'TECHNOS, sans-serif' }}>REFRESH</span>
						</Button>
					</div>

					{config && <WorkerToggle mode={config.mode} onModeChange={handleModeChange} />}
				</motion.div>

				<div className='grid lg:grid-cols-3 gap-6 md:gap-8'>
					{/* Left Column - Actions & History */}
					<div className='lg:col-span-2 space-y-6 md:space-y-8'>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							{config && (
								<ActionList
									proposals={proposals}
									onAccept={(proposal) => handleActionResponse(proposal, true)}
									onReject={(proposal) => handleActionResponse(proposal, false)}
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
							<WorkerPanel proposals={proposals} />
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
