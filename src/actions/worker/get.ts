'use server';

import type { AnalysisResult, RecommendedAction } from '@sendo-labs/plugin-sendo-worker';
import { getUserAgents } from '@/actions/agents/get';
import { WORKER_AGENT_NAME } from '@/lib/constants';
import { getWorkerAgentBaseUrl } from '@/lib/utils';
import { withAction } from '@/lib/wrapper/with-action';
import { ElizaService } from '@/services/eliza.service';
import { WorkerClientService } from '@/services/worker-client.service';

/**
 * Get all analyses for the worker agent
 * Automatically retrieves the OpenRouter API key from the agent configuration
 * @param agentId - The agent ID (optional, will find worker agent if not provided)
 * @returns The analyses
 */
export async function getWorkerAnalyses(agentId?: string) {
	return withAction<AnalysisResult[]>(async (session) => {
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

		const baseUrl = getWorkerAgentBaseUrl(session.user.id);
		const elizaService = new ElizaService(openRouterApiKey, baseUrl);
		const workerClientService = new WorkerClientService(String(agent.id), elizaService);
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
	return withAction<RecommendedAction[]>(async (session) => {
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

		const baseUrl = getWorkerAgentBaseUrl(session.user.id);
		const elizaService = new ElizaService(openRouterApiKey, baseUrl);
		const workerClientService = new WorkerClientService(String(agent.id), elizaService);
		return await workerClientService.getActionsByAnalysisId(analysisId);
	});
}
