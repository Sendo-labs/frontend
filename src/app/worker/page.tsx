import type { Metadata } from 'next';
import { getUserAgents } from '@/actions/agents/get';
import { QueryBoundary } from '@/components/shared/query-boundary';
import { getServerSession } from '@/lib/auth/session';
import { WORKER_AGENT_NAME } from '@/lib/constants';
import { getWorkerAgentBaseUrl } from '@/lib/utils';
import { ElizaService } from '@/services/eliza.service';
import { WorkerClientService } from '@/services/worker-client.service';
import Worker from './client';

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
	const signedInUser = await getServerSession();

	// Case 1: User not authenticated → show mocked data
	if (!signedInUser) {
		return <Worker agentId={null} initialWorkerAnalysis={[]} initialAnalysisActions={[]} />;
	}

	const agents = await getUserAgents();
	if (!agents.success) {
		throw new Error(agents.error);
	}

	const agent = agents.data?.find((agent) => agent.name === WORKER_AGENT_NAME);

	// Case 2: User authenticated but no agent → show mocked data + create button
	if (!agent) {
		return <Worker agentId={null} initialWorkerAnalysis={[]} initialAnalysisActions={[]} />;
	}

	// Case 3: User authenticated with agent → fetch real data
	const openRouterApiKey = (agent.settings?.secrets as Record<string, string>)?.OPENROUTER_API_KEY;
	if (!openRouterApiKey || typeof openRouterApiKey !== 'string') {
		throw new Error('OpenRouter API key not found');
	}

	const baseUrl = getWorkerAgentBaseUrl(signedInUser.user.id);
	const elizaService = new ElizaService(openRouterApiKey, baseUrl);
	const workerClientService = new WorkerClientService(String(agent.id), elizaService);

	try {
		const workerAnalysis = await workerClientService.getAnalyses();

		if (workerAnalysis.length > 0) {
			const lastAnalysis = workerAnalysis.sort(
				(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
			)[0];
			const analysisActions = await workerClientService.getActionsByAnalysisId(lastAnalysis.id);
			return (
				<Worker
					agentId={String(agent.id)}
					initialWorkerAnalysis={workerAnalysis}
					initialAnalysisActions={analysisActions}
				/>
			);
		}

		return <Worker agentId={String(agent.id)} initialWorkerAnalysis={[]} initialAnalysisActions={[]} />;
	} catch (error) {
		console.error('Error fetching worker data:', error);
		// If there's an error fetching data, still show the component with empty data
		return <Worker agentId={String(agent.id)} initialWorkerAnalysis={[]} initialAnalysisActions={[]} />;
	}
}

export default Page;
