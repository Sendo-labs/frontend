import type {
	AnalysisResult,
	GetActionData,
	GetAnalysesData,
	GetAnalysisActionsData,
	GetAnalysisByIdData,
	RecommendedAction,
} from '@sendo-labs/plugin-sendo-worker';
import type { ElizaService } from './eliza.service';

/**
 * WorkerClientService - Simplified client for Worker plugin API
 * Handles all Worker-related API calls for a specific agent
 */
export class WorkerClientService {
	private readonly agentId: string;
	private readonly basePluginPath: string;
	private readonly elizaService: ElizaService;

	constructor(agentId: string, elizaService: ElizaService) {
		if (!elizaService.getBaseUrl()) {
			throw new Error('[WorkerClientService] Eliza base URL is not set');
		}
		this.agentId = agentId;
		this.basePluginPath = `api/agents/${this.agentId}/plugins/plugin-sendo-worker`;
		this.elizaService = elizaService;
	}

	/**
	 * Get all analyses for this agent
	 */
	async getAnalyses(): Promise<AnalysisResult[]> {
		const response = await this.request<GetAnalysesData>('/analysis', 'GET');
		return response.analyses;
	}

	/**
	 * Get a specific analysis by ID
	 */
	async getAnalysisById(id: string): Promise<AnalysisResult> {
		const response = await this.request<GetAnalysisByIdData>(`/analysis/${id}`, 'GET');
		return response.analysis;
	}

	/**
	 * Get all actions for a specific analysis
	 */
	async getActionsByAnalysisId(analysisId: string): Promise<RecommendedAction[]> {
		const response = await this.request<GetAnalysisActionsData>(`/analysis/${analysisId}/actions`, 'GET');
		return response.actions;
	}

	/**
	 * Get a specific action by ID
	 */
	async getActionById(id: string): Promise<RecommendedAction> {
		const response = await this.request<GetActionData>(`/action/${id}`, 'GET');
		return response.action;
	}

	/**
	 * Make a request to the Worker plugin API
	 * Centralizes path construction and error handling
	 */
	private async request<T>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: any): Promise<T> {
		const fullPath = `${this.basePluginPath}${path}`;
		const response = await this.elizaService.apiRequest<{ data: T }>(fullPath, method, body);
		return response.data;
	}
}
