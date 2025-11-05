/**
 * Generic interface for secret storage
 * Abstracts secret management operations to allow multiple implementations
 * (AWS Secrets Manager, local filesystem, in-memory, etc.)
 */

export interface Tag {
  Key: string;
  Value: string;
}

export interface SecretMetadata {
  name: string;
  description?: string;
  tags?: Tag[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ISecretStore - Abstract interface for secret storage operations
 *
 * Implementations:
 * - AWSSecretStoreAdapter (production with AWS Secrets Manager)
 * - LocalSecretStoreAdapter (local development with filesystem)
 * - InMemorySecretStoreAdapter (testing/mocking)
 */
export interface ISecretStore {
  // ============= CORE OPERATIONS =============

  /**
   * List all available secret names
   * @returns Array of secret names/identifiers
   */
  getSecrets(): Promise<string[]>;

  /**
   * Retrieve a secret value by name
   * @param secretName - Unique identifier for the secret
   * @returns Secret value as string, or null if not found
   */
  getSecret(secretName: string): Promise<string | null>;

  /**
   * Create a new secret
   * @param name - Unique identifier for the secret
   * @param value - Secret value (will be encrypted at rest)
   * @param description - Optional description of the secret
   * @throws Error if secret already exists
   */
  createSecret(
    name: string,
    value: string,
    description?: string
  ): Promise<void>;

  /**
   * Update an existing secret value
   * @param secretName - Unique identifier for the secret
   * @param secretValue - New secret value
   * @throws Error if secret doesn't exist
   */
  updateSecret(secretName: string, secretValue: string): Promise<void>;

  /**
   * Put/overwrite a secret (create if doesn't exist, update if exists)
   * @param secretName - Unique identifier for the secret
   * @param secretValue - Secret value
   */
  putSecret(secretName: string, secretValue: string): Promise<void>;

  /**
   * Delete a secret
   * @param secretName - Unique identifier for the secret
   * @param forceDelete - If true, delete immediately; if false, schedule deletion
   * @returns true if deleted, false if not found
   */
  deleteSecret(secretName: string, forceDelete?: boolean): Promise<boolean>;

  // ============= TAG OPERATIONS =============

  /**
   * Get all tags associated with a secret
   * @param secretName - Unique identifier for the secret
   * @returns Array of tags or empty array if no tags
   */
  getSecretTags(secretName: string): Promise<Tag[]>;

  /**
   * Add tags to a secret (preserves existing tags)
   * @param secretName - Unique identifier for the secret
   * @param tags - Tags to add
   */
  addSecretTags(secretName: string, tags: Tag[]): Promise<void>;

  /**
   * Remove specific tags from a secret by key
   * @param secretName - Unique identifier for the secret
   * @param tagKeys - Array of tag keys to remove
   */
  removeSecretTags(secretName: string, tagKeys: string[]): Promise<void>;

  /**
   * Replace all tags for a secret
   * @param secretName - Unique identifier for the secret
   * @param newTags - New set of tags (replaces all existing)
   */
  updateSecretTags(secretName: string, newTags: Tag[]): Promise<void>;

  // ============= CONVENIENCE METHODS =============

  /**
   * Set a single tag on a secret
   * @param secretName - Unique identifier for the secret
   * @param key - Tag key
   * @param value - Tag value
   */
  setSecretTag(secretName: string, key: string, value: string): Promise<void>;

  /**
   * Remove a single tag from a secret
   * @param secretName - Unique identifier for the secret
   * @param tagKey - Tag key to remove
   */
  removeSecretTag(secretName: string, tagKey: string): Promise<void>;

  /**
   * Check if a secret has a specific tag
   * @param secretName - Unique identifier for the secret
   * @param tagKey - Tag key to check
   * @returns true if tag exists
   */
  hasSecretTag(secretName: string, tagKey: string): Promise<boolean>;

  /**
   * Get the value of a specific tag
   * @param secretName - Unique identifier for the secret
   * @param tagKey - Tag key
   * @returns Tag value or null if tag doesn't exist
   */
  getSecretTagValue(
    secretName: string,
    tagKey: string
  ): Promise<string | null>;

  // ============= METADATA OPERATIONS =============

  /**
   * Get metadata about a secret without retrieving its value
   * @param secretName - Unique identifier for the secret
   * @returns Secret metadata or null if not found
   */
  getSecretMetadata(secretName: string): Promise<SecretMetadata | null>;
}