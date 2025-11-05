import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingDown, DollarSign, Wallet } from 'lucide-react';

interface Stat {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: number;
	format: 'number' | 'currency';
}

const stats: Stat[] = [
	{ icon: Wallet, label: 'WALLETS SCANNED', value: 12847, format: 'number' },
	{ icon: DollarSign, label: 'TOTAL ATH MISSED', value: 247893421, format: 'currency' },
	{ icon: TrendingDown, label: 'AVERAGE LOSS', value: 19287, format: 'currency' },
	{ icon: Users, label: 'BROKEN HEARTS', value: 12847, format: 'number' },
];

function formatNumber(num: number, format: string) {
	if (format === 'currency') {
		if (num >= 1000000) {
			return `$${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `$${(num / 1000).toFixed(0)}k`;
		}
		return `$${num.toLocaleString()}`;
	}

	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	} else if (num >= 1000) {
		return `${(num / 1000).toFixed(0)}k`;
	}
	return num.toLocaleString();
}

function CountUp({ end, duration = 2, format = 'number' }: { end: number; duration?: number; format?: string }) {
	const [count, setCount] = useState(0);

	useEffect(() => {
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

	return <span>{formatNumber(count, format)}</span>;
}

export default function StatisticsSection() {
	return (
		<section className='relative w-full h-screen flex items-center justify-center bg-background py-8 md:py-12 overflow-hidden'>
			<div className='max-w-[1400px] mx-auto w-full px-4 sm:px-6'>
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-3 md:mb-4 text-foreground title-font'
				>
					THE{' '}
					<span className='bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#4A0C13] bg-clip-text text-transparent'>DAMAGE</span>
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className='text-xs sm:text-sm md:text-base lg:text-lg text-foreground/60 text-center mb-6 sm:mb-8 md:mb-12'
				>
					Collective pain measured in real numbers
				</motion.p>

				<div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className='relative group'
						>
							<div className='bg-foreground/5 border border-foreground/10 p-3 sm:p-4 md:p-6 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all duration-300 h-full'>
									<div
									className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#4A0C13] flex items-center justify-center group-hover:scale-110 transition-transform duration-300'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
								>
									<stat.icon className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white' />
								</div>

									<div className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2 text-center title-font numeric-font'>
									<CountUp end={stat.value} format={stat.format} />
								</div>

								<p className='text-foreground/60 text-center text-[10px] sm:text-xs md:text-sm uppercase tracking-wider'>
									{stat.label}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className='mt-6 sm:mt-8 md:mt-12 text-center px-4'
				>
					<p className='text-foreground/40 text-xs sm:text-sm md:text-base italic'>
						"Every number represents a diamond hand that held too long..."
					</p>
				</motion.div>
			</div>
		</section>
	);
}
