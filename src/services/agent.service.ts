import { EventEmitter } from 'node:events';
import { type Socket, io } from 'socket.io-client';
import { elizaService } from '@/services/eliza.service';
import type { WorkerAction } from '@/services/worker-client.service';
import type { SessionInfo, SessionResponse, SessionDetails } from '@/types/sessions';
import type { ActionDecision, ActionResult } from '@/types/user-actions';
import type { MessageBroadcast } from '@/types/agent';

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
	private baseUrl: string;
	private isConnected = false;

	constructor(agentId: string) {
		super();
		this.agentId = agentId;
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
	async acceptActions(actions: WorkerAction[]): Promise<void> {
		if (actions.length === 0) {
			throw new Error('[AgentService] No actions provided');
		}

		// 1. Decide actions via Worker API
		const decisions: ActionDecision[] = actions.map((action) => ({
			actionId: action.id,
			decision: 'accept',
		}));

		const decideResponse = await fetch(`${this.baseUrl}/api/agents/${this.agentId}/plugins/worker/actions/decide`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ decisions }),
		});

		if (!decideResponse.ok) {
			throw new Error(`[AgentService] Failed to decide actions: ${decideResponse.statusText}`);
		}

		const { data } = await decideResponse.json();
		const acceptedActions = data.accepted as WorkerAction[];

		// 2. Execute each accepted action (create session + send message)
		for (const action of acceptedActions) {
			await this.executeAction(action);
		}
	}

	/**
	 * Reject multiple actions
	 */
	async rejectActions(actions: WorkerAction[]): Promise<void> {
		if (actions.length === 0) {
			throw new Error('[AgentService] No actions provided');
		}

		const decisions: ActionDecision[] = actions.map((action) => ({
			actionId: action.id,
			decision: 'reject',
		}));

		const decideResponse = await fetch(`${this.baseUrl}/api/agents/${this.agentId}/plugins/worker/actions/decide`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ decisions }),
		});

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
	private async executeAction(action: WorkerAction): Promise<void> {
		try {
			// 1. Create session
			const sessionResponse = await fetch(`${this.baseUrl}/api/messaging/sessions`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					agentId: this.agentId,
					userId: this.agentId,
					metadata: {
						actionId: action.id,
						actionType: action.actionType,
						source: 'sendo-worker',
					},
				}),
			});

			if (!sessionResponse.ok) {
				throw new Error(`[AgentService] Failed to create session: ${sessionResponse.statusText}`);
			}

			const sessionData = (await sessionResponse.json()) as SessionResponse;
			const { sessionId } = sessionData;

			// 2. Get session details (includes channelId)
			const sessionDetailsResponse = await fetch(`${this.baseUrl}/api/messaging/sessions/${sessionId}`);

			if (!sessionDetailsResponse.ok) {
				throw new Error(`Failed to get session details: ${sessionDetailsResponse.statusText}`);
			}

			const sessionDetails = (await sessionDetailsResponse.json()) as SessionDetails;
			const { channelId, serverId } = sessionDetails;

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
			const messageResponse = await fetch(`${this.baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					content: action.triggerMessage,
					metadata: {
						actionId: action.id,
						actionType: action.actionType,
						source: 'sendo-worker',
					},
				}),
			});

			if (!messageResponse.ok) {
				throw new Error(`Failed to send message: ${messageResponse.statusText}`);
			}

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
			const result: ActionResult = {
				status: 'completed',
				result: {
					text: message.text,
					data: message.content,
					timestamp: new Date().toISOString(),
				},
			};

			const updateResponse = await fetch(
				`${this.baseUrl}/api/agents/${this.agentId}/plugins/worker/action/${actionId}/result`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(result),
				},
			);

			if (!updateResponse.ok) {
				throw new Error(`Failed to update action result: ${updateResponse.statusText}`);
			}

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
export function createAgentService(agentId: string): AgentService {
	return new AgentService(agentId);
}
