import { useState, useEffect, useCallback, useRef } from 'react';
import type { AnalysisStatusResponse, AnalysisResultsResponse } from '@sendo-labs/plugin-sendo-analyser';
import { startAnalysis, getAnalysisStatus, getAnalysisResults } from '@/actions/analyzer/get';
import { toast } from 'sonner';

const POLL_INTERVAL = 5000; // 5 seconds
const PAGE_SIZE = 10; // Number of tokens to load per page

interface UseWalletAnalysisReturn {
	status: AnalysisStatusResponse | null;
	results: AnalysisResultsResponse | null;
	isStarting: boolean;
	error: string | null;
	currentPage: number;
	start: () => Promise<void>;
	nextPage: () => void;
	previousPage: () => void;
}

/**
 * Hook to manage async wallet analysis with polling
 */
export function useWalletAnalysis(walletAddress: string | null): UseWalletAnalysisReturn {
	const [status, setStatus] = useState<AnalysisStatusResponse | null>(null);
	const [results, setResults] = useState<AnalysisResultsResponse | null>(null);
	const [isStarting, setIsStarting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const pollingRef = useRef<NodeJS.Timeout | null>(null);
	const isPollingRef = useRef(false);
	const hasInitializedRef = useRef(false);
	const isRestartingRef = useRef(false);
	const toastIdRef = useRef<string | number | null>(null);
	const lastTokenCountRef = useRef<number>(0);

	// Stop polling
	const stopPolling = useCallback(() => {
		console.log('[useWalletAnalysis] Stopping polling...');
		if (pollingRef.current) {
			clearInterval(pollingRef.current);
			pollingRef.current = null;
		}
		isPollingRef.current = false;
	}, []);

	// Fetch status
	const fetchStatus = useCallback(async () => {
		if (!walletAddress) return;

		try {
			const response = await getAnalysisStatus(walletAddress);

			if (!response.success) {
				throw new Error(response.error || 'Failed to fetch status');
			}

			const newStatus = response.data;
			console.log('[useWalletAnalysis] Status update:', {
				status: newStatus.status,
				progress: newStatus.progress,
				tokens_discovered: newStatus.current_results?.tokens_discovered,
				last_heartbeat: newStatus.last_heartbeat,
			});

			setStatus(newStatus);

			// Update persistent toast during processing
			if (newStatus.status === 'processing') {
				const processed = newStatus.progress?.processed || 0;
				const tokensFound = newStatus.current_results?.tokens_discovered || 0;

				if (toastIdRef.current) {
					// Update existing toast
					toast.loading('Analyzing wallet...', {
						id: toastIdRef.current,
						description: `Found ${tokensFound} token${tokensFound !== 1 ? 's' : ''} • ${processed} transactions analyzed`,
					});
				} else {
					// Create new persistent toast
					toastIdRef.current = toast.loading('Analyzing wallet...', {
						description: `Found ${tokensFound} token${tokensFound !== 1 ? 's' : ''} • ${processed} transactions analyzed`,
					});
				}
			}

			// Check if heartbeat is older than 2 minutes (120 seconds) - analysis might be stuck
			if (newStatus.status === 'processing' && newStatus.last_heartbeat && !isRestartingRef.current) {
				const heartbeatDate = new Date(newStatus.last_heartbeat);
				const now = new Date();
				const secondsSinceHeartbeat = (now.getTime() - heartbeatDate.getTime()) / 1000;

				if (secondsSinceHeartbeat > 120) {
					console.warn(
						'[useWalletAnalysis] Heartbeat is stale (',
						secondsSinceHeartbeat,
						's old), restarting analysis...',
					);
					isRestartingRef.current = true;

					// Show restart toast
					toast.info('Restarting analysis...', {
						description: 'Analysis appears stuck, retrying from where it left off',
					});

					// Stop current polling
					stopPolling();
					// Trigger a restart by calling the API directly
					setTimeout(async () => {
						try {
							console.log('[useWalletAnalysis] Restarting stuck analysis...');
							await startAnalysis(walletAddress);
							// Fetch fresh status
							const statusResponse = await getAnalysisStatus(walletAddress);
							if (statusResponse.success) {
								setStatus(statusResponse.data);
							}
							// Restart polling
							if (!isPollingRef.current) {
								isPollingRef.current = true;
								pollingRef.current = setInterval(async () => {
									const resp = await getAnalysisStatus(walletAddress);
									if (resp.success) {
										setStatus(resp.data);
									}
								}, POLL_INTERVAL);
							}
							// Fetch results
							setTimeout(async () => {
								const resultsResp = await getAnalysisResults(walletAddress, 1, PAGE_SIZE);
								if (resultsResp.success) {
									setResults(resultsResp.data);
								}
							}, 500);
						} catch (err) {
							console.error('[useWalletAnalysis] Error restarting analysis:', err);
						} finally {
							isRestartingRef.current = false;
						}
					}, 100);
					return newStatus;
				}
			}

			// Update pagination.total from status (tokens_discovered) if we have results
			// This keeps the total count up to date during processing
			if (newStatus.current_results?.tokens_discovered) {
				setResults((prev: any) => {
					if (!prev) return prev;
					return {
						...prev,
						pagination: {
							...prev.pagination,
							total: newStatus.current_results.tokens_discovered,
							totalPages: Math.ceil(newStatus.current_results.tokens_discovered / (prev.pagination.limit || PAGE_SIZE)),
							hasMore: prev.tokens.length < newStatus.current_results.tokens_discovered,
						},
					};
				});
			}

			// Stop polling if completed or failed
			if (newStatus.status === 'completed' || newStatus.status === 'failed') {
				console.log('[useWalletAnalysis] Analysis finished, stopping polling');
				stopPolling();

				// Dismiss persistent loading toast
				if (toastIdRef.current) {
					toast.dismiss(toastIdRef.current);
					toastIdRef.current = null;
				}

				// Show completion/failure toast
				if (newStatus.status === 'completed') {
					const tokensCount = newStatus.current_results?.tokens_discovered || 0;
					toast.success('Analysis completed! 🎉', {
						description: `Found ${tokensCount} token${tokensCount !== 1 ? 's' : ''} in your wallet`,
					});
				} else if (newStatus.status === 'failed') {
					toast.error('Analysis failed', {
						description: newStatus.error || 'Please try again',
					});
				}
			}

			return newStatus;
		} catch (err: any) {
			console.error('[useWalletAnalysis] Error fetching status:', err);
			setError(err.message || 'Failed to fetch status');
		}
	}, [walletAddress, stopPolling]);

	// Fetch results for pagination
	const fetchResults = useCallback(
		async (page: number = 1, limit: number = PAGE_SIZE) => {
			if (!walletAddress) return;

			try {
				const response = await getAnalysisResults(walletAddress, page, limit);

				if (!response.success) {
					throw new Error(response.error || 'Failed to fetch results');
				}

				console.log('[useWalletAnalysis] Results fetched:', {
					page,
					tokensCount: response.data.tokens.length,
					total: response.data.pagination.total,
				});

				// If API returns 0 tokens for page > 1, stop pagination
				// This happens when analysis is processing but tokens aren't ready yet
				if (response.data.tokens.length === 0 && page > 1) {
					console.log('[useWalletAnalysis] No new tokens returned, stopping pagination');
					// Mark hasMore as false to stop infinite scroll
					setResults((prev: any) => {
						if (!prev) return prev;
						return {
							...prev,
							pagination: {
								...prev.pagination,
								hasMore: false,
							},
						};
					});
					return;
				}

				// For page 1, replace everything
				// For page > 1, append to existing tokens (infinite scroll)
				setResults((prev: any) => {
					if (page === 1) {
						return response.data;
					}
					// Append new tokens to existing ones
					if (prev) {
						// Deduplicate tokens by ID to avoid React key warnings
						const existingIds = new Set(prev.tokens.map((t: any) => t.id));
						const newTokens = response.data.tokens.filter((t: any) => !existingIds.has(t.id));
						const accumulatedTokens = [...prev.tokens, ...newTokens];

						return {
							...response.data,
							tokens: accumulatedTokens,
							pagination: {
								...response.data.pagination,
								// Recalculate hasMore based on accumulated tokens vs total
								hasMore: accumulatedTokens.length < response.data.pagination.total,
							},
						};
					}
					return response.data;
				});
				setCurrentPage(page);

				return response.data;
			} catch (err: any) {
				console.error('[useWalletAnalysis] Error fetching results:', err);
				setError(err.message || 'Failed to fetch results');
			}
		},
		[walletAddress],
	);

	// Auto-refetch tokens when new ones are discovered during processing
	// This effect watches status.current_results.tokens_discovered and refetches page 1 when it increases
	useEffect(() => {
		if (!status || !walletAddress) return;

		const tokensDiscovered = status.current_results?.tokens_discovered || 0;

		// Only refetch during processing (not completed) and when token count increases
		if (status.status === 'processing' && tokensDiscovered > 0 && tokensDiscovered > lastTokenCountRef.current) {
			console.log(
				'[useWalletAnalysis] New tokens discovered:',
				tokensDiscovered,
				'vs',
				lastTokenCountRef.current,
				'- refetching page 1',
			);
			lastTokenCountRef.current = tokensDiscovered;
			fetchResults(1);
		}

		// When analysis completes, fetch final results if we haven't loaded any tokens yet
		if (status.status === 'completed' && tokensDiscovered > 0 && (!results || results.tokens.length === 0)) {
			console.log('[useWalletAnalysis] Analysis completed with', tokensDiscovered, 'tokens - fetching results');
			fetchResults(1);
		}
	}, [status, walletAddress, fetchResults, results]);

	// Start polling - Only polls status endpoint every 5s
	// Status contains current_results with summary, so no need to fetch results
	// Results pagination is completely separate and managed by nextPage()
	const startPolling = useCallback(() => {
		if (isPollingRef.current) return;

		console.log('[useWalletAnalysis] Starting status polling...');
		isPollingRef.current = true;

		pollingRef.current = setInterval(async () => {
			// Only fetch status - it contains current_results with summary
			// This updates the progress bar and summary stats in real-time
			await fetchStatus();
		}, POLL_INTERVAL);
	}, [fetchStatus]);

	// Start analysis
	const start = useCallback(async () => {
		if (!walletAddress) return;

		setIsStarting(true);
		setError(null);

		try {
			console.log('[useWalletAnalysis] Starting analysis for:', walletAddress);
			const response = await startAnalysis(walletAddress);

			if (!response.success) {
				throw new Error(response.error || 'Failed to start analysis');
			}

			console.log('[useWalletAnalysis] Analysis started successfully');

			// Immediately fetch status - this will create the persistent loading toast
			await fetchStatus();

			// Immediately start polling for status updates
			startPolling();

			// Wait a short bit before fetching results to let the analysis discover some tokens
			// The polling will update the summary stats in real-time
			setTimeout(() => {
				fetchResults(1);
			}, 500); // Wait 500ms for initial tokens to be discovered
		} catch (err: any) {
			console.error('[useWalletAnalysis] Error starting analysis:', err);
			setError(err.message || 'Failed to start analysis');
		} finally {
			setIsStarting(false);
		}
	}, [walletAddress, startPolling, fetchResults]);

	// Next page
	const nextPage = useCallback(() => {
		if (results && results.pagination.hasMore) {
			fetchResults(currentPage + 1);
		}
	}, [results, currentPage, fetchResults]);

	// Previous page
	const previousPage = useCallback(() => {
		if (currentPage > 1) {
			fetchResults(currentPage - 1);
		}
	}, [currentPage, fetchResults]);

	// Cleanup on unmount - dismiss toast
	useEffect(() => {
		return () => {
			stopPolling();
			// Dismiss toast when component unmounts or wallet changes
			if (toastIdRef.current) {
				toast.dismiss(toastIdRef.current);
				toastIdRef.current = null;
			}
		};
	}, [stopPolling, walletAddress]);

	// Auto-fetch status on mount if wallet address is provided
	// Only runs ONCE per wallet address
	useEffect(() => {
		if (walletAddress && !hasInitializedRef.current) {
			console.log('[useWalletAnalysis] Auto-fetching status for:', walletAddress);
			hasInitializedRef.current = true;

			fetchStatus().then((status: AnalysisStatusResponse | undefined) => {
				// If analysis exists and is completed, fetch first page of results
				if (status && status.status === 'completed') {
					fetchResults(1);
				} else if (status && status.status === 'processing') {
					// If already processing, start polling and fetch first page
					startPolling();
					fetchResults(1);
				} else if (!status || status.status === 'not_found' || status.status === 'failed') {
					// No analysis exists or failed - start a new one automatically
					console.log('[useWalletAnalysis] No analysis found, starting new analysis...');
					start();
				}
			});
		}

		// Reset all state when wallet changes
		return () => {
			if (walletAddress) {
				console.log('[useWalletAnalysis] Wallet changed, resetting all state...');
				hasInitializedRef.current = false;
				lastTokenCountRef.current = 0;
				setStatus(null);
				setResults(null);
				setCurrentPage(1);
				setError(null);
				setIsStarting(false);
			}
		};
	}, [walletAddress, fetchStatus, fetchResults, startPolling, start]);

	return {
		status,
		results,
		isStarting,
		error,
		currentPage,
		start,
		nextPage,
		previousPage,
	};
}
