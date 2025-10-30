import { ANALYSER_AGENT_NAME } from '@/lib/constants';
import type { ElizaService } from './eliza.service';

export interface TradesAPIResponse {
	message: string;
	version: string;
	summary: {
		overview: {
			totalTransactions: number;
			totalTrades: number;
			uniqueTokens: number;
			profitableTrades: number;
			losingTrades: number;
			winRate: string;
			purchases: number;
			sales: number;
			noChange: number;
		};
		volume: {
			totalTokensTraded: string;
			totalVolumeUSD: string;
			totalVolumeSOL?: string;
			averageTradeSizeUSD: string;
		};
		performance: {
			totalGainLoss: string;
			totalGainLossSOL?: string;
			averageGainLoss: string;
			totalMissedATH: string;
			averageMissedATH: string;
		};
		bestTrade: {
			mint: string;
			gainLoss: string;
			gainLossUSD?: string;
			gainLossSOL?: string;
			signature: string;
			blockTime: string;
		} | null;
		worstTrade: {
			mint: string;
			gainLoss: string;
			gainLossUSD?: string;
			gainLossSOL?: string;
			signature: string;
			blockTime: string;
		} | null;
		tokens: Array<{
			mint: string;
			trades: number;
			totalTokensTraded: number;
			totalVolumeUSD: number;
			totalGainLoss: number;
			totalMissedATH: number;
			bestGainLoss: number;
			worstGainLoss: number;
			totalPurchasePrice: number;
			totalAthPrice: number;
			averageGainLoss: number;
			averageMissedATH: number;
			averageVolumeUSD: number;
			averagePurchasePrice: number;
			averageAthPrice: number;
		}>;
	};
	pagination: {
		limit: number;
		hasMore: boolean;
		nextCursor: string;
		currentCursor: string;
		totalLoaded: number;
	};
	global: {
		singatureCount: number;
		balance: {
			context: { slot: string; apiVersion: string };
			value: string;
		};
		nfts: {
			last_indexed_slot: number;
			total: number;
			limit: number;
			cursor: string;
			items: unknown[];
		};
		tokens: {
			last_indexed_slot: number;
			total: number;
			limit: number;
			cursor: string;
			token_accounts: unknown[];
		};
	};
	trades: Array<{
		signature: string[];
		blockTime: string;
		error: string;
		status: { Ok: null };
		accounts: string[];
		balances: unknown;
		trades: unknown[];
	}>;
}

interface ApiWrappedResponse<T> {
	success: boolean;
	data: T;
}

export class TradesService {
	private readonly elizaService: ElizaService;

	constructor(elizaService: ElizaService) {
		this.elizaService = elizaService;
	}

	/**
	 * Fetch trades for a wallet address
	 */
	public async fetchTrades(address: string, cursor?: string, limit: number = 35): Promise<TradesAPIResponse> {
		console.log('[TradesService] Fetching trades for:', address);
		console.log('[TradesService] Cursor:', cursor);
		console.log('[TradesService] Limit:', limit);

		const params = new URLSearchParams({ limit: limit.toString() });
		if (cursor) {
			params.append('cursor', cursor);
		}

		const path = `/api/agents/${ANALYSER_AGENT_NAME}/plugins/plugin-sendo-analyser/trades/${address}?${params.toString()}`;
		console.log('[TradesService] Fetching from:', ANALYSER_AGENT_NAME, path);

		try {
			const response = await this.elizaService.apiRequest<ApiWrappedResponse<TradesAPIResponse> | TradesAPIResponse>(
				path,
				'GET',
			);

			// The API returns { success: true, data: {...} }, so we need to unwrap it
			const data: TradesAPIResponse =
				'success' in response && response.success
					? (response as ApiWrappedResponse<TradesAPIResponse>).data
					: (response as TradesAPIResponse);

			console.log('[TradesService] ===== UNWRAPPED API RESPONSE =====');
			console.log('[TradesService] Trades count:', data.trades?.length ?? 0);
			console.log('[TradesService] Summary tokens count:', data.summary?.tokens?.length ?? 0);
			console.log(
				'[TradesService] Summary tokens:',
				data.summary?.tokens?.map((t) => ({
					mint: t.mint?.slice(0, 10),
					trades: t.trades,
					totalVolume: t.totalVolumeUSD,
				})) || [],
			);
			console.log('[TradesService] Pagination:', {
				hasMore: data.pagination?.hasMore,
				nextCursor: data.pagination?.nextCursor?.slice(0, 20),
				totalLoaded: data.pagination?.totalLoaded,
			});
			console.log('[TradesService] ===== END API RESPONSE =====');

			return data;
		} catch (error: unknown) {
			console.error('[TradesService] Error fetching trades:', error);
			// Normalize common error shapes into a clean Error with a user-friendly message
			let message = 'An error occurred while analyzing the wallet.';
			// Try to extract details from common error types
			if (typeof error === 'string') {
				message = error;
			} else if (error && typeof error === 'object') {
				const anyErr = error as {
					message?: string;
					status?: number;
					statusText?: string;
					code?: string;
					cause?: unknown;
				};
				if (anyErr.message) message = anyErr.message;
				// If we have HTTP-like info, append it
				const httpLike = anyErr as { status?: number; statusText?: string };
				if (typeof httpLike.status === 'number') {
					message = `${message} (HTTP ${httpLike.status}${httpLike.statusText ? ' - ' + httpLike.statusText : ''})`;
				}
			}

			// Provide a clearer hint for common cases
			if (/fetch|network|Failed to fetch|NetworkError/i.test(message)) {
				message = "Can't connect to the analysis API. Please check if the server is started.";
			}

			throw new Error(message);
		}
	}
}
