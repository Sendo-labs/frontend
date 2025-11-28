'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import * as React from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { FullScreenLoader } from '@/components/shared/loader';
import { Button } from '@/components/ui/button';

interface QueryBoundaryProps {
	children: React.ReactNode;
	queryKeys?: string[];
	loadingFallback?: React.ReactNode;
	errorFallback?: (props: FallbackProps) => React.ReactNode;
}

/**
 * QueryBoundary component to handle errors and loading states
 * @param {QueryBoundaryProps} props - The props for the QueryBoundary component
 * @param {React.ReactNode} props.children - The children to render
 * @param {string[]} props.queryKeys - The query keys to watch
 * @param {React.ReactNode} props.loadingFallback - The fallback to render when loading
 * @param {Function} props.errorFallback - The fallback to render when an error occurs
 */
export function QueryBoundary({
	children,
	queryKeys = [],
	loadingFallback = <FullScreenLoader />,
	errorFallback,
}: QueryBoundaryProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					fallbackRender={(props) =>
						errorFallback ? errorFallback(props) : <DefaultErrorFallback {...props} queryKeys={queryKeys} />
					}
				>
					<React.Suspense fallback={loadingFallback}>{children}</React.Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}

/**
 * Default error fallback component to display when an error occurs
 * @param {FallbackProps} props - The props for the DefaultErrorFallback component
 * @param {Error} props.error - The error to display
 * @param {Function} props.resetErrorBoundary - The function to reset the error boundary
 * @param {string[]} props.queryKeys - The query keys to display
 */
export function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps & { queryKeys?: string[] }) {
	return (
		<div className='p-6 rounded-lg border border-sendo-orange flex flex-col items-center justify-center space-y-4 text-center my-32'>
			<AlertCircle className='text-destructive size-12' />
			<div>
				<h3 className='text-lg font-semibold mb-2 title-font'>Something went wrong</h3>
				<p className='text-muted-foreground'>{error.message || 'Unexpected error'}</p>
			</div>
			<Button onClick={resetErrorBoundary} variant='outline' className='gap-2'>
				<RefreshCcw className='size-4' />
				Try again
			</Button>
		</div>
	);
}
