import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
// TODO: Re-enable auth once backend migration is complete
export const base44 = createClient({
  appId: "68de5637652a326681f5a5a3",
  requiresAuth: false // Temporarily disabled for Eliza integration testing
});
