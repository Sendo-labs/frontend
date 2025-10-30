'use client';

import type { AnalysisResult } from '@sendo-labs/plugin-sendo-worker';
import { AlertTriangle, Brain, Clock, Target, TrendingUp, Zap } from 'lucide-react';

interface AnalysisPanelProps {
	analysis: AnalysisResult | null;
	isLoading?: boolean;
}

export default function AnalysisPanel({ analysis, isLoading = false }: AnalysisPanelProps) {
	if (!analysis) {
		return (
			<div className='mb-8'>
				<div className='flex items-center gap-2 mb-4'>
					<Brain className='w-5 h-5 text-sendo-orange' />
					<h2 className='text-xl font-bold text-foreground uppercase title-font'>
						LATEST{' '}
						<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>
							ANALYSIS
						</span>
					</h2>
				</div>
				<div className='bg-foreground/5 border border-foreground/10 p-12 text-center rounded-none'>
					{isLoading ? (
						<>
							<div className='w-16 h-16 border-4 border-sendo-orange border-t-transparent mx-auto mb-4 rounded-none' />
							<h3 className='text-xl font-bold text-foreground mb-2 title-font'>Creating Analysis...</h3>
							<p className='text-foreground/60'>The worker is analyzing your portfolio</p>
						</>
					) : (
						<>
							<Brain className='w-12 h-12 text-foreground/20 mx-auto mb-4' />
							<h3 className='text-xl font-bold text-foreground mb-2 title-font'>No Analysis Yet</h3>
							<p className='text-foreground/60'>Waiting for the first portfolio analysis...</p>
						</>
					)}
				</div>
			</div>
		);
	}

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

		if (diff < 60) return `${diff}s ago`;
		if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
		return `${Math.floor(diff / 86400)}d ago`;
	};

	return (
		<div className='mb-8'>
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-2'>
					<Brain className='w-5 h-5 text-sendo-orange' />
					<h2 className='text-xl font-bold text-foreground uppercase title-font'>
						LATEST{' '}
						<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>
							ANALYSIS
						</span>
					</h2>
				</div>
				<div className='flex items-center gap-2'>
					<Clock className='w-4 h-4 text-foreground/40' />
					<span className='text-xs text-foreground/40'>{formatTime(analysis.timestamp)}</span>
				</div>
			</div>

			<div className='border border-foreground/10 bg-foreground/5 p-6 rounded-none'>
				{/* Header with execution time and plugins */}
				<div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-foreground/10 gap-4'>
					<div className='flex flex-col sm:flex-row sm:items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Zap className='w-4 h-4 text-sendo-green' />
							<span className='text-xs text-foreground/60'>Execution: {analysis.executionTimeMs}ms</span>
						</div>
						{analysis.pluginsUsed.length > 0 && (
							<div className='flex items-center gap-2 min-w-0'>
								<span className='text-xs text-foreground/40 flex-shrink-0'>Plugins:</span>
								<div className='flex gap-1 flex-wrap overflow-hidden'>
									{analysis.pluginsUsed.map((plugin, idx) => (
										<span
											key={idx}
											className='text-xs bg-sendo-orange/20 text-sendo-orange px-2 py-0.5 title-font flex-shrink-0'
										>
											{plugin.replace('plugin-', '')}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Analysis sections */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Wallet Overview */}
					<div className='space-y-2'>
						<div className='flex items-center gap-2 mb-3'>
							<div
								className='w-8 h-8 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center'
								style={{
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
								}}
							>
								<TrendingUp className='w-4 h-4 text-white' />
							</div>
							<h3 className='text-sm font-bold text-foreground uppercase title-font'>Wallet Overview</h3>
						</div>
						<p className='text-sm text-foreground/70 leading-relaxed'>{analysis.analysis.walletOverview}</p>
					</div>

					{/* Market Conditions */}
					<div className='space-y-2'>
						<div className='flex items-center gap-2 mb-3'>
							<div
								className='w-8 h-8 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center'
								style={{
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
								}}
							>
								<Brain className='w-4 h-4 text-white' />
							</div>
							<h3 className='text-sm font-bold text-foreground uppercase title-font'>Market Conditions</h3>
						</div>
						<p className='text-sm text-foreground/70 leading-relaxed'>{analysis.analysis.marketConditions}</p>
					</div>

					{/* Risk Assessment */}
					<div className='space-y-2'>
						<div className='flex items-center gap-2 mb-3'>
							<div
								className='w-8 h-8 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center'
								style={{
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
								}}
							>
								<AlertTriangle className='w-4 h-4 text-white' />
							</div>
							<h3 className='text-sm font-bold text-foreground uppercase title-font'>Risk Assessment</h3>
						</div>
						<p className='text-sm text-foreground/70 leading-relaxed'>{analysis.analysis.riskAssessment}</p>
					</div>

					{/* Opportunities */}
					<div className='space-y-2'>
						<div className='flex items-center gap-2 mb-3'>
							<div
								className='w-8 h-8 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center'
								style={{
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
								}}
							>
								<Target className='w-4 h-4 text-white' />
							</div>
							<h3 className='text-sm font-bold text-foreground uppercase title-font'>Opportunities</h3>
						</div>
						<p className='text-sm text-foreground/70 leading-relaxed'>{analysis.analysis.opportunities}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
