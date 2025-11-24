'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export type InfoModalVariant = 'info' | 'warning' | 'success' | 'alert';

export interface InfoModalAction {
	label: string;
	onClick: () => void;
	variant?: 'default' | 'outline' | 'destructive' | 'ghost';
	disabled?: boolean;
}

export interface InfoModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	variant?: InfoModalVariant;
	icon?: ReactNode;
	actions?: InfoModalAction[];
	children?: ReactNode;
	showCloseButton?: boolean;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	closable?: boolean;
}

const variantConfig: Record<
	InfoModalVariant,
	{
		icon: typeof Info;
		iconColor: string;
		borderColor: string;
		gradientFrom: string;
		gradientTo: string;
	}
> = {
	info: {
		icon: Info,
		iconColor: 'text-blue-500',
		borderColor: 'border-blue-500/30',
		gradientFrom: 'from-blue-500/10',
		gradientTo: 'to-blue-600/10',
	},
	warning: {
		icon: AlertTriangle,
		iconColor: 'text-sendo-orange',
		borderColor: 'border-sendo-orange/30',
		gradientFrom: 'from-sendo-orange/10',
		gradientTo: 'to-sendo-red/10',
	},
	success: {
		icon: CheckCircle,
		iconColor: 'text-green-500',
		borderColor: 'border-green-500/30',
		gradientFrom: 'from-green-500/10',
		gradientTo: 'to-green-600/10',
	},
	alert: {
		icon: AlertCircle,
		iconColor: 'text-red-500',
		borderColor: 'border-red-500/30',
		gradientFrom: 'from-red-500/10',
		gradientTo: 'to-red-600/10',
	},
};

const sizeConfig: Record<string, string> = {
	sm: 'max-w-md',
	md: 'max-w-lg',
	lg: 'max-w-2xl',
	xl: 'max-w-4xl',
};

export function InfoModal({
	open,
	onClose,
	title,
	description,
	variant = 'info',
	icon,
	actions = [],
	children,
	showCloseButton = true,
	size = 'md',
	closable = true,
}: InfoModalProps) {
	const config = variantConfig[variant];
	const IconComponent = config.icon;

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (closable && e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleClose = () => {
		if (closable) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{open && (
				<div
					className='fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4'
					onClick={handleOverlayClick}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className={`bg-background border ${config.borderColor} ${sizeConfig[size]} w-full relative`}
						style={{
							borderRadius: 0,
							clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div
							className={`bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} border-b ${config.borderColor} p-6 flex items-start justify-between gap-4`}
						>
							<div className='flex items-start gap-4 flex-1 min-w-0'>
								{/* Icon */}
								<div className='flex-shrink-0 mt-1'>
									{icon || (
										<div
											className={`w-12 h-12 ${config.iconColor} flex items-center justify-center bg-background/50 border ${config.borderColor}`}
											style={{ borderRadius: 0 }}
										>
											<IconComponent className='w-6 h-6' />
										</div>
									)}
								</div>

								{/* Title and Description */}
								<div className='flex-1 min-w-0'>
									<h2 className='text-2xl md:text-3xl font-bold text-foreground title-font mb-2 break-words'>
										{title}
									</h2>
									{description && (
										<p className='text-sm md:text-base text-foreground/60 leading-relaxed break-words'>{description}</p>
									)}
								</div>
							</div>

							{/* Close Button */}
							{showCloseButton && closable && (
								<button
									type='button'
									onClick={handleClose}
									className='flex-shrink-0 w-8 h-8 border border-foreground/20 hover:border-sendo-orange/50 hover:bg-foreground/5 text-foreground/60 hover:text-foreground flex items-center justify-center transition-all'
									style={{ borderRadius: 0 }}
									aria-label='Close modal'
								>
									<X className='w-5 h-5' />
								</button>
							)}
						</div>

						{/* Content */}
						{children && (
							<div className='p-6 text-foreground/80 leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar'>
								{children}
							</div>
						)}

						{/* Actions Footer */}
						{actions.length > 0 && (
							<div className='p-6 border-t border-foreground/10 flex flex-col sm:flex-row gap-3 justify-end'>
								{actions.map((action, index) => (
									<Button
										key={index}
										onClick={action.onClick}
										disabled={action.disabled}
										variant={action.variant || 'default'}
										className='min-w-[120px] h-11 uppercase font-bold'
										style={{ borderRadius: 0 }}
									>
										{action.label}
									</Button>
								))}
							</div>
						)}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
