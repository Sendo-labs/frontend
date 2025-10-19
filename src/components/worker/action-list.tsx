'use client';

import { TrendingDown, DollarSign, AlertCircle, CheckCircle, Clock, Zap, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import type { WorkerAction } from '@/services/worker-client.service';

interface ActionListProps {
	actions: WorkerAction[] | null;
	onAccept: (action: WorkerAction) => void;
	onReject: (action: WorkerAction) => void;
	onValidateAll: () => void;
	isExecuting: boolean;
	mode: 'suggest' | 'auto';
}

const ACTION_ICONS: Record<string, LucideIcon> = {
	SELL_DUST: TrendingDown,
	TAKE_PROFIT: DollarSign,
	REBALANCE: AlertCircle,
	STAKE: DollarSign,
	SWAP: TrendingDown,
};

const PRIORITY_COLORS: Record<string, string> = {
	HIGH: 'border-sendo-red bg-sendo-red/10',
	MEDIUM: 'border-sendo-orange bg-sendo-orange/10',
	LOW: 'border-foreground bg-foreground/5',
};

const PRIORITY_TEXT: Record<string, string> = {
	HIGH: 'text-sendo-red',
	MEDIUM: 'text-sendo-orange',
	LOW: 'text-foreground/60',
};

export default function ActionList({ actions, onAccept, onReject, onValidateAll, isExecuting, mode }: ActionListProps) {
	if (!actions || actions.length === 0) {
		return (
			<div>
				<div className='flex items-center gap-2 mb-4'>
					<Zap className='w-5 h-5 text-sendo-orange' />
					<h2 className='text-xl font-bold text-foreground uppercase title-font'>
						SUGGESTED{' '}
						<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>
							ACTIONS
						</span>
					</h2>
				</div>
				<div className='bg-foreground/5 border border-foreground/10 p-12 text-center' style={{ borderRadius: 0 }}>
					<CheckCircle className='w-12 h-12 text-sendo-green mx-auto mb-4' />
					<h3 className='text-xl font-bold text-foreground mb-2 title-font'>All Clear! 🎉</h3>
					<p className='text-foreground/60'>No actions needed right now. Your portfolio is looking good.</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-2'>
					<Zap className='w-5 h-5 text-sendo-orange' />
					<h2 className='text-xl font-bold text-foreground uppercase title-font'>
						SUGGESTED{' '}
						<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>
							ACTIONS
						</span>
					</h2>
				</div>
				<div className='flex items-center gap-3'>
					<div className='flex items-center gap-2'>
						<Clock className='w-4 h-4 text-foreground/40' />
						<span className='text-xs text-foreground/40'>Updated 2 min ago</span>
					</div>
					{mode === 'suggest' && actions.length > 1 && (
						<Button
							onClick={onValidateAll}
							disabled={isExecuting}
							className='bg-sendo-green hover:bg-sendo-green/80 text-black h-10 px-4'
							style={{ borderRadius: 0, fontFamily: 'TECHNOS, sans-serif' }}
						>
							<Check className='w-4 h-4 mr-2' />
							VALIDATE ALL
						</Button>
					)}
				</div>
			</div>

			<div className='space-y-4'>
				{actions.map((action) => {
					const Icon = ACTION_ICONS[action.actionType] || AlertCircle;
					const priorityKey = action.priority.toUpperCase();

					return (
						<div
							key={action.id}
							className={`border p-4 md:p-6 transition-all hover:scale-[1.02] ${PRIORITY_COLORS[priorityKey] || PRIORITY_COLORS.LOW}`}
							style={{ borderRadius: 0 }}
						>
							<div className='flex items-start justify-between gap-4'>
								<div className='flex items-start gap-3 flex-1'>
									<div
										className={`w-10 h-10 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center flex-shrink-0`}
										style={{
											clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
										}}
									>
										<Icon className='w-5 h-5 text-white' />
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2 mb-2'>
											<h3 className='text-lg font-bold text-foreground uppercase title-font'>
												{action.actionType.replace(/_/g, ' ')}
											</h3>
											<span
												className={`text-xs font-bold uppercase ${PRIORITY_TEXT[priorityKey] || PRIORITY_TEXT.LOW}`}
											>
												{action.priority}
											</span>
										</div>

										<p className='text-sm text-foreground/70 mb-3'>{action.reasoning}</p>

										<div className='flex flex-wrap gap-2'>
											{action.params.token && (
												<div className='text-xs text-foreground/60'>
													<span className='font-semibold'>Token:</span> {action.params.token}
												</div>
											)}
											{action.params.amount && (
												<div className='text-xs text-foreground/60'>
													<span className='font-semibold'>Amount:</span> {action.params.amount}
												</div>
											)}
											{action.params.validator && (
												<div className='text-xs text-foreground/60'>
													<span className='font-semibold'>Validator:</span> {action.params.validator}
												</div>
											)}
											<div className='text-xs font-bold text-sendo-green'>
												Confidence: {(action.confidence * 100).toFixed(0)}%
											</div>
										</div>
									</div>
								</div>

								{mode === 'suggest' && (
									<div className='flex gap-2 flex-shrink-0'>
										<Button
											onClick={() => onAccept(action)}
											disabled={isExecuting}
											className='bg-sendo-green hover:bg-sendo-green/80 text-black h-10 w-10 p-0 flex items-center justify-center'
											style={{ borderRadius: 0 }}
										>
											<Check className='w-5 h-5' />
										</Button>
										<Button
											onClick={() => onReject(action)}
											disabled={isExecuting}
											className='bg-sendo-red hover:bg-sendo-red/80 text-white h-10 w-10 p-0 flex items-center justify-center'
											style={{ borderRadius: 0 }}
										>
											<X className='w-5 h-5' />
										</Button>
									</div>
								)}

								{mode === 'auto' && (
									<div className='flex items-center gap-2 text-xs text-sendo-green flex-shrink-0'>
										<CheckCircle className='w-4 h-4' />
										<span className='font-semibold'>AUTO</span>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
