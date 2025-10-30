'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Loader2 } from 'lucide-react';
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
import PageWrapper from '@/components/shared/page-wrapper';
import { useTradesAnalysis } from '@/hooks/use-trades-analysis';

export default function AnalyzerPage() {
	const searchParams = useSearchParams();
	const [wallet, setWallet] = useState('');
	const [analyzingWallet, setAnalyzingWallet] = useState('');

	// Use the trades analysis hook
	const { result, isLoading, isLoadingMore, hasMore, error, loadMore } = useTradesAnalysis(analyzingWallet);

	// Log result changes for debugging
	React.useEffect(() => {
		if (result) {
			console.log('[AnalyzerPage] Result updated:', {
				tokensCount: result.tokens.length,
				totalMissedUSD: result.total_missed_usd,
				tokens: result.tokens.map((t) => ({
					symbol: t.symbol,
					transactions: t.transactions,
				})),
			});
		}
	}, [result]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: no need to define dependencies
	useEffect(() => {
		const walletParam = searchParams.get('wallet');

		if (walletParam?.trim()) {
			setWallet(walletParam);
			setAnalyzingWallet(walletParam);
		}
	}, [searchParams]);

	const handleAnalyze = async (walletAddress = wallet) => {
		if (!walletAddress.trim()) return;

		console.log('[AnalyzerPage] Analyzing wallet:', walletAddress);
		setAnalyzingWallet(walletAddress);
	};

	const handleLoadMore = async () => {
		console.log('[AnalyzerPage] Load more clicked');
		await loadMore();
	};

	// Show loading state
	const isAnalyzing = isLoading && !isLoadingMore;

	return (
		<PageWrapper>
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

			{/* Error Message */}
			{error && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='mt-8 p-6 bg-red-500/5 border-2 border-red-500/50 relative overflow-hidden'
					style={{
						borderRadius: 0,
						clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
					}}
				>
					<div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-sendo-red' />
					<div className='flex items-start gap-3'>
						<span className='text-2xl'>⚠️</span>
						<div>
							<p className='text-red-400 font-semibold title-font mb-1'>ERROR</p>
							<p className='text-foreground/80'>
								{typeof error === 'string' ? error : (error as Error)?.message || 'Unknown error'}
							</p>
							<p className='text-sm text-foreground/40 mt-2'>
								Please check if the analysis API is started and accessible.
							</p>
						</div>
					</div>
				</motion.div>
			)}
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
						<TokenDetailsList tokens={result.tokens} />

						{/* Load More Button */}
						{hasMore && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className='flex justify-center'
							>
								<Button
									onClick={handleLoadMore}
									disabled={isLoadingMore}
									className='bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-12 px-8 transition-all title-font'
									style={{
										clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
										borderRadius: 0,
									}}
								>
									{isLoadingMore ? (
										<>
											<Loader2 className='w-5 h-5 mr-2 animate-spin' />
											LOADING MORE...
										</>
									) : (
										'LOAD MORE TRADES'
									)}
								</Button>
							</motion.div>
						)}
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
		</PageWrapper>
	);
}
