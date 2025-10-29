'use client';

import type { Message } from '@elizaos/api-client';
import type { UUID } from 'crypto';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { AgentMessage, UseElizaChatParams, UseElizaChatReturn } from '@/types/agent';
import { stringToUuid } from '@elizaos/core';
import { useElizaClient } from './use-eliza-client';

/**
 * Hook to manage chat with an Eliza agent
 */
export function useElizaChat({ agentId, channelId: initialChannelId, userId }: UseElizaChatParams): UseElizaChatReturn {
	const [messages, setMessages] = useState<AgentMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isAgentThinking, setIsAgentThinking] = useState(false);
	const [channelId, setChannelId] = useState<string | null>(initialChannelId || null);
	const [serverId, setServerId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [animatedMessageId, setAnimatedMessageId] = useState<string | null>(null);
	const socketRef = useRef<Socket | null>(null);
	const elizaClient = useElizaClient();

	// Debug: Log when messages change
	useEffect(() => {
		console.log('[useElizaChat] Messages state updated. Count:', messages.length, 'Messages:', messages);
	}, [messages]);

	// Create or get DM channel
	useEffect(() => {
		if (!agentId) return;

		const initChannel = async () => {
			try {
				if (!channelId) {
					// Create a new DM channel
					console.log('[useElizaChat] Creating new DM channel for agent:', agentId);

					// For DM channels, we need the current user ID (must be a valid UUID)
					if (!userId) {
						throw new Error('User ID is required to create DM channel');
					}

					const channel = await elizaClient.messaging.getOrCreateDmChannel({
						participantIds: [stringToUuid(userId), agentId as UUID],
					});

					console.log('[useElizaChat] Channel created:', channel.id);
					setChannelId(channel.id);

					// Use a default serverId for DM channels (null UUID represents the default server)
					setServerId('00000000-0000-0000-0000-000000000000');
					console.log('[useElizaChat] Server ID set to default');
				}
			} catch (err) {
				console.error('[useElizaChat] Error creating channel:', err);
				setError((err as Error).message || 'Failed to create channel');
			}
		};

		initChannel();
	}, [agentId, channelId, userId, elizaClient]);

	// Load existing messages
	useEffect(() => {
		if (!channelId) return;

		const loadMessages = async () => {
			try {
				console.log('[useElizaChat] Loading messages for channel:', channelId);
				const response = await elizaClient.messaging.getChannelMessages(channelId as UUID, {
					limit: 50,
				});

				console.log('[useElizaChat] Messages loaded:', response.messages?.length || 0);
				console.log('[useElizaChat] Raw messages from API:', response.messages);

				// Normalize messages to match our expected format
				const normalizedMessages: AgentMessage[] = (response.messages || []).map((msg: Message) => ({
					id: msg.id,
					senderId: msg.authorId,
					text: msg.content,
					createdAt: msg.createdAt,
					channelId: msg.channelId,
					type: msg.metadata?.type as string | undefined,
					source: msg.sourceType,
					rawMessage: msg.rawMessage,
				}));

				// Set default serverId if not already set
				if (!serverId) {
					setServerId('00000000-0000-0000-0000-000000000000');
					console.log('[useElizaChat] Server ID set to default from messages');
				}

				// Sort messages by createdAt to ensure chronological order (oldest first)
				normalizedMessages.sort((a, b) => {
					const dateA = new Date(a.createdAt).getTime();
					const dateB = new Date(b.createdAt).getTime();
					return dateA - dateB;
				});

				console.log('[useElizaChat] Normalized messages:', normalizedMessages);
				setMessages(normalizedMessages);
			} catch (err) {
				console.error('[useElizaChat] Error loading messages:', err);
				setError((err as Error).message || 'Failed to load messages');
			}
		};

		loadMessages();
	}, [channelId, elizaClient, serverId]);

	// Setup WebSocket for real-time messages
	useEffect(() => {
		if (!channelId) return;

		const serverUrl = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL || 'http://localhost:3000';
		console.log('[useElizaChat] Connecting to WebSocket:', serverUrl);

		const socket = io(serverUrl, {
			transports: ['websocket', 'polling'],
		});

		socketRef.current = socket;

		socket.on('connect', () => {
			console.log('[useElizaChat] WebSocket connected, socket ID:', socket.id);
			console.log('[useElizaChat] Joining channel:', channelId);

			if (!userId) {
				console.error('[useElizaChat] Cannot join channel without userId');
				return;
			}

			// Use the same format as the official Eliza client
			// SOCKET_MESSAGE_TYPE.ROOM_JOINING = 1
			const roomJoiningPayload: any = {
				channelId: channelId,
				roomId: channelId, // For backward compatibility
				entityId: stringToUuid(userId),
			};

			// Add serverId if available
			if (serverId) {
				roomJoiningPayload.serverId = serverId;
			}

			socket.emit('message', {
				type: 1,
				payload: roomJoiningPayload,
			});

			console.log('[useElizaChat] Emitted ROOM_JOINING event for channel:', channelId);
		});

		socket.on('disconnect', () => {
			console.log('[useElizaChat] WebSocket disconnected');
		});

		// Listen for message broadcasts (both user and agent messages)
		socket.on('messageBroadcast', (data: any) => {
			console.log('[useElizaChat] Message broadcast received:', data.id, data.source);

			// Format the message to match our expected structure
			const formattedMessage: AgentMessage = {
				id: data.id,
				senderId: data.senderId,
				text: data.text,
				createdAt:
					typeof data.createdAt === 'number'
						? new Date(data.createdAt).toISOString()
						: data.createdAt || new Date().toISOString(),
				channelId: data.channelId || data.roomId,
				type: data.type,
				source: data.source || data.source_type || data.sourceType,
				rawMessage: data.raw_message || data.rawMessage,
			};

			console.log('[useElizaChat] Formatted message:', formattedMessage);

			setMessages((prev) => {
				// Check if message already exists
				const existingIndex = prev.findIndex((m) => m.id === formattedMessage.id);
				const isNewMessage = existingIndex === -1;

				if (existingIndex !== -1) {
					// Message exists - check if we should update it
					const existingMessage = prev[existingIndex];
					const existingUpdatedAt = existingMessage.updatedAt || existingMessage.createdAt;
					const newUpdatedAt = data.updatedAt || data.createdAt;

					// Update if the new message has a more recent updatedAt timestamp
					if (
						newUpdatedAt &&
						(!existingUpdatedAt ||
							newUpdatedAt >
								(existingUpdatedAt ? new Date(existingUpdatedAt).getTime() : new Date(existingUpdatedAt).getTime()))
					) {
						console.log('[useElizaChat] Updating existing message:', formattedMessage.id);
						const updatedMessages = [...prev];
						updatedMessages[existingIndex] = {
							...existingMessage,
							...formattedMessage,
							updatedAt: typeof newUpdatedAt === 'number' ? new Date(newUpdatedAt).toISOString() : newUpdatedAt,
						};
						return updatedMessages;
					} else {
						console.log('[useElizaChat] Message already up-to-date:', formattedMessage.id);
						return prev;
					}
				}

				// New message - add it
				console.log('[useElizaChat] Adding new message to state');

				// If this is a NEW message from the agent (not action), mark it for animation
				if (isNewMessage && data.senderId === agentId) {
					console.log('[useElizaChat] Agent response received, stopping thinking indicator');
					setIsAgentThinking(false);

					// Only animate text messages, not action messages
					const isActionMessage =
						formattedMessage.type === 'agent_action' || formattedMessage.source === 'agent_action';
					if (!isActionMessage && formattedMessage.text) {
						setAnimatedMessageId(formattedMessage.id);
					}
				}

				return [...prev, formattedMessage];
			});
		});

		// Listen for message acknowledgments
		socket.on('messageAck', (data: any) => {
			console.log('[useElizaChat] Message acknowledged:', data);
			setIsLoading(false);
			setIsAgentThinking(true); // Agent is now processing
		});

		// Listen for message completion (agent finished responding)
		socket.on('messageComplete', (data: any) => {
			console.log('[useElizaChat] Message complete:', data);
			setIsAgentThinking(false);
		});

		// Listen for channel cleared events
		socket.on('channelCleared', (data: any) => {
			console.log('[useElizaChat] Channel cleared:', data);
			const clearedChannelId = data.channelId || data.roomId;
			if (clearedChannelId === channelId) {
				setMessages([]);
			}
		});

		// Listen for control messages (enable/disable input)
		socket.on('controlMessage', (data: any) => {
			const controlChannelId = data.channelId || data.roomId;
			if (controlChannelId === channelId) {
				if (data.action === 'disable_input') {
					setIsAgentThinking(true);
				} else if (data.action === 'enable_input') {
					setIsAgentThinking(false);
				}
			}
		});

		// Listen for errors
		socket.on('messageError', (data: any) => {
			console.error('[useElizaChat] Message error:', data);
			setError(data.error || 'An error occurred');
			setIsLoading(false);
			setIsAgentThinking(false);
		});

		return () => {
			console.log('[useElizaChat] Cleaning up WebSocket');
			if (socket) {
				socket.disconnect();
			}
		};
	}, [channelId, agentId, userId, serverId]);

	// Send a message via WebSocket
	const sendMessage = useCallback(
		async (content: string) => {
			if (!channelId || !agentId || !content.trim() || !socketRef.current) {
				console.warn('[useElizaChat] Cannot send message: missing requirements');
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				console.log('[useElizaChat] Sending message via WebSocket:', content);

				if (!userId) {
					throw new Error('User ID is required to send message');
				}

				if (!serverId) {
					throw new Error('Server ID is required to send message');
				}

				if (!channelId) {
					throw new Error('Channel ID is required to send message');
				}

				const messageId = crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

				const payload = {
					type: 2,
					payload: {
						senderId: stringToUuid(userId),
						channelId: channelId,
						serverId: serverId,
						message: content.trim(),
						source: 'client_chat',
						messageId: messageId,
						metadata: {
							channelType: 'DM',
							isDm: true,
							targetUserId: agentId,
						},
					},
				};

				// Send message via WebSocket
				// SOCKET_MESSAGE_TYPE.SEND_MESSAGE = 2
				socketRef.current.emit('message', payload);

				console.log('[useElizaChat] Message sent via WebSocket:', messageId);

				// The message will be added via WebSocket response
				// Don't set isLoading to false here - wait for messageAck
			} catch (err) {
				console.error('[useElizaChat] Error sending message:', err);
				setError((err as Error).message || 'Failed to send message');
				setIsLoading(false);
				setIsAgentThinking(false);
				throw err;
			}
		},
		[channelId, agentId, userId, serverId],
	);

	// Clear all messages in the channel
	const clearMessages = useCallback(async () => {
		if (!channelId) {
			console.warn('[useElizaChat] Cannot clear messages: no channel');
			return;
		}

		try {
			console.log('[useElizaChat] Clearing channel messages:', channelId);
			await elizaClient.messaging.clearChannelHistory(channelId as UUID);
			setMessages([]);
			console.log('[useElizaChat] Channel cleared successfully');
		} catch (err) {
			console.error('[useElizaChat] Error clearing messages:', err);
			setError((err as Error).message || 'Failed to clear messages');
			throw err;
		}
	}, [channelId, elizaClient]);

	return {
		messages,
		isLoading,
		isAgentThinking,
		channelId,
		sendMessage,
		clearMessages,
		error,
		animatedMessageId,
	};
}
