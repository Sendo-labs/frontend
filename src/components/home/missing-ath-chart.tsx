'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

export type ChartCase = 'sold-before-peak' | 'sold-during-drop' | 'no-sale';

interface MissingAthChartProps {
	caseType: ChartCase;
	className?: string;
	animationDelay?: number;
	animationType?: 'slide' | 'fade' | 'scale';
	isMobile?: boolean;
}

interface Candle {
	x: number;
	open: number;
	close: number;
	high: number;
	low: number;
	isBullish: boolean; // true = hausse (blanc), false = baisse (rouge)
}

interface ChartData {
	candles: Candle[];
	athX: number;
	athY: number;
	sellX?: number;
	sellY?: number;
	fillPath: string;
	points: Array<{ x: number; y: number; label: string; key: string }>;
	values: {
		buyPrice: number;
		athPrice: number;
		sellPrice?: number;
		currentPrice?: number;
		missingATH: number;
	};
}

// Generate candlestick chart data for each case
function getChartData(caseType: ChartCase, size: number = 400): ChartData {
	const padding = 50;
	const w = size - padding * 2;
	const h = size - padding * 2;
	const candleCount = 8;
	const candleWidth = w / candleCount;
	const _candleSpacing = candleWidth * 0.3;

	// Helper to convert price to Y coordinate
	const priceToY = (price: number, minPrice: number, maxPrice: number) => {
		return padding + h - ((price - minPrice) / (maxPrice - minPrice)) * h;
	};

	switch (caseType) {
		case 'sold-before-peak': {
			// Prices: starts low, rises to sell, continues to ATH, then drops
			const prices = [1.0, 1.5, 2.2, 3.0, 3.5, 4.2, 5.0, 4.5]; // ATH at index 6
			const minPrice = 0.5;
			const maxPrice = 5.5;
			const quantity = 10; // Assume 10 tokens

			const candles: Candle[] = prices.map((close, i) => {
				const open = i === 0 ? close : prices[i - 1];
				const high = Math.max(open, close) + (i === 6 ? 0.3 : 0.1); // ATH candle has higher wick
				const low = Math.min(open, close) - 0.1;
				return {
					x: padding + i * candleWidth + candleWidth / 2,
					open: priceToY(open, minPrice, maxPrice),
					close: priceToY(close, minPrice, maxPrice),
					high: priceToY(high, minPrice, maxPrice),
					low: priceToY(low, minPrice, maxPrice),
					isBullish: close > open,
				};
			});

			const buyPrice = prices[0];
			const sellPrice = prices[3];
			const athPrice = prices[6] + 0.3;
			const buyX = candles[0].x;
			const buyY = candles[0].close;
			const sellX = candles[3].x;
			const sellY = candles[3].close;
			const athX = candles[6].x;
			const athY = candles[6].high;

			// Calculate missing ATH: (ATH - Sell) * quantity
			const missingATH = (athPrice - sellPrice) * quantity;

			// Fill path from sell to ATH
			const fillPath = `M ${sellX} ${sellY} 
				L ${candles[4].x} ${candles[4].close}
				L ${candles[5].x} ${candles[5].close}
				L ${athX} ${athY}
				L ${athX} ${size - padding}
				L ${sellX} ${size - padding}
				Z`;

			return {
				candles,
				athX,
				athY,
				sellX,
				sellY,
				fillPath,
				points: [
					{ x: buyX, y: buyY, label: 'Buy', key: 'buy' },
					{ x: sellX, y: sellY, label: 'Sell', key: 'sell' },
					{ x: athX, y: athY, label: 'ATH', key: 'ath' },
				],
				values: {
					buyPrice,
					athPrice,
					sellPrice,
					missingATH,
				},
			};
		}

		case 'sold-during-drop': {
			// Prices: starts low, rises to ATH, then drops to sell
			const prices = [1.0, 1.8, 3.0, 4.5, 5.0, 3.5, 2.0, 1.5]; // ATH at index 4, sell at index 6
			const minPrice = 0.5;
			const maxPrice = 5.5;
			const quantity = 10;

			const candles: Candle[] = prices.map((close, i) => {
				const open = i === 0 ? close : prices[i - 1];
				const high = Math.max(open, close) + (i === 4 ? 0.3 : 0.1);
				const low = Math.min(open, close) - 0.1;
				return {
					x: padding + i * candleWidth + candleWidth / 2,
					open: priceToY(open, minPrice, maxPrice),
					close: priceToY(close, minPrice, maxPrice),
					high: priceToY(high, minPrice, maxPrice),
					low: priceToY(low, minPrice, maxPrice),
					isBullish: close > open,
				};
			});

			const buyPrice = prices[0];
			const athPrice = prices[4] + 0.3;
			const sellPrice = prices[6];
			const buyX = candles[0].x;
			const buyY = candles[0].close;
			const athX = candles[4].x;
			const athY = candles[4].high;
			const sellX = candles[6].x;
			const sellY = candles[6].close;

			// Calculate missing ATH: (ATH - Sell) * quantity
			const missingATH = (athPrice - sellPrice) * quantity;

			// Fill path from ATH to sell
			const fillPath = `M ${athX} ${athY}
				L ${candles[5].x} ${candles[5].close}
				L ${sellX} ${sellY}
				L ${sellX} ${size - padding}
				L ${athX} ${size - padding}
				Z`;

			return {
				candles,
				athX,
				athY,
				sellX,
				sellY,
				fillPath,
				points: [
					{ x: buyX, y: buyY, label: 'Buy', key: 'buy' },
					{ x: athX, y: athY, label: 'ATH', key: 'ath' },
					{ x: sellX, y: sellY, label: 'Sell', key: 'sell' },
				],
				values: {
					buyPrice,
					athPrice,
					sellPrice,
					missingATH,
				},
			};
		}

		case 'no-sale': {
			// Prices: starts low, rises to ATH, then drops (no sale)
			const prices = [1.0, 2.0, 3.5, 4.5, 5.0, 3.0, 1.5, 0.8]; // ATH at index 4
			const minPrice = 0;
			const maxPrice = 5.5;
			const quantity = 10;

			const candles: Candle[] = prices.map((close, i) => {
				const open = i === 0 ? close : prices[i - 1];
				const high = Math.max(open, close) + (i === 4 ? 0.3 : 0.1);
				const low = Math.min(open, close) - 0.1;
				return {
					x: padding + i * candleWidth + candleWidth / 2,
					open: priceToY(open, minPrice, maxPrice),
					close: priceToY(close, minPrice, maxPrice),
					high: priceToY(high, minPrice, maxPrice),
					low: priceToY(low, minPrice, maxPrice),
					isBullish: close > open,
				};
			});

			const buyPrice = prices[0];
			const athPrice = prices[4] + 0.3;
			const currentPrice = prices[7];
			const buyX = candles[0].x;
			const buyY = candles[0].close;
			const athX = candles[4].x;
			const athY = candles[4].high;
			const currentX = candles[7].x;
			const currentY = candles[7].close;

			// Calculate missing ATH: (ATH - Current) * quantity
			const missingATH = (athPrice - currentPrice) * quantity;

			// Fill path from ATH to current
			const fillPath = `M ${athX} ${athY}
				L ${candles[5].x} ${candles[5].close}
				L ${candles[6].x} ${candles[6].close}
				L ${currentX} ${currentY}
				L ${currentX} ${size - padding}
				L ${athX} ${size - padding}
				Z`;

			return {
				candles,
				athX,
				athY,
				fillPath,
				points: [
					{ x: buyX, y: buyY, label: 'Buy', key: 'buy' },
					{ x: athX, y: athY, label: 'ATH', key: 'ath' },
					{ x: currentX, y: currentY, label: 'Now', key: 'current' },
				],
				values: {
					buyPrice,
					athPrice,
					currentPrice,
					missingATH,
				},
			};
		}
	}
}

