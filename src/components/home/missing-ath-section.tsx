'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MissingAthChart, { type ChartCase } from './missing-ath-chart';

interface ChartCard {
	caseType: ChartCase;
	title: string;
	description: string;
}

const chartCards: ChartCard[] = [
	{
		caseType: 'sold-before-peak',
		title: 'Sold before the peak.',
		description: 'You exit in profit, but miss the top.',
	},
	{
		caseType: 'sold-during-drop',
		title: 'Sold during the drop.',
		description: 'The peak is behind you, the market reverses.',
	},
	{
		caseType: 'no-sale',
		title: 'No sale, no PNL.',
		description: 'The token peaked and slipped back down.',
	},
];

export default function MissingAthSection() {
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<section id='about' className='w-full bg-[#CCCCCC] pt-4 pb-20 px-4 sm:pt-6 sm:pb-12 sm:px-6 md:pt-8 md:pb-16 lg:pt-10 lg:pb-40'>
			<div className='max-w-7xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
					style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
					className='mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28'
				>
					<div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 w-full'>
						<p className='text-[#2B2B2B] text-sm sm:text-base md:text-lg font-normal whitespace-nowrap'>
							Backed by
						</p>
						<div className='flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12'>
							<motion.a
								href='https://solana.org/'
								target='_blank'
								rel='noopener noreferrer'
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
								style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
								className='opacity-80 hover:opacity-100 hover:brightness-75 transition-all duration-300 flex items-center cursor-pointer'
							>
								<img
									src='/logos_partners/foundation_solana.png'
									alt='Solana Foundation'
									className='block w-auto object-contain h-4 sm:h-5 md:h-6 lg:h-[22px]'
								/>
							</motion.a>

							<motion.a
								href='https://superteam.fun/'
								target='_blank'
								rel='noopener noreferrer'
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
								style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
								className='opacity-80 hover:opacity-100 hover:brightness-75 transition-all duration-300 flex items-center cursor-pointer'
							>
								<img
									src='/logos_partners/superteam.png'
									alt='Superteam'
									className='block w-auto object-contain h-5 sm:h-6 md:h-7 lg:h-[28px]'
								/>
							</motion.a>

							<motion.a
								href='https://elizaos.ai/'
								target='_blank'
								rel='noopener noreferrer'
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
								style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
								className='opacity-80 hover:opacity-100 hover:brightness-75 transition-all duration-300 flex items-center cursor-pointer'
							>
								<img
									src='/logos_partners/elizaos-logo.png'
									alt='ELIZA.OS'
									className='block w-auto object-contain h-4 sm:h-5 md:h-5 lg:h-[20px]'
								/>
							</motion.a>

							<motion.a
								href='https://www.codigo.ai/'
								target='_blank'
								rel='noopener noreferrer'
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
								style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
								className='opacity-80 hover:opacity-100 hover:brightness-75 transition-all duration-300 flex items-center cursor-pointer'
							>
								<img
									src='/logos_partners/codigo-logo.png'
									alt='Código'
									className='block w-auto object-contain h-6 sm:h-7 md:h-8 lg:h-[38px]'
								/>
							</motion.a>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
					style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
					className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-10 sm:mb-14 md:mb-18 lg:mb-20'
				>
					<div>
						<p className='text-[#2B2B2B] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed'>
							<span className='font-bold'>Your PNL is incomplete.</span>{' '}
							<span className='text-[#595959] font-normal'>
								Trading tools show what you earned or lost, but never what you should have made. A blind spot
								that hides your real performance as a trader.
							</span>
						</p>
					</div>

					<div>
						<p className='text-[#2B2B2B] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed'>
							<span className='font-bold'>Sendo reveals what&apos;s missing.</span>{' '}
							<span className='text-[#595959] font-normal'>
								By reconstructing every buy, sell and ATH across your wallet, we expose the money left on the
								table —
							</span>
							<span className='font-bold'> the gap between your conviction and your execution.
							</span>
						</p>
					</div>
				</motion.div>

				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
					style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
					className='text-[#2B2B2B] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-left mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28 mb-10 sm:mb-14 md:mb-18 lg:mb-20 xl:mb-24'
				>
					Understand the value
					<br />you left behind.
				</motion.h2>

				{/* Swipe Indicator - Mobile Only */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className='md:hidden flex items-center justify-center gap-2 mb-6 text-[#2B2B2B]/40 text-sm font-mono'
				>
					<span className='animate-pulse'>←</span>
					<span>SWIPE TO EXPLORE</span>
					<span className='animate-pulse'>→</span>
				</motion.div>

				<div className='flex md:grid md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory px-4 -mx-4 md:px-0 md:mx-0 no-scrollbar'>
					{chartCards.map((card, index) => {
						const animationTypes: Array<'slide' | 'fade' | 'scale'> = ['slide', 'fade', 'scale'];
						const animationType = animationTypes[index % 3];
						// Each chart starts after the previous one's candles have finished
						// Animation timeline: 0.2s (card appear) + 1.2s (8 candles * 0.15s) = ~1.4s for candles
						// Start next chart when previous candles are done (1.5s delay)
						
						// Animation configuration
						// On mobile: fast sequential animation (swipe friendly)
						// On desktop: slow sequential animation (scroll friendly)
						const animationDelay = isMobile ? index * 0.1 : index * 1.5;

						return (
							<motion.div 
								key={card.caseType} 
								className='flex flex-col w-[85vw] max-w-[400px] md:w-auto md:max-w-none shrink-0 snap-center first:pl-4 last:pr-4 md:first:pl-0 md:last:pr-0 h-full'
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true, margin: isMobile ? '0px' : '0px 0px -100px 0px' }}
								transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
								style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
							>
								<div className='w-full mb-4 sm:mb-6 md:mb-8 flex justify-center items-center aspect-square'>
									<MissingAthChart 
										caseType={card.caseType} 
										animationDelay={animationDelay}
										animationType={animationType}
										isMobile={isMobile}
									/>
								</div>

								<motion.div 
									className='text-left flex-1'
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: animationDelay, ease: [0.25, 0.1, 0.25, 1] }}
									style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
								>
									<h4 className='text-[#2B2B2B] text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2'>
										{card.title}
									</h4>
									<p className='text-[#2B2B2B] text-sm sm:text-base md:text-lg opacity-70'>
										{card.description}
									</p>
								</motion.div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

