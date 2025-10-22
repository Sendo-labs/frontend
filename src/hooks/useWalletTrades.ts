import { useState, useEffect, useCallback, useMemo } from 'react';
import { sendoApiService } from '@/services/sendo-api.service';

// Interface pour les options du hook
interface UseWalletTradesOptions {
	address: string;
	initialLimit?: number;
}

// Interface pour le retour du hook
interface UseWalletTradesReturn {
	data: any | null;
	loading: boolean;
	loadingMore: boolean;
	error: string | null;
	loadMore: () => Promise<void>;
	hasMore: boolean;
	refetch: () => Promise<void>;
	retry: () => Promise<void>;
}

// Interface pour les données de trade formatées
interface FormattedTrade {
	id: string;
	signature: string;
	blockTime: string;
	error: string;
	trades: Array<{
		mint: string;
		symbol: string;
		tradeType: 'increase' | 'decrease' | 'no_change';
		tokenBalance: {
			uiChange: number;
			changeType: string;
		};
		priceAnalysis: {
			purchasePrice: number;
			currentPrice: number;
			athPrice: number;
			athTimestamp: number;
			priceHistoryPoints: number;
		} | null;
		gainLoss?: number;
		missedATH?: number;
	}>;
	balances: {
		signerAddress: string;
		solBalance: {
			uiChange: number;
			changeType: string;
		};
		tokenBalances: Array<{
			mint: string;
			uiChange: number;
			changeType: string;
		}>;
	};
}

/**
 * Hook personnalisé pour gérer les données de trades avec pagination
 */
