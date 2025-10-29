import { EventEmitter } from 'node:events';
import type { MessageResponse } from '@elizaos/api-client';
import type { ActionDecision, DecideActionsData, RecommendedAction } from '@sendo-labs/plugin-sendo-worker';
import { io, type Socket } from 'socket.io-client';
import type { MessageBroadcast } from '@/types/agent';
import type { SessionDetails, SessionInfo, SessionResponse } from '@/types/sessions';
import { ElizaService } from './eliza.service';

/**
 * AgentService - Manages agent sessions, WebSocket connections, and action execution
 * Architecture: 1 action = 1 session = 1 channel
 *
 * Events emitted:
 * - connected: WebSocket connected
 * - disconnected: WebSocket disconnected
 * - action:executing: Action started executing
 * - action:completed: Action finished successfully
 * - action:failed: Action failed
 * - action:rejected: Action was rejected
 * - error: WebSocket or general error
 */
export class AgentService extends EventEmitter {
	private socket: Socket | null = null;
	private readonly activeSessions = new Map<string, SessionInfo>();
	private readonly agentId: string;
	private readonly baseUrl: string;
	private readonly apiKey: string;
	private readonly elizaService: ElizaService;
	private isConnected = false;

	constructor(agentId: string, apiKey: string, baseUrl: string) {
		super();
		this.agentId = agentId;
		this.apiKey = apiKey;
		this.baseUrl = baseUrl;
		this.elizaService = new ElizaService(apiKey, baseUrl);
		this.initializeWebSocket();
	}

	private initializeWebSocket(): void {
		this.socket = io(this.baseUrl, {
			transports: ['websocket', 'polling'],
			extraHeaders: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		});

		this.socket.on('connect', () => this.handleConnect());
		this.socket.on('disconnect', () => this.handleDisconnect());
		this.socket.on('messageBroadcast', (msg: MessageBroadcast) => this.handleMessage(msg));
		this.socket.on('error', (error: Error) => this.handleError(error));
	}

	private handleConnect(): void {
		console.log('[AgentService] WebSocket connected');
		this.isConnected = true;
		this.emit('connected');
	}

	private handleDisconnect(): void {
		console.log('[AgentService] WebSocket disconnected');
		this.isConnected = false;
		this.emit('disconnected');
	}

	private handleError(error: Error): void {
		console.error('[AgentService] WebSocket error:', error);
		this.emit('error', error);
	}

	isWebSocketConnected(): boolean {
		return this.isConnected;
	}

	disconnect(): void {
		this.socket?.disconnect();
		this.socket = null;
		this.activeSessions.clear();
		this.isConnected = false;
	}

	async acceptActions(actions: RecommendedAction[]): Promise<void> {
		this.validateActions(actions);

		const decisions = this.createDecisions(actions, 'accept');
		const { accepted } = await this.decideActions(decisions);

		await Promise.all(
			accepted.map(async (decision) => {
				const action = actions.find((a) => a.id === decision.id);
				if (action) await this.executeAction(action);
			}),
		);
	}

	async rejectActions(actions: RecommendedAction[]): Promise<void> {
		this.validateActions(actions);

		const decisions = this.createDecisions(actions, 'reject');
		const { rejected } = await this.decideActions(decisions);

		rejected.forEach((action) => {
			this.emit('action:rejected', { actionId: action.actionId });
		});
	}

	private validateActions(actions: RecommendedAction[]): void {
		if (actions.length === 0) {
			throw new Error('[AgentService] No actions provided');
		}
	}

	private createDecisions(actions: RecommendedAction[], decision: 'accept' | 'reject'): ActionDecision[] {
		return actions.map((action) => ({
			actionId: action.id,
			decision,
		}));
	}

