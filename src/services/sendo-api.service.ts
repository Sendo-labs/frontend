// Service pour récupérer les données complètes du wallet depuis l'API SENDO
interface ApiResponse {
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
			averageTradeSizeUSD: string;
		};
		performance: {
			totalGainLoss: string;
			averageGainLoss: string;
			totalMissedATH: string;
			averageMissedATH: string;
		};
		bestTrade: {
			mint: string;
			gainLoss: number;
			signature: string;
			blockTime: string;
		};
		worstTrade: {
			mint: string;
			gainLoss: number;
			signature: string;
			blockTime: string;
		};
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
	global: {
		balance: {
			context: {
				slot: string;
				apiVersion: string;
			};
			value: string;
		};
		nfts: {
			last_indexed_slot: number;
			total: number;
			limit: number;
			cursor: string;
			items: Array<any>;
		};
		tokens: {
			last_indexed_slot: number;
			total: number;
			limit: number;
			cursor: string;
			token_accounts: Array<{
				address: string;
				mint: string;
				owner: string;
				amount: string;
				delegated_amount: string;
				frozen: boolean;
			}>;
		};
		singatureCount: number;
	};
	trades: Array<{
		signature: string[];
		blockTime: string;
		error: string;
		status: { Ok: null };
		accounts: string[];
		balances: {
			signerAddress: string;
			solBalance: {
				accountIndex: number;
				address: string;
				preBalance: string;
				postBalance: string;
				change: string;
				uiChange: number;
				changeType: string;
			};
			tokenBalances: Array<{
				accountIndex: number;
				address: string;
				mint: string;
				owner: string;
				decimals: number;
				preAmount: string;
				postAmount: string;
				preUiAmount: number;
				postUiAmount: number;
				change: string;
				uiChange: number;
				changeType: string;
			}>;
		};
		trades: Array<{
			mint: string;
			tokenBalance: any;
			tradeType: string;
			priceAnalysis: {
				purchasePrice: number;
				currentPrice: number;
				athPrice: number;
				athTimestamp: number;
				priceHistoryPoints: number;
			} | null;
		}>;
	}>;
	pagination: {
		hasMore: boolean;
		nextCursor: string | null;
		limit: number;
		total: number;
	};
}

interface ParsedWalletData {
	solBalance: number;
	nftsCount: number;
	tokensCount: number;
	signatureCount: number;
	totalTransactions: number;
	totalTrades: number;
	uniqueTokens: number;
	profitableTrades: number;
	losingTrades: number;
	winRate: string;
	totalVolumeUSD: string;
	totalGainLoss: string;
	totalMissedATH: string;
	totalMissedUSD: number; // Nouveau champ pour le header
	bestTrade: {
		mint: string;
		gainLoss: number;
		signature: string;
		blockTime: string;
	};
	worstTrade: {
		mint: string;
		gainLoss: number;
		signature: string;
		blockTime: string;
	};
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
	// Nouveaux champs pour le header
	topPainPoints: Array<{
		symbol: string;
		token_address: string;
		missed_usd: number;
		ath_price: number;
		sold_price: number;
		ath_change_pct: number;
		volume_sol: number;
		pnl_sol: number;
		tokens_held: number;
		transactions: number;
		status: string;
		profit_status: string;
	}>;
	// Tous les tokens pour la section Token Details
	allTokens: Array<{
		symbol: string;
		token_address: string;
		missed_usd: number;
		ath_price: number;
		sold_price: number;
		ath_change_pct: number;
		volume_sol: number;
		pnl_sol: number;
		tokens_held: number;
		transactions: number;
		status: string;
		profit_status: string;
	}>;
	// Meilleur et pire performer
	bestPerformer: {
		token: string;
		symbol: string;
		pnl_sol: number;
		volume_sol: number;
	};
	worstPerformer: {
		token: string;
		symbol: string;
		pnl_sol: number;
		volume_sol: number;
	};
}

class SendoApiService {
	private baseUrl: string;

	constructor() {
		this.baseUrl = process.env.NEXT_PUBLIC_SENDO_API_URL || 'http://localhost:4000';
	}

