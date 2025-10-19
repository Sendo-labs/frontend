'use client';

import { History, TrendingDown, DollarSign, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface HistoryAction {
	type: string;
	tokens?: string[];
	token?: string;
	size_pct?: number;
	est_usd: number;
	reason: string;
	priority: 'low' | 'medium' | 'high';
	executedAt: Date;
	accepted: boolean;
	status: 'accepted' | 'rejected';
}

interface ActionHistoryProps {
	history: HistoryAction[];
}

const ACTION_ICONS: Record<string, LucideIcon> = {
	SELL_DUST: TrendingDown,
	TAKE_PROFIT: DollarSign,
	REBALANCE: AlertCircle,
};

export default function ActionHistory({ history }: ActionHistoryProps) {
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
				{history.length > 0 && <span className='text-sm text-foreground/40'>({history.length})</span>}
			</div>

			{history.length === 0 ? (
				<div className='bg-foreground/5 border border-foreground/10 p-8 text-center' style={{ borderRadius: 0 }}>
					<History className='w-12 h-12 text-foreground/20 mx-auto mb-3' />
					<p className='text-foreground/40 text-sm'>
						No actions executed yet. Start by accepting or rejecting suggested actions above.
					</p>
				</div>
			) : (
				<div className='space-y-3'>
					<AnimatePresence>
						{history.map((action, index) => {
							const Icon = ACTION_ICONS[action.type] || AlertCircle;
							const isAccepted = action.accepted;

							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.3 }}
									className={`border p-4 opacity-70 hover:opacity-90 transition-opacity ${
										isAccepted ? 'bg-sendo-green/5 border-sendo-green/20' : 'bg-sendo-red/5 border-sendo-red/20'
									}`}
									style={{ borderRadius: 0 }}
								>
									<div className='flex items-start gap-3'>
										<div
											className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
												isAccepted ? 'bg-sendo-green/20' : 'bg-sendo-red/20'
											}`}
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
											}}
										>
											<Icon className={`w-5 h-5 ${isAccepted ? 'text-sendo-green' : 'text-sendo-red'}`} />
										</div>

										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2 mb-1'>
												<h3 className='text-base font-bold text-foreground/70 uppercase title-font'>
													{action.type.replace(/_/g, ' ')}
												</h3>
												<div
													className={`flex items-center gap-1 text-xs font-bold ${
														isAccepted ? 'text-sendo-green' : 'text-sendo-red'
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

											<p className='text-sm text-foreground/50 mb-2'>{action.reason}</p>

											<div className='flex items-center justify-between'>
												<div className='flex flex-wrap gap-2 text-xs'>
													{action.tokens && <span className='text-foreground/40'>{action.tokens.join(', ')}</span>}
													{action.token && <span className='text-foreground/40'>{action.token}</span>}
													<span className={`font-bold ${isAccepted ? 'text-sendo-green/60' : 'text-sendo-red/60'}`}>
														${action.est_usd.toFixed(2)}
													</span>
												</div>
												<span className='text-xs text-foreground/30'>{formatTime(action.executedAt)}</span>
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
