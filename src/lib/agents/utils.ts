import { stringToUuid } from "@elizaos/core";
import { WORKER_AGENT_NAME } from "../constants";

export const getWorkerAgentId = (userId: string) => {
	return stringToUuid(`${userId}-${WORKER_AGENT_NAME}`);
};