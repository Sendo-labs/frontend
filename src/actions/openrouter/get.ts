'use server';

import { withAction } from '@/lib/wrapper/with-action';
import { StorageFactory } from '@/factories/storage-factory';
import type { OpenRouterSecret } from '@/types/openrouter';
import { getSystemOpenRouterKeyPath, getUserOpenRouterKeyPath } from './utils';

/**
 * Retrieve OpenRouter API key for a user
 * @param username - The username of the user to get the key for
 * @returns The OpenRouter API key if found, null otherwise
 */
export async function getUserOpenRouterKey(username: string) {
	return withAction<OpenRouterSecret | null>(async () => {
		const parameterStore = StorageFactory.createParameterStore();
		const parameterNames = getUserOpenRouterKeyPath(username, parameterStore.getBasePrefix());
		const apiKeyParameterName = parameterNames.find((name) => name.includes('api_key'));
		if (!apiKeyParameterName) {
			throw new Error(`API key parameter not found for user: ${username}`);
		}
		const apiKey = await parameterStore.getParameter<string>(apiKeyParameterName);
		if (!apiKey) {
			throw new Error(`API key not found for user: ${username}`);
		}
		const hashParameterName = parameterNames.find((name) => name.includes('hash'));
		if (!hashParameterName) {
			throw new Error(`Hash parameter not found for user: ${username}`);
		}
		const hash = await parameterStore.getParameter<string>(hashParameterName);
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
		const parameterStore = StorageFactory.createParameterStore();
		const parameterName = getSystemOpenRouterKeyPath(keyPath, parameterStore.getBasePrefix());
		const result = await parameterStore.getParameter<string>(parameterName);
		return result;
	}, false);
}

/**
 * Get the Analyser OpenRouter API key
 * This is a GLOBAL key shared by the whole project (for the analyzer agent).
 * In production: stored in AWS Parameter Store
 * In development: falls back to OPENROUTER_API_KEY environment variable
 *
 * @returns The Analyser OpenRouter API key if found, null otherwise
 */
export async function getAnalyserOpenRouterApiKey() {
	return withAction<string | null>(async () => {
		// Try to get from Parameter Store first
		const result = await getSystemOpenRouterKey('/openrouter/analyser/api_key');

		// If found in Parameter Store, use it
		if (result.success && result.data) {
			return result.data;
		}

		// Fallback to environment variable for local development
		// This allows the global analyzer key to come from .env.local
		const envKey = process.env.OPENROUTER_API_KEY;
		if (envKey) {
			console.log('[Storage] Using global OPENROUTER_API_KEY from environment variable');
			return envKey;
		}

		// No analyzer key available - analyzer features will be disabled
		console.warn('[Storage] Analyser OpenRouter API key not found - analyzer features will be disabled');
		return null;
	}, false);
}
