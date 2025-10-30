import type { SecretTags } from '@/types/agent';
import type { Tag } from '@aws-sdk/client-secrets-manager';

export function getSecretTags(tags: SecretTags): Tag[] {
	return Object.entries(tags).map(([key, value]) => ({
		Key: key,
		Value: value.toString(),
	}));
}