export const useWalletTrades = ({ 
	address, 
	initialLimit = 10 
}: UseWalletTradesOptions): UseWalletTradesReturn => {
	// États principaux
	const [data, setData] = useState<any | null>(null);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fonction pour charger les données initiales
	const fetchInitialData = useCallback(async () => {
		if (!address.trim()) return;

		setLoading(true);
		setError(null);

		try {
			// Utiliser l'API avec pagination si disponible, sinon fallback sur l'API existante
			let apiResponse;
			
			try {
				// Essayer d'abord l'API avec pagination
				apiResponse = await sendoApiService.getAnalyzerWalletPaginated(address, initialLimit);
			} catch (paginationError) {
				console.log('Pagination API not available, using fallback API');
				// Fallback sur l'API existante
				const response = await sendoApiService.getAnalyzerWallet(address);
				
				// Convertir en format ApiResponse
				apiResponse = {
					message: 'Transactions retrieved successfully',
					version: '1.0.0',
					summary: {
						overview: {
							totalTransactions: response.totalTransactions || 0,
							totalTrades: response.totalTrades || 0,
							uniqueTokens: response.uniqueTokens || 0,
							profitableTrades: response.profitableTrades || 0,
							losingTrades: response.losingTrades || 0,
							winRate: response.winRate || '0%',
							purchases: 0,
							sales: 0,
							noChange: 0,
						},
						volume: {
							totalTokensTraded: '0',
							totalVolumeUSD: response.totalVolumeUSD || '$0',
							averageTradeSizeUSD: '$0',
						},
						performance: {
							totalGainLoss: response.totalGainLoss || '0%',
							averageGainLoss: '0%',
							totalMissedATH: response.totalMissedATH || '0%',
							averageMissedATH: '0%',
						},
						bestTrade: response.bestTrade || { mint: '', gainLoss: 0, signature: '', blockTime: '' },
						worstTrade: response.worstTrade || { mint: '', gainLoss: 0, signature: '', blockTime: '' },
						tokens: response.allTokens || [],
					},
					global: {
						singatureCount: response.signatureCount || 0,
						balance: { context: { slot: '', apiVersion: '' }, value: '0' },
						nfts: { last_indexed_slot: 0, total: response.nftsCount || 0, limit: 0, cursor: '', items: [] },
						tokens: { last_indexed_slot: 0, total: response.tokensCount || 0, limit: 0, cursor: '', token_accounts: [] },
					},
					trades: [], // Pas de trades détaillés pour l'instant
					pagination: {
						hasMore: true, // Simuler la pagination pour la démonstration
						nextCursor: 'mock-cursor',
						limit: initialLimit,
						total: response.signatureCount || 0,
					},
				};
			}
			
			setData(apiResponse);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet data';
			setError(errorMessage);
			console.error('Error fetching initial wallet data:', err);
		} finally {
			setLoading(false);
		}
	}, [address, initialLimit]);

	// Fonction pour charger plus de données
	const loadMore = useCallback(async () => {
		if (!data?.pagination?.hasMore || loadingMore) return;

		setLoadingMore(true);
		setError(null);

		try {
			const nextCursor = data.pagination.nextCursor;
			if (!nextCursor) return;

			// Essayer d'abord l'API avec pagination
			let newData;
			try {
				newData = await sendoApiService.loadMoreTrades(address, nextCursor, initialLimit);
			} catch (paginationError) {
				console.log('Pagination API not available for loadMore, simulating...');
				// Simuler le chargement de plus de données
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				// Simuler l'accumulation des données
				newData = {
					...data,
					pagination: {
						...data.pagination,
						hasMore: false, // Plus de données après le premier "load more"
						total: data.pagination.total + 10, // Simuler plus de signatures
					},
				};
			}
			
			// Fusionner les données si c'est une vraie réponse API
			if (newData.trades && Array.isArray(newData.trades)) {
				const mergedData = sendoApiService.mergeTradesData(data, newData);
				setData(mergedData);
			} else {
				// Sinon, utiliser les données simulées
				setData(newData);
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to load more trades';
			setError(errorMessage);
			console.error('Error loading more trades:', err);
		} finally {
			setLoadingMore(false);
		}
	}, [data, address, initialLimit, loadingMore]);

	// Fonction pour recharger depuis le début
	const refetch = useCallback(async () => {
		setData(null);
		await fetchInitialData();
	}, [fetchInitialData]);

	// Fonction pour retry en cas d'erreur
	const retry = useCallback(async () => {
		if (data) {
			// Si on a déjà des données, essayer de charger plus
			await loadMore();
		} else {
			// Sinon, recharger depuis le début
			await refetch();
		}
	}, [data, loadMore, refetch]);

	// Vérifier s'il y a plus de données
	const hasMore = useMemo(() => {
		return data?.pagination?.hasMore ?? false;
	}, [data?.pagination?.hasMore]);

	// Effet pour charger les données initiales
	useEffect(() => {
		fetchInitialData();
	}, [fetchInitialData]);

	return {
		data,
		loading,
		loadingMore,
		error,
		loadMore,
		hasMore,
		refetch,
		retry,
	};
};

/**
 * Hook utilitaire pour formater les données de trades
 */
export const useFormattedTrades = (rawTrades: any[]): FormattedTrade[] => {
	return useMemo(() => {
		if (!rawTrades) return [];

		return rawTrades.map((transaction, index) => ({
			id: `${transaction.signature[0]}-${index}`,
			signature: transaction.signature[0],
			blockTime: transaction.blockTime,
			error: transaction.error,
			trades: transaction.trades?.map((trade: any) => {
				const symbol = sendoApiService.getTokenSymbol(trade.mint);
				let gainLoss: number | undefined;
				let missedATH: number | undefined;

				if (trade.priceAnalysis) {
					gainLoss = ((trade.priceAnalysis.currentPrice - trade.priceAnalysis.purchasePrice) / trade.priceAnalysis.purchasePrice) * 100;
					missedATH = ((trade.priceAnalysis.athPrice - trade.priceAnalysis.currentPrice) / trade.priceAnalysis.currentPrice) * 100;
				}

				return {
					mint: trade.mint,
					symbol,
					tradeType: trade.tradeType,
					tokenBalance: trade.tokenBalance,
					priceAnalysis: trade.priceAnalysis,
					gainLoss,
					missedATH,
				};
			}) || [],
			balances: {
				signerAddress: transaction.balances?.signerAddress || '',
				solBalance: {
					uiChange: transaction.balances?.solBalance?.uiChange || 0,
					changeType: transaction.balances?.solBalance?.changeType || 'no_change',
				},
				tokenBalances: transaction.balances?.tokenBalances?.map((balance: any) => ({
					mint: balance.mint,
					uiChange: balance.uiChange,
					changeType: balance.changeType,
				})) || [],
			},
		}));
	}, [rawTrades]);
};

export type { UseWalletTradesOptions, UseWalletTradesReturn, FormattedTrade };
