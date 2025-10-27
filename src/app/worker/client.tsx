'use client';

import { useState } from 'react';
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
import type { RecommendedAction, AnalysisResult } from '@sendo-labs/plugin-sendo-worker';
import { WorkerClientService } from '@/services/worker-client.service';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';
import { FullScreenLoader } from '@/components/shared/loader';
import PageWrapper from '@/components/shared/page-wrapper';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePrivy } from '@privy-io/react-auth';
import { MOCKED_WORKER_ANALYSIS, MOCK_ANALYSIS_ACTIONS } from '@/lib/agents/worker/mocks';
import { elizaService } from '@/services/eliza.service';
import { getWorkerCreationTemplate } from '@/lib/agents/creation-template';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
	agentId: string | null;
	initialWorkerAnalysis: AnalysisResult[];
	initialAnalysisActions: RecommendedAction[];
}

const config: Config = {
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
};

export default function Worker({ agentId = null, initialWorkerAnalysis, initialAnalysisActions }: WorkerProps) {
	const { authenticated, user, ready } = usePrivy();
	const router = useRouter();
	// If the user is not authenticated or the agentId is null, we use the mocked data
	const mocked = !authenticated || agentId === null;
	
	const workerClientService = agentId ? new WorkerClientService(agentId) : null;
	const [displayMockedAlert, setDisplayMockedAlert] = useState(mocked);
	const [isExecuting, setIsExecuting] = useState(false);
	const [showAddConnection, setShowAddConnection] = useState(false);
	const [selectedPluginToConnect, setSelectedPluginToConnect] = useState<Plugin | null>(null);
	const [agentCreationLoading, setAgentCreationLoading] = useState(false);
	
	const userId = authenticated ? user?.id : null;

	const {
		data: workerAnalysis,
		isLoading: isWorkerAnalysisLoading,
		refetch: refetchWorkerAnalysis,
	} = useQuery({
		queryKey: QUERY_KEYS.WORKER_ANALYSIS.list(),
		queryFn: () => workerClientService?.getWorkerAnalysis() ?? [],
		placeholderData: initialWorkerAnalysis,
		enabled: !mocked,
	});
	
	const displayWorkerAnalysis = mocked ? MOCKED_WORKER_ANALYSIS : workerAnalysis;

	const lastWorkerAnalysis = (analysisData: typeof workerAnalysis) => {		
		if (!analysisData || analysisData.length === 0) {
			return null;
		}
		return [...analysisData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
	};

	const {
		data: workerActions,
		isLoading: isWorkerActionsLoading,
		refetch: refetchWorkerActions,
	} = useQuery({
		queryKey: QUERY_KEYS.WORKER_ACTIONS.list(),
		queryFn: () => {
			const lastAnalysis = lastWorkerAnalysis(workerAnalysis);
			if (!lastAnalysis) {
				return [];
			}
			return workerClientService?.getWorkerActionsByAnalysisId(lastAnalysis.id) ?? [];
		},
		placeholderData: initialAnalysisActions,
		enabled: !mocked,
	});
	
	const displayWorkerActions = mocked ? MOCK_ANALYSIS_ACTIONS : workerActions;

	const handleModeChange = (newMode: 'suggest' | 'auto') => {
		config.mode = newMode;
	};

	const handleRuleUpdate = (ruleId: string, updates: Partial<Rule>) => {
		const updatedRules = config.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule));
		config.rules = updatedRules;
	};

	const handleValidateAll = async () => {
		if (!displayWorkerActions || displayWorkerActions.length === 0) return;

		setIsExecuting(true);

		setTimeout(() => {
			// Move all proposals to history as accepted
			setIsExecuting(false);
		}, 2000);
	};

	const handleRefresh = () => {
		refetchWorkerAnalysis();
		refetchWorkerActions();
	};

	const handleAddConnection = (plugin: Plugin) => {
		setShowAddConnection(false);
		setSelectedPluginToConnect(plugin);
	};

	const handleConnectionComplete = () => {
		setSelectedPluginToConnect(null);
		alert('Connection added successfully! ✅');
	};

	const handleRemoveConnection = (connectionId: string) => {
		if (confirm('Remove this connection?')) {
			const updatedConnections = { ...config.connections };
			updatedConnections.oauth = updatedConnections.oauth.filter((id) => id !== connectionId);
			updatedConnections.api_keys = updatedConnections.api_keys.filter((id) => id !== connectionId);
			config.connections = updatedConnections;
			alert('Connection removed! 🗑️');
		}
	};

	if (!ready || isWorkerAnalysisLoading || isWorkerActionsLoading) {
		return <FullScreenLoader text='Loading Worker' />;
	}

	const createAgent = async () => {
		try {
			setAgentCreationLoading(true);
			if (!userId) {
				throw new Error('User ID is required to create an agent');
			}
			const character = getWorkerCreationTemplate(userId);
			const agent = await elizaService.createAgent(character);
			if (!agent) {
				throw new Error('Failed to create agent');
			}
			toast.success('Agent created successfully');
			router.push(`/worker`);
		} catch (error) {
			toast.error('Failed to create agent', { description: error instanceof Error ? error.message : 'Unknown error' });
		} finally {
			setAgentCreationLoading(false);
		}
	};

	return (
		<PageWrapper>
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

			{/* Analysis Section */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1, duration: 0.8 }}
			>
				<AnalysisPanel analysis={displayWorkerAnalysis && displayWorkerAnalysis.length > 0 ? displayWorkerAnalysis[0] : null} />
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
						{displayWorkerActions && (
							<ActionList
								agentId={agentId}
								userId={userId ?? null}
								actions={displayWorkerActions.filter((action) => action.status === 'pending')}
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
						<ActionHistory actions={displayWorkerActions?.filter((action) => action.status !== 'pending') || []} />
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

			{mocked && (
				<AlertDialog open={displayMockedAlert}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className='text-sendo-orange title-font'>
								All these data are mocked
							</AlertDialogTitle>
							<AlertDialogDescription>
								{authenticated
									? 'No agent found. All the data are mocked for demonstration purposes. To see the real data, please create your agent.'
									: 'You are not authenticated. Please sign in for full access.'}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setDisplayMockedAlert(false)}>Continue</AlertDialogCancel>
							{authenticated && <AlertDialogAction onClick={createAgent} disabled={agentCreationLoading}>Create Agent</AlertDialogAction>}
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</PageWrapper>
	);
}
