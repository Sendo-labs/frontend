import { z } from 'zod';
import { getSystemOpenRouterKey } from '@/actions/openrouter/get';
import { apiKeyResponseSchema, createApiKeySchema } from '@/schemas/openrouter';

export class OpenRouterServiceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'OpenRouterServiceError';
	}
}

export interface OpenRouterAPIKey {
	key: string;
	name: string;
	label: string;
	limit: number | null;
	disabled: boolean;
	createdAt: string;
	updatedAt: string; // Always string after processing (fallback to createdAt if null)
	hash: string;
}

export interface CreateApiKeyOptions {
	name: string;
	limit?: number;
}

export class OpenRouterService {
	private apiKey: string | null = null;
	private baseUrl: string;

	constructor(apiKey?: string) {
		if (apiKey) {
			this.apiKey = apiKey;
		}
		this.baseUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1';
	}

	/**
	 * Ensure API key is loaded from SSM or provided
	 */
	private async ensureApiKey(): Promise<string> {
		if (this.apiKey) {
			return this.apiKey;
		}

		const result = await getSystemOpenRouterKey('/openrouter/provisioning_api_key');
		if (!result.success || !result.data) {
			throw new OpenRouterServiceError('OpenRouter master API key not found in SSM Parameter Store');
		}

		this.apiKey = result.data;
		return this.apiKey;
	}

	private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
		const apiKey = await this.ensureApiKey();
		const headers = {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://app.usekenny.com',
			'X-Title': 'Kenny AI Agent Manager',
			...options.headers,
		};

		return fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers,
		});
	}

	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage: string;

			try {
				const errorJson = JSON.parse(errorText);
				errorMessage = errorJson.error?.message || errorJson.message || errorText;
			} catch {
				errorMessage = errorText;
			}

			throw new OpenRouterServiceError(`OpenRouter API error (${response.status}): ${errorMessage}`);
		}

		const data = await response.json();
		return data as T;
	}

	/**
	 * Gets the API key for the OpenRouter service
	 * @returns The API key
	 */
	async getAPIKey() {
		return this.ensureApiKey();
	}

	/**
	 * Creates a new API key for a user
	 * @param options Options for creating the API key
	 * @returns The created API key details
	 */
	async createAPIKey(options: CreateApiKeyOptions): Promise<OpenRouterAPIKey> {
		try {
			// Validate input
			const validatedOptions = createApiKeySchema.parse(options);

			const body: {
				name: string;
				limit?: number;
			} = {
				name: validatedOptions.name,
			};

			if (validatedOptions.limit !== undefined) {
				body.limit = validatedOptions.limit;
			}

			const response = await this.fetchWithAuth('/keys', {
				method: 'POST',
				body: JSON.stringify(body),
			});

			const data = await this.handleResponse<z.infer<typeof apiKeyResponseSchema>>(response);
			const validatedResponse = apiKeyResponseSchema.parse(data);

			return {
				key: validatedResponse.key,
				name: validatedResponse.data.name,
				label: validatedResponse.data.label,
				limit: validatedResponse.data.limit,
				disabled: validatedResponse.data.disabled,
				createdAt: validatedResponse.data.created_at,
				// If updated_at is null (first creation), use created_at as fallback
				updatedAt: validatedResponse.data.updated_at || validatedResponse.data.created_at,
				hash: validatedResponse.data.hash,
			};
		} catch (error: unknown) {
			if (error instanceof z.ZodError) {
				throw new OpenRouterServiceError(`Validation error: ${error.message}`);
			}
			if (error instanceof OpenRouterServiceError) {
				throw error;
			}
			throw new OpenRouterServiceError(
				`Failed to create API key: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	/**
	 * Validates an API key by making a test request
	 * @param apiKey The API key to validate
	 * @returns True if the key is valid
	 */
	async validateAPIKey(apiKey: string): Promise<boolean> {
		try {
			const testService = new OpenRouterService(apiKey);
			const response = await testService.fetchWithAuth('/auth/key');

			if (!response.ok) {
				return false;
			}

			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Gets the current usage for an API key
	 * @returns Current usage information
	 */
	async getUsage(): Promise<{ usage: number; limit: number | null }> {
		try {
			const response = await this.fetchWithAuth('/auth/key');
			const data = await this.handleResponse<{ usage?: number; limit?: number | null }>(response);

			return {
				usage: data.usage || 0,
				limit: data.limit || null,
			};
		} catch (error: unknown) {
			if (error instanceof OpenRouterServiceError) {
				throw error;
			}
			throw new OpenRouterServiceError(
				`Failed to get usage: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	/**
	 * Updates the limit and optionally the name for an existing API key
	 * @param keyHash The API key hash (not the key itself)
	 * @param newLimit The new limit in dollars
	 * @param newName Optional new name for the key
	 * @returns The updated key information
	 */
	async updateAPIKeyLimit(keyHash: string, newLimit: number, newName?: string): Promise<{ success: boolean }> {
		try {
			const body: {
				limit: number;
				name?: string;
			} = {
				limit: newLimit,
			};

			// Add name to update if provided
			if (newName) {
				body.name = newName;
			}

			const response = await this.fetchWithAuth(`/keys/${keyHash}`, {
				method: 'PATCH',
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new OpenRouterServiceError(`Failed to update API key limit (${response.status})`);
			}

			return { success: true };
		} catch (error: unknown) {
			if (error instanceof OpenRouterServiceError) {
				throw error;
			}
			throw new OpenRouterServiceError(
				`Failed to update API key limit: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	/**
	 * Gets information about a specific API key
	 * @param keyId The API key ID
	 * @returns Key information
	 */
	async getAPIKeyInfo(keyId: string): Promise<{ id: string; limit: number | null; usage: number }> {
		try {
			const response = await this.fetchWithAuth(`/keys/${keyId}`);
			const data = await this.handleResponse<{ id: string; limit: number | null; usage: number }>(response);

			return {
				id: data.id,
				limit: data.limit,
				usage: data.usage,
			};
		} catch (error: unknown) {
			if (error instanceof OpenRouterServiceError) {
				throw error;
			}
			throw new OpenRouterServiceError(
				`Failed to get API key info: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	/**
	 * Lists available models
	 * @returns List of available models
	 */
	async listModels(): Promise<Array<{ id: string; name: string; [key: string]: unknown }>> {
		try {
			const response = await this.fetchWithAuth('/models');
			const data = await this.handleResponse<{
				data: Array<{ id: string; name: string; [key: string]: unknown }>;
			}>(response);
			return data.data;
		} catch (error: unknown) {
			if (error instanceof OpenRouterServiceError) {
				throw error;
			}
			throw new OpenRouterServiceError(
				`Failed to list models: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}
}

export const openRouterService = new OpenRouterService();
