'use server';

import { withAction } from '@/lib/wrapper/with-action';
import { secretManagerService } from '@/services/aws/secret-manager.service';
import { getUserSecretName } from '@/lib/utils';
import { UserSecrets } from '@/types/agent';

/**
 * Get the user secrets from the secret manager
 * @returns The user secrets
 */
export async function getUserSecret() {
    return withAction<UserSecrets | null>(async (session) => {
        const secretName = getUserSecretName(session.user.id)
        const secretValue = await secretManagerService.getSecret(secretName)
        return secretValue ? JSON.parse(secretValue) : null
    })
}