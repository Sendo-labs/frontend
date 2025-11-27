'use client';

import { motion } from 'framer-motion';
import { Activity, Coins, Image as ImageIcon, Wallet } from 'lucide-react';
import { CountUp } from '@/components/ui/count-up';

interface WalletStats {
	signatures: number;
	sol_balance: number;
	nfts: number;
	tokens: number;
}

interface WalletStatsGridProps {
	stats: WalletStats;
	isProcessing?: boolean;
}

export default function WalletStatsGrid({ stats, isProcessing = false }: WalletStatsGridProps) {
	const statCards = [
		{
			icon: Activity,
			label: 'SIGNATURES',
			value: stats.signatures ?? 0,
			decimals: 0,
			separator: true,
			color: 'bg-white/10',
		},
		{
			icon: Wallet,
			label: 'SOL',
			value: stats.sol_balance ?? 0,
			decimals: 2,
			separator: false,
			color: 'bg-sendo-green/20 text-sendo-green',
		},
		{
			icon: ImageIcon,
			label: 'NFTs',
			value: stats.nfts ?? 0,
			decimals: 0,
			separator: false,
			color: 'bg-[#9945FF]/20 text-[#9945FF]',
		},
		{
			icon: Coins,
			label: 'TOKENS',
			value: stats.tokens ?? 0,
			decimals: 0,
			separator: false,
			color: 'bg-sendo-red/20 text-sendo-red',
		},
	];

	return (
		<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
			{statCards.map((stat, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 * index, duration: 0.5 }}
					className='bg-black/40 border border-white/10 p-4 md:p-6 hover:border-sendo-red/30 transition-all backdrop-blur-sm'
					style={{ borderRadius: 0 }}
				>
					<div
						className={`w-10 h-10 ${stat.color} flex items-center justify-center mb-4`}
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
					>
						<stat.icon className={`w-5 h-5 ${stat.color.includes('text-') ? '' : 'text-white'}`} />
					</div>
					<div className='text-3xl md:text-4xl font-bold text-foreground mb-1'>
						<CountUp
							end={stat.value}
							decimals={stat.decimals}
							separator={stat.separator}
							enableContinuous={true}
							isProcessing={isProcessing}
							pollInterval={5000}
							aggressiveness={0.5}
						/>
					</div>
					<div className='text-xs text-foreground/60 uppercase title-font'>{stat.label}</div>
				</motion.div>
			))}
		</div>
	);
}
