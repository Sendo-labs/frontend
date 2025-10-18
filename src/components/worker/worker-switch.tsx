'use client';

import * as React from 'react';

interface WorkerSwitchProps {
	checked: boolean;
	onCheckedChange?: (checked: boolean) => void;
	className?: string;
}

const WorkerSwitch = React.forwardRef<HTMLButtonElement, WorkerSwitchProps>(
	({ className = '', checked, onCheckedChange, ...props }, ref) => {
		return (
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				onClick={() => onCheckedChange?.(!checked)}
				className={`relative inline-flex h-6 w-11 items-center transition-colors ${
					checked
						? 'bg-gradient-to-r from-[#FF6B00] to-[#FF223B]'
						: 'bg-foreground/20'
				} ${className}`}
				style={{ borderRadius: 0 }}
				ref={ref}
				{...props}
			>
				<span
					className={`block h-5 w-5 bg-white shadow-lg transition-transform ${
						checked ? 'translate-x-5' : 'translate-x-0'
					}`}
					style={{ borderRadius: 0 }}
				/>
			</button>
		);
	},
);
WorkerSwitch.displayName = 'WorkerSwitch';

export { WorkerSwitch };
