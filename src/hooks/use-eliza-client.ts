'use client';

import type { ElizaClient } from '@elizaos/api-client';
import { useEffect, useState } from 'react';
import { getAnalyserOpenRouterApiKey } from '@/actions/openrouter/get';
import { ANALYSER_BASE_URL } from '@/lib/constants';
import { ElizaService } from '@/services/eliza.service';

/**
 * Hook to get the Eliza client instance for WebSocket and messaging operations
 * This is kept client-side since it's needed for real-time WebSocket connections
 */
export function useElizaClient() {
	const [client, setClient] = useState<ElizaClient | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const initClient = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const apiKeyResult = await getAnalyserOpenRouterApiKey();
				if (!apiKeyResult.success || !apiKeyResult.data) {
					throw new Error('Analyser OpenRouter API key not found');
				}

				const baseUrl = ANALYSER_BASE_URL;

				// Create ElizaService instance with analyzer credentials
				const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
				const newClient = elizaService.getClient();

				console.log('[useElizaClient] Initialized client for analyzer:', baseUrl);
				setClient(newClient);
			} catch (err) {
				console.error('[useElizaClient] Error initializing client:', err);
				setError((err as Error).message || 'Failed to initialize Eliza client');
			} finally {
				setIsLoading(false);
			}
		};

		initClient();
	}, []);

	return { client, isLoading, error };
}
