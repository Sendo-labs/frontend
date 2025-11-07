'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Send, Download, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadPainCard, getShareText, type PainCardData } from '@/lib/pain-card-generator';
import { toast } from 'sonner';

interface TokenData {
	symbol: string;
	missed_usd: number;
}

interface ShareResultData {
	total_missed_usd: number;
	rank: string;
	tokens: TokenData[];
}

interface ShareButtonsProps {
	result: ShareResultData;
}

export default function ShareButtons({ result }: ShareButtonsProps) {
	const [isGenerating, setIsGenerating] = useState(false);

	// Prepare pain card data
	const painCardData: PainCardData = {
		totalMissedUSD: result.total_missed_usd,
		rank: result.rank,
		topPainPoints: result.tokens.slice(0, 3).map((token, index) => ({
			symbol: token.symbol,
			missedUSD: token.missed_usd,
			rank: index + 1,
		})),
	};

	const shareText = getShareText(painCardData);

	const handleDownload = async () => {
		setIsGenerating(true);
		try {
			await downloadPainCard(painCardData);
			toast.success('Pain card downloaded! 💀', {
				description: 'Your pain is ready to share on social media',
			});
		} catch (error) {
			console.error('Error downloading pain card:', error);
			toast.error('Failed to generate pain card', {
				description: 'Please try again',
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const handleShareTwitter = () => {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
		window.open(url, '_blank');
		toast.info('Share on Twitter', {
			description: 'Download your pain card first to attach the image!',
		});
	};

	const handleShareTelegram = () => {
		const url = `https://t.me/share/url?url=${encodeURIComponent('https://sendo.ai')}&text=${encodeURIComponent(shareText)}`;
		window.open(url, '_blank');
		toast.info('Share on Telegram', {
			description: 'Download your pain card first to attach the image!',
		});
	};

	const handleShareDiscord = () => {
		navigator.clipboard.writeText(shareText);
		toast.success('Copied to clipboard! 📋', {
			description: 'Download your pain card and paste both in Discord!',
		});
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
				disabled={isGenerating}
				className='w-full bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 text-white h-10 md:h-12 title-font'
				style={{
					clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
					borderRadius: 0,
				}}
			>
				{isGenerating ? (
					<>
						<div className='w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin' />
						<span className='text-xs md:text-sm'>GENERATING...</span>
					</>
				) : (
					<>
						<Download className='w-4 h-4 mr-2' />
						<span className='text-xs md:text-sm'>DOWNLOAD PAIN CARD 💀</span>
					</>
				)}
			</Button>

			{/* Social Share Buttons */}
			<div className='grid grid-cols-3 gap-2'>
				<Button
					onClick={handleShareTwitter}
					className='bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white h-8 md:h-9 px-2'
					style={{ borderRadius: 0 }}
				>
					<Twitter className='w-3 h-3 md:w-4 md:h-4' />
				</Button>
				<Button
					onClick={handleShareTelegram}
					className='bg-[#0088cc] hover:bg-[#0077b3] text-white h-8 md:h-9 px-2'
					style={{ borderRadius: 0 }}
				>
					<Send className='w-3 h-3 md:w-4 md:h-4' />
				</Button>
				<Button
					onClick={handleShareDiscord}
					className='bg-[#5865F2] hover:bg-[#4752C4] text-white h-8 md:h-9 px-2'
					style={{ borderRadius: 0 }}
				>
					<MessageCircle className='w-3 h-3 md:w-4 md:h-4' />
				</Button>
			</div>

			<p className='text-foreground/40 text-xs text-center mt-3'>Challenge a friend to analyze their wallet 👀</p>
		</div>
		</motion.div>
	);
}
