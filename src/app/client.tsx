'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Zap, TrendingDown, Crown, Trophy, Target, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WalletInput from '@/components/analyzer/wallet-input';
import { getShameLeaderboard } from '@/actions/analyzer/get';
import type { LeaderboardEntry } from '@sendo-labs/plugin-sendo-analyser';
import HowItWorksSectionV2 from '@/components/home/how-it-works-section-v2';
import TeamSectionV2 from '@/components/home/team-section-v2';
import ContactSectionV2 from '@/components/home/contact-section-v2';

// Types
interface LeaderboardEntryWithMeta extends LeaderboardEntry {
	badge: string;
	nickname: string;
}

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

// Helper functions
function getBadgeForRank(rank: number): string {
	const badges = ['🐋', '💀', '🔥', '⚡', '💎', '🎯', '🌊', '🚀', '👑', '🎲'];
	return badges[rank - 1] || '💸';
}

function getNicknameForRank(rank: number): string {
	const nicknames = [
		'The Final Boss',
		'Diamond Graveyard',
		'Eternal Flame',
		'Thunder Loser',
		'Certified Bagger',
		'Miss Master',
		'Wave Rider',
		'Moon Misser',
		'Paper King',
		'Casino Degen',
	];
	return nicknames[rank - 1] || `Degen #${rank}`;
}

// Products data
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

