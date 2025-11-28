'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CTAActivateWorker() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
			style={{ borderRadius: 0, willChange: 'opacity, transform', transform: 'translateZ(0)' }}
			className='bg-gradient-to-br from-sendo-orange/10 via-sendo-red/10 to-sendo-dark-red/10 border border-sendo-orange/30 p-4 md:p-6 relative overflow-hidden group hover:border-sendo-orange/50 transition-all'
		>
			<div className='absolute top-0 right-0 w-32 h-32 bg-sendo-orange/5 blur-3xl' />

			<div className='relative z-10'>
				<div className='flex items-center gap-2 mb-4'>
					<div
						className='w-10 h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center'
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
					>
						<Zap className='w-6 h-6 text-white' />
					</div>
					<h3 className='text-foreground uppercase text-sm font-bold title-font'>TIRED OF MISSING ATHS?</h3>
				</div>

				<p className='text-foreground/70 text-sm mb-4'>
					Activate the Worker to get real-time suggestions and automate your exit strategy. Never miss a top again 🎯
				</p>

				<ul className='space-y-2 mb-6'>
					<li className='flex items-center gap-2 text-foreground/60 text-sm'>
						<div className='w-1.5 h-1.5 bg-sendo-orange' style={{ borderRadius: 0 }} />
						Auto take-profit alerts
					</li>
					<li className='flex items-center gap-2 text-foreground/60 text-sm'>
						<div className='w-1.5 h-1.5 bg-sendo-orange' style={{ borderRadius: 0 }} />
						Dust token cleanup
					</li>
					<li className='flex items-center gap-2 text-foreground/60 text-sm'>
						<div className='w-1.5 h-1.5 bg-sendo-orange' style={{ borderRadius: 0 }} />
						Portfolio rebalancing
					</li>
				</ul>

				<Link href='/worker'>
					<Button
						className='w-full bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-10 md:h-12 group title-font'
						style={{
							clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
							borderRadius: 0,
						}}
					>
						ACTIVATE WORKER
						<ArrowRight className='w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform' />
					</Button>
				</Link>
			</div>
		</motion.div>
	);
}
