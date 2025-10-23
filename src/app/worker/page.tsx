import type { Metadata } from 'next';
import Worker from './client';
import { QueryBoundary } from '@/components/shared/query-boundary';
import { elizaService } from '@/services/eliza.service';
import { WorkerClientService } from '@/services/worker-client.service';
import { WORKER_AGENT_NAME } from '@/lib/constants';
import type { AnalysisResult, RecommendedAction } from '@sendo-labs/plugin-sendo-worker';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Worker Dashboard',
	description: 'Worker dashboard to manage your worker',
};

async function Page() {
	return (
		<QueryBoundary>
			<Content />
		</QueryBoundary>
	);
}

async function Content() {
	try {
		const agents = await elizaService.getClient().agents.listAgents();
		const agentId = agents.agents.find((agent) => agent.name === WORKER_AGENT_NAME)?.id;

		if (!agentId) {
			throw new Error('WORKER agent not found');
		}

		const workerClientService = new WorkerClientService(agentId);
		const workerAnalysis = await workerClientService.getWorkerAnalysis();

		if (workerAnalysis.length > 0) {
			const lastAnalysis = workerAnalysis.sort(
				(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
			)[0];
			const analysisActions = await workerClientService.getWorkerActionsByAnalysisId(lastAnalysis.id);
			return <Worker agentId={agentId} initialWorkerAnalysis={workerAnalysis} initialAnalysisActions={analysisActions} />;
		}

		return <Worker agentId={agentId} initialWorkerAnalysis={[]} initialAnalysisActions={[]} />;
	} catch (error) {
		// Fallback to mocked data if there's any error fetching real data
		console.warn('Error fetching worker data, using mocked data for demonstration:', error);
		return <Worker agentId="mock-agent-id-0000-0000-0000-000000000001" initialWorkerAnalysis={MOCK_WORKER_ANALYSIS} initialAnalysisActions={MOCK_ANALYSIS_ACTIONS} mocked={true} />;
	}
}

const MOCK_WORKER_ANALYSIS: AnalysisResult[] = [
	{
		id: 'mock-analysis-1-0000-0000-0000-000000000001' as const,
		agentId: 'mock-agent-id-0000-0000-0000-000000000001' as const,
		timestamp: new Date().toISOString(),
		analysis: {
			walletOverview: 'Your portfolio shows strong diversification with SOL (60%), USDC (25%), and various altcoins (15%). Total value: $12,450. Recent performance shows +8.5% growth over the past week.',
			marketConditions: 'Market conditions are favorable with SOL showing bullish momentum. DeFi yields remain attractive at 12-15% APY. Volatility is moderate, creating good entry/exit opportunities.',
			riskAssessment: 'Portfolio risk is moderate. Consider reducing exposure to smaller cap tokens during high volatility periods. Current leverage is conservative at 1.2x.',
			opportunities: 'Strong opportunities identified: 1) Take profit on SOL at $180+ target, 2) Rebalance into USDC for stability, 3) Consider staking rewards optimization.'
		},
		pluginsUsed: ['plugin-swap', 'plugin-defi', 'plugin-portfolio'],
		executionTimeMs: 2500,
		createdAt: new Date().toISOString(),
	},
	{
		id: 'mock-analysis-2-0000-0000-0000-000000000002' as const,
		agentId: 'mock-agent-id-0000-0000-0000-000000000001' as const,
		timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
		analysis: {
			walletOverview: 'Portfolio analysis from yesterday shows continued growth. SOL position increased by 3.2% while maintaining healthy diversification.',
			marketConditions: 'Market showed sideways movement with occasional spikes. DeFi protocols maintained stable yields.',
			riskAssessment: 'Risk levels remained stable. No significant changes in portfolio risk profile.',
			opportunities: 'Identified potential for yield farming optimization and minor rebalancing opportunities.'
		},
		pluginsUsed: ['plugin-portfolio', 'plugin-defi'],
		executionTimeMs: 1800,
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
	},
];

const MOCK_ANALYSIS_ACTIONS: RecommendedAction[] = [
	{
		id: 'mock-action-1-0000-0000-0000-000000000001',
		analysisId: 'mock-analysis-1-0000-0000-0000-000000000001' as const,
		actionType: 'SWAP_TOKEN',
		pluginName: 'plugin-swap',
		priority: 'high' as const,
		reasoning: 'SOL has reached target price of $180. Taking profit to secure gains and rebalance portfolio.',
		confidence: 0.85,
		triggerMessage: 'Execute swap of 0.5 SOL to USDC at current market price to take profit',
		params: {
			fromToken: 'SOL',
			toToken: 'USDC',
			amount: 0.5,
			slippage: 0.5
		},
		estimatedImpact: 'Expected profit: $45-50. Reduces SOL exposure by 8%.',
		status: 'pending' as const,
		createdAt: new Date().toISOString(),
	},
	{
		id: 'mock-action-2-0000-0000-0000-000000000002',
		analysisId: 'mock-analysis-1-0000-0000-0000-000000000001' as const,
		actionType: 'REBALANCE_PORTFOLIO',
		pluginName: 'plugin-portfolio',
		priority: 'medium' as const,
		reasoning: 'Portfolio allocation has drifted from target. Rebalancing to maintain optimal risk-return profile.',
		confidence: 0.72,
		triggerMessage: 'Rebalance portfolio to target allocation: SOL 50%, USDC 30%, Altcoins 20%',
		params: {
			targetAllocation: {
				SOL: 0.5,
				USDC: 0.3,
				ALTCOINS: 0.2
			}
		},
		estimatedImpact: 'Improves portfolio balance and risk management.',
		status: 'pending' as const,
		createdAt: new Date().toISOString(),
	},
	{
		id: 'mock-action-3-0000-0000-0000-000000000003',
		analysisId: 'mock-analysis-1-0000-0000-0000-000000000001' as const,
		actionType: 'STAKE_TOKENS',
		pluginName: 'plugin-staking',
		priority: 'low' as const,
		reasoning: 'Staking rewards optimization opportunity identified. Current staking setup can be improved.',
		confidence: 0.68,
		triggerMessage: 'Stake additional 2 SOL in validator with higher rewards',
		params: {
			token: 'SOL',
			amount: 2,
			validator: 'high-yield-validator'
		},
		estimatedImpact: 'Additional 0.2 SOL annual rewards.',
		status: 'pending' as const,
		createdAt: new Date().toISOString(),
	},
	{
		id: 'mock-action-4-0000-0000-0000-000000000004',
		analysisId: 'mock-analysis-2-0000-0000-0000-000000000002' as const,
		actionType: 'SWAP_TOKEN',
		pluginName: 'plugin-swap',
		priority: 'medium' as const,
		reasoning: 'Completed yesterday: Small rebalancing swap executed successfully.',
		confidence: 0.9,
		triggerMessage: 'Swap 0.1 SOL to USDC for portfolio rebalancing',
		params: {
			fromToken: 'SOL',
			toToken: 'USDC',
			amount: 0.1
		},
		estimatedImpact: 'Completed: $18 profit realized.',
		status: 'completed' as const,
		decidedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
		executedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
		result: {
			text: 'Successfully swapped 0.1 SOL to USDC. Transaction hash: 5Kj8...',
			data: { transactionHash: '5Kj8...', amountReceived: 18.5 },
			timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
		},
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
	},
];

export default Page;
