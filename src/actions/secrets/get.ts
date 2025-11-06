'use server';

import { withAction } from '@/lib/wrapper/with-action';
import { StorageFactory } from '@/factories/storage-factory';
import { getUserSecretName } from '@/lib/utils';
import { UserSecrets } from '@/types/agent';

/**
 * Get the user secrets from the secret manager
 * @returns The user secrets
 */
export async function getUserSecret() {
	return withAction<UserSecrets | null>(async (session) => {
		const secretStore = StorageFactory.createSecretStore();
		const secretName = getUserSecretName(session.user.id);
		const secretValue = await secretStore.getSecret(secretName);
		return secretValue ? JSON.parse(secretValue) : null;
	});
}
