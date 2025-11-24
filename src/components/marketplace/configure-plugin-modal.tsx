import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Eye, EyeOff, X } from 'lucide-react';
import type React from 'react';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Plugin } from '@/types/plugins';

interface ConfigurePluginModalProps {
	plugin: Plugin;
	onClose: () => void;
	onComplete: () => void;
}

export default function ConfigurePluginModal({ plugin, onClose, onComplete }: ConfigurePluginModalProps) {
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

	const isOAuth = plugin.authType === 'oauth';

	const handleOAuthConnect = () => {
		// Mock OAuth flow
		console.log('Opening OAuth window for:', plugin.name);
		setTimeout(() => {
			onComplete();
		}, 1500);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Deploying plugin with config:', formData);
		onComplete();
	};

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
					className='bg-background border-2 border-sendo-orange/30 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col'
					style={{ borderRadius: 0 }}
				>
					{/* Header */}
					<div className='border-b border-foreground/10 p-6'>
						<div className='flex items-start gap-4'>
							<div
								className='w-16 h-16 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center text-4xl flex-shrink-0'
								style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
							>
								{plugin.icon}
							</div>
							<div className='flex-1'>
								<h2 className='text-2xl font-bold mb-2 uppercase title-font'>
									CONFIGURE <span className='text-sendo-orange'>{plugin.name}</span>
								</h2>
								<p className='text-foreground/60 text-sm'>
									{isOAuth
										? 'Connect your account to deploy this plugin'
										: 'Fill in the required parameters to deploy this plugin'}
								</p>
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
					</div>

					{/* Content */}
					<div className='flex-1 overflow-y-auto p-6'>
						{isOAuth ? (
							<div className='text-center py-12'>
								<div
									className='w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center text-5xl'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}
								>
									{plugin.icon}
								</div>
								<h3 className='text-xl font-bold text-foreground mb-3 uppercase title-font'>
									CONNECT TO {plugin.name.toUpperCase()}
								</h3>
								<p className='text-foreground/60 mb-8 max-w-md mx-auto'>
									You'll be redirected to {plugin.name} to authorize sEnDO to access your account.
								</p>
								<div className='space-y-4 max-w-sm mx-auto'>
									<div className='flex items-start gap-3 text-left'>
										<CheckCircle className='w-5 h-5 text-sendo-green flex-shrink-0 mt-0.5' />
										<p className='text-sm text-foreground/70'>Secure OAuth 2.0 authentication</p>
									</div>
									<div className='flex items-start gap-3 text-left'>
										<CheckCircle className='w-5 h-5 text-sendo-green flex-shrink-0 mt-0.5' />
										<p className='text-sm text-foreground/70'>sEnDO never stores your credentials</p>
									</div>
									<div className='flex items-start gap-3 text-left'>
										<CheckCircle className='w-5 h-5 text-sendo-green flex-shrink-0 mt-0.5' />
										<p className='text-sm text-foreground/70'>Revoke access anytime</p>
									</div>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmit} className='space-y-6'>
								{plugin.configFields?.map((field) => (
									<div key={field.name}>
										<label htmlFor={field.name} className='block mb-2'>
											<span className='text-foreground font-bold text-sm uppercase'>
												{field.label} {field.required && <span className='text-sendo-red'>*</span>}
											</span>
											{field.description && (
												<span className='block text-foreground/60 text-xs mt-1'>{field.description}</span>
											)}
										</label>

										<div className='relative'>
											<Input
												type={field.type === 'password' && !showPassword[field.name] ? 'password' : field.type}
												placeholder={field.default ? `Default: ${field.default}` : `Enter ${field.label.toLowerCase()}`}
												value={formData[field.name] || ''}
												onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
												required={field.required}
												className='bg-foreground/5 border-foreground/20 text-foreground h-10 md:h-12'
												style={{ borderRadius: 0 }}
											/>

											{field.type === 'password' && (
												<button
													type='button'
													onClick={() => setShowPassword({ ...showPassword, [field.name]: !showPassword[field.name] })}
													className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70'
												>
													{showPassword[field.name] ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
												</button>
											)}
										</div>
									</div>
								))}

								{(!plugin.configFields || plugin.configFields.length === 0) && (
									<div className='text-center py-8'>
										<p className='text-foreground/60'>No configuration required. Ready to deploy!</p>
									</div>
								)}
							</form>
						)}
					</div>

					{/* Footer */}
					<div className='border-t border-foreground/10 p-6'>
						<div className='grid grid-cols-2 gap-4'>
							<Button
								onClick={onClose}
								className='bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground h-10 md:h-12 uppercase'
								style={{ borderRadius: 0 }}
							>
								Cancel
							</Button>
							<Button
								onClick={
									isOAuth
										? handleOAuthConnect
										: (event: React.MouseEvent<HTMLButtonElement>) =>
												handleSubmit(event as unknown as FormEvent<HTMLFormElement>)
								}
								type={isOAuth ? 'button' : 'submit'}
								className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-10 md:h-12 uppercase'
								style={{
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
									borderRadius: 0,
								}}
							>
								<CheckCircle className='w-4 h-4 md:w-5 md:h-5 mr-2' />
								{isOAuth ? 'Connect & Deploy' : 'Deploy Plugin'}
							</Button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
