'use client';

import type { Agent } from '@elizaos/api-client';
import { useEffect, useState } from 'react';
import { getAnalyserOpenRouterApiKey } from '@/actions/openrouter/get';
import { ANALYSER_AGENT_NAME, ANALYSER_BASE_URL } from '@/lib/constants';
import { ElizaService } from '@/services/eliza.service';

interface UseElizaAgentParams {
	userId: string | null;
}

interface UseElizaAgentReturn {
	agent: Agent | null;
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to fetch or create the analyzer agent
 */
export function useElizaAgent({ userId }: UseElizaAgentParams): UseElizaAgentReturn {
	const [agent, setAgent] = useState<Agent | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!userId) {
			setIsLoading(false);
			return;
		}

		const fetchOrCreateAgent = async () => {
			try {
				console.log('[useElizaAgent] Fetching analyzer agent for user:', userId);

				// Get analyzer credentials
				const apiKeyResult = await getAnalyserOpenRouterApiKey();
				if (!apiKeyResult.success || !apiKeyResult.data) {
					throw new Error('Analyser OpenRouter API key not found');
				}

				const baseUrl = ANALYSER_BASE_URL;

				// Create ElizaService instance with analyzer credentials
				const elizaService = new ElizaService(apiKeyResult.data, baseUrl);
				const elizaClient = elizaService.getClient();

				// List all agents and find the analyzer agent
				const response = await elizaClient.agents.listAgents();
				console.log('[useElizaAgent] Raw response:', response);

				// Try to find existing analyzer agent by name
				const analyzerAgent = response.agents?.find((a: Agent) => a.name === ANALYSER_AGENT_NAME);

				if (analyzerAgent) {
					console.log('[useElizaAgent] Found existing analyzer agent:', analyzerAgent.name);
					setAgent(analyzerAgent);
					setError(null);
					setIsLoading(false);
					return;
				}

				throw new Error('Analyzer agent not found');
			} catch (err) {
				console.error('[useElizaAgent] Error fetching analyzer agent:', err);
				setError((err as Error).message || 'Failed to load analyzer agent');
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrCreateAgent();
	}, [userId]);

	return { agent, isLoading, error };
}
