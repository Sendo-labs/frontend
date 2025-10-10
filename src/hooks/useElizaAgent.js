import { useState, useEffect } from 'react';
import { getElizaClient } from '@/lib/elizaClient';

/**
 * Hook to fetch the SENDO agent from Eliza server
 * @returns {Object} Agent state
 */
export function useElizaAgent() {
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const elizaClient = getElizaClient();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        console.log('[useElizaAgent] Fetching SENDO agent...');
        const response = await elizaClient.agents.listAgents();
        console.log('[useElizaAgent] Raw response:', response);

        // Handle response format: could be {agents: [...]}, {data: {agents: [...]}} or {data: [...]}
        const agents = response.agents || response.data?.agents || response.data || [];
        console.log('[useElizaAgent] Agents found:', agents);

        // Get the first agent (SENDO)
        const sendoAgent = agents[0];

        if (!sendoAgent) {
          throw new Error('SENDO agent not found. Make sure the Eliza server is running.');
        }

        console.log('[useElizaAgent] SENDO agent loaded:', sendoAgent.name);
        setAgent(sendoAgent);
        setError(null);
      } catch (err) {
        console.error('[useElizaAgent] Error fetching agent:', err);
        setError(err.message || 'Failed to load SENDO agent');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
  }, [elizaClient]);

  return { agent, isLoading, error };
}
