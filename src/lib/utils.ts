import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function createPageUrl(pageName: string) {
	return '/' + pageName.toLowerCase().replace(/ /g, '-');
}

export const getUserSecretName = (userId: string) => {
	const cleanedUserId = sanitizeUserId(userId);

	return `${cleanedUserId}`;
};

/**
 * Sanitize user id
 * @param userId - The raw user id (potentially with special chars)
 * @returns Sanitized user id
 */
export function sanitizeUserId(userId: string): string {
	// Extract the part after "did:privy:" if it exists, otherwise use the full userId
	const privyMatch = userId.match(/did:privy:(.+)/);
	const extractedId = privyMatch ? privyMatch[1] : userId;

	// Replace all invalid characters with hyphen
	// AWS SSM allows: letters, numbers, and . - _ /
	return extractedId.replace(/[^a-zA-Z0-9._\-\/]/g, '-');
}

/**
 * Get the worker agent base URL for a specific user
 * @param userId - The user ID (will be sanitized automatically)
 * @returns The base URL for the worker agent (e.g., https://user-id.agents.usekenny.com)
 */
export function getWorkerAgentBaseUrl(userId: string): string {
	const sanitized = sanitizeUserId(userId);
	return `https://${sanitized}.agents.usekenny.com`;
}