export default function Home() {
	const router = useRouter();
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntryWithMeta[]>([]);
	const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	// Fetch leaderboard on mount
	useEffect(() => {
		async function loadLeaderboard() {
			try {
				setIsLoadingLeaderboard(true);
				const result = await getShameLeaderboard(10, 'all');

				if (result.success && result.data.entries.length > 0) {
					const mapped: LeaderboardEntryWithMeta[] = result.data.entries.map((entry, idx) => ({
						...entry,
						badge: getBadgeForRank(idx + 1),
						nickname: getNicknameForRank(idx + 1),
					}));
					setLeaderboard(mapped);
				}
			} catch (error) {
				console.error('Error loading leaderboard:', error);
			} finally {
				setIsLoadingLeaderboard(false);
			}
		}

		loadLeaderboard();
	}, []);

	// Handle wallet analysis
	const handleAnalyze = (walletAddress: string) => {
		if (!walletAddress.trim()) return;
		setIsAnalyzing(true);
		router.push(`/analyzer?wallet=${walletAddress}`);
	};

	return (
		<div className='min-h-screen bg-background text-foreground relative overflow-x-hidden'>
			{/* Animated Background Orbs - Fixed to viewport - SENDO COLORS ONLY */}
			<div className='fixed inset-0 pointer-events-none z-0'>
				{/* Orange/Red gradient orb */}
				<motion.div
					className='absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FF6B00]/25 to-[#FF223B]/15 blur-[120px]'
					style={{ top: '10%', left: '10%' }}
					animate={{
						x: [0, 80, -40, 0],
						y: [0, -60, 50, 0],
						scale: [1, 1.15, 0.95, 1],
					}}
					transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
				/>
				{/* Red/Dark Red gradient orb */}
				<motion.div
					className='absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FF223B]/20 to-[#450C13]/15 blur-[110px]'
					style={{ top: '40%', right: '15%' }}
					animate={{
						x: [0, -100, 70, 0],
						y: [0, 80, -50, 0],
						scale: [1, 0.85, 1.2, 1],
					}}
					transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
				/>
				{/* Orange/Dark Red gradient orb */}
				<motion.div
					className='absolute w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-[#450C13]/12 blur-[115px]'
					style={{ bottom: '15%', left: '25%' }}
					animate={{
						x: [0, 120, -80, 0],
						y: [0, -70, 60, 0],
						scale: [1, 1.1, 0.9, 1],
					}}
					transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
				/>
			</div>

			{/* Content - Relative to allow scrolling */}
			<div className='relative z-10'>
				{/* Hero Section */}
				<section className='min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20'>
					<div className='max-w-5xl mx-auto text-center w-full'>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							{/* Main Title */}
							<h1
								className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 uppercase leading-tight px-4 title-font'
							>
								HOW MUCH DID
								<br />
								YOU{' '}
								<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
									LOSE?
								</span>
							</h1>

							<p className='text-base sm:text-lg md:text-xl text-foreground/70 mb-8 sm:mb-12 max-w-3xl mx-auto px-4'>
								Calculate your missed ATH gains. Compare with other degens.
								<br className='hidden sm:block' />
								Stop bagholding and start winning.
							</p>

							{/* Wallet Input */}
							<div className='max-w-3xl mx-auto mb-6 sm:mb-8 px-4'>
								<WalletInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
							</div>

							{/* Quick Stats */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.8 }}
								className='flex flex-wrap justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-foreground/60 px-4'
							>
								<div>
									<span className='text-2xl sm:text-3xl font-bold text-sendo-orange block'>180+</span>
									<span>Wallets Analyzed</span>
								</div>
								<div>
									<span className='text-2xl sm:text-3xl font-bold text-sendo-red block'>$1.2M</span>
									<span>Missed Gains</span>
								</div>
								<div>
									<span className='text-2xl sm:text-3xl font-bold text-sendo-orange block'>24/7</span>
									<span>Real-Time Data</span>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* Leaderboard Section - Hall of Pain */}
				<section className='py-12 sm:py-20 px-4 sm:px-6'>
					<div className='max-w-7xl mx-auto'>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className='text-center mb-8 sm:mb-12'
						>
							<h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 uppercase px-4 title-font'>
								HALL OF{' '}
								<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
									PAIN
								</span>
							</h2>
							<p className='text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto px-4'>
								Top 10 biggest losers. Can you beat them? 💀
							</p>
						</motion.div>

						{isLoadingLeaderboard ? (
							<div className='flex justify-center items-center py-20'>
								<div
									className='w-12 h-12 border-4 border-foreground/20 border-t-foreground animate-spin'
									style={{ borderRadius: '50%' }}
								/>
							</div>
						) : leaderboard.length > 0 ? (
							<>
								{/* Podium - Top 3 */}
								<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto'>
									{/* 2nd Place */}
									<motion.div
										initial={{ opacity: 0, y: 40 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.1, duration: 0.6 }}
										className='sm:order-1 order-2'
									>
										{leaderboard[1] && (
											<div
												className='bg-foreground/5 border-2 border-[#C0C0C0]/50 p-4 sm:p-6 text-center relative overflow-hidden'
												style={{
													clipPath:
														'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
												}}
											>
												<div className='absolute top-0 left-0 right-0 h-1 bg-[#C0C0C0]' />
												<div className='text-4xl sm:text-6xl mb-2 sm:mb-3'>{leaderboard[1].badge}</div>
												<div className='text-4xl sm:text-5xl font-bold mb-1 sm:mb-2 text-[#C0C0C0]'>2</div>
												<p className='text-sm sm:text-lg font-bold mb-1 truncate'>{leaderboard[1].nickname}</p>
												<p className='text-xs text-foreground/40 mb-2 sm:mb-3 font-mono'>
													{leaderboard[1].wallet.slice(0, 4)}...{leaderboard[1].wallet.slice(-4)}
												</p>
												<div className='bg-[#C0C0C0]/20 px-2 sm:px-3 py-1 inline-block' style={{ borderRadius: 0 }}>
													<p className='text-xl sm:text-2xl font-bold text-sendo-red'>
														$
														{(leaderboard[1].total_missed_usd || 0) >= 1000000
															? `${((leaderboard[1].total_missed_usd || 0) / 1000000).toFixed(2)}M`
															: `${((leaderboard[1].total_missed_usd || 0) / 1000).toFixed(0)}K`}
													</p>
													<p className='text-xs text-foreground/60'>MISSED</p>
												</div>
											</div>
										)}
									</motion.div>

									{/* 1st Place - Bigger on desktop */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0, duration: 0.6 }}
										className='sm:order-2 order-1'
									>
										{leaderboard[0] && (
											<div
												className='bg-gradient-to-b from-[#FFD700]/20 to-foreground/5 border-2 border-[#FFD700] p-6 sm:p-8 text-center relative overflow-hidden sm:transform sm:scale-110'
												style={{
													clipPath:
														'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
												}}
											>
												<div className='absolute top-0 left-0 right-0 h-1 sm:h-2 bg-[#FFD700]' />
												<Crown className='w-10 h-10 sm:w-12 sm:h-12 text-[#FFD700] mx-auto mb-2 animate-pulse' />
												<div className='text-5xl sm:text-7xl mb-2 sm:mb-3'>{leaderboard[0].badge}</div>
												<div className='text-5xl sm:text-6xl font-bold mb-1 sm:mb-2 text-[#FFD700]'>1</div>
												<p className='text-lg sm:text-xl font-bold mb-1 truncate px-2'>{leaderboard[0].nickname}</p>
												<p className='text-xs text-foreground/40 mb-3 sm:mb-4 font-mono'>
													{leaderboard[0].wallet.slice(0, 4)}...{leaderboard[0].wallet.slice(-4)}
												</p>
												<div className='bg-[#FFD700]/30 px-3 sm:px-4 py-1 sm:py-2 inline-block' style={{ borderRadius: 0 }}>
													<p className='text-2xl sm:text-3xl font-bold text-sendo-red'>
														$
														{(leaderboard[0].total_missed_usd || 0) >= 1000000
															? `${((leaderboard[0].total_missed_usd || 0) / 1000000).toFixed(2)}M`
															: `${((leaderboard[0].total_missed_usd || 0) / 1000).toFixed(0)}K`}
													</p>
													<p className='text-xs text-foreground/60 uppercase'>TOTAL PAIN</p>
												</div>
											</div>
										)}
									</motion.div>

									{/* 3rd Place */}
									<motion.div
										initial={{ opacity: 0, y: 40 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.2, duration: 0.6 }}
										className='sm:order-3 order-3'
									>
										{leaderboard[2] && (
											<div
												className='bg-foreground/5 border-2 border-[#CD7F32]/50 p-4 sm:p-6 text-center relative overflow-hidden'
												style={{
													clipPath:
														'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
												}}
											>
												<div className='absolute top-0 left-0 right-0 h-1 bg-[#CD7F32]' />
												<div className='text-4xl sm:text-6xl mb-2 sm:mb-3'>{leaderboard[2].badge}</div>
												<div className='text-4xl sm:text-5xl font-bold mb-1 sm:mb-2 text-[#CD7F32]'>3</div>
												<p className='text-sm sm:text-lg font-bold mb-1 truncate'>{leaderboard[2].nickname}</p>
												<p className='text-xs text-foreground/40 mb-2 sm:mb-3 font-mono'>
													{leaderboard[2].wallet.slice(0, 4)}...{leaderboard[2].wallet.slice(-4)}
												</p>
												<div className='bg-[#CD7F32]/20 px-2 sm:px-3 py-1 inline-block' style={{ borderRadius: 0 }}>
													<p className='text-xl sm:text-2xl font-bold text-sendo-red'>
														$
														{(leaderboard[2].total_missed_usd || 0) >= 1000000
															? `${((leaderboard[2].total_missed_usd || 0) / 1000000).toFixed(2)}M`
															: `${((leaderboard[2].total_missed_usd || 0) / 1000).toFixed(0)}K`}
													</p>
													<p className='text-xs text-foreground/60'>MISSED</p>
												</div>
											</div>
										)}
									</motion.div>
								</div>

								{/* Rest of Leaderboard (4-10) */}
								{leaderboard.length > 3 && (
									<motion.div
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.3, duration: 0.8 }}
										className='max-w-4xl mx-auto bg-foreground/5 border border-foreground/10'
										style={{ borderRadius: 0 }}
									>
										<div className='overflow-x-auto'>
											<table className='w-full'>
												<thead className='bg-background border-b border-foreground/10'>
													<tr>
														<th className='text-left p-3 sm:p-4 text-foreground/60 text-xs uppercase font-bold'>
															Rank
														</th>
														<th className='text-left p-3 sm:p-4 text-foreground/60 text-xs uppercase font-bold'>
															Degen
														</th>
														<th className='text-right p-3 sm:p-4 text-foreground/60 text-xs uppercase font-bold'>
															Missed
														</th>
													</tr>
												</thead>
												<tbody>
													{leaderboard.slice(3, 10).map((entry, index) => (
														<motion.tr
															key={entry.wallet}
															initial={{ opacity: 0, x: -20 }}
															whileInView={{ opacity: 1, x: 0 }}
															viewport={{ once: true }}
															transition={{ delay: index * 0.05, duration: 0.4 }}
															className='border-b border-foreground/5 hover:bg-foreground/5 transition-colors'
														>
															<td className='p-3 sm:p-4'>
																<div className='flex items-center gap-2 sm:gap-3'>
																	<span className='text-xl sm:text-2xl font-bold text-foreground/40'>
																		#{entry.rank}
																	</span>
																	<span className='text-2xl sm:text-3xl'>{entry.badge}</span>
																</div>
															</td>
															<td className='p-3 sm:p-4'>
																<p className='font-bold text-foreground text-sm sm:text-base truncate max-w-[120px] sm:max-w-none'>
																	{entry.nickname}
																</p>
																<p className='text-xs text-foreground/40 font-mono'>
																	{entry.wallet.slice(0, 4)}...{entry.wallet.slice(-4)}
																</p>
															</td>
															<td className='p-3 sm:p-4 text-right'>
																<p className='text-lg sm:text-xl font-bold text-sendo-red'>
																	$
																	{(entry.total_missed_usd || 0) >= 1000000
																		? `${((entry.total_missed_usd || 0) / 1000000).toFixed(2)}M`
																		: `${((entry.total_missed_usd || 0) / 1000).toFixed(0)}K`}
																</p>
															</td>
														</motion.tr>
													))}
												</tbody>
											</table>
										</div>

										<div className='p-4 sm:p-6 bg-background border-t border-foreground/10 text-center'>
											<Link href='/leaderboard'>
												<Button
													className='bg-gradient-to-r from-sendo-orange to-sendo-red text-white hover:shadow-lg h-10 sm:h-12 px-6 sm:px-8 uppercase font-bold text-sm'
													style={{ borderRadius: 0 }}
												>
													<Trophy className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
													VIEW FULL LEADERBOARD
												</Button>
											</Link>
										</div>
									</motion.div>
								)}

								{/* Compare CTA */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.4, duration: 0.6 }}
									className='mt-8 sm:mt-12 text-center'
								>
									<p className='text-lg sm:text-xl text-foreground/70 mb-4 sm:mb-6 px-4'>
										Think you can beat them? 🎯
									</p>
									<Button
										onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
										className='h-12 sm:h-14 px-8 sm:px-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red text-white hover:shadow-xl uppercase font-bold text-sm sm:text-lg'
										style={{ borderRadius: 0 }}
									>
										<span className='title-font'>ANALYZE MY WALLET</span>
										<ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 ml-2' />
									</Button>
								</motion.div>
							</>
						) : (
							<div className='text-center py-12 text-foreground/60'>
								<p>No leaderboard data available yet. Be the first to analyze your wallet!</p>
							</div>
						)}
					</div>
				</section>

				{/* 3 Products Section */}
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

				{/* How It Works Section */}
				<HowItWorksSectionV2 />

				{/* Team Section */}
				<TeamSectionV2 />

				{/* Contact Section */}
				<ContactSectionV2 />
			</div>
		</div>
	);
}
