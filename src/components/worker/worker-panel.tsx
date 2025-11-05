'use client';

import { Activity, TrendingUp, Zap } from 'lucide-react';

export default function WorkerPanel() {
	return (
		<div>
			<div className='flex items-center gap-2 mb-4'>
				<Activity className='w-5 h-5 text-sendo-orange' />
				<h2 className='text-xl font-bold text-foreground uppercase title-font'>STATS</h2>
			</div>

			<div className='bg-foreground/5 border border-foreground/10 p-4 space-y-4' style={{ borderRadius: 0 }}>
				<div>
					<div className='flex items-center gap-2 mb-2'>
						<TrendingUp className='w-4 h-4 text-sendo-green' />
						<p className='text-xs text-foreground/60 uppercase'>Potential Gains</p>
					</div>
					<p className='text-2xl font-bold text-sendo-green title-font numeric-font'>$1050.00</p>
				</div>

				<div className='h-px bg-foreground/10' />

				<div>
					<div className='flex items-center gap-2 mb-2'>
						<Zap className='w-4 h-4 text-sendo-red' />
						<p className='text-xs text-foreground/60 uppercase'>High Priority</p>
					</div>
					<p className='text-2xl font-bold text-sendo-red title-font numeric-font'>3</p>
				</div>

				<div className='h-px bg-foreground/10' />

				<div>
					<p className='text-xs text-foreground/60 uppercase mb-2'>Active Rules</p>
					<p className='text-2xl font-bold text-foreground title-font numeric-font'>2/3</p>
				</div>

				<div className='mt-4 pt-4 border-t border-foreground/10'>
					<p className='text-xs text-foreground/40 text-center'>Worker last checked <span className='numeric-font'>2</span> minutes ago</p>
				</div>
			</div>
		</div>
	);
}
