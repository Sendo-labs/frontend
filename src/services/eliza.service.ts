import { ElizaClient } from '@elizaos/api-client';
import type { Agent, ApiClientConfig } from '@elizaos/api-client';
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

	/**
	 * Make a request to the Eliza API using fetch including the API key in the headers
	 * @param {string} path - The path to the API endpoint
	 * @param {string} method - The HTTP method to use
	 * @param {any} body - The body of the request
	 * @returns {Promise<T>} - The response from the API
	 */
	public async apiRequest<T>(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
		body?: any,
	): Promise<T> {
		const config = this.getConfig();
		if (!config) {
			throw new Error('Eliza client is not initialized');
		}
		try {
			const response = await fetch(`${config.baseUrl}${path}`, {
				method,
				headers: new Headers({
					'Content-Type': 'application/json',
					'X-API-KEY': config.apiKey || '',
				}),
				body: JSON.stringify(body),
			});
			if (!response.ok) {
				throw new Error(`Failed to make API request to ${path}: ${response.statusText}`);
			}
			return response.json() as Promise<T>;
		} catch (error) {
			console.error(`[ElizaService] Failed to make API request to ${path}:`, error);
			throw error;
		}
	}

	/**
	 * Create a new agent
	 * @param {Character} character - The character to create the agent from
	 * @returns {Promise<Agent>} - The created agent
	 */
	public async createAgent(character: Character): Promise<Agent> {
		try {
			const response = await this.getClient()?.agents.createAgent({
				characterJson: character,
			});
			if (!response) {
				throw new Error('Failed to create agent');
			}
			return response;
		} catch (error) {
			console.error('[ElizaService] Failed to create agent:', error);
			throw error;
		}
	}
}

// Singleton instance
export const elizaService = ElizaService.getInstance();
