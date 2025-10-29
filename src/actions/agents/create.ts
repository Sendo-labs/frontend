'use server';

import { withAction } from '@/lib/wrapper/with-action';
import type { Character } from '@elizaos/core';
import { getUserSecret } from '../secrets/get';
import { createUserSecret } from '../secrets/create';
import { updateSecretTagsAction, updateUserSecret } from '../secrets/update';
import type { UserSecrets } from '@/types/agent';
import { getUserOpenRouterKey } from '../openrouter/get';
import { createUserOpenRouterKey } from '../openrouter/create';
import type { OpenRouterSecret } from '@/types/openrouter';
import { sanitizeUserId } from '@/lib/utils';

/**
 * Create a new agent by uploading the new character on the user secret (secret manager).
 * First, check if the user have a related OpenRouter API key. If not, create a new one.
 * Then, create the agent by uploading the new character on the user secret.
 * @param character - The character to create the agent from
 * @returns The created agent
 */
export async function createAgent(character: Character) {
	return withAction<void>(async (session) => {
		let orKey: OpenRouterSecret | null = null;
		// Check if the user have a related OpenRouter API key
		const openRouterApiKey = await getUserOpenRouterKey(session.user.id);
		if (!openRouterApiKey.success || openRouterApiKey.data === null) {
			// If the user does not have a related OpenRouter API key, create a new one
			const newOpenRouterApiKey = await createUserOpenRouterKey(session.user.id);
			if (!newOpenRouterApiKey.success || newOpenRouterApiKey.data === null) {
				throw new Error('Failed to create OpenRouter API key');
			}

			orKey = {
				apiKey: newOpenRouterApiKey.data,
				hash: newOpenRouterApiKey.data,
			};
		} else {
			orKey = openRouterApiKey.data;
		}

		const existingSecrets = character.settings?.secrets;
		const updatedSecrets =
			existingSecrets && typeof existingSecrets === 'object'
				? { ...existingSecrets, OPENROUTER_API_KEY: orKey.apiKey }
				: { OPENROUTER_API_KEY: orKey.apiKey };

		character = {
			...character,
			settings: {
				...(character.settings || {}),
				secrets: updatedSecrets,
			},
		};

		console.log('character', character);
		console.log('updatedSecrets', updatedSecrets);

		let userSecretValue: UserSecrets = {
			[character.name]: JSON.stringify(character),
		};

		// First, check if the user secret exists
		const userSecret = await getUserSecret();
		if (!userSecret.success || userSecret.data === null) {
			// If the user secret does not exist, create a new one
			console.log('User secret not found, creating new one');
			// Create the user secret with the new character
			await createUserSecret(JSON.stringify(userSecretValue));
			const secretTagsResponse = await updateSecretTagsAction({
				Plan: 'free',
				NbAgent: 1,
				Feature: 'none',
				Username: sanitizeUserId(session.user.id),
			});
			if (!secretTagsResponse.success) {
				throw new Error('Failed to update secret tags');
			}
			return;
		}
		userSecretValue = userSecret.data;
		const nbAgent = (userSecret.data.NbAgent ? parseInt(userSecret.data.NbAgent) : 0) + 1;
		// Then, update the user secret with the new character
		console.log('User secret found, updating with new character');
		await updateUserSecret({
			...userSecret.data,
			[character.name]: JSON.stringify(character),
		});
		const secretTagsResponse = await updateSecretTagsAction({
			Plan: 'free',
			NbAgent: nbAgent,
			Feature: 'none',
		});
		if (!secretTagsResponse.success) {
			throw new Error('Failed to update secret tags');
		}
		return;
	});
}
