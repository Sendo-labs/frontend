/**
 * AWS Secrets Manager implementation of ISecretStore
 * Wraps the existing SecretManagerService to conform to the abstract interface
 */

import type { ISecretStore, SecretMetadata, Tag } from '@/interfaces/storage/isecret-store';
import { SecretManagerService } from '@/services/aws/secret-manager.service';

export class AWSSecretStoreAdapter implements ISecretStore {
	private secretManager: SecretManagerService;

	constructor() {
		this.secretManager = new SecretManagerService();
	}

	// ============= CORE OPERATIONS =============

	async getSecrets(): Promise<string[]> {
		return this.secretManager.getSecrets();
	}

	async getSecret(secretName: string): Promise<string | null> {
		try {
			const secret = await this.secretManager.getSecret(secretName);
			return secret ?? null;
		} catch (error) {
			// If secret doesn't exist, return null instead of throwing
			if (error instanceof Error && error.message.includes('ResourceNotFoundException')) {
				return null;
			}
			throw error;
		}
	}

	async createSecret(name: string, value: string, description?: string): Promise<void> {
		await this.secretManager.createSecret(name, value, description);
	}

	async updateSecret(secretName: string, secretValue: string): Promise<void> {
		await this.secretManager.updateSecret(secretName, secretValue);
	}

	async putSecret(secretName: string, secretValue: string): Promise<void> {
		await this.secretManager.putSecret(secretName, secretValue);
	}

	async deleteSecret(secretName: string, forceDelete: boolean = false): Promise<boolean> {
		try {
			await this.secretManager.deleteSecret(secretName, forceDelete);
			return true;
		} catch (error) {
			if (error instanceof Error && error.message.includes('ResourceNotFoundException')) {
				return false;
			}
			throw error;
		}
	}

	// ============= TAG OPERATIONS =============

	async getSecretTags(secretName: string): Promise<Tag[]> {
		const awsTags = await this.secretManager.getSecretTags(secretName);
		// Filter out tags with undefined Key or Value
		return awsTags
			.filter((tag): tag is { Key: string; Value: string } => tag.Key !== undefined && tag.Value !== undefined)
			.map((tag) => ({ Key: tag.Key, Value: tag.Value }));
	}

	async addSecretTags(secretName: string, tags: Tag[]): Promise<void> {
		await this.secretManager.addSecretTags(secretName, tags);
	}

	async removeSecretTags(secretName: string, tagKeys: string[]): Promise<void> {
		await this.secretManager.removeSecretTags(secretName, tagKeys);
	}

	async updateSecretTags(secretName: string, newTags: Tag[]): Promise<void> {
		await this.secretManager.updateSecretTags(secretName, newTags);
	}

	// ============= CONVENIENCE METHODS =============

	async setSecretTag(secretName: string, key: string, value: string): Promise<void> {
		await this.secretManager.setSecretTag(secretName, key, value);
	}

	async removeSecretTag(secretName: string, tagKey: string): Promise<void> {
		await this.secretManager.removeSecretTag(secretName, tagKey);
	}

	async hasSecretTag(secretName: string, tagKey: string): Promise<boolean> {
		return this.secretManager.hasSecretTag(secretName, tagKey);
	}

	async getSecretTagValue(secretName: string, tagKey: string): Promise<string | null> {
		const value = await this.secretManager.getSecretTagValue(secretName, tagKey);
		return value ?? null;
	}

	// ============= METADATA OPERATIONS =============

	async getSecretMetadata(secretName: string): Promise<SecretMetadata | null> {
		try {
			const tags = await this.getSecretTags(secretName);
			// Note: AWS Secrets Manager doesn't easily expose creation/update dates
			// without additional API calls. You could enhance this if needed.
			return {
				name: secretName,
				tags,
			};
		} catch (error) {
			if (error instanceof Error && error.message.includes('ResourceNotFoundException')) {
				return null;
			}
			throw error;
		}
	}
}
