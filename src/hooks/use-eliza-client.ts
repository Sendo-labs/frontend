'use client';

import { ElizaClient, type ApiClientConfig } from '@elizaos/api-client';
import { useMemo } from 'react';

/**
 * Hook to get the Eliza client instance for WebSocket and messaging operations
 * This is kept client-side since it's needed for real-time WebSocket connections
 */
export function useElizaClient() {
	const client = useMemo(() => {
		const apiKey = process.env.NEXT_PUBLIC_ELIZA_SERVER_AUTH_TOKEN;
		const baseUrl = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL;

		if (!apiKey || !baseUrl) {
			throw new Error(
				'Missing environment variables: NEXT_PUBLIC_ELIZA_SERVER_AUTH_TOKEN and NEXT_PUBLIC_ELIZA_SERVER_URL are required',
			);
		}

		const config: ApiClientConfig = {
			baseUrl,
			timeout: 30000,
			headers: { Accept: 'application/json' },
			apiKey,
		};

		return ElizaClient.create(config);
	}, []);

	return client;
}

