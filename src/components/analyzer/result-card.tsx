'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';

interface TokenData {
	symbol: string;
	ath_change_pct: number;
	missed_usd: number;
}

interface ResultData {
	total_missed_usd: number;
	tokens: TokenData[];
}

interface ResultCardProps {
	result: ResultData;
}

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		let startTime: number | undefined;
		let animationFrame: number;

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = (timestamp - startTime) / (duration * 1000);

			if (progress < 1) {
				setCount(Math.floor(end * progress));
				animationFrame = requestAnimationFrame(animate);
			} else {
				setCount(end);
			}
		};

		animationFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrame);
	}, [end, duration]);

	return <span>${count.toLocaleString()}</span>;
}

export default function ResultCard({ result }: ResultCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.6 }}
			className='bg-foreground/5 border border-foreground/10 p-6 md:p-8 relative overflow-hidden group hover:border-sendo-red/50 transition-all'
			style={{ borderRadius: 0 }}
		>
			{/* Glow effect */}
			<div className='absolute inset-0 bg-gradient-to-br from-sendo-orange/5 via-sendo-red/0 to-sendo-dark-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

			<div className='relative z-10'>
				<div className='flex items-center gap-2 mb-4'>
					<div
						className='w-10 h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center'
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
					>
						<TrendingDown className='w-6 h-6 text-white' />
					</div>
					<h3 className='text-foreground/60 uppercase text-sm '>TOTAL MISSED AT ATH</h3>
				</div>

				<div className='text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent '>
					<CountUp end={result.total_missed_usd} />
				</div>

				<div className='space-y-3'>
					<h4 className='text-foreground/40 text-xs uppercase mb-3 '>TOP PAIN POINTS</h4>
					{result.tokens.map((token, index) => (
						<div
							key={index}
							className='flex items-center justify-between p-3 bg-background/50 border border-foreground/5'
						>
							<div className='flex items-center gap-3'>
								<div
									className='w-8 h-8 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center text-white font-bold text-sm'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
								>
									{index + 1}
								</div>
								<div>
									<p className='text-foreground font-semibold'>{token.symbol}</p>
									<p className='text-foreground/40 text-xs'>{token.ath_change_pct}% from ATH</p>
								</div>
							</div>
							<div className='text-right'>
								<p className='text-sendo-red font-bold text-lg'>-${(token.missed_usd ?? 0).toLocaleString()}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}
