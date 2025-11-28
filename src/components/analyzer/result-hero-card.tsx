'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, MessageCircle, Send, Share2, Skull, TrendingDown, Twitter, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/ui/count-up';
import { downloadPainCard, getShareText, type PainCardData } from '@/lib/pain-card-generator';

interface TokenData {
	symbol: string;
	ath_price: number;
	trade_price?: number; // Average price at which trades were executed
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
	isProcessing?: boolean; // Whether analysis is still running
}

export default function ResultHeroCard({ result, isProcessing = false }: ResultHeroCardProps) {
	const [isGenerating, setIsGenerating] = useState(false);

	// Prepare pain card data
	const painCardData: PainCardData = {
		totalMissedUSD: result.total_missed_usd,
		rank: result.rank,
		topPainPoints: result.tokens.slice(0, 3).map((token, index) => ({
			symbol: token.symbol,
			missedUSD: token.missed_usd,
			rank: index + 1,
		})),
	};

	const shareText = getShareText(painCardData);

	const handleDownload = async () => {
		setIsGenerating(true);
		try {
			await downloadPainCard(painCardData);
			toast.success('Pain card downloaded! 💀', {
				description: 'Your pain is ready to share on social media',
			});
		} catch (error) {
			console.error('Error downloading pain card:', error);
			toast.error('Failed to generate pain card', {
				description: 'Please try again',
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const handleShareTwitter = () => {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
		window.open(url, '_blank');
		toast.info('Share on Twitter', {
			description: 'Download your pain card first to attach the image!',
		});
	};

	const handleShareTelegram = () => {
		const url = `https://t.me/share/url?url=${encodeURIComponent('https://sendo.ai')}&text=${encodeURIComponent(shareText)}`;
		window.open(url, '_blank');
		toast.info('Share on Telegram', {
			description: 'Download your pain card first to attach the image!',
		});
	};

	const handleShareDiscord = () => {
		navigator.clipboard.writeText(shareText);
		toast.success('Copied to clipboard! 📋', {
			description: 'Download your pain card and paste both in Discord!',
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.6 }}
			className='relative bg-black/40 border border-sendo-red/30 p-4 md:p-6 overflow-hidden backdrop-blur-sm'
			style={{ borderRadius: 0 }}
		>
			{/* Background gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-sendo-red/5 via-transparent to-sendo-dark-red/10 opacity-50' />

			{/* Decorative skull */}
			<div className='absolute top-8 right-8 opacity-5'>
				<Skull className='w-48 h-48 md:w-64 md:h-64 text-sendo-red' />
			</div>

			<div className='relative z-10'>
				{/* Title */}
				<div className='flex items-center gap-2 md:gap-3 mb-4 md:mb-6'>
					<div
						className='w-10 h-10 md:w-12 md:h-12 bg-sendo-red flex items-center justify-center'
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
					>
						<TrendingDown className='w-5 h-5 md:w-7 md:h-7 text-white' />
					</div>
					<h2 className='text-base md:text-xl text-foreground/80 uppercase title-font'>TOTAL MISSED AT ATH</h2>
				</div>

				{/* Big number */}
				<div className='mb-3 md:mb-4'>
					<span className='inline-block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-white via-sendo-red to-sendo-dark-red bg-clip-text text-transparent leading-none'>
						<CountUp
							end={result.total_missed_usd}
							separator={true}
							prefix='$'
							enableContinuous={true}
							isProcessing={isProcessing}
							pollInterval={5000}
							aggressiveness={0.4}
						/>
					</span>
				</div>

				{/* Subtitle */}
				<p className='text-base md:text-xl text-foreground/60 mb-6 md:mb-8'>
					You could've been rich... but you held 💀😭
				</p>

				{/* Top Pain Points & Share Section */}
				<div className='grid md:grid-cols-2 gap-4 md:gap-6'>
					{/* Top Pain Points */}
					<div>
						<h3 className='text-sm text-foreground/60 uppercase mb-4 title-font'>TOP PAIN POINTS</h3>
						<div className='grid gap-3'>
							{result.tokens.slice(0, 3).map((token, index) => (
								<div
									key={index}
									className='flex items-start justify-between gap-2 p-3 md:p-4 bg-black/40 border border-white/10 hover:border-sendo-red/30 transition-all'
									style={{ borderRadius: 0 }}
								>
									<div className='flex items-center gap-2 md:gap-3 min-w-0 flex-1'>
										<div
											className='w-8 h-8 md:w-10 md:h-10 bg-sendo-red flex items-center justify-center text-white font-bold text-xs title-font flex-shrink-0'
											style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
										>
											{index + 1}
										</div>
										<div className='min-w-0 flex-1'>
											<p className='text-foreground font-bold text-sm md:text-lg truncate'>{token.symbol}</p>
											<p className='text-foreground/40 text-xs md:text-sm'>
												<span className='block md:inline'>
													ATH: $
													{(token.ath_price ?? 0).toLocaleString('en-US', {
														minimumFractionDigits: 2,
														maximumFractionDigits: 8,
													})}
												</span>
												<span className='hidden md:inline'> • </span>
												<span className='block md:inline'>
													Avg Trade:{' '}
													{typeof token.trade_price === 'number'
														? `$${token.trade_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
														: 'N/A'}
												</span>
											</p>
										</div>
									</div>
									<div className='text-right flex-shrink-0'>
										<p className='text-sendo-red font-bold text-base md:text-xl whitespace-nowrap'>
											<CountUp
												end={token.missed_usd ?? 0}
												separator={true}
												prefix='-$'
												decimals={0}
												enableContinuous={true}
												isProcessing={isProcessing}
												pollInterval={5000}
												aggressiveness={0.6}
											/>
										</p>
										<p className='text-sendo-red/60 text-xs md:text-sm whitespace-nowrap'>
											<CountUp
												end={token.ath_change_pct}
												decimals={2}
												separator={false}
												enableContinuous={true}
												isProcessing={isProcessing}
												pollInterval={5000}
												aggressiveness={0.6}
											/>
											% from ATH
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Share Your Pain Section */}
					<div>
						<div className='flex items-center gap-2 mb-4'>
							<Share2 className='w-5 h-5 text-sendo-red' />
							<h3 className='text-foreground/60 uppercase text-sm title-font'>SHARE YOUR PAIN</h3>
						</div>

						<div className='space-y-3'>
							{/* Preview Card with Download Button Overlay */}
							<div
								className='relative bg-black/40 border border-white/10 p-4 overflow-hidden'
								style={{ borderRadius: 0 }}
							>
								{/* Blurred Preview Content */}
								<div className='blur-sm opacity-50 space-y-2'>
									<div className='h-4 bg-gradient-to-r from-sendo-red/30 to-sendo-dark-red/30 w-3/4'></div>
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
									<button
										type='button'
										onClick={handleDownload}
										disabled={isGenerating || isProcessing}
										className='arc-raiders-pill-button text-sm'
										style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										{isGenerating ? (
											<>
												<div className='w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin' />
												<span>GENERATING...</span>
											</>
										) : (
											<>
												<Download className='w-4 h-4 mr-2' />
												<span>DOWNLOAD CARD</span>
											</>
										)}
									</button>
								</div>
							</div>

							{/* Social Share Buttons */}
							<div className='grid grid-cols-3 gap-2'>
								<Button
									onClick={handleShareTwitter}
									disabled={isProcessing}
									className='bg-[#1DA1F2] text-white h-10 px-2 flex items-center justify-center gap-2 hover:brightness-110'
									style={{ borderRadius: 0 }}
								>
									<Twitter className='w-4 h-4' />
									<span className='text-xs font-bold ibm-font'>TWITTER</span>
								</Button>
								<Button
									onClick={handleShareTelegram}
									disabled={isProcessing}
									className='bg-[#0088cc] text-white h-10 px-2 flex items-center justify-center gap-2 hover:brightness-110'
									style={{ borderRadius: 0 }}
								>
									<Send className='w-4 h-4' />
									<span className='text-xs font-bold ibm-font'>TELEGRAM</span>
								</Button>
								<Button
									onClick={handleShareDiscord}
									disabled={isProcessing}
									className='bg-[#5865F2] text-white h-10 px-2 flex items-center justify-center gap-2 hover:brightness-110'
									style={{ borderRadius: 0 }}
								>
									<MessageCircle className='w-4 h-4' />
									<span className='text-xs font-bold ibm-font'>DISCORD</span>
								</Button>
							</div>

							<p className='text-foreground/40 text-xs mt-3'>Challenge a friend to analyze their wallet 👀</p>
						</div>
					</div>
				</div>

				{/* CTA Activate Worker - Full Width Below */}
				<div
					className='mt-6 bg-gradient-to-br from-sendo-red/10 via-black/40 to-black/40 border border-sendo-red/30 p-4 md:p-6 relative overflow-hidden group hover:border-sendo-red/50 transition-all'
					style={{ borderRadius: 0 }}
				>
					<div className='absolute top-0 right-0 w-32 h-32 bg-sendo-red/5 blur-3xl' />

					<div className='relative z-10 max-w-2xl mx-auto text-center'>
						<div className='flex items-center justify-center gap-2 mb-3'>
							<div
								className='w-8 h-8 bg-sendo-red flex items-center justify-center'
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
							>
								<Zap className='w-4 h-4 text-white' />
							</div>
							<h3 className='text-foreground uppercase text-sm font-bold title-font'>TIRED OF MISSING ATHS?</h3>
						</div>

						<p className='text-foreground/70 text-sm mb-6 whitespace-nowrap'>
							Activate the Worker to get real-time suggestions and automate your exit strategy. Never miss a top again
							🎯
						</p>

						<div className='opacity-50 cursor-not-allowed'>
							<button
								type='button'
								disabled={true}
								className='arc-raiders-pill-button text-sm md:text-base'
								style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
							>
								<span>ACTIVATE WORKER (SOON)</span>
								<ArrowRight className='w-4 h-4 ml-2' />
							</button>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
