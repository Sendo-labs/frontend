import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { createPageUrl } from '@/lib/utils';
import WalletInput from '@/components/analyzer/wallet-input';
import { getShameLeaderboard } from '@/actions/analyzer/get';
import type { LeaderboardEntry } from '@sendo-labs/plugin-sendo-analyser';

export default function HeroSection() {
	const [topLoosers, setTopLoosers] = useState<LeaderboardEntry[]>([]);

	// Fetch top 3 loosers on mount
	useEffect(() => {
		const fetchTopLoosers = async () => {
			try {
				const result = await getShameLeaderboard(3, 'week');
				if (result.success) {
					setTopLoosers(result.data.entries);
				}
			} catch (error) {
				console.error('Failed to fetch top loosers:', error);
			}
		};
		fetchTopLoosers();
	}, []);

	// Handle wallet analysis - redirect to analyzer page
	const handleAnalyze = (walletAddress: string) => {
		if (!walletAddress.trim()) return;
		window.location.href = createPageUrl('Analyzer');
	};

	const formatWallet = (wallet: string) => {
		return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
	};

	const handleLooserClick = () => {
		window.location.href = createPageUrl('Leaderboard');
	};

	return (
		<section className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
			{/* Background avec dégradé */}
			<div className='absolute inset-0' style={{ zIndex: 0 }}>
				{/* Dégradé de couleur de fond - HORIZONTAL de gauche à droite */}
				<div className='absolute inset-0 bg-gradient-to-r from-[#FFBDA3] via-[#FFA7B0] to-[#E89E9E]' />

				{/* Image du personnage */}
				<motion.div
					className='absolute inset-0 flex items-center justify-center'
					initial={{ scale: 1.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 2, ease: 'easeOut' }}
				>
					<div
						className='absolute inset-0 bg-cover md:bg-contain bg-center bg-no-repeat'
						style={{
							backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/badd9c67d_banner-background-min.png')`,
							backgroundPosition: 'center center',
						}}
					/>
				</motion.div>

				{/* Dégradé vertical transparent vers noir pour la transition */}
				<div
					className='absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background'
					style={{ zIndex: 1 }}
				/>
			</div>

			{/* Content */}
			<div className='relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 text-center py-8 md:py-12 lg:py-16'>
				{/* Tagline */}
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7, duration: 0.8 }}
					className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 text-foreground title-font'
				>
					HOW MUCH DID
					<br />
					<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
						YOU LOSE?
					</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.9, duration: 0.8 }}
					className='text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 mb-4 sm:mb-6 md:mb-8 font-light'
				>
					Stop bagholding. Custom AI agents will catch the next ATH for you.
				</motion.p>

				{/* Wallet Connection */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.1, duration: 0.8 }}
					className='max-w-2xl mx-auto'
				>
					<WalletInput onAnalyze={handleAnalyze} isAnalyzing={false} />

					{/* Top 3 Loosers */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.3, duration: 0.8 }}
						className='mt-4 sm:mt-6 md:mt-8'
					>
						<div className='flex items-center justify-center gap-2 mb-3 sm:mb-4'>
							<Crown className='w-4 h-4 sm:w-5 sm:h-5 text-sendo-orange' />
							<p className='text-xs sm:text-sm md:text-base text-foreground/60 uppercase tracking-wider title-font'>
								BIGGEST LOOSERS THIS WEEK
							</p>
						</div>

						<div className='grid grid-cols-3 gap-2 sm:gap-3 md:gap-4'>
							{topLoosers.map((looser, index) => (
								<button
									key={looser.rank}
									onClick={handleLooserClick}
									className='bg-foreground/5 border border-foreground/10 p-3 sm:p-4 md:p-5 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all cursor-pointer group'
									style={{ borderRadius: 0 }}
									type='button'
								>
									<div className='flex items-center justify-center mb-2 sm:mb-3'>
										<div
											className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center ${
												index === 0
													? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]'
													: index === 1
														? 'bg-gradient-to-br from-[#C0C0C0] to-[#808080]'
														: 'bg-gradient-to-br from-[#CD7F32] to-[#8B4513]'
											}`}
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
											}}
										>
											<span className='text-xl sm:text-2xl md:text-3xl font-bold text-black title-font numeric-font'>
												#{index + 1}
											</span>
										</div>
									</div>
									<p className='text-[10px] sm:text-xs md:text-sm text-foreground/60 font-mono mb-2'>
										{formatWallet(looser.wallet)}
									</p>
									<p className='text-sm sm:text-base md:text-lg font-bold text-sendo-red group-hover:scale-105 transition-transform title-font numeric-font'>
										$
										{(looser.total_missed_usd || 0) >= 1000000
											? `${((looser.total_missed_usd || 0) / 1000000).toFixed(2)}M`
											: `${((looser.total_missed_usd || 0) / 1000).toFixed(2)}K`}
									</p>
								</button>
							))}
						</div>
					</motion.div>
				</motion.div>
			</div>

			{/* Gradient Overlay Bottom pour transition forte vers noir */}
			<div
				className='absolute bottom-0 left-0 right-0 h-48 sm:h-56 md:h-64 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none'
				style={{ zIndex: 5 }}
			/>
		</section>
	);
}
