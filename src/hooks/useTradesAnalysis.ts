import { useState, useCallback, useEffect } from 'react';
import { tradesService, type TradesAPIResponse } from '@/services/trades.service';

interface WalletAnalysisResult {
	mini_chart: { points: Array<[number, number]> };
	wallet: string;
	total_missed_usd: number;
	stats: { signatures: number; sol_balance: number; nfts: number; tokens: number };
	performance: {
		total_volume_sol: number;
		total_pnl_sol: number;
		success_rate: number;
		tokens_analyzed: number;
	};
	distribution: { in_profit: number; in_loss: number; fully_sold: number; still_held: number };
	best_performer: { token: string; symbol: string; pnl_sol: number; volume_sol: number };
	worst_performer: { token: string; symbol: string; pnl_sol: number; volume_sol: number };
	tokens: Array<{
		symbol: string;
		token_address: string;
		missed_usd: number;
		ath_price: number;
		purchase_price: number;
		sold_price: number;
		ath_change_pct: number;
		price_diff_pct?: number;
		volume_sol: number;
		pnl_sol: number;
		tokens_held: number;
		transactions: number;
		total_tokens_traded: number;
		status: string;
		profit_status: string;
	}>;
	rank: string;
	punchline: string;
}

interface UseTradesAnalysisReturn {
	result: WalletAnalysisResult | null;
	isLoading: boolean;
	isLoadingMore: boolean;
	hasMore: boolean;
	error: Error | null;
	loadMore: () => Promise<void>;
}

/**
 * Calculate summary from ALL trades (not just API summary)
 * This handles Load More correctly by analyzing all accumulated trades
 */
