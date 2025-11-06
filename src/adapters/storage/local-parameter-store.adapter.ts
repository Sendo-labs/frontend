/**
 * Local filesystem implementation of IParameterStore
 * Stores parameters as JSON files in a local directory
 * Perfect for local development without AWS dependencies
 */

import fs from 'fs/promises';
import path from 'path';
import { IParameterStore, ParameterType, ParameterMetadata } from '@/interfaces/storage/iparameter-store';

interface StoredParameter {
	name: string;
	value: string;
	type: ParameterType;
	description?: string;
	version: number;
	lastModified: string;
}

export class LocalParameterStoreAdapter implements IParameterStore {
	private storageDir: string;
	private basePrefix: string;

	constructor(storageDir?: string, basePrefix?: string) {
		// Default to .local-parameters in project root
		this.storageDir = storageDir || path.join(process.cwd(), '.local-storage', 'parameters');
		this.basePrefix = basePrefix || '';
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
	 * Convert parameter name to file path
	 * Handles hierarchical paths like /openrouter/user-123/api_key
	 */
	private getParameterPath(parameterName: string): string {
		// Apply base prefix if provided
		const fullName = this.buildParameterPath(parameterName);

		// Convert /path/to/param to path-to-param.json
		const sanitized = fullName
			.replace(/^\/+/, '') // Remove leading slashes
			.replace(/\/+/g, '-') // Replace / with -
			.replace(/[^a-zA-Z0-9._-]/g, '_'); // Sanitize other chars

		return path.join(this.storageDir, `${sanitized}.json`);
	}

	/**
	 * Read a parameter file
	 */
	private async readParameterFile(parameterName: string): Promise<StoredParameter | null> {
		try {
			const filePath = this.getParameterPath(parameterName);
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
	 * Write a parameter file
	 */
	private async writeParameterFile(param: StoredParameter): Promise<void> {
		await this.ensureStorageDir();
		const filePath = this.getParameterPath(param.name);
		await fs.writeFile(filePath, JSON.stringify(param, null, 2), 'utf-8');
	}

	/**
	 * Parse parameter value with type inference
	 */
	private parseValue<T>(value: string, type: ParameterType): T {
		if (type === 'StringList') {
			return JSON.parse(value) as T;
		}

		// Try to parse as JSON for objects
		try {
			return JSON.parse(value) as T;
		} catch {
			// Return as string if not valid JSON
			return value as T;
		}
	}

	// ============= CORE OPERATIONS =============

	async storeParameter(
		name: string,
		value: string | object,
		description?: string,
		type: ParameterType = 'SecureString',
	): Promise<void> {
		const existing = await this.readParameterFile(name);

		const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

		const param: StoredParameter = {
			name,
			value: stringValue,
			type,
			description,
			version: existing ? existing.version + 1 : 1,
			lastModified: new Date().toISOString(),
		};

		await this.writeParameterFile(param);
	}

	async getParameter<T = string>(parameterName: string): Promise<T | null> {
		const param = await this.readParameterFile(parameterName);
		if (!param) {
			return null;
		}

		return this.parseValue<T>(param.value, param.type);
	}

	async deleteParameter(parameterName: string): Promise<boolean> {
		try {
			const filePath = this.getParameterPath(parameterName);
			await fs.unlink(filePath);
			return true;
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				return false;
			}
			throw error;
		}
	}

	async hasParameter(parameterName: string): Promise<boolean> {
		const param = await this.readParameterFile(parameterName);
		return param !== null;
	}

	// ============= BATCH OPERATIONS =============

	async getParametersByPath(pathPrefix: string, recursive: boolean = false): Promise<Map<string, string>> {
		await this.ensureStorageDir();
		const result = new Map<string, string>();

		try {
			const files = await fs.readdir(this.storageDir);

			for (const file of files) {
				if (!file.endsWith('.json')) continue;

				const filePath = path.join(this.storageDir, file);
				const content = await fs.readFile(filePath, 'utf-8');
				const param: StoredParameter = JSON.parse(content);

				// Check if parameter matches the path prefix
				const fullName = this.buildParameterPath(param.name);
				if (fullName.startsWith(pathPrefix)) {
					// If not recursive, only match immediate children
					if (!recursive) {
						const remainder = fullName.slice(pathPrefix.length);
						if (remainder.includes('/')) continue;
					}

					result.set(param.name, param.value);
				}
			}
		} catch (error) {
			// Return empty map if directory doesn't exist
		}

		return result;
	}

	async deleteParametersByPath(pathPrefix: string, recursive: boolean = false): Promise<number> {
		const parameters = await this.getParametersByPath(pathPrefix, recursive);
		let deletedCount = 0;

		for (const paramName of parameters.keys()) {
			const deleted = await this.deleteParameter(paramName);
			if (deleted) deletedCount++;
		}

		return deletedCount;
	}

	// ============= METADATA OPERATIONS =============

	async getParameterMetadata(parameterName: string): Promise<ParameterMetadata | null> {
		const param = await this.readParameterFile(parameterName);
		if (!param) {
			return null;
		}

		return {
			name: param.name,
			type: param.type,
			description: param.description,
			version: param.version,
			lastModified: new Date(param.lastModified),
		};
	}

	async listParameters(pathPrefix?: string, recursive: boolean = false): Promise<string[]> {
		await this.ensureStorageDir();
		const names: string[] = [];

		try {
			const files = await fs.readdir(this.storageDir);

			for (const file of files) {
				if (!file.endsWith('.json')) continue;

				const filePath = path.join(this.storageDir, file);
				const content = await fs.readFile(filePath, 'utf-8');
				const param: StoredParameter = JSON.parse(content);

				if (!pathPrefix) {
					names.push(param.name);
					continue;
				}

				// Check if parameter matches the path prefix
				const fullName = this.buildParameterPath(param.name);
				if (fullName.startsWith(pathPrefix)) {
					// If not recursive, only match immediate children
					if (!recursive) {
						const remainder = fullName.slice(pathPrefix.length);
						if (remainder.includes('/')) continue;
					}

					names.push(param.name);
				}
			}
		} catch (error) {
			// Return empty array if directory doesn't exist
		}

		return names;
	}

	// ============= NAMESPACE OPERATIONS =============

	getBasePrefix(): string {
		return this.basePrefix;
	}

	buildParameterPath(name: string): string {
		if (!this.basePrefix) {
			return name;
		}

		// Ensure proper path formatting
		const prefix = this.basePrefix.endsWith('/') ? this.basePrefix : `${this.basePrefix}/`;
		const cleanName = name.startsWith('/') ? name.slice(1) : name;

		return `${prefix}${cleanName}`;
	}
}
