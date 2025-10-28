'use server';

import { withAction } from '@/lib/wrapper/with-action';
import { getUserSecret } from '../secrets/get';
import type { Character } from '@elizaos/core';

export async function getUserAgents() {
    return withAction<Character[] | null>(async () => {
        const userSecret = await getUserSecret();
        if (!userSecret.success || userSecret.data === null || !userSecret.data) {
            return null;
        }

        const agents = Object.keys(userSecret.data);
        return agents.map((agent) => {
            return JSON.parse(userSecret.data![agent]) as Character;
        })
    })
}