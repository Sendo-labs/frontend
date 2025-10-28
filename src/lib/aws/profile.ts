/**
 * AWS Profile utility for managing environment-specific configurations
 *
 * This utility provides a centralized way to determine the current AWS profile
 * by checking PROFILE environment variable first, then falling back to AWS_DEFAULT_PROFILE
 */

/**
 * Get the current AWS profile
 * Priority: PROFILE env var > AWS_DEFAULT_PROFILE env var > 'pre-prod' default
 * @returns The current AWS profile string
 */
export function getAwsProfile(): string {
    return process.env.PROFILE || process.env.AWS_DEFAULT_PROFILE || 'pre-prod';
}

/**
 * Check if current profile is pre-production
 * @returns true if current profile is 'pre-prod'
 */
export function isPreProdProfile(): boolean {
    return getAwsProfile() === 'pre-prod';
}

/**
 * Check if current profile is production
 * @returns true if current profile is 'prod'
 */
export function isProdProfile(): boolean {
    return getAwsProfile() === 'prod';
}

/**
 * Get environment-specific resource name based on current profile
 * @param preProdName - Resource name for pre-production
 * @param prodName - Resource name for production
 * @returns The appropriate resource name for current profile
 */
export function getProfileBasedResource(preProdName: string, prodName: string): string {
    return isPreProdProfile() ? preProdName : prodName;
}
