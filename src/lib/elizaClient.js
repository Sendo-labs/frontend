import { ElizaClient } from '@elizaos/api-client';

/**
 * Create Eliza API client configuration
 * @returns {import('@elizaos/api-client').ApiClientConfig}
 */
export function createElizaClientConfig() {
  const apiKey = localStorage.getItem('eliza-api-key') || import.meta.env.VITE_ELIZA_SERVER_AUTH_TOKEN;

  const config = {
    baseUrl: import.meta.env.VITE_ELIZA_SERVER_URL || 'http://localhost:3000',
    timeout: 30000,
    headers: {
      'Accept': 'application/json',
    },
  };

  // Include apiKey (X-API-KEY header)
  if (apiKey) {
    config.apiKey = apiKey;
  }

  return config;
}

// Singleton instance
let elizaClientInstance = null;

/**
 * Get or create the Eliza client singleton instance
 * @returns {ElizaClient}
 */
export function getElizaClient() {
  if (!elizaClientInstance) {
    elizaClientInstance = ElizaClient.create(createElizaClientConfig());
  }
  return elizaClientInstance;
}

/**
 * Reset the Eliza client singleton (useful for API key changes)
 */
export function resetElizaClient() {
  elizaClientInstance = null;
}

/**
 * Update the API key and reset the client
 * @param {string | null} newApiKey
 */
export function updateApiKey(newApiKey) {
  if (newApiKey) {
    localStorage.setItem('eliza-api-key', newApiKey);
  } else {
    localStorage.removeItem('eliza-api-key');
  }

  // Reset the singleton so it uses the new API key
  resetElizaClient();
}
