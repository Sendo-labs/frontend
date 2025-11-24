'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';

export default function RecallSection() {
	const router = useRouter();
	const { ready, authenticated, login, user } = usePrivy();
	const { wallets } = useWallets();

	const embeddedWallet = user?.wallet?.address;
	const connectedWallet = wallets.find((w) => w.address);
	const walletAddress = embeddedWallet || connectedWallet?.address;

	const handleScanWallet = () => {
		if (walletAddress) {
			router.push(`/analyzer?wallet=${walletAddress}`);
		} else {
			login();
		}
	};

	return (
		<section className='w-full bg-[#050505] py-24 px-4 sm:px-6 relative overflow-hidden'>
			{/* Atmospheric Background */}
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0505] via-[#050505] to-black opacity-60 pointer-events-none' />

			{/* Subtle animated grain/noise can be added here if desired, but keeping it clean for now */}

			{/* Central Light Source */}
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sendo-red/10 blur-[120px] rounded-[100%] pointer-events-none mix-blend-screen' />

			{/* Top Highlight Line */}
			<div className='absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30' />

			<div className='max-w-4xl mx-auto text-center relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<h2
						className='text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-8'
						style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
					>
						Ready to face the <span className='font-bold text-sendo-red'>truth</span>?
					</h2>

					<button
						type='button'
						onClick={handleScanWallet}
						disabled={!ready}
						className='arc-raiders-pill-button text-base sm:text-lg md:text-xl mx-auto'
						style={{
							fontFamily: 'var(--font-ibm-plex-sans), monospace',
						}}
					>
						<span>{authenticated && walletAddress ? 'ANALYZE MY WALLET' : 'ANALYZE YOUR WALLET'}</span>
						<span className='arrow'>→</span>
					</button>
				</motion.div>
			</div>
		</section>
	);
}
