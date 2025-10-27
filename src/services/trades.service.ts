const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
			items: any[];
		};
		tokens: {
			last_indexed_slot: number;
			total: number;
			limit: number;
			cursor: string;
			token_accounts: any[];
		};
	};
	trades: Array<{
		signature: string[];
		blockTime: string;
		error: string;
		status: { Ok: null };
		accounts: string[];
		balances: any;
		trades: any[];
	}>;
}

export class TradesService {
	private static instance: TradesService | null = null;

	private constructor() {}

	public static getInstance(): TradesService {
		if (!TradesService.instance) {
			TradesService.instance = new TradesService();
		}
		return TradesService.instance;
	}

	/**
	 * Fetch trades for a wallet address
	 */
	public async fetchTrades(
		address: string,
		cursor?: string,
		limit: number = 35,
	): Promise<TradesAPIResponse> {
		console.log('[TradesService] Fetching trades for:', address);
		console.log('[TradesService] Cursor:', cursor);
		console.log('[TradesService] Limit:', limit);

		const params = new URLSearchParams({ limit: limit.toString() });
		if (cursor) {
			params.append('cursor', cursor);
		}

		const url = `${API_BASE_URL}/api/v1/trades/${address}?${params.toString()}`;
		console.log('[TradesService] Fetching from:', url);

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch trades: ${response.statusText}`);
			}

			const data = await response.json();
			console.log('[TradesService] ===== RAW API RESPONSE =====');
			console.log('[TradesService] Trades count:', data.trades?.length || 0);
			console.log('[TradesService] Summary tokens count:', data.summary?.tokens?.length || 0);
			console.log('[TradesService] Summary tokens:', data.summary?.tokens?.map((t: any) => ({
				mint: t.mint?.slice(0, 10),
				trades: t.trades,
				totalVolume: t.totalVolumeUSD,
			})) || []);
			console.log('[TradesService] Pagination:', {
				hasMore: data.pagination?.hasMore,
				nextCursor: data.pagination?.nextCursor?.slice(0, 20),
				totalLoaded: data.pagination?.totalLoaded,
			});
			console.log('[TradesService] ===== END API RESPONSE =====');

			return data;
		} catch (error) {
			console.error('[TradesService] Error fetching trades:', error);
			throw error;
		}
	}
}

export const tradesService = TradesService.getInstance();

