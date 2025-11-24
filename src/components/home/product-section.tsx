'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';

// --- Reusable Widgets ---

function MetricsWidget({ className, style }: { className?: string; style?: React.CSSProperties }) {
	return (
		<div
			className={`w-[260px] h-[125px] rounded-[20px] p-4 overflow-visible flex items-center justify-between ${className || ''}`}
			style={{
				background: '#363636',
				contain: 'layout style paint',
				...style,
			}}
		>
			<div className='flex flex-col justify-between h-full'>
				<div>
					<div className='text-[12px] text-[#D0D0D0] tracking-[0.05em] whitespace-nowrap -mb-1'>Total Signatures</div>
					<div className='text-[20px] font-bold text-white tracking-[0.05em] whitespace-nowrap'>289</div>
				</div>
				<div>
					<div className='text-[12px] text-[#D0D0D0] tracking-[0.05em] whitespace-nowrap -mb-1'>Total Tokens</div>
					<div className='text-[20px] font-bold text-white tracking-[0.05em] whitespace-nowrap'>23</div>
				</div>
			</div>
			<div className='h-full flex items-end pb-2'>
				<MiniBarChart />
			</div>
		</div>
	);
}

function WorstPerformerWidget({ className, style }: { className?: string; style?: React.CSSProperties }) {
	return (
		<div
			className={`w-[260px] h-[125px] rounded-[20px] backdrop-blur-[20px] p-4 overflow-visible flex flex-col justify-between ${className || ''}`}
			style={{
				background:
					'radial-gradient(circle at 66.64% 54.43%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.24) 100%)',
				boxShadow: '0 4px 100px rgba(27, 41, 110, 0.1)',
				contain: 'layout style paint',
				...style,
			}}
		>
			<div className='text-[12px] text-[#D0D0D0] tracking-[0.05em] whitespace-nowrap overflow-hidden text-ellipsis relative z-10'>
				Worst Performer
			</div>
			<div className='flex items-center justify-between gap-1 relative z-10'>
				<div className='flex flex-col gap-1'>
					<div className='flex items-center gap-2'>
						<Image
							src='/product_section/starknet-token-strk-logo.png'
							alt='Starknet'
							width={24}
							height={24}
							className='w-6 h-6 flex-shrink-0'
							style={{ filter: 'drop-shadow(0 0 20px rgba(41, 41, 110, 0.3))' }}
						/>
						<div className='text-[24px] font-bold text-white tracking-[0.05em] whitespace-nowrap overflow-hidden text-ellipsis'>
							Starknet
						</div>
					</div>
					<div className='text-[20px] font-bold text-[#FF223B] tracking-[0.05em] whitespace-nowrap overflow-hidden text-ellipsis'>
						-$23,494.92
					</div>
				</div>
			</div>
			{/* Character image */}
			<div className='absolute bottom-0 right-0 w-[120px] h-[120px] pointer-events-none z-0'>
				<Image
					src='/product_section/left_character_zoom.png'
					alt='Character'
					width={120}
					height={120}
					className='w-full h-full object-cover object-top'
					style={{ transform: 'scale(1.2) translateY(10px)' }}
				/>
			</div>
		</div>
	);
}

function PoweredByWidget({ className }: { className?: string }) {
	return (
		<div className={`z-30 ${className || ''}`}>
			<p className='text-[13px] font-bold text-white mb-2 tracking-[0.05em] uppercase'>POWERED BY</p>
			<div className='relative w-[200px] sm:w-[240px] md:w-[304px] h-auto'>
				<Image
					src='/product_section/elizaos-logo.svg'
					alt='ElizaOS'
					width={304}
					height={47}
					className='sr-only'
					aria-hidden='true'
				/>
				<div
					className='relative w-full'
					style={{
						backgroundColor: '#0B35F1',
						maskImage: 'url(/product_section/elizaos-logo.svg)',
						maskSize: 'contain',
						maskRepeat: 'no-repeat',
						maskPosition: 'center',
						WebkitMaskImage: 'url(/product_section/elizaos-logo.svg)',
						WebkitMaskSize: 'contain',
						WebkitMaskRepeat: 'no-repeat',
						WebkitMaskPosition: 'center',
						paddingBottom: '15.31%',
						height: 0,
					}}
					aria-label='ElizaOS'
				/>
			</div>
		</div>
	);
}