function calculateSummaryFromAllTrades(
	allTrades: any[],
	walletAddress: string,
	globalData?: any,
	totalSignatures?: number,
): WalletAnalysisResult {
	console.log('[useTradesAnalysis] ===== CALCULATING FROM ALL TRADES =====');
	console.log('[useTradesAnalysis] Total trades to analyze:', allTrades.length);

	// Group trades by mint
	const tokensMap = new Map();
	let totalMissedUSD = 0;
	let totalVolumeSOL = 0;
	let totalPnLSOL = 0;

	for (const tx of allTrades) {
		if (!tx.trades) continue;
		
		for (const trade of tx.trades) {
			const mint = trade.mint;
			
			if (!tokensMap.has(mint)) {
				tokensMap.set(mint, {
					mint,
					trades: 0,
					totalVolumeUSD: 0,
					totalGainLoss: 0,
					totalMissedATH: 0,
					bestGainLoss: 0,
					worstGainLoss: 0,
				});
			}

			const stats = tokensMap.get(mint);
			stats.trades++;

			// Calculate volume from SOL balance change
			if (tx.balances?.solBalance?.uiChange) {
				const volume = Math.abs(tx.balances.solBalance.uiChange);
				stats.totalVolumeUSD += volume;
				totalVolumeSOL += volume;
			}

			// Calculate PnL and missed ATH
			if (trade.priceAnalysis) {
				const currentPrice = trade.priceAnalysis.currentPrice;
				const athPrice = trade.priceAnalysis.athPrice;
				const purchasePrice = trade.priceAnalysis.purchasePrice;

				// Calculate gain/loss percentage
				const gainLoss = ((currentPrice - purchasePrice) / purchasePrice) * 100;
				stats.totalGainLoss += gainLoss / 1000; // Convert to reasonable number

				// Track best/worst
				stats.bestGainLoss = Math.max(stats.bestGainLoss, gainLoss / 1000);
				stats.worstGainLoss = Math.min(stats.worstGainLoss, gainLoss / 1000);

				// Calculate missed ATH
				if (athPrice > 0) {
					const missedPercent = ((athPrice - currentPrice) / athPrice) * 100;
					stats.totalMissedATH += missedPercent;
				}
			}
		}
	}

	// Convert to array of tokens
	const tokens = Array.from(tokensMap.values()).map(token => ({
		symbol: token.mint.slice(0, 4).toUpperCase(),
		token_address: token.mint,
		missed_usd: Math.round(Math.abs(token.totalMissedATH)),
		ath_price: 0, // TODO: Get from trades
		purchase_price: 0, // TODO: Get from trades
		sold_price: 0, // TODO: Get from trades
		ath_change_pct: Math.round(token.totalMissedATH / token.trades),
		price_diff_pct: 0, // TODO: Calculate from trades
		volume_sol: token.totalVolumeUSD,
		pnl_sol: token.totalGainLoss,
		tokens_held: 0,
		transactions: token.trades,
		total_tokens_traded: 0, // TODO: Calculate from trades
		status: 'sold',
		profit_status: token.totalGainLoss > 0 ? 'profit' : 'loss',
	}));

	totalMissedUSD = Math.round(tokens.reduce((sum, t) => sum + t.missed_usd, 0));
	const profitableCount = tokens.filter(t => t.pnl_sol > 0).length;
	const successRate = tokens.length > 0 ? Math.round((profitableCount / tokens.length) * 100) : 0;

	console.log('[useTradesAnalysis] Calculated summary:', {
		tokensCount: tokens.length,
		totalVolumeSOL,
		totalMissedUSD,
	});

	// Get wallet stats from global data
	const walletBalance = globalData?.balance?.value ? parseFloat(globalData.balance.value) / 1e9 : 0;
	// Use totalSignatures if provided, otherwise fallback to globalData or allTrades.length
	const signatureCount = totalSignatures ?? (globalData?.singatureCount || allTrades.length);
	const nftCount = globalData?.nfts?.total || 0;
	const tokenCount = globalData?.tokens?.total || 0;

	// Calculate distribution based on tokens
	const inProfit = tokens.filter(t => t.pnl_sol > 0).length;
	const inLoss = tokens.filter(t => t.pnl_sol < 0).length;
	const fullySold = tokens.length; // Assume all are sold for now
	const stillHeld = 0; // Assume all are sold for now

	// Find best/worst performers
	const bestToken = tokens.reduce((best, t) => (t.pnl_sol > best.pnl_sol ? t : best), tokens[0] || {});
	const worstToken = tokens.reduce((worst, t) => (t.pnl_sol < worst.pnl_sol ? t : worst), tokens[0] || {});

	console.log('[useTradesAnalysis] Distribution for calculateSummaryFromAllTrades:', {
		inProfit,
		inLoss,
		fullySold,
		stillHeld,
		totalTokens: tokens.length,
	});

	return {
		wallet: walletAddress,
		total_missed_usd: totalMissedUSD,
		stats: { signatures: signatureCount, sol_balance: walletBalance, nfts: nftCount, tokens: tokenCount },
		performance: { total_volume_sol: totalVolumeSOL, total_pnl_sol: totalPnLSOL, success_rate: successRate, tokens_analyzed: tokens.length },
		distribution: { in_profit: inProfit, in_loss: inLoss, fully_sold: fullySold, still_held: stillHeld },
		best_performer: { token: bestToken.token_address || '', symbol: bestToken.symbol || '', pnl_sol: bestToken.pnl_sol || 0, volume_sol: bestToken.volume_sol || 0 },
		worst_performer: { token: worstToken.token_address || '', symbol: worstToken.symbol || '', pnl_sol: worstToken.pnl_sol || 0, volume_sol: worstToken.volume_sol || 0 },
		tokens,
		rank: 'CERTIFIED BAGHOLDER 💀',
		punchline: 'Top Analysis',
		mini_chart: { points: [[0, 1.0], [1, 0.8], [2, 0.6], [3, 0.4], [4, 0.3], [5, 0.2]] },
	};
}

/**
 * Transform API response to frontend format
 */
