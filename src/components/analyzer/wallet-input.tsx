'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WalletInputProps {
	wallet: string;
	setWallet: (wallet: string) => void;
	onAnalyze: () => void;
	isAnalyzing: boolean;
}

export default function WalletInput({ wallet, setWallet, onAnalyze, isAnalyzing }: WalletInputProps) {
	return (
		<div className='max-w-3xl mx-auto'>
			<div className='bg-foreground/5 border border-foreground/10 p-6 md:p-8' style={{ borderRadius: 0 }}>
				<div className='flex flex-col sm:flex-row gap-3'>
					<Input
						type='text'
						placeholder='Enter your Solana wallet address...'
						value={wallet}
						onChange={(e) => setWallet(e.target.value)}
						className='h-14 text-base bg-background border-foreground/20 text-foreground placeholder:text-foreground/40 focus:border-sendo-orange transition-all flex-1'
						style={{ borderRadius: 0 }}
						disabled={isAnalyzing}
					/>
					<Button
						onClick={onAnalyze}
						disabled={isAnalyzing || !wallet.trim()}
						className='h-14 px-8 text-base font-bold bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white transition-all title-font'
						style={{
							clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
							borderRadius: 0,
						}}
					>
						{isAnalyzing ? (
							<>
								<div className='w-5 h-5 mr-2 border-2 border-white border-t-transparent' style={{ borderRadius: 0 }} />
								ANALYZING
							</>
						) : (
							<>
								<Search className='w-5 h-5 mr-2' />
								SCAN WALLET
							</>
						)}
					</Button>
				</div>
				<p className='text-xs text-foreground/40 mt-3'>Example: 9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y</p>
			</div>
		</div>
	);
}
