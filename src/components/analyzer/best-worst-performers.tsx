'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Performer {
	token: string;
	pnl_sol: number;
	volume_sol: number;
}

interface BestWorstPerformersProps {
	best: Performer;
	worst: Performer;
}

export default function BestWorstPerformers({ best, worst }: BestWorstPerformersProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: 0.4, duration: 0.6 }}
			className='bg-background border border-foreground/10 p-4 md:p-6 space-y-4 md:space-y-6'
			style={{ borderRadius: 0 }}
		>
			{/* Best Performer */}
			<div className='bg-sendo-green/5 border border-sendo-green/20 p-3 md:p-4' style={{ borderRadius: 0 }}>
				<div className='flex items-center gap-2 mb-3'>
					<div
						className='w-7 h-7 md:w-8 md:h-8 bg-sendo-green flex items-center justify-center flex-shrink-0'
						style={{ borderRadius: 0 }}
					>
						<TrendingUp className='w-4 h-4 md:w-5 md:h-5 text-black' />
					</div>
					<h4 className='text-xs md:text-sm font-bold text-sendo-green uppercase title-font'>BEST PERFORMER</h4>
				</div>
				<div className='space-y-2'>
					<div className='flex justify-between gap-2'>
						<span className='text-foreground/60 text-xs md:text-sm flex-shrink-0'>Token</span>
						<span className='text-foreground font-bold text-xs md:text-sm truncate text-right'>{best.token}</span>
					</div>
					<div className='flex justify-between gap-2'>
						<span className='text-foreground/60 text-xs md:text-sm flex-shrink-0'>PnL</span>
						<span className='text-sendo-green font-bold text-xs md:text-sm flex-shrink-0'>
							+{best.pnl_sol.toFixed(4)} SOL
						</span>
					</div>
					<div className='flex justify-between gap-2'>
						<span className='text-foreground/60 text-xs md:text-sm flex-shrink-0'>Volume</span>
						<span className='text-foreground text-xs md:text-sm flex-shrink-0'>{best.volume_sol.toFixed(3)} SOL</span>
					</div>
				</div>
			</div>

			{/* Worst Performer */}
			<div className='bg-sendo-red/5 border border-sendo-red/20 p-3 md:p-4' style={{ borderRadius: 0 }}>
				<div className='flex items-center gap-2 mb-3'>
					<div
						className='w-7 h-7 md:w-8 md:h-8 bg-sendo-red flex items-center justify-center flex-shrink-0'
						style={{ borderRadius: 0 }}
					>
						<TrendingDown className='w-4 h-4 md:w-5 md:h-5 text-white' />
					</div>
					<h4 className='text-xs md:text-sm font-bold text-sendo-red uppercase title-font'>WORST PERFORMER</h4>
				</div>
				<div className='space-y-2'>
					<div className='flex justify-between gap-2'>
						<span className='text-foreground/60 text-xs md:text-sm flex-shrink-0'>Token</span>
						<span className='text-foreground font-bold text-xs md:text-sm truncate text-right'>{worst.token}</span>
					</div>
					<div className='flex justify-between gap-2'>
						<span className='text-foreground/60 text-xs md:text-sm flex-shrink-0'>PnL</span>
						<span className='text-sendo-red font-bold text-xs md:text-sm flex-shrink-0'>
							{worst.pnl_sol.toFixed(4)} SOL
						</span>
					</div>
					<div className='flex justify-between gap-2'>
						<span className='text-foreground/60 text-xs md:text-sm flex-shrink-0'>Volume</span>
						<span className='text-foreground text-xs md:text-sm flex-shrink-0'>{worst.volume_sol.toFixed(3)} SOL</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
