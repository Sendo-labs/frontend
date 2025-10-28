import { getAwsProfile } from '@/lib/aws/profile';
import {
    CreateSecretCommand,
    DeleteSecretCommand,
    DescribeSecretCommand,
    GetSecretValueCommand,
    ListSecretsCommand,
    PutSecretValueCommand,
    SecretsManagerClient,
    type SecretsManagerClientConfig,
    SecretsManagerServiceException,
    type Tag,
    TagResourceCommand,
    UntagResourceCommand,
    UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager';
import { fromSSO } from '@aws-sdk/credential-provider-sso';

export class SecretManagerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SecretManagerError';
    }
}

export class SecretManagerService {
    client: SecretsManagerClient;

    constructor() {
        const isDev = process.env.NODE_ENV === 'development';
        const clientConfig: SecretsManagerClientConfig = {
            region: 'eu-west-3',
        };
        if (isDev) {
            clientConfig.credentials = fromSSO({ profile: getAwsProfile() });
        }
        this.client = new SecretsManagerClient(clientConfig);
    }

    async getSecrets(): Promise<string[]> {
        try {
            const response = await this.client.send(new ListSecretsCommand({}));
            return response.SecretList?.map((secret) => secret.Name || '') || [];
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to list secrets: ${error.message}`);
            }
            throw error;
        }
    }

    async getSecret(secretName: string): Promise<string | undefined> {
        try {
            const response = await this.client.send(
                new GetSecretValueCommand({
                    SecretId: secretName,
                }),
            );

            return response.SecretString;
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to get secret: ${error.message}`);
            }
            throw error;
        }
    }

    async createSecret(secretName: string, secretValue: string, description?: string): Promise<string | undefined> {
        try {
            const response = await this.client.send(
                new CreateSecretCommand({
                    Name: secretName,
                    SecretString: secretValue,
                    Description: description,
                }),
            );

            return response.ARN;
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to create secret: ${error.message}`);
            }
            throw error;
        }
    }

    async updateSecret(secretName: string, secretValue: string): Promise<string | undefined> {
        try {
            const response = await this.client.send(
                new UpdateSecretCommand({
                    SecretId: secretName,
                    SecretString: secretValue,
                }),
            );

            return response.ARN;
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to update secret: ${error.message}`);
            }
            throw error;
        }
    }

    async putSecret(secretName: string, secretValue: string): Promise<string | undefined> {
        try {
            const response = await this.client.send(
                new PutSecretValueCommand({
                    SecretId: secretName,
                    SecretString: secretValue,
                }),
            );

            return response.ARN;
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to put secret: ${error.message}`);
            }
            throw error;
        }
    }

    async deleteSecret(secretName: string, forceDelete = false): Promise<void> {
        try {
            await this.client.send(
                new DeleteSecretCommand({
                    SecretId: secretName,
                    ForceDeleteWithoutRecovery: forceDelete,
                }),
            );
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to delete secret: ${error.message}`);
            }
            throw error;
        }
    }

    async listSecrets(maxResults = 100): Promise<string[]> {
        try {
            const response = await this.client.send(
                new ListSecretsCommand({
                    MaxResults: maxResults,
                }),
            );

            const secrets = response.SecretList?.map((secret) => secret.Name || '') || [];
            return secrets;
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to list secrets: ${error.message}`);
            }
            throw error;
        }
    }

    async getSecretTags(secretName: string): Promise<Tag[]> {
        try {
            const response = await this.client.send(
                new DescribeSecretCommand({
                    SecretId: secretName,
                }),
            );

            return response.Tags || [];
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to get tags for secret '${secretName}': ${error.message}`);
            }
            throw error;
        }
    }

    async addSecretTags(secretName: string, tags: Tag[]): Promise<void> {
        try {
            await this.client.send(
                new TagResourceCommand({
                    SecretId: secretName,
                    Tags: tags,
                }),
            );
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to add tags to secret '${secretName}': ${error.message}`);
            }
            throw error;
        }
    }

    async removeSecretTags(secretName: string, tagKeys: string[]): Promise<void> {
        try {
            await this.client.send(
                new UntagResourceCommand({
                    SecretId: secretName,
                    TagKeys: tagKeys,
                }),
            );
        } catch (error) {
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to remove tags from secret '${secretName}': ${error.message}`);
            }
            throw error;
        }
    }

    async updateSecretTags(secretName: string, newTags: Tag[]): Promise<void> {
        try {
            const existingTags = await this.getSecretTags(secretName);

            if (existingTags.length > 0) {
                const existingTagKeys = existingTags.map((tag) => tag.Key || '');
                await this.removeSecretTags(secretName, existingTagKeys);
            }

            if (newTags.length > 0) {
                await this.addSecretTags(secretName, newTags);
            }
        } catch (error) {
            if (error instanceof SecretManagerError) {
                throw error;
            }
            if (error instanceof SecretsManagerServiceException) {
                throw new SecretManagerError(`Failed to update tags for secret '${secretName}': ${error.message}`);
            }
            throw error;
        }
    }

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

    async getSecretTagValue(secretName: string, tagKey: string): Promise<string | undefined> {
        const tags = await this.getSecretTags(secretName);
        const tag = tags.find((tag) => tag.Key === tagKey);
        return tag?.Value;
    }
}

export const secretManagerService = new SecretManagerService();

export default secretManagerService;