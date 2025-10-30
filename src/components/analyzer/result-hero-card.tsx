'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Skull } from 'lucide-react';

interface TokenData {
	symbol: string;
	ath_price: number;
	sold_price?: number;
	ath_change_pct: number;
	missed_usd: number;
}

interface ResultData {
	total_missed_usd: number;
	tokens: TokenData[];
}

interface ResultHeroCardProps {
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

export default function ResultHeroCard({ result }: ResultHeroCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.6 }}
			className='relative bg-background border-2 border-sendo-red/30 p-8 md:p-12 overflow-hidden'
			style={{ borderRadius: 0 }}
		>
			{/* Background gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-sendo-orange/10 via-transparent to-sendo-red/10 opacity-50' />

			{/* Decorative skull */}
			<div className='absolute top-8 right-8 opacity-5'>
				<Skull className='w-48 h-48 md:w-64 md:h-64 text-sendo-red' />
			</div>

			<div className='relative z-10'>
				{/* Title */}
				<div className='flex items-center gap-3 mb-6'>
					<div
						className='w-12 h-12 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center'
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
					>
						<TrendingDown className='w-7 h-7 text-white' />
					</div>
					<h2 className='text-lg md:text-xl text-foreground/60 uppercase title-font'>TOTAL MISSED AT ATH</h2>
				</div>

				{/* Big number */}
				<div className='text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent leading-none title-font'>
					<CountUp end={result.total_missed_usd} />
				</div>

				{/* Subtitle */}
				<p className='text-lg md:text-xl text-foreground/60 mb-8'>You could've been rich... but you held 💀😭</p>

				{/* Top Pain Points */}
				<div>
					<h3 className='text-sm text-foreground/40 uppercase mb-4 title-font'>TOP PAIN POINTS</h3>
					<div className='grid gap-3'>
						{result.tokens.slice(0, 3).map((token, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-4 bg-foreground/5 border border-foreground/10 hover:border-sendo-red/30 transition-all'
								style={{ borderRadius: 0 }}
							>
								<div className='flex items-center gap-4'>
									<div
										className='w-10 h-10 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center text-white font-bold title-font'
										style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
									>
										{index + 1}
									</div>
									<div>
										<p className='text-foreground font-bold text-lg'>{token.symbol}</p>
										<p className='text-foreground/40 text-sm'>
								ATH: ${(token.ath_price ?? 0).toFixed(8)} • Sold: $
								{typeof token.sold_price === 'number' ? token.sold_price.toFixed(8) : 'Still Held'}
										</p>
									</div>
								</div>
								<div className='text-right'>
								<p className='text-sendo-red font-bold text-xl title-font'>-${(token.missed_usd ?? 0).toLocaleString()}</p>
									<p className='text-sendo-red/60 text-sm'>{token.ath_change_pct}% from ATH</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
