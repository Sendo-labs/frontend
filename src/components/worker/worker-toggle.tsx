'use client';

import { Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkerToggleProps {
	mode: 'suggest' | 'auto';
	onModeChange: (mode: 'suggest' | 'auto') => void;
}

export default function WorkerToggle({ mode, onModeChange }: WorkerToggleProps) {
	return (
		<div className='bg-foreground/5 border border-foreground/10 p-4 md:p-6' style={{ borderRadius: 0 }}>
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div>
					<h3 className='text-lg font-bold text-foreground mb-1 uppercase title-font'>Worker Mode</h3>
					<p className='text-sm text-foreground/60'>
						{mode === 'suggest'
							? 'Worker will suggest actions for your approval'
							: 'Worker will execute actions automatically'}
					</p>
				</div>

				<div className='flex gap-2'>
					<Button
						onClick={() => onModeChange('suggest')}
						className={`h-10 px-4 transition-all ${
							mode === 'suggest'
								? 'bg-gradient-to-r from-sendo-orange to-sendo-red text-white'
								: 'bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10'
						}`}
						style={{ borderRadius: 0, fontFamily: 'TECHNOS, sans-serif' }}
					>
						<Eye className='w-4 h-4 mr-2' />
						SUGGEST
					</Button>

					<Button
						onClick={() => onModeChange('auto')}
						className={`h-10 px-4 transition-all ${
							mode === 'auto'
								? 'bg-gradient-to-r from-sendo-orange to-sendo-red text-white'
								: 'bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10'
						}`}
						style={{ borderRadius: 0, fontFamily: 'TECHNOS, sans-serif' }}
					>
						<Zap className='w-4 h-4 mr-2' />
						AUTO
					</Button>
				</div>
			</div>

			{mode === 'auto' && (
				<div className='mt-4 bg-sendo-red/10 border border-sendo-red/30 p-3' style={{ borderRadius: 0 }}>
					<p className='text-xs text-sendo-red font-semibold'>
						⚠️ Auto mode enabled: Worker will execute trades without confirmation
					</p>
				</div>
			)}
		</div>
	);
}
