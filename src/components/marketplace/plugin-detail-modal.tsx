import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Star, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Plugin {
	name: string;
	icon: string;
	longDescription: string;
	rating?: number;
	reviews?: number;
	price: string;
	tags: string[];
	features: string[];
	category: string;
	authType: string;
}

interface PluginDetailModalProps {
	plugin: Plugin;
	onClose: () => void;
	onDeploy: () => void;
}

export default function PluginDetailModal({ plugin, onClose, onDeploy }: PluginDetailModalProps) {
	const [activeTab, setActiveTab] = useState('overview');

	const tabs = ['OVERVIEW', 'INFO', 'REVIEWS', 'SCREENSHOTS'];

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'
				onClick={onClose}
			>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					onClick={(e) => e.stopPropagation()}
					className='bg-background border-2 border-sendo-orange/30 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col'
					style={{ borderRadius: 0 }}
				>
					{/* Header */}
					<div className='border-b border-foreground/10 p-6'>
						<div className='flex items-start gap-4 mb-6'>
							<div
								className='w-16 h-16 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center text-4xl flex-shrink-0'
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
							>
								{plugin.icon}
							</div>
							<div className='flex-1'>
								<h2 className='text-2xl md:text-3xl font-bold text-foreground mb-2 uppercase title-font'>
									{plugin.name}
								</h2>
								<p className='text-foreground/70 mb-3'>{plugin.longDescription}</p>
								<div className='flex flex-wrap items-center gap-4'>
									{plugin.rating && (
										<div className='flex items-center gap-2'>
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`w-4 h-4 ${
														star <= Math.floor(plugin.rating!) ? 'text-[#FFD700] fill-[#FFD700]' : 'text-foreground/20'
													}`}
												/>
											))}
											<span className='text-sm text-foreground/60'>
												{plugin.rating} ({plugin.reviews} reviews)
											</span>
										</div>
									)}
									<span
										className={`text-lg font-bold ${plugin.price === 'FREE' ? 'text-sendo-green' : 'text-sendo-orange'}`}
									>
										{plugin.price}
									</span>
								</div>
								<div className='flex flex-wrap gap-2 mt-3'>
									{plugin.tags.map((tag, index) => (
										<span
											key={index}
											className='px-2 py-1 bg-foreground/10 text-foreground/60 text-xs'
											style={{ borderRadius: 0 }}
										>
											{tag}
										</span>
									))}
								</div>
							</div>
							<button
								type='button'
								onClick={onClose}
								className='w-10 h-10 bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center flex-shrink-0'
								style={{ borderRadius: 0 }}
							>
								<X className='w-6 h-6 text-foreground/60' />
							</button>
						</div>

						<Button
							onClick={onDeploy}
							className='w-full bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-12 text-lg font-bold uppercase'
							style={{
								clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
								borderRadius: 0,
							}}
						>
							Deploy Plugin
						</Button>
					</div>

					{/* Tabs */}
					<div className='border-b border-foreground/10 px-6'>
						<div className='flex gap-6'>
							{tabs.map((tab) => (
								<button
									type='button'
									key={tab}
									onClick={() => setActiveTab(tab.toLowerCase())}
									className={`py-4 text-sm font-bold border-b-2 transition-colors uppercase ${
										activeTab === tab.toLowerCase()
											? 'border-sendo-orange text-sendo-orange'
											: 'border-transparent text-foreground/40 hover:text-foreground/70'
									}`}
								>
									{tab}
								</button>
							))}
						</div>
					</div>

					{/* Content */}
					<div className='flex-1 overflow-y-auto p-6'>
						{activeTab === 'overview' && (
							<div className='space-y-6'>
								<div>
									<h3 className='text-xl font-bold text-foreground mb-4 uppercase title-font'>About This Plugin</h3>
									<p className='text-foreground/70 leading-relaxed'>{plugin.longDescription}</p>
								</div>

								<div>
									<h3 className='text-xl font-bold text-foreground mb-4 uppercase title-font'>Key Features</h3>
									<div className='space-y-3'>
										{plugin.features.map((feature, index) => (
											<div key={index} className='flex items-start gap-3'>
												<CheckCircle className='w-5 h-5 text-sendo-green flex-shrink-0 mt-0.5' />
												<p className='text-foreground/70'>{feature}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{activeTab === 'info' && (
							<div className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='bg-foreground/5 p-4' style={{ borderRadius: 0 }}>
										<p className='text-foreground/40 text-xs mb-2 uppercase'>Category</p>
										<p className='text-foreground font-semibold capitalize'>{plugin.category}</p>
									</div>
									<div className='bg-foreground/5 p-4' style={{ borderRadius: 0 }}>
										<p className='text-foreground/40 text-xs mb-2 uppercase'>Auth Type</p>
										<p className='text-foreground font-semibold uppercase'>{plugin.authType.replace('_', ' ')}</p>
									</div>
									<div className='bg-foreground/5 p-4' style={{ borderRadius: 0 }}>
										<p className='text-foreground/40 text-xs mb-2 uppercase'>Price</p>
										<p className='text-foreground font-semibold'>{plugin.price}</p>
									</div>
									<div className='bg-foreground/5 p-4' style={{ borderRadius: 0 }}>
										<p className='text-foreground/40 text-xs mb-2 uppercase'>Users</p>
										<p className='text-foreground font-semibold'>{plugin.reviews || 0}</p>
									</div>
								</div>
							</div>
						)}

						{activeTab === 'reviews' && (
							<div className='text-center py-12'>
								<p className='text-foreground/40'>Reviews coming soon...</p>
							</div>
						)}

						{activeTab === 'screenshots' && (
							<div className='text-center py-12'>
								<p className='text-foreground/40'>Screenshots coming soon...</p>
							</div>
						)}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
