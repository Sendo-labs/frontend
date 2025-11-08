'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { CountUp } from '@/components/ui/count-up';

interface DistributionData {
	in_profit: number;
	in_loss: number;
	still_held: number;
}

interface Performer {
	token: string;
	pnl_usd: number;
	volume_sol: number;
}

interface TokenDistributionProps {
	distribution: DistributionData;
	best: Performer;
	worst: Performer;
}

export default function TokenDistribution({ distribution, best, worst }: TokenDistributionProps) {
	// Calculate total for percentage calculation
	const total = distribution.in_profit + distribution.in_loss + distribution.still_held;

	// Calculate percentages, avoiding division by zero
	const calculatePct = (value: number) => (total > 0 ? (value / total) * 100 : 0);

	const items = [
		{
			label: 'In Profit',
			value: distribution.in_profit,
			color: 'text-sendo-green',
			pct: calculatePct(distribution.in_profit),
		},
		{ label: 'In Loss', value: distribution.in_loss, color: 'text-sendo-red', pct: calculatePct(distribution.in_loss) },
		{
			label: 'Still Held',
			value: distribution.still_held,
			color: 'text-sendo-orange',
			pct: calculatePct(distribution.still_held),
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: 0.4, duration: 0.6 }}
			className='bg-background border border-foreground/10 p-4 md:p-6 space-y-4 md:space-y-6'
			style={{ borderRadius: 0 }}
		>
			{/* Token Distribution Section */}
			<div>
				<div className='flex items-center gap-2 mb-4 md:mb-6'>
					<PieChart className='w-4 h-4 md:w-5 md:h-5 text-sendo-orange flex-shrink-0' />
					<h3 className='text-sm md:text-lg font-bold text-foreground uppercase title-font'>TOKEN DISTRIBUTION</h3>
				</div>

				<div className='space-y-3 md:space-y-4'>
					{items.map((item, index) => (
						<div key={index} className='flex items-center justify-between gap-2'>
							<span className='text-foreground/70 text-xs md:text-sm flex-shrink-0'>{item.label}</span>
							<div className='flex items-center gap-2 md:gap-3 flex-shrink-0'>
								<span className={`font-bold text-base md:text-lg ${item.color}`}>
									<CountUp end={item.value} decimals={0} separator={false} />
								</span>
								<span className='text-foreground/40 text-[10px] md:text-xs w-10 md:w-12 text-right'>
									{item.pct > 0 ? (
										<>
											(<CountUp end={item.pct} decimals={1} separator={false} />
											%)
										</>
									) : (
										''
									)}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Best Performer Section */}
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
							+$
							<CountUp end={best.pnl_usd} decimals={2} separator={false} />
						</span>
					</div>
					<div className='flex justify-between gap-2'>
						<span className='text-foreground/60 text-xs md:text-sm flex-shrink-0'>Volume</span>
						<span className='text-foreground text-xs md:text-sm flex-shrink-0'>
							<CountUp end={best.volume_sol} decimals={3} separator={false} /> SOL
						</span>
					</div>
				</div>
			</div>

			{/* Worst Performer Section */}
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
							-$
							<CountUp end={Math.abs(worst.pnl_usd)} decimals={2} separator={false} />
						</span>
					</div>
					<div className='flex justify-between gap-2'>
						<span className='text-foreground/60 text-xs md:text-sm flex-shrink-0'>Volume</span>
						<span className='text-foreground text-xs md:text-sm flex-shrink-0'>
							<CountUp end={worst.volume_sol} decimals={3} separator={false} /> SOL
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
