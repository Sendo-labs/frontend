import { elizaService } from '@/services/eliza.service';
import type {
	AnalysisResult,
	GetAnalysesData,
	GetAnalysisActionsData,
	GetAnalysisByIdData,
} from '@sendo-labs/plugin-sendo-worker';
import type { RecommendedAction, GetActionData } from '@sendo-labs/plugin-sendo-worker';

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
	 * @returns {Promise<AnalysisResult>}
	 */
	async getWorkerAnalysis(): Promise<AnalysisResult[]> {
		const response = await elizaService.apiRequest<{ data: GetAnalysesData }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/analysis`,
			'GET',
		);
		return response.data.analyses;
	}

	/**
	 * Get the worker analysis by id
	 * @param {string} id
	 * @returns {Promise<AnalysisResult>}
	 */
	async getWorkerAnalysisById(id: string): Promise<AnalysisResult> {
		const response = await elizaService.apiRequest<{ data: GetAnalysisByIdData }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/analysis/${id}`,
			'GET',
		);
		return response.data.analysis;
	}

	/**
	 * Get the worker actions by analysis id
	 * @param {string} analysisId
	 * @returns {Promise<RecommendedAction[]>}
	 */
	async getWorkerActionsByAnalysisId(analysisId: string): Promise<RecommendedAction[]> {
		const response = await elizaService.apiRequest<{ data: GetAnalysisActionsData }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/analysis/${analysisId}/actions`,
			'GET',
		);
		return response.data.actions;
	}

	/**
	 * Get the worker action by id
	 * @param {string} id
	 * @returns {Promise<RecommendedAction>}
	 */
	async getWorkerActionById(id: string): Promise<RecommendedAction> {
		const response = await elizaService.apiRequest<{ data: GetActionData }>(
			`api/agents/${this.agentId}/plugins/plugin-sendo-worker/action/${id}`,
			'GET',
		);
		return response.data.action;
	}
}
