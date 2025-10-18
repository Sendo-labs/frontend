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
				<Activity className='w-5 h-5 text-[#FF6B00]' />
				<h2 className='text-xl font-bold text-foreground uppercase' style={{ fontFamily: 'TECHNOS, sans-serif' }}>
					STATS
				</h2>
			</div>

			<div className='bg-foreground/5 border border-foreground/10 p-4 space-y-4' style={{ borderRadius: 0 }}>
				<div>
					<div className='flex items-center gap-2 mb-2'>
						<TrendingUp className='w-4 h-4 text-[#14F195]' />
						<p className='text-xs text-foreground/60 uppercase'>Potential Gains</p>
					</div>
					<p className='text-2xl font-bold text-[#14F195]' style={{ fontFamily: 'TECHNOS, sans-serif' }}>
						${totalValue.toFixed(2)}
					</p>
				</div>

				<div className='h-px bg-foreground/10' />

				<div>
					<div className='flex items-center gap-2 mb-2'>
						<Zap className='w-4 h-4 text-[#FF223B]' />
						<p className='text-xs text-foreground/60 uppercase'>High Priority</p>
					</div>
					<p className='text-2xl font-bold text-[#FF223B]' style={{ fontFamily: 'TECHNOS, sans-serif' }}>
						{highPriorityCount}
					</p>
				</div>

				<div className='h-px bg-foreground/10' />

				<div>
					<p className='text-xs text-foreground/60 uppercase mb-2'>Active Rules</p>
					<p className='text-2xl font-bold text-foreground' style={{ fontFamily: 'TECHNOS, sans-serif' }}>
						2/3
					</p>
				</div>

				<div className='mt-4 pt-4 border-t border-foreground/10'>
					<p className='text-xs text-foreground/40 text-center'>Worker last checked 2 minutes ago</p>
				</div>
			</div>
		</div>
	);
}
