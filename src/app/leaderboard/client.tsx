'use client';

import type { LeaderboardEntry } from '@sendo-labs/plugin-sendo-analyser';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, Skull, TrendingDown, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getFameLeaderboard, getShameLeaderboard } from '@/actions/analyzer/get';
import PageWrapper from '@/components/shared/page-wrapper';
import { Button } from '@/components/ui/button';

interface LeaderboardData {
	shame: LeaderboardEntry[];
	fame: LeaderboardEntry[];
}

export default function Leaderboard() {
	const [activeTab, setActiveTab] = useState<'shame' | 'fame'>('shame');
	const [period, setPeriod] = useState<'all' | 'month' | 'week'>('week');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
		shame: [],
		fame: [],
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchLeaderboard();
	}, [period, activeTab]);

	const fetchLeaderboard = async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Fetch only the active leaderboard
			if (activeTab === 'shame') {
				const shameResult = await getShameLeaderboard(20, period);
				if (!shameResult.success) {
					throw new Error('Failed to fetch shame leaderboard');
				}
				setLeaderboardData((prev) => ({
					...prev,
					shame: shameResult.data.entries,
				}));
			} else {
				const fameResult = await getFameLeaderboard(20, period);
				if (!fameResult.success) {
					throw new Error('Failed to fetch fame leaderboard');
				}
				setLeaderboardData((prev) => ({
					...prev,
					fame: fameResult.data.entries,
				}));
			}
		} catch (err: any) {
			console.error('Failed to fetch leaderboard:', err);
			setError(err?.message || 'Failed to load leaderboard');
		} finally {
			setIsLoading(false);
		}
	};

	const formatWallet = (wallet: string) => {
		return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
	};

	const formatUSD = (value: number) => {
		return (value / 1000).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const getBadgeColor = (badge: string) => {
		switch (badge) {
			case 'diamond':
				return 'from-[#b9f2ff] to-[#0ea5e9]';
			case 'gold':
				return 'from-[#ffd700] to-[#ffa500]';
			case 'silver':
				return 'from-[#e5e7eb] to-[#9ca3af]';
			case 'bronze':
				return 'from-[#f59e0b] to-[#92400e]';
			default:
				return 'from-foreground/20 to-foreground/10';
		}
	};

	const currentData = activeTab === 'shame' ? leaderboardData.shame : leaderboardData.fame;

	return (
		<PageWrapper>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className='text-center mb-12 md:mb-16'
			>
				<h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 title-font'>
					LEADER
					<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
						BOARD
					</span>
				</h1>
				<p className='text-lg sm:text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto'>
					The best and worst traders on Solana 🏆
				</p>
			</motion.div>

			{/* Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.8 }}
				className='flex gap-4 mb-8 md:mb-12 max-w-2xl mx-auto'
			>
				<button
					type='button'
					onClick={() => setActiveTab('shame')}
					className={`flex-1 h-14 md:h-16 flex items-center justify-center gap-2 transition-all ${
						activeTab === 'shame'
							? 'bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red'
							: 'bg-foreground/5 hover:bg-foreground/10'
					}`}
					style={{
						clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
						borderRadius: 0,
					}}
				>
					<Skull className='w-5 h-5 md:w-6 md:h-6' />
					<span className='text-sm md:text-base font-bold uppercase title-font'>HALL OF SHAME</span>
				</button>

				<button
					type='button'
					onClick={() => setActiveTab('fame')}
					className={`flex-1 h-14 md:h-16 flex items-center justify-center gap-2 transition-all ${
						activeTab === 'fame'
							? 'bg-gradient-to-r from-sendo-green to-sendo-green/80'
							: 'bg-foreground/5 hover:bg-foreground/10'
					}`}
					style={{
						clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
						borderRadius: 0,
					}}
				>
					<Trophy className='w-5 h-5 md:w-6 md:h-6' />
					<span
						className={`text-sm md:text-base font-bold uppercase title-font ${activeTab === 'fame' ? 'text-black' : ''}`}
					>
						HALL OF FAME
					</span>
				</button>
			</motion.div>

			{/* Period Filter */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.8 }}
				className='flex gap-2 mb-8 max-w-md mx-auto justify-center'
			>
				<button
					type='button'
					onClick={() => setPeriod('all')}
					className={`px-4 py-2 text-xs md:text-sm font-bold uppercase transition-all ${
						period === 'all'
							? 'bg-foreground text-background'
							: 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
					}`}
					style={{
						clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
						borderRadius: 0,
					}}
				>
					All Time
				</button>
				<button
					type='button'
					onClick={() => setPeriod('month')}
					className={`px-4 py-2 text-xs md:text-sm font-bold uppercase transition-all ${
						period === 'month'
							? 'bg-foreground text-background'
							: 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
					}`}
					style={{
						clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
						borderRadius: 0,
					}}
				>
					This Month
				</button>
				<button
					type='button'
					onClick={() => setPeriod('week')}
					className={`px-4 py-2 text-xs md:text-sm font-bold uppercase transition-all ${
						period === 'week'
							? 'bg-foreground text-background'
							: 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
					}`}
					style={{
						clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
						borderRadius: 0,
					}}
				>
					This Week
				</button>
			</motion.div>

			{/* Leaderboard */}
			{error && (
				<div className='text-center text-red-500 mb-8'>
					<p>Error loading leaderboard: {error}</p>
				</div>
			)}

			{isLoading ? (
				<div className='py-20'>
					<div className='relative mx-auto w-40 h-16'>
						{/* Background logo (grisé) */}
						<div className='absolute inset-0 opacity-20'>
							<img
								src='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png'
								alt='SENDO'
								className='w-full h-full object-contain'
							/>
						</div>

						{/* Logo avec masque et gradient animé */}
						<div
							className='absolute inset-0'
							style={{
								maskImage:
									'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
								maskSize: 'contain',
								maskRepeat: 'no-repeat',
								maskPosition: 'center',
								WebkitMaskImage:
									'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
								WebkitMaskSize: 'contain',
								WebkitMaskRepeat: 'no-repeat',
								WebkitMaskPosition: 'center',
							}}
						>
							<div
								className='absolute inset-0 animate-fill-left-right bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red'
								style={{
									filter: 'drop-shadow(0 0 15px rgba(255, 90, 31, 0.6))',
								}}
							/>
						</div>
					</div>
				</div>
			) : (
				<AnimatePresence mode='wait'>
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -30 }}
						transition={{ duration: 0.5 }}
						className='space-y-4'
					>
						{currentData?.map((entry, index) => (
							<motion.div
								key={entry.wallet}
								initial={{ opacity: 0, x: -30 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.05, duration: 0.5 }}
								className={`relative overflow-hidden ${
									entry.badge
										? `bg-gradient-to-r ${getBadgeColor(entry.badge)} p-[2px]`
										: 'bg-foreground/5 border border-foreground/10'
								}`}
								style={{ borderRadius: 0 }}
							>
								<div className='bg-background p-4 md:p-6' style={{ borderRadius: 0 }}>
									<div className='flex items-center gap-4 md:gap-6'>
										{/* Rank Badge */}
										<div
											className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0 ${
												entry.badge ? `bg-gradient-to-r ${getBadgeColor(entry.badge)}` : 'bg-foreground/10'
											}`}
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
											}}
										>
											{index < 3 ? (
												<Crown
													className={`w-6 h-6 md:w-8 md:h-8 ${
														entry.badge === 'diamond'
															? 'text-[#0052cc]'
															: entry.badge === 'gold'
																? 'text-[#cc9900]'
																: entry.badge === 'silver'
																	? 'text-[#888888]'
																	: 'text-[#cc6600]'
													}`}
												/>
											) : (
												<span className='text-lg md:text-2xl font-bold text-foreground title-font numeric-font'>
													#{index + 1}
												</span>
											)}
										</div>

										{/* Wallet Info */}
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2 mb-1'>
												<p className='text-base md:text-lg font-bold text-foreground font-mono truncate'>
													{formatWallet(entry.wallet)}
												</p>
											</div>
											<p className='text-sm md:text-base text-foreground/60'>{entry.rank}</p>
										</div>

										{/* Amount */}
										<div className='text-right flex-shrink-0'>
											<p className='text-xs text-foreground/40 mb-2'>
												{entry.days_since_analysis === 0
													? 'Analyzed today'
													: entry.days_since_analysis === 1
														? 'Analyzed yesterday'
														: `Analyzed ${entry.days_since_analysis} days ago`}
											</p>
											<div className='flex items-center justify-end gap-2 mb-1'>
												<TrendingDown className='w-5 h-5 text-sendo-red' />
												<p className='text-xl md:text-3xl font-bold title-font numeric-font text-sendo-red'>
													$
													{activeTab === 'shame'
														? formatUSD(entry.total_missed_usd || 0)
														: formatUSD(entry.total_gains_usd || 0)}
													K
												</p>
											</div>
											<p className='text-xs md:text-sm text-foreground/40 uppercase'>
												{activeTab === 'shame' ? 'MISSED' : 'LOST'}
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</AnimatePresence>
			)}

			{/* CTA */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.8 }}
				className='mt-12 md:mt-16 text-center'
			>
				<p className='text-foreground/60 mb-4 text-sm md:text-base'>
					{activeTab === 'shame' ? 'Think you can beat them? 💀' : 'Can you join the legends? 🏆'}
				</p>
				<Link href='/analyzer'>
					<Button
						className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-12 md:h-14 px-6 md:px-8'
						style={{
							clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
							borderRadius: 0,
						}}
					>
						<span className='text-sm md:text-base font-bold uppercase title-font'>ANALYZE YOUR WALLET</span>
					</Button>
				</Link>
			</motion.div>
		</PageWrapper>
	);
}
