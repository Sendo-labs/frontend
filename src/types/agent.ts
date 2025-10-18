interface Message {
	id: string;
	senderId: string;
	text: string;
	createdAt: string;
	channelId: string;
	type?: string;
	source?: string;
	rawMessage?: unknown;
	updatedAt?: string;
}

interface UseElizaChatParams {
	agentId?: string;
	channelId?: string;
}

interface UseElizaChatReturn {
	messages: Message[];
	isLoading: boolean;
	isAgentThinking: boolean;
	channelId: string | null;
	sendMessage: (content: string) => Promise<void>;
	clearMessages: () => Promise<void>;
	error: string | null;
	animatedMessageId: string | null;
}

export type { Message, UseElizaChatParams, UseElizaChatReturn };
