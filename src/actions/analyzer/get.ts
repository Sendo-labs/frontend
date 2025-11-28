'use server';

import { getAnalyserOpenRouterApiKey } from '@/actions/openrouter/get';
import { ANALYSER_BASE_URL } from '@/lib/constants';
import { withAction } from '@/lib/wrapper/with-action';
import { AnalysisClientService } from '@/services/analysis-client.service';
import { ElizaService } from '@/services/eliza.service';

/**
 * Start async wallet analysis
 * @param address - The wallet address to analyze
 * @returns The job info with job_id and status
 */
export async function startAnalysis(address: string) {
	return withAction(async () => {
		const apiKeyResult = await getAnalyserOpenRouterApiKey();
		if (!apiKeyResult.success || !apiKeyResult.data) {
			throw new Error('Analyzer not configured');
		}

		const baseUrl = ANALYSER_BASE_URL;
		const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
		const analysisClient = new AnalysisClientService(elizaService);

		return await analysisClient.startAnalysis(address);
	}, false);
}

/**
 * Get analysis status with progress
 * @param address - The wallet address
 * @returns The analysis status with progress and results
 */
export async function getAnalysisStatus(address: string) {
	return withAction(async () => {
		const apiKeyResult = await getAnalyserOpenRouterApiKey();
		if (!apiKeyResult.success || !apiKeyResult.data) {
			throw new Error('Analyzer not configured');
		}

		const baseUrl = ANALYSER_BASE_URL;
		const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
		const analysisClient = new AnalysisClientService(elizaService);

		return await analysisClient.getAnalysisStatus(address);
	}, false);
}

/**
 * Get paginated analysis results
 * @param address - The wallet address
 * @param page - Page number (default: 1)
 * @param limit - Number of tokens per page (default: 50)
 * @returns The paginated analysis results
 */
export async function getAnalysisResults(address: string, page: number = 1, limit: number = 50) {
	return withAction(async () => {
		const apiKeyResult = await getAnalyserOpenRouterApiKey();
		if (!apiKeyResult.success || !apiKeyResult.data) {
			throw new Error('Analyzer not configured');
		}

		const baseUrl = ANALYSER_BASE_URL;
		const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
		const analysisClient = new AnalysisClientService(elizaService);

		return await analysisClient.getAnalysisResults(address, page, limit);
	}, false);
}

/**
 * Get Hall of Shame leaderboard (top wallets by missed ATH gains)
 * @param limit - Number of entries to return (default: 20)
 * @param period - Time period filter (default: 'all')
 * @returns The shame leaderboard response
 */
export async function getShameLeaderboard(limit: number = 20, period: 'all' | 'month' | 'week' = 'all') {
	return withAction(async () => {
		const apiKeyResult = await getAnalyserOpenRouterApiKey();
		if (!apiKeyResult.success || !apiKeyResult.data) {
			throw new Error('Analyzer not configured');
		}

		const baseUrl = ANALYSER_BASE_URL;
		const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
		const analysisClient = new AnalysisClientService(elizaService);

		return await analysisClient.getShameLeaderboard(limit, period);
	}, false);
}

/**
 * Get Hall of Fame leaderboard (top wallets by positive PnL)
 * @param limit - Number of entries to return (default: 20)
 * @param period - Time period filter (default: 'all')
 * @returns The fame leaderboard response
 */
export async function getFameLeaderboard(limit: number = 20, period: 'all' | 'month' | 'week' = 'all') {
	return withAction(async () => {
		const apiKeyResult = await getAnalyserOpenRouterApiKey();
		if (!apiKeyResult.success || !apiKeyResult.data) {
			throw new Error('Analyzer not configured');
		}

		const baseUrl = ANALYSER_BASE_URL;
		const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
		const analysisClient = new AnalysisClientService(elizaService);

		return await analysisClient.getFameLeaderboard(limit, period);
	}, false);
}
