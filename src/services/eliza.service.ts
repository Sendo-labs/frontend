import type { Agent, ApiClientConfig } from '@elizaos/api-client';
import { ElizaClient } from '@elizaos/api-client';
import type { Character } from '@elizaos/core';

/**
 * ElizaService - Service class for managing Eliza API client
 * Each service instance is tied to specific API credentials and base URL
 */
export class ElizaService {
	private elizaClient: ElizaClient | null = null;
	private config: ApiClientConfig;

	constructor(apiKey: string, baseUrl: string) {
		this.config = {
			baseUrl,
			apiKey,
		};
	}

	/**
	 * Create Eliza API client configuration
	 * @returns {ApiClientConfig}
	 */
	private createClientConfig(): ApiClientConfig {
		return {
			baseUrl: this.config.baseUrl,
			timeout: 30000,
			headers: { Accept: 'application/json' },
			apiKey: this.config.apiKey,
		};
	}

	getBaseUrl(): string {
		return this.config.baseUrl;
	}

	getConfig(): ApiClientConfig {
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
		this.config = {
			baseUrl: '',
			apiKey: '',
		};
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
			console.error(`[ElizaService] API request to ${url} failed:`, error);
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
