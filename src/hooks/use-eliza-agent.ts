'use client';

import { useEffect, useState } from 'react';
import { getChatAgent } from '@/actions/chat/get';

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

				throw new Error('Failed to load chat agent');
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
