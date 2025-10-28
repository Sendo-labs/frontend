'use server';

import { withAction } from '@/lib/wrapper/with-action';
import type { RecommendedAction, AnalysisResult } from '@sendo-labs/plugin-sendo-worker';
import { WorkerClientService } from '@/services/worker-client.service';
import { KennyService } from '@/services/kenny.service';
import { getUserAgents } from '@/actions/agents/get';
import { WORKER_AGENT_NAME, KENNY_BASE_URL } from '@/lib/constants';

/**
 * Get all analyses for the worker agent
 * Automatically retrieves the OpenRouter API key from the agent configuration
 * @param agentId - The agent ID (optional, will find worker agent if not provided)
 * @returns The analyses
 */
export async function getWorkerAnalyses(agentId?: string) {
	return withAction<AnalysisResult[]>(async () => {
		// Get the worker agent
		const agents = await getUserAgents();
		if (!agents.success || !agents.data) {
			throw new Error('Failed to get user agents');
		}

		const agent = agentId 
			? agents.data.find((a) => String(a.id) === agentId)
			: agents.data.find((a) => a.name === WORKER_AGENT_NAME);

		if (!agent) {
			throw new Error('Worker agent not found');
		}

		const openRouterApiKey = (agent.settings?.secrets as Record<string, string>)?.OPENROUTER_API_KEY;
		if (!openRouterApiKey || typeof openRouterApiKey !== 'string') {
			throw new Error('OpenRouter API key not found');
		}

		const kennyService = KennyService.getInstance(KENNY_BASE_URL, openRouterApiKey);
		const workerClientService = new WorkerClientService(String(agent.id), kennyService);
		return await workerClientService.getAnalyses();
	});
}

/**
 * Get all actions for a specific analysis
 * Automatically retrieves the OpenRouter API key from the agent configuration
 * @param analysisId - The analysis ID
 * @param agentId - The agent ID (optional, will find worker agent if not provided)
 * @returns The actions
 */
export async function getWorkerActions(analysisId: string, agentId?: string) {
	return withAction<RecommendedAction[]>(async () => {
		// Get the worker agent
		const agents = await getUserAgents();
		if (!agents.success || !agents.data) {
			throw new Error('Failed to get user agents');
		}

		const agent = agentId 
			? agents.data.find((a) => String(a.id) === agentId)
			: agents.data.find((a) => a.name === WORKER_AGENT_NAME);

		if (!agent) {
			throw new Error('Worker agent not found');
		}

		const openRouterApiKey = (agent.settings?.secrets as Record<string, string>)?.OPENROUTER_API_KEY;
		if (!openRouterApiKey || typeof openRouterApiKey !== 'string') {
			throw new Error('OpenRouter API key not found');
		}

		const kennyService = KennyService.getInstance(KENNY_BASE_URL, openRouterApiKey);
		const workerClientService = new WorkerClientService(String(agent.id), kennyService);
		return await workerClientService.getActionsByAnalysisId(analysisId);
	});
}