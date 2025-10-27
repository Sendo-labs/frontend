import type { Metadata } from 'next';
import Worker from './client';
import { QueryBoundary } from '@/components/shared/query-boundary';
import { elizaService } from '@/services/eliza.service';
import { WorkerClientService } from '@/services/worker-client.service';
import { getServerSession } from '@/lib/auth/session';
import { getWorkerAgentId } from '@/lib/agents/utils';

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

	if (!signedInUser) {
		return <Worker agentId={null} initialWorkerAnalysis={[]} initialAnalysisActions={[]} />;
	}

	const agents = await elizaService.getClient().agents.listAgents();
	const agentId = agents.agents.find((agent) => agent.id === getWorkerAgentId(signedInUser.user.id))?.id;

	if (!agentId) {
		return <Worker agentId={null} initialWorkerAnalysis={[]} initialAnalysisActions={[]} />;
	}

	if (agents.agents.find((agent) => agent.id === agentId)?.status !== 'active') {
		await elizaService.getClient().agents.startAgent(agentId);
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
}

export default Page;
