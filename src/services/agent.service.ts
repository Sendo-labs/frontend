import { EventEmitter } from 'node:events';
import { type Socket, io } from 'socket.io-client';
import { elizaService } from '@/services/eliza.service';
import type { ActionDecision, ActionResultUpdate, RecommendedAction } from '@sendo-labs/plugin-sendo-worker';
import type { SessionInfo, SessionResponse, SessionDetails } from '@/types/sessions';
import type { MessageBroadcast } from '@/types/agent';
import type { MessageResponse } from '@elizaos/api-client';

interface DecideResponse {
	processed: number;
	accepted: {
		id: string;
		analysisId: string;
		actionType: string;
		status: string;
		decidedAt: string;
	}[];
	rejected: {
		actionId: string;
		status: string;
	}[];
}

/**
 * AgentService - Manages sessions, WebSocket, and action execution
 * Based on specs from docs/worker.md
 *
 * Key principles:
 * - 1 action = 1 session = 1 channel
 * - Filters intermediate actions (e.g., REPLY) to only emit target actions (e.g., SWAP)
 * - Manages WebSocket connection and channel joining
 * - Emits events for UI consumption
 */
export class AgentService extends EventEmitter {
	private socket: Socket | null = null;
	private activeSessions = new Map<string, SessionInfo>();
	private agentId: string;
	private userId: string;
	private baseUrl: string;
	private isConnected = false;

	constructor(agentId: string, userId: string) {
		super();
		this.agentId = agentId;
		this.userId = userId;
		this.baseUrl = elizaService.getBaseUrl();
		this.initializeWebSocket();
	}

	/**
	 * Initialize WebSocket connection
	 */
	private initializeWebSocket(): void {
		this.socket = io(this.baseUrl);

		this.socket.on('connect', () => {
			console.log('[AgentService] WebSocket connected');
			this.isConnected = true;
			this.emit('connected');
		});

		this.socket.on('disconnect', () => {
			console.log('[AgentService] WebSocket disconnected');
			this.isConnected = false;
			this.emit('disconnected');
		});

		this.socket.on('messageBroadcast', (message: MessageBroadcast) => {
			this.handleMessageBroadcast(message);
		});

		this.socket.on('error', (error: Error) => {
			console.error('[AgentService] WebSocket error:', error);
			this.emit('error', error);
		});
	}

