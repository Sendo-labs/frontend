'use server';

import { withAction } from '@/lib/wrapper/with-action';
import { CHAT_CHARACTER } from '@/lib/agents/chat/character';
import { createAgent } from '@/actions/agents/create';

/**
 * Create a new chat agent for the authenticated user
 * @returns The created agent
 */
export async function createChatAgent() {
	return withAction<void>(async () => {
		const result = await createAgent(CHAT_CHARACTER);
		
		if (!result.success) {
			throw new Error(result.error || 'Failed to create chat agent');
		}
	});
}

