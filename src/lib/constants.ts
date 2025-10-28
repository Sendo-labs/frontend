export const WORKER_AGENT_NAME = 'sendo-worker';
export const CHAT_AGENT_NAME = 'sendo-chat';

// Kenny service base URL - this should be configured per environment
export const KENNY_BASE_URL = process.env.NEXT_PUBLIC_KENNY_BASE_URL || 'https://api.usekenny.com';

export const SOCIAL_LINKS = {
	Twitter: {
		url: 'https://x.com/SendoMarket',
		username: 'SendoMarket',
	},
	Farcaster: {
		url: 'https://tr.ee/2qngnmSoK1',
		username: 'sendomarket',
	},
	Discord: {
		url: 'https://discord.gg/Anf3rkF2s',
		username: 'discord.gg/Anf3rkF2s',
	},
	Email: {
		url: 'sendo.market@proton.me',
		username: 'sendo.market@proton.me',
	},
};
