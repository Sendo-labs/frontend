'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, TrendingDown, Target, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
	name: string;
	status: 'LIVE' | 'SOON';
	tagline: string;
	description: string;
	link: string;
	color: string;
	icon: typeof Zap;
	available: boolean;
}

const PRODUCTS: Product[] = [
	{
		name: 'ANALYZER',
		status: 'LIVE',
		tagline: 'Calculate Your Pain 💀',
		description: 'See exactly how much you lost by not selling at ATH. Earn insights from your on-chain history.',
		link: '/analyzer',
		color: 'from-[#FF6B00] to-[#FF223B]',
		icon: TrendingDown,
		available: true,
	},
	{
		name: 'WORKER',
		status: 'SOON',
		tagline: 'Automate or Die ⚡',
		description: '24/7 AI trading bot. Set rules, connect wallet, profit while you sleep. No more panic sells.',
		link: '/worker',
		color: 'from-[#14F195] to-[#00D9B5]',
		icon: Zap,
		available: false,
	},
	{
		name: 'MARKETPLACE',
		status: 'SOON',
		tagline: 'Level Up Your Bot 🚀',
		description: 'Plugins, strategies, alpha. Community-built tools to maximize gains and minimize regret.',
		link: '/marketplace',
		color: 'from-[#A855F7] to-[#EC4899]',
		icon: Target,
		available: false,
	},
];

export default function ThreeProductsSection() {
	return (
		<section className='py-12 sm:py-20 px-4 sm:px-6'>
			<div className='max-w-7xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className='text-center mb-12 sm:mb-16'
				>
					<h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 uppercase px-4 title-font'>
						THREE{' '}
						<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
							PRODUCTS
						</span>
					</h2>
					<p className='text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto px-4'>
						Simple tools. Big results. No BS.
					</p>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6'>
					{PRODUCTS.map((product, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className={`bg-foreground/5 border-2 ${
								product.available
									? 'border-foreground/10 hover:border-sendo-orange/50'
									: 'border-foreground/5'
							} p-6 sm:p-8 relative overflow-hidden transition-all ${product.available ? 'hover:shadow-2xl' : ''}`}
							style={{
								clipPath:
									'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
							}}
						>
							{/* Status Badge */}
							<div
								className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 text-xs font-bold uppercase ${
									product.available ? 'bg-[#14F195] text-background' : 'bg-foreground/10 text-foreground/60'
								}`}
								style={{ borderRadius: 0 }}
							>
								{product.status}
							</div>

							{/* Icon */}
							<div
								className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${product.color} flex items-center justify-center mb-4 sm:mb-6 ${
									!product.available && 'opacity-40'
								}`}
								style={{
									clipPath:
										'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
								}}
							>
								<product.icon className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
							</div>

							{/* Product Name */}
							<h3
								className={`text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 uppercase ${
									!product.available && 'text-foreground/40'
								} title-font`}
							>
								{product.name}
							</h3>

							{/* Tagline */}
							<p
								className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${
									product.available ? 'text-foreground' : 'text-foreground/40'
								}`}
							>
								{product.tagline}
							</p>

							{/* Description */}
							<p
								className={`text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 ${
									product.available ? 'text-foreground/70' : 'text-foreground/40'
								}`}
							>
								{product.description}
							</p>

							{/* CTA */}
							{product.available ? (
								<Link href={product.link}>
									<Button
										className={`w-full bg-gradient-to-r ${product.color} text-white hover:shadow-lg h-10 sm:h-12 uppercase font-bold text-sm`}
										style={{ borderRadius: 0 }}
									>
										<span className='title-font'>TRY NOW</span>
										<ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 ml-2' />
									</Button>
								</Link>
							) : (
								<Button
									disabled
									className='w-full bg-foreground/5 text-foreground/40 h-10 sm:h-12 uppercase font-bold cursor-not-allowed text-sm'
									style={{ borderRadius: 0 }}
								>
									<Lock className='w-3 h-3 sm:w-4 sm:h-4 mr-2' />
									<span className='title-font'>COMING SOON</span>
								</Button>
							)}
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

