import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Store, Zap, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

const steps = [
	{
		number: '01',
		icon: Search,
		title: 'ANALYZE YOUR WALLET',
		description:
			'Give us your Solana address. We scan your entire on-chain history — every trade, every token, every mistake. See exactly how much you lost by not selling at ATH.',
		highlight: 'No judgment — just data, transparency, and insights.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed3ab6e8162e7baa0b868a_video-1-transcode.mp4',
	},
	{
		number: '02',
		icon: Brain,
		title: 'CREATE YOUR OWN AGENTAI',
		description:
			'Build your personal trading AgentAI from your analysis. It learns from your on-chain memory, builds your trading profile, and evolves with your strategies. Your wallet, your data, your rules.',
		highlight: 'Your Agent belongs only to you — forever.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed4058959760426e5e4779_video-2-transcode.mp4',
	},
	{
		number: '03',
		icon: Store,
		title: 'EXPLORE THE MARKETPLACE',
		description:
			'Access the best tools through our open marketplace of plugins. Each plugin is tracked and rated on-chain based on community votes, performance, and active users.',
		highlight: 'Transparent and trustless — no more fake bots.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed4189738859bdebb81ecc_video-3-transcode.mp4',
	},
	{
		number: '04',
		icon: Zap,
		title: 'TRADE SMARTER, OWN EVERYTHING',
		description:
			'Your AgentAI guides you in real time and will soon trade for you — fully automated, fully personalized. Keep your privacy and data ownership intact.',
		highlight: 'Run on our cloud or on your own computer.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed45899473c4a9b86649e7_video-4-transcode.mp4',
	},
	{
		number: '05',
		icon: Sparkles,
		title: 'THE FUTURE IS AGENTIC',
		description:
			'The next generation of finance will be powered by AI agents. Each investor, protocol, and fund will have their own AgentAI, all connected and competing to offer you the best opportunities.',
		highlight: "You're building your digital twin in the markets.",
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed461fd7af48aaabf760b9_video-5-transcode.mp4',
	},
];

