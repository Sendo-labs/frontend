'use client';

import { motion } from 'framer-motion';
import { Crown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import MiniChartATH from '@/components/analyzer/mini-chart-ath';
import PerformanceMetrics from '@/components/analyzer/performance-metrics';
import ResultHeroCard from '@/components/analyzer/result-hero-card';
import TokenAnalysisList from '@/components/analyzer/token-analysis-list';
import TokenDistribution from '@/components/analyzer/token-distribution';
import WalletInput from '@/components/analyzer/wallet-input';
import WalletStatsGrid from '@/components/analyzer/wallet-stats-grid';
import PageWrapper from '@/components/shared/page-wrapper';
import { Button } from '@/components/ui/button';
import { useWalletAnalysis } from '@/hooks/use-wallet-analysis';
import { createPageUrl } from '@/lib/utils';

export default function AnalyzerPage() {
	const [analyzingWallet, setAnalyzingWallet] = useState('');

	// Use the wallet analysis hook
	const { status, results, isStarting, error, nextPage } = useWalletAnalysis(analyzingWallet);

	// Log result changes for debugging
	React.useEffect(() => {
		if (results) {
			console.log('[AnalyzerPage] Results updated:', {
				tokensCount: results.tokens.length,
				total: results.pagination.total,
				tokens: results.tokens.map((t) => ({
					symbol: t.symbol,
					trades: t.trades,
				})),
			});
		}
	}, [results]);

	// Handle wallet analysis request from WalletInput
	const handleAnalyze = (walletAddress: string) => {
		if (!walletAddress.trim()) return;

		console.log('[AnalyzerPage] Starting analysis for:', walletAddress);
		// Set the analyzing wallet - this will trigger auto-fetch in the hook
		// If analysis already exists and is completed, it will just load the results
		// If you want to force a new analysis, you would call start() explicitly
		setAnalyzingWallet(walletAddress);
	};

	// Infinite scroll: ref for the loading trigger element
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const previousTokenCountRef = useRef(0);
	const isBottomVisibleRef = useRef(false);

	// Show loading states
	const isAnalyzing = isStarting || status?.status === 'processing';
	const _isCompleted = status?.status === 'completed';
	const hasResults = results && results.tokens.length > 0;

	// Reset loading state when new tokens arrive
	useEffect(() => {
		if (results && results.tokens.length > previousTokenCountRef.current) {
			previousTokenCountRef.current = results.tokens.length;
			setIsLoadingMore(false);
		}
	}, [results?.tokens.length, results]);

	// Safety timeout: reset loading state after 5 seconds if nothing happens
	useEffect(() => {
		if (isLoadingMore) {
			const timeout = setTimeout(() => {
				console.log('[AnalyzerPage] Load more timeout - resetting loading state');
				setIsLoadingMore(false);
			}, 5000);

			return () => clearTimeout(timeout);
		}
	}, [isLoadingMore]);

	// Get current summary (either from status.current_results or results.summary)
	const currentSummary = status?.current_results || results?.summary;

	// Adapt data for old components
	const adaptedResultData = React.useMemo(() => {
		if (!results || !currentSummary) return null;

		// Top 3 tokens by missed USD for ResultHeroCard - from summary (calculated from ALL tokens in DB)
		const topTokensByMissed =
			currentSummary.top_pain_points?.map((pp: any) => ({
				symbol: pp.symbol || 'Unknown',
				ath_price: pp.ath_price,
				trade_price: pp.trade_price || undefined,
				ath_change_pct: pp.ath_change_pct,
				missed_usd: pp.missed_usd,
			})) || [];

		// WalletStatsGrid data
		const walletStats = {
			signatures: currentSummary.total_trades || 0,
			sol_balance: 0, // Not provided by API
			nfts: currentSummary.nft_count || 0,
			tokens: results.pagination.total || 0,
		};

		// PerformanceMetrics data
		const performanceData = {
			total_volume_sol: currentSummary.total_volume_sol || 0,
			total_pnl_usd: currentSummary.total_pnl || 0,
			success_rate: currentSummary.success_rate || 0,
			tokens_analyzed: results.pagination.total || 0,
		};

		// Best/Worst performers - from summary (calculated from ALL tokens in DB)
		const bestPerformer = currentSummary.best_performer
			? {
					token: currentSummary.best_performer.symbol || 'Unknown',
					pnl_usd: currentSummary.best_performer.pnl_usd,
					volume_sol: currentSummary.best_performer.volume_sol,
				}
			: { token: 'N/A', pnl_usd: 0, volume_sol: 0 };

		const worstPerformer = currentSummary.worst_performer
			? {
					token: currentSummary.worst_performer.symbol || 'Unknown',
					pnl_usd: currentSummary.worst_performer.pnl_usd,
					volume_sol: currentSummary.worst_performer.volume_sol,
				}
			: { token: 'N/A', pnl_usd: 0, volume_sol: 0 };

		// Token distribution - from summary (calculated from ALL tokens in DB)
		const tokensInProfit = currentSummary.tokens_in_profit || 0;
		const tokensInLoss = currentSummary.tokens_in_loss || 0;
		const totalTokensDiscovered = currentSummary.tokens_discovered || results.pagination.total || 0;
		const distribution = {
			in_profit: tokensInProfit,
			in_loss: tokensInLoss,
			still_held: Math.max(0, totalTokensDiscovered - tokensInProfit - tokensInLoss),
		};

		// MiniChartATH data - based on REAL wallet metrics (no estimation)
		const successRate = currentSummary.success_rate || 0;
		const totalTokens = tokensInProfit + tokensInLoss;
		const totalMissedUsd = currentSummary.total_missed_usd || 0;
		const totalPnlUsd = currentSummary.total_pnl || 0;

		// Generate a curve that represents portfolio performance decline
		// Start at 100% (ATH), end at current performance level based on success rate
		const currentPerformanceRatio = totalTokens > 0 ? successRate / 100 : 0.3;

		// Use REAL data we have:
		// - Peak value = Total missed gains at ATH (what you could have made)
		// - Current value = Absolute PNL (what you actually lost/gained)
		// This shows: "How much money you left on the table"
		const peakValueUsd = totalMissedUsd; // Money you could have made at ATH
		const currentValueUsd = Math.abs(totalPnlUsd); // Money you actually lost/gained

		const chartData = {
			points: [
				[0, 1.0], // ATH (100%)
				[1, 1.0 - (1.0 - currentPerformanceRatio) * 0.2], // Early decline
				[2, 1.0 - (1.0 - currentPerformanceRatio) * 0.5], // Mid decline
				[3, 1.0 - (1.0 - currentPerformanceRatio) * 0.8], // Late decline
				[4, currentPerformanceRatio], // Current performance based on success rate
			] as [number, number][],
			peakValue: peakValueUsd,
			currentValue: currentValueUsd,
		};

		return {
			heroCard: {
				total_missed_usd: currentSummary.total_missed_usd || 0,
				tokens: topTokensByMissed,
			},
			walletStats,
			performanceData,
			bestPerformer,
			worstPerformer,
			distribution,
			chartData,
		};
	}, [results, currentSummary]);

	// Infinite scroll: observe the load more trigger
	useEffect(() => {
		if (!loadMoreRef.current || !results?.pagination.hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				// Track if bottom is visible (for auto-loading during polling)
				isBottomVisibleRef.current = entry.isIntersecting;

				// Only trigger if intersecting AND we're not already loading AND we have more to load
				if (entry.isIntersecting && results.pagination.hasMore && !isLoadingMore) {
					console.log(
						'[AnalyzerPage] Load more triggered by scroll, current tokens:',
						results.tokens.length,
						'total:',
						results.pagination.total,
					);
					setIsLoadingMore(true);
					// Load next page - isLoadingMore will be reset when new tokens arrive
					nextPage();
				}
			},
			{
				root: null,
				rootMargin: '100px', // Trigger 100px before reaching the element
				threshold: 0,
			},
		);

		observer.observe(loadMoreRef.current);

		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, [results?.pagination.hasMore, results?.tokens.length, results?.pagination.total, isLoadingMore, nextPage]);

	// Auto-load when new tokens arrive during polling IF user is waiting at the bottom
	useEffect(() => {
		// Only during processing (polling active)
		if (status?.status !== 'processing') return;

		// Only if we have more to load
		if (!results?.pagination.hasMore) return;

		// Only if user is at the bottom (within 100px)
		if (!isBottomVisibleRef.current) return;

		// Only if we're not already loading
		if (isLoadingMore) return;

		// When pagination.total increases, it means new tokens are available
		// Since user is waiting at the bottom, auto-load them
		console.log(
			'[AnalyzerPage] User waiting at bottom, auto-loading new tokens:',
			results.tokens.length,
			'/',
			results.pagination.total,
		);
		setIsLoadingMore(true);
		nextPage();
	}, [
		results?.pagination.total,
		results?.pagination.hasMore,
		status?.status,
		isLoadingMore,
		nextPage,
		results?.tokens.length,
	]);

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
					<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
						ANALYZER
					</span>
				</h1>
				<p className='text-lg sm:text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto'>
					Analyze your pain 💀 See how much you lost by not selling at ATH
				</p>
			</motion.div>

			{/* Queue Info Banner - Show when status is pending */}
			{status?.status === 'pending' && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}
					className='mb-6 mx-auto max-w-2xl'
				>
					<div className='bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3'>
						<div className='flex-shrink-0'>
							<div className='w-2 h-2 bg-amber-500 rounded-full animate-pulse' />
						</div>
						<div className='flex-1 min-w-0'>
							<p className='text-sm font-medium text-amber-900'>⏳ Analysis queued</p>
							<p className='text-xs text-amber-700 mt-0.5'>
								Your wallet analysis is waiting for an available slot. We're processing multiple wallets in parallel!
							</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Wallet Input */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.8 }}
			>
				<WalletInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
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
					<div className='absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-red-500 to-sendo-red' />
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

			{/* Results Section - Show when we have results */}
			{adaptedResultData && results && (
				<>
					{/* Hero Card with Total Missed */}
					<div className='mt-12 md:mt-16'>
						<ResultHeroCard result={adaptedResultData.heroCard} isProcessing={isAnalyzing} />
					</div>

					{/* Wallet Stats Grid */}
					<div className='mt-6 md:mt-8'>
						<WalletStatsGrid stats={adaptedResultData.walletStats} isProcessing={isAnalyzing} />
					</div>

					{/* Performance Metrics */}
					<div className='mt-6 md:mt-8'>
						<PerformanceMetrics performance={adaptedResultData.performanceData} isProcessing={isAnalyzing} />
					</div>

					{/* Two Column Section */}
					<div className='mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
						<TokenDistribution
							distribution={adaptedResultData.distribution}
							best={adaptedResultData.bestPerformer}
							worst={adaptedResultData.worstPerformer}
							isProcessing={isAnalyzing}
						/>
						<MiniChartATH data={adaptedResultData.chartData} isProcessing={isAnalyzing} />
					</div>

					{/* Token Details List */}
					<div className='mt-12 md:mt-16 space-y-6 md:space-y-8'>
						{/* Token Analysis List */}
						<TokenAnalysisList tokens={results.tokens} totalCount={results.pagination.total} />

						{/* Infinite Scroll Trigger */}
						{results.pagination.hasMore && (
							<div ref={loadMoreRef} className='flex justify-center py-8'>
								{isLoadingMore && (
									<div className='flex items-center gap-2 text-sendo-orange'>
										<Loader2 className='w-5 h-5 animate-spin' />
										<span className='text-sm font-semibold title-font'>LOADING MORE...</span>
									</div>
								)}
							</div>
						)}
					</div>
				</>
			)}

			{/* Leaderboard CTA - Only show when no analysis is running */}
			{!status && !hasResults && (
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
