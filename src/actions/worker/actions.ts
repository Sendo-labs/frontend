'use server';

import type { RecommendedAction } from '@sendo-labs/plugin-sendo-worker';
import { getUserAgents } from '@/actions/agents/get';
import { WORKER_AGENT_NAME } from '@/lib/constants';
import { getWorkerAgentBaseUrl } from '@/lib/utils';
import { withAction } from '@/lib/wrapper/with-action';
import { createAgentService } from '@/services/agent.service';

/**
 * Accept worker actions
 * @param actions - The actions to accept
 * @param agentId - The agent ID (optional, will find worker agent if not provided)
 * @returns void
 */
export async function acceptWorkerActions(actions: RecommendedAction[], agentId?: string) {
	return withAction<void>(async (session) => {
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

		const agentService = createAgentService(String(agent.id), openRouterApiKey, baseUrl);
		await agentService.acceptActions(actions);
	});
}

/**
 * Reject worker actions
 * @param actions - The actions to reject
 * @param agentId - The agent ID (optional, will find worker agent if not provided)
 * @returns void
 */
export async function rejectWorkerActions(actions: RecommendedAction[], agentId?: string) {
	return withAction<void>(async (session) => {
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

		const agentService = createAgentService(String(agent.id), openRouterApiKey, baseUrl);
		await agentService.rejectActions(actions);
	});
}
