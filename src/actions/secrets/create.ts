'use server';

import { withAction } from '@/lib/wrapper/with-action';
import { StorageFactory } from '@/factories/storage-factory';
import { getUserSecretName } from '@/lib/utils';
import type { SecretTags } from '@/types/agent';
import { getSecretTags } from './utils';

/**
 * Create the user secrets in the secret manager
 * @param userId - The user id
 * @param secrets - The user secrets
 * @returns The created user secrets
 */
export async function createUserSecret(secretValue: string) {
	return withAction<void>(async (session) => {
		const secretStore = StorageFactory.createSecretStore();
		const secretName = getUserSecretName(session.user.id);
		await secretStore.createSecret(secretName, secretValue);
		return;
	});
}

/**
 * Creates the tags for a secret in Secret Manager.
 * Used when a user creates an agent.
 *
 * @param tags - The tags to create
 * @returns {Promise<ActionResponse<void>>} A promise indicating success or failure
 */
export async function createSecretTagsAction(tags: SecretTags) {
	return withAction<void>(async (session) => {
		const secretStore = StorageFactory.createSecretStore();
		const secretName = getUserSecretName(session.user.id);
		const tagsToAdd = getSecretTags(tags);
		await secretStore.addSecretTags(secretName, tagsToAdd);
		return;
	});
}
