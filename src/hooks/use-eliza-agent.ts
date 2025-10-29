'use client';

import { useEffect, useState } from 'react';
import { getChatAgent } from '@/actions/chat/get';
import { createChatAgent } from '@/actions/chat/create';

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

	useEffect(() => {
		if (!userId) {
			setIsLoading(false);
			return;
		}

		const fetchOrCreateAgent = async () => {
			try {
				console.log('[useElizaAgent] Fetching or creating chat agent for user:', userId);

				// First, try to get existing chat agent
				const result = await getChatAgent();

				if (result.success && result.data) {
					console.log('[useElizaAgent] Found existing chat agent:', result.data.name);
					setAgent(result.data as unknown as LocalAgent);
					setError(null);
					setIsLoading(false);
					return;
				}

				// No agent found, create it
				console.log('[useElizaAgent] Creating new chat agent...');
				const createResult = await createChatAgent();

				if (!createResult.success) {
					throw new Error(createResult.error || 'Failed to create chat agent');
				}

				// Fetch the newly created agent
				const newAgentResult = await getChatAgent();
				if (newAgentResult.success && newAgentResult.data) {
					console.log('[useElizaAgent] Agent created:', newAgentResult.data.name, 'ID:', newAgentResult.data.id);
					setAgent(newAgentResult.data as unknown as LocalAgent);
					setError(null);
				} else {
					throw new Error('Failed to fetch newly created agent');
				}
			} catch (err) {
				console.error('[useElizaAgent] Error fetching/creating agent:', err);
				setError((err as Error).message || 'Failed to load chat agent');
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrCreateAgent();
	}, [userId]);

	return { agent, isLoading, error };
}
