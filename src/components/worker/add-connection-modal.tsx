'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ConfigField {
	name: string;
	label: string;
	type: string;
	required?: boolean;
	default?: string | number;
	description?: string;
}

interface Plugin {
	id: string;
	name: string;
	icon: string;
	price: string;
	description: string;
	category: string;
	authType: 'oauth' | 'api_key';
	configFields?: ConfigField[];
	isSponsored?: boolean;
}

interface AddConnectionModalProps {
	onClose: () => void;
	onSelectPlugin: (plugin: Plugin) => void;
}

// Import all plugins from the marketplace
const MARKETPLACE_PLUGINS: Record<string, Plugin[]> = {
	sponsored: [
		{
			id: 'jupiter',
			name: 'Jupiter Aggregator',
			icon: '🪐',
			price: 'FREE',
			description: 'Your DeFi trading companion with advanced swap strategies',
			category: 'DEX',
			authType: 'api_key',
			configFields: [
				{
					name: 'jupiter_api_key',
					label: 'JUPITER API KEY',
					type: 'password',
					required: true,
					description: 'Your Jupiter API key',
				},
				{
					name: 'slippage',
					label: 'SLIPPAGE (%)',
					type: 'number',
					required: true,
					default: 1,
				},
			],
		},
		{
			id: 'spartan',
			name: 'Spartan AI',
			icon: '⚔️',
			price: '12.3 SOL',
			description: 'War-room portfolio management and risk analysis',
			category: 'AI',
			authType: 'oauth',
		},
	],
	liquidity: [
		{
			id: 'orca',
			name: 'Orca DEX',
			icon: '🐋',
			price: 'FREE',
			description: 'Concentrated liquidity pools and yield farming',
			category: 'DEX',
			authType: 'oauth',
		},
		{
			id: 'raydium',
			name: 'Raydium',
			icon: '⚡',
			price: 'FREE',
			description: 'AMM + Orderbook hybrid exchange',
			category: 'DEX',
			authType: 'api_key',
			configFields: [
				{
					name: 'raydium_rpc',
					label: 'RPC ENDPOINT',
					type: 'text',
					required: true,
				},
				{
					name: 'priority_fee',
					label: 'PRIORITY FEE (SOL)',
					type: 'number',
					default: 0.0001,
				},
			],
		},
		{
			id: 'meteora',
			name: 'Meteora DLMM',
			icon: '☄️',
			price: 'FREE',
			description: 'Dynamic Liquidity Management Module',
			category: 'DEX',
			authType: 'api_key',
			configFields: [
				{
					name: 'meteora_api_key',
					label: 'METEORA API KEY',
					type: 'password',
					required: true,
				},
			],
		},
	],
	trading: [
		{
			id: 'drift',
			name: 'Drift Protocol',
			icon: '🏎️',
			price: 'FREE',
			description: 'Perpetual trading with leverage',
			category: 'Perps',
			authType: 'oauth',
		},
		{
			id: 'jito',
			name: 'Jito Network',
			icon: '💎',
			price: 'FREE',
			description: 'Liquid staking & MEV optimization',
			category: 'Staking',
			authType: 'api_key',
			configFields: [
				{
					name: 'jito_api_key',
					label: 'JITO API KEY',
					type: 'password',
					required: true,
				},
			],
		},
		{
			id: 'kamino',
			name: 'Kamino Finance',
			icon: '🎯',
			price: 'FREE',
			description: 'Lending, borrowing & auto-compounding vaults',
			category: 'DeFi',
			authType: 'api_key',
			configFields: [
				{
					name: 'kamino_api_key',
					label: 'KAMINO API KEY',
					type: 'password',
					required: true,
				},
			],
		},
	],
	ai: [
		{
			id: 'senpi',
			name: 'Senpi AI',
			icon: '🤖',
			price: '0.5 SOL',
			description: 'OnChain/GPT for autonomous trading',
			category: 'AI Agent',
			authType: 'oauth',
		},
		{
			id: 'spartan-ai',
			name: 'Spartan AI',
			icon: '⚔️',
			price: '0.4 SOL',
			description: 'DeFi warlord with alpha and attitude',
			category: 'AI Agent',
			authType: 'oauth',
		},
	],
	community: [
		{
			id: 'crypto-score',
			name: 'Crypto Score',
			icon: '📊',
			price: '1 SOL',
			description: 'Wallet risk analysis & scoring system',
			category: 'Analytics',
			authType: 'api_key',
			configFields: [
				{
					name: 'scoring_api_key',
					label: 'SCORING API KEY',
					type: 'password',
					required: true,
				},
			],
		},
		{
			id: 'portfolio-advisor',
			name: 'AI Portfolio Advisor',
			icon: '🎓',
			price: '0.2 SOL',
			description: 'Personalized AI-driven portfolio management',
			category: 'AI',
			authType: 'oauth',
		},
		{
			id: 'social-tracker',
			name: 'Social Signal Tracker',
			icon: '📱',
			price: '0.15 SOL',
			description: 'Monitor social and on-chain sentiment',
			category: 'Analytics',
			authType: 'api_key',
			configFields: [
				{
					name: 'twitter_api_key',
					label: 'TWITTER API KEY',
					type: 'password',
					required: true,
				},
			],
		},
		{
			id: 'reputation-index',
			name: 'Token Reputation Index',
			icon: '🔍',
			price: '0.1 SOL',
			description: 'Evaluate tokens based on trust & transparency',
			category: 'Analytics',
			authType: 'api_key',
			configFields: [
				{
					name: 'reputation_api_key',
					label: 'REPUTATION API KEY',
					type: 'password',
					required: true,
				},
			],
		},
	],
};

