'use server';

import { withAction } from '@/lib/wrapper/with-action';
import type { TradesAPIResponse } from '@/services/trades.service';
import { TradesService } from '@/services/trades.service';
import { ElizaService } from '@/services/eliza.service';
import { getAnalyserOpenRouterApiKey } from '@/actions/openrouter/get';

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

		const baseUrl = 'https://analyser.agents.usekenny.com';
		const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
		const tradesService = new TradesService(elizaService);

		return await tradesService.fetchTrades(address, cursor, limit);
	});
}
