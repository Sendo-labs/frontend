'use client';

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
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster richColors />
		</QueryClientProvider>
	);
}
