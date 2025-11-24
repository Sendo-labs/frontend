'use server';

import type { Character } from '@elizaos/core';
import { withAction } from '@/lib/wrapper/with-action';
import { getUserSecret } from '../secrets/get';

export async function getUserAgents() {
	return withAction<Character[] | null>(async () => {
		const userSecret = await getUserSecret();
		if (!userSecret.success || userSecret.data === null || !userSecret.data) {
			return null;
		}

		const data = userSecret.data;
		const agents = Object.keys(data);
		return agents.map((agent) => {
			const agentData = data[agent];
			if (!agentData) {
				throw new Error(`Agent data not found for key: ${agent}`);
			}
			return JSON.parse(agentData) as Character;
		});
	});
}
