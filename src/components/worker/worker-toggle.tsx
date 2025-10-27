'use client';

import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkerToggleProps {
	onCreateAnalysis: () => void;
	isCreatingAnalysis: boolean;
}

export default function WorkerToggle({ onCreateAnalysis, isCreatingAnalysis }: WorkerToggleProps) {
	
	return (
		<div className='bg-foreground/5 border border-foreground/10 p-4 md:p-6' style={{ borderRadius: 0 }}>
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div>
					<h3 className='text-lg font-bold text-foreground mb-1 uppercase title-font'>Worker Mode</h3>
					<p className='text-sm text-foreground/60'>
						Worker will suggest actions for your approval
					</p>
				</div>

				<div className='flex gap-2'>
					<Button
						className={`h-10 px-4 transition-all ${
							'bg-gradient-to-r from-sendo-orange to-sendo-red text-white'
						}`}
						style={{ borderRadius: 0, fontFamily: 'TECHNOS, sans-serif' }}
						onClick={onCreateAnalysis}
						disabled={isCreatingAnalysis}
					>
						<Eye className='w-4 h-4 mr-2' />
						SUGGEST
					</Button>
				</div>
			</div>
		</div>
	);
}
