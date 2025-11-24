import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Store, Zap, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Step {
	number: string;
	icon: typeof Search;
	title: string;
	description: string;
	highlight: string;
	videoUrl: string;
}

const steps: Step[] = [
	{
		number: '01',
		icon: Search,
		title: 'ANALYZE YOUR WALLET',
		description:
			'Connect your Solana wallet and we scan your entire on-chain history. See exactly how much you lost by not selling at ATH.',
		highlight: 'No judgment — just data and insights.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed3ab6e8162e7baa0b868a_video-1-transcode.mp4',
	},
	{
		number: '02',
		icon: Brain,
		title: 'CREATE YOUR AGENT AI',
		description:
			'Build your personal trading Agent AI from your analysis. It learns from your on-chain memory and evolves with your strategies.',
		highlight: 'Your Agent belongs only to you.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed4058959760426e5e4779_video-2-transcode.mp4',
	},
	{
		number: '03',
		icon: Store,
		title: 'EXPLORE THE MARKETPLACE',
		description:
			'Access the best tools through our open marketplace. Each plugin is tracked and rated on-chain based on community votes.',
		highlight: 'Transparent and trustless.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed4189738859bdebb81ecc_video-3-transcode.mp4',
	},
	{
		number: '04',
		icon: Zap,
		title: 'TRADE SMARTER',
		description:
			'Your Agent AI guides you in real time and will soon trade for you. Keep your privacy and data ownership intact.',
		highlight: 'Run on cloud or your computer.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed45899473c4a9b86649e7_video-4-transcode.mp4',
	},
	{
		number: '05',
		icon: Sparkles,
		title: 'THE FUTURE IS AGENTIC',
		description:
			'The next generation of finance powered by AI agents. Each investor will have their own Agent AI, competing to offer you the best opportunities.',
		highlight: 'Your digital twin in the markets.',
		videoUrl:
			'https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c%2F68ed461fd7af48aaabf760b9_video-5-transcode.mp4',
	},
];

