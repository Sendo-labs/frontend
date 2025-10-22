'use client';

import React from "react";
import { motion } from "framer-motion";
import { Github, MessageCircle, Trophy, Coins, Code, Users, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from '@/components/shared/page-wrapper';

export default function Onboarding() {
	return (
		<PageWrapper>
			{/* Hero Section */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="text-center mb-12 md:mb-16"
			>
				<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 title-font">
					JOIN THE{" "}
					<span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#450C13] bg-clip-text text-transparent">
						REVOLUTION
					</span>
				</h1>

				<p className="text-lg sm:text-xl md:text-2xl text-[#F2EDE7]/80 mb-4 max-w-3xl mx-auto">
					Want to contribute to Sendo's development?
				</p>

				<p className="text-base sm:text-lg text-[#F2EDE7]/60 max-w-4xl mx-auto">
					Contribute to an open-source ecosystem, earn XP based on your contributions, and receive a share of mission rewards.
				</p>
			</motion.div>

			{/* Stats Bar */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.8 }}
				className="grid grid-cols-3 gap-4 md:gap-6 mb-20"
			>
				<div className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-4 sm:p-6 text-center rounded-none">
					<div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#450C13] bg-clip-text text-transparent title-font">
						100%
					</div>
					<p className="text-xs sm:text-sm text-[#F2EDE7]/60 uppercase">Open Source</p>
				</div>

				<div className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-4 sm:p-6 text-center rounded-none">
					<div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#14F195] to-[#00D9B5] bg-clip-text text-transparent title-font">
						XP
					</div>
					<p className="text-xs sm:text-sm text-[#F2EDE7]/60 uppercase">Based Rewards</p>
				</div>

				<div className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-4 sm:p-6 text-center rounded-none">
					<div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#450C13] bg-clip-text text-transparent title-font">
						24/7
					</div>
					<p className="text-xs sm:text-sm text-[#F2EDE7]/60 uppercase">Community</p>
				</div>
			</motion.div>

			{/* How to Get Started */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="mb-20"
			>
				<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 md:mb-6 title-font">
					HOW TO{" "}
					<span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#450C13] bg-clip-text text-transparent">
						GET STARTED
					</span>
				</h2>

				<div className="space-y-6 md:space-y-8 mt-12">
					{/* Step 01 */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1, duration: 0.6 }}
						className="relative bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#FF5C1A]/50 transition-all group"
						style={{ borderRadius: 0 }}
					>
						<div className="grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 p-6 md:p-8 items-center">
							{/* Number Badge */}
							<div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#450C13] flex items-center justify-center group-hover:scale-110 transition-transform"
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
								<span className="text-xl font-bold text-white title-font">01</span>
							</div>

							{/* Icon */}
							<div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#FF5C1A] to-[#FF223B] flex items-center justify-center ml-8 md:ml-0"
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
								<Github className="w-8 h-8 md:w-10 md:h-10 text-white" />
							</div>

							{/* Content */}
							<div>
								<h3 className="text-xl md:text-2xl font-bold text-[#F2EDE7] mb-2 title-font">
									CHOOSE YOUR MISSION
								</h3>
								<p className="text-sm md:text-base text-[#F2EDE7]/70">
									Browse our GitHub Project board and pick a mission that matches your skills. From bug fixes to new features, there's something for everyone.
								</p>
							</div>

							{/* CTA */}
							<a
								href="https://github.com/orgs/Sendo-labs/projects/2/views/1"
								target="_blank"
								rel="noopener noreferrer"
								className="justify-self-end"
							>
								<Button
									className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#450C13] hover:shadow-lg hover:shadow-[#FF223B]/50 text-white h-12 px-6 group/btn"
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
								>
									<span className="font-bold uppercase title-font">View Missions</span>
									<ExternalLink className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" />
								</Button>
							</a>
						</div>
					</motion.div>

					{/* Step 02 */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}
						className="relative bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#5865F2]/50 transition-all group"
						style={{ borderRadius: 0 }}
					>
						<div className="grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 p-6 md:p-8 items-center">
							{/* Number Badge */}
							<div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-r from-[#5865F2] to-[#4752c4] flex items-center justify-center group-hover:scale-110 transition-transform"
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
								<span className="text-xl font-bold text-white title-font">02</span>
							</div>

							{/* Icon */}
							<div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#5865F2] to-[#4752c4] flex items-center justify-center ml-8 md:ml-0"
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
								<MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
							</div>

							{/* Content */}
							<div>
								<h3 className="text-xl md:text-2xl font-bold text-[#F2EDE7] mb-2 title-font">
									JOIN THE COMMUNITY
								</h3>
								<p className="text-sm md:text-base text-[#F2EDE7]/70">
									Connect with the team on Discord. Introduce yourself, discuss your chosen mission, and get it assigned to you.
								</p>
							</div>

							{/* CTA */}
							<a
								href="https://discord.gg/dXn3vmtY"
								target="_blank"
								rel="noopener noreferrer"
								className="justify-self-end"
							>
								<Button
									className="bg-gradient-to-r from-[#5865F2] to-[#4752c4] hover:shadow-lg hover:shadow-[#5865F2]/50 text-white h-12 px-6 group/btn"
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
								>
									<span className="font-bold uppercase title-font">Join Discord</span>
									<ExternalLink className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" />
								</Button>
							</a>
						</div>
					</motion.div>

					{/* Step 03 */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="relative bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#14F195]/50 transition-all group"
						style={{ borderRadius: 0 }}
					>
						<div className="grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 p-6 md:p-8 items-center">
							{/* Number Badge */}
							<div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-r from-[#14F195] to-[#00D9B5] flex items-center justify-center group-hover:scale-110 transition-transform"
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
								<span className="text-xl font-bold text-black title-font">03</span>
							</div>

							{/* Icon */}
							<div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#14F195] to-[#00D9B5] flex items-center justify-center ml-8 md:ml-0"
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
								<Trophy className="w-8 h-8 md:w-10 md:h-10 text-black" />
							</div>

							{/* Content */}
							<div>
								<h3 className="text-xl md:text-2xl font-bold text-[#F2EDE7] mb-2 title-font">
									COMPLETE & EARN XP
								</h3>
								<p className="text-sm md:text-base text-[#F2EDE7]/70">
									Complete your mission and earn XP points. Track your progress on the leaderboard (for developers) or Zealy (for non-coders).
								</p>
							</div>

							{/* CTAs */}
							<div className="flex flex-col gap-2 justify-self-end">
								<a
									href="https://sendo-labs.github.io/leaderboard/leaderboard"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										className="bg-gradient-to-r from-[#14F195] to-[#00D9B5] hover:shadow-lg hover:shadow-[#14F195]/50 text-black h-12 px-6 group/btn w-full"
										style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
									>
										<span className="font-bold uppercase title-font">View Leaderboard</span>
										<ExternalLink className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" />
									</Button>
								</a>
								<a
									href="https://zealy.io/cw/sendolossleaders/questboard/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										variant="outline"
										className="border-[#14F195]/50 text-[#14F195] hover:bg-[#14F195]/10 h-10 px-6 group/btn w-full"
										style={{ borderRadius: 0 }}
									>
										<span className="font-bold uppercase text-xs title-font">Zealy Quests</span>
										<ExternalLink className="w-3 h-3 ml-2 group-hover/btn:scale-110 transition-transform" />
									</Button>
								</a>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.div>

			{/* Rewards System */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="mb-20"
			>
				<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 md:mb-6 title-font">
					REWARDS{" "}
					<span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
						SYSTEM
					</span>
				</h2>

				<div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-12">
					{/* Protocol Fees Distribution */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1, duration: 0.6 }}
						className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:border-[#FFD700]/50 p-6 md:p-8 transition-all group"
						style={{ borderRadius: 0 }}
					>
						<div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto"
							style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
							<Coins className="w-8 h-8 text-black" />
						</div>
						<h3 className="text-lg md:text-xl font-bold text-[#F2EDE7] mb-3 text-center title-font">
							PROTOCOL FEES<br />DISTRIBUTION
						</h3>
						<p className="text-sm text-[#F2EDE7]/70 text-center">
							Initially, protocol fees will be redistributed to all XP holders proportionally to their contribution.
						</p>
					</motion.div>

					{/* Mission-Based Payments */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}
						className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:border-[#FFD700]/50 p-6 md:p-8 transition-all group"
						style={{ borderRadius: 0 }}
					>
						<div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto"
							style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
							<Zap className="w-8 h-8 text-black" />
						</div>
						<h3 className="text-lg md:text-xl font-bold text-[#F2EDE7] mb-3 text-center title-font">
							MISSION-BASED<br />PAYMENTS
						</h3>
						<p className="text-sm text-[#F2EDE7]/70 text-center">
							Once the treasury is established, payments will be made per mission with priority access for existing contributors.
						</p>
					</motion.div>

					{/* Community Benefits */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:border-[#FFD700]/50 p-6 md:p-8 transition-all group"
						style={{ borderRadius: 0 }}
					>
						<div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto"
							style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
							<Users className="w-8 h-8 text-black" />
						</div>
						<h3 className="text-lg md:text-xl font-bold text-[#F2EDE7] mb-3 text-center title-font">
							COMMUNITY<br />BENEFITS
						</h3>
						<p className="text-sm text-[#F2EDE7]/70 text-center">
							Early contributors get exclusive access to new features, governance rights, and recognition in the community.
						</p>
					</motion.div>
				</div>
			</motion.div>

			{/* CTA Footer */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="bg-gradient-to-br from-[#FF5C1A]/10 via-[#FF223B]/10 to-[#450C13]/10 border border-[#FF5C1A]/30 p-8 md:p-12 relative overflow-hidden"
				style={{ borderRadius: 0 }}
			>
				<div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C1A]/5 blur-3xl" />

				<div className="relative z-10 text-center">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 title-font">
						READY TO{" "}
						<span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#450C13] bg-clip-text text-transparent">
							CONTRIBUTE?
						</span>
					</h2>

					<p className="text-base sm:text-lg text-[#F2EDE7]/70 mb-8 max-w-2xl mx-auto">
						Join hundreds of developers and community members building the future of crypto trading
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="https://github.com/orgs/Sendo-labs/projects/2/views/1"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button
								className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#450C13] hover:shadow-lg hover:shadow-[#FF223B]/50 text-white h-14 px-8 group/btn w-full sm:w-auto rounded-none"
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'}}
							>
								<Code className="w-5 h-5 mr-2" />
								<span className="font-bold uppercase title-font">Start Coding</span>
								<ExternalLink className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" />
							</Button>
						</a>

						<a
							href="https://discord.gg/dXn3vmtY"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button
								className="bg-gradient-to-r from-[#5865F2] to-[#4752c4] hover:shadow-lg hover:shadow-[#5865F2]/50 text-white h-14 px-8 group/btn w-full sm:w-auto rounded-none"
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'}}
							>
								<MessageCircle className="w-5 h-5 mr-2" />
								<span className="font-bold uppercase title-font">Join Discord</span>
								<ExternalLink className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" />
							</Button>
						</a>
					</div>
				</div>
			</motion.div>
		</PageWrapper>
	);
}