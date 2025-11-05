/**
 * Generic interface for parameter storage
 * Abstracts parameter/configuration management to allow multiple implementations
 * (AWS SSM Parameter Store, local filesystem, environment variables, etc.)
 */

export type ParameterType = 'String' | 'SecureString' | 'StringList';

export interface ParameterMetadata {
  name: string;
  type: ParameterType;
  description?: string;
  version?: number;
  lastModified?: Date;
}

/**
 * IParameterStore - Abstract interface for parameter storage operations
 *
 * Implementations:
 * - AWSParameterStoreAdapter (production with AWS SSM Parameter Store)
 * - LocalParameterStoreAdapter (local development with filesystem)
 * - EnvParameterStoreAdapter (environment variables fallback)
 * - InMemoryParameterStoreAdapter (testing/mocking)
 */
export interface IParameterStore {
  // ============= CORE OPERATIONS =============

  /**
   * Store a parameter (create or overwrite)
   * @param name - Parameter name/path (hierarchical paths supported like /app/db/password)
   * @param value - Parameter value (can be string or object, objects are JSON-serialized)
   * @param description - Optional description
   * @param type - Parameter type (String, SecureString, StringList)
   */
  storeParameter(
    name: string,
    value: string | object,
    description?: string,
    type?: ParameterType
  ): Promise<void>;

  /**
   * Retrieve a parameter value
   * @param parameterName - Parameter name/path
   * @returns Parameter value with automatic type inference (JSON parsing for objects)
   *          Returns null if parameter doesn't exist
   */
  getParameter<T = string>(parameterName: string): Promise<T | null>;

  /**
   * Delete a parameter
   * @param parameterName - Parameter name/path
   * @returns true if deleted, false if didn't exist
   */
  deleteParameter(parameterName: string): Promise<boolean>;

  /**
   * Check if a parameter exists
   * @param parameterName - Parameter name/path
   * @returns true if parameter exists
   */
  hasParameter(parameterName: string): Promise<boolean>;

  // ============= BATCH OPERATIONS =============

  /**
   * Get multiple parameters by path prefix
   * @param path - Path prefix (e.g., /app/db/ to get all db parameters)
   * @param recursive - If true, include all nested paths
   * @returns Map of parameter names to values
   */
  getParametersByPath(
    path: string,
    recursive?: boolean
  ): Promise<Map<string, string>>;

  /**
   * Delete multiple parameters by path prefix
   * @param path - Path prefix
   * @param recursive - If true, delete all nested paths
   * @returns Number of parameters deleted
   */
  deleteParametersByPath(path: string, recursive?: boolean): Promise<number>;

  // ============= METADATA OPERATIONS =============

  /**
   * Get parameter metadata without retrieving the value
   * @param parameterName - Parameter name/path
   * @returns Parameter metadata or null if not found
   */
  getParameterMetadata(
    parameterName: string
  ): Promise<ParameterMetadata | null>;

  /**
   * List all parameter names matching a path prefix
   * @param path - Path prefix (optional, lists all if not specified)
   * @param recursive - If true, include all nested paths
   * @returns Array of parameter names
   */
  listParameters(path?: string, recursive?: boolean): Promise<string[]>;

  // ============= NAMESPACE OPERATIONS =============

  /**
   * Get the base prefix/namespace for this parameter store instance
   * Useful for multi-tenant or multi-environment deployments
   * @returns Base prefix string (e.g., "/app/prod/")
   */
  getBasePrefix(): string;

  /**
   * Build a full parameter path from a relative name
   * @param name - Relative parameter name
   * @returns Full path including base prefix
   */
  buildParameterPath(name: string): string;
}