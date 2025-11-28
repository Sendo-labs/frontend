'use client';

import { motion } from 'framer-motion';

export default function ScannerSeparator() {
	// Dupliquer le contenu pour le défilement infini
	const SingleItem = () => (
		<>
			<span>WALLET ADDRESS 0x3597...C8A1</span>
			<span>MISSED ATH $229k</span>
			<span>BALANCE 70.16 SOL</span>
			<span>// SENDO WALLET SCANNER • ANALYZING ON-CHAIN DATA</span>
			<span>/* SCAN EFFECT • BURNING WALLET DATA */</span>
			<span>const SCAN_WIDTH = 8; const BURN_INTENSITY = 0.85;</span>
		</>
	);

	// Group of items that is guaranteed to be wider than the screen
	const MarqueeGroup = () => (
		<div className='flex items-center shrink-0'>
			{[1, 2, 3, 4].map((i) => (
				<div key={i} className='flex gap-16 items-center pr-16'>
					<SingleItem />
				</div>
			))}
		</div>
	);

	return (
		<div className='w-full relative h-32 overflow-hidden flex items-center justify-center bg-transparent z-50 -my-16 pointer-events-none'>
			{/* Scrolling Text */}
			<div className='absolute inset-0 flex items-center overflow-hidden'>
				<motion.div
					className='flex text-2xl sm:text-4xl font-bold font-mono text-sendo-red/30 whitespace-nowrap'
					style={{
						fontFamily: 'var(--font-ibm-plex-sans), monospace',
						textShadow: '0 0 5px rgba(255, 34, 59, 0.3)',
					}}
					animate={{ x: '-50%' }}
					transition={{
						duration: 100,
						repeat: Infinity,
						ease: 'linear',
					}}
				>
					<MarqueeGroup />
					<MarqueeGroup />
				</motion.div>
			</div>

			{/* Horizontal Beam Line - Placed AFTER text to be on top */}
			<motion.div
				className='absolute w-full h-[3px] z-10'
				style={{
					background:
						'linear-gradient(90deg, transparent 0%, rgba(255, 50, 40, 0.5) 20%, rgba(255, 34, 59, 1) 50%, rgba(255, 50, 40, 0.5) 80%, transparent 100%)',
					boxShadow: '0 0 20px rgba(255, 34, 59, 1), 0 0 10px rgba(255, 255, 255, 0.5)',
				}}
				animate={{
					opacity: [0.8, 1, 0.8],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>

			{/* Vertical Scan Line */}
			{/* 
			<motion.div 
				className='absolute top-0 bottom-0 w-[2px] bg-sendo-red/30'
				animate={{ left: ['0%', '100%'] }}
				transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
			/>
			*/}
		</div>
	);
}
