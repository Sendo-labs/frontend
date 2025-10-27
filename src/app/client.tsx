'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import HeroSection from '@/components/home/hero-section';
import ContactSection from '@/components/home/contact-section';
import HowItWorksSection from '@/components/home/how-it-works-section';
import StatisticsSection from '@/components/home/statistics-section';
import TeamSection from '@/components/home/team-section';
import { TestIdentityToken } from '@/components/auth/test-identity-token';

// 5 sections au total: hero + how it works + stats + team + contact
const totalSections = 5;

export default function Home() {
	const [currentSection, setCurrentSection] = useState(0);
	const [isScrolling, setIsScrolling] = useState(false);

	// Desktop scroll only
	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			if (window.innerWidth >= 768 && !isScrolling) {
				e.preventDefault();
				setIsScrolling(true);

				if (e.deltaY > 0 && currentSection < totalSections - 1) {
					setCurrentSection((prev) => prev + 1);
				} else if (e.deltaY < 0 && currentSection > 0) {
					setCurrentSection((prev) => prev - 1);
				}

				setTimeout(() => setIsScrolling(false), 1000);
			}
		};

		window.addEventListener('wheel', handleWheel, { passive: false });
		return () => window.removeEventListener('wheel', handleWheel);
	}, [currentSection, isScrolling]);

	return (
		<>
			<TestIdentityToken />
			{/* Desktop Version - Snap Scroll */}
			<div className='hidden md:block relative w-full h-screen overflow-hidden'>
				{/* Navigation Dots */}
				<div className='fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4'>
					{Array.from({ length: totalSections }).map((_, index) => (
						<button
							type='button'
							key={index}
							onClick={() => setCurrentSection(index)}
							className={`w-3 h-3 transition-all duration-300 ${
								currentSection === index ? 'bg-foreground w-3 h-8' : 'bg-foreground/20 hover:bg-foreground/40'
							}`}
							style={{ borderRadius: 0 }}
							aria-label={`Go to section ${index + 1}`}
						/>
					))}
				</div>

				{/* Sections Container */}
				<motion.div
					className='relative w-full'
					style={{ height: `${totalSections * 100}vh` }}
					animate={{ y: `-${currentSection * 100}vh` }}
					transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
				>
					{/* Hero - Section 0 */}
					<div className='absolute top-0 left-0 w-full h-screen'>
						<HeroSection />
					</div>

					{/* How It Works - Section 1 */}
					<div className='absolute left-0 w-full h-screen' style={{ top: '100vh' }}>
						<HowItWorksSection />
					</div>

					{/* Statistics - Section 2 */}
					<div className='absolute left-0 w-full h-screen' style={{ top: '200vh' }}>
						<StatisticsSection />
					</div>

					{/* Team - Section 3 */}
					<div className='absolute left-0 w-full h-screen' style={{ top: '300vh' }}>
						<TeamSection />
					</div>

					{/* Contact - Section 4 */}
					<div className='absolute left-0 w-full h-screen' style={{ top: '400vh' }}>
						<ContactSection />
					</div>
				</motion.div>

				{/* Scroll Indicator */}
				{currentSection < totalSections - 1 && (
					<motion.div
						className='fixed bottom-8 left-1/2 -translate-x-1/2 z-40'
						animate={{ y: [0, 10, 0] }}
						transition={{ repeat: Infinity, duration: 1.5 }}
					>
						<ChevronDown className='w-8 h-8 text-foreground/60' />
					</motion.div>
				)}
			</div>

			{/* Mobile Version - Simple Free Scroll */}
			<div className='md:hidden w-full min-h-screen bg-background'>
				<div className='w-full'>
					<HeroSection />
				</div>
				<div className='w-full'>
					<HowItWorksSection />
				</div>
				<div className='w-full'>
					<StatisticsSection />
				</div>
				<div className='w-full'>
					<TeamSection />
				</div>
				<div className='w-full'>
					<ContactSection />
				</div>
			</div>
		</>
	);
}
