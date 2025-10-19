import { elizaService } from '@/services/eliza.service';

export interface WorkerAnalysis {
	id: string;
	agentId: string;
	timestamp: string;
	analysis: Analysis;
	pluginsUsed: string[];
	executionTimeMs: number;
}

export interface Analysis {
	walletOverview: string;
	marketConditions: string;
	riskAssessment: string;
	opportunities: string;
}

export interface WorkerAction {
	id: string;
	analysisId: string;
	actionType: string;
	pluginName: string;
	priority: string;
	reasoning: string;
	confidence: number;
	triggerMessage: string;
	params: {
		amount: number;
		validator: string;
		token: string;
	};
	estimatedImpact: string;
	estimatedGas: string;
	status: 'pending' | 'accepted' | 'rejected' | 'executing' | 'completed' | 'failed';
	result: string | null;
	createdAt: string;
}

export class WorkerClientService {
	private agentId: string;

	constructor(agentId: string) {
		const elizaServerUrl = elizaService.getBaseUrl();
		if (!elizaServerUrl) {
			throw new Error('[WorkerClientService] NEXT_PUBLIC_ELIZA_SERVER_URL is not set');
		}
		this.agentId = agentId;
	}

	/**
	 * Get the worker analysis
	 * @returns {Promise<WorkerAnalysis>}
	 */
	async getWorkerAnalysis(): Promise<WorkerAnalysis[]> {
		const response = await elizaService.apiRequest<{ data: { analyses: WorkerAnalysis[] } }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/analysis`,
			'GET',
		);
		return response.data.analyses;
	}

	/**
	 * Get the worker analysis by id
	 * @param {string} id
	 * @returns {Promise<WorkerAnalysis>}
	 */
	async getWorkerAnalysisById(id: string): Promise<WorkerAnalysis> {
		const response = await elizaService.apiRequest<{ data: { analysis: WorkerAnalysis } }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/analysis/${id}`,
			'GET',
		);
		return response.data.analysis;
	}

	/**
	 * Get the worker actions by analysis id
	 * @param {string} analysisId
	 * @returns {Promise<WorkerAction[]>}
	 */
	async getWorkerActionsByAnalysisId(analysisId: string): Promise<WorkerAction[]> {
		const response = await elizaService.apiRequest<{ data: { actions: WorkerAction[] } }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/analysis/${analysisId}/actions`,
			'GET',
		);
		return response.data.actions;
	}

	/**
	 * Get the worker action by id
	 * @param {string} id
	 * @returns {Promise<WorkerAction>}
	 */
	async getWorkerActionById(id: string): Promise<WorkerAction> {
		const response = await elizaService.apiRequest<{ data: { action: WorkerAction } }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/action/${id}`,
			'GET',
		);
		return response.data.action;
	}
}
