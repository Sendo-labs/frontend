'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Search, Wallet } from 'lucide-react';
import React from 'react';

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
					className='bg-black/40 border border-white/10 p-8 md:p-12 text-center backdrop-blur-sm'
					style={{ borderRadius: 0 }}
				>
					<Wallet className='w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-sendo-red' />
					<h3 className='text-xl md:text-2xl font-bold mb-2 title-font text-white'>CONNECT YOUR WALLET</h3>
					<p className='text-sm md:text-base text-foreground/60 mb-6 max-w-md mx-auto'>
						Connect your Solana wallet to analyze your trading performance and see how much you missed by not selling at
						ATH
					</p>
					<button
						type='button'
						onClick={login}
						disabled={!ready}
						className='arc-raiders-pill-button text-base md:text-lg'
						style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
					>
						<Wallet className='w-5 h-5 md:w-6 md:h-6 mr-2' />
						<span>CONNECT WALLET</span>
					</button>
				</div>
			</div>
		);
	}

	// Show connected wallet with analyze button
	return (
		<div className='max-w-3xl mx-auto'>
			<div className='bg-black/40 border border-white/10 p-4 md:p-6 backdrop-blur-sm' style={{ borderRadius: 0 }}>
				<div className='mb-4'>
					<p className='text-xs text-foreground/60 mb-2 uppercase tracking-wider'>Connected Wallet</p>
					<div
						className='font-mono text-sm md:text-base text-foreground bg-black/60 p-3 border border-white/10'
						style={{ borderRadius: 0 }}
					>
						{walletAddress ? walletAddress : <span className='text-foreground/40'>No Solana wallet connected</span>}
					</div>
				</div>
				<button
					type='button'
					onClick={() => walletAddress && onAnalyze(walletAddress)}
					disabled={isAnalyzing || !walletAddress}
					className='arc-raiders-pill-button w-full justify-center text-base md:text-lg'
					style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
				>
					{isAnalyzing ? (
						<>
							<div
								className='w-4 h-4 md:w-5 md:h-5 mr-2 border-2 border-white border-t-transparent animate-spin'
								style={{ borderRadius: '50%' }}
							/>
							<span>ANALYZING YOUR WALLET</span>
						</>
					) : (
						<>
							<Search className='w-4 h-4 md:w-5 md:h-5 mr-2' />
							<span>ANALYZE MY WALLET</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
}
