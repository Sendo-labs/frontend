/**
 * AWS Systems Manager Parameter Store implementation of IParameterStore
 * Wraps the existing SSMParameterService to conform to the abstract interface
 */

import type { IParameterStore, ParameterType, ParameterMetadata } from '@/interfaces/storage/iparameter-store';
import { SSMParameterService } from '@/services/aws/ssm.service';
import { ParameterType as AWSParameterType } from '@aws-sdk/client-ssm';

export class AWSParameterStoreAdapter implements IParameterStore {
	private ssmService: SSMParameterService;

	constructor(basePrefix?: string) {
		this.ssmService = new SSMParameterService(basePrefix);
	}

	// ============= CORE OPERATIONS =============

	async storeParameter(
		name: string,
		value: string | object,
		description?: string,
		type?: ParameterType,
	): Promise<void> {
		// Map interface ParameterType to AWS SDK ParameterType
		let awsType: AWSParameterType | undefined;
		if (type) {
			switch (type) {
				case 'String':
					awsType = AWSParameterType.STRING;
					break;
				case 'SecureString':
					awsType = AWSParameterType.SECURE_STRING;
					break;
				case 'StringList':
					awsType = AWSParameterType.STRING_LIST;
					break;
			}
		}
		await this.ssmService.storeParameter(name, value, description, awsType);
	}

	async getParameter<T = string>(parameterName: string): Promise<T | null> {
		return this.ssmService.getParameter<T>(parameterName);
	}

	async deleteParameter(parameterName: string): Promise<boolean> {
		try {
			await this.ssmService.deleteParameter(parameterName);
			return true;
		} catch (error) {
			// SSM service already handles ParameterNotFound silently
			return false;
		}
	}

	async hasParameter(parameterName: string): Promise<boolean> {
		return this.ssmService.hasParameter(parameterName);
	}

	// ============= BATCH OPERATIONS =============

	async getParametersByPath(path: string, recursive: boolean = false): Promise<Map<string, string>> {
		// Note: This would require adding a new method to SSMParameterService
		// For now, we'll implement a basic version using getParameter
		// In a full implementation, you'd use GetParametersByPathCommand
		throw new Error('getParametersByPath not yet implemented. Add to SSMParameterService if needed.');
	}

	async deleteParametersByPath(path: string, recursive: boolean = false): Promise<number> {
		// Note: This would require batch deletion support in SSMParameterService
		throw new Error('deleteParametersByPath not yet implemented. Add to SSMParameterService if needed.');
	}

	// ============= METADATA OPERATIONS =============

	async getParameterMetadata(parameterName: string): Promise<ParameterMetadata | null> {
		// Note: To get full metadata, you'd need to use DescribeParametersCommand
		// For now, we'll return basic info if parameter exists
		const exists = await this.hasParameter(parameterName);
		if (!exists) {
			return null;
		}

		return {
			name: parameterName,
			type: 'SecureString', // Default type used by SSMParameterService
		};
	}

	async listParameters(path?: string, recursive: boolean = false): Promise<string[]> {
		// Note: This would require adding list functionality to SSMParameterService
		// You'd use GetParametersByPathCommand with names only
		throw new Error('listParameters not yet implemented. Add to SSMParameterService if needed.');
	}

	// ============= NAMESPACE OPERATIONS =============

	getBasePrefix(): string {
		return this.ssmService.getBasePrefix();
	}

	buildParameterPath(name: string): string {
		const basePrefix = this.getBasePrefix();
		if (!basePrefix) {
			return name;
		}

		// Ensure proper path formatting
		const prefix = basePrefix.endsWith('/') ? basePrefix : `${basePrefix}/`;
		const cleanName = name.startsWith('/') ? name.slice(1) : name;

		return `${prefix}${cleanName}`;
	}
}