// Terminal Animation Component
function TerminalAnimation() {
	const [lines, setLines] = useState<Array<{ id: number; text: string }>>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const animationFrameRef = useRef<number | null>(null);
	const isVisibleRef = useRef(true);
	const lineIndexRef = useRef(0);
	const lastUpdateRef = useRef(0);
	const nextIdRef = useRef(0);

	const terminalLines = [
		'[INFO] Initializing wallet analyzer...',
		'[DEBUG] Loading transaction history...',
		'[SUCCESS] Found 289 signatures',
		'[INFO] Processing token transfers...',
		'[SUCCESS] Analyzed 23 tokens',
		'[INFO] Calculating ATH metrics...',
		'[DEBUG] Reconstructing trading timeline...',
		'[SUCCESS] Analysis complete',
		'[INFO] Generating pain metrics...',
		'[DEBUG] Compiling statistics...',
		'[SUCCESS] Report generated',
		'[INFO] Ready for display',
	];

	// Fixed number of visible lines to prevent memory accumulation
	const MAX_VISIBLE_LINES = 15;

	// Check visibility and pause animation when not visible
	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					isVisibleRef.current = entry.isIntersecting;
				});
			},
			{ threshold: 0.1 },
		);

		observer.observe(containerRef.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	// Initialize with a few lines
	useEffect(() => {
		const initialLines: Array<{ id: number; text: string }> = [];
		for (let i = 0; i < 5; i++) {
			initialLines.push({
				id: nextIdRef.current++,
				text: terminalLines[i % terminalLines.length],
			});
			lineIndexRef.current = i + 1;
		}
		setLines(initialLines);
	}, []);

	// Main animation loop - handles both line updates and scrolling
	useEffect(() => {
		if (!containerRef.current) return;

		let timeoutId: NodeJS.Timeout | null = null;

		const addLine = () => {
			if (!isVisibleRef.current) {
				timeoutId = setTimeout(addLine, 100);
				return;
			}

			const currentTime = performance.now();
			const cycleTime = (currentTime / 10000) % (2 * Math.PI);
			const speed = 150 + Math.sin(cycleTime) * 50; // Varies between 100ms and 200ms

			setLines((prev) => {
				const newLine = {
					id: nextIdRef.current++,
					text: terminalLines[lineIndexRef.current % terminalLines.length],
				};
				lineIndexRef.current += 1;

				// Keep only last MAX_VISIBLE_LINES lines
				const updated = [...prev, newLine];
				return updated.slice(-MAX_VISIBLE_LINES);
			});

			// Schedule next line addition
			timeoutId = setTimeout(addLine, speed);
		};

		// Smooth scroll animation - keeps scroll at bottom
		const scroll = () => {
			if (!containerRef.current || !isVisibleRef.current) {
				animationFrameRef.current = requestAnimationFrame(scroll);
				return;
			}

			const container = containerRef.current;
			if (container.scrollHeight > container.clientHeight) {
				const maxScroll = container.scrollHeight - container.clientHeight;
				const currentScroll = container.scrollTop;
				// Always try to stay near bottom (within 50px)
				if (maxScroll - currentScroll > 50) {
					const distance = maxScroll - currentScroll;
					container.scrollTop = currentScroll + distance * 0.2; // Smooth easing
				} else {
					// Snap to bottom if close
					container.scrollTop = maxScroll;
				}
			}

			animationFrameRef.current = requestAnimationFrame(scroll);
		};

		// Start both animations
		lastUpdateRef.current = performance.now();
		timeoutId = setTimeout(addLine, 200);
		animationFrameRef.current = requestAnimationFrame(scroll);

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className='w-full h-full bg-black/70 text-gray-400 p-4 font-mono text-sm overflow-hidden'
			style={{
				fontFamily: 'var(--font-ibm-plex-sans), monospace',
				overflowAnchor: 'none',
			}}
		>
			{lines.map((line) => (
				<div key={line.id} className='mb-1'>
					<span className='text-gray-400'>$</span> {line.text}
				</div>
			))}
			<div className='flex items-center'>
				<span className='text-gray-400'>$</span>
				<span className='ml-2 w-2 h-4 bg-gray-400 terminal-cursor' />
			</div>
		</div>
	);
}

// Mini Bar Chart Component
function MiniBarChart() {
	const bars = [
		{ height: 74, delay: 0 },
		{ height: 36, delay: 0.1 },
		{ height: 57, delay: 0.2 },
	];

	const totalBarHeight = 100; // Total height including gray segment

	return (
		<div className='flex items-end gap-[8px]'>
			{bars.map((bar, index) => {
				const coloredHeight = bar.height;
				const grayHeight = totalBarHeight - coloredHeight;

				return (
					<div key={index} className='w-[18.55px] relative' style={{ height: `${totalBarHeight}px` }}>
						{/* Dark gray segment on top */}
						{grayHeight > 0 && (
							<div
								className='absolute top-0 left-0 right-0 rounded-[20px]'
								style={{
									height: `${grayHeight}px`,
									background: '#363636',
								}}
							/>
						)}
						{/* Gradient colored section */}
						<motion.div
							className='absolute bottom-0 left-0 right-0 rounded-[20px]'
							style={{
								height: `${coloredHeight}px`,
								background: 'linear-gradient(180deg, #FF5C1A 0%, #FF223B 50.48%, #4A0C13 100%)',
							}}
							initial={{ height: 0 }}
							animate={{ height: `${coloredHeight}px` }}
							transition={{ duration: 0.8, delay: bar.delay, ease: 'easeOut' }}
						/>
					</div>
				);
			})}
		</div>
	);
}

// Floating Icon Component
function FloatingIcon({
	src,
	alt,
	delay,
	position,
	size,
	imageSize,
}: {
	src: string;
	alt: string;
	delay: number;
	position: { top?: string; bottom?: string; left?: string; right?: string };
	size: number;
	imageSize?: number;
}) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [randomPath, setRandomPath] = useState<{ x: number[]; y: number[] }>({ x: [0], y: [0] });
	const iconRef = useRef<HTMLDivElement>(null);

	// Track mouse movement
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (iconRef.current) {
				const rect = iconRef.current.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				// Calculate distance from mouse to icon center
				const deltaX = (e.clientX - centerX) / window.innerWidth;
				const deltaY = (e.clientY - centerY) / window.innerHeight;

				// Very subtle movement (multiply by small factor)
				setMousePosition({
					x: deltaX * 8,
					y: deltaY * 8,
				});
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	// Generate random path for floating animation
	useEffect(() => {
		// Generate 8 random points for a smooth path
		// Range +/- 6px for subtle movement
		const generatePoints = () => Array.from({ length: 8 }, () => (Math.random() - 0.5) * 12);

		setRandomPath({
			x: generatePoints(),
			y: generatePoints(),
		});
	}, []);

	return (
		<motion.div
			ref={iconRef}
			className='absolute z-20'
			style={{
				...position,
				width: `${size}px`,
				height: `${size}px`,
			}}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{
				opacity: 1,
				scale: 1,
				x: randomPath.x,
				y: randomPath.y,
			}}
			transition={{
				opacity: { duration: 0.5, delay },
				scale: { duration: 0.5, delay },
				x: {
					duration: 15,
					repeat: Infinity,
					repeatType: 'mirror',
					ease: 'easeInOut',
				},
				y: {
					duration: 15,
					repeat: Infinity,
					repeatType: 'mirror',
					ease: 'easeInOut',
				},
			}}
		>
			<motion.div
				animate={{
					x: mousePosition.x,
					y: mousePosition.y,
				}}
				transition={{
					duration: 0.5,
					ease: 'easeOut',
				}}
				className='w-full h-full'
			>
				<div
					className='w-full h-full rounded-[20px] backdrop-blur-[20px] p-2 overflow-visible flex items-center justify-center'
					style={{
						background:
							'radial-gradient(circle at 66.64% 54.43%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.24) 100%)',
						contain: 'layout style paint',
					}}
				>
					<Image
						src={src}
						alt={alt}
						width={imageSize || size - 16}
						height={imageSize || size - 16}
						className='object-contain'
						style={{
							width: `${imageSize || size - 16}px`,
							height: `${imageSize || size - 16}px`,
							maxWidth: 'none',
							maxHeight: 'none',
						}}
					/>
				</div>
			</motion.div>
		</motion.div>
	);
}

