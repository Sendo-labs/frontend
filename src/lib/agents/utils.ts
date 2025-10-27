import { stringToUuid } from '@elizaos/core';
import { CHAT_AGENT_NAME, WORKER_AGENT_NAME } from '../constants';

export const getWorkerAgentId = (userId: string) => {
	return stringToUuid(`${userId}-${WORKER_AGENT_NAME}`);
};

export const getChatAgentId = (userId: string) => {
	return stringToUuid(`${userId}-${CHAT_AGENT_NAME}`);
};
