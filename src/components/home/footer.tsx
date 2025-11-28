'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Mail, Twitter } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

const socialPlatforms = [
	{
		name: 'Twitter / X',
		username: SOCIAL_LINKS.Twitter.username,
		url: SOCIAL_LINKS.Twitter.url,
		icon: <Twitter className='w-5 h-5 text-white' />,
	},
	{
		name: 'Farcaster',
		username: SOCIAL_LINKS.Farcaster.username,
		url: SOCIAL_LINKS.Farcaster.url,
		icon: (
			<svg role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 fill-white'>
				<path d='M18.24.24H5.76C2.5789.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76-2.5789 5.76-5.76V6C24 2.8188 21.4212.24 18.24.24m.8155 17.1662v.504c.2868-.0256.5458.1905.5439.479v.5688h-5.1437v-.5688c-.0019-.2885.2576-.5047.5443-.479v-.504c0-.22.1525-.402.358-.458l-.0095-4.3645c-.1589-1.7366-1.6402-3.0979-3.4435-3.0979-1.8038 0-3.2846 1.3613-3.4435 3.0979l-.0096 4.3578c.2276.0424.5318.2083.5395.4648v.504c.2863-.0256.5457.1905.5438.479v.5688H4.3915v-.5688c-.0019-.2885.2575-.5047.5438-.479v-.504c0-.2529.2011-.4548.4536-.4724v-7.895h-.4905L4.2898 7.008l2.6405-.0005V5.0419h9.9495v1.9656h2.8219l-.6091 2.0314h-.4901v7.8949c.2519.0177.453.2195.453.4724' />
			</svg>
		),
	},
	{
		name: 'Discord',
		username: SOCIAL_LINKS.Discord.username,
		url: 'https://discord.gg/sendo-market',
		icon: (
			<svg role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 fill-white'>
				<path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z' />
			</svg>
		),
	},
	{
		name: 'Email',
		username: SOCIAL_LINKS.Email.username,
		url: `mailto:${SOCIAL_LINKS.Email.url}`,
		icon: <Mail className='w-5 h-5 text-white' />,
	},
];

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Marquee content for the separator effect
	const MarqueeContent = () => (
		<div className='flex items-center shrink-0'>
			{[1, 2, 3, 4].map((i) => (
				<div key={i} className='flex gap-8 items-center pr-8 text-sendo-red/20 font-mono text-sm'>
					<span>// SENDO PROTOCOL</span>
					<span>•</span>
					<span>EST. {currentYear}</span>
					<span>•</span>
					<span>DEGEN ANALYTICS</span>
					<span>•</span>
					<span>ALL RIGHTS RESERVED</span>
					<span>•</span>
				</div>
			))}
		</div>
	);

	return (
		<footer className='w-full bg-black border-t border-white/10 relative overflow-hidden'>
			{/* Scanner Effect Top Border */}
			<div className='absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sendo-red to-transparent opacity-50' />

			{/* Animated Marquee Background (Subtle) */}
			<div className='absolute top-0 left-0 right-0 h-12 overflow-hidden opacity-30 pointer-events-none select-none'>
				<motion.div
					className='flex whitespace-nowrap'
					animate={{ x: '-50%' }}
					transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
				>
					<MarqueeContent />
					<MarqueeContent />
				</motion.div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8 relative z-10'>
				<div className='grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16'>
					{/* Brand Column */}
					<div className='md:col-span-5 flex flex-col items-start'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className='mb-6'
						>
							<img
								src='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png'
								alt='SENDO'
								className='h-8 w-auto opacity-90'
							/>
						</motion.div>
						<p className='text-[#D0D0D0] text-sm leading-relaxed max-w-xs mb-8 font-mono'>
							Uncovering the truth behind every trade.
							<br />
							Built by degens, for degens.
						</p>

						{/* Socials */}
						<div className='flex gap-4'>
							{socialPlatforms.map((platform, index) => (
								<motion.a
									key={platform.name}
									href={platform.url}
									target='_blank'
									rel='noopener noreferrer'
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1, duration: 0.4 }}
									className='w-10 h-10 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center hover:bg-sendo-red hover:border-sendo-red transition-all group'
								>
									<div className='transform group-hover:scale-110 transition-transform'>{platform.icon}</div>
								</motion.a>
							))}
						</div>
					</div>

					{/* Links Column */}
					<div className='md:col-span-3 md:col-start-7'>
						<h4 className='text-white font-bold uppercase tracking-wider mb-6 text-sm'>Platform</h4>
						<ul className='space-y-4 text-sm text-[#D0D0D0] font-mono'>
							<li>
								<a href='/analyzer' className='hover:text-sendo-red transition-colors flex items-center gap-2 group'>
									<span className='w-1 h-1 bg-sendo-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity' />{' '}
									Wallet Analyzer
								</a>
							</li>
							<li>
								<a href='#team' className='hover:text-sendo-red transition-colors flex items-center gap-2 group'>
									<span className='w-1 h-1 bg-sendo-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity' />{' '}
									The Guardians
								</a>
							</li>
							<li>
								<a href='#product' className='hover:text-sendo-red transition-colors flex items-center gap-2 group'>
									<span className='w-1 h-1 bg-sendo-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity' />{' '}
									Features
								</a>
							</li>
						</ul>
					</div>

					{/* Legal Column */}
					<div className='md:col-span-3'>
						<h4 className='text-white font-bold uppercase tracking-wider mb-6 text-sm'>Legal</h4>
						<ul className='space-y-4 text-sm text-[#D0D0D0] font-mono'>
							<li>
								<a href='#' className='hover:text-white transition-colors'>
									Terms of Service
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-white transition-colors'>
									Privacy Policy
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-white transition-colors'>
									Cookie Policy
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4'>
					<p className='text-[#D0D0D0]/40 text-xs font-mono'>© {currentYear} SENDO LABS. ALL RIGHTS RESERVED.</p>

					<motion.button
						onClick={scrollToTop}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='flex items-center gap-2 text-xs font-bold text-white uppercase bg-[#141414] border border-white/10 px-4 py-2 rounded-full hover:border-sendo-red/50 transition-colors group'
					>
						Back to Top
						<ArrowUp className='w-3 h-3 group-hover:-translate-y-0.5 transition-transform' />
					</motion.button>
				</div>
			</div>
		</footer>
	);
}
