'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/loader';
import WalletBeamAnimation from '@/components/home/wallet-beam-animation';

// Animation discrète tout blanc
function MatrixText({ text, isAnimating }: { text: string; isAnimating: boolean }) {
	const [displayText, setDisplayText] = useState<string[]>(Array(text.length).fill(''));
	const [opacities, setOpacities] = useState<number[]>(Array(text.length).fill(0));
	const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

	useEffect(() => {
		// Clear all previous timeouts
		timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
		timeoutsRef.current = [];

		if (!isAnimating) {
			setDisplayText(text.split(''));
			setOpacities(Array(text.length).fill(1));
			return;
		}

		// Reset pour l'animation
		setDisplayText(Array(text.length).fill(''));
		setOpacities(Array(text.length).fill(0));

		// Animation discrète : chaque lettre apparaît progressivement avec un fade in doux
		text.split('').forEach((char, index) => {
			const delay = index * 60;
			const timeout = setTimeout(() => {
				setDisplayText((prev) => {
					const newText = [...prev];
					newText[index] = char;
					return newText;
				});
				// Fade in progressif
				setOpacities((prev) => {
					const newOpacities = [...prev];
					newOpacities[index] = 1;
					return newOpacities;
				});
			}, delay);
			timeoutsRef.current.push(timeout);
		});

		return () => {
			timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
			timeoutsRef.current = [];
		};
	}, [text, isAnimating]);

	return (
		<span className='inline-block'>
			{displayText.map((char, index) => (
				<span
					key={index}
					className='text-foreground transition-opacity duration-500'
					style={{
						fontFamily: 'var(--font-ibm-plex-sans), monospace',
						opacity: opacities[index] || 0,
					}}
				>
					{char || ' '}
				</span>
			))}
		</span>
	);
}

