import type {
	AnalysisResultsResponse,
	AnalysisStatusResponse,
	FameLeaderboardResponse,
	LeaderboardPeriod,
	ShameLeaderboardResponse,
	StartAnalysisResponse,
} from '@sendo-labs/plugin-sendo-analyser';
import { ANALYSER_AGENT_NAME } from '@/lib/constants';
import type { ElizaService } from './eliza.service';

interface ApiWrappedResponse<T> {
	success: boolean;
	data: T;
}

export class AnalysisClientService {
	private readonly elizaService: ElizaService;

	constructor(elizaService: ElizaService) {
		this.elizaService = elizaService;
	}

	/**
	 * Start async wallet analysis
	 */
	public async startAnalysis(address: string): Promise<StartAnalysisResponse> {
		const path = `/api/agents/${ANALYSER_AGENT_NAME}/plugins/plugin-sendo-analyser/analysis/start`;

		const response = await this.elizaService.apiRequest<ApiWrappedResponse<StartAnalysisResponse>>(path, 'POST', {
			address,
		});

		if (!response.success || !response.data) {
			throw new Error('Failed to start analysis');
		}

		return response.data;
	}

	/**
	 * Get analysis status with progress
	 */
	public async getAnalysisStatus(address: string): Promise<AnalysisStatusResponse> {
		const path = `/api/agents/${ANALYSER_AGENT_NAME}/plugins/plugin-sendo-analyser/analysis/${address}/status`;

		const response = await this.elizaService.apiRequest<ApiWrappedResponse<AnalysisStatusResponse>>(path, 'GET');

		if (!response.success || !response.data) {
			throw new Error('Failed to fetch analysis status');
		}

		return response.data;
	}

	/**
	 * Get paginated analysis results
	 */
	public async getAnalysisResults(
		address: string,
		page: number = 1,
		limit: number = 50,
	): Promise<AnalysisResultsResponse> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		const path = `/api/agents/${ANALYSER_AGENT_NAME}/plugins/plugin-sendo-analyser/analysis/${address}/results?${params.toString()}`;

		const response = await this.elizaService.apiRequest<ApiWrappedResponse<AnalysisResultsResponse>>(path, 'GET');

		if (!response.success || !response.data) {
			throw new Error('Failed to fetch analysis results');
		}

		return response.data;
	}

	/**
	 * Get Hall of Shame leaderboard (top wallets by missed ATH gains)
	 */
	public async getShameLeaderboard(
		limit: number = 20,
		period: LeaderboardPeriod = 'all',
	): Promise<ShameLeaderboardResponse> {
		const params = new URLSearchParams({
			limit: limit.toString(),
			period,
		});

		const path = `/api/agents/${ANALYSER_AGENT_NAME}/plugins/plugin-sendo-analyser/leaderboard/shame?${params.toString()}`;

		const response = await this.elizaService.apiRequest<ApiWrappedResponse<ShameLeaderboardResponse>>(path, 'GET');

		if (!response.success || !response.data) {
			throw new Error('Failed to fetch shame leaderboard');
		}

		return response.data;
	}

	/**
	 * Get Hall of Fame leaderboard (top wallets by positive PnL)
	 */
	public async getFameLeaderboard(
		limit: number = 20,
		period: LeaderboardPeriod = 'all',
	): Promise<FameLeaderboardResponse> {
		const params = new URLSearchParams({
			limit: limit.toString(),
			period,
		});

		const path = `/api/agents/${ANALYSER_AGENT_NAME}/plugins/plugin-sendo-analyser/leaderboard/fame?${params.toString()}`;

		const response = await this.elizaService.apiRequest<ApiWrappedResponse<FameLeaderboardResponse>>(path, 'GET');

		if (!response.success || !response.data) {
			throw new Error('Failed to fetch fame leaderboard');
		}

		return response.data;
	}
}
