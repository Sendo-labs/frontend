import type { Character } from '@elizaos/core';
import { getWorkerAgentId } from './utils';
import { WORKER_CHARACTER } from './worker/character';

export function getWorkerCreationTemplate(userId: string): Character {
	return {
		...WORKER_CHARACTER,
		id: getWorkerAgentId(userId),
	};
}