export default function AddConnectionModal({
	onClose,
	onSelectPlugin,
}: AddConnectionModalProps) {
	const [search, setSearch] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');

	// Flatten all plugins
	const allPlugins = [
		...MARKETPLACE_PLUGINS.sponsored.map((p) => ({ ...p, isSponsored: true })),
		...MARKETPLACE_PLUGINS.liquidity,
		...MARKETPLACE_PLUGINS.trading,
		...MARKETPLACE_PLUGINS.ai,
		...MARKETPLACE_PLUGINS.community,
	];

	const categories = [
		'all',
		'DEX',
		'AI',
		'Perps',
		'Staking',
		'DeFi',
		'Analytics',
	];

	const filteredPlugins = allPlugins.filter((plugin) => {
		const matchesSearch =
			plugin.name.toLowerCase().includes(search.toLowerCase()) ||
			plugin.description.toLowerCase().includes(search.toLowerCase()) ||
			plugin.category.toLowerCase().includes(search.toLowerCase());
		const matchesCategory =
			selectedCategory === 'all' || plugin.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
				onClick={onClose}
			>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					onClick={(e) => e.stopPropagation()}
					className="bg-[#0D0D0D] border-2 border-[#FF6B00]/30 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
					style={{ borderRadius: 0 }}
				>
					{/* Header */}
					<div className="border-b border-[#F2EDE7]/10 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2
								className="text-2xl font-bold uppercase"
								style={{ fontFamily: 'TECHNOS, sans-serif' }}
							>
								ADD <span className="text-[#FF6B00]">CONNECTION</span>
							</h2>
							<button
								onClick={onClose}
								className="w-10 h-10 bg-[#F2EDE7]/5 hover:bg-[#F2EDE7]/10 flex items-center justify-center"
								style={{ borderRadius: 0 }}
							>
								<X className="w-6 h-6 text-[#F2EDE7]/60" />
							</button>
						</div>

						{/* Search */}
						<div className="relative mb-4">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F2EDE7]/40" />
							<Input
								type="text"
								placeholder="Search plugins..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-10 h-12 bg-[#F2EDE7]/5 border-[#F2EDE7]/20 text-[#F2EDE7]"
								style={{ borderRadius: 0 }}
							/>
						</div>

						{/* Category Filter */}
						<div className="flex gap-2 flex-wrap">
							{categories.map((cat) => (
								<button
									key={cat}
									onClick={() => setSelectedCategory(cat)}
									className={`px-3 py-1.5 text-xs uppercase transition-all ${
										selectedCategory === cat
											? 'bg-gradient-to-r from-[#FF6B00] to-[#FF223B] text-white'
											: 'bg-[#F2EDE7]/5 text-[#F2EDE7]/60 hover:bg-[#F2EDE7]/10'
									}`}
									style={{ borderRadius: 0 }}
								>
									{cat}
								</button>
							))}
						</div>
					</div>

					{/* Plugin List */}
					<div className="flex-1 overflow-y-auto p-6">
						<div className="grid md:grid-cols-2 gap-4">
							{filteredPlugins.map((plugin) => (
								<motion.div
									key={plugin.id}
									whileHover={{ scale: 1.02 }}
									className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${
										plugin.isSponsored
											? 'bg-gradient-to-r from-[#FFD700]/10 to-[#FF6B00]/10 border-[#FFD700]/30'
											: 'bg-[#F2EDE7]/5 border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#FF6B00]/50'
									}`}
									style={{ borderRadius: 0 }}
									onClick={() => onSelectPlugin(plugin)}
								>
									<div
										className="w-12 h-12 bg-gradient-to-r from-[#FF6B00] to-[#FF223B] flex items-center justify-center text-2xl flex-shrink-0"
										style={{
											clipPath:
												'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
										}}
									>
										{plugin.icon}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											{plugin.isSponsored && (
												<Crown className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
											)}
											<h3 className="text-sm font-bold text-[#F2EDE7] truncate">
												{plugin.name}
											</h3>
										</div>
										<div className="flex items-center gap-2 mb-2">
											<span
												className="px-2 py-0.5 bg-[#FF6B00]/20 text-[#FF6B00] text-xs"
												style={{ borderRadius: 0 }}
											>
												{plugin.category}
											</span>
											<span
												className="px-2 py-0.5 bg-[#F2EDE7]/10 text-[#F2EDE7]/60 text-xs uppercase"
												style={{ borderRadius: 0 }}
											>
												{plugin.authType === 'oauth' ? 'OAuth' : 'API Key'}
											</span>
											<span className="text-xs font-bold text-[#14F195]">
												{plugin.price}
											</span>
										</div>
										<p className="text-xs text-[#F2EDE7]/60 line-clamp-2">
											{plugin.description}
										</p>
									</div>
									<div className="text-[#FF6B00] text-xl flex-shrink-0">→</div>
								</motion.div>
							))}
						</div>

						{filteredPlugins.length === 0 && (
							<div className="text-center py-12">
								<p className="text-[#F2EDE7]/40">No plugins found</p>
							</div>
						)}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