export default function HowItWorksSectionV2() {
	const [currentStep, setCurrentStep] = useState(0);

	// Auto-slider: change slide every 7 seconds
	useEffect(() => {
		const autoSlideInterval = setInterval(() => {
			setCurrentStep((prev) => (prev + 1) % steps.length);
		}, 7000);

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
		<section id='how-it-works' className='py-16 sm:py-20 px-4 sm:px-6'>
			<div className='max-w-7xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className='text-center mb-12 sm:mb-16'
				>
					<h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 uppercase px-4 title-font'>
						HOW IT{' '}
						<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
							WORKS
						</span>
					</h2>
					<p className='text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto px-4'>
						From wallet analysis to autonomous trading — your journey in 5 steps
					</p>
				</motion.div>

				{/* Desktop & Tablet: Full Screen Slideshow */}
				<div className='hidden md:block'>
					<div className='relative max-w-6xl mx-auto'>
						{/* Main Video Container - Large and Centered */}
						<div className='relative mb-8'>
							<AnimatePresence mode='wait'>
								<motion.div
									key={currentStep}
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.6 }}
									className='relative aspect-video bg-foreground/5 border-2 border-sendo-orange/30 overflow-hidden'
									style={{
										clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)',
									}}
								>
									<video src={step.videoUrl} autoPlay loop muted playsInline className='w-full h-full object-cover' suppressHydrationWarning />

									{/* Overlay gradient bottom */}
									<div className='absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none' />

									{/* Number Badge - Top Left */}
									<div
										className='absolute top-6 left-6 w-16 h-16 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center'
										style={{
											clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
										}}
									>
										<span className='text-2xl font-bold text-white title-font'>{step.number}</span>
									</div>

									{/* Info Overlay - Bottom */}
									<div className='absolute bottom-0 left-0 right-0 p-6 lg:p-8'>
										<div className='flex items-start gap-4 mb-4'>
											<div
												className='w-14 h-14 bg-background border-2 border-sendo-orange flex items-center justify-center flex-shrink-0'
												style={{
													clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
												}}
											>
												<step.icon className='w-7 h-7 text-sendo-orange' />
											</div>
											<div className='flex-1'>
												<h3 className='text-2xl lg:text-3xl font-bold uppercase title-font text-white mb-2'>
													{step.title}
												</h3>
												<p className='text-sm lg:text-base text-white/90 leading-relaxed'>{step.description}</p>
											</div>
										</div>

										{/* Highlight Bar */}
										<div
											className='bg-sendo-orange/20 backdrop-blur-sm border-l-4 border-sendo-orange pl-4 py-3'
											style={{ borderRadius: 0 }}
										>
											<p className='text-sm lg:text-base text-white font-semibold italic'>{step.highlight}</p>
										</div>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Steps Navigation - Thumbnails Style */}
						<div className='grid grid-cols-5 gap-3'>
							{steps.map((s, index) => (
								<button
									key={index}
									onClick={() => setCurrentStep(index)}
									className={`relative group transition-all ${
										index === currentStep ? 'opacity-100' : 'opacity-50 hover:opacity-75'
									}`}
									type='button'
								>
									<div
										className={`bg-foreground/5 border-2 ${
											index === currentStep ? 'border-sendo-orange' : 'border-foreground/10'
										} p-3 transition-all`}
										style={{
											clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
										}}
									>
										<div
											className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center ${
												index === currentStep
													? 'bg-gradient-to-r from-sendo-orange to-sendo-red'
													: 'bg-foreground/10'
											}`}
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
											}}
										>
											<s.icon
												className={`w-5 h-5 ${index === currentStep ? 'text-white' : 'text-foreground/40'}`}
											/>
										</div>
										<p
											className={`text-xs font-bold uppercase title-font ${
												index === currentStep ? 'text-foreground' : 'text-foreground/40'
											}`}
										>
											{s.number}
										</p>
									</div>
								</button>
							))}
						</div>

						{/* Progress Bar */}
						<div className='mt-6 flex items-center gap-4'>
							<button
								onClick={prevStep}
								className='w-10 h-10 bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg flex items-center justify-center transition-all group'
								style={{ borderRadius: 0 }}
								type='button'
							>
								<ChevronLeft className='w-5 h-5 text-white' />
							</button>

							<div className='flex-1 h-1 bg-foreground/10' style={{ borderRadius: 0 }}>
								<motion.div
									className='h-full bg-gradient-to-r from-sendo-orange to-sendo-red'
									initial={{ width: 0 }}
									animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
									transition={{ duration: 0.5 }}
									style={{ borderRadius: 0 }}
								/>
							</div>

							<button
								onClick={nextStep}
								className='w-10 h-10 bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg flex items-center justify-center transition-all group'
								style={{ borderRadius: 0 }}
								type='button'
							>
								<ChevronRight className='w-5 h-5 text-white' />
							</button>
						</div>
					</div>
				</div>

				{/* Mobile: Scrollable Cards with Videos */}
				<div className='md:hidden space-y-6'>
					{steps.map((mobileStep, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className='space-y-3'
						>
							{/* Video */}
							<div
								className='relative aspect-video bg-foreground/5 border-2 border-foreground/10 overflow-hidden'
								style={{
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
								}}
							>
								<video src={mobileStep.videoUrl} autoPlay loop muted playsInline className='w-full h-full object-cover' suppressHydrationWarning />
								<div
									className='absolute top-3 right-3 px-2 py-1 text-sm font-bold uppercase bg-sendo-orange text-white'
									style={{ borderRadius: 0 }}
								>
									{mobileStep.number}
								</div>
							</div>

							{/* Content */}
							<div
								className='bg-foreground/5 border-2 border-foreground/10 p-5'
								style={{
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
								}}
							>
								<div
									className='w-12 h-12 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center mb-3'
									style={{
										clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
									}}
								>
									<mobileStep.icon className='w-6 h-6 text-white' />
								</div>

								<h3 className='text-lg font-bold mb-2 uppercase title-font'>{mobileStep.title}</h3>
								<p className='text-sm leading-relaxed mb-3 text-foreground/70'>{mobileStep.description}</p>

								<div
									className='bg-gradient-to-r from-sendo-orange/10 to-transparent border-l-2 border-sendo-orange pl-3 py-2'
									style={{ borderRadius: 0 }}
								>
									<p className='text-xs text-foreground/90 font-semibold italic'>{mobileStep.highlight}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className='mt-12 text-center'
				>
					<Link href='/analyzer'>
						<Button
							className='h-12 sm:h-14 px-8 sm:px-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red text-white hover:shadow-xl uppercase font-bold text-sm sm:text-base'
							style={{ borderRadius: 0 }}
						>
							<span className='title-font'>START NOW</span>
							<ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 ml-2' />
						</Button>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

