import type { UUID } from 'crypto';

interface AgentMessage {
	id: UUID;
	senderId: UUID;
	text: string;
	createdAt: Date;
	channelId: UUID;
	type?: string;
	source?: string;
	rawMessage?: unknown;
	updatedAt?: Date;
}

interface UseElizaChatParams {
	agentId?: string;
	channelId?: string;
}

interface UseElizaChatReturn {
	messages: AgentMessage[];
	isLoading: boolean;
	isAgentThinking: boolean;
	channelId: string | null;
	sendMessage: (content: string) => Promise<void>;
	clearMessages: () => Promise<void>;
	error: string | null;
	animatedMessageId: string | null;
}

export type { AgentMessage, UseElizaChatParams, UseElizaChatReturn };
