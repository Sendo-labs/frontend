import { stringToUuid } from '@elizaos/core';
import { ANALYSER_AGENT_NAME, WORKER_AGENT_NAME } from '../constants';

export const getWorkerAgentId = (userId: string) => {
	return stringToUuid(`${userId}-${WORKER_AGENT_NAME}`);
};

export const getAnalyserAgentId = (userId: string) => {
	return stringToUuid(`${userId}-${ANALYSER_AGENT_NAME}`);
};
