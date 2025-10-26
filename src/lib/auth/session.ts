import { cookies } from 'next/headers';
import privy from './privy';
import type { User } from '@privy-io/node';

export type PrivySession = {
	user: User;
};

export async function getServerSession(): Promise<PrivySession | null> {
	try {
		const cookieStore = await cookies();
		const authToken = cookieStore.get('privy-token')?.value;

		if (!authToken) {
			return null;
		}

		const user = await privy.utils().auth().verifyIdentityToken(authToken);

		return {
			user,
		};
	} catch (error) {
		console.error('Error verifying auth token:', error);
		return null;
	}
}
