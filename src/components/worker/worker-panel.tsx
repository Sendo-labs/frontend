'use client';

import { Activity, TrendingUp, Zap } from 'lucide-react';

interface Proposal {
	type: string;
	tokens?: string[];
	token?: string;
	size_pct?: number;
	est_usd: number;
	reason: string;
	priority: 'low' | 'medium' | 'high';
}

interface WorkerPanelProps {
	proposals: Proposal[] | null;
}

export default function WorkerPanel({ proposals }: WorkerPanelProps) {
	const totalValue = proposals?.reduce((sum, p) => sum + p.est_usd, 0) || 0;
	const highPriorityCount = proposals?.filter((p) => p.priority === 'high').length || 0;

	return (
		<div>
			<div className='flex items-center gap-2 mb-4'>
				<Activity className='w-5 h-5 text-sendo-orange' />
				<h2 className='text-xl font-bold text-foreground uppercase title-font'>STATS</h2>
			</div>

			<div className='bg-foreground/5 border border-foreground/10 p-4 space-y-4' style={{ borderRadius: 0 }}>
				<div>
					<div className='flex items-center gap-2 mb-2'>
						<TrendingUp className='w-4 h-4 text---sendo-green' />
						<p className='text-xs text-foreground/60 uppercase'>Potential Gains</p>
					</div>
					<p className='text-2xl font-bold text---sendo-green title-font'>${totalValue.toFixed(2)}</p>
				</div>

				<div className='h-px bg-foreground/10' />

				<div>
					<div className='flex items-center gap-2 mb-2'>
						<Zap className='w-4 h-4 text-sendo-red' />
						<p className='text-xs text-foreground/60 uppercase'>High Priority</p>
					</div>
					<p className='text-2xl font-bold text-sendo-red title-font'>{highPriorityCount}</p>
				</div>

				<div className='h-px bg-foreground/10' />

				<div>
					<p className='text-xs text-foreground/60 uppercase mb-2'>Active Rules</p>
					<p className='text-2xl font-bold text-foreground title-font'>2/3</p>
				</div>

				<div className='mt-4 pt-4 border-t border-foreground/10'>
					<p className='text-xs text-foreground/40 text-center'>Worker last checked 2 minutes ago</p>
				</div>
			</div>
		</div>
	);
}
