/**
 * Query keys for app entities related requests
 */
export const QUERY_KEYS = {
	WORKER_ANALYSIS: {
		all: ['worker-analysis'] as const,
		lists: () => [...QUERY_KEYS.WORKER_ANALYSIS.all, 'list'] as const,
		list: (filters?: string[]) => [...QUERY_KEYS.WORKER_ANALYSIS.lists(), filters] as const,
	},
} as const;
