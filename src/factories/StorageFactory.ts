/**
 * Storage Factory - Automatically selects the appropriate storage adapter
 * based on environment configuration
 *
 * Usage:
 *   const secretStore = StorageFactory.createSecretStore();
 *   const paramStore = StorageFactory.createParameterStore();
 *
 * Configuration via environment variables:
 *   STORAGE_PROVIDER=aws|local (default: auto-detect)
 *   LOCAL_STORAGE_DIR=/path/to/storage (for local adapter)
 *   PARAMETER_STORE_PREFIX=/app/env (for SSM prefix)
 */

import { ISecretStore } from '@/interfaces/storage/ISecretStore';
import { IParameterStore } from '@/interfaces/storage/IParameterStore';
import { AWSSecretStoreAdapter } from '@/adapters/storage/AWSSecretStoreAdapter';
import { AWSParameterStoreAdapter } from '@/adapters/storage/AWSParameterStoreAdapter';
import { LocalSecretStoreAdapter } from '@/adapters/storage/LocalSecretStoreAdapter';
import { LocalParameterStoreAdapter } from '@/adapters/storage/LocalParameterStoreAdapter';

export type StorageProvider = 'aws' | 'local';

export interface StorageConfig {
	provider?: StorageProvider;
	localStorageDir?: string;
	parameterStorePrefix?: string;
}

export class StorageFactory {
	/**
	 * Detect which storage provider to use based on environment
	 * Prioritizes explicit STORAGE_PROVIDER env var, then checks for AWS credentials
	 */
	private static detectProvider(): StorageProvider {
		// Explicit provider override
		const envProvider = process.env.STORAGE_PROVIDER?.toLowerCase();
		if (envProvider === 'aws' || envProvider === 'local') {
			return envProvider;
		}

		// Auto-detect based on environment
		// Use local storage if:
		// 1. NODE_ENV is development AND no AWS profile is set
		// 2. STORAGE_PROVIDER explicitly set to 'local'
		const isDevelopment = process.env.NODE_ENV === 'development';
		const hasAwsProfile = process.env.AWS_DEFAULT_PROFILE || process.env.PROFILE;

		if (isDevelopment && !hasAwsProfile) {
			console.log('[StorageFactory] Auto-detected: Using local storage (no AWS profile found)');
			return 'local';
		}

		// Default to AWS in production or when profile is configured
		console.log('[StorageFactory] Auto-detected: Using AWS storage');
		return 'aws';
	}

	/**
	 * Create a SecretStore instance based on configuration
	 */
	static createSecretStore(config?: StorageConfig): ISecretStore {
		const provider = config?.provider || this.detectProvider();

		switch (provider) {
			case 'aws':
				return new AWSSecretStoreAdapter();

			case 'local':
				return new LocalSecretStoreAdapter(config?.localStorageDir);

			default:
				throw new Error(`Unknown storage provider: ${provider}`);
		}
	}

	/**
	 * Create a ParameterStore instance based on configuration
	 */
	static createParameterStore(config?: StorageConfig): IParameterStore {
		const provider = config?.provider || this.detectProvider();

		switch (provider) {
			case 'aws':
				return new AWSParameterStoreAdapter(config?.parameterStorePrefix);

			case 'local':
				return new LocalParameterStoreAdapter(config?.localStorageDir, config?.parameterStorePrefix);

			default:
				throw new Error(`Unknown storage provider: ${provider}`);
		}
	}

	/**
	 * Create both stores with the same configuration
	 */
	static createStores(config?: StorageConfig): {
		secretStore: ISecretStore;
		parameterStore: IParameterStore;
	} {
		return {
			secretStore: this.createSecretStore(config),
			parameterStore: this.createParameterStore(config),
		};
	}

	/**
	 * Get the current provider (useful for debugging/logging)
	 */
	static getCurrentProvider(config?: StorageConfig): StorageProvider {
		return config?.provider || this.detectProvider();
	}
}

/**
 * Convenience function to get storage instances
 * This is the recommended way to get storage in your application
 */
export function getStorageProviders(config?: StorageConfig) {
	return StorageFactory.createStores(config);
}
