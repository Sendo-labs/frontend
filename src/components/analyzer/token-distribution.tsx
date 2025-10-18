'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

interface DistributionData {
	in_profit: number;
	in_loss: number;
	fully_sold: number;
	still_held: number;
}

interface TokenDistributionProps {
	distribution: DistributionData;
}

export default function TokenDistribution({ distribution }: TokenDistributionProps) {
	const items = [
		{ label: 'In Profit', value: distribution.in_profit, color: 'text---sendo-green', pct: 50 },
		{ label: 'In Loss', value: distribution.in_loss, color: 'text-sendo-red', pct: 33.3 },
		{ label: 'Fully Sold', value: distribution.fully_sold, color: 'text-foreground', pct: 0 },
		{ label: 'Still Held', value: distribution.still_held, color: 'text-sendo-orange', pct: 16.7 },
	];

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: 0.4, duration: 0.6 }}
			className='bg-background border border-foreground/10 p-6'
			style={{ borderRadius: 0 }}
		>
			<div className='flex items-center gap-2 mb-6'>
				<PieChart className='w-5 h-5 text-sendo-orange' />
				<h3 className='text-lg font-bold text-foreground uppercase title-font'>TOKEN DISTRIBUTION</h3>
			</div>

			<div className='space-y-4'>
				{items.map((item, index) => (
					<div key={index} className='flex items-center justify-between'>
						<span className='text-foreground/70 text-sm'>{item.label}</span>
						<div className='flex items-center gap-3'>
							<span className={`font-bold text-lg ${item.color} title-font`}>{item.value}</span>
							<span className='text-foreground/40 text-xs w-12 text-right'>{item.pct > 0 ? `(${item.pct}%)` : ''}</span>
						</div>
					</div>
				))}
			</div>
		</motion.div>
	);
}
