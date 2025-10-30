'use client';
import { motion } from 'framer-motion';
import { Share2, Twitter, Send, Download, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareResultData {
	total_missed_usd: number;
	rank: string;
}

interface ShareButtonsProps {
	result: ShareResultData;
}

export default function ShareButtons({ result }: ShareButtonsProps) {
	const handleShareTwitter = () => {
		const text = `I missed $${(result.total_missed_usd ?? 0).toLocaleString()} by not selling at ATH! 💀\n\nRank: ${result.rank}\n\nCheck your pain at sendo.ai`;
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	};

	const handleShareTelegram = () => {
		const text = `I missed $${(result.total_missed_usd ?? 0).toLocaleString()} by not selling at ATH! 💀\n\nCheck your pain at sendo.ai`;
		const url = `https://t.me/share/url?url=${encodeURIComponent('https://sendo.ai')}&text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	};

	const handleShareDiscord = () => {
		const text = `I missed $${(result.total_missed_usd ?? 0).toLocaleString()} by not selling at ATH! 💀 Rank: ${result.rank}\n\nCheck your pain at sendo.ai`;
		navigator.clipboard.writeText(text);
		alert('Copied to clipboard! Paste in Discord 📋');
	};

	const handleDownload = async () => {
		// Mock download - in real implementation would generate image
		console.log('Downloading pain card...');
		alert('Pain card download coming soon! 🎨');
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.6 }}
			className='bg-foreground/5 border border-foreground/10 p-6'
			style={{ borderRadius: 0 }}
		>
			<div className='flex items-center gap-2 mb-4'>
				<Share2 className='w-5 h-5 text-sendo-orange' />
				<h3 className='text-foreground/60 uppercase text-sm title-font'>SHARE YOUR PAIN</h3>
			</div>

			<div className='space-y-3'>
				{/* Download Button */}
				<Button
					onClick={handleDownload}
					className='w-full bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-12 title-font'
					style={{
						clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
						borderRadius: 0,
					}}
				>
					<Download className='w-4 h-4 mr-2' />
					DOWNLOAD PAIN CARD 💀
				</Button>

				{/* Social Share Buttons */}
				<div className='grid grid-cols-3 gap-2'>
					<Button
						onClick={handleShareTwitter}
						className='bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white h-10 px-2'
						style={{ borderRadius: 0 }}
					>
						<Twitter className='w-4 h-4' />
					</Button>
					<Button
						onClick={handleShareTelegram}
						className='bg-[#0088cc] hover:bg-[#0077b3] text-white h-10 px-2'
						style={{ borderRadius: 0 }}
					>
						<Send className='w-4 h-4' />
					</Button>
					<Button
						onClick={handleShareDiscord}
						className='bg-[#5865F2] hover:bg-[#4752C4] text-white h-10 px-2'
						style={{ borderRadius: 0 }}
					>
						<MessageCircle className='w-4 h-4' />
					</Button>
				</div>

				<p className='text-foreground/40 text-xs text-center mt-3'>Challenge a friend to analyze their wallet 👀</p>
			</div>
		</motion.div>
	);
}
