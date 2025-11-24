'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	size: number;
	color: string;
}

export default function CustomCursor() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isEnabled, setIsEnabled] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const mouseRef = useRef({ x: -100, y: -100 });
	const cursorRef = useRef({ x: -100, y: -100 });
	const particlesRef = useRef<Particle[]>([]);
	const requestRef = useRef<number>();
	const isHoveringRef = useRef(false);

	useEffect(() => {
		// Check if device supports fine pointer (mouse)
		const isTouch = window.matchMedia('(pointer: coarse)').matches;
		if (isTouch) return;

		setIsEnabled(true);
		// Note: We keep the default OS cursor visible as requested
		
		// Add hover listeners for interactive elements
		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.getAttribute('role') === 'button') {
				isHoveringRef.current = true;
			}
		};

		const handleMouseOut = () => {
			isHoveringRef.current = false;
		};

		const handleMouseMove = (e: MouseEvent) => {
			mouseRef.current = { x: e.clientX, y: e.clientY };
			if (!isActive) setIsActive(true);
		};

		const updateCanvasSize = () => {
			if (canvasRef.current) {
				canvasRef.current.width = window.innerWidth;
				canvasRef.current.height = window.innerHeight;
			}
		};

		document.addEventListener('mouseover', handleMouseOver);
		document.addEventListener('mouseout', handleMouseOut);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', updateCanvasSize);

		setTimeout(updateCanvasSize, 0);

		const animate = () => {
			const canvas = canvasRef.current;
			if (!canvas) {
				requestRef.current = requestAnimationFrame(animate);
				return;
			}

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// Smooth cursor movement for the effect (trails behind the real cursor slightly)
			const dx = mouseRef.current.x - cursorRef.current.x;
			const dy = mouseRef.current.y - cursorRef.current.y;
			
			cursorRef.current.x += dx * 0.2; // Slightly faster to follow closely
			cursorRef.current.y += dy * 0.2;

			// Clear canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Generate particles on movement
			if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
				const particleCount = isHoveringRef.current ? 3 : 1;
				for (let i = 0; i < particleCount; i++) {
					if (Math.random() > 0.4) {
						particlesRef.current.push({
							x: cursorRef.current.x,
							y: cursorRef.current.y,
							vx: (Math.random() - 0.5) * 0.5,
							vy: (Math.random() - 0.5) * 0.5,
							life: 1,
							maxLife: Math.random() * 20 + 10,
							size: Math.random() * 1.5 + 0.5,
							color: Math.random() > 0.5 ? 'rgba(255, 50, 40, 0.8)' : 'rgba(255, 34, 59, 0.4)'
						});
					}
				}
			}

			// Update and draw particles
			particlesRef.current.forEach((particle, index) => {
				particle.x += particle.vx;
				particle.y += particle.vy;
				particle.life -= 0.02;

				if (particle.life <= 0) {
					particlesRef.current.splice(index, 1);
					return;
				}

				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fillStyle = particle.color.replace('0.8', `${particle.life * 0.8}`).replace('0.4', `${particle.life * 0.4}`);
				ctx.fill();
			});

			// Draw Scanner Glow (Highlighting the cursor)
			// We draw a glow around the cursor tip to "outline" it nicely
			const radius = isHoveringRef.current ? 12 : 8;
			
			// Outer Glow
			const gradient = ctx.createRadialGradient(
				cursorRef.current.x, cursorRef.current.y, 0,
				cursorRef.current.x, cursorRef.current.y, radius * 2.5
			);
			gradient.addColorStop(0, 'rgba(255, 50, 40, 0.3)');
			gradient.addColorStop(0.5, 'rgba(255, 34, 59, 0.1)');
			gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(cursorRef.current.x, cursorRef.current.y, radius * 2.5, 0, Math.PI * 2);
			ctx.fill();

			// Inner "Scanner" Ring
			ctx.strokeStyle = 'rgba(255, 50, 40, 0.4)';
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.arc(cursorRef.current.x, cursorRef.current.y, radius, 0, Math.PI * 2);
			ctx.stroke();

			// Center dot (Scanner eye)
			ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
			ctx.beginPath();
			ctx.arc(cursorRef.current.x, cursorRef.current.y, 1.5, 0, Math.PI * 2);
			ctx.fill();

			requestRef.current = requestAnimationFrame(animate);
		};

		requestRef.current = requestAnimationFrame(animate);

		return () => {
			document.removeEventListener('mouseover', handleMouseOver);
			document.removeEventListener('mouseout', handleMouseOut);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('resize', updateCanvasSize);
			if (requestRef.current) cancelAnimationFrame(requestRef.current);
		};
	}, [isActive]);

	if (!isEnabled) return null;

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none z-[9999]"
			style={{ mixBlendMode: 'screen' }}
		/>
	);
}
