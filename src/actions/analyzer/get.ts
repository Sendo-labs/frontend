'use server';

import { withAction } from '@/lib/wrapper/with-action';
import type { Character } from '@elizaos/core';
import { StorageFactory } from '@/factories/storage-factory';
import { getAnalyserOpenRouterApiKey } from '@/actions/openrouter/get';
import { ElizaService } from '@/services/eliza.service';
import { AnalysisClientService } from '@/services/analysis-client.service';
import { ANALYSER_BASE_URL } from '@/lib/constants';

/**
 * Get the analyzer agent (global)
 * @returns The analyzer agent or null if not found
 */
export async function getAnalyzer() {
	return withAction<Character | null>(async () => {
		const secretStore = StorageFactory.createSecretStore();
		const analyserAgent = await secretStore.getSecret('analyser');
		if (!analyserAgent) {
			return null;
		}

		return JSON.parse(analyserAgent) as Character;
	});
}

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
