'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function HomepageNavbar() {
	const { ready, login } = usePrivy();
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [borderAnimationStarted, setBorderAnimationStarted] = useState(false);
	const [isOverWhiteSection, setIsOverWhiteSection] = useState(false);
	const [activeSection, setActiveSection] = useState('');

	const isHome = pathname === '/';

	// Helper to get correct link href
	const getLinkHref = (sectionId: string) => {
		return isHome ? `#${sectionId}` : `/#${sectionId}`;
	};

	// Active section detection
	useEffect(() => {
		if (!isHome) {
			setActiveSection('');
			return;
		}

		const handleScroll = () => {
			const sections = ['about', 'product', 'team'];
			// Trigger detection line at 30% of viewport height
			const triggerLine = window.innerHeight * 0.3;

			let current = '';

			for (const section of sections) {
				const element = document.getElementById(section);
				if (element) {
					const rect = element.getBoundingClientRect();
					// Check if the section contains the trigger line
					// rect.top is distance from viewport top
					// If rect.top <= triggerLine, the section top has passed the trigger line
					// If rect.bottom > triggerLine, the section bottom hasn't passed the trigger line yet
					if (rect.top <= triggerLine && rect.bottom > triggerLine) {
						current = section;
						break;
					}
				}
			}

			setActiveSection(current);
		};

		window.addEventListener('scroll', handleScroll);
		// Initial check
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	}, [isHome]);

	// Animation d'apparition (3 secondes sur la homepage, 0.1s ailleurs)
	useEffect(() => {
		const delay = isHome ? 3000 : 100;
		const timer = setTimeout(() => {
			setIsVisible(true);
			// Démarrer l'animation de bordure après un court délai
			setTimeout(() => {
				setBorderAnimationStarted(true);
			}, 300); // Démarrer l'animation 300ms après l'apparition
		}, delay);

		return () => clearTimeout(timer);
	}, [isHome]);

	// Détection du scroll pour l'effet blur
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Détection des sections blanches/noires pour adapter la bordure
	useEffect(() => {
		// Trouver la section MissingAthSection (fond blanc)
		const whiteSection = document.querySelector('section[class*="bg-[#CCCCCC]"]');

		if (!whiteSection) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// Si la section blanche est visible dans le viewport (sous la navbar)
					if (entry.isIntersecting) {
						const rect = entry.boundingClientRect;
						const navbarHeight = 120; // Hauteur approximative de la navbar
						// Si la section blanche est visible sous la navbar
						setIsOverWhiteSection(rect.top < navbarHeight && rect.bottom > 0);
					} else {
						setIsOverWhiteSection(false);
					}
				});
			},
			{
				root: null,
				rootMargin: '-120px 0px 0px 0px', // Prendre en compte la hauteur de la navbar
				threshold: 0,
			},
		);

		observer.observe(whiteSection);

		// Vérifier aussi au scroll pour plus de précision
		const handleScroll = () => {
			const rect = whiteSection.getBoundingClientRect();
			const navbarHeight = 120;
			setIsOverWhiteSection(rect.top < navbarHeight && rect.bottom > 0);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<nav
			className={cn(
				'fixed top-0 left-0 right-0 z-[100] pt-5 transition-all duration-500 ease-out',
				isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
			)}
		>
			<div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8'>
				<div
					className={cn(
						'w-full relative transition-all duration-300',
						isScrolled ? 'bg-black/50 backdrop-blur-md' : 'bg-black/50 backdrop-blur-sm',
					)}
					style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
				>
					{/* Animation de bordure qui fait le tour - progression linéaire */}
					{isVisible && (
						<div className='absolute inset-0 pointer-events-none z-10'>
							<svg className='absolute inset-0 w-full h-full' preserveAspectRatio='none' viewBox='0 0 1400 100'>
								<defs>
									<style>{`
										@keyframes drawBorderLinear {
											from {
												stroke-dashoffset: 3000;
											}
											to {
												stroke-dashoffset: 0;
											}
										}
									`}</style>
								</defs>
								<path
									d='M 0 0 L 1400 0 L 1400 88 L 1388 100 L 0 100 Z'
									fill='none'
									stroke={isOverWhiteSection ? 'rgba(0, 0, 0, 0.75)' : 'rgba(242, 237, 231, 0.3)'}
									strokeWidth='1.5'
									strokeLinejoin='miter'
									strokeLinecap='square'
									style={{
										strokeDasharray: '3000',
										animation: borderAnimationStarted ? 'drawBorderLinear 2s linear forwards' : 'none',
										strokeDashoffset: '3000',
										transition: 'stroke 0.3s ease',
									}}
								/>
							</svg>
						</div>
					)}

					<div className='px-6 sm:px-8 lg:px-10 py-4 sm:py-5'>
						<div className='flex items-center justify-between'>
							{/* Logo - width defined to balance the layout */}
							<div className='w-[200px] flex-shrink-0'>
								<Link href='/'>
									<img
										src='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png'
										alt='SENDO'
										className='h-5 sm:h-6'
									/>
								</Link>
							</div>

							{/* Navigation Links Desktop - Centered */}
							<div className='hidden md:flex items-center justify-center flex-1 gap-1'>
								<Link
									href={getLinkHref('about')}
									className={cn(
										'px-3 sm:px-4 py-2 text-sm sm:text-base transition-all uppercase',
										activeSection === 'about'
											? 'bg-foreground text-background'
											: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
									)}
									style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace', borderRadius: 0 }}
								>
									About
								</Link>
								<Link
									href={getLinkHref('product')}
									className={cn(
										'px-3 sm:px-4 py-2 text-sm sm:text-base transition-all uppercase',
										activeSection === 'product'
											? 'bg-foreground text-background'
											: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
									)}
									style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace', borderRadius: 0 }}
								>
									Product
								</Link>
								<Link
									href='/leaderboard'
									className={cn(
										'px-3 sm:px-4 py-2 text-sm sm:text-base transition-all uppercase',
										pathname === '/leaderboard'
											? 'bg-foreground text-background'
											: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
									)}
									style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace', borderRadius: 0 }}
								>
									Leaderboard
								</Link>
								<Link
									href={getLinkHref('team')}
									className={cn(
										'px-3 sm:px-4 py-2 text-sm sm:text-base transition-all uppercase',
										activeSection === 'team'
											? 'bg-foreground text-background'
											: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
									)}
									style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace', borderRadius: 0 }}
								>
									Team
								</Link>
							</div>

							{/* Right Action Button */}
							<div className='hidden md:flex w-[200px] justify-end'>
								{pathname === '/analyzer' ? (
									<div
										className='text-sm sm:text-base text-sendo-red bg-black/40 border border-sendo-red/50 px-3 sm:px-4 py-2 rounded-full font-medium flex items-center gap-2 cursor-default backdrop-blur-sm'
										style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										<span className='relative flex h-2 w-2'>
											<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sendo-red opacity-75'></span>
											<span className='relative inline-flex rounded-full h-2 w-2 bg-sendo-red'></span>
										</span>
										ANALYZING...
									</div>
								) : (
									<Link
										href='/analyzer'
										className='text-sm sm:text-base text-sendo-red px-3 sm:px-4 py-2 rounded-sm transition-all hover:bg-foreground/10 font-medium'
										style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										ANALYZE MY WALLET
									</Link>
								)}
							</div>

							{/* Bouton menu mobile */}
							<div className='md:hidden flex justify-end flex-1'>
								<button
									type='button'
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
									className='text-foreground hover:text-foreground/80 p-2 transition-colors z-10 relative'
									aria-label='Toggle mobile menu'
								>
									{mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
								</button>
							</div>
						</div>

						{/* Menu mobile amélioré avec animation */}
						<div
							className={cn(
								'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
								mobileMenuOpen ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0',
							)}
						>
							<div className='flex flex-col gap-3 pt-4 border-t border-border'>
								<Link
									href={getLinkHref('about')}
									onClick={() => setMobileMenuOpen(false)}
									className={cn(
										'text-sm transition-all uppercase px-4 py-2',
										activeSection === 'about'
											? 'bg-foreground text-background'
											: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
									)}
									style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace', borderRadius: 0 }}
								>
									About
								</Link>
								<Link
									href={getLinkHref('product')}
									onClick={() => setMobileMenuOpen(false)}
									className={cn(
										'text-sm transition-all uppercase px-4 py-2',
										activeSection === 'product'
											? 'bg-foreground text-background'
											: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
									)}
									style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace', borderRadius: 0 }}
								>
									Product
								</Link>
								<Link
									href='/leaderboard'
									onClick={() => setMobileMenuOpen(false)}
									className={cn(
										'text-sm transition-all uppercase px-4 py-2',
										pathname === '/leaderboard'
											? 'bg-foreground text-background'
											: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
									)}
									style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace', borderRadius: 0 }}
								>
									Leaderboard
								</Link>
								<Link
									href={getLinkHref('team')}
									onClick={() => setMobileMenuOpen(false)}
									className={cn(
										'text-sm transition-all uppercase px-4 py-2',
										activeSection === 'team'
											? 'bg-foreground text-background'
											: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
									)}
									style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace', borderRadius: 0 }}
								>
									Team
								</Link>
								{pathname === '/analyzer' ? (
									<div
										className='text-sm text-sendo-red bg-black/40 border border-sendo-red/50 font-medium py-2 px-4 flex items-center gap-2 rounded-full mx-4 w-fit backdrop-blur-sm'
										style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										<span className='relative flex h-2 w-2'>
											<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sendo-red opacity-75'></span>
											<span className='relative inline-flex rounded-full h-2 w-2 bg-sendo-red'></span>
										</span>
										ANALYZING...
									</div>
								) : (
									<Link
										href='/analyzer'
										onClick={() => setMobileMenuOpen(false)}
										className='text-sm text-sendo-red hover:text-sendo-red/80 transition-colors font-medium py-2 text-left px-4'
										style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										ANALYZE MY WALLET
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