function transformAPIToResult(
	data: TradesAPIResponse,
	walletAddress: string,
): WalletAnalysisResult {
		console.log('[useTradesAnalysis] ===== START TRANSFORMATION =====');
		console.log('[useTradesAnalysis] Input data:', {
			tokensCount: data.summary.tokens?.length,
			tradesCount: data.trades?.length,
			paginationHasMore: data.pagination?.hasMore,
		});
		console.log('[useTradesAnalysis] Summary tokens details:', data.summary.tokens.map((t) => ({
			mint: t.mint.slice(0, 10),
			trades: t.trades,
			totalGainLoss: t.totalGainLoss,
			totalVolumeUSD: t.totalVolumeUSD,
			totalMissedATH: t.totalMissedATH,
		})));
		console.log('[useTradesAnalysis] ALL token mints:', data.summary.tokens.map(t => t.mint).join(', '));

	// Wallet stats from global
	const walletBalance = parseFloat(data.global.balance.value) / 1e9;
	// Use pagination.totalLoaded which represents the cumulative number of signatures loaded
	const signatureCount = data.pagination?.totalLoaded || data.global.singatureCount;
	const nftCount = data.global.nfts.total;
	const tokenCount = data.global.tokens.total;

	// Calculate distribution
	const tokenStates = new Map<string, { pnl: number; fullySold: boolean }>();
	(data.summary.tokens || []).forEach((token) => {
		const profitStatus = token.totalGainLoss > 0 ? 'profit' : 'loss';
		tokenStates.set(token.mint, {
			pnl: token.totalGainLoss,
			fullySold: false, // TODO: determine from trades
		});
	});

	let inProfit = 0;
	let inLoss = 0;
	let fullySold = 0;
	let stillHeld = 0;

	tokenStates.forEach((state) => {
		if (state.fullySold) {
			fullySold++;
		} else {
			if (state.pnl > 0) {
				inProfit++;
			} else if (state.pnl < 0) {
				inLoss++;
			}
		}
		if (!state.fullySold) stillHeld++;
	});
	
	console.log('[useTradesAnalysis] Distribution calculation in transformAPIToResult:', {
		tokenStates: Array.from(tokenStates.entries()).map(([mint, state]) => ({ mint: mint.slice(0, 8), pnl: state.pnl, fullySold: state.fullySold })),
		inProfit,
		inLoss,
		fullySold,
		stillHeld,
	});

	// Get best/worst performers (with fallback)
	const best = data.summary.bestTrade || { mint: '', gainLoss: '0', gainLossSOL: undefined, signature: '', blockTime: '' };
	const worst = data.summary.worstTrade || { mint: '', gainLoss: '0', gainLossSOL: undefined, signature: '', blockTime: '' };

	// Transform tokens for display (handle empty array)
	const tokens = (data.summary.tokens || []).map((token) => {
		// totalGainLoss is a percentage, convert to value in same unit as volume
		const pnl_sol = (token.totalGainLoss / 100) * token.totalVolumeUSD;
		
		// Calculate prices in USD
		// averagePurchasePrice and averageAthPrice are unit prices per token in USD
		const purchase_price_usd = token.averagePurchasePrice; // Unit price per token in USD
		const ath_price_usd = token.averageAthPrice; // ATH unit price per token in USD
		
		// Calculate percentage difference between purchase and ATH
		const price_diff_pct = token.averagePurchasePrice > 0
			? ((token.averageAthPrice - token.averagePurchasePrice) / token.averagePurchasePrice) * 100
			: 0;
		
		return {
			symbol: token.mint.slice(0, 4).toUpperCase(),
			token_address: token.mint,
			missed_usd: Math.abs(token.totalMissedATH),
			ath_price: ath_price_usd,
			purchase_price: purchase_price_usd,
			price_diff_pct: Math.round(price_diff_pct * 100) / 100,
			sold_price: token.averagePurchasePrice,
			ath_change_pct: Math.round(token.totalMissedATH),
			volume_sol: token.totalVolumeUSD, // Keep as-is since it's displayed in SOL equivalent
			pnl_sol,
			tokens_held: 0,
			transactions: token.trades,
			total_tokens_traded: token.totalTokensTraded,
			status: 'sold', // TODO: determine from trades
			profit_status: token.totalGainLoss > 0 ? 'profit' : 'loss',
		};
	});

	// Calculate performance metrics
	// Use totalVolumeSOL from API if available, otherwise fallback to totalVolumeUSD
	const totalVolumeSOLString = data.summary.volume.totalVolumeSOL || data.summary.volume.totalVolumeUSD?.replace('$', '') || '0';
	const totalVolumeSOL = parseFloat(totalVolumeSOLString.replace(' SOL', '').replace('$', ''));
	
	// Calculate totalPnL by summing all token PnL values (already converted from percentage to value)
	const totalPnL = tokens.reduce((sum, token) => sum + token.pnl_sol, 0);
	const profitableCount = (data.summary.tokens || []).filter((t) => t.totalGainLoss > 0).length;
	const successRate = (data.summary.tokens || []).length > 0
		? Math.round((profitableCount / (data.summary.tokens || []).length) * 100)
		: 0;

	console.log('[useTradesAnalysis] Transformed tokens:', {
		count: tokens.length,
		tokens: tokens.map((t) => ({
			symbol: t.symbol,
			address: t.token_address.slice(0, 8),
			missed_usd: t.missed_usd,
			pnl_sol: t.pnl_sol,
			status: t.status,
			transactions: t.transactions,
		})),
	});

	console.log('[useTradesAnalysis] ===== FINAL RESULT =====', {
		totalMissedUSD: Math.round(
			data.summary.tokens.reduce((sum, t) => sum + Math.abs(t.totalMissedATH), 0),
		),
		tokensCount: tokens.length,
		statsSignatures: signatureCount,
		statsSolBalance: walletBalance,
	});

	return {
		wallet: walletAddress,
		total_missed_usd: Math.round(
			(data.summary.tokens || []).reduce((sum, t) => sum + Math.abs(t.totalMissedATH), 0),
		),
		stats: { signatures: signatureCount, sol_balance: walletBalance, nfts: nftCount, tokens: tokenCount },
		performance: {
			total_volume_sol: totalVolumeSOL,
			total_pnl_sol: totalPnL,
			success_rate: successRate,
			tokens_analyzed: data.summary.tokens?.length || 0,
		},
		distribution: { in_profit: inProfit, in_loss: inLoss, fully_sold: fullySold, still_held: stillHeld },
		best_performer: {
			token: best.mint || '',
			symbol: (best.mint || '').slice(0, 4).toUpperCase() || 'N/A',
			// Use gainLossSOL if available, otherwise parse gainLoss (percentage)
			pnl_sol: best.gainLossSOL
				? parseFloat(best.gainLossSOL.replace(' SOL', ''))
				: parseFloat(best.gainLoss?.replace('%', '') || '0') * totalVolumeSOL / 100,
			volume_sol: totalVolumeSOL,
		},
		worst_performer: {
			token: worst.mint || '',
			symbol: (worst.mint || '').slice(0, 4).toUpperCase() || 'N/A',
			// Use gainLossSOL if available, otherwise parse gainLoss (percentage)
			pnl_sol: worst.gainLossSOL
				? parseFloat(worst.gainLossSOL.replace(' SOL', ''))
				: parseFloat(worst.gainLoss?.replace('%', '') || '0') * totalVolumeSOL / 100,
			volume_sol: totalVolumeSOL,
		},
		tokens,
		rank: 'CERTIFIED BAGHOLDER 💀',
		punchline: `Top ${data.summary.overview?.uniqueTokens || 0}% of Pain`,
		mini_chart: {
			points: [
				[0, 1.0],
				[1, 0.8],
				[2, 0.6],
				[3, 0.4],
				[4, 0.3],
				[5, 0.2],
			],
		},
	};
}

