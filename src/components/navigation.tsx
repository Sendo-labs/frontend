'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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
	const pathname = usePathname();

	const isActive = (path: string) => pathname === path;

	return (
		<div className='fixed top-0 left-0 right-0 z-[100] pt-5'>
			<div className='max-w-[1400px] mx-auto px-4 sm:px-6'>
				<div
					className='w-full bg-background/80 border border-border backdrop-blur-sm'
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
								className='md:hidden text-muted-foreground hover:text-foreground p-2'
								aria-label='Toggle mobile menu'
							>
								{mobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
							</button>
						</div>

						{mobileMenuOpen && (
							<nav className='md:hidden mt-4 pt-4 border-t border-border'>
								<div className='flex flex-col gap-2'>
									{navLinks.map((link) => (
										<Link
											key={link.path}
											href={link.path}
											onClick={() => setMobileMenuOpen(false)}
											className={cn(
												'px-4 py-2 text-sm font-medium transition-all uppercase',
												isActive(link.path)
													? 'bg-foreground text-background'
													: 'text-foreground/70 hover:text-foreground hover:bg-foreground/10',
											)}
											style={{ borderRadius: 0 }}
										>
											{link.name}
										</Link>
									))}
								</div>
								<LoginButton />
							</nav>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
