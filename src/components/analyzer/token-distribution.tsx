'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import { CountUp } from '@/components/ui/count-up';

interface DistributionData {
	in_profit: number;
	in_loss: number;
	still_held: number;
}

interface TokenDistributionProps {
	distribution: DistributionData;
}

export default function TokenDistribution({ distribution }: TokenDistributionProps) {
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
			className='bg-background border border-foreground/10 p-4 md:p-6'
			style={{ borderRadius: 0 }}
		>
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
		</motion.div>
	);
}
