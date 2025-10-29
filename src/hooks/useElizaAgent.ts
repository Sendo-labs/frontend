'use client';

import { useState, useEffect } from 'react';
import { elizaService } from '@/services/eliza.service';

interface Agent {
	id: string;
	name: string;
	[key: string]: unknown;
}

interface UseElizaAgentReturn {
	agent: Agent | null;
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to fetch the SENDO agent from Eliza server
 */
export function useElizaAgent(): UseElizaAgentReturn {
	const [agent, setAgent] = useState<Agent | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const elizaClient = elizaService.getClient();

	useEffect(() => {
		const fetchAgent = async () => {
			try {
				console.log('[useElizaAgent] Fetching SENDO agent...');
				const response = await elizaClient.agents.listAgents();
				console.log('[useElizaAgent] Raw response:', response);

				// Handle response format: could be {agents: [...]}, {data: {agents: [...]}} or {data: [...]}
				const agents =
					(response as unknown as { agents?: Agent[] }).agents ||
					(response as unknown as { data?: { agents?: Agent[] } }).data?.agents ||
					(response as unknown as { data?: Agent[] }).data ||
					[];
				console.log('[useElizaAgent] Agents found:', agents);

				// Get the first agent (SENDO)
				const sendoAgent = Array.isArray(agents) ? agents[0] : null;

				if (!sendoAgent) {
					throw new Error('SENDO agent not found. Make sure the Eliza server is running.');
				}

				console.log('[useElizaAgent] SENDO agent loaded:', sendoAgent.name);
				setAgent(sendoAgent);
				setError(null);
			} catch (err) {
				console.error('[useElizaAgent] Error fetching agent:', err);
				setError((err as Error).message || 'Failed to load SENDO agent');
			} finally {
				setIsLoading(false);
			}
		};

		fetchAgent();
	}, [elizaClient]);

	return { agent, isLoading, error };
}
