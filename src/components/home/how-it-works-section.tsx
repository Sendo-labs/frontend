import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Store, Zap, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
		<section className='relative w-full h-screen flex items-center justify-center bg-background py-6 md:py-8 lg:py-12 overflow-hidden'>
			<div className='max-w-[1200px] mx-auto w-full px-4 sm:px-6 flex flex-col justify-center items-center h-full'>
				{/* Title */}
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 md:mb-3 text-foreground title-font'
				>
					HOW IT{' '}
					<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
						WORKS
					</span>
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className='text-xs sm:text-sm md:text-base text-foreground/60 text-center mb-4 md:mb-6'
				>
					From wallet analysis to autonomous trading — your journey in 5 steps
				</motion.p>

				{/* Desktop: Slider horizontal */}
				<div className='hidden md:block w-full'>
					<div className='relative w-full max-w-[1000px] mx-auto'>
						<AnimatePresence mode='wait'>
							<motion.div
								key={currentStep}
								initial={{ opacity: 0, x: 100 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -100 }}
								transition={{ duration: 0.5 }}
								className='grid md:grid-cols-2 gap-4 lg:gap-6 items-center'
							>
								{/* Content Side */}
								<div className='order-2 md:order-1'>
									<div
										className='relative bg-foreground/5 border border-foreground/10 p-3 md:p-4 lg:p-6 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
										style={{ borderRadius: 0 }}
									>
										{/* Number Badge */}
										<div
											className='absolute -top-2 -left-2 md:-top-3 md:-left-3 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center group-hover:scale-110 transition-transform'
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
											}}
										>
											<span className='text-base md:text-lg lg:text-xl font-bold text-white title-font'>
												{step.number}
											</span>
										</div>

										{/* Icon */}
										<div
											className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-background border border-sendo-orange/30 flex items-center justify-center mb-2 md:mb-3 ml-5 md:ml-6'
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
											}}
										>
											<step.icon className='w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-sendo-orange' />
										</div>

										{/* Title */}
										<h3 className='text-sm md:text-base lg:text-lg font-bold text-foreground mb-2 title-font'>
											{step.title}
										</h3>

										{/* Description */}
										<p className='text-xs md:text-sm text-foreground/70 leading-relaxed mb-2 md:mb-3'>
											{step.description}
										</p>

										{/* Highlight */}
										<div
											className='bg-gradient-to-r from-sendo-orange/10 to-transparent border-l-2 border-sendo-orange pl-2 py-1.5'
											style={{ borderRadius: 0 }}
										>
											<p className='text-xs md:text-sm text-foreground/90 font-semibold italic'>{step.highlight}</p>
										</div>
									</div>
								</div>

								{/* Media Side - Vidéo */}
								<div className='order-1 md:order-2 flex justify-center items-center'>
									<div
										className='relative w-full aspect-square max-w-[400px] bg-foreground/5 border border-foreground/10 flex items-center justify-center group hover:border-sendo-orange/50 transition-all overflow-hidden'
										style={{ borderRadius: 0 }}
									>
										<video src={step.videoUrl} autoPlay loop muted playsInline className='w-full h-full object-cover' />
									</div>
								</div>
							</motion.div>
						</AnimatePresence>

						{/* Navigation Arrows */}
						<div className='flex items-center justify-center gap-3 mt-4'>
							<button
								onClick={prevStep}
								className='w-9 h-9 md:w-10 md:h-10 bg-foreground/10 border border-foreground/20 flex items-center justify-center hover:bg-foreground/20 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
								type='button'
							>
								<ChevronLeft className='w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-sendo-orange transition-colors' />
							</button>

							{/* Step Indicators */}
							<div className='flex gap-2'>
								{steps.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentStep(index)}
										className={`h-1.5 transition-all ${
											index === currentStep
												? 'w-6 md:w-8 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red'
												: 'w-1.5 bg-foreground/20 hover:bg-foreground/40'
										}`}
										style={{ borderRadius: 0 }}
										type='button'
									/>
								))}
							</div>

							<button
								onClick={nextStep}
								className='w-9 h-9 md:w-10 md:h-10 bg-foreground/10 border border-foreground/20 flex items-center justify-center hover:bg-foreground/20 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
								type='button'
							>
								<ChevronRight className='w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-sendo-orange transition-colors' />
							</button>
						</div>

						{/* START NOW Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.8 }}
							className='flex justify-center mt-6'
						>
							<a
								href='/connect-wallet'
								className='inline-block bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red p-[2px] hover:shadow-lg hover:shadow-sendo-red/50 transition-all group'
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
							>
								<div
									className='bg-background px-6 py-3 hover:bg-transparent transition-all flex items-center gap-2'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
								>
									<span className='text-white font-bold text-sm uppercase group-hover:text-white transition-colors title-font'>
										START NOW
									</span>
									<ArrowRight className='w-5 h-5 text-white group-hover:translate-x-1 transition-transform' />
								</div>
							</a>
						</motion.div>
					</div>
				</div>

				{/* Mobile: Scroll vertical simple */}
				<div className='md:hidden space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]'>
					{steps.map((mobileStep, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className='space-y-2'
						>
							{/* Media Vidéo */}
							<div
								className='relative h-48 bg-foreground/5 border border-foreground/10 flex items-center justify-center overflow-hidden'
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
							<div className='relative bg-foreground/5 border border-foreground/10 p-3' style={{ borderRadius: 0 }}>
								{/* Number Badge */}
								<div
									className='absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
								>
									<span className='text-base font-bold text-white title-font'>{mobileStep.number}</span>
								</div>

								{/* Icon */}
								<div
									className='w-8 h-8 bg-background border border-sendo-orange/30 flex items-center justify-center mb-2 ml-5'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)' }}
								>
									<mobileStep.icon className='w-4 h-4 text-sendo-orange' />
								</div>

								{/* Title */}
								<h3 className='text-sm font-bold text-foreground mb-1.5 title-font'>{mobileStep.title}</h3>

								{/* Description */}
								<p className='text-xs text-foreground/70 leading-relaxed mb-1.5'>{mobileStep.description}</p>

								{/* Highlight */}
								<div
									className='bg-gradient-to-r from-sendo-orange/10 to-transparent border-l-2 border-sendo-orange pl-2 py-1'
									style={{ borderRadius: 0 }}
								>
									<p className='text-xs text-foreground/90 font-semibold italic'>{mobileStep.highlight}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