/**
 * Hook to fetch and manage wallet trade analysis
 */
export function useTradesAnalysis(walletAddress: string): UseTradesAnalysisReturn {
	const [allData, setAllData] = useState<TradesAPIResponse | null>(null);
	const [allTrades, setAllTrades] = useState<any[]>([]);
	const [allTokens, setAllTokens] = useState<any[]>([]); // Store all tokens from API
	const [totalSignaturesCount, setTotalSignaturesCount] = useState(0); // Track total signatures loaded
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [result, setResult] = useState<WalletAnalysisResult | null>(null);

	/**
	 * Fetch initial data
	 */
	const fetchInitialData = useCallback(
		async (address: string) => {
			if (!address.trim()) return;

			console.log('[useTradesAnalysis] Fetching initial data for:', address);
			setIsLoading(true);
			setError(null);

			try {
				const data = await tradesService.fetchTrades(address);
				console.log('[useTradesAnalysis] Initial data received:', {
					tradesCount: data.trades?.length || 0,
					tokensCount: data.summary?.tokens?.length || 0,
				});

				// Transform to frontend format
				const transformed = transformAPIToResult(data, address);
				console.log('[useTradesAnalysis] Initial transformation done:', {
					tokensCount: transformed.tokens.length,
					totalMissedUSD: transformed.total_missed_usd,
				});

			setAllData(data);
			setAllTrades(data.trades);
			setAllTokens(data.summary?.tokens || []); // Store tokens from API
			setTotalSignaturesCount(data.pagination.totalLoaded); // Initialize with first batch
			setNextCursor(data.pagination.hasMore ? data.pagination.nextCursor : null);
			setResult(transformed);
			} catch (err) {
				console.error('[useTradesAnalysis] Error fetching initial data:', err);
				setError(err instanceof Error ? err : new Error('Unknown error'));
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	/**
	 * Load more trades
	 */
	const loadMore = useCallback(async () => {
		if (!nextCursor || !walletAddress.trim() || !allData) return;

		console.log('[useTradesAnalysis] Loading more trades, cursor:', nextCursor);
		setIsLoadingMore(true);

		try {
			const data = await tradesService.fetchTrades(walletAddress, nextCursor);
			console.log('[useTradesAnalysis] Load more data received:', {
				tradesCount: data.trades.length,
				newTotalTrades: allTrades.length + data.trades.length,
			});
			console.log('[useTradesAnalysis] Raw API response summary tokens:', data.summary.tokens.map(t => ({
				mint: t.mint.slice(0, 8),
				trades: t.trades,
			})));

			// Merge trades
			const mergedTrades = [...allTrades, ...data.trades];
			console.log('[useTradesAnalysis] Merged trades:', {
				oldCount: allTrades.length,
				newTrades: data.trades.length,
				totalMerged: mergedTrades.length,
			});
			setAllTrades(mergedTrades);

		// Merge tokens from API and deduplicate by mint
		const newTokens = data.summary?.tokens || [];
		const tokensMap = new Map();
		
		// Add existing tokens to map
		allTokens.forEach(token => {
			tokensMap.set(token.mint, { ...token });
		});
		
		// Add or update tokens from new data
		newTokens.forEach(token => {
			const existing = tokensMap.get(token.mint);
			if (existing) {
				// Merge data: add trades count, sum volumes, etc.
				tokensMap.set(token.mint, {
					...existing,
					trades: existing.trades + token.trades,
					totalTokensTraded: existing.totalTokensTraded + token.totalTokensTraded,
					totalVolumeUSD: existing.totalVolumeUSD + token.totalVolumeUSD,
					totalGainLoss: existing.totalGainLoss + token.totalGainLoss,
					totalMissedATH: existing.totalMissedATH + token.totalMissedATH,
					// Recalculate averages
					averageGainLoss: (existing.totalGainLoss + token.totalGainLoss) / (existing.trades + token.trades),
					averageVolumeUSD: (existing.totalVolumeUSD + token.totalVolumeUSD) / (existing.trades + token.trades),
					averagePurchasePrice: (existing.averagePurchasePrice + token.averagePurchasePrice) / 2,
					averageAthPrice: (existing.averageAthPrice + token.averageAthPrice) / 2,
				});
			} else {
				// New token
				tokensMap.set(token.mint, { ...token });
			}
		});
		
		const mergedTokens = Array.from(tokensMap.values());
		console.log('[useTradesAnalysis] Merged tokens (deduplicated):', {
			oldCount: allTokens.length,
			newTokens: newTokens.length,
			totalMerged: mergedTokens.length,
			uniqueMints: mergedTokens.map(t => t.mint.slice(0, 8)).join(', '),
		});
		setAllTokens(mergedTokens);
		
		// Increment total signatures count (each batch adds to the total)
		const newTotalSignatures = totalSignaturesCount + data.pagination.totalLoaded;
		console.log('[useTradesAnalysis] Total signatures:', {
			current: totalSignaturesCount,
			newBatch: data.pagination.totalLoaded,
			total: newTotalSignatures,
		});
		setTotalSignaturesCount(newTotalSignatures);
		
		// Transform merged tokens to frontend format
		const mergedAPIData = {
			...data,
			summary: {
				...data.summary,
				tokens: mergedTokens,
			},
			global: allData?.global,
			trades: mergedTrades,
		};
		const transformed = transformAPIToResult(mergedAPIData, walletAddress);
		console.log('[useTradesAnalysis] Transformed after load more:', {
			tokensCount: transformed.tokens.length,
			tokens: transformed.tokens.map(t => ({
				symbol: t.symbol,
				transactions: t.transactions,
			})),
		});

		setResult(transformed);
		setNextCursor(data.pagination.hasMore ? data.pagination.nextCursor : null);
	} catch (err) {
		console.error('[useTradesAnalysis] Error loading more:', err);
		setError(err instanceof Error ? err : new Error('Unknown error'));
	} finally {
		setIsLoadingMore(false);
	}
}, [nextCursor, walletAddress, allData, allTrades, allTokens, totalSignaturesCount]);

	// Auto-fetch when wallet address changes
	useEffect(() => {
		if (walletAddress && walletAddress.trim()) {
			fetchInitialData(walletAddress);
		}
	}, [walletAddress, fetchInitialData]);

	return {
		result,
		isLoading,
		isLoadingMore,
		hasMore: !!nextCursor,
		error,
		loadMore,
	};
}