	/**
	 * Accept multiple actions
	 * Creates sessions and sends messages for each accepted action
	 */
	async acceptActions(actions: RecommendedAction[]): Promise<void> {
		if (actions.length === 0) {
			throw new Error('[AgentService] No actions provided');
		}

		// 1. Decide actions via Worker API
		const decisions: ActionDecision[] = actions.map((action) => ({
			actionId: action.id,
			decision: 'accept',
		}));

		console.log('[AgentService] Deciding actions:', decisions);

		const decideResponse = await elizaService.apiRequest<{ data: DecideResponse }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/actions/decide`,
			'POST',
			{ decisions },
		);

		const { accepted } = decideResponse.data;

		// 2. Execute each accepted action (create session + send message)
		for (const action of accepted) {
			const fullAction = actions.find((a) => a.id === action.id)!;
			if (!fullAction) {
				throw new Error(`[AgentService] Action ${action.id} not found`);
			}
			await this.executeAction(fullAction);
		}
	}

	/**
	 * Reject multiple actions
	 */
	async rejectActions(actions: RecommendedAction[]): Promise<void> {
		if (actions.length === 0) {
			throw new Error('[AgentService] No actions provided');
		}

		const decisions: ActionDecision[] = actions.map((action) => ({
			actionId: action.id,
			decision: 'reject',
		}));

		const decideResponse = await fetch(
			`${this.baseUrl}/api/agents/${this.agentId}/plugins/plugin-sendo-worker/actions/decide`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ decisions }),
			},
		);

		if (!decideResponse.ok) {
			throw new Error(`[AgentService] Failed to reject actions: ${decideResponse.statusText}`);
		}

		const { data } = await decideResponse.json();
		const rejectedActions = data.rejected;

		// Emit rejected events
		for (const action of rejectedActions) {
			this.emit('action:rejected', {
				actionId: action.actionId,
			});
		}
	}

	/**
	 * Execute a single action
	 * Creates a session, joins the channel, and sends the trigger message
	 */
	private async executeAction(action: RecommendedAction): Promise<void> {
		try {
			// 1. Create session
			const sessionResponse = await elizaService.apiRequest<SessionResponse>(`api/messaging/sessions`, 'POST', {
				agentId: this.agentId,
				userId: this.agentId,
				metadata: {
					actionId: action.id,
					actionType: action.actionType,
					source: 'sendo-worker',
				},
			});

			const { sessionId } = sessionResponse;

			// 2. Get session details (includes channelId)
			const sessionDetailsResponse = await elizaService.apiRequest<SessionDetails>(
				`api/messaging/sessions/${sessionId}`,
				'GET',
			);

			console.log('[AgentService] Session details response:', sessionDetailsResponse);

			const { channelId, serverId } = sessionDetailsResponse;

			// 3. Track this session
			this.activeSessions.set(action.id, {
				sessionId,
				channelId,
				actionId: action.id,
				expectedActionType: action.actionType,
				serverId,
			});

			// 4. Join the channel via WebSocket
			if (!this.socket) {
				throw new Error('WebSocket not initialized');
			}

			this.socket.emit('message', {
				type: 1, // ROOM_JOINING
				payload: {
					channelId,
					roomId: channelId,
					entityId: this.agentId,
					serverId,
				},
			});

			console.log(`[AgentService] Joined channel ${channelId} for action ${action.id}`);

			// 5. Send the trigger message
			const messageResponse = await elizaService.apiRequest<{ data: { message: MessageResponse } }>(
				`api/messaging/sessions/${sessionId}/messages`,
				'POST',
				{
					content: action.triggerMessage,
					metadata: {
						actionId: action.id,
						actionType: action.actionType,
						source: 'sendo-worker',
					},
				},
			);

			console.log(`[AgentService] Action ${action.id} sent to agent`);

			// Emit executing event
			this.emit('action:executing', {
				actionId: action.id,
				actionType: action.actionType,
			});
		} catch (error) {
			console.error(`[AgentService] Failed to execute action ${action.id}:`, error);
			this.activeSessions.delete(action.id);
			this.emit('action:failed', {
				actionId: action.id,
				error: error instanceof Error ? error.message : '[AgentService] Unknown error',
			});
			throw error;
		}
	}

	/**
	 * Handle incoming WebSocket messages
	 * Filters intermediate actions and only processes target actions
	 */
	private async handleMessageBroadcast(message: MessageBroadcast): Promise<void> {
		const actionId = message.metadata?.actionId;

		if (!actionId) {
			// Message not related to an action
			return;
		}

		const sessionInfo = this.activeSessions.get(actionId);

		if (!sessionInfo) {
			// No active session for this action
			return;
		}

		// Extract actions from message
		const messageActions = message.rawMessage?.actions || message.content?.actions || [];

		// Check if this is the target action
		const isTargetAction = messageActions.some(
			(action) => action.toUpperCase() === sessionInfo.expectedActionType.toUpperCase(),
		);

		// If it's an intermediate action, ignore it
		if (!isTargetAction) {
			console.log(
				`[AgentService] Ignoring ${messageActions.join(',')} for ${actionId} (waiting for ${sessionInfo.expectedActionType})`,
			);
			return;
		}

		console.log(`[AgentService] Target action ${sessionInfo.expectedActionType} executed for ${actionId}`);

		// Update action result in Worker API
		try {
			const result: ActionResultUpdate = {
				status: 'completed',
				result: {
					text: message.text,
					data: message.content,
					timestamp: new Date().toISOString(),
				},
			};

			await elizaService.apiRequest<{ data: { action: RecommendedAction } }>(
				`api/agents/${this.agentId}/plugins/plugin-sendo-worker/action/${actionId}/result`,
				'PATCH',
				result,
			);

			// Clean up session
			this.activeSessions.delete(actionId);

			// Emit completed event
			this.emit('action:completed', {
				actionId,
				result: message.text,
				data: message.content,
			});
		} catch (error) {
			console.error(`[AgentService] Failed to update action ${actionId}:`, error);

			// Clean up session
			this.activeSessions.delete(actionId);

			// Emit failed event
			this.emit('action:failed', {
				actionId,
				error: error instanceof Error ? error.message : '[AgentService] Unknown error',
			});
		}
	}

	/**
	 * Get active session count
	 */
	getActiveSessionCount(): number {
		return this.activeSessions.size;
	}

	/**
	 * Get active sessions
	 */
	getActiveSessions(): SessionInfo[] {
		return Array.from(this.activeSessions.values());
	}

	/**
	 * Check if WebSocket is connected
	 */
	isWebSocketConnected(): boolean {
		return this.isConnected;
	}

	/**
	 * Disconnect and cleanup
	 */
	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
		this.activeSessions.clear();
		this.isConnected = false;
	}
}

/**
 * Create an AgentService instance
 */
export function createAgentService(agentId: string, userId: string): AgentService {
	return new AgentService(agentId, userId);
}
