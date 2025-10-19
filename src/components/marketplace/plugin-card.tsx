import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Plugin {
	name: string;
	icon: string;
	price: string;
	rating?: number;
	reviews?: number;
	tags: string[];
	description: string;
}

interface PluginCardProps {
	plugin: Plugin;
	isSponsored?: boolean;
	onDetails: () => void;
	onDeploy: () => void;
	delay?: number;
}

export default function PluginCard({ plugin, isSponsored = false, onDetails, onDeploy, delay = 0 }: PluginCardProps) {
	const isPaid = plugin.price !== 'FREE';

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ delay, duration: 0.6 }}
			className={`relative overflow-hidden bg-foreground/5 border hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group ${
				isSponsored ? 'border-[#FFD700]/50' : 'border-foreground/10'
			}`}
			style={{ borderRadius: 0 }}
		>
			{isSponsored && (
				<div
					className='absolute top-3 right-3 bg-[#FFD700] text-black px-2 py-1 text-[10px] font-bold flex items-center gap-1 uppercase'
					style={{ borderRadius: 0 }}
				>
					<TrendingUp className='w-3 h-3' />
					Bid
				</div>
			)}

			<div className='p-6'>
				{/* Header */}
				<div className='flex items-start gap-4 mb-4'>
					<div
						className='w-14 h-14 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center text-3xl flex-shrink-0'
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
					>
						{plugin.icon}
					</div>
					<div className='flex-1 min-w-0'>
						<h3 className='text-lg font-bold text-foreground mb-1 truncate'>{plugin.name}</h3>
						<div className='flex items-center gap-2'>
							<span className={`text-sm font-bold ${isPaid ? 'text-sendo-orange' : 'text-sendo-green'}`}>
								{plugin.price}
							</span>
							{plugin.rating && (
								<div className='flex items-center gap-1'>
									<Star className='w-3 h-3 text-[#FFD700] fill-[#FFD700]' />
									<span className='text-xs text-foreground/60'>
										{plugin.rating} ({plugin.reviews})
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Current Bid (Sponsored only) */}
				{isSponsored && (
					<div className='mb-3 p-2 bg-background/50 border border-foreground/5' style={{ borderRadius: 0 }}>
						<div className='flex items-center justify-between text-xs'>
							<span className='text-foreground/40 uppercase'>Current Bid</span>
							<span className='text-sendo-green font-bold'>{plugin.price === 'FREE' ? '15.5 SOL' : plugin.price}</span>
						</div>
					</div>
				)}

				{/* Tags */}
				<div className='flex flex-wrap gap-2 mb-4'>
					{plugin.tags.slice(0, 3).map((tag, index) => (
						<span
							key={index}
							className='px-2 py-1 bg-foreground/10 text-foreground/60 text-[10px]'
							style={{ borderRadius: 0 }}
						>
							{tag}
						</span>
					))}
				</div>

				{/* Description */}
				<p className='text-sm text-foreground/70 mb-6 line-clamp-3'>{plugin.description}</p>

				{/* Actions */}
				<div className='grid grid-cols-2 gap-3'>
					<Button
						onClick={onDetails}
						className='bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-foreground/30 text-foreground h-10 uppercase'
						style={{ borderRadius: 0 }}
					>
						Details
					</Button>
					<Button
						onClick={onDeploy}
						className='bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-10 uppercase'
						style={{
							clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
							borderRadius: 0,
						}}
					>
						Deploy
					</Button>
				</div>

				{/* Outbid button (Sponsored only) */}
				{isSponsored && (
					<Button
						className='w-full mt-3 bg-[#FFD700] hover:bg-[#FFC700] text-black h-9 text-xs font-bold uppercase'
						style={{ borderRadius: 0 }}
					>
						Outbid
					</Button>
				)}
			</div>
		</motion.div>
	);
}