export default function HeroSectionV3() {
	const router = useRouter();
	const { ready, authenticated, login, user } = usePrivy();
	const { wallets } = useWallets();
	const [showLoader, setShowLoader] = useState(true);
	const [shouldAnimateContent, setShouldAnimateContent] = useState(false);
	const [currentText, setCurrentText] = useState<'TURN YOUR PAIN.' | 'INTO INTELLIGENCE.'>('TURN YOUR PAIN.');
	const [isAnimating, setIsAnimating] = useState(false);

	// Get wallet address
	const embeddedWallet = user?.wallet?.address;
	const connectedWallet = wallets.find((w) => w.address);
	const walletAddress = embeddedWallet || connectedWallet?.address;

	// Refs pour le parallaxe
	const sectionRef = useRef<HTMLElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const videoBaseOpacity = useMotionValue(1);
	const videoBaseOpacitySpring = useSpring(videoBaseOpacity, { stiffness: 50, damping: 20 });

	// Effet de parallaxe léger au scroll
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ['start start', 'end start'],
	});

	// Transformations pour le parallaxe (léger)
	const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
	const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
	const videoOpacityScroll = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.3]);
	
	// Opacité combinée : base (réduite après 5s) × scroll
	const videoOpacity = useTransform(
		[videoBaseOpacitySpring, videoOpacityScroll],
		([base, scroll]: number[]) => (base || 1) * (scroll || 1)
	);

	// Démarrer la vidéo immédiatement (1 seconde plus tôt)
	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.play().catch(() => {
				// Ignore les erreurs de lecture automatique
			});
		}
	}, []);

	// Loader animation - démarrer les animations du contenu quand le fade commence
	const handleLoaderFadeStart = () => {
		setShouldAnimateContent(true);
	};

	// Loader animation - masquer le loader après le fade out
	const handleLoaderComplete = () => {
		setShowLoader(false);
	};

	// Réduire l'opacité de la vidéo après 5 secondes pour améliorer la lisibilité
	useEffect(() => {
		const timer = setTimeout(() => {
			videoBaseOpacity.set(0.3);
		}, 5000);
		return () => clearTimeout(timer);
	}, [videoBaseOpacity]);

	// Animation cycle: TURN YOUR PAIN. -> INTO INTELLIGENCE. (loop toutes les 2 secondes)
	useEffect(() => {
		if (!shouldAnimateContent) return;

		let isMounted = true;
		let animationTimeout: NodeJS.Timeout;

		const cycleAnimation = () => {
			if (!isMounted) return;

			// TURN YOUR PAIN. apparaît
			setCurrentText('TURN YOUR PAIN.');
			setIsAnimating(true);
			
			animationTimeout = setTimeout(() => {
				if (!isMounted) return;
				setIsAnimating(false);
				
				// Après 2 secondes, passer à INTO INTELLIGENCE.
				animationTimeout = setTimeout(() => {
					if (!isMounted) return;
					setCurrentText('INTO INTELLIGENCE.');
					setIsAnimating(true);
					
					animationTimeout = setTimeout(() => {
						if (!isMounted) return;
						setIsAnimating(false);
						
						// Après 2 secondes, recommencer le cycle
						animationTimeout = setTimeout(() => {
							if (isMounted) {
								cycleAnimation();
							}
						}, 2000);
					}, 2000);
				}, 2000);
			}, 2000);
		};

		// Démarrer le cycle immédiatement
		cycleAnimation();

		return () => {
			isMounted = false;
			if (animationTimeout) {
				clearTimeout(animationTimeout);
			}
		};
	}, [shouldAnimateContent]);

	const handleScanWallet = () => {
		if (walletAddress) {
			router.push(`/analyzer?wallet=${walletAddress}`);
		}
	};

	return (
		<>
			{showLoader && <Loader onFadeStart={handleLoaderFadeStart} onComplete={handleLoaderComplete} />}
		<section ref={sectionRef} className='relative w-full min-h-screen flex items-center justify-center overflow-hidden'>
			{/* Video Background avec parallaxe */}
			<motion.div
				className='absolute inset-0 top-[100px]'
				style={{
					y: videoY,
					opacity: videoOpacity,
					willChange: 'opacity, transform',
					transform: 'translateZ(0)',
				}}
			>
				<video
					ref={videoRef}
					autoPlay
					muted
					playsInline
					className='w-full h-full object-cover'
					style={{ objectPosition: 'top center' }}
				>
					<source
						src='https://base44.app/api/apps/68f799bf9e73119274d933ee/files/public/68f799bf9e73119274d933ee/0f06aa31c_video_header.mp4'
						type='video/mp4'
					/>
				</video>
			</motion.div>

			{/* Content avec parallaxe léger */}
			<AnimatePresence>
				{shouldAnimateContent && (
				<motion.div
					key="hero-content"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
					style={{
						y: contentY,
						willChange: 'opacity, transform',
						transform: 'translateZ(0)',
					}}
					className='relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center py-32 md:py-40'
				>
				{/* Tagline */}
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
					style={{
						fontFamily: 'var(--font-ibm-plex-sans), monospace',
						letterSpacing: '0.50em',
						willChange: 'opacity, transform',
						transform: 'translateZ(0)',
					}}
					className='text-sm sm:text-base md:text-lg lg:text-xl uppercase sm:mb-8 text-foreground'
				>
					THE NEW ERA OF WALLET ANALYSIS
				</motion.h2>

				{/* Animated Text */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
					style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
					className='mb-8 sm:mb-12'
				>
					<h1
						className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl whitespace-nowrap font-bold text-foreground uppercase'
						style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
					>
						<MatrixText text={currentText} isAnimating={isAnimating} />
					</h1>
				</motion.div>

				{/* Button Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
					style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
					className='flex flex-col items-center gap-4 sm:gap-6'
				>
					{!authenticated ? (
						<button
							type='button'
							onClick={login}
							disabled={!ready}
							className='arc-raiders-pill-button text-base sm:text-lg md:text-xl'
							style={{
								fontFamily: 'var(--font-ibm-plex-sans), monospace',
							}}
						>
							<span>ANALYZE YOUR WALLET</span>
							<span className='arrow'>→</span>
						</button>
					) : (
						<div className='flex flex-col items-center gap-4 sm:gap-6'>
							{walletAddress && (
								<div className='text-sm sm:text-base text-foreground/70 mb-2'>
									<span
										className='font-mono'
										style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
									>
										{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
									</span>
								</div>
							)}
							<button
								type='button'
								onClick={handleScanWallet}
								className='arc-raiders-pill-button text-base sm:text-lg md:text-xl'
								style={{
									fontFamily: 'var(--font-ibm-plex-sans), monospace',
								}}
							>
								<span>ANALYZE MY WALLET</span>
								<span className='arrow'>→</span>
							</button>
						</div>
					)}
				</motion.div>
				</motion.div>
				)}
			</AnimatePresence>
			
			{/* Wallet Beam Animation en bas de la hero section */}
			<WalletBeamAnimation />
		</section>
		</>
	);
}

