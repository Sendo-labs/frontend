'use client';

import React from 'react';
import { List } from 'lucide-react';
import type { TokenAnalysisResult } from '@sendo-labs/plugin-sendo-analyser';

interface TokenAnalysisListProps {
	tokens: TokenAnalysisResult[];
	totalCount?: number;
}

export default function TokenAnalysisList({ tokens, totalCount }: TokenAnalysisListProps) {
	const displayCount = totalCount || tokens.length;

	return (
		<div className='bg-background border border-foreground/10 p-4 md:p-6' style={{ borderRadius: 0 }}>
			{/* Header */}
			<div className='flex items-center gap-2 mb-6'>
				<List className='w-5 h-5 text-sendo-orange' />
				<h3 className='text-lg font-bold text-foreground uppercase title-font'>TOKEN ANALYSIS ({displayCount})</h3>
			</div>

			{/* Token List */}
			<div className='space-y-3'>
				{tokens.map((token, index) => {
					const totalVolumeUSD = Number(token.totalVolumeUSD);
					const totalVolumeSOL = Number(token.totalVolumeSOL);
					const totalGainLoss = Number(token.totalGainLoss);
					const totalMissedATH = Number(token.totalMissedATH);
					const avgPurchasePrice = token.averagePurchasePrice ? Number(token.averagePurchasePrice) : 0;
					const avgAthPrice = token.averageAthPrice ? Number(token.averageAthPrice) : 0;

					const isProfit = totalGainLoss >= 0;

					return (
						<div
							key={token.id}
							className='bg-foreground/5 border border-foreground/10 p-3 md:p-4 hover:border-sendo-orange/30 transition-all'
							style={{ borderRadius: 0 }}
						>
							{/* Header */}
							<div className='flex items-start justify-between mb-3 gap-2'>
								<div className='flex items-center gap-2 md:gap-3 min-w-0 flex-1'>
									<div
										className={`w-8 h-8 md:w-10 md:h-10 ${
											isProfit ? 'bg-sendo-green' : 'bg-sendo-red'
										} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
										style={{ borderRadius: 0 }}
									>
										{(token.symbol || 'UNK').slice(0, 2)}
									</div>
									<div className='min-w-0 flex-1'>
										<h4 className='text-foreground font-bold text-sm md:text-lg truncate'>
											{token.symbol || 'Unknown'}
										</h4>
										<p className='text-foreground/40 text-[10px] md:text-xs font-mono truncate'>
											{token.mint.slice(0, 4)}...{token.mint.slice(-6)}
										</p>
									</div>
								</div>

								{/* Profit badge */}
								<div className='flex flex-col items-end gap-1 flex-shrink-0'>
									<div
										className={`px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold title-font whitespace-nowrap ${
											isProfit ? 'bg-sendo-green/10 text-sendo-green' : 'bg-sendo-red/10 text-sendo-red'
										}`}
										style={{ borderRadius: 0 }}
									>
										{isProfit ? 'PROFIT' : 'LOSS'}
									</div>
									<div
										className='px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold title-font whitespace-nowrap bg-foreground/10 text-foreground'
										style={{ borderRadius: 0 }}
									>
										{token.trades} TRADES
									</div>
								</div>
							</div>

							{/* Stats Grid */}
							<div className='grid grid-cols-2 gap-3 md:gap-4 pt-3 border-t border-foreground/10'>
								<div className='min-w-0'>
									<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>Volume (USD)</p>
									<p className='text-foreground font-bold text-xs md:text-sm truncate'>
										${totalVolumeUSD.toLocaleString()}
									</p>
								</div>
								<div className='min-w-0'>
									<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>Volume (SOL)</p>
									<p className='text-sendo-orange font-bold text-xs md:text-sm truncate'>
										{totalVolumeSOL.toFixed(2)} SOL
									</p>
								</div>
								<div className='min-w-0'>
									<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>Total PnL</p>
									<p
										className={`font-bold text-xs md:text-sm truncate ${
											isProfit ? 'text-sendo-green' : 'text-sendo-red'
										}`}
									>
										{isProfit ? '+' : ''}${totalGainLoss.toLocaleString()}
									</p>
								</div>
								<div className='min-w-0'>
									<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>Missed at ATH</p>
									<p className='text-sendo-red font-bold text-xs md:text-sm truncate'>
										${totalMissedATH.toLocaleString()}
									</p>
								</div>
								{avgPurchasePrice > 0 && (
									<div className='min-w-0'>
										<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>Avg Purchase</p>
										<p className='text-foreground font-bold text-xs md:text-sm truncate'>
											${avgPurchasePrice.toFixed(8)}
										</p>
									</div>
								)}
								{avgAthPrice > 0 && (
									<div className='min-w-0'>
										<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>Avg ATH</p>
										<p className='text-sendo-red font-bold text-xs md:text-sm truncate'>${avgAthPrice.toFixed(8)}</p>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
