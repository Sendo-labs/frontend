'use server';

import { withAction } from '@/lib/wrapper/with-action';
import ssmParameterService from '@/services/aws/ssm.service';
import type { OpenRouterSecret } from '@/types/openrouter';
import { getSystemOpenRouterKeyPath, getUserOpenRouterKeyPath } from './utils';

/**
 * Retrieve OpenRouter API key for a user
 * @param username - The username of the user to get the key for
 * @returns The OpenRouter API key if found, null otherwise
 */
export async function getUserOpenRouterKey(username: string) {
	return withAction<OpenRouterSecret | null>(async () => {
		const parameterNames = getUserOpenRouterKeyPath(username, ssmParameterService.getBasePrefix());
		const apiKeyParameterName = parameterNames.find((name) => name.includes('api_key'));
		if (!apiKeyParameterName) {
			throw new Error(`API key parameter not found for user: ${username}`);
		}
		const apiKey = await ssmParameterService.getParameter<string>(apiKeyParameterName);
		if (!apiKey) {
			throw new Error(`API key not found for user: ${username}`);
		}
		const hashParameterName = parameterNames.find((name) => name.includes('hash'));
		if (!hashParameterName) {
			throw new Error(`Hash parameter not found for user: ${username}`);
		}
		const hash = await ssmParameterService.getParameter<string>(hashParameterName);
		if (!hash) {
			throw new Error(`Hash not found for user: ${username}`);
		}
		return {
			apiKey,
			hash,
		};
	}, false);
}

/**
 * Retrieve system OpenRouter API key
 * @param keyPath - The path to the key
 * @returns The OpenRouter API key if found, null otherwise
 */
export async function getSystemOpenRouterKey(keyPath: string) {
	return withAction<string | null>(async () => {
		const parameterName = getSystemOpenRouterKeyPath(keyPath, ssmParameterService.getBasePrefix());
		const result = await ssmParameterService.getParameter<string>(parameterName);
		return result;
	}, false);
}

/**
 * Check if OpenRouter key exists for user
 * @param username - The username of the user to check the key for
 * @returns True if the key exists, false otherwise
 */
export async function hasOpenRouterKey(username: string) {
	return withAction<boolean>(async () => {
		const parameterNames = getUserOpenRouterKeyPath(username, ssmParameterService.getBasePrefix());
		for (const parameterName of parameterNames) {
			const result = await ssmParameterService.hasParameter(parameterName);
			if (result) {
				return true;
			}
		}
		return false;
	}, false);
}

/**
 * Get the Analyser OpenRouter API key
 * @returns The Analyser OpenRouter API key if found, null otherwise
 */
export async function getAnalyserOpenRouterApiKey() {
	return withAction<string | null>(async () => {
		const result = await getSystemOpenRouterKey('/openrouter/analyser/api_key');
		if (!result.success || !result.data) {
			throw new Error('Analyser OpenRouter API key not found in SSM Parameter Store');
		}
		return result.data;
	}, false);
}