// Pain Card Skeleton Component
function PainCardSkeleton() {
	return (
		<div
			className='relative w-[510px] h-[273.646px] rounded-[20px] border border-white/16 backdrop-blur-[20px] overflow-hidden'
			style={{
				background:
					'radial-gradient(circle at 66.64% 54.43%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.24) 100%)',
				contain: 'layout style paint',
			}}
		>
			<div className='absolute overflow-hidden' style={{ top: '35px', left: '18px', right: '25px', bottom: '18px' }}>
				{/* 334px bar (extended from 262) */}
				<div className='absolute h-[23px] w-[334px] bg-[#D9D9D9] rounded-[20px]' style={{ top: '0px', left: '0px' }} />
				{/* 212px bar (extended from 140) */}
				<div className='absolute h-[23px] w-[212px] bg-[#D9D9D9] rounded-[20px]' style={{ top: '38px', left: '0px' }} />
				{/* 261px bar with gradient (extended from 189) */}
				<div
					className='absolute h-[23px] w-[261px] rounded-[20px] overflow-hidden'
					style={{ top: '76px', left: '0px' }}
				>
					<div className='absolute inset-0 bg-[#D9D9D9] opacity-28' />
					<div
						className='absolute inset-0'
						style={{
							background: 'linear-gradient(90deg, #FF5C1A 0%, #FF223B 50.48%, #4A0C13 100%)',
						}}
					/>
				</div>
				{/* 294px bar (extended from 222) */}
				<div
					className='absolute h-[23px] w-[294px] bg-[#D9D9D9] rounded-[20px]'
					style={{ top: '114px', left: '0px' }}
				/>
				{/* Three 70px bars - kept same size but maybe gap increased? Kept simple for now */}
				<div className='absolute' style={{ top: '180px', left: '0px' }}>
					<div className='flex gap-[15px]'>
						<div className='h-[23px] w-[70px] bg-[#ADADAD] rounded-[20px]' />
						<div className='h-[23px] w-[70px] bg-[#ADADAD] rounded-[20px]' />
						<div className='h-[23px] w-[70px] bg-[#ADADAD] rounded-[20px]' />
					</div>
				</div>
			</div>
		</div>
	);
}

