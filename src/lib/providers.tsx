'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 10, // 10 minutes
		},
	},
});

interface GlobalProvidersProps {
	children: React.ReactNode;
}

export function GlobalProviders({ children }: GlobalProvidersProps) {
	return (
		<PrivyProvider
			appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
			config={{
				loginMethods: [
					'email',
					'wallet',
					// 'google',
				],
				appearance: {
					theme: 'light',
					accentColor: '#FF6B00',
					// Show wallet login first (not email)
					showWalletLoginFirst: true,
					// Solana only (no Ethereum)
					walletChainType: 'solana-only',
				},
				// External Solana wallets configuration (Phantom, Solflare, etc.)
				externalWallets: {
					solana: {
						connectors: toSolanaWalletConnectors({
							// Automatically detect all installed Solana wallets
							shouldAutoConnect: true,
						}),
					},
				},
			}}
		>
			<QueryClientProvider client={queryClient}>
				{children}
				<Toaster richColors />
			</QueryClientProvider>
		</PrivyProvider>
	);
}
