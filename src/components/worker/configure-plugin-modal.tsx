'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

interface ConfigurePluginModalProps {
	plugin: Plugin;
	onClose: () => void;
	onComplete: () => void;
}

export default function ConfigurePluginModal({ plugin, onClose, onComplete }: ConfigurePluginModalProps) {
	const [formData, setFormData] = useState<Record<string, string | number>>(() => {
		const initial: Record<string, string | number> = {};
		if (plugin.configFields) {
			plugin.configFields.forEach((field) => {
				initial[field.name] = field.default || '';
			});
		}
		return initial;
	});
	const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Mock API call
		setTimeout(() => {
			console.log('Deploying plugin:', plugin.id, formData);
			setIsSubmitting(false);
			onComplete();
		}, 1500);
	};

	const togglePasswordVisibility = (fieldName: string) => {
		setShowPasswords((prev) => ({
			...prev,
			[fieldName]: !prev[fieldName],
		}));
	};

	// OAuth flow
	if (plugin.authType === 'oauth') {
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
						className='bg-[#0D0D0D] border-2 border-sendo-orange/30 max-w-2xl w-full'
						style={{ borderRadius: 0 }}
					>
						<div className='border-b border-foreground/10 p-6'>
							<div className='flex items-start justify-between'>
								<div className='flex items-center gap-4'>
									<div
										className='w-16 h-16 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center text-3xl'
										style={{
											clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
										}}
									>
										{plugin.icon}
									</div>
									<div>
										<h2 className='text-2xl font-bold text-foreground mb-1 title-font'>
											CONFIGURE <span className='text-sendo-orange'>{plugin.name.toUpperCase()}</span>
										</h2>
										<p className='text-sm text-foreground/60'>OAuth authentication required</p>
									</div>
								</div>
								<button
									type='button'
									onClick={onClose}
									className='w-10 h-10 bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center'
									style={{ borderRadius: 0 }}
								>
									<X className='w-6 h-6 text-foreground/60' />
								</button>
							</div>
						</div>

						<div className='p-8 text-center'>
							<p className='text-lg text-foreground mb-8'>
								You'll be redirected to {plugin.name} to authorize the connection.
							</p>

							<div className='bg-foreground/5 border border-foreground/10 p-6 mb-8' style={{ borderRadius: 0 }}>
								<h3 className='text-sm font-bold text-foreground mb-4 uppercase title-font'>What we'll access:</h3>
								<ul className='space-y-2 text-left'>
									<li className='flex items-center gap-2 text-foreground/70 text-sm'>
										<Check className='w-4 h-4 text-sendo-green' />
										Read wallet balances
									</li>
									<li className='flex items-center gap-2 text-foreground/70 text-sm'>
										<Check className='w-4 h-4 text-sendo-green' />
										Execute trades on your behalf
									</li>
									<li className='flex items-center gap-2 text-foreground/70 text-sm'>
										<Check className='w-4 h-4 text-sendo-green' />
										View transaction history
									</li>
								</ul>
							</div>

						<div className='flex gap-3'>
							<Button
								onClick={onClose}
								variant='outline'
								className='flex-1 h-10 md:h-12 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground'
								style={{ borderRadius: 0 }}
							>
								CANCEL
							</Button>
							<Button
								onClick={onComplete}
								className='flex-1 h-10 md:h-12 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white'
								style={{
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
									borderRadius: 0,
									fontFamily: 'TECHNOS, sans-serif',
								}}
							>
								AUTHORIZE CONNECTION
							</Button>
						</div>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		);
	}

	// API Key flow
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
					className='bg-[#0D0D0D] border-2 border-sendo-orange/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto'
					style={{ borderRadius: 0 }}
				>
					<div className='border-b border-foreground/10 p-6'>
						<div className='flex items-start justify-between'>
							<div className='flex items-center gap-4'>
								<div
									className='w-16 h-16 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center text-3xl'
									style={{
										clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
									}}
								>
									{plugin.icon}
								</div>
								<div>
									<h2 className='text-2xl font-bold text-foreground mb-1 title-font'>
										CONFIGURE <span className='text-sendo-orange'>{plugin.name.toUpperCase()}</span>
									</h2>
									<p className='text-sm text-foreground/60'>Fill in the required parameters to deploy this plugin</p>
								</div>
							</div>
							<button
								type='button'
								onClick={onClose}
								className='w-10 h-10 bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center'
								style={{ borderRadius: 0 }}
							>
								<X className='w-6 h-6 text-foreground/60' />
							</button>
						</div>
					</div>

					<form onSubmit={handleSubmit} className='p-8'>
						<div className='space-y-6'>
							{plugin.configFields?.map((field) => (
								<div key={field.name}>
									<label
										htmlFor={field.name}
										className='block text-sm font-bold text-foreground mb-2 uppercase title-font'
									>
										{field.label} {field.required && <span className='text-sendo-red'>*</span>}
									</label>
									{field.description && <p className='text-xs text-foreground/60 mb-3'>{field.description}</p>}
									<div className='relative'>
									<Input
										type={
											field.type === 'password' && !showPasswords[field.name]
												? 'password'
												: field.type === 'password'
													? 'text'
													: field.type
										}
										value={formData[field.name]}
										onChange={(e) =>
											setFormData({
												...formData,
												[field.name]: e.target.value,
											})
										}
										placeholder={`Enter ${field.label.toLowerCase()}`}
										required={field.required}
										className='h-10 md:h-12 bg-foreground/5 border-foreground/20 text-foreground'
										style={{ borderRadius: 0 }}
									/>
										{field.type === 'password' && (
											<button
												type='button'
												onClick={() => togglePasswordVisibility(field.name)}
												className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground'
											>
												{showPasswords[field.name] ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
											</button>
										)}
									</div>
								</div>
							))}
						</div>

					<div className='mt-8 flex gap-3'>
						<Button
							type='button'
							onClick={onClose}
							variant='outline'
							className='flex-1 h-10 md:h-12 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground'
							style={{ borderRadius: 0 }}
						>
							CANCEL
						</Button>
						<Button
							type='submit'
							disabled={isSubmitting}
							className='flex-1 h-10 md:h-12 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white'
							style={{
								clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
								borderRadius: 0,
								fontFamily: 'TECHNOS, sans-serif',
							}}
						>
							{isSubmitting ? (
								<div className='flex items-center gap-2'>
									<div className='w-4 h-4 border-2 border-white border-t-transparent' style={{ borderRadius: 0 }} />
									DEPLOYING...
								</div>
							) : (
								<>
									<Check className='w-4 h-4 md:w-5 md:h-5 mr-2' />
									DEPLOY PLUGIN
								</>
							)}
						</Button>
					</div>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