function PainCardVisuals() {
	return (
		<div className='relative'>
			<div className='absolute' style={{ top: '90px', left: '30px' }}>
				<PainCardSkeleton />
			</div>

			<FloatingIcon
				src='/product_section/Pump-Fun-Logo.png'
				alt='Pump Fun'
				delay={0}
				position={{ top: '30px', left: '210px' }}
				size={75}
				imageSize={100}
			/>
			<FloatingIcon
				src='/product_section/Group 1171275556.png'
				alt='ElizaOS'
				delay={1}
				position={{ top: '50px', left: '500px' }}
				size={90}
			/>
			<FloatingIcon
				src='/product_section/starknet-token-strk-logo.png'
				alt='Starknet'
				delay={2}
				position={{ top: '310px', left: '490px' }}
				size={75}
			/>
			<motion.div
				className='absolute z-10'
				style={{ top: '130px', left: '488px', width: '40.625px', height: '21.875px' }}
				animate={{
					opacity: [0.8, 1, 0.8],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			>
				<svg width='41' height='22' viewBox='0 0 41 22' fill='none'>
					<path d='M0 11 L41 11' stroke='url(#gradient-line)' strokeWidth='5' strokeLinecap='round' />
					<defs>
						<linearGradient id='gradient-line' x1='0%' y1='0%' x2='100%' y2='0%'>
							<stop offset='0%' stopColor='#4A0C13' />
							<stop offset='49.5%' stopColor='#FF223B' />
							<stop offset='100%' stopColor='#FF5C1A' />
						</linearGradient>
					</defs>
				</svg>
			</motion.div>
		</div>
	);
}

export default function ProductSection() {
	const router = useRouter();
	const { ready, authenticated, login, user } = usePrivy();
	const { wallets } = useWallets();

	const embeddedWallet = user?.wallet?.address;
	const connectedWallet = wallets.find((w) => w.address);
	const walletAddress = embeddedWallet || connectedWallet?.address;

	const handleScanWallet = () => {
		if (walletAddress) {
			router.push(`/analyzer?wallet=${walletAddress}`);
		} else {
			login();
		}
	};

	const cardStyle = {
		willChange: 'opacity, transform',
		transform: 'translateZ(0)',
		contain: 'layout style paint',
		background: 'rgba(20, 20, 20, 0.6)',
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
		fontFamily: 'var(--font-ibm-plex-sans), monospace',
	};

	return (
		<section
			id='product'
			className='relative w-full pt-12 pb-20 sm:pt-16 sm:pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-40 px-4 sm:px-6 overflow-hidden'
			style={{
				backgroundColor: 'rgb(0, 0, 0)',
				fontFamily: 'var(--font-ibm-plex-sans), monospace',
			}}
		>
			<div className='relative z-10 w-full max-w-7xl mx-auto'>
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
					className='text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-medium mb-8 sm:mb-12 md:mb-16 text-white leading-tight sm:leading-[57.6px]'
					style={{
						fontFamily: 'var(--font-ibm-plex-sans), monospace',
						textAlign: 'left',
						marginTop: 0,
						marginLeft: 0,
						marginRight: 0,
						padding: '0',
						width: '100%',
						willChange: 'opacity, transform',
					}}
				>
					<span className='font-bold text-4xl sm:text-5xl md:text-[56px]'>Analyze smarter.</span>
					<br />
					<span className='block sm:inline text-3xl sm:text-4xl md:text-[48px] font-medium'>
						See your trading history in one place.
					</span>
				</motion.h2>

				{/* Cards Container */}
				<div className='relative w-full min-h-[855px] lg:min-h-[664px]'>
					{/* Mobile/Tablet: Stack cards */}
					<div className='lg:hidden space-y-6 sm:space-y-8'>
						{/* Card 1: Wallet Analyzer - Mobile */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className='relative w-full min-h-[320px] rounded-[20px] border border-white/20 backdrop-blur-[20px] overflow-hidden p-6'
							style={cardStyle}
						>
							<div className='flex flex-col gap-4 items-start'>
								<div className='flex flex-col sm:flex-row items-start gap-6 sm:gap-8 w-full'>
									<MetricsWidget className='w-full sm:flex-1' />
									<WorstPerformerWidget className='w-full sm:flex-1' />
								</div>
								<div className='w-full text-left mt-4'>
									<h3 className='text-[28px] font-semibold mb-2 text-white leading-[1.2]'>The Wallet Analyzer</h3>
									<p className='text-[16px] text-[#D0D0D0] leading-[1.5]'>
										Smart reconstruction of your entire trading history.
										<br />
										Every buy, sell and ATH is rebuilt automatically.
									</p>
								</div>
							</div>
						</motion.div>

						{/* Card 2: Missing ATH Engine - Mobile */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-50px' }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='relative w-full min-h-[320px] rounded-[20px] border border-white/20 backdrop-blur-[20px] overflow-hidden'
							style={cardStyle}
						>
							<div className='absolute inset-0 overflow-hidden'>
								<div className='absolute inset-0 z-0'>
									<TerminalAnimation />
									<div className='absolute inset-0 bg-[#141414]/40 pointer-events-none' />
								</div>
								<div
									className='absolute inset-0 z-10 pointer-events-none'
									style={{
										background: `linear-gradient(180deg, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 0) 40%, rgba(20, 20, 20, 0.4) 60%, rgba(20, 20, 20, 0.8) 80%, rgba(20, 20, 20, 0.9) 100%)`,
										backdropFilter: 'blur(1px)',
									}}
								/>
								<div className='absolute top-0 right-0 w-[200px] sm:w-[226px] h-full z-20 pointer-events-none'>
									<Image
										src='/product_section/hero-eliza-mobile.png'
										alt='ElizaOS Character'
										width={226}
										height={271}
										className='w-full h-full object-cover object-right-bottom rounded-[20px]'
										style={{ transform: 'scaleX(-1)' }}
									/>
								</div>
								<PoweredByWidget className='absolute top-[40px] left-[30px]' />
							</div>
							<div className='absolute top-[180px] left-[30px] right-[30px] z-30'>
								<h3 className='text-[28px] font-semibold mb-2 text-white leading-[1.2]'>Missing ATH Engine</h3>
								<p className='text-[16px] text-[#D0D0D0] leading-[1.5] whitespace-normal'>
									Real-time calculation of your lost potential,
									<br />
									per token and globally.
								</p>
							</div>
						</motion.div>

						{/* Card 3: Pain Card - Mobile */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className='relative w-full min-h-[380px] rounded-[20px] border border-white/20 backdrop-blur-[20px] overflow-hidden p-6'
							style={cardStyle}
						>
							<div className='relative mb-4 w-full -top-5 -left-5.5'>
								{/* Scale down visuals for mobile to fit width */}
								<div className='origin-top-left left-0 transform scale-[0.72] sm:scale-[0.75]'>
									<div className='relative w-[573px] h-[300px]'>
										<PainCardVisuals />
									</div>
								</div>
							</div>
							<div className='mb-6'>
								<h3 className='text-[28px] font-semibold mb-2 text-white leading-[1.2]'>
									Your own Pain Card <span className='text-[#FF223B]'>(Soon mintable)</span>
								</h3>
								<p className='text-[16px] text-[#D0D0D0] leading-[1.5]'>
									A clean, personalized and shareable card summarizing your missed gains.
								</p>
							</div>
							<button
								type='button'
								onClick={handleScanWallet}
								disabled={!ready}
								className='arc-raiders-pill-button text-base sm:text-lg md:text-xl self-start'
								style={{
									fontFamily: 'var(--font-ibm-plex-sans), monospace',
								}}
							>
								<span>{authenticated && walletAddress ? 'ANALYZE MY WALLET' : 'ANALYZE YOUR WALLET'}</span>
								<span className='arrow'>→</span>
							</button>
						</motion.div>
					</div>

					{/* Desktop: Absolute positioning */}
					<div className='hidden lg:block relative w-full h-[664px]'>
						{/* Card 1: Wallet Analyzer */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className='absolute w-[calc(50%-12px)] h-[320px] rounded-[20px] border border-white/20 backdrop-blur-[20px] overflow-hidden'
							style={{
								top: '0px',
								left: '0px',
								...cardStyle,
							}}
						>
							<div className='absolute top-[30px] left-[30px] right-[30px] flex gap-6'>
								<MetricsWidget className='flex-1' />
								<WorstPerformerWidget className='flex-1' />
							</div>

							<div className='absolute bottom-[30px] left-[30px]'>
								<h3 className='text-[28px] font-semibold mb-2 text-white leading-[1.2]'>The Wallet Analyzer</h3>
								<p className='text-[16px] text-[#D0D0D0] leading-[1.5] max-w-[400px]'>
									Smart reconstruction of your entire trading history.
									<br />
									Every buy, sell and ATH is rebuilt automatically.
								</p>
							</div>
						</motion.div>

						{/* Card 2: Missing ATH Engine */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-50px' }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='absolute w-[calc(50%-12px)] h-[320px] rounded-[20px] border border-white/20 backdrop-blur-[20px] overflow-hidden'
							style={{
								top: '344px',
								left: '0px',
								...cardStyle,
							}}
						>
							<div className='absolute inset-0 overflow-hidden'>
								<div className='absolute inset-0 z-0'>
									<TerminalAnimation />
									<div className='absolute inset-0 bg-[#141414]/40 pointer-events-none' />
								</div>
								<div
									className='absolute inset-0 z-10 pointer-events-none'
									style={{
										background: `linear-gradient(180deg, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 0) 40%, rgba(20, 20, 20, 0.4) 60%, rgba(20, 20, 20, 0.8) 80%, rgba(20, 20, 20, 0.9) 100%)`,
										backdropFilter: 'blur(1px)',
									}}
								/>
							</div>

							<div className='absolute top-0 right-0 w-[226px] h-full z-20 pointer-events-none'>
								<Image
									src='/product_section/hero-eliza-mobile.png'
									alt='ElizaOS Character'
									width={226}
									height={271}
									className='w-full h-full object-cover rounded-[20px]'
									style={{ transform: 'scaleX(-1)' }}
								/>
							</div>

							<PoweredByWidget className='absolute top-[40px] left-[30px]' />

							<div className='absolute top-[180px] left-[30px] right-[30px] z-30'>
								<h3 className='text-[28px] font-semibold mb-2 text-white leading-[1.2]'>Missing ATH Engine</h3>
								<p className='text-[16px] text-[#D0D0D0] leading-[1.5] whitespace-normal'>
									Real-time calculation of your lost potential,
									<br />
									per token and globally.
								</p>
							</div>
						</motion.div>

						{/* Card 3: Pain Card */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className='absolute w-[calc(50%-10px)] h-[664px] rounded-[20px] border border-white/20 backdrop-blur-[20px] overflow-hidden'
							style={{
								top: '0px',
								right: '0px',
								...cardStyle,
							}}
						>
							<PainCardVisuals />

							<div className='absolute' style={{ top: '450px', left: '30px' }}>
								<h3 className='text-[28px] font-semibold mb-2 text-white leading-[1.2]'>
									Your own Pain Card <span className='text-[#FF223B]'>(Soon mintable)</span>
								</h3>
								<p className='text-[16px] text-[#D0D0D0] leading-[1.5] max-w-[450px]'>
									A clean, personalized and shareable card summarizing your missed gains.
								</p>
							</div>

							<button
								type='button'
								onClick={handleScanWallet}
								disabled={!ready}
								className='arc-raiders-pill-button text-base sm:text-lg md:text-xl absolute'
								style={{
									top: '570px',
									left: '30px',
									fontFamily: 'var(--font-ibm-plex-sans), monospace',
								}}
							>
								<span>{authenticated && walletAddress ? 'ANALYZE MY WALLET' : 'ANALYZE YOUR WALLET'}</span>
								<span className='arrow'>→</span>
							</button>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
