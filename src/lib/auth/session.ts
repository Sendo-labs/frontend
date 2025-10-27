import { cookies } from 'next/headers';
import privy from './privy';
import type { User } from '@privy-io/node';

export type PrivySession = {
	user: User;
};

/**
 * Get the server session
 * @returns The server session
 */
export async function getServerSession(): Promise<PrivySession | null> {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('privy-id-token')?.value;

		if (!token) {
			console.log('No token found');
			return null;
		}

		// Récupère l'utilisateur
		const user = await privy.users().get({ id_token: token });

		return {
			user,
		};
	} catch (error) {
		console.error('Error verifying auth token:', error);
		return null;
	}
}
