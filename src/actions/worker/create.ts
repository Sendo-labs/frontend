'use server';

import { createAgent } from '@/actions/agents/create';
import { getWorkerCreationTemplate } from '@/lib/agents/creation-template';
import { withAction } from '@/lib/wrapper/with-action';

/**
 * Create a new worker agent
 * @param userId - The user ID
 * @returns void
 */
export async function createWorkerAgent(userId: string) {
	return withAction<void>(async () => {
		const character = getWorkerCreationTemplate(userId);
		const result = await createAgent(character);

		if (!result.success) {
			throw new Error(result.error || 'Failed to create worker agent');
		}
	});
}
