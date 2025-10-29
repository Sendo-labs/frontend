export class KennyService {
	private static instance: KennyService | null = null;
	private baseUrl: string;
	private apiKey: string;

	private constructor(userId: string, apiKey: string) {
		this.baseUrl = `https://${userId}.agents.usekenny.com/`;
		this.apiKey = apiKey;
	}

	/**
	 * Get the singleton instance of KennyService
	 */
	public static getInstance(userId: string, apiKey: string): KennyService {
		if (!KennyService.instance) {
			KennyService.instance = new KennyService(userId, apiKey);
		}
		return KennyService.instance;
	}

	getBaseUrl(): string {
		return this.baseUrl;
	}

	getApiKey(): string {
		return this.apiKey;
	}

	/**
	 * Make a request to the Kenny API using fetch including the API key in the headers
	 * @param {string} path - The path to the API endpoint
	 * @param {string} method - The HTTP method to use
	 * @param {any} body - The body of the request
	 * @returns {Promise<T>} - The response from the API
	 */
	async apiRequest<T>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: any): Promise<T> {
		const url = `${this.baseUrl}${path}`;
		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					'X-API-KEY': this.apiKey || '',
				},
				...(body && { body: JSON.stringify(body) }),
			});

			if (!response.ok) {
				throw new Error(`API request failed: ${response.status} ${response.statusText}`);
			}

			return response.json() as Promise<T>;
		} catch (error) {
			console.error(`[KennyService] API request to ${path} failed:`, error);
			throw error;
		}
	}
}
