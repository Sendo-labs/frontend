'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Skull, Share2, Twitter, Send, Download, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
	rank?: string;
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
	const handleShareTwitter = () => {
		const text = `I missed $${(result.total_missed_usd ?? 0).toLocaleString()} by not selling at ATH! 💀\n\nRank: ${result.rank || 'Pain Holder'}\n\nCheck your pain at sendo.ai`;
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	};

	const handleShareTelegram = () => {
		const text = `I missed $${(result.total_missed_usd ?? 0).toLocaleString()} by not selling at ATH! 💀\n\nCheck your pain at sendo.ai`;
		const url = `https://t.me/share/url?url=${encodeURIComponent('https://sendo.ai')}&text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	};

	const handleShareDiscord = () => {
		const text = `I missed $${(result.total_missed_usd ?? 0).toLocaleString()} by not selling at ATH! 💀 Rank: ${result.rank || 'Pain Holder'}\n\nCheck your pain at sendo.ai`;
		navigator.clipboard.writeText(text);
		alert('Copied to clipboard! Paste in Discord 📋');
	};

	const handleDownload = async () => {
		// Mock download - in real implementation would generate image
		console.log('Downloading pain card...');
		alert('Pain card download coming soon! 🎨');
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.6 }}
			className='relative bg-background border-2 border-sendo-red/30 p-8 md:p-12 overflow-hidden'
			style={{ borderRadius: 0 }}
		>
			{/* Background gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-sendo-orange/10 via-sendo-red/0 to-sendo-dark-red/10 opacity-50' />

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
				<div className='text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent leading-none'>
					<CountUp end={result.total_missed_usd} />
				</div>

				{/* Subtitle */}
				<p className='text-lg md:text-xl text-foreground/60 mb-8'>You could've been rich... but you held 💀😭</p>

				{/* Top Pain Points & Share Section */}
				<div className='grid md:grid-cols-2 gap-6 md:gap-8'>
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
										<p className='text-sendo-red font-bold text-xl'>-${(token.missed_usd ?? 0).toLocaleString()}</p>
										<p className='text-sendo-red/60 text-sm'>{token.ath_change_pct}% from ATH</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Share Your Pain Section */}
					<div>
						<div className='flex items-center gap-2 mb-4'>
							<Share2 className='w-5 h-5 text-sendo-orange' />
							<h3 className='text-foreground/60 uppercase text-sm title-font'>SHARE YOUR PAIN</h3>
						</div>

						<div className='space-y-3'>
							{/* Preview Card with Download Button Overlay */}
							<div className='relative bg-foreground/5 border border-foreground/10 p-4 overflow-hidden' style={{ borderRadius: 0 }}>
								{/* Blurred Preview Content */}
								<div className='blur-sm opacity-50 space-y-2'>
									<div className='h-4 bg-gradient-to-r from-sendo-orange/30 to-sendo-red/30 w-3/4'></div>
									<div className='h-8 bg-gradient-to-r from-sendo-red/40 to-sendo-dark-red/40 w-full'></div>
									<div className='h-3 bg-foreground/20 w-1/2'></div>
									<div className='grid grid-cols-3 gap-2 mt-2'>
										<div className='h-12 bg-foreground/30'></div>
										<div className='h-12 bg-foreground/30'></div>
										<div className='h-12 bg-foreground/30'></div>
									</div>
								</div>

								{/* Download Button Overlay */}
								<div className='absolute inset-0 flex items-center justify-center'>
									<Button
										onClick={handleDownload}
										className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-12 px-6 title-font'
										style={{
											clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
											borderRadius: 0,
										}}
									>
										<Download className='w-4 h-4 mr-2' />
										DOWNLOAD PAIN CARD 💀
									</Button>
								</div>
							</div>

							{/* Social Share Buttons */}
							<div className='grid grid-cols-3 gap-2'>
								<Button
									onClick={handleShareTwitter}
									className='bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white h-10 px-3 flex items-center gap-2'
									style={{ borderRadius: 0 }}
								>
									<Twitter className='w-4 h-4' />
									<span className='text-xs font-semibold'>Twitter</span>
								</Button>
								<Button
									onClick={handleShareTelegram}
									className='bg-[#0088cc] hover:bg-[#0077b3] text-white h-10 px-3 flex items-center gap-2'
									style={{ borderRadius: 0 }}
								>
									<Send className='w-4 h-4' />
									<span className='text-xs font-semibold'>Telegram</span>
								</Button>
								<Button
									onClick={handleShareDiscord}
									className='bg-[#5865F2] hover:bg-[#4752C4] text-white h-10 px-3 flex items-center gap-2'
									style={{ borderRadius: 0 }}
								>
									<MessageCircle className='w-4 h-4' />
									<span className='text-xs font-semibold'>Discord</span>
								</Button>
							</div>

							<p className='text-foreground/40 text-xs mt-3'>Challenge a friend to analyze their wallet 👀</p>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
