'use client';

import type { LeaderboardEntry } from '@sendo-labs/plugin-sendo-analyser';
import { motion } from 'framer-motion';
import { Crown, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getShameLeaderboard } from '@/actions/analyzer/get';
import { Button } from '@/components/ui/button';

// Types
interface LeaderboardEntryWithMeta extends Omit<LeaderboardEntry, 'badge'> {
	badge: string;
	nickname: string;
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

export default function LeaderboardSection() {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntryWithMeta[]>([]);
	const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

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

	return (
		<section className='w-full bg-[#CCCCCC] pt-12 pb-20 px-4 sm:pt-16 sm:pb-12 sm:px-6 md:pt-20 md:pb-16 lg:pt-24 lg:pb-40'>
			<div className='max-w-7xl mx-auto'>
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
					className='text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-medium mb-16 sm:mb-20 md:mb-24 text-[#2B2B2B] leading-tight sm:leading-[57.6px]'
					style={{
						fontFamily: 'var(--font-ibm-plex-sans), monospace',
						textAlign: 'left',
					}}
				>
					<span className='font-bold text-4xl sm:text-5xl md:text-[56px]'>Hall of Pain.</span>
					<br />
					<span className='block sm:inline text-3xl sm:text-4xl md:text-[48px] font-medium'>
						Top 10 biggest losers. Can you beat them? 💀
					</span>
				</motion.h2>

				{isLoadingLeaderboard ? (
					<div className='flex justify-center items-center py-20'>
						<div
							className='w-12 h-12 border-4 border-[#2B2B2B]/20 border-t-[#2B2B2B] animate-spin'
							style={{ borderRadius: '50%' }}
						/>
					</div>
				) : leaderboard.length > 0 ? (
					<>
						{/* Podium - Top 3 */}
						<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-5xl mx-auto items-end'>
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
										className='bg-[#141414] border border-white/20 p-6 relative overflow-hidden shadow-2xl group'
										style={{ borderRadius: '20px', fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										{/* Background Gradients */}
										<div className='absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50' />
										<div className='absolute -top-10 -right-10 w-32 h-32 bg-[#C0C0C0] blur-[80px] opacity-20' />

										<div className='relative z-10 flex flex-col items-center'>
											<div className='text-xs font-bold text-[#C0C0C0] uppercase tracking-widest mb-4 border border-[#C0C0C0]/30 px-3 py-1 rounded-full bg-[#C0C0C0]/10'>
												Rank #2
											</div>

											<div className='text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'>
												{leaderboard[1].badge}
											</div>

											<p className='text-lg font-bold text-white mb-1 truncate w-full text-center'>
												{leaderboard[1].nickname}
											</p>
											<p className='text-xs text-[#D0D0D0] mb-6 font-mono'>
												{leaderboard[1].wallet.slice(0, 4)}...{leaderboard[1].wallet.slice(-4)}
											</p>

											<div className='w-full bg-white/5 rounded-xl p-4 border border-white/10'>
												<p className='text-[10px] text-[#D0D0D0] uppercase tracking-wider mb-1 text-center'>
													Total Pain
												</p>
												<p className='text-2xl font-bold text-[#FF223B] text-center'>
													$
													{(leaderboard[1].total_missed_usd || 0) >= 1000000
														? `${((leaderboard[1].total_missed_usd || 0) / 1000000).toFixed(2)}M`
														: `${((leaderboard[1].total_missed_usd || 0) / 1000).toFixed(0)}K`}
												</p>
											</div>
										</div>
									</div>
								)}
							</motion.div>

							{/* 1st Place - Bigger */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0, duration: 0.6 }}
								className='sm:order-2 order-1'
							>
								{leaderboard[0] && (
									<div
										className='bg-[#141414] border border-[#FFD700]/30 p-8 relative overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.15)] group transform sm:-translate-y-8'
										style={{ borderRadius: '20px', fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										{/* Background Gradients */}
										<div className='absolute inset-0 bg-gradient-to-b from-[#FFD700]/10 to-transparent' />
										<div className='absolute -top-10 -right-10 w-40 h-40 bg-[#FFD700] blur-[100px] opacity-20' />

										<div className='relative z-10 flex flex-col items-center'>
											<div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2'>
												<Crown className='w-12 h-12 text-[#FFD700] fill-[#FFD700]/20 animate-pulse' />
											</div>

											<div className='mt-4 text-xs font-bold text-[#FFD700] uppercase tracking-widest mb-6 border border-[#FFD700]/30 px-4 py-1.5 rounded-full bg-[#FFD700]/10'>
												Rank #1
											</div>

											<div className='text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_25px_rgba(255,215,0,0.4)]'>
												{leaderboard[0].badge}
											</div>

											<p className='text-2xl font-bold text-white mb-1 truncate w-full text-center'>
												{leaderboard[0].nickname}
											</p>
											<p className='text-sm text-[#D0D0D0] mb-8 font-mono'>
												{leaderboard[0].wallet.slice(0, 4)}...{leaderboard[0].wallet.slice(-4)}
											</p>

											<div className='w-full bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-xl p-5 border border-[#FFD700]/20'>
												<p className='text-xs text-[#FFD700] uppercase tracking-wider mb-1 text-center font-bold'>
													Maximum Pain
												</p>
												<p className='text-4xl font-bold text-[#FF223B] text-center drop-shadow-lg'>
													$
													{(leaderboard[0].total_missed_usd || 0) >= 1000000
														? `${((leaderboard[0].total_missed_usd || 0) / 1000000).toFixed(2)}M`
														: `${((leaderboard[0].total_missed_usd || 0) / 1000).toFixed(0)}K`}
												</p>
											</div>
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
										className='bg-[#141414] border border-white/20 p-6 relative overflow-hidden shadow-2xl group'
										style={{ borderRadius: '20px', fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										{/* Background Gradients */}
										<div className='absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50' />
										<div className='absolute -top-10 -right-10 w-32 h-32 bg-[#CD7F32] blur-[80px] opacity-20' />

										<div className='relative z-10 flex flex-col items-center'>
											<div className='text-xs font-bold text-[#CD7F32] uppercase tracking-widest mb-4 border border-[#CD7F32]/30 px-3 py-1 rounded-full bg-[#CD7F32]/10'>
												Rank #3
											</div>

											<div className='text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'>
												{leaderboard[2].badge}
											</div>

											<p className='text-lg font-bold text-white mb-1 truncate w-full text-center'>
												{leaderboard[2].nickname}
											</p>
											<p className='text-xs text-[#D0D0D0] mb-6 font-mono'>
												{leaderboard[2].wallet.slice(0, 4)}...{leaderboard[2].wallet.slice(-4)}
											</p>

											<div className='w-full bg-white/5 rounded-xl p-4 border border-white/10'>
												<p className='text-[10px] text-[#D0D0D0] uppercase tracking-wider mb-1 text-center'>
													Total Pain
												</p>
												<p className='text-2xl font-bold text-[#FF223B] text-center'>
													$
													{(leaderboard[2].total_missed_usd || 0) >= 1000000
														? `${((leaderboard[2].total_missed_usd || 0) / 1000000).toFixed(2)}M`
														: `${((leaderboard[2].total_missed_usd || 0) / 1000).toFixed(0)}K`}
												</p>
											</div>
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
								className='max-w-4xl mx-auto bg-white border border-[#2B2B2B]/10 shadow-sm'
								style={{ borderRadius: 0 }}
							>
								<div className='overflow-x-auto'>
									<table className='w-full'>
										<thead className='bg-[#F5F5F5] border-b border-[#2B2B2B]/10'>
											<tr>
												<th className='text-left p-3 sm:p-4 text-[#2B2B2B]/60 text-xs uppercase font-bold'>Rank</th>
												<th className='text-left p-3 sm:p-4 text-[#2B2B2B]/60 text-xs uppercase font-bold'>Degen</th>
												<th className='text-right p-3 sm:p-4 text-[#2B2B2B]/60 text-xs uppercase font-bold'>Missed</th>
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
													className='border-b border-[#2B2B2B]/5 hover:bg-[#2B2B2B]/5 transition-colors'
												>
													<td className='p-3 sm:p-4'>
														<div className='flex items-center gap-2 sm:gap-3'>
															<span className='text-xl sm:text-2xl font-bold text-[#2B2B2B]/40'>#{entry.rank}</span>
															<span className='text-2xl sm:text-3xl'>{entry.badge}</span>
														</div>
													</td>
													<td className='p-3 sm:p-4'>
														<p className='font-bold text-[#2B2B2B] text-sm sm:text-base truncate max-w-[120px] sm:max-w-none'>
															{entry.nickname}
														</p>
														<p className='text-xs text-[#2B2B2B]/40 font-mono'>
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

								<div className='p-4 sm:p-6 bg-white border-t border-[#2B2B2B]/10 text-center'>
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
							<p className='text-lg sm:text-xl text-[#2B2B2B]/70 mb-4 sm:mb-6 px-4'>Think you can beat them? 🎯</p>
							<button
								type='button'
								onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
								className='arc-raiders-pill-button text-base sm:text-lg md:text-xl'
								style={{
									fontFamily: 'var(--font-ibm-plex-sans), monospace',
								}}
							>
								<span>ANALYZE MY WALLET</span>
								<span className='arrow'>→</span>
							</button>
						</motion.div>
					</>
				) : (
					<div className='text-center py-12 text-[#2B2B2B]/60'>
						<p>No leaderboard data available yet. Be the first to analyze your wallet!</p>
					</div>
				)}
			</div>
		</section>
	);
}
