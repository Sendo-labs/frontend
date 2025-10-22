'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Wallet, Image as ImageIcon, Coins } from 'lucide-react';

interface WalletStats {
	signatures: number;
	sol_balance: number;
	nfts: number;
	tokens: number;
}

interface WalletStatsGridProps {
	stats: WalletStats;
}

export default function WalletStatsGrid({ stats }: WalletStatsGridProps) {
	// Valeurs par défaut pour éviter les erreurs undefined
	const safeStats = {
		signatures: stats.signatures ?? 0,
		sol_balance: stats.sol_balance ?? 0,
		nfts: stats.nfts ?? 0,
		tokens: stats.tokens ?? 0,
	};

	const statCards = [
		{
			icon: Activity,
			label: 'SIGNATURES',
			value: safeStats.signatures.toLocaleString(),
			color: 'from-sendo-orange to-sendo-red',
		},
		{ icon: Wallet, label: 'SOL', value: safeStats.sol_balance.toFixed(2), color: 'from-sendo-green to-[#00D9B5]' },
		{ icon: ImageIcon, label: 'NFTs', value: safeStats.nfts, color: 'from-[#9945FF] to-sendo-green' },
		{ icon: Coins, label: 'TOKENS', value: safeStats.tokens, color: 'from-sendo-orange to-sendo-red' },
	];

	return (
		<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
			{statCards.map((stat, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 * index, duration: 0.5 }}
					className='bg-background border border-foreground/10 p-6 hover:border-sendo-orange/50 transition-all'
					style={{ borderRadius: 0 }}
				>
					<div
						className={`w-10 h-10 bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
					>
						<stat.icon className='w-5 h-5 text-white' />
					</div>
					<div className='text-3xl md:text-4xl font-bold text-foreground mb-1 title-font'>{stat.value}</div>
					<div className='text-xs text-foreground/60 uppercase title-font'>{stat.label}</div>
				</motion.div>
			))}
		</div>
	);
}
