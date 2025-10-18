import { ApiClientConfig, ElizaClient } from '@elizaos/api-client';

/**
 * Create Eliza API client configuration
 * @returns {import('@elizaos/api-client').ApiClientConfig}
 */
export function createElizaClientConfig() {
	const apiKey = process.env.NEXT_PUBLIC_ELIZA_SERVER_AUTH_TOKEN; // TODO: Replace by a database fetch for authentication user
	const baseUrl = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL;

	console.log('apiKey', apiKey);
	console.log('baseUrl', baseUrl);

	if (!apiKey || !baseUrl) {
		throw new Error('NEXT_PUBLIC_ELIZA_SERVER_AUTH_TOKEN and NEXT_PUBLIC_ELIZA_SERVER_URL are required');
	}

	const config: ApiClientConfig = {
		baseUrl: baseUrl,
		timeout: 30000,
		headers: {
			Accept: 'application/json',
		},
	};

	// Include apiKey (X-API-KEY header)
	if (apiKey) {
		config.apiKey = apiKey;
	}

	return config;
}

// Singleton instance
let elizaClientInstance: ElizaClient | null = null;

/**
 * Get or create the Eliza client singleton instance
 * @returns {ElizaClient}
 */
export function getElizaClient() {
	if (!elizaClientInstance) {
		elizaClientInstance = ElizaClient.create(createElizaClientConfig());
	}
	return elizaClientInstance;
}

/**
 * Reset the Eliza client singleton (useful for API key changes)
 */
export function resetElizaClient() {
	elizaClientInstance = null;
}