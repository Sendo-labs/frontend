'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface PerformanceData {
	total_volume_sol: number;
	total_pnl_sol: number;
	success_rate: number;
	tokens_analyzed: number;
}

interface PerformanceMetricsProps {
	performance: PerformanceData;
}

export default function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
	const metrics = [
		{
			icon: DollarSign,
			label: 'TOTAL VOLUME',
			value: `${performance.total_volume_sol.toFixed(3)} SOL`,
			color: 'text-foreground',
		},
		{
			icon: TrendingUp,
			label: 'TOTAL PNL',
			value: `${performance.total_pnl_sol >= 0 ? '+' : ''}${performance.total_pnl_sol.toFixed(3)} SOL`,
			color: performance.total_pnl_sol >= 0 ? 'text---sendo-green' : 'text-sendo-red',
		},
		{ icon: Target, label: 'SUCCESS RATE', value: `${performance.success_rate}%`, color: 'text-foreground' },
		{ icon: BarChart3, label: 'TOKENS ANALYZED', value: performance.tokens_analyzed, color: 'text-foreground' },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3, duration: 0.6 }}
			className='bg-background border border-foreground/10 p-6'
			style={{ borderRadius: 0 }}
		>
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
				{metrics.map((metric, index) => (
					<div key={index} className='flex items-start gap-3'>
						<div
							className='w-8 h-8 bg-foreground/10 flex items-center justify-center flex-shrink-0'
							style={{ borderRadius: 0 }}
						>
							<metric.icon className='w-4 h-4 text-sendo-orange' />
						</div>
						<div>
							<p className='text-xs text-foreground/40 uppercase mb-1 title-font'>{metric.label}</p>
							<p className={`text-xl font-bold ${metric.color} title-font`}>{metric.value}</p>
						</div>
					</div>
				))}
			</div>
		</motion.div>
	);
}
