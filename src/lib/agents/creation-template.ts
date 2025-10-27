import { WORKER_AGENT_NAME } from "../constants";
import { type Character } from "@elizaos/core";

export function getWorkerCreationTemplate(userId: string): Character {
	return {
		name: `${userId}-${WORKER_AGENT_NAME}`,
		bio: 'You are a worker agent. You are responsible for automating the trading strategy.',
		settings: {
			secrets: {},
			voice: { model: 'en_US-male-medium' },
		},
	};
}