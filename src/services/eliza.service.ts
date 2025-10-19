import { ElizaClient } from '@elizaos/api-client';
import type { ApiClientConfig } from '@elizaos/api-client';

/**
 * ElizaService - Service class for managing Eliza API client
 * Provides a singleton pattern for Eliza client access and configuration
 */
class ElizaService {
	private static instance: ElizaService | null = null;
	private elizaClient: ElizaClient | null = null;
	private config: ApiClientConfig | null = null;

	private constructor() {
		// Private constructor to enforce singleton pattern
	}

	/**
	 * Get the singleton instance of ElizaService
	 */
	public static getInstance(): ElizaService {
		if (!ElizaService.instance) {
			ElizaService.instance = new ElizaService();
		}
		return ElizaService.instance;
	}

	/**
	 * Create Eliza API client configuration
	 * @returns {ApiClientConfig}
	 */
	private createClientConfig(): ApiClientConfig {
		const apiKey = process.env.NEXT_PUBLIC_ELIZA_SERVER_AUTH_TOKEN;
		const baseUrl = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL;

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

	/**
	 * Get or create the Eliza client instance
	 * @returns {ElizaClient}
	 */
	public getClient(): ElizaClient {
		if (!this.elizaClient) {
			this.config = this.createClientConfig();
			this.elizaClient = ElizaClient.create(this.config);
		}
		return this.elizaClient;
	}

	/**
	 * Get the current configuration
	 * @returns {ApiClientConfig | null}
	 */
	public getConfig(): ApiClientConfig | null {
		return this.config;
	}

	/**
	 * Get the base URL from environment variables
	 * @returns {string}
	 */
	public getBaseUrl(): string {
		const baseUrl = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL;
		if (!baseUrl) {
			throw new Error('NEXT_PUBLIC_ELIZA_SERVER_URL is not set');
		}
		return baseUrl;
	}

	/**
	 * Reset the Eliza client (useful for API key changes or configuration updates)
	 */
	public reset(): void {
		this.elizaClient = null;
		this.config = null;
	}

	/**
	 * Check if the client is initialized
	 * @returns {boolean}
	 */
	public isInitialized(): boolean {
		return this.elizaClient !== null;
	}
}

// Singleton instance
export const elizaService = ElizaService.getInstance();
