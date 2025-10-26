'use server';

import { getServerSession, type PrivySession } from '../auth/session';

type ActionFn<T> = ((session: PrivySession) => Promise<T>) | (() => Promise<T>);

/**
 * Wrapper function to handle actions with error handling.
 * @param action - The action to be executed.
 * @param authNeeded - Whether the action needs authentication.
 * @returns A promise that resolves to an ApiResponse containing the result of the action or an error response.
 */
export async function withAction<T>(action: ActionFn<T>, authNeeded = true): Promise<ActionResponse<T>> {
	try {
		let session: PrivySession | null = null;

		if (authNeeded) {
			session = await getServerSession();

			if (!session || !session.user) {
				throw new Error('Unauthorized');
			}
		}

		const data = await action(authNeeded ? (session as PrivySession) : (undefined as never));

		return { success: true, data };
	} catch (error) {
		console.error('[withAction] Error:', {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});

		return { success: false, error: `Error with action : ${error}` };
	}
}
