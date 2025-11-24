'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LoginButton } from './auth/login';

interface NavLink {
	name: string;
	path: string;
}

const navLinks: NavLink[] = [
	{ name: 'ANALYZER', path: '/analyzer' },
	{ name: 'WORKER', path: '/worker' },
	{ name: 'MARKETPLACE', path: '/marketplace' },
	{ name: 'LEADERBOARD', path: '/leaderboard' },
	{ name: 'CONTRIBUTE', path: '/onboarding' },
];

export default function Navigation() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	const isActive = (path: string) => pathname === path;

	// Animation d'apparition après 3 secondes
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	// Détection du scroll pour l'effet blur
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Fermer le menu mobile lors du changement de route
	useEffect(() => {
		setMobileMenuOpen(false);
	}, []);

	// Hide navigation on homepage (it has its own navbar)
	if (pathname === '/') {
		return null;
	}

	return (
		<div
			className={cn(
				'fixed top-0 left-0 right-0 z-[100] pt-5 transition-all duration-500 ease-out',
				isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
			)}
		>
			<div className='max-w-[1400px] mx-auto px-4 sm:px-6'>
				<div
					className={cn(
						'w-full border border-border transition-all duration-300',
						isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-background/80 backdrop-blur-sm',
					)}
					style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
				>
					<div className='px-4 sm:px-6 py-3 sm:py-4'>
						<div className='flex items-center justify-between'>
							<Link href='/' className='flex-shrink-0'>
								<img
									src='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png'
									alt='sEnDO'
									className='h-5 sm:h-6'
								/>
							</Link>

							<nav className='hidden md:flex items-center gap-2 lg:gap-4'>
								{navLinks.map((link) => (
									<Link
										key={link.path}
										href={link.path}
										className={cn(
											'px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all uppercase',
											isActive(link.path)
												? 'bg-foreground text-background'
												: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
										)}
										style={{ borderRadius: 0 }}
									>
										{link.name}
									</Link>
								))}
								<LoginButton />
							</nav>

							<button
								type='button'
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className='md:hidden text-muted-foreground hover:text-foreground p-2 transition-colors z-10 relative'
								aria-label='Toggle mobile menu'
							>
								{mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
							</button>
						</div>

						{/* Menu mobile amélioré avec animation */}
						<div
							className={cn(
								'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
								mobileMenuOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0',
							)}
						>
							<nav className='pt-4 border-t border-border'>
								<div className='flex flex-col gap-2 pb-4'>
									{navLinks.map((link) => (
										<Link
											key={link.path}
											href={link.path}
											onClick={() => setMobileMenuOpen(false)}
											className={cn(
												'px-4 py-3 text-sm font-medium transition-all uppercase rounded-sm',
												isActive(link.path)
													? 'bg-foreground text-background'
													: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10 active:bg-foreground/20',
											)}
										>
											{link.name}
										</Link>
									))}
									<div className='pt-3 border-t border-border mt-2'>
										<div className='flex justify-center'>
											<LoginButton />
										</div>
									</div>
								</div>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