	async getAnalyzerWallet(walletAddress: string): Promise<ParsedWalletData> {
		try {
			const response = await fetch(`${this.baseUrl}/api/v1/trades/${walletAddress}`);
			if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
			}

			const data: ApiResponse = await response.json();
            console.log('data', data)
			
			// Parser les données de la réponse
			return this.parseWalletData(data);
		} catch (error) {
			console.error('Error fetching wallet data:', error);
			throw error;
		}
	}

	private parseWalletData(data: ApiResponse): ParsedWalletData {
		// Parser la balance SOL depuis global.balance.value (en lamports)
		const balanceLamports = parseInt(data.global.balance.value);
		const solBalance = balanceLamports / 1e9; // Convertir en SOL

		// Parser les NFTs depuis global.nfts.total
		const nftsCount = data.global.nfts.total;

		// Parser les tokens uniques depuis global.tokens.token_accounts
		// Filtrer pour avoir seulement les mints uniques
		const uniqueMints = new Set(data.global.tokens.token_accounts.map(account => account.mint));
		const tokensCount = uniqueMints.size;

		// Parser les données du summary et global
		const { summary, global } = data;

		// Calculer le total missed USD depuis les tokens
		const totalMissedUSD = this.calculateTotalMissedUSD(summary.tokens || []);

		// Transformer les tokens en top pain points pour le header (limité à 3)
		const topPainPoints = this.transformTokensToPainPoints(summary.tokens || [], 3);
		
		// Transformer TOUS les tokens pour la section Token Details (pas de limite)
		const allTokens = this.transformTokensToPainPoints(summary.tokens || []);

		// Extraire les données des meilleurs et pires performers
		const bestPerformer = this.extractBestWorstPerformer(summary.bestTrade, summary.tokens || [], 'best');
		const worstPerformer = this.extractBestWorstPerformer(summary.worstTrade, summary.tokens || [], 'worst');

		return {
			solBalance,
			nftsCount,
			tokensCount,
			signatureCount: global.singatureCount ?? 0,
			totalTransactions: summary.overview.totalTransactions ?? 0,
			totalTrades: summary.overview.totalTrades ?? 0,
			uniqueTokens: summary.overview.uniqueTokens ?? 0,
			profitableTrades: summary.overview.profitableTrades ?? 0,
			losingTrades: summary.overview.losingTrades ?? 0,
			winRate: summary.overview.winRate ?? '0%',
			totalVolumeUSD: summary.volume.totalVolumeUSD ?? '$0',
			totalGainLoss: summary.performance.totalGainLoss ?? '0.00%',
			totalMissedATH: summary.performance.totalMissedATH ?? '0.00%',
			totalMissedUSD, // Nouveau champ calculé
			bestTrade: summary.bestTrade || { mint: '', gainLoss: 0, signature: '', blockTime: '' },
			worstTrade: summary.worstTrade || { mint: '', gainLoss: 0, signature: '', blockTime: '' },
			tokens: summary.tokens || [],
			topPainPoints, // Nouveau champ pour le header
			allTokens, // Tous les tokens pour Token Details
			bestPerformer, // Meilleur performer
			worstPerformer, // Pire performer
		};
	}

	private calculateTotalMissedUSD(tokens: Array<any>): number {
		// Calculer le total des pertes depuis les tokens
		// Utiliser totalMissedATH comme base, converti en USD
		return tokens.reduce((total, token) => {
			// Convertir le pourcentage de perte en USD approximatif
			// En supposant que totalMissedATH est un pourcentage
			const missedPercentage = Math.abs(token.totalMissedATH || 0);
			
			// Conversion sécurisée de totalVolumeUSD
			let volumeUSD = 0;
			if (typeof token.totalVolumeUSD === 'string') {
				volumeUSD = parseFloat(token.totalVolumeUSD.replace('$', ''));
			} else if (typeof token.totalVolumeUSD === 'number') {
				volumeUSD = token.totalVolumeUSD;
			}
			
			const missedUSD = (volumeUSD * missedPercentage) / 100;
			return total + missedUSD;
		}, 0);
	}

	private transformTokensToPainPoints(tokens: Array<any>, limit?: number): Array<{
		symbol: string;
		token_address: string;
		missed_usd: number;
		ath_price: number;
		sold_price: number;
		ath_change_pct: number;
		volume_sol: number;
		pnl_sol: number;
		tokens_held: number;
		transactions: number;
		status: string;
		profit_status: string;
	}> {
		return tokens
			.map(token => {
				const symbol = this.getTokenSymbol(token.mint);
				
				// Conversion sécurisée de totalVolumeUSD
				let volumeUSD = 0;
				if (typeof token.totalVolumeUSD === 'string') {
					volumeUSD = parseFloat(token.totalVolumeUSD.replace('$', ''));
				} else if (typeof token.totalVolumeUSD === 'number') {
					volumeUSD = token.totalVolumeUSD;
				}
				
				const missedPercentage = Math.abs(token.totalMissedATH || 0);
				const missedUSD = (volumeUSD * missedPercentage) / 100;
				
				// Calculer les prix approximatifs
				const athPrice = token.totalAthPrice || 0;
				const soldPrice = token.totalPurchasePrice || 0;
				const athChangePct = token.totalMissedATH || 0;
				
				// Convertir le volume USD en SOL (approximation)
				const volumeSOL = volumeUSD / 200; // Approximation SOL/USD
				
				// Calculer le PnL en SOL
				let pnlSOL = 0;
				if (typeof token.totalGainLoss === 'string') {
					pnlSOL = parseFloat(token.totalGainLoss.replace('%', '')) / 100;
				} else if (typeof token.totalGainLoss === 'number') {
					pnlSOL = token.totalGainLoss;
				}
				
				return {
					symbol,
					token_address: token.mint.slice(0, 8),
					missed_usd: Math.round(missedUSD),
					ath_price: athPrice,
					sold_price: soldPrice > 0 ? soldPrice : 0, // Utiliser 0 au lieu de null
					ath_change_pct: Math.round(athChangePct),
					volume_sol: volumeSOL,
					pnl_sol: pnlSOL,
					tokens_held: 0, // À calculer si nécessaire
					transactions: token.trades || 0,
					status: soldPrice > 0 ? 'sold' : 'held',
					profit_status: pnlSOL >= 0 ? 'profit' : 'loss',
				};
			})
			.sort((a, b) => b.missed_usd - a.missed_usd) // Trier par missed USD décroissant
			.slice(0, limit || tokens.length); // Prendre les premiers selon la limite ou tous
	}

	private extractBestWorstPerformer(trade: any, tokens: Array<any>, type: 'best' | 'worst'): {
		token: string;
		symbol: string;
		pnl_sol: number;
		volume_sol: number;
	} {
		if (!trade || !trade.mint) {
			return {
				token: 'N/A',
				symbol: 'N/A',
				pnl_sol: 0,
				volume_sol: 0,
			};
		}

		// Trouver le token correspondant dans la liste des tokens
		const tokenData = tokens.find(token => token.mint === trade.mint);
		
		// Convertir le volume USD en SOL (approximation basée sur un prix SOL de ~$200)
		let volumeSOL = 0;
		if (tokenData && tokenData.totalVolumeUSD) {
			let volumeUSD = 0;
			if (typeof tokenData.totalVolumeUSD === 'string') {
				volumeUSD = parseFloat(tokenData.totalVolumeUSD.replace('$', '').replace(',', ''));
			} else if (typeof tokenData.totalVolumeUSD === 'number') {
				volumeUSD = tokenData.totalVolumeUSD;
			}
			// Approximation: 1 SOL ≈ $200 (prix plus réaliste actuellement)
			volumeSOL = volumeUSD / 200;
		}

		return {
			token: trade.mint.slice(0, 8),
			symbol: this.getTokenSymbol(trade.mint),
			pnl_sol: trade.gainLoss || 0,
			volume_sol: volumeSOL,
		};
	}

	/**
	 * Récupère les données du wallet avec pagination
	 */
	async getAnalyzerWalletPaginated(address: string, limit: number = 70, cursor?: string): Promise<ApiResponse> {
		try {
			const baseUrl = process.env.NEXT_PUBLIC_SENDO_API_URL;
			if (!baseUrl) {
				throw new Error('NEXT_PUBLIC_SENDO_API_URL is not defined');
			}

			const url = new URL(`/api/v1/trades/${address}`, baseUrl);
			url.searchParams.set('limit', limit.toString());
			if (cursor && cursor !== 'mock-cursor') {
				url.searchParams.set('cursor', cursor);
			}

			const response = await fetch(url.toString());
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const rawData = await response.json();
			
			// Convertir la réponse en format ApiResponse si nécessaire
			if (rawData.pagination) {
				// La réponse a déjà le format ApiResponse
				return rawData as ApiResponse;
			} else {
				// Convertir l'ancien format en nouveau format
				return this.convertToApiResponse(rawData, limit, cursor);
			}
		} catch (error) {
			console.error('Error fetching paginated wallet data:', error);
			throw error;
		}
	}

	/**
	 * Convertit l'ancien format de réponse en format ApiResponse
	 */
	private convertToApiResponse(rawData: any, limit: number, cursor?: string): ApiResponse {
		return {
			message: rawData.message || 'Transactions retrieved successfully',
			version: rawData.version || '1.0.0',
			summary: {
				overview: {
					totalTransactions: rawData.summary?.overview?.totalTransactions || 0,
					totalTrades: rawData.summary?.overview?.totalTrades || 0,
					uniqueTokens: rawData.summary?.overview?.uniqueTokens || 0,
					profitableTrades: rawData.summary?.overview?.profitableTrades || 0,
					losingTrades: rawData.summary?.overview?.losingTrades || 0,
					winRate: rawData.summary?.overview?.winRate || '0%',
					purchases: rawData.summary?.overview?.purchases || 0,
					sales: rawData.summary?.overview?.sales || 0,
					noChange: rawData.summary?.overview?.noChange || 0,
				},
				volume: rawData.summary?.volume || {
					totalTokensTraded: '0',
					totalVolumeUSD: '$0',
					averageTradeSizeUSD: '$0',
				},
				performance: rawData.summary?.performance || {
					totalGainLoss: '0%',
					averageGainLoss: '0%',
					totalMissedATH: '0%',
					averageMissedATH: '0%',
				},
				bestTrade: rawData.summary?.bestTrade || { mint: '', gainLoss: 0, signature: '', blockTime: '' },
				worstTrade: rawData.summary?.worstTrade || { mint: '', gainLoss: 0, signature: '', blockTime: '' },
				tokens: rawData.summary?.tokens || [],
			},
			global: rawData.global || {
				singatureCount: 0,
				balance: { context: { slot: '', apiVersion: '' }, value: '0' },
				nfts: { last_indexed_slot: 0, total: 0, limit: 0, cursor: '', items: [] },
				tokens: { last_indexed_slot: 0, total: 0, limit: 0, cursor: '', token_accounts: [] },
			},
			trades: rawData.trades || [],
			pagination: {
				hasMore: cursor !== 'mock-cursor', // Simuler la pagination
				nextCursor: cursor === 'mock-cursor' ? null : 'next-mock-cursor',
				limit: limit,
				total: rawData.global?.singatureCount || rawData.trades?.length || 0,
			},
		};
	}

	/**
	 * Charge plus de données en utilisant le cursor de pagination
	 */
	async loadMoreTrades(address: string, cursor: string, limit: number = 10): Promise<ApiResponse> {
		return this.getAnalyzerWalletPaginated(address, limit, cursor);
	}

	/**
	 * Fusionne les données de trades avec les données existantes
	 */
	mergeTradesData(existingData: ApiResponse, newData: ApiResponse): ApiResponse {
		return {
			...newData,
			trades: [...existingData.trades, ...newData.trades],
			pagination: newData.pagination,
			// Recalculer le summary global basé sur toutes les transactions
			summary: this.recalculateGlobalSummary([...existingData.trades, ...newData.trades]),
		};
	}

	/**
	 * Recalcule le summary global basé sur toutes les transactions
	 */
	private recalculateGlobalSummary(allTrades: Array<any>): ApiResponse['summary'] {
		let totalTransactions = 0;
		let totalTrades = 0;
		let uniqueTokens = new Set<string>();
		let profitableTrades = 0;
		let losingTrades = 0;
		let purchases = 0;
		let sales = 0;
		let noChange = 0;
		let totalVolumeUSD = 0;
		let totalGainLoss = 0;
		let totalMissedATH = 0;
		let bestTrade = { mint: '', gainLoss: -Infinity, signature: '', blockTime: '' };
		let worstTrade = { mint: '', gainLoss: Infinity, signature: '', blockTime: '' };
		const tokenStats = new Map<string, any>();

		allTrades.forEach(transaction => {
			totalTransactions++;
			
			transaction.trades?.forEach((trade: any) => {
				totalTrades++;
				uniqueTokens.add(trade.mint);
				
				if (trade.tradeType === 'increase') purchases++;
				else if (trade.tradeType === 'decrease') sales++;
				else noChange++;

				if (trade.priceAnalysis) {
					const gainLoss = ((trade.priceAnalysis.currentPrice - trade.priceAnalysis.purchasePrice) / trade.priceAnalysis.purchasePrice) * 100;
					const missedATH = ((trade.priceAnalysis.athPrice - trade.priceAnalysis.currentPrice) / trade.priceAnalysis.currentPrice) * 100;
					
					totalGainLoss += gainLoss;
					totalMissedATH += missedATH;
					
					if (gainLoss > bestTrade.gainLoss) {
						bestTrade = {
							mint: trade.mint,
							gainLoss,
							signature: transaction.signature[0],
							blockTime: transaction.blockTime
						};
					}
					
					if (gainLoss < worstTrade.gainLoss) {
						worstTrade = {
							mint: trade.mint,
							gainLoss,
							signature: transaction.signature[0],
							blockTime: transaction.blockTime
						};
					}

					if (gainLoss > 0) profitableTrades++;
					else losingTrades++;

					// Statistiques par token
					if (!tokenStats.has(trade.mint)) {
						tokenStats.set(trade.mint, {
							mint: trade.mint,
							trades: 0,
							totalTokensTraded: 0,
							totalVolumeUSD: 0,
							totalGainLoss: 0,
							totalMissedATH: 0,
							bestGainLoss: gainLoss,
							worstGainLoss: gainLoss,
							totalPurchasePrice: trade.priceAnalysis.purchasePrice,
							totalAthPrice: trade.priceAnalysis.athPrice,
						});
					}
					
					const tokenStat = tokenStats.get(trade.mint);
					tokenStat.trades++;
					tokenStat.totalGainLoss += gainLoss;
					tokenStat.totalMissedATH += missedATH;
					tokenStat.bestGainLoss = Math.max(tokenStat.bestGainLoss, gainLoss);
					tokenStat.worstGainLoss = Math.min(tokenStat.worstGainLoss, gainLoss);
				}
			});
		});

		const winRate = totalTrades > 0 ? ((profitableTrades / totalTrades) * 100).toFixed(2) + '%' : '0%';
		const averageGainLoss = totalTrades > 0 ? (totalGainLoss / totalTrades).toFixed(2) + '%' : '0%';
		const averageMissedATH = totalTrades > 0 ? (totalMissedATH / totalTrades).toFixed(2) + '%' : '0%';

		return {
			overview: {
				totalTransactions,
				totalTrades,
				uniqueTokens: uniqueTokens.size,
				profitableTrades,
				losingTrades,
				winRate,
				purchases,
				sales,
				noChange,
			},
			volume: {
				totalTokensTraded: totalTrades.toString(),
				totalVolumeUSD: `$${totalVolumeUSD.toFixed(2)}`,
				averageTradeSizeUSD: totalTrades > 0 ? `$${(totalVolumeUSD / totalTrades).toFixed(2)}` : '$0',
			},
			performance: {
				totalGainLoss: totalGainLoss.toFixed(2) + '%',
				averageGainLoss,
				totalMissedATH: totalMissedATH.toFixed(2) + '%',
				averageMissedATH,
			},
			bestTrade,
			worstTrade,
			tokens: Array.from(tokenStats.values()).map(token => ({
				...token,
				averageGainLoss: token.trades > 0 ? token.totalGainLoss / token.trades : 0,
				averageMissedATH: token.trades > 0 ? token.totalMissedATH / token.trades : 0,
				averageVolumeUSD: token.trades > 0 ? token.totalVolumeUSD / token.trades : 0,
				averagePurchasePrice: token.trades > 0 ? token.totalPurchasePrice / token.trades : 0,
				averageAthPrice: token.trades > 0 ? token.totalAthPrice / token.trades : 0,
			})),
		};
	}

	getTokenSymbol(mint: string): string {
		// Vérifier que mint existe et n'est pas vide
		if (!mint || typeof mint !== 'string') {
			return 'UNKNOWN';
		}
		
		// Mapping seulement pour les tokens vraiment connus
		const tokenSymbols: Record<string, string> = {
			'So11111111111111111111111111111111111111112': 'SOL',
			'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
		};
		
		// Pour tous les autres tokens, utiliser les 4 premières lettres de l'adresse mint
		return tokenSymbols[mint] || mint.slice(0, 4).toUpperCase();
	}
}

export const sendoApiService = new SendoApiService();
