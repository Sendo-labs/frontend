import { getAwsProfile } from '@/lib/aws/profile';
import {
    DeleteParameterCommand,
    GetParameterCommand,
    ParameterType,
    PutParameterCommand,
    SSMClient,
    type SSMClientConfig,
    SSMServiceException,
} from '@aws-sdk/client-ssm';
import { fromSSO } from '@aws-sdk/credential-provider-sso';

export class SSMParameterServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SSMParameterServiceError';
    }
}

/**
 * Service for managing parameters in AWS Systems Manager Parameter Store
 *
 * Features:
 * - Secure storage of any parameters using SecureString parameters
 * - Generic parameter operations (get, set, delete, has)
 * - Automatic credential management (SSO for dev, default for prod)
 * - Proper error handling and logging
 * - Type-safe operations
 */
export class SSMParameterService {
    private client: SSMClient;
    private basePrefix: string;

    constructor(basePrefix = '') {
        const isDev = process.env.NODE_ENV === 'development';
        const clientConfig: SSMClientConfig = {
            region: 'eu-west-3',
        };
        if (isDev) {
            clientConfig.credentials = fromSSO({ profile: getAwsProfile() });
        }
        this.client = new SSMClient(clientConfig);
        this.basePrefix = basePrefix;
    }

    /**
     * Generic method to store any parameter in SSM
     * @param parameterName - The name of the parameter to store
     * @param value - The value of the parameter to store
     * @param description - The description of the parameter to store
     * @param type - The type of the parameter to store
     * @returns void
     */
    async storeParameter(
        parameterName: string,
        value: string | object,
        description?: string,
        type = ParameterType.SECURE_STRING,
    ): Promise<void> {
        try {
            const parameterValue = typeof value === 'string' ? value : JSON.stringify(value);

            await this.client.send(
                new PutParameterCommand({
                    Name: parameterName,
                    Value: parameterValue,
                    Type: type,
                    Overwrite: true,
                    Description: description,
                }),
            );
        } catch (error) {
            if (error instanceof SSMServiceException) {
                throw new SSMParameterServiceError(`Failed to store parameter: ${error.message}`);
            }
            throw new SSMParameterServiceError(
                `Failed to store parameter: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    /**
     * Generic method to retrieve any parameter from SSM
     * @param parameterName - The name of the parameter to retrieve
     * @returns the parameter value, or null if the parameter does not exist
     */
    async getParameter<T = string>(parameterName: string): Promise<T | null> {
        try {
            const response = await this.client.send(
                new GetParameterCommand({
                    Name: parameterName,
                    WithDecryption: true,
                }),
            );

            if (!response.Parameter?.Value) {
                return null;
            }

            // Try to parse as JSON, fallback to string
            try {
                return JSON.parse(response.Parameter.Value) as T;
            } catch {
                return response.Parameter.Value as T;
            }
        } catch (error: unknown) {
            if (error instanceof SSMServiceException && error.name === 'ParameterNotFound') {
                return null;
            }

            if (error instanceof SSMServiceException) {
                throw new SSMParameterServiceError(`Failed to retrieve parameter: ${error.message}`);
            }

            throw new SSMParameterServiceError(
                `Failed to retrieve parameter: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    /**
     * Generic method to delete any parameter from SSM
     * @param parameterName - The name of the parameter to delete
     * @returns void
     */
    async deleteParameter(parameterName: string): Promise<void> {
        try {
            await this.client.send(
                new DeleteParameterCommand({
                    Name: parameterName,
                }),
            );
        } catch (error: unknown) {
            if (error instanceof SSMServiceException && error.name === 'ParameterNotFound') {
                return; // Silently ignore if parameter doesn't exist
            }

            if (error instanceof SSMServiceException) {
                throw new SSMParameterServiceError(`Failed to delete parameter: ${error.message}`);
            }

            throw new SSMParameterServiceError(
                `Failed to delete parameter: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    /**
     * Check if a parameter exists
     * @param parameterName - The name of the parameter to check
     * @returns true if the parameter exists, false otherwise
     */
    async hasParameter(parameterName: string): Promise<boolean> {
        try {
            const value = await this.getParameter(parameterName);
            return value !== null;
        } catch {
            return false;
        }
    }

    /**
     * Get the base prefix for this service instance
     * @returns the base prefix for this service instance
     */
    getBasePrefix(): string {
        return this.basePrefix;
    }
}

// Export singleton instance for backward compatibility
export const ssmParameterService = new SSMParameterService();
export default ssmParameterService;
