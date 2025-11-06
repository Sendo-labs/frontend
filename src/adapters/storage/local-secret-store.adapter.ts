/**
 * Local filesystem implementation of ISecretStore
 * Stores secrets as JSON files in a local directory
 * Perfect for local development without AWS dependencies
 */

import fs from 'fs/promises';
import path from 'path';
import type { ISecretStore, Tag, SecretMetadata } from '@/interfaces/storage/siecret-store';

interface StoredSecret {
	name: string;
	value: string;
	description?: string;
	tags: Tag[];
	createdAt: string;
	updatedAt: string;
}

export class LocalSecretStoreAdapter implements ISecretStore {
	private storageDir: string;

	constructor(storageDir?: string) {
		// Default to .local-secrets in project root
		this.storageDir = storageDir || path.join(process.cwd(), '.local-storage', 'secrets');
	}

	/**
	 * Ensure storage directory exists
	 */
	private async ensureStorageDir(): Promise<void> {
		try {
			await fs.mkdir(this.storageDir, { recursive: true });
		} catch (error) {
			// Ignore if directory already exists
		}
	}

	/**
	 * Get the file path for a secret
	 */
	private getSecretPath(secretName: string): string {
		// Sanitize secret name for filesystem
		const sanitized = secretName.replace(/[^a-zA-Z0-9._-]/g, '_');
		return path.join(this.storageDir, `${sanitized}.json`);
	}

	/**
	 * Read a secret file
	 */
	private async readSecretFile(secretName: string): Promise<StoredSecret | null> {
		try {
			const filePath = this.getSecretPath(secretName);
			const content = await fs.readFile(filePath, 'utf-8');
			return JSON.parse(content);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				return null;
			}
			throw error;
		}
	}

	/**
	 * Write a secret file
	 */
	private async writeSecretFile(secret: StoredSecret): Promise<void> {
		await this.ensureStorageDir();
		const filePath = this.getSecretPath(secret.name);
		await fs.writeFile(filePath, JSON.stringify(secret, null, 2), 'utf-8');
	}

	// ============= CORE OPERATIONS =============

	async getSecrets(): Promise<string[]> {
		await this.ensureStorageDir();
		try {
			const files = await fs.readdir(this.storageDir);
			return files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '').replace(/_/g, '-'));
		} catch (error) {
			return [];
		}
	}

	async getSecret(secretName: string): Promise<string | null> {
		const secret = await this.readSecretFile(secretName);
		return secret ? secret.value : null;
	}

	async createSecret(name: string, value: string, description?: string): Promise<void> {
		const existing = await this.readSecretFile(name);
		if (existing) {
			throw new Error(`Secret '${name}' already exists`);
		}

		const secret: StoredSecret = {
			name,
			value,
			description,
			tags: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		await this.writeSecretFile(secret);
	}

	async updateSecret(secretName: string, secretValue: string): Promise<void> {
		const existing = await this.readSecretFile(secretName);
		if (!existing) {
			throw new Error(`Secret '${secretName}' does not exist`);
		}

		existing.value = secretValue;
		existing.updatedAt = new Date().toISOString();

		await this.writeSecretFile(existing);
	}

	async putSecret(secretName: string, secretValue: string): Promise<void> {
		const existing = await this.readSecretFile(secretName);

		if (existing) {
			existing.value = secretValue;
			existing.updatedAt = new Date().toISOString();
			await this.writeSecretFile(existing);
		} else {
			await this.createSecret(secretName, secretValue);
		}
	}

	async deleteSecret(secretName: string, forceDelete: boolean = false): Promise<boolean> {
		try {
			const filePath = this.getSecretPath(secretName);
			await fs.unlink(filePath);
			return true;
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				return false;
			}
			throw error;
		}
	}

	// ============= TAG OPERATIONS =============

	async getSecretTags(secretName: string): Promise<Tag[]> {
		const secret = await this.readSecretFile(secretName);
		return secret ? secret.tags : [];
	}

	async addSecretTags(secretName: string, tags: Tag[]): Promise<void> {
		const secret = await this.readSecretFile(secretName);
		if (!secret) {
			throw new Error(`Secret '${secretName}' does not exist`);
		}

		// Add tags, avoiding duplicates
		for (const newTag of tags) {
			const existingIndex = secret.tags.findIndex((t) => t.Key === newTag.Key);
			if (existingIndex >= 0) {
				secret.tags[existingIndex] = newTag; // Update existing
			} else {
				secret.tags.push(newTag); // Add new
			}
		}

		secret.updatedAt = new Date().toISOString();
		await this.writeSecretFile(secret);
	}

	async removeSecretTags(secretName: string, tagKeys: string[]): Promise<void> {
		const secret = await this.readSecretFile(secretName);
		if (!secret) {
			throw new Error(`Secret '${secretName}' does not exist`);
		}

		secret.tags = secret.tags.filter((tag) => !tagKeys.includes(tag.Key));
		secret.updatedAt = new Date().toISOString();
		await this.writeSecretFile(secret);
	}

	async updateSecretTags(secretName: string, newTags: Tag[]): Promise<void> {
		const secret = await this.readSecretFile(secretName);
		if (!secret) {
			throw new Error(`Secret '${secretName}' does not exist`);
		}

		secret.tags = newTags;
		secret.updatedAt = new Date().toISOString();
		await this.writeSecretFile(secret);
	}

	// ============= CONVENIENCE METHODS =============

	async setSecretTag(secretName: string, key: string, value: string): Promise<void> {
		await this.addSecretTags(secretName, [{ Key: key, Value: value }]);
	}

	async removeSecretTag(secretName: string, tagKey: string): Promise<void> {
		await this.removeSecretTags(secretName, [tagKey]);
	}

	async hasSecretTag(secretName: string, tagKey: string): Promise<boolean> {
		const tags = await this.getSecretTags(secretName);
		return tags.some((tag) => tag.Key === tagKey);
	}

	async getSecretTagValue(secretName: string, tagKey: string): Promise<string | null> {
		const tags = await this.getSecretTags(secretName);
		const tag = tags.find((t) => t.Key === tagKey);
		return tag ? tag.Value : null;
	}

	// ============= METADATA OPERATIONS =============

	async getSecretMetadata(secretName: string): Promise<SecretMetadata | null> {
		const secret = await this.readSecretFile(secretName);
		if (!secret) {
			return null;
		}

		return {
			name: secret.name,
			description: secret.description,
			tags: secret.tags,
			createdAt: new Date(secret.createdAt),
			updatedAt: new Date(secret.updatedAt),
		};
	}
}
