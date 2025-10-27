import type { Agent, ApiClientConfig } from '@elizaos/api-client';
import { ElizaClient } from '@elizaos/api-client';
import type { Character } from '@elizaos/core';

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
		const { apiKey, baseUrl } = this.getEnvConfig();

		return {
			baseUrl,
			timeout: 30000,
			headers: { Accept: 'application/json' },
			...(apiKey && { apiKey }),
		};
	}

	private getEnvConfig(): { apiKey: string; baseUrl: string } {
		const apiKey = process.env.NEXT_PUBLIC_ELIZA_SERVER_AUTH_TOKEN;
		const baseUrl = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL;

		if (!apiKey || !baseUrl) {
			throw new Error(
				'Missing environment variables: NEXT_PUBLIC_ELIZA_SERVER_AUTH_TOKEN and NEXT_PUBLIC_ELIZA_SERVER_URL are required',
			);
		}

		return { apiKey, baseUrl };
	}

	getBaseUrl(): string {
		return this.getEnvConfig().baseUrl;
	}

	getConfig(): ApiClientConfig | null {
		return this.config;
	}

	getClient(): ElizaClient {
		if (!this.elizaClient) {
			this.config = this.createClientConfig();
			this.elizaClient = ElizaClient.create(this.config);
		}
		return this.elizaClient;
	}

	isInitialized(): boolean {
		return this.elizaClient !== null;
	}

	reset(): void {
		this.elizaClient = null;
		this.config = null;
	}

	/**
	 * Make a request to the Eliza API using fetch including the API key in the headers
	 * @param {string} path - The path to the API endpoint
	 * @param {string} method - The HTTP method to use
	 * @param {any} body - The body of the request
	 * @returns {Promise<T>} - The response from the API
	 */
	async apiRequest<T>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: any): Promise<T> {
		const config = this.config || this.createClientConfig();
		const url = `${config.baseUrl}${path}`;

		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					'X-API-KEY': config.apiKey || '',
				},
				...(body && { body: JSON.stringify(body) }),
			});

			if (!response.ok) {
				throw new Error(`API request failed: ${response.status} ${response.statusText}`);
			}

			return response.json() as Promise<T>;
		} catch (error) {
			console.error(`[ElizaService] API request to ${path} failed:`, error);
			throw error;
		}
	}

	/**
	 * Create and start a new agent
	 * @param {Character} character - The character to create the agent from
	 * @returns {Promise<Agent>} - The created agent
	 */
	async createAgent(character: Character): Promise<Agent> {
		try {
			const agent = await this.getClient().agents.createAgent({
				characterJson: character,
			});

			if (!agent) {
				throw new Error('Failed to create agent');
			}

			const startResponse = await this.getClient().agents.startAgent(agent.id);

			if (!startResponse?.status) {
				throw new Error(`Failed to start agent ${agent.id}`);
			}

			return agent;
		} catch (error) {
			console.error('[ElizaService] Agent creation failed:', error);
			throw error;
		}
	}
}

export const elizaService = ElizaService.getInstance();
