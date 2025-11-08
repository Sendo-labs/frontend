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
}

export function CountUp({
	end,
	duration = 2,
	decimals = 0,
	separator = false,
	prefix = '',
	suffix = '',
	className = '',
}: CountUpProps) {
	const [count, setCount] = React.useState(end);
	const prevEndRef = React.useRef(end);

	React.useEffect(() => {
		const start = prevEndRef.current;
		prevEndRef.current = end;

		// If no change, don't animate
		if (start === end) return;

		let startTime: number | undefined;
		let animationFrame: number;

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = (timestamp - startTime) / (duration * 1000);

			if (progress < 1) {
				// Interpolate from previous value to new value
				const current = start + (end - start) * progress;
				setCount(current);
				animationFrame = requestAnimationFrame(animate);
			} else {
				setCount(end);
			}
		};

		animationFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrame);
	}, [end, duration]);

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