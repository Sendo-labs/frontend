'use server';

import { StorageFactory } from '@/factories/storage-factory';
import { sanitizeUserId } from '@/lib/utils';
import { withAction } from '@/lib/wrapper/with-action';
import { openRouterService } from '@/services/openrouter.service';
import type { OpenRouterSecret } from '@/types/openrouter';
import { getRelatedSecret, getUserOpenRouterKeyPath } from './utils';

/**
 * Create a new OpenRouter API key for a user
 * @param username - The username of the user to create the key for
 * @returns The created OpenRouter API key
 */
export async function createUserOpenRouterKey(userId: string) {
	return withAction<string>(async () => {
		const response = await openRouterService.createAPIKey({
			name: `${sanitizeUserId(userId)}-sendo-free`,
			limit: 20,
		});

		const result = await storeUserOpenRouterKey(sanitizeUserId(userId), {
			apiKey: response.key,
			hash: response.hash,
		});

		if (!result.success) {
			throw new Error('Failed to store OpenRouter API key');
		}

		return response.key;
	});
}

/**
 * Store OpenRouter API key for a user
 * @param username - The username of the user to store the key for
 * @param secret - The secret to store
 * @returns True if the key was stored, false if the key already exists
 */
export async function storeUserOpenRouterKey(userId: string, secret: OpenRouterSecret) {
	return withAction<void>(async () => {
		const parameterStore = StorageFactory.createParameterStore();
		const parameterNames = getUserOpenRouterKeyPath(sanitizeUserId(userId), parameterStore.getBasePrefix());
		for (const parameterName of parameterNames) {
			await parameterStore.storeParameter(
				parameterName,
				getRelatedSecret(parameterName, secret),
				`OpenRouter API key for ${sanitizeUserId(userId)}`,
			);
		}
	}, false);
}
