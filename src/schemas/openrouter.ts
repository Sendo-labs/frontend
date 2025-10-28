import { z } from 'zod';

export const openRouterDataSchema = z.object({
    username: z.string().min(1),
    planType: z.string().min(1),
    agentNumber: z.number().positive().optional().default(0),
    credits: z.number().positive(),
});

export const createApiKeySchema = z.object({
    name: z.string().min(1).max(100),
    limit: z.number().positive().optional(),
});

export const apiKeyResponseSchema = z.object({
    data: z.object({
        name: z.string(),
        label: z.string(),
        limit: z.number().nullable(),
        disabled: z.boolean(),
        created_at: z.string(),
        updated_at: z.string().nullable(), // Can be null for new keys
        hash: z.string(),
    }),
    key: z.string(),
});
