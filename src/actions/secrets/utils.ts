import type { Tag } from '@/interfaces/storage/isecret-store';
import type { SecretTags } from '@/types/agent';

export function getSecretTags(tags: SecretTags): Tag[] {
	return Object.entries(tags).map(([key, value]) => ({
		Key: key,
		Value: value.toString(),
	}));
}
