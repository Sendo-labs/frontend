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
	// Replace all invalid characters with hyphen
	// AWS SSM allows: letters, numbers, and . - _ /
	return userId.replace(/[^a-zA-Z0-9._\-\/]/g, '-');
}
