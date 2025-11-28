'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/button';

export function LoginButton() {
	const { ready, authenticated, login, logout } = usePrivy();

	if (authenticated) {
		return (
			<div className='flex items-center gap-4'>
				<Button variant='nav-link' type='button' onClick={logout} disabled={!ready}>
					Logout
				</Button>
			</div>
		);
	}

	return (
		<Button variant='nav-link' type='button' disabled={!ready} onClick={login}>
			LOGIN
		</Button>
	);
}
