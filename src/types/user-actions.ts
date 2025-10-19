/**
 * Action decision (accept or reject)
 */
interface ActionDecision {
	actionId: string;
	decision: 'accept' | 'reject';
}

/**
 * Action result to update in Worker API
 */
interface ActionResult {
	status: 'completed' | 'failed';
	result?: {
		text: string;
		data?: unknown;
		timestamp: string;
	};
	error?: string;
}

export type { ActionDecision, ActionResult };
