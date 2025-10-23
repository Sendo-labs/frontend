import type { UUID } from '@elizaos/core';

/**
 * Agent message
 */
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

/**
 * Parameters for useElizaChat hook
 */
interface UseElizaChatParams {
	agentId?: string;
	channelId?: string;
}

/**
 * Return type for useElizaChat hook
 */
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

/**
 * @deprecated Migrate to ElizaOS Message type when available.
 * Message broadcast from ElizaOS WebSocket
 */
interface MessageBroadcast {
	id: string;
	text: string;
	channelId: string;
	senderId: string;
	senderName: string;
	rawMessage?: {
		actions?: string[];
		content?: unknown;
	};
	metadata?: {
		actionId?: string;
		actionType?: string;
		source?: string;
	};
	content?: {
		actions?: string[];
		[key: string]: unknown;
	};
	createdAt: number;
}

export type { AgentMessage, UseElizaChatParams, UseElizaChatReturn, MessageBroadcast };
