import type { openRouterDataSchema } from '@/schemas/openrouter';
import type { z } from 'zod';

export type OpenRouterData = z.infer<typeof openRouterDataSchema>;

export interface OpenRouterSecret {
    apiKey: string;
    hash: string; // Hash used for OpenRouter API operations (updates, etc.)
}
