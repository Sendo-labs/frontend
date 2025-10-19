import type { Metadata } from 'next';
import Worker from './client';
import { QueryBoundary } from '@/components/shared/query-boundary';
import { elizaService } from '@/services/eliza.service';
import { WorkerClientService } from '@/services/worker-client.service';
import { WORKER_AGENT_NAME } from '@/lib/constants';

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
	const agents = await elizaService.getClient().agents.listAgents();
	const agentId = agents.agents.find((agent) => agent.name === WORKER_AGENT_NAME)?.id;
	if (!agentId) {
		throw new Error('WORKER agent not found');
	}
	const workerClientService = new WorkerClientService(agentId);
	const workerAnalysis = await workerClientService.getWorkerAnalysis();
	if (workerAnalysis.length > 0) {
		const analysisActions = await workerClientService.getWorkerActionsByAnalysisId(workerAnalysis[0].id);
		return <Worker agentId={agentId} initialWorkerAnalysis={workerAnalysis} initialAnalysisActions={analysisActions} />;
	}
	return <Worker agentId={agentId} initialWorkerAnalysis={[]} initialAnalysisActions={[]} />;
}

export default Page;
