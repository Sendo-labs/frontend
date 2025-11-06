'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BadgeCardProps {
	rank: string;
	punchline: string;
}

export default function BadgeCard({ rank, punchline }: BadgeCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.6, delay: 0.2 }}
			className='bg-foreground/5 border border-foreground/10 p-6 md:p-8 relative overflow-hidden group hover:border-sendo-orange/50 transition-all flex flex-col items-center justify-center text-center'
			style={{ borderRadius: 0 }}
		>
			{/* Glow effect */}
	<div className='absolute inset-0 bg-gradient-to-br from-sendo-dark-red/5 via-sendo-red/0 to-sendo-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

			<div className='relative z-10'>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
					className='text-8xl md:text-9xl mb-6'
				>
					💀
				</motion.div>

				<h3 className='text-2xl md:text-3xl font-bold mb-3 text-foreground title-font'>{rank}</h3>

				<div className='inline-block px-4 py-2 bg-sendo-red/10 border border-sendo-red/30' style={{ borderRadius: 0 }}>
					<p className='text-sendo-red text-sm font-semibold'>{punchline}</p>
				</div>

				<p className='text-foreground/40 text-sm mt-6 max-w-xs mx-auto'>
					You held through pain, hope, and more pain. Congrats, you're officially a legend 🏆
				</p>
			</div>
		</motion.div>
	);
}
