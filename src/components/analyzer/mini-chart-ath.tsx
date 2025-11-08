'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CountUp } from '@/components/ui/count-up';

interface ChartDataPoint {
	name: string;
	value: number;
	rawValue: number;
}

interface MiniChartATHProps {
	data: {
		points: number[][];
		peakValue?: number; // ATH value in USD
		currentValue?: number; // Current value in USD
	};
}

export default function MiniChartATH({ data }: MiniChartATHProps) {
	// Transform points into recharts format with meaningful labels
	const labels = ['ATH', '', '', '', 'Now']; // Empty strings for intermediate points
	const chartData: ChartDataPoint[] = data.points.map((point, index) => ({
		name: labels[index] || '',
		value: point[1] * 100, // Convert to percentage
		rawValue: point[1],
	}));

	// Use provided values or calculate from performance ratio
	const performanceRatio = data.points[data.points.length - 1][1];
	const peakValue = data.peakValue || 100000; // Fallback to 100k if not provided
	const currentValue = data.currentValue !== undefined ? data.currentValue : peakValue * performanceRatio;
	// Calculate loss percent based on actual peak vs current values
	const lossPercent = peakValue > 0 ? Math.round(((peakValue - currentValue) / peakValue) * 100) : 0;

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className='bg-background border border-sendo-orange/30 p-3' style={{ borderRadius: 0 }}>
					<p className='text-foreground text-sm font-bold'>{payload[0].payload.name}</p>
					<p className='text-sendo-orange text-xs'>{payload[0].value.toFixed(1)}%</p>
					<p className='text-foreground/60 text-xs'>
						${((peakValue * payload[0].payload.rawValue) / 1000).toFixed(1)}k
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.4 }}
			className='bg-foreground/5 border border-foreground/10 p-4 md:p-6 relative overflow-hidden group hover:border-sendo-orange/50 transition-all'
			style={{ borderRadius: 0 }}
		>
			<div className='flex items-center gap-2 mb-4 md:mb-6'>
				<TrendingDown className='w-4 h-4 md:w-5 md:h-5 text-sendo-red flex-shrink-0' />
				<h3 className='text-foreground/60 uppercase text-xs md:text-sm title-font'>MONEY LEFT ON THE TABLE</h3>
			</div>

			<div className='h-56 md:h-64 lg:h-80 mb-4 md:mb-6'>
				<ResponsiveContainer width='100%' height='100%'>
					<AreaChart data={chartData}>
						<defs>
							<linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#FF6B00' stopOpacity={0.3} />
								<stop offset='95%' stopColor='#FF223B' stopOpacity={0.05} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray='3 3' stroke='#F2EDE7' strokeOpacity={0.1} />
						<XAxis
							dataKey='name'
							stroke='#F2EDE7'
							strokeOpacity={0.4}
							style={{ fontSize: '10px' }}
							className='md:text-xs'
						/>
						<YAxis
							stroke='#F2EDE7'
							strokeOpacity={0.4}
							style={{ fontSize: '10px' }}
							className='md:text-xs'
							tickFormatter={(value) => `${value}%`}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Area
							type='monotone'
							dataKey='value'
							stroke='#FF223B'
							strokeWidth={2}
							fillOpacity={1}
							fill='url(#colorValue)'
							animationDuration={2000}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			<div className='grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-6 border-t border-foreground/10'>
				<div className='min-w-0'>
					<p className='text-foreground/40 text-[10px] md:text-xs mb-1 uppercase title-font truncate'>MISSED GAINS</p>
					<p className='text-sendo-orange font-bold text-sm md:text-lg truncate'>
						$<CountUp end={peakValue / 1000} decimals={1} separator={false} />k
					</p>
				</div>
				<div className='min-w-0'>
					<p className='text-foreground/40 text-[10px] md:text-xs mb-1 uppercase title-font truncate'>ACTUAL LOSS</p>
					<p className='text-sendo-red font-bold text-sm md:text-lg truncate'>
						-$<CountUp end={currentValue / 1000} decimals={1} separator={false} />k
					</p>
				</div>
				<div className='min-w-0'>
					<p className='text-foreground/40 text-[10px] md:text-xs mb-1 uppercase title-font truncate'>% LEFT BEHIND</p>
					<p className='text-sendo-red font-bold text-sm md:text-lg'>
						-<CountUp end={lossPercent} decimals={0} separator={false} />%
					</p>
				</div>
			</div>
		</motion.div>
	);
}
