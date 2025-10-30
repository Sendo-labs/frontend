'use server';

import { withAction } from '@/lib/wrapper/with-action';
import type { Character } from '@elizaos/core';
import secretManagerService from '@/services/aws/secret-manager.service';
import type { TradesAPIResponse } from '@/services/trades.service';
import { getAnalyserOpenRouterApiKey } from '@/actions/openrouter/get';
import { ElizaService } from '@/services/eliza.service';
import { TradesService } from '@/services/trades.service';
import { ANALYSER_BASE_URL } from '@/lib/constants';

/**
 * Get the analyzer agent (global)
 * @returns The analyzer agent or null if not found
 */
export async function getAnalyzer() {
	return withAction<Character | null>(async () => {
		const analyserAgent = await secretManagerService.getSecret('analyser');
		if (!analyserAgent) {
			return null;
		}

		return JSON.parse(analyserAgent) as Character;
	});
}

/**
 * Fetch trades for a wallet address
 * @param address - The wallet address to analyze
 * @param cursor - Optional cursor for pagination
 * @param limit - Number of trades to fetch (default: 35)
 * @returns The trades API response
 */
export async function getAnalyzerTrades(address: string, cursor?: string, limit: number = 35) {
	return withAction<TradesAPIResponse>(async () => {
		const apiKeyResult = await getAnalyserOpenRouterApiKey();
		if (!apiKeyResult.success || !apiKeyResult.data) {
			throw new Error('Analyzer OpenRouter API key not found');
		}

		const baseUrl = ANALYSER_BASE_URL;
		const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
		const tradesService = new TradesService(elizaService);

		return await tradesService.fetchTrades(address, cursor, limit);
	});
}
