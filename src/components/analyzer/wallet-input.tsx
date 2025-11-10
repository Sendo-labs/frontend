'use client';

import React from 'react';
import { Search, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrivy, useWallets } from '@privy-io/react-auth';

interface WalletInputProps {
	onAnalyze: (walletAddress: string) => void;
	isAnalyzing: boolean;
}

export default function WalletInput({ onAnalyze, isAnalyzing }: WalletInputProps) {
	const { ready, authenticated, login, user } = usePrivy();
	const { wallets } = useWallets();

	// Get wallet address - try embedded wallet first, then connected wallets
	const embeddedWallet = user?.wallet?.address;
	const connectedWallet = wallets.find((w) => w.address);
	const walletAddress = embeddedWallet || connectedWallet?.address;

	// Debug logging
	React.useEffect(() => {
		console.log('[WalletInput] Auth state:', {
			authenticated,
			ready,
			walletsCount: wallets.length,
			embeddedWallet,
			connectedWallet: connectedWallet?.address,
		});
	}, [authenticated, ready, wallets.length, embeddedWallet, connectedWallet]);

	// Show login button if user is not authenticated
	if (!authenticated) {
		return (
			<div className='max-w-3xl mx-auto'>
				<div
					className='bg-foreground/5 border border-foreground/10 p-8 md:p-12 text-center'
					style={{ borderRadius: 0 }}
				>
					<Wallet className='w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-sendo-orange' />
					<h3 className='text-xl md:text-2xl font-bold mb-2 title-font'>CONNECT YOUR WALLET</h3>
					<p className='text-sm md:text-base text-foreground/60 mb-6 max-w-md mx-auto'>
						Connect your Solana wallet to analyze your trading performance and see how much you missed by not selling at
						ATH
					</p>
					<Button
						onClick={login}
						disabled={!ready}
						className='h-12 md:h-14 px-8 md:px-12 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red text-white text-base md:text-lg font-bold'
						style={{
							clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
							borderRadius: 0,
						}}
					>
						<Wallet className='w-5 h-5 md:w-6 md:h-6 mr-2' />
						CONNECT WALLET
					</Button>
				</div>
			</div>
		);
	}

	// Show connected wallet with analyze button
	return (
		<div className='max-w-3xl mx-auto'>
			<div className='bg-foreground/5 border border-foreground/10 p-4 md:p-6' style={{ borderRadius: 0 }}>
				<div className='mb-4'>
					<p className='text-xs text-foreground/60 mb-2'>CONNECTED WALLET</p>
					<div
						className='font-mono text-sm md:text-base text-foreground bg-background p-3 border border-foreground/10'
						style={{ borderRadius: 0 }}
					>
						{walletAddress ? walletAddress : <span className='text-foreground/40'>No Solana wallet connected</span>}
					</div>
				</div>
				<Button
					onClick={() => walletAddress && onAnalyze(walletAddress)}
					disabled={isAnalyzing || !walletAddress}
					className='w-full h-10 md:h-12 px-6 md:px-8 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red text-white'
					style={{
						clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
						borderRadius: 0,
					}}
				>
					{isAnalyzing ? (
						<>
							<div
								className='w-4 h-4 md:w-5 md:h-5 mr-2 border-2 border-white border-t-transparent animate-spin'
								style={{ borderRadius: '50%' }}
							/>
							ANALYZING YOUR WALLET
						</>
					) : (
						<>
							<Search className='w-4 h-4 md:w-5 md:h-5 mr-2' />
							ANALYZE MY WALLET
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
