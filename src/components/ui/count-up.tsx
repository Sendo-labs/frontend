'use client';

import React from 'react';

interface CountUpProps {
	end: number;
	duration?: number;
	decimals?: number;
	separator?: boolean;
	prefix?: string;
	suffix?: string;
	className?: string;
	// Continuous mode settings
	enableContinuous?: boolean; // Enable smart continuous counting
	pollInterval?: number; // Time between data updates (ms) - default 5000
	isProcessing?: boolean; // Whether analysis is still running
	aggressiveness?: number; // How optimistic the prediction is (0.5 = conservative, 1.5 = aggressive) - default 1.0
}

interface BatchHistoryEntry {
	value: number;
	timestamp: number;
}

export function CountUp({
	end,
	duration = 2,
	decimals = 0,
	separator = false,
	prefix = '',
	suffix = '',
	className = '',
	enableContinuous = false,
	pollInterval = 5000,
	isProcessing = false,
	aggressiveness = 1.0,
}: CountUpProps) {
	const [count, setCount] = React.useState(end);

	const prevEndRef = React.useRef(end);
	const animationFrameRef = React.useRef<number | null>(null);
	const continuousAnimationRef = React.useRef<number | null>(null);

	// Estimate next value - just add tiny fixed growth for rolling effect
	const estimateNextValue = React.useCallback(
		(currentValue: number): number => {
			// Simple: just add a tiny percentage for smooth rolling (0.01%)
			return currentValue + (currentValue * 0.0001);
		},
		[],
	);

	// Continuous animation toward estimated target (can go forward or backward!)
	const animateContinuous = React.useCallback((start: number, target: number, timeRemaining: number) => {
		// Cancel any existing continuous animation
		if (continuousAnimationRef.current) {
			cancelAnimationFrame(continuousAnimationRef.current);
		}

		const startTime = Date.now();
		const totalDistance = target - start;

		// Calculate the magnitude of the number to determine digit speeds
		const magnitude = Math.max(Math.abs(start), Math.abs(target));
		const baseSpeed = magnitude / 10; // Base increment per frame

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / timeRemaining, 1);

			if (progress < 1) {
				// Still animating toward target - use gentle ease-out curve
				const easeProgress = 1 - Math.pow(1 - progress, 2);
				const current = start + totalDistance * easeProgress;
				setCount(current);
				continuousAnimationRef.current = requestAnimationFrame(animate);
			} else {
				// Reached target - continue with subtle rolling digit effect
				if (isProcessing && enableContinuous) {
					// Slow rolling increment proportional to magnitude
					// Larger numbers roll faster, but always smooth
					const increment = baseSpeed / 60 / 100; // Very slow continuous rolling
					setCount((prev) => prev + increment);
					continuousAnimationRef.current = requestAnimationFrame(animate);
				}
			}
		};

		continuousAnimationRef.current = requestAnimationFrame(animate);
	}, [isProcessing, enableContinuous]);

	// Quick update animation (when new value arrives)
	const animateQuickUpdate = React.useCallback(
		(start: number, target: number, animDuration: number) => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (continuousAnimationRef.current) {
				cancelAnimationFrame(continuousAnimationRef.current);
			}

			const startTime = Date.now();

			const animate = () => {
				const elapsed = Date.now() - startTime;
				const progress = Math.min(elapsed / animDuration, 1);

				// Linear interpolation for quick updates
				const current = start + (target - start) * progress;
				setCount(current);

				if (progress < 1) {
					animationFrameRef.current = requestAnimationFrame(animate);
				} else {
					setCount(target);

					// After quick update, start continuous if still processing
					if (isProcessing && enableContinuous) {
						const estimated = estimateNextValue(target);

						// Use almost the full poll interval (95%) to minimize gaps between updates
						const animationDuration = pollInterval * 0.95;

						animateContinuous(target, estimated, animationDuration);
					}
				}
			};

			animationFrameRef.current = requestAnimationFrame(animate);
		},
		[isProcessing, enableContinuous, estimateNextValue, pollInterval, animateContinuous],
	);

	// Main effect: handle new value updates
	React.useEffect(() => {
		const now = Date.now();
		const prevValue = prevEndRef.current;
		prevEndRef.current = end;

		// If continuous mode is disabled, use simple animation
		if (!enableContinuous) {
			// Original simple animation behavior
			if (prevValue === end) return;

			let startTime: number | undefined;
			let animationFrame: number;

			const animate = (timestamp: number) => {
				if (!startTime) startTime = timestamp;
				const progress = (timestamp - startTime) / (duration * 1000);

				if (progress < 1) {
					// Interpolate from previous value to new value
					const current = prevValue + (end - prevValue) * progress;
					setCount(current);
					animationFrame = requestAnimationFrame(animate);
				} else {
					setCount(end);
				}
			};

			animationFrame = requestAnimationFrame(animate);
			return () => cancelAnimationFrame(animationFrame);
		}

		// Continuous mode logic
		// If value hasn't changed, don't restart animation - let it continue
		if (prevValue === end) {
			return;
		}

		// Value changed - do quick update animation (can be forward OR backward!)
		animateQuickUpdate(count, end, duration * 1000);
	}, [end, duration, enableContinuous, estimateNextValue, animateContinuous, animateQuickUpdate, pollInterval, count]);

	// Stop all animations when processing completes
	React.useEffect(() => {
		if (!isProcessing && enableContinuous) {
			// Analysis complete - cancel continuous animation and lock to exact value
			if (continuousAnimationRef.current) {
				cancelAnimationFrame(continuousAnimationRef.current);
				continuousAnimationRef.current = null;
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}

			// Smoothly animate to final exact value
			const currentCount = count;
			if (Math.abs(currentCount - end) > 0.01) {
				animateQuickUpdate(currentCount, end, 1000); // 1s final adjustment
			} else {
				setCount(end);
			}
		}
	}, [isProcessing, enableContinuous, count, end, animateQuickUpdate]);

	// Cleanup on unmount
	React.useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (continuousAnimationRef.current) {
				cancelAnimationFrame(continuousAnimationRef.current);
			}
		};
	}, []);

	const formatNumber = (num: number) => {
		// Use en-US locale for consistent formatting
		return num.toLocaleString('en-US', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			useGrouping: separator,
		});
	};

	return (
		<span className={className}>
			{prefix}
			{formatNumber(count)}
			{suffix}
		</span>
	);
}