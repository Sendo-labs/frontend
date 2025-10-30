'use server';

import ssmParameterService from '@/services/aws/ssm.service';
import { withAction } from '@/lib/wrapper/with-action';
import type { OpenRouterSecret } from '@/types/openrouter';
import { getRelatedSecret, getUserOpenRouterKeyPath } from './utils';
import { openRouterService } from '@/services/openrouter.service';
import { sanitizeUserId } from '@/lib/utils';

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
		const parameterNames = getUserOpenRouterKeyPath(sanitizeUserId(userId), ssmParameterService.getBasePrefix());
		for (const parameterName of parameterNames) {
			await ssmParameterService.storeParameter(
				parameterName,
				getRelatedSecret(parameterName, secret),
				`OpenRouter API key for ${sanitizeUserId(userId)}`,
			);
		}
	}, false);
}
