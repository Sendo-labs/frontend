'use client';

import { History, TrendingDown, DollarSign, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { WorkerAction } from '@/services/worker-client.service';

interface ActionHistoryProps {
	actions: WorkerAction[];
}

const ACTION_ICONS: Record<string, LucideIcon> = {
	SELL_DUST: TrendingDown,
	TAKE_PROFIT: DollarSign,
	REBALANCE: AlertCircle,
	STAKE: DollarSign,
	SWAP: TrendingDown,
};

export default function ActionHistory({ actions }: ActionHistoryProps) {
	const formatTime = (date: Date) => {
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

		if (diff < 60) return `${diff}s ago`;
		if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
		return `${Math.floor(diff / 86400)}d ago`;
	};

	return (
		<div>
			<div className='flex items-center gap-2 mb-4'>
				<History className='w-5 h-5 text-foreground/60' />
				<h2 className='text-xl font-bold text-foreground uppercase title-font'>HISTORY</h2>
				{actions.length > 0 && <span className='text-sm text-foreground/40'>({actions.length})</span>}
			</div>

			{actions.length === 0 ? (
				<div className='bg-foreground/5 border border-foreground/10 p-8 text-center' style={{ borderRadius: 0 }}>
					<History className='w-12 h-12 text-foreground/20 mx-auto mb-3' />
					<p className='text-foreground/40 text-sm'>
						No actions executed yet. Start by accepting or rejecting suggested actions above.
					</p>
				</div>
			) : (
				<div className='space-y-3'>
					<AnimatePresence>
						{actions.map((action) => {
							const Icon = ACTION_ICONS[action.actionType] || AlertCircle;
							const isAccepted = action.status === 'accept';
							const isRejected = action.status === 'rejected';
							return (
								<motion.div
									key={action.id}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.3 }}
									className={`border p-4 opacity-70 hover:opacity-90 transition-opacity ${
										isAccepted
											? 'bg-sendo-green/5 border-sendo-green/20'
											: isRejected
												? 'bg-sendo-red/5 border-sendo-red/20'
												: 'bg-foreground/5 border-foreground/20'
									}`}
									style={{ borderRadius: 0 }}
								>
									<div className='flex items-start gap-3'>
										<div
											className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
												isAccepted ? 'bg-sendo-green/20' : isRejected ? 'bg-sendo-red/20' : 'bg-foreground/20'
											}`}
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
											}}
										>
											<Icon
												className={`w-5 h-5 ${isAccepted ? 'text-sendo-green' : isRejected ? 'text-sendo-red' : 'text-foreground'}`}
											/>
										</div>

										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2 mb-1'>
												<h3 className='text-base font-bold text-foreground/70 uppercase title-font'>
													{action.actionType.replace(/_/g, ' ')}
												</h3>
												<div
													className={`flex items-center gap-1 text-xs font-bold ${
														isAccepted ? 'text-sendo-green' : isRejected ? 'text-sendo-red' : 'text-foreground'
													}`}
												>
													{isAccepted ? (
														<>
															<CheckCircle className='w-3 h-3' />
															<span>ACCEPTED</span>
														</>
													) : (
														<>
															<X className='w-3 h-3' />
															<span>REJECTED</span>
														</>
													)}
												</div>
											</div>

											<p className='text-sm text-foreground/50 mb-2'>{action.reasoning}</p>

											<div className='flex items-center justify-between'>
												<div className='flex flex-wrap gap-2 text-xs'>
													{action.params.token && <span className='text-foreground/40'>{action.params.token}</span>}
													{action.params.amount && (
														<span
															className={`font-bold ${isAccepted ? 'text-sendo-green/60' : isRejected ? 'text-sendo-red/60' : 'text-foreground/60'}`}
														>
															${action.params.amount.toFixed(2)}
														</span>
													)}
												</div>
												<span className='text-xs text-foreground/30'>{formatTime(new Date(action.createdAt))}</span>
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}