export default function HowItWorksSection() {
	const [currentStep, setCurrentStep] = useState(0);

	// Auto-slider: change de slide toutes les 5 secondes
	useEffect(() => {
		const autoSlideInterval = setInterval(() => {
			setCurrentStep((prev) => (prev + 1) % steps.length);
		}, 5000);

		return () => clearInterval(autoSlideInterval);
	}, []);

	const nextStep = () => {
		setCurrentStep((prev) => (prev + 1) % steps.length);
	};

	const prevStep = () => {
		setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
	};

	const step = steps[currentStep];

	return (
		<section className='relative w-full min-h-screen flex items-center justify-center bg-background py-16 md:py-0 overflow-hidden'>
			<div className='max-w-[1400px] mx-auto w-full px-4 sm:px-6'>
				{/* Title */}
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-foreground title-font'
				>
					HOW IT{' '}
					<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>WORKS</span>
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className='text-base sm:text-lg md:text-xl text-foreground/60 text-center mb-8 sm:mb-12 md:mb-16'
				>
					From wallet analysis to autonomous trading — your journey in 5 steps
				</motion.p>

				{/* Desktop: Slider horizontal */}
				<div className='hidden md:block'>
					<div className='relative'>
						<AnimatePresence mode='wait'>
							<motion.div
								key={currentStep}
								initial={{ opacity: 0, x: 100 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -100 }}
								transition={{ duration: 0.5 }}
								className='grid md:grid-cols-2 gap-8 lg:gap-12 items-center'
							>
								{/* Content Side */}
								<div className='order-2 md:order-1'>
									<div
										className='relative bg-foreground/5 border border-foreground/10 p-8 lg:p-10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
										style={{ borderRadius: 0 }}
									>
										{/* Number Badge */}
										<div
											className='absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center group-hover:scale-110 transition-transform'
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
											}}
										>
											<span className='text-3xl font-bold text-white title-font'>{step.number}</span>
										</div>

										{/* Icon */}
										<div
											className='w-16 h-16 bg-black border border-sendo-orange/30 flex items-center justify-center mb-6 ml-10'
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
											}}
										>
											<step.icon className='w-8 h-8 text-sendo-orange' />
										</div>

										{/* Title */}
										<h3 className='text-2xl lg:text-3xl font-bold text-foreground mb-4 title-font'>{step.title}</h3>

										{/* Description */}
										<p className='text-base lg:text-lg text-foreground/70 leading-relaxed mb-6'>{step.description}</p>

										{/* Highlight */}
										<div
											className='bg-gradient-to-r from-sendo-orange/10 to-transparent border-l-4 border-sendo-orange pl-4 py-3'
											style={{ borderRadius: 0 }}
										>
											<p className='text-base lg:text-lg text-foreground/90 font-semibold italic'>{step.highlight}</p>
										</div>
									</div>
								</div>

								{/* Media Side - Vidéo */}
								<div className='order-1 md:order-2'>
									<div
										className='relative aspect-square bg-foreground/5 border border-foreground/10 flex items-center justify-center group hover:border-sendo-orange/50 transition-all overflow-hidden'
										style={{ borderRadius: 0 }}
									>
										<video src={step.videoUrl} autoPlay loop muted playsInline className='w-full h-full object-cover' />
									</div>
								</div>
							</motion.div>
						</AnimatePresence>

						{/* Navigation Arrows */}
						<div className='flex items-center justify-center gap-4 mt-8'>
							<Button
								onClick={prevStep}
								className='w-14 h-14 bg-foreground/10 border border-foreground/20 flex items-center justify-center hover:bg-foreground/20 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<ChevronLeft className='w-6 h-6 text-foreground group-hover:text-sendo-orange transition-colors' />
							</Button>

							{/* Step Indicators */}
							<div className='flex gap-2'>
								{steps.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentStep(index)}
										className={`h-2 transition-all ${
											index === currentStep
												? 'w-8 bg-gradient-to-r from-sendo-orange to-sendo-red'
												: 'w-2 bg-foreground/20 hover:bg-foreground/40'
										}`}
										style={{ borderRadius: 0 }}
										type='button'
									/>
								))}
							</div>

							<Button
								onClick={nextStep}
								className='w-14 h-14 bg-foreground/10 border border-foreground/20 flex items-center justify-center hover:bg-foreground/20 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<ChevronRight className='w-6 h-6 text-foreground group-hover:text-sendo-orange transition-colors' />
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile: Scroll vertical simple */}
				<div className='md:hidden space-y-8'>
					{steps.map((mobileStep, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className='space-y-4'
						>
							{/* Media Vidéo */}
							<div
								className='relative aspect-square bg-foreground/5 border border-foreground/10 flex items-center justify-center overflow-hidden'
								style={{ borderRadius: 0 }}
							>
								<video
									src={mobileStep.videoUrl}
									autoPlay
									loop
									muted
									playsInline
									className='w-full h-full object-cover'
								/>
							</div>

							{/* Content */}
							<div className='relative bg-foreground/5 border border-foreground/10 p-6' style={{ borderRadius: 0 }}>
								{/* Number Badge */}
								<div
									className='absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
								>
									<span className='text-xl font-bold text-white title-font'>{mobileStep.number}</span>
								</div>

								{/* Icon */}
								<div
									className='w-12 h-12 bg-black border border-sendo-orange/30 flex items-center justify-center mb-4 ml-8'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
								>
									<mobileStep.icon className='w-6 h-6 text-sendo-orange' />
								</div>

								{/* Title */}
								<h3 className='text-lg font-bold text-foreground mb-3 title-font'>{mobileStep.title}</h3>

								{/* Description */}
								<p className='text-sm text-foreground/70 leading-relaxed mb-3'>{mobileStep.description}</p>

								{/* Highlight */}
								<div
									className='bg-gradient-to-r from-sendo-orange/10 to-transparent border-l-2 border-sendo-orange pl-3 py-2'
									style={{ borderRadius: 0 }}
								>
									<p className='text-sm text-foreground/90 font-semibold italic'>{mobileStep.highlight}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* CTA Button */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className='mt-12 md:mt-16 text-center'
				>
					<p className='text-foreground/60 text-sm sm:text-base md:text-lg mb-4'>Ready to build your trading future?</p>
					{/* Changed div to a and added href for redirection */}
					<a
						href='/connect-wallet' // Assuming '/connect-wallet' is the desired path for wallet connection
						className='inline-block bg-gradient-to-r from-sendo-orange to-sendo-red p-[2px] hover:shadow-lg hover:shadow-sendo-red/50 transition-all group'
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
					>
						<div
							className='bg-background px-6 py-3 hover:bg-transparent transition-all flex items-center gap-2'
							style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
						>
							<span className='text-white font-bold text-sm sm:text-base title-font'>START NOW</span>
							<ArrowRight className='w-4 h-4 text-white group-hover:translate-x-1 transition-transform' />
						</div>
					</a>
				</motion.div>
			</div>
		</section>
	);
}