	private async decideActions(decisions: ActionDecision[]): Promise<DecideActionsData> {
		console.log('[AgentService] Deciding actions:', decisions);

		const response = await this.elizaService.apiRequest<{ data: DecideActionsData }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/actions/decide`,
			'POST',
			{ decisions },
		);

		return response.data;
	}

	private async executeAction(action: RecommendedAction): Promise<void> {
		try {
			const session = await this.createSession(action);
			await this.joinChannel(session);
			await this.sendTriggerMessage(session, action);

			this.emit('action:executing', {
				actionId: action.id,
				actionType: action.actionType,
			});
		} catch (error) {
			this.handleExecutionError(action.id, error);
		}
	}

	private async createSession(action: RecommendedAction): Promise<SessionInfo> {
		const sessionResponse = await this.elizaService.apiRequest<SessionResponse>('api/messaging/sessions', 'POST', {
			agentId: this.agentId,
			userId: this.agentId,
			metadata: {
				actionId: action.id,
				actionType: action.actionType,
				source: 'sendo-worker',
			},
		});

		const details = await this.elizaService.apiRequest<SessionDetails>(
			`api/messaging/sessions/${sessionResponse.sessionId}`,
			'GET',
		);

		const sessionInfo: SessionInfo = {
			sessionId: sessionResponse.sessionId,
			channelId: details.channelId,
			actionId: action.id,
			expectedActionType: action.actionType,
			serverId: details.serverId,
		};

		this.activeSessions.set(action.id, sessionInfo);
		return sessionInfo;
	}

	private async joinChannel(session: SessionInfo): Promise<void> {
		if (!this.socket) {
			throw new Error('WebSocket not initialized');
		}

		this.socket.emit('message', {
			type: 1, // ROOM_JOINING
			payload: {
				channelId: session.channelId,
				roomId: session.channelId,
				entityId: this.agentId,
				serverId: session.serverId,
			},
		});

		console.log(`[AgentService] Joined channel ${session.channelId} for action ${session.actionId}`);
	}

	private async sendTriggerMessage(session: SessionInfo, action: RecommendedAction): Promise<void> {
		await this.elizaService.apiRequest<{ data: { message: MessageResponse } }>(
			`api/messaging/sessions/${session.sessionId}/messages`,
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

		console.log(`[AgentService] Trigger message sent for action ${action.id}`);
	}

	private handleExecutionError(actionId: string, error: unknown): void {
		console.error(`[AgentService] Action ${actionId} execution failed:`, error);
		this.activeSessions.delete(actionId);
		this.emit('action:failed', {
			actionId,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		throw error;
	}

	private async handleMessage(message: MessageBroadcast): Promise<void> {
		const actionId = message.metadata?.actionId;
		if (!actionId) return;

		const session = this.activeSessions.get(actionId);
		if (!session) return;

		const messageActions = message.rawMessage?.actions || message.content?.actions || [];
		const isTargetAction = messageActions.some(
			(action) => action.toUpperCase() === session.expectedActionType.toUpperCase(),
		);

		if (!isTargetAction) {
			console.log(
				`[AgentService] Ignoring ${messageActions.join(',')} for ${actionId} (waiting for ${session.expectedActionType})`,
			);
			return;
		}

		await this.completeAction(actionId, session, message);
	}

	private async completeAction(actionId: string, session: SessionInfo, message: MessageBroadcast): Promise<void> {
		console.log(`[AgentService] Target action ${session.expectedActionType} executed for ${actionId}`);

		try {
			await this.elizaService.apiRequest(
				`api/agents/${this.agentId}/plugins/plugin-sendo-worker/action/${actionId}`,
				'PATCH',
				{
					status: 'completed',
					result: {
						text: message.text,
						data: message.content,
						timestamp: new Date().toISOString(),
					},
				},
			);

			this.activeSessions.delete(actionId);
			this.emit('action:completed', {
				actionId,
				result: message.text,
				data: message.content,
			});
		} catch (error) {
			this.handleCompletionError(actionId, error);
		}
	}

	private handleCompletionError(actionId: string, error: unknown): void {
		console.error(`[AgentService] Failed to complete action ${actionId}:`, error);
		this.activeSessions.delete(actionId);
		this.emit('action:failed', {
			actionId,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}

	getActiveSessionCount(): number {
		return this.activeSessions.size;
	}

	getActiveSessions(): SessionInfo[] {
		return Array.from(this.activeSessions.values());
	}
}

export function createAgentService(agentId: string, apiKey: string, baseUrl: string): AgentService {
	return new AgentService(agentId, apiKey, baseUrl);
}
