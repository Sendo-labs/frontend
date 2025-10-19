'use client';

import { useState } from 'react';
import { CheckCircle, ChevronDown, Loader2, Settings, XCircle } from 'lucide-react';

type ToolState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error';

interface ToolPart {
	type: string;
	state: ToolState;
	input?: Record<string, unknown>;
	output?: string | Record<string, unknown>;
	toolCallId?: string;
	errorText?: string | null;
}

interface ToolProps {
	toolPart: ToolPart;
	defaultOpen?: boolean;
	className?: string;
}

export function Tool({ toolPart, defaultOpen = false, className = '' }: ToolProps) {
	const { state, input, output, toolCallId, errorText } = toolPart;

	// Keep actions collapsed by default
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const getStateIcon = () => {
		switch (state) {
			case 'input-streaming':
				return <Loader2 className="h-4 w-4 animate-spin text-sendo-green" />;
			case 'input-available':
				return <Settings className="h-4 w-4 text-sendo-orange" />;
			case 'output-available':
				return <CheckCircle className="h-4 w-4 text-sendo-green" />;
			case 'output-error':
				return <XCircle className="h-4 w-4 text-red-500" />;
			default:
				return <Settings className="h-4 w-4 text-white/40" />;
		}
	};

	const getStateBadge = () => {
		const baseClasses = 'px-2 py-1 text-xs font-medium';
		switch (state) {
			case 'input-streaming':
				return <span className={`${baseClasses} bg-sendo-green/10 text-sendo-green`}>Processing</span>;
			case 'input-available':
				return <span className={`${baseClasses} bg-sendo-orange/10 text-sendo-orange`}>Ready</span>;
			case 'output-available':
				return <span className={`${baseClasses} bg-sendo-green/10 text-sendo-green`}>Completed</span>;
			case 'output-error':
				return <span className={`${baseClasses} bg-red-500/10 text-red-500`}>Error</span>;
			default:
				return <span className={`${baseClasses} bg-white/5 text-white/40`}>Pending</span>;
		}
	};

	const formatValue = (value: unknown): string => {
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		if (typeof value === 'string') return value;
		if (typeof value === 'object') {
			return JSON.stringify(value, null, 2);
		}
		return String(value);
	};

	return (
		<div className={`mt-3 overflow-hidden border border-white/10 bg-black/30 ${className}`}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between px-3 py-2 bg-black/50 hover:bg-black/60 transition-colors"
			>
				<div className="flex items-center gap-2">
					{getStateIcon()}
					<span className="font-mono text-sm font-medium text-white">{toolPart.type}</span>
					{getStateBadge()}
				</div>
				<ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>

			{isOpen && (
				<div className="border-t border-white/10 bg-black/20 space-y-3 p-3">
					{input && Object.keys(input).length > 0 && (
						<div>
							<h4 className="mb-2 text-sm font-medium text-white/60">Input</h4>
							<div className="bg-black/50 border border-white/10 p-2 font-mono text-sm text-white/80">
								{Object.entries(input).map(([key, value]) => (
									<div key={key} className="mb-1">
										<span className="text-white/60">{key}:</span> <span>{formatValue(value)}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{output && (
						<div>
							<h4 className="mb-2 text-sm font-medium text-white/60">Output</h4>
							<div className="bg-black/50 border border-white/10 max-h-60 overflow-auto p-2 font-mono text-sm text-white/80">
								<pre className="whitespace-pre-wrap">{formatValue(output)}</pre>
							</div>
						</div>
					)}

					{state === 'output-error' && errorText && (
						<div>
							<h4 className="mb-2 text-sm font-medium text-red-500">Error</h4>
							<div className="bg-red-500/10 border border-red-500/30 p-2 text-sm text-red-400">{errorText}</div>
						</div>
					)}

					{state === 'input-streaming' && <div className="text-sm text-white/60">Processing tool call...</div>}

					{toolCallId && (
						<div className="border-t border-white/10 pt-2 text-xs text-white/40">
							<span className="font-mono">Call ID: {toolCallId}</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
