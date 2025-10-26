import { cookies, headers } from 'next/headers';
import privy from './privy';
import type { User } from '@privy-io/node';

export type PrivySession = {
	user: User;
};

/**
 * INCOMPLETE: Must be improved to retreive the identity token
 * Get the server session
 * @returns The server session
 */
export async function getServerSession(): Promise<PrivySession | null> {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('privy-token')?.value;

		// Récupère depuis Authorization header
		// const authHeader = headersList.get('authorization');
		// let token: string | undefined;

		// if (authHeader?.startsWith('Bearer ')) {
		// 	token = authHeader.substring(7);
		// }

		if (!token) {
			console.log('No token found');
			return null;
		}

		// Vérifie le token avec verifyAuthToken (pour access token)
		const claims = await privy.utils().auth().verifyAuthToken(token);
		console.log('claims', JSON.stringify(claims, null, 2));

		// Récupère l'utilisateur
		const user = await privy.users().get({ id_token: claims.user_id });
		console.log('user', JSON.stringify(user, null, 2));

		return {
			user,
		};
	} catch (error) {
		console.error('Error verifying auth token:', error);
		return null;
	}
}
