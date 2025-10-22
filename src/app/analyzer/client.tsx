'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createPageUrl } from '@/lib/utils';
import WalletInput from '@/components/analyzer/wallet-input';
import ResultHeroCard from '@/components/analyzer/result-hero-card';
import WalletStatsGrid from '@/components/analyzer/wallet-stats-grid';
import PerformanceMetrics from '@/components/analyzer/performance-metrics';
import TokenDistribution from '@/components/analyzer/token-distribution';
import BestWorstPerformers from '@/components/analyzer/best-worst-performers';
import MiniChartATH from '@/components/analyzer/mini-chart-ath';
import TokenDetailsList from '@/components/analyzer/token-details-list';
import ShareButtons from '@/components/analyzer/share-buttons';
import CTAActivateWorker from '@/components/analyzer/cta-activate-worker';
import WalletAnalyzer from '@/components/analyzer/wallet-analyzer';
import { sendoApiService } from '@/services/sendo-api.service';

interface WalletAnalysisResult {
	mini_chart: {
		points: Array<[number, number]>;
	};
	wallet: string;
	total_missed_usd: number;
	stats: {
		signatures: number;
		sol_balance: number;
		nfts: number;
		tokens: number;
	};
	performance: {
		total_volume_sol: number;
		total_pnl_sol: number;
		success_rate: number;
		tokens_analyzed: number;
	};
	distribution: {
		in_profit: number;
		in_loss: number;
		fully_sold: number;
		still_held: number;
	};
	best_performer: {
		token: string;
		symbol: string;
		pnl_sol: number;
		volume_sol: number;
	};
	worst_performer: {
		token: string;
		symbol: string;
		pnl_sol: number;
		volume_sol: number;
	};
	tokens: Array<{
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
	rank: string;
	punchline: string;
}

export default function AnalyzerPage() {
	const searchParams = useSearchParams();
	const [wallet, setWallet] = useState('');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [result, setResult] = useState<WalletAnalysisResult | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: no need to define dependencies
	useEffect(() => {
		const walletParam = searchParams.get('wallet');

		if (walletParam && walletParam.trim()) {
			setWallet(walletParam);
			setTimeout(() => {
				handleAnalyze(walletParam);
			}, 500);
		}
	}, [searchParams]);

	const handleAnalyze = async (walletAddress = wallet) => {
		if (!walletAddress.trim()) return;

		setIsAnalyzing(true);

		try {
			// Récupérer toutes les données du wallet depuis l'API
			const walletData = await sendoApiService.getAnalyzerWallet(walletAddress);
			
			// Mock data avec les vraies données de l'API
			setTimeout(() => {
				setResult({
					wallet: walletAddress,
					total_missed_usd: walletData.totalMissedUSD, // Utilise les vraies données calculées

					// Wallet stats avec les vraies données de l'API
					stats: {
						signatures: walletData.signatureCount, // Utilise le nouveau signatureCount
						sol_balance: walletData.solBalance, // Vraie balance SOL
						nfts: walletData.nftsCount, // Vrai nombre de NFTs
						tokens: walletData.tokensCount, // Vrai nombre de tokens
					},

					// Performance metrics avec les vraies données
					performance: {
						total_volume_sol: parseFloat(walletData.totalVolumeUSD.replace('$', '')) / 200, // Approximation SOL/USD
						total_pnl_sol: parseFloat(walletData.totalGainLoss.replace('%', '')) / 100,
						success_rate: parseFloat(walletData.winRate.replace('%', '')),
						tokens_analyzed: walletData.uniqueTokens,
					},

					// Token distribution avec les vraies données
					distribution: {
						in_profit: walletData.profitableTrades,
						in_loss: walletData.losingTrades,
						fully_sold: 0, // À calculer plus tard
						still_held: 0, // À calculer plus tard
					},

					// Top performers avec les vraies données
					best_performer: walletData.bestPerformer,
					worst_performer: walletData.worstPerformer,

					// Top pain points avec les vraies données de l'API
					tokens: walletData.topPainPoints,
					
					// Tous les tokens pour la section Token Details
					allTokens: walletData.allTokens,

					rank: 'CERTIFIED BAGHOLDER 💀',
					punchline: 'Top 0.1% of Pain',

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
				});
				setIsAnalyzing(false);
			}, 1000);
		} catch (error) {
			console.error('Error fetching wallet data:', error);
			// En cas d'erreur, utiliser les données mock avec des valeurs par défaut
			setTimeout(() => {
				setResult({
					wallet: walletAddress,
					total_missed_usd: 847393,
					stats: {
						signatures: 0,
						sol_balance: 0,
						nfts: 0,
						tokens: 0,
					},
					performance: {
						total_volume_sol: 0,
						total_pnl_sol: 0,
						success_rate: 0,
						tokens_analyzed: 0,
					},
					distribution: {
						in_profit: 0,
						in_loss: 0,
						fully_sold: 0,
						still_held: 0,
					},
					best_performer: {
						token: 'N/A',
						symbol: 'N/A',
						pnl_sol: 0,
						volume_sol: 0,
					},
					worst_performer: {
						token: 'N/A',
						symbol: 'N/A',
						pnl_sol: 0,
						volume_sol: 0,
					},
					tokens: [],
					allTokens: [],
					rank: 'ERROR',
					punchline: 'Unable to fetch data',
					mini_chart: {
						points: [
							[0, 0],
							[1, 0],
							[2, 0],
							[3, 0],
							[4, 0],
							[5, 0],
						],
					},
				});
				setIsAnalyzing(false);
			}, 1000);
		}
	};

	return (
		<div className='min-h-screen pt-24 pb-12'>
			<div className='max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-20'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-center mb-12 md:mb-16'
				>
					<h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 title-font'>
						WALLET{' '}
						<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>
							ANALYZER
						</span>
					</h1>
					<p className='text-lg sm:text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto'>
						Analyze your pain 💀 See how much you lost by not selling at ATH
					</p>
				</motion.div>

				{/* Wallet Input */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
				>
					<WalletInput
						wallet={wallet}
						setWallet={setWallet}
						onAnalyze={() => handleAnalyze()}
						isAnalyzing={isAnalyzing}
					/>
				</motion.div>

				{/* Results */}
				<AnimatePresence mode='wait'>
					{result && (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -50 }}
							transition={{ duration: 0.6 }}
							className='mt-12 md:mt-16 space-y-6 md:space-y-8'
						>
							{/* Hero Recap Card */}
							<ResultHeroCard result={result} />

							{/* Wallet Stats Grid */}
							<WalletStatsGrid stats={result.stats} />

							{/* Performance Metrics */}
							<PerformanceMetrics performance={result.performance} />

							{/* Token Distribution + Best/Worst Performers */}
							<div className='grid lg:grid-cols-2 gap-6'>
								<TokenDistribution distribution={result.distribution} />
								<BestWorstPerformers best={result.best_performer} worst={result.worst_performer} />
							</div>

							{/* Chart */}
							<MiniChartATH data={result.mini_chart} />

							{/* Token Details List */}
							<TokenDetailsList tokens={result.allTokens} />

							{/* Wallet Analyzer with Load More */}
							<WalletAnalyzer address={wallet} />

							{/* Actions */}
							<div className='grid md:grid-cols-2 gap-6'>
								<ShareButtons result={result} />
								<CTAActivateWorker />
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Leaderboard CTA */}
				{!result && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.8 }}
						className='mt-16 text-center'
					>
						<Link href={createPageUrl('Leaderboard')}>
							<Button
								className='bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-red/50 text-foreground h-12 px-8 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<Crown className='w-5 h-5 mr-2 text-sendo-orange group-hover:scale-110 transition-transform' />
								<span className='title-font'>VIEW LEADERBOARD</span>
							</Button>
						</Link>
					</motion.div>
				)}
			</div>
		</div>
	);
}
