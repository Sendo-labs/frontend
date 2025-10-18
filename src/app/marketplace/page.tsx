'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PluginCard from '@/components/marketplace/plugin-card';
import PluginDetailModal from '@/components/marketplace/plugin-detail-modal';
import ConfigurePluginModal from '@/components/marketplace/configure-plugin-modal';
import { useState } from 'react';
import { Flame, Crown, Zap, Bot, Plug } from 'lucide-react';
import { PluginCategories } from '@/types/plugins';
import { Plugin } from '@/types/plugins';
import { Button } from '@/components/ui/button';

const PLUGINS: PluginCategories = {
	sponsored: [
		{
			id: 'jupiter',
			name: 'Jupiter Aggregator',
			icon: '🪐',
			price: 'FREE',
			description: 'Your DeFi trading companion with advanced swap strategies',
			tags: ['DEX', 'Trading', 'Active'],
			rating: 4.7,
			reviews: 275,
			category: 'liquidity',
			authType: 'api_key',
			longDescription:
				"Best-price routing across all Solana DEXs. Connects your trading agents to the deepest liquidity routes using Jupiter's on-chain aggregator for optimal swap execution.",
			features: [
				'Seamless integration with sEnDO framework',
				'Real-time on-chain execution',
				'Advanced risk management',
				'Community-audited code',
			],
			configFields: [
				{
					name: 'jupiter_api_key',
					label: 'JUPITER API KEY',
					type: 'password',
					required: true,
					description: 'Your Jupiter API key for accessing premium features',
				},
				{
					name: 'slippage',
					label: 'SLIPPAGE',
					type: 'number',
					required: true,
					default: 1,
					description: 'Maximum acceptable slippage percentage for swaps',
				},
			],
		},
		{
			id: 'spartan',
			name: 'Spartan AI',
			icon: '⚔️',
			price: '12.3 SOL',
			description: 'War-room portfolio management and risk analysis',
			tags: ['Liquidity', 'AI', 'Premium'],
			rating: 4.9,
			reviews: 142,
			category: 'ai',
			authType: 'oauth',
			longDescription:
				'DeFi warlord with alpha and attitude. Spartan is your no-BS Solana DeFi tactician, blending deep alpha insights, strategy execution, and unfiltered energy.',
			features: ['Alpha discovery engine', 'Portfolio war room', 'Risk tactical analysis', '24/7 market surveillance'],
		},
	],
	liquidity: [
		{
			id: 'orca',
			name: 'Orca DEX',
			icon: '🐋',
			price: 'FREE',
			description:
				"Concentrated liquidity pools and yield farming. Integrate your agent with Orca's user-friendly AMM, enabling swaps, LP management, and Liquidity...",
			tags: ['Store Trading', 'ElizaOS Wiki', 'Active Agent'],
			rating: 4.6,
			reviews: 189,
			category: 'liquidity',
			authType: 'oauth',
			longDescription:
				"Concentrated liquidity pools and yield farming. Integrate your agent with Orca's user-friendly AMM, enabling swaps, LP management, and Liquidity strategies.",
			features: [
				'Whirlpool concentrated liquidity',
				'Auto-rebalancing pools',
				'Yield optimization',
				'Gas-efficient swaps',
			],
		},
		{
			id: 'raydium',
			name: 'Raydium Hybrid Exchange',
			icon: '⚡',
			price: 'FREE',
			description:
				'AMM + Orderbook trading on Solana. Supports custom trading strategies on Raydium, combining automated liquidity and on-chain order book depth...',
			tags: ['Store Trading', 'ElizaOS Wiki', 'Active Agent'],
			rating: 4.5,
			reviews: 203,
			category: 'liquidity',
			authType: 'api_key',
			longDescription:
				'AMM + Orderbook trading on Solana. Supports custom trading strategies on Raydium, combining automated liquidity and on-chain order book depth.',
			features: ['Hybrid AMM/orderbook', 'Lightning-fast execution', 'Deep liquidity access', 'Advanced order types'],
			configFields: [
				{
					name: 'raydium_rpc',
					label: 'RAYDIUM RPC ENDPOINT',
					type: 'text',
					required: true,
					description: 'Custom RPC endpoint for Raydium integration',
				},
				{
					name: 'priority_fee',
					label: 'PRIORITY FEE (SOL)',
					type: 'number',
					required: false,
					default: 0.0001,
					description: 'Additional fee for transaction priority',
				},
			],
		},
		{
			id: 'meteora',
			name: 'Meteora DLMM',
			icon: '☄️',
			price: 'FREE',
			description:
				"Dynamic Liquidity Management Module. Enables your agent to interact with Meteora's DLMM protocol, optimizing liquidity positions dynamically...",
			tags: ['Store Trading', 'ElizaOS Wiki', 'Active Agent'],
			rating: 4.4,
			reviews: 156,
			category: 'liquidity',
			authType: 'api_key',
			longDescription:
				"Dynamic Liquidity Management Module. Enables your agent to interact with Meteora's DLMM protocol, optimizing liquidity positions dynamically across multiple price ranges.",
			features: ['Dynamic liquidity bins', 'Auto-repositioning', 'Fee optimization', 'Multi-range strategies'],
			configFields: [
				{
					name: 'meteora_api_key',
					label: 'METEORA API KEY',
					type: 'password',
					required: true,
					description: 'API key for Meteora DLMM access',
				},
				{
					name: 'rebalance_threshold',
					label: 'REBALANCE THRESHOLD (%)',
					type: 'number',
					required: true,
					default: 5,
					description: 'Price deviation threshold to trigger rebalancing',
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
			description:
				'Perpetual trading and leverage on Solana. Connect your trading agent to Drift, the leading on-chain perpetual DEX, supporting limit, perf and cross...',
			tags: ['Store Trading', 'ElizaOS Wiki', 'Active Agent'],
			rating: 4.8,
			reviews: 312,
			category: 'trading',
			authType: 'oauth',
			longDescription:
				'Perpetual trading and leverage on Solana. Connect your trading agent to Drift, the leading on-chain perpetual DEX, supporting limit, perf and cross-collateral positions.',
			features: ['Up to 10x leverage', 'Cross-margin trading', 'Advanced order types', 'Insurance fund protection'],
		},
		{
			id: 'jito',
			name: 'Jito Network',
			icon: '💎',
			price: 'FREE',
			description:
				"Liquid staking & MEV optimization. Integrate Jito's liquid staking system, allowing your agent to stake SOL, earn yield, and capture...",
			tags: ['Yield Farming', 'ElizaOS Wiki', 'Active Agent'],
			rating: 4.7,
			reviews: 267,
			category: 'trading',
			authType: 'api_key',
			longDescription:
				"Liquid staking & MEV optimization. Integrate Jito's liquid staking system, allowing your agent to stake SOL, earn yield, and capture MEV rewards.",
			features: [
				'Liquid staking tokens (JitoSOL)',
				'MEV rewards distribution',
				'Auto-compounding yields',
				'Instant unstaking',
			],
			configFields: [
				{
					name: 'jito_api_key',
					label: 'JITO API KEY',
					type: 'password',
					required: true,
					description: 'API key for Jito Network services',
				},
				{
					name: 'stake_amount',
					label: 'AUTO-STAKE AMOUNT (SOL)',
					type: 'number',
					required: false,
					description: 'Amount to automatically stake',
				},
			],
		},
		{
			id: 'kamino',
			name: 'Kamino Finance',
			icon: '🎯',
			price: 'FREE',
			description:
				"Lending, borrowing & auto-compounding vaults. Give your agent access to Kamino's smart lending platform, enabling optimized yield strategies...",
			tags: ['Yield Optimization', 'ElizaOS Wiki', 'Active Agent'],
			rating: 4.6,
			reviews: 198,
			category: 'trading',
			authType: 'api_key',
			longDescription:
				"Lending, borrowing & auto-compounding vaults. Give your agent access to Kamino's smart lending platform, enabling optimized yield strategies and leverage management.",
			features: [
				'Automated yield vaults',
				'Leverage management',
				'Risk-adjusted strategies',
				'Gas-optimized compounding',
			],
			configFields: [
				{
					name: 'kamino_api_key',
					label: 'KAMINO API KEY',
					type: 'password',
					required: true,
					description: 'API key for Kamino Finance',
				},
				{
					name: 'max_leverage',
					label: 'MAX LEVERAGE',
					type: 'number',
					required: true,
					default: 3,
					description: 'Maximum leverage multiplier',
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
			description:
				'OnChain/GPT for autonomous trading. Senpi is an AI agent designed for on-chain execution and alpha generation. It scans Solana markets, detects...',
			tags: ['AI Agent', 'Trading Automation', 'ElizaOS Core'],
			rating: 4.9,
			reviews: 421,
			category: 'ai',
			authType: 'oauth',
			longDescription:
				'OnChain/GPT for autonomous trading. Senpi is an AI agent designed for on-chain execution and alpha generation. It scans Solana markets, detects opportunities, and executes trades.',
			features: [
				'Autonomous market scanning',
				'Alpha signal generation',
				'Multi-strategy execution',
				'Self-learning algorithms',
			],
		},
		{
			id: 'spartan-ai',
			name: 'Spartan AI',
			icon: '⚔️',
			price: '0.4 SOL',
			description:
				'DeFi warlord with alpha and attitude. Spartan is your no-BS Solana DeFi tactician, blending deep alpha insights, strategy execution, and unfiltered energy...',
			tags: ['AI Agent', 'DeFi Strategy', 'ElizaOS Core'],
			rating: 4.8,
			reviews: 312,
			category: 'ai',
			authType: 'oauth',
			longDescription:
				'DeFi warlord with alpha and attitude. Spartan is your no-BS Solana DeFi tactician, blending deep alpha insights, strategy execution, and unfiltered energy.',
			features: [
				'Alpha discovery engine',
				'Tactical portfolio management',
				'Risk-adjusted execution',
				'Market sentiment analysis',
			],
		},
	],
	community: [
		{
			id: 'crypto-score',
			name: 'Crypto Score',
			icon: '📊',
			price: '1 SOL',
			description:
				'Wallet risk analysis & scoring system. Developed by community contributor Channel Stark, this plugin provides real-time wallet scoring, analyzing risk...',
			tags: ['External Plugin', 'ElizaOS Wiki', 'Community Agent'],
			rating: 4.5,
			reviews: 145,
			category: 'community',
			authType: 'api_key',
			longDescription:
				'Wallet risk analysis & scoring system. Developed by community contributor Channel Stark, this plugin provides real-time wallet scoring, analyzing risk factors and on-chain behavior.',
			features: [
				'Multi-factor risk scoring',
				'On-chain behavior analysis',
				'Real-time monitoring',
				'Historical tracking',
			],
			configFields: [
				{
					name: 'scoring_api_key',
					label: 'SCORING API KEY',
					type: 'password',
					required: true,
					description: 'API key for scoring service',
				},
			],
		},
		{
			id: 'portfolio-advisor',
			name: 'AI Portfolio Advisor',
			icon: '🎓',
			price: '0.2 SOL',
			description:
				'Personalized AI-driven portfolio management. External plugin offering AI-based investment recommendations, combining user memory with on...',
			tags: ['External Plugin', 'ElizaOS Wiki', 'Community Agent'],
			rating: 4.4,
			reviews: 98,
			category: 'community',
			authType: 'oauth',
			longDescription:
				'Personalized AI-driven portfolio management. External plugin offering AI-based investment recommendations, combining user memory with on-chain analysis.',
			features: [
				'Personalized recommendations',
				'Portfolio optimization',
				'Risk assessment',
				'Market correlation analysis',
			],
		},
		{
			id: 'social-tracker',
			name: 'Social Signal Tracker',
			icon: '📱',
			price: '0.15 SOL',
			description:
				'Monitor social and on-chain sentiment. Built by the open-source community, this plugin allows your agent to track Twitter, Pump.fun, and wallet...',
			tags: ['External Plugin', 'ElizaOS Wiki', 'Community Agent'],
			rating: 4.3,
			reviews: 167,
			category: 'community',
			authType: 'api_key',
			longDescription:
				'Monitor social and on-chain sentiment. Built by the open-source community, this plugin allows your agent to track Twitter, Pump.fun, and wallet activity for sentiment signals.',
			features: ['Multi-platform monitoring', 'Sentiment analysis', 'Trend detection', 'Alert system'],
			configFields: [
				{
					name: 'twitter_api_key',
					label: 'TWITTER API KEY',
					type: 'password',
					required: true,
					description: 'Twitter API key for social monitoring',
				},
				{
					name: 'sentiment_threshold',
					label: 'SENTIMENT THRESHOLD',
					type: 'number',
					required: false,
					default: 0.7,
					description: 'Minimum sentiment score to trigger alerts',
				},
			],
		},
		{
			id: 'reputation-index',
			name: 'Token Reputation Index',
			icon: '🔍',
			price: '0.1 SOL',
			description:
				'Evaluate tokens based on trust & transparency. Community-built plugin that aggregates on-chain credibility metrics, including holder concentration...',
			tags: ['External Plugin', 'ElizaOS Wiki', 'Community Agent'],
			rating: 4.2,
			reviews: 134,
			category: 'community',
			authType: 'api_key',
			longDescription:
				'Evaluate tokens based on trust & transparency. Community-built plugin that aggregates on-chain credibility metrics, including holder concentration, liquidity depth, and developer activity.',
			features: ['Trust score calculation', 'Holder analysis', 'Liquidity metrics', 'Developer tracking'],
			configFields: [
				{
					name: 'reputation_api_key',
					label: 'REPUTATION API KEY',
					type: 'password',
					required: true,
					description: 'API key for reputation service',
				},
			],
		},
	],
};

export default function MarketplacePage() {
	const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
	const [configuringPlugin, setConfiguringPlugin] = useState<Plugin | null>(null);
	// Add isLoading state
	const [isLoading, setIsLoading] = useState<boolean>(false); // Initialized to false as PLUGINS data is static

	const handleDeploy = (plugin: Plugin): void => {
		setSelectedPlugin(null);
		setConfiguringPlugin(plugin);
	};

	const handleConfigComplete = (): void => {
		setConfiguringPlugin(null);
		alert('Plugin deployed successfully! 🚀');
	};

	if (isLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<div className='text-center'>
					{/* This element creates a static square with a missing top border, not a spinning animation */}
					<div
						className='w-16 h-16 border-4 border-sendo-orange border-t-transparent mx-auto mb-4'
						style={{ borderRadius: 0 }}
					/>
					<p className='text-foreground/60 text-sm uppercase title-font'>LOADING MARKETPLACE...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background text-foreground pt-24 pb-12'>
			<div className='max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-20'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-center mb-12 md:mb-16'
				>
					<h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 title-font'>
						PLUGIN{' '}
						<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>
							MARKETPLACE
						</span>
					</h1>
					<p className='text-lg sm:text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto'>
						Expand your Worker with powerful integrations 🔌
					</p>
				</motion.div>

				{/* Sponsored Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className='mb-12 md:mb-16'
				>
					<div className='flex items-center gap-2 mb-6'>
						<Crown className='w-6 h-6 text-[#FFD700]' />
						<h2 className='text-2xl sm:text-3xl font-bold text-[#FFD700]'>SPONSORED</h2>
					</div>
					<p className='text-sm text-foreground/40 mb-6'>Premium visibility through auction</p>
					<div className='grid md:grid-cols-2 gap-6'>
						{PLUGINS.sponsored.map((plugin, index) => (
							<PluginCard
								key={plugin.id}
								plugin={plugin}
								isSponsored
								onDetails={() => setSelectedPlugin(plugin)}
								onDeploy={() => handleDeploy(plugin)}
								delay={index * 0.1}
							/>
						))}
					</div>
				</motion.div>

				{/* Liquidity Category */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='mb-12 md:mb-16'
				>
					<div className='flex items-center gap-3 mb-6'>
						<Flame className='w-7 h-7 text-sendo-orange' />
						<h2 className='text-2xl sm:text-3xl font-bold text-sendo-orange'>LIQUIDITY AND SWAP PROTOCOLS</h2>
					</div>
					<div className='grid md:grid-cols-3 gap-6'>
						{PLUGINS.liquidity.map((plugin, index) => (
							<PluginCard
								key={plugin.id}
								plugin={plugin}
								onDetails={() => setSelectedPlugin(plugin)}
								onDeploy={() => handleDeploy(plugin)}
								delay={index * 0.1}
							/>
						))}
					</div>
				</motion.div>

				{/* Trading Category */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='mb-12 md:mb-16'
				>
					<div className='flex items-center gap-3 mb-6'>
						<Zap className='w-7 h-7 text-sendo-orange' />
						<h2 className='text-2xl sm:text-3xl font-bold text-sendo-orange'>TRADING, YIELD AND LIQUID STAKING</h2>
					</div>
					<div className='grid md:grid-cols-3 gap-6'>
						{PLUGINS.trading.map((plugin, index) => (
							<PluginCard
								key={plugin.id}
								plugin={plugin}
								onDetails={() => setSelectedPlugin(plugin)}
								onDeploy={() => handleDeploy(plugin)}
								delay={index * 0.1}
							/>
						))}
					</div>
				</motion.div>

				{/* AI Category */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='mb-12 md:mb-16'
				>
					<div className='flex items-center gap-3 mb-6'>
						<Bot className='w-7 h-7 text-sendo-orange' />
						<h2 className='text-2xl sm:text-3xl font-bold text-sendo-orange'>AUTONOMOUS AI AGENTS (BUILT ON sEnDO)</h2>
					</div>
					<div className='grid md:grid-cols-2 gap-6'>
						{PLUGINS.ai.map((plugin, index) => (
							<PluginCard
								key={plugin.id}
								plugin={plugin}
								onDetails={() => setSelectedPlugin(plugin)}
								onDeploy={() => handleDeploy(plugin)}
								delay={index * 0.1}
							/>
						))}
					</div>
				</motion.div>

				{/* Community Category */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='mb-12 md:mb-16'
				>
					<div className='flex items-center gap-3 mb-6'>
						<Plug className='w-7 h-7 text-sendo-orange' />
						<h2 className='text-2xl sm:text-3xl font-bold text-sendo-orange'>COMMUNITY AND EXTERNAL PLUGINS</h2>
					</div>
					<div className='grid md:grid-cols-3 gap-6'>
						{PLUGINS.community.map((plugin, index) => (
							<PluginCard
								key={plugin.id}
								plugin={plugin}
								onDetails={() => setSelectedPlugin(plugin)}
								onDeploy={() => handleDeploy(plugin)}
								delay={index * 0.1}
							/>
						))}
					</div>
				</motion.div>

				{/* Submit Plugin CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='bg-gradient-to-r from-sendo-orange/10 to-sendo-red/10 border border-sendo-orange/30 p-12 text-center'
					style={{ borderRadius: 0 }}
				>
					<h3 className='text-2xl md:text-3xl font-bold text-foreground mb-4 title-font'>WANT TO LIST YOUR PLUGIN?</h3>
					<p className='text-foreground/60 text-lg mb-8'>
						Join the marketplace and reach thousands of crypto enthusiasts
					</p>
					<button
						type='button'
						className='bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg hover:shadow-sendo-red/50 text-white px-8 py-4 text-lg font-bold transition-all uppercase cursor-pointer'
						style={{
							clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
							borderRadius: 0,
						}}
					>
						Submit Your Plugin
					</button>
				</motion.div>
			</div>

			{/* Modals */}
			{selectedPlugin && (
				<PluginDetailModal
					plugin={selectedPlugin}
					onClose={() => setSelectedPlugin(null)}
					onDeploy={() => handleDeploy(selectedPlugin)}
				/>
			)}

			{configuringPlugin && (
				<ConfigurePluginModal
					plugin={configuringPlugin}
					onClose={() => setConfiguringPlugin(null)}
					onComplete={handleConfigComplete}
				/>
			)}
		</div>
	);
}
