'use client';

import { useEffect, useRef, useState } from 'react';

export default function Loader({
	text,
	blur = false,
	onFadeStart,
	onComplete,
}: {
	text?: string;
	blur?: boolean;
	onFadeStart?: () => void;
	onComplete?: () => void;
}) {
	const [progress, setProgress] = useState(0);
	const [isFadingOut, setIsFadingOut] = useState(false);
	const animationDuration = 1500; // 1.5 secondes
	const fadeOutDuration = 500; // 0.5 secondes pour le fade out
	const hasStartedRef = useRef(false);
	const callbacksRef = useRef({ onFadeStart, onComplete });

	// Mettre à jour les callbacks sans relancer l'effet
	useEffect(() => {
		callbacksRef.current = { onFadeStart, onComplete };
	}, [onFadeStart, onComplete]);

	useEffect(() => {
		const startTime = Date.now();
		let hasReached100 = false;

		const interval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const newProgress = Math.min(100, Math.round((elapsed / animationDuration) * 100));
			setProgress(newProgress);

			if (newProgress >= 100 && !hasReached100) {
				hasReached100 = true;
				clearInterval(interval);

				// Démarrer le fade out après un court délai (200ms)
				setTimeout(() => {
					setIsFadingOut(true);
					// Masquer le loader après le fade out complet
					setTimeout(() => {
						callbacksRef.current.onComplete?.();
					}, fadeOutDuration);
				}, 200);

				// Démarrer les animations exactement 1 seconde après avoir atteint 100%
				setTimeout(() => {
					callbacksRef.current.onFadeStart?.();
				}, 1000);
			}
		}, 16); // ~60fps

		return () => clearInterval(interval);
	}, []); // Pas de dépendances - ne se lance qu'une fois au montage

	return (
		<div
			className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-500 ${
				isFadingOut ? 'opacity-0' : 'opacity-100'
			} ${blur ? 'backdrop-blur-sm bg-background/50' : 'bg-background'}`}
		>
			<div className='text-center'>
				<div className='relative mx-auto w-64 h-24 sm:w-80 sm:h-32 md:w-[400px] md:h-40'>
					{/* Base skeleton gris (logo de fond) */}
					<div
						className='absolute inset-0 bg-white/20'
						style={{
							maskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							maskSize: 'contain',
							maskRepeat: 'no-repeat',
							maskPosition: 'center',
							WebkitMaskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							WebkitMaskSize: 'contain',
							WebkitMaskRepeat: 'no-repeat',
							WebkitMaskPosition: 'center',
						}}
					/>
					{/* Effet de remplissage blanc progressif */}
					<div
						className='absolute inset-0 bg-white/70'
						style={{
							clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
							transition: 'clip-path 0.05s linear',
							maskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							maskSize: 'contain',
							maskRepeat: 'no-repeat',
							maskPosition: 'center',
							WebkitMaskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							WebkitMaskSize: 'contain',
							WebkitMaskRepeat: 'no-repeat',
							WebkitMaskPosition: 'center',
						}}
					/>
				</div>
				{/* Pourcentage */}
				<div
					className='mt-6 text-foreground/60 text-sm sm:text-base md:text-lg'
					style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
				>
					{progress}%
				</div>
			</div>
		</div>
	);
}

export function FullScreenLoader({ text, blur = false }: { text?: string; blur?: boolean }) {
	return (
		<div
			className={`fixed top-0 left-0 h-[100vh] w-full flex items-center justify-center z-50 ${blur ? 'backdrop-blur-sm bg-background/30' : 'bg-background'}`}
		>
			<div className='text-center'>
				<div className='relative mx-auto w-40 h-16'>
					{/* Background logo (grisé) */}
					<div className='absolute inset-0 opacity-20'>
						<img
							src='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png'
							alt='SENDO'
							className='w-full h-full object-contain'
						/>
					</div>

					{/* Logo avec masque et gradient animé */}
					<div
						className='absolute inset-0'
						style={{
							maskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							maskSize: 'contain',
							maskRepeat: 'no-repeat',
							maskPosition: 'center',
							WebkitMaskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							WebkitMaskSize: 'contain',
							WebkitMaskRepeat: 'no-repeat',
							WebkitMaskPosition: 'center',
						}}
					>
						<div
							className='absolute inset-0 animate-fill-left-right bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red'
							style={{
								filter: 'drop-shadow(0 0 15px rgba(255, 90, 31, 0.6))',
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
