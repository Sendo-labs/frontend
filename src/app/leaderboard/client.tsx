'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingDown, TrendingUp, Crown, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FullScreenLoader } from '@/components/shared/loader';
import PageWrapper from '@/components/shared/page-wrapper';

interface LeaderboardEntry {
	wallet: string;
	total_missed_usd?: number;
	total_gains_usd?: number;
	rank: string;
	badge?: 'diamond' | 'gold' | 'silver' | 'bronze';
}

interface LeaderboardData {
	shame: LeaderboardEntry[];
	fame: LeaderboardEntry[];
}

export default function Leaderboard() {
	const [activeTab, setActiveTab] = useState<'shame' | 'fame'>('shame');
	const [isLoading, setIsLoading] = useState(true);
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchLeaderboard();
	}, []);

	const fetchLeaderboard = async () => {
		// Mock API call
		setTimeout(() => {
			setLeaderboardData({
				shame: [
					{
						wallet: '9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y',
						total_missed_usd: 98210,
						rank: '🐳 Elite of Pain',
						badge: 'diamond',
					},
					{
						wallet: '7hpWn64kb0q5nro2ZGX9TkP3Y8fLmA1sC6dN4wB5xJ2H',
						total_missed_usd: 67834,
						rank: '💀 Certified Bagholder',
						badge: 'gold',
					},
					{
						wallet: '5ZV3HcSDmmSoump8N2mT6P9fK4rLvC3dN1sB7wX8yM4K',
						total_missed_usd: 43810,
						rank: '💎 Diamond Hands (Wrong Way)',
						badge: 'silver',
					},
					{
						wallet: '3qp2G1s4t8m9N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H',
						total_missed_usd: 38921,
						rank: '🎯 Master of Mistiming',
						badge: 'bronze',
					},
					{
						wallet: '8TkP3Y2f4LmA5s1C6dN9wB2xJ7H3qp4G1s8t9m0N',
						total_missed_usd: 32450,
						rank: '📉 Professional Holder',
					},
					{
						wallet: '6dN1sB7wX8yM4K2P9fK4rLvC3ZV3HcSDmmSoump8N',
						total_missed_usd: 28730,
						rank: '🤡 Clown Prince',
					},
					{
						wallet: '4G1s8t9m0N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H3qp2',
						total_missed_usd: 24180,
						rank: '🚀 Rocket to the Ground',
					},
					{
						wallet: '2f4LmA5s1C6dN9wB2xJ7H3qp4G1s8t9m0N8TkP3Y',
						total_missed_usd: 19560,
						rank: '💸 Money Burner',
					},
					{
						wallet: '7wX8yM4K2P9fK4rLvC3ZV3HcSDmmSoump8N6dN1sB',
						total_missed_usd: 15320,
						rank: '🎰 Casino Enthusiast',
					},
					{
						wallet: '8t9m0N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H3qp24G1s',
						total_missed_usd: 12840,
						rank: '🔥 Burn Master',
					},
				],
				fame: [
					{
						wallet: '2Y9wX8hK7M4vPkN6dN1sB9fK3rLvC5ZV3HcSDmmSo',
						total_gains_usd: 145320,
						rank: '👑 Exit Legend',
						badge: 'diamond',
					},
					{
						wallet: '5H3qp4G1s8t9m0N6Y7K2P4F5rLmC1dN8sB3wX4yJ',
						total_gains_usd: 98450,
						rank: '🎯 Perfect Timer',
						badge: 'gold',
					},
					{
						wallet: '8N6dN1sB7wX8yM4K2P9fK4rLvC3ZV3HcSDmmSoump',
						total_gains_usd: 76210,
						rank: '💰 Profit Master',
						badge: 'silver',
					},
					{
						wallet: '1C6dN9wB2xJ7H3qp4G1s8t9m0N8TkP3Y2f4LmA5s',
						total_gains_usd: 63840,
						rank: '🚀 Moon Walker',
						badge: 'bronze',
					},
					{
						wallet: '9fK4rLvC3ZV3HcSDmmSoump8N6dN1sB7wX8yM4K2P',
						total_gains_usd: 54720,
						rank: '⚡ Lightning Seller',
					},
					{
						wallet: '4yJ5H3qp24G1s8t9m0N6Y7K2P4F5rLmC1dN8sB3wX',
						total_gains_usd: 47890,
						rank: '🧠 Big Brain',
					},
					{
						wallet: '7K2P4F5rLmC1dN8sB3wX4yJ5H3qp2G1s8t9m0N6Y',
						total_gains_usd: 41230,
						rank: '🎪 Circus Master',
					},
					{
						wallet: '0N8TkP3Y2f4LmA5s1C6dN9wB2xJ7H3qp4G1s8t9m',
						total_gains_usd: 36540,
						rank: '💎 Diamond Hands (Right Way)',
					},
					{
						wallet: '3ZV3HcSDmmSoump8N6dN1sB7wX8yM4K2P9fK4rLvC',
						total_gains_usd: 29870,
						rank: '🏆 Champion',
					},
					{
						wallet: '6Y7K2P4F5rLmC1dN8sB3wX4yJ5H3qp24G1s8t9m0N',
						total_gains_usd: 24590,
						rank: '🌟 Star Player',
					},
				],
			});
			setIsLoading(false);
		}, 1000);
	};

	const formatWallet = (wallet: string) => {
		return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
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

	if (isLoading) {
		return <FullScreenLoader text='Loading Leaderboard Data...' />;
	}

	const currentData = activeTab === 'shame' ? leaderboardData?.shame : leaderboardData?.fame;

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
					<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>BOARD</span>
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
					className={`flex-1 h-14 md:h-16 flex items-center justify-center gap-2 transition-all ${activeTab === 'shame'
							? 'bg-gradient-to-r from-sendo-orange to-sendo-red'
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
					className={`flex-1 h-14 md:h-16 flex items-center justify-center gap-2 transition-all ${activeTab === 'fame'
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

			{/* Leaderboard */}
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
							className={`relative overflow-hidden ${entry.badge
									? `bg-gradient-to-r ${getBadgeColor(entry.badge)} p-[2px]`
									: 'bg-foreground/5 border border-foreground/10'
								}`}
							style={{ borderRadius: 0 }}
						>
							<div className='bg-background p-4 md:p-6' style={{ borderRadius: 0 }}>
								<div className='flex items-center gap-4 md:gap-6'>
									{/* Rank Badge */}
									<div
										className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0 ${entry.badge ? `bg-gradient-to-r ${getBadgeColor(entry.badge)}` : 'bg-foreground/10'
											}`}
										style={{
											clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
										}}
									>
										{index < 3 ? (
											<Crown
												className={`w-6 h-6 md:w-8 md:h-8 ${entry.badge === 'diamond'
														? 'text-[#0ea5e9]'
														: entry.badge === 'gold'
															? 'text-[#ffd700]'
															: entry.badge === 'silver'
																? 'text-[#e5e7eb]'
																: 'text-[#f59e0b]'
													}`}
											/>
										) : (
											<span className='text-lg md:text-2xl font-bold text-foreground title-font'>#{index + 1}</span>
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
										<div className='flex items-center gap-2 mb-1'>
											{activeTab === 'shame' ? (
												<TrendingDown className='w-5 h-5 text-sendo-red' />
											) : (
												<TrendingUp className='w-5 h-5 text-sendo-green' />
											)}
											<p
												className={`text-xl md:text-3xl font-bold title-font ${activeTab === 'shame' ? 'text-sendo-red' : 'text-sendo-green'
													}`}
											>
												$
												{activeTab === 'shame'
													? ((entry.total_missed_usd || 0) / 1000).toFixed(1)
													: ((entry.total_gains_usd || 0) / 1000).toFixed(1)}
												K
											</p>
										</div>
										<p className='text-xs md:text-sm text-foreground/40 uppercase'>
											{activeTab === 'shame' ? 'MISSED' : 'GAINED'}
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</AnimatePresence>

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
						className='bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-12 md:h-14 px-6 md:px-8'
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
