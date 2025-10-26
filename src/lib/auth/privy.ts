import { PrivyClient } from '@privy-io/node';

if (!process.env.PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) {
	throw new Error('PRIVY_APP_ID and PRIVY_APP_SECRET are required');
}

const privy = new PrivyClient({
	appId: process.env.PRIVY_APP_ID,
	appSecret: process.env.PRIVY_APP_SECRET,
});

export default privy;
