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
	status: string;
	createdAt: string;
}

export class WorkerClientService {
	private pluginBaseUrl: string;

	constructor(agentId: string) {
		const elizaServerUrl = elizaService.getBaseUrl();
		if (!elizaServerUrl) {
			throw new Error('[WorkerClientService] NEXT_PUBLIC_ELIZA_SERVER_URL is not set');
		}
		this.pluginBaseUrl = `${elizaServerUrl}/api/agents/${agentId}/plugins/worker`;
	}

	/**
	 * Get the worker analysis
	 * @returns {Promise<WorkerAnalysis>}
	 */
	async getWorkerAnalysis(): Promise<WorkerAnalysis[]> {
		const response = await fetch(`${this.pluginBaseUrl}/analysis`);
		const data = await response.json();
		return data.data.analyses as WorkerAnalysis[];
	}

	/**
	 * Get the worker analysis by id
	 * @param {string} id
	 * @returns {Promise<WorkerAnalysis>}
	 */
	async getWorkerAnalysisById(id: string): Promise<WorkerAnalysis> {
		const response = await fetch(`${this.pluginBaseUrl}/analysis/${id}`);
		const data = await response.json();
		return data.data as WorkerAnalysis;
	}

	/**
	 * Get the worker actions by analysis id
	 * @param {string} analysisId
	 * @returns {Promise<WorkerAction[]>}
	 */
	async getWorkerActionsByAnalysisId(analysisId: string): Promise<WorkerAction[]> {
		const response = await fetch(`${this.pluginBaseUrl}/analysis/${analysisId}/actions`);
		const data = await response.json();
		return data.data.actions as WorkerAction[];
	}

	/**
	 * Get the worker action by id
	 * @param {string} id
	 * @returns {Promise<WorkerAction>}
	 */
	async getWorkerActionById(id: string): Promise<WorkerAction> {
		const response = await fetch(`${this.pluginBaseUrl}/action/${id}`);
		const data = await response.json();
		return data.data as WorkerAction;
	}
}
