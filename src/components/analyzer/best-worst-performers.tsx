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
			className='bg-background border border-foreground/10 p-6 space-y-6'
			style={{ borderRadius: 0 }}
		>
			{/* Best Performer */}
			<div className='bg-[#14F195]/5 border border-[#14F195]/20 p-4' style={{ borderRadius: 0 }}>
				<div className='flex items-center gap-2 mb-3'>
					<div className='w-8 h-8 bg-[#14F195] flex items-center justify-center' style={{ borderRadius: 0 }}>
						<TrendingUp className='w-5 h-5 text-black' />
					</div>
					<h4 className='text-sm font-bold text-[#14F195] uppercase title-font'>BEST PERFORMER</h4>
				</div>
				<div className='space-y-2'>
					<div className='flex justify-between'>
						<span className='text-foreground/60 text-sm'>Token</span>
						<span className='text-foreground font-bold'>{best.token}</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-foreground/60 text-sm'>PnL</span>
						<span className='text-[#14F195] font-bold title-font'>+{best.pnl_sol.toFixed(4)} SOL</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-foreground/60 text-sm'>Volume</span>
						<span className='text-foreground'>{best.volume_sol.toFixed(3)} SOL</span>
					</div>
				</div>
			</div>

			{/* Worst Performer */}
			<div className='bg-[#FF223B]/5 border border-[#FF223B]/20 p-4' style={{ borderRadius: 0 }}>
				<div className='flex items-center gap-2 mb-3'>
					<div className='w-8 h-8 bg-[#FF223B] flex items-center justify-center' style={{ borderRadius: 0 }}>
						<TrendingDown className='w-5 h-5 text-white' />
					</div>
					<h4 className='text-sm font-bold text-[#FF223B] uppercase title-font'>WORST PERFORMER</h4>
				</div>
				<div className='space-y-2'>
					<div className='flex justify-between'>
						<span className='text-foreground/60 text-sm'>Token</span>
						<span className='text-foreground font-bold'>{worst.token}</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-foreground/60 text-sm'>PnL</span>
						<span className='text-[#FF223B] font-bold title-font'>{worst.pnl_sol.toFixed(4)} SOL</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-foreground/60 text-sm'>Volume</span>
						<span className='text-foreground'>{worst.volume_sol.toFixed(3)} SOL</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
