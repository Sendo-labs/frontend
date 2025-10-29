'use server';

import { withAction } from '@/lib/wrapper/with-action';
import type { Character } from '@elizaos/core';
import { getUserAgents } from '@/actions/agents/get';
import { CHAT_AGENT_NAME } from '@/lib/constants';

/**
 * Get the chat agent for the authenticated user
 * @returns The chat agent or null if not found
 */
export async function getChatAgent() {
	return withAction<Character | null>(async () => {
		const agents = await getUserAgents();

		if (!agents.success || !agents.data) {
			return null;
		}

		// Find the chat agent by name
		const chatAgent = agents.data.find((agent) => agent.name === CHAT_AGENT_NAME);

		return chatAgent || null;
	});
}
