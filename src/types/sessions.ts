/**
 * Session information tracked for each accepted action
 */
interface SessionInfo {
	sessionId: string;
	channelId: string;
	actionId: string;
	expectedActionType: string;
	serverId: string;
}

/**
 * ElizaOS Session creation response
 */
interface SessionResponse {
	sessionId: string;
	expiresAt: string;
	timeoutConfig: {
		inactivityMs: number;
		maxDurationMs: number;
	};
}

/**
 * ElizaOS Session details response
 */
interface SessionDetails {
	sessionId: string;
	channelId: string;
	agentId: string;
	userId: string;
	serverId: string;
	expiresAt: string;
}

export type { SessionInfo, SessionResponse, SessionDetails };