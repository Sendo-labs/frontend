'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TokenData {
	symbol: string;
	token_address: string;
	profit_status: string;
	status: string;
	volume_sol: number;
	pnl_sol: number;
	tokens_held: number;
	ath_price: number;
	purchase_price: number;
	sold_price: number;
	price_diff_pct?: number;
	transactions: number;
	total_tokens_traded: number;
}

interface TokenDetailsListProps {
	tokens: TokenData[];
}

export default function TokenDetailsList({ tokens }: TokenDetailsListProps) {
	const [filter, setFilter] = useState('all');

	const filteredTokens = tokens.filter((token) => {
		if (filter === 'all') return true;
		if (filter === 'profit') return token.profit_status === 'profit';
		if (filter === 'loss') return token.profit_status === 'loss';
		if (filter === 'sold') return token.status === 'sold';
		return true;
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5, duration: 0.6 }}
			className='bg-background border border-foreground/10 p-4 md:p-6'
			style={{ borderRadius: 0 }}
		>
			{/* Header */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
				<div className='flex items-center gap-2'>
					<List className='w-5 h-5 text-sendo-orange' />
					<h3 className='text-lg font-bold text-foreground uppercase title-font'>
						TOKEN DETAILS ({filteredTokens.length})
					</h3>
				</div>

			{/* Filters */}
			<Select value={filter} onValueChange={setFilter}>
				<SelectTrigger className='w-[200px] ibm-font h-9 text-sm'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className='ibm-font'>
					<SelectItem value='all'>All</SelectItem>
					<SelectItem value='profit'>Profit</SelectItem>
					<SelectItem value='loss'>Loss</SelectItem>
					<SelectItem value='sold'>Sold</SelectItem>
				</SelectContent>
			</Select>
			</div>

			{/* Token List */}
			<div className='space-y-3'>
				{filteredTokens.map((token, index) => (
					<motion.div
						key={index}
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.05 * index, duration: 0.4 }}
				className='bg-foreground/5 border border-foreground/10 p-3 md:p-4 hover:border-sendo-orange/30 transition-all'
				style={{ borderRadius: 0 }}
			>
					{/* Header */}
					<div className='flex items-start justify-between mb-3 gap-2'>
						<div className='flex items-center gap-2 md:gap-3 min-w-0 flex-1'>
							<div
								className={`w-8 h-8 md:w-10 md:h-10 ${
									token.profit_status === 'profit' ? 'bg-sendo-green' : 'bg-sendo-red'
								} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
								style={{ borderRadius: 0 }}
							>
								{token.symbol.slice(0, 2)}
							</div>
							<div className='min-w-0 flex-1'>
								<h4 className='text-foreground font-bold text-sm md:text-lg truncate'>{token.symbol}</h4>
								<p className='text-foreground/40 text-[10px] md:text-xs font-mono truncate'>
									{token.token_address.slice(0, 4)}...{token.token_address.slice(-6)}
								</p>
							</div>
						</div>

						{/* Status badges */}
						<div className='flex flex-col items-end gap-1 flex-shrink-0'>
							<div
								className={`px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold title-font whitespace-nowrap ${
									token.status === 'sold'
										? 'bg-foreground/10 text-foreground'
										: 'bg-sendo-orange/10 text-sendo-orange'
								}`}
								style={{ borderRadius: 0 }}
							>
								{token.status.toUpperCase()}
							</div>
							<div
								className={`px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold title-font whitespace-nowrap ${
									token.profit_status === 'profit'
										? 'bg-sendo-green/10 text-sendo-green'
										: 'bg-sendo-red/10 text-sendo-red'
								}`}
								style={{ borderRadius: 0 }}
							>
								{token.profit_status.toUpperCase()}
							</div>
						</div>
					</div>

					{/* Stats Grid */}
					<div className='grid grid-cols-2 gap-3 md:gap-4 pt-3 border-t border-foreground/10'>
						<div className='min-w-0'>
							<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>Total Value Traded</p>
							<p className='text-foreground font-bold text-xs md:text-sm truncate'>${token.volume_sol.toFixed(2)}</p>
						</div>
						<div className='min-w-0'>
							<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>PnL Realized</p>
							<p className={`font-bold text-xs md:text-sm truncate ${token.pnl_sol >= 0 ? 'text-sendo-green' : 'text-sendo-red'}`}>
								{token.pnl_sol >= 0 ? '+' : ''}${token.pnl_sol.toFixed(2)}
							</p>
						</div>
						<div className='min-w-0'>
							<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>Purchase Price</p>
							<p className='text-foreground font-bold text-xs md:text-sm truncate'>${token.purchase_price.toFixed(8)}</p>
						</div>
						<div className='min-w-0'>
							<p className='text-foreground/40 text-[10px] md:text-xs mb-1'>ATH Price</p>
							<p className='text-sendo-red font-bold text-xs md:text-sm'>
								<span className='truncate block'>${token.ath_price.toFixed(8)}</span>
								{token.price_diff_pct !== undefined && token.price_diff_pct !== 0 && (
									<span className='text-sendo-red/70 text-[10px]'>(+{token.price_diff_pct.toFixed(2)}%)</span>
								)}
							</p>
						</div>
					</div>

						{/* Transaction count */}
						<div className='mt-3 pt-3 border-t border-foreground/10'>
							<p className='text-foreground/60 text-xs'>
								{token.transactions} transaction{token.transactions > 1 ? 's' : ''}
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}
