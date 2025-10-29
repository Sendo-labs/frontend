'use server';

import { withAction } from '@/lib/wrapper/with-action';
import type { Character } from '@elizaos/core';
import secretManagerService from '@/services/aws/secret-manager.service';

/**
 * Get the analyzer agent (global)
 * @returns The analyzer agent or null if not found
 */
export async function getAnalyzer() {
	return withAction<Character | null>(async () => {
		const analyserAgent = await secretManagerService.getSecret("analyser");
		if (!analyserAgent) {
			return null;
		}

		return JSON.parse(analyserAgent) as Character;
	});
}