import type { OpenRouterSecret } from '@/types/openrouter';
import { sanitizeUserId } from '@/lib/utils';

const KEYS = ['api_key', 'hash'];

/**
 * Build parameter name for user OpenRouter keys
 * @param username - The username of the user
 * @param basePrefix - The base prefix for the parameter name
 * @returns The parameter name for the user OpenRouter key
 */
export function getUserOpenRouterKeyPath(username: string, basePrefix = ''): string[] {
	const sanitizedUsername = sanitizeUserId(username);
	const keys: string[] = [];
	for (const key of KEYS) {
		keys.push(`${basePrefix}/openrouter/${sanitizedUsername}/${key}`);
	}
	return keys;
}

/**
 * Build parameter name for system OpenRouter keys (master keys, etc.)
 * @param keyPath - The path to the key
 * @param basePrefix - The base prefix for the parameter name
 * @returns The parameter name for the system OpenRouter key
 */
export function getSystemOpenRouterKeyPath(keyPath: string, basePrefix = ''): string {
	// If keyPath starts with '/', treat it as absolute path
	if (keyPath.startsWith('/')) {
		return `${basePrefix}${keyPath}`;
	}
	// Otherwise, treat it as relative to openrouter system keys
	return `${basePrefix}/openrouter/system/${keyPath}`;
}

/**
 * Get the related secret for a parameter name
 * @param parameterName - The parameter name
 * @param secret - The secret
 * @returns The related secret
 */
export function getRelatedSecret(parameterName: string, secret: OpenRouterSecret): string {
	return parameterName.includes('api_key') ? secret.apiKey : secret.hash;
}