export default function MissingAthChart({
	caseType,
	className = '',
	animationDelay = 0,
	animationType = 'fade',
	isMobile = false,
}: MissingAthChartProps) {
	const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
	const [_isHovered, setIsHovered] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const particlesRef = useRef<HTMLCanvasElement>(null);
	const size = 400;
	const chartData = getChartData(caseType, size);

	// Motion values for tech effects
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const springConfig = { damping: 25, stiffness: 200 };
	const x = useSpring(
		useTransform(mouseX, (v) => v * 0.02),
		springConfig,
	);
	const y = useSpring(
		useTransform(mouseY, (v) => v * 0.02),
		springConfig,
	);
	const rotateX = useTransform(y, [-10, 10], [2, -2]);
	const rotateY = useTransform(x, [-10, 10], [-2, 2]);

	// Particles effect (inspired by wallet-beam)
	useEffect(() => {
		if (!particlesRef.current) return;

		const canvas = particlesRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = size;
		canvas.height = size;

		const particles: Array<{
			x: number;
			y: number;
			vx: number;
			vy: number;
			life: number;
			maxLife: number;
		}> = [];

		// Create particles near candles
		const createParticle = (x: number, y: number) => {
			particles.push({
				x,
				y,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				life: 0,
				maxLife: 60 + Math.random() * 40,
			});
		};

		// Initialize particles
		chartData.candles.forEach((candle) => {
			if (!candle.isBullish) {
				// Red particles for bearish candles
				for (let i = 0; i < 3; i++) {
					createParticle(candle.x + (Math.random() - 0.5) * 20, candle.close + (Math.random() - 0.5) * 20);
				}
			}
		});

		let animationId: number;
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Update and draw particles
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.x += p.vx;
				p.y += p.vy;
				p.life++;

				if (p.life > p.maxLife) {
					particles.splice(i, 1);
					continue;
				}

				const alpha = 1 - p.life / p.maxLife;
				ctx.fillStyle = `rgba(255, 50, 40, ${alpha * 0.4})`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
				ctx.fill();
			}

			// Add new particles occasionally
			if (Math.random() < 0.1 && particles.length < 30) {
				const candle = chartData.candles[Math.floor(Math.random() * chartData.candles.length)];
				if (!candle.isBullish) {
					createParticle(candle.x, candle.close);
				}
			}

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			if (animationId) cancelAnimationFrame(animationId);
		};
	}, [chartData.candles]);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		mouseX.set(e.clientX - rect.left - rect.width / 2);
		mouseY.set(e.clientY - rect.top - rect.height / 2);
	};

	// Different animation variants
	const getInitialAnimation = () => {
		switch (animationType) {
			case 'slide':
				return { opacity: 0, x: -50, y: 0 };
			case 'scale':
				return { opacity: 0, scale: 0.8, y: 0 };
			default:
				return { opacity: 0, y: 30 };
		}
	};

	const getAnimateAnimation = () => {
		switch (animationType) {
			case 'slide':
				return { opacity: 1, x: 0, y: 0 };
			case 'scale':
				return { opacity: 1, scale: 1, y: 0 };
			default:
				return { opacity: 1, y: 0 };
		}
	};

	// Sendo red colors
	const sendoRed = '#FF223B';
	const sendoRedLight = 'rgba(255, 50, 40, 0.6)';
	const sendoRedDark = 'rgba(255, 34, 59, 0.3)';
	const sendoWhite = '#FFFFFF';

	return (
		<motion.div
			ref={containerRef}
			className={`relative aspect-square w-full ${className}`}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				setIsHovered(false);
				mouseX.set(0);
				mouseY.set(0);
			}}
			initial={getInitialAnimation()}
			whileInView={getAnimateAnimation()}
			viewport={{ once: true, margin: '0px', amount: isMobile ? 0.1 : 0.8 }}
			onAnimationStart={() => setIsVisible(true)}
			transition={{
				duration: 0.5,
				delay: animationDelay,
				ease: [0.25, 0.1, 0.25, 1],
			}}
			style={{
				perspective: '1000px',
				willChange: 'opacity, transform',
				transform: 'translateZ(0)',
			}}
		>
			{/* Particles canvas */}
			<canvas ref={particlesRef} className='absolute inset-0 w-full h-full pointer-events-none' style={{ zIndex: 5 }} />

			{/* Background with Sendo gradient - like scanner cards */}
			<div
				className='absolute inset-0 w-full h-full'
				style={{
					background: `linear-gradient(135deg, 
						rgba(10, 10, 10, 1) 0%, 
						rgba(18, 18, 18, 1) 25%,
						rgba(25, 25, 25, 1) 50%,
						rgba(18, 18, 18, 1) 75%,
						rgba(10, 10, 10, 1) 100%
					)`,
					borderRadius: '20px',
					border: '2px solid rgba(255, 50, 40, 0.5)',
				}}
			>
				{/* Red overlay gradient - like scanner cards */}
				<div
					className='absolute inset-0'
					style={{
						background: `linear-gradient(180deg, 
							rgba(255, 50, 40, 0.25) 0%, 
							rgba(255, 40, 50, 0.1) 20%,
							transparent 40%,
							transparent 60%,
							rgba(255, 34, 59, 0.1) 80%,
							rgba(255, 34, 59, 0.25) 100%
						),
						radial-gradient(ellipse at center, 
							rgba(255, 50, 40, 0.15) 0%, 
							transparent 70%
						)`,
						borderRadius: '20px',
						pointerEvents: 'none',
					}}
				/>
				{/* Shine effect */}
				<div
					className='absolute inset-0'
					style={{
						background: `linear-gradient(45deg, 
							transparent 30%, 
							rgba(255, 255, 255, 0.1) 50%, 
							transparent 70%
						)`,
						borderRadius: '20px',
						pointerEvents: 'none',
					}}
				/>
			</div>

			{/* Main chart container */}
			<motion.div
				style={{
					x,
					y,
					rotateX,
					rotateY,
				}}
				className='relative w-full h-full'
			>
				<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className='w-full h-full'>
					<defs>
						{/* Gradients for candles */}
						<linearGradient id={`fillGradient-${caseType}`} x1='0%' y1='0%' x2='0%' y2='100%'>
							<stop offset='0%' stopColor={sendoRedLight} />
							<stop offset='100%' stopColor={sendoRedDark} />
						</linearGradient>
						<filter id={`glow-${caseType}`}>
							<feGaussianBlur stdDeviation='3' result='coloredBlur' />
							<feMerge>
								<feMergeNode in='coloredBlur' />
								<feMergeNode in='SourceGraphic' />
							</feMerge>
						</filter>
					</defs>

					{/* Candlesticks - appear one by one in real-time */}
					{chartData.candles.map((candle, index) => {
						const bodyTop = Math.min(candle.open, candle.close);
						const bodyBottom = Math.max(candle.open, candle.close);
						const bodyHeight = bodyBottom - bodyTop;
						const candleBodyWidth = 20;
						// Each candle appears 0.15s after the previous one, starting after the card animation
						const candleDelay = animationDelay + 0.2 + index * (isMobile ? 0.05 : 0.15);

						return (
							<g key={index}>
								{/* Wick */}
								<motion.line
									x1={candle.x}
									y1={candle.high}
									x2={candle.x}
									y2={candle.low}
									stroke={candle.isBullish ? sendoWhite : sendoRed}
									strokeWidth='2'
									initial={{ pathLength: 0, opacity: 0 }}
									animate={isVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
									transition={{
										duration: 0.3,
										delay: candleDelay,
										ease: [0.25, 0.1, 0.25, 1],
									}}
									style={{ willChange: 'opacity, pathLength' }}
								/>

								{/* Candle body */}
								<motion.rect
									x={candle.x - candleBodyWidth / 2}
									y={bodyTop}
									width={candleBodyWidth}
									height={Math.max(bodyHeight, 2)}
									fill={candle.isBullish ? sendoWhite : sendoRed}
									stroke={candle.isBullish ? sendoWhite : sendoRed}
									strokeWidth='1'
									filter={`url(#glow-${caseType})`}
									initial={{ scaleY: 0, opacity: 0 }}
									animate={isVisible ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
									transition={{
										duration: 0.4,
										delay: candleDelay + 0.08,
										ease: [0.25, 0.1, 0.25, 1],
									}}
									style={{
										transformOrigin: `${candle.x}px ${bodyBottom}px`,
										willChange: 'opacity, transform',
										transform: 'translateZ(0)',
									}}
								/>
							</g>
						);
					})}

					{/* Points - appear after all candles */}
					{chartData.points.map((point, index) => {
						const getPointStyle = (key: string) => {
							switch (key) {
								case 'buy':
									return { fill: sendoWhite, stroke: sendoRed, glow: 'rgba(255, 255, 255, 0.2)' };
								case 'sell':
									return { fill: sendoRed, stroke: sendoWhite, glow: sendoRedDark };
								case 'ath':
									return { fill: sendoRed, stroke: sendoWhite, glow: sendoRedDark };
								case 'current':
									return { fill: sendoWhite, stroke: sendoRed, glow: 'rgba(255, 255, 255, 0.2)' };
								default:
									return { fill: sendoRed, stroke: sendoWhite, glow: sendoRedDark };
							}
						};
						const pointStyle = getPointStyle(point.key);
						// All points are circles now - appear after all candles of this chart
						const pointsDelay = animationDelay + chartData.candles.length * (isMobile ? 0.05 : 0.15) + 0.3;

						// Get value label
						const getValueLabel = (key: string) => {
							switch (key) {
								case 'buy':
									return `@ $${chartData.values.buyPrice.toFixed(2)}`;
								case 'sell':
									return chartData.values.sellPrice ? `@ $${chartData.values.sellPrice.toFixed(2)}` : '';
								case 'ath':
									return `@ $${chartData.values.athPrice.toFixed(2)}`;
								case 'current':
									return chartData.values.currentPrice ? `@ $${chartData.values.currentPrice.toFixed(2)}` : '';
								default:
									return '';
							}
						};

						return (
							<g key={point.key}>
								{/* Outer glow ring */}
								<motion.circle
									cx={point.x}
									cy={point.y}
									r='10'
									fill='none'
									stroke={pointStyle.glow}
									strokeWidth='1'
									initial={{ scale: 0, opacity: 0 }}
									animate={{
										scale: hoveredPoint === point.key ? 1.5 : 1,
										opacity: hoveredPoint === point.key ? 0.4 : 0,
									}}
									transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
									style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
								/>
								{/* Main point circle - all points are circles now */}
								<motion.circle
									cx={point.x}
									cy={point.y}
									r='5'
									fill={pointStyle.fill}
									stroke={pointStyle.stroke}
									strokeWidth='1.5'
									initial={{ scale: 0, opacity: 0 }}
									animate={
										isVisible
											? {
													scale: hoveredPoint === point.key ? 1.3 : 1,
													opacity: 1,
												}
											: { scale: 0, opacity: 0 }
									}
									transition={{
										scale: { duration: 0.2, type: 'spring', stiffness: 300, damping: 20 },
										opacity: { duration: 0.3, delay: pointsDelay + index * 0.1, ease: [0.25, 0.1, 0.25, 1] },
									}}
									onMouseEnter={() => setHoveredPoint(point.key)}
									onMouseLeave={() => setHoveredPoint(null)}
									style={{ cursor: 'pointer', willChange: 'opacity, transform', transform: 'translateZ(0)' }}
								/>
								{/* Inner highlight */}
								<motion.circle
									cx={point.x}
									cy={point.y}
									r='2'
									fill='rgba(255, 255, 255, 0.8)'
									initial={{ opacity: 0 }}
									animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
									transition={{ delay: pointsDelay + 0.1 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
									style={{ willChange: 'opacity' }}
								/>
								{/* Label with value - with background for visibility */}
								<g>
									{/* Background rectangle for text */}
									<motion.rect
										x={point.x - 45}
										y={point.key === 'current' ? point.y + 15 : point.y - 35}
										width='90'
										height='18'
										rx='0'
										fill='rgba(10, 10, 10, 0.85)'
										stroke={sendoRed}
										strokeWidth='0.5'
										initial={{ opacity: 0 }}
										animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
										transition={{ duration: 0.3, delay: pointsDelay + 0.2 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
										style={{ willChange: 'opacity' }}
									/>
									<motion.text
										x={point.x}
										y={point.key === 'current' ? point.y + 27 : point.y - 23}
										textAnchor='middle'
										fill={sendoWhite}
										fontSize='12'
										fontWeight='600'
										fontFamily='monospace'
										letterSpacing='0.5px'
										initial={{ opacity: 0 }}
										animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
										transition={{ duration: 0.4, delay: pointsDelay + 0.25 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
										style={{ willChange: 'opacity' }}
									>
										{point.label} {getValueLabel(point.key)}
									</motion.text>
								</g>
							</g>
						);
					})}

					{/* Missing ATH label - appears at the end, outside chart area */}
					<g>
						{/* Background for Missing ATH label */}
						<motion.rect
							x={size / 2 - 140}
							y={size - 50}
							width='280'
							height='38'
							rx='0'
							fill='rgba(10, 10, 10, 0.9)'
							stroke={sendoRed}
							strokeWidth='1'
							initial={{ opacity: 0 }}
							animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
							transition={{
								duration: 0.3,
								delay: animationDelay + chartData.candles.length * (isMobile ? 0.05 : 0.15) + 0.7,
								ease: [0.25, 0.1, 0.25, 1],
							}}
							style={{ willChange: 'opacity' }}
						/>
						{/* Explanation text */}
						<motion.text
							x={size / 2}
							y={size - 35}
							textAnchor='middle'
							fill={sendoWhite}
							fontSize='10'
							fontWeight='500'
							fontFamily='monospace'
							letterSpacing='0.5px'
							opacity='0.7'
							initial={{ opacity: 0 }}
							animate={isVisible ? { opacity: 0.7 } : { opacity: 0 }}
							transition={{
								duration: 0.4,
								delay: animationDelay + chartData.candles.length * (isMobile ? 0.05 : 0.15) + 0.8,
								ease: [0.25, 0.1, 0.25, 1],
							}}
							style={{ willChange: 'opacity' }}
						>
							If you bought 10 tokens
						</motion.text>
						{/* Missing ATH value */}
						<motion.text
							x={size / 2}
							y={size - 20}
							textAnchor='middle'
							fill={sendoRed}
							fontSize='13'
							fontWeight='700'
							fontFamily='monospace'
							letterSpacing='1px'
							initial={{ opacity: 0 }}
							animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
							transition={{
								duration: 0.5,
								delay: animationDelay + chartData.candles.length * (isMobile ? 0.05 : 0.15) + 0.9,
								ease: [0.25, 0.1, 0.25, 1],
							}}
							style={{ willChange: 'opacity' }}
						>
							Missing ATH ${chartData.values.missingATH.toFixed(0)}
						</motion.text>
					</g>
				</svg>
			</motion.div>
		</motion.div>
	);
}
