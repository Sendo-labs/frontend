'use server';

import { withAction } from '@/lib/wrapper/with-action';
import { StorageFactory } from '@/factories/storage-factory';
import { getUserSecretName } from '@/lib/utils';
import { SecretTags, UserSecrets } from '@/types/agent';
import { getSecretTags } from './utils';

/**
 * Update the user secret in the secret manager
 * Part of the dual-storage strategy to maintain data consistency.
 * @param secretContent - The content to store in the secret
 * @returns The updated user secret
 */
export async function updateUserSecret(secretContent: UserSecrets) {
	return withAction<void>(async (session) => {
		const secretStore = StorageFactory.createSecretStore();
		const secretName = getUserSecretName(session.user.id);
		await secretStore.putSecret(secretName, JSON.stringify(secretContent));
		return;
	});
}

/**
 * Updates the tags of a secret in Secret Manager.
 * @param tags - The tags to update
 * @returns {Promise<ActionResponse<void>>} A promise indicating success or failure
 */
export async function updateSecretTagsAction(tags: SecretTags) {
	return withAction<void>(async (session) => {
		const secretStore = StorageFactory.createSecretStore();
		const secretName = getUserSecretName(session.user.id);
		const finalTags = getSecretTags(tags);
		await secretStore.addSecretTags(secretName, finalTags);
		return;
	});
}
