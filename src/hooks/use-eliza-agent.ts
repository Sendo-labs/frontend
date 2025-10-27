'use client';

import { useEffect, useState } from 'react';
import { elizaService } from '@/services/eliza.service';
import { CHAT_CHARACTER } from '@/lib/agents/chat/character';

interface LocalAgent {
	id: string;
	name: string;
	[key: string]: unknown;
}

interface UseElizaAgentParams {
	userId: string | null;
}

interface UseElizaAgentReturn {
	agent: LocalAgent | null;
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to fetch or create the chat agent for a specific user
 */
export function useElizaAgent({ userId }: UseElizaAgentParams): UseElizaAgentReturn {
	const [agent, setAgent] = useState<LocalAgent | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const elizaClient = elizaService.getClient();

	useEffect(() => {
		if (!userId) {
			setIsLoading(false);
			return;
		}

		const fetchOrCreateAgent = async () => {
			try {
				console.log('[useElizaAgent] Fetching or creating chat agent for user:', userId);

				// First, try to list all agents and find an existing chat agent
				const response = await elizaClient.agents.listAgents();
				console.log('[useElizaAgent] Raw response:', response);

				// Handle response format: could be {agents: [...]}, {data: {agents: [...]}} or {data: [...]}
				const allAgents =
					(response as unknown as { agents?: LocalAgent[] }).agents ||
					(response as unknown as { data?: { agents?: LocalAgent[] } }).data?.agents ||
					(response as unknown as { data?: LocalAgent[] }).data ||
					[];
				console.log('[useElizaAgent] All agents found:', allAgents);

				// Try to find existing chat agent by name
				const chatAgent = Array.isArray(allAgents) ? allAgents.find((a) => a.name === 'sendo-chat') : null;

				if (chatAgent) {
					console.log('[useElizaAgent] Found existing chat agent:', chatAgent.name);
					setAgent(chatAgent);
					setError(null);
					setIsLoading(false);
					return;
				}

				// No agent found, create it
				console.log('[useElizaAgent] Creating new chat agent...');
				const newAgent = await elizaService.createAgent(CHAT_CHARACTER);
				console.log('[useElizaAgent] Agent created:', newAgent.name, 'ID:', newAgent.id);
				setAgent(newAgent as unknown as LocalAgent);
				setError(null);
			} catch (err) {
				console.error('[useElizaAgent] Error fetching/creating agent:', err);
				setError((err as Error).message || 'Failed to load chat agent');
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrCreateAgent();
	}, [userId, elizaClient]);

	return { agent, isLoading, error };
}
