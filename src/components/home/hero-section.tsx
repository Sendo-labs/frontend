import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/lib/utils';

interface Looser {
	wallet: string;
	missed: number;
	rank: number;
}

export default function HeroSection() {
	const [walletAddress, setWalletAddress] = useState('');

	// Top 3 loosers mock data
	const topLoosers: Looser[] = [
		{ wallet: '9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y', missed: 2847392.5, rank: 1 },
		{ wallet: '7hpWn64kb0q5nro2ZGX9TkP3Y8fLmA1sC6dN4wB5xJ2H', missed: 1923847.32, rank: 2 },
		{ wallet: '5ZV3HcSDmmSoump8N2mT6P9fK4rLvC3dN1sB7wX8yM4K', missed: 1547821.15, rank: 3 },
	];

	const getRankColor = (rank: number) => {
		if (rank === 1) return 'text-[#FFD700]';
		if (rank === 2) return 'text-[#C0C0C0]';
		if (rank === 3) return 'text-[#CD7F32]';
		return 'text-foreground/60';
	};

	const formatWallet = (wallet: string) => {
		return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
	};

	const handleLooserClick = (wallet: string) => {
		window.open(`${createPageUrl('Analyzer')}?wallet=${wallet}`, '_blank');
	};

	// Regex Base58 pour les adresses Solana (exclut 0, O, I, l pour éviter l'ambiguïté)
	// Alphabet Base58: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
	const BASE58_REGEX = /[^1-9A-HJ-NP-Za-km-z]/g;
	const BASE58_VALID_REGEX = /^[1-9A-HJ-NP-Za-km-z]+$/;

	const isValidSolanaAddress = (address: string): boolean => {
		// Vérifier que l'adresse n'est pas vide
		if (!address.trim()) return false;

		// Vérifier que l'adresse contient uniquement des caractères Base58 valides
		if (!BASE58_VALID_REGEX.test(address)) return false;

		// Les adresses Solana standard font généralement entre 32 et 44 caractères en Base58
		// On accepte une plage plus large pour être flexible (32-58 caractères)
		const length = address.length;
		return length == 44;
	};

	const handleWalletChange = (value: string) => {
		// Filtrer uniquement les caractères Base58 valides pour Solana
		// La validation complète (longueur) est faite par isValidSolanaAddress pour le bouton
		const filteredValue = value.replace(BASE58_REGEX, '');
		setWalletAddress(filteredValue);
	};

	const handleAnalyze = () => {
		if (isValidSolanaAddress(walletAddress)) {
			window.location.href = `${createPageUrl('Analyzer')}?wallet=${walletAddress}`;
		}
	};

	return (
		<section className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
			{/* Background avec dégradé */}
			<div className='absolute inset-0' style={{ zIndex: 0 }}>
				{/* Dégradé de couleur de fond - HORIZONTAL de gauche à droite */}
				<div className='absolute inset-0 bg-gradient-to-r from-[#FFBDA3] via-[#FFA7B0] to-[#E89E9E]' />

				{/* Image du personnage */}
				<motion.div
					className='absolute inset-0 flex items-center justify-center'
					initial={{ scale: 1.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 2, ease: 'easeOut' }}
				>
					<div
						className='absolute inset-0 bg-cover md:bg-contain bg-center bg-no-repeat'
						style={{
							backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/badd9c67d_banner-background-min.png')`,
							backgroundPosition: 'center center',
						}}
					/>
				</motion.div>

				{/* Dégradé vertical transparent vers noir pour la transition */}
				<div
					className='absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background'
					style={{ zIndex: 1 }}
				/>
			</div>

			{/* Content */}
			<div className='relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 text-center py-8 md:py-12 lg:py-16'>
				{/* Tagline */}
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7, duration: 0.8 }}
					className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 text-foreground title-font'
				>
					HOW MUCH DID
					<br />
					<span className='bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#4A0C13] bg-clip-text text-transparent'>
						YOU LOSE?
					</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.9, duration: 0.8 }}
					className='text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 mb-4 sm:mb-6 md:mb-8 font-light'
				>
					Stop bagholding. Custom AI agents will catch the next ATH for you.
				</motion.p>

				{/* Wallet Input */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.1, duration: 0.8 }}
					className='max-w-2xl mx-auto'
				>
					<div className='relative'>
						<div className='flex flex-col sm:flex-row gap-3'>
							<Input
								type='text'
								placeholder='Enter your Solana wallet...'
								value={walletAddress}
								onChange={(e) => handleWalletChange(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && isValidSolanaAddress(walletAddress) && handleAnalyze()}
								className='h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg bg-foreground/10 border-foreground/20 text-foreground placeholder:text-foreground/40 focus:border-sendo-orange transition-all'
								style={{ borderRadius: 0 }}
							/>
							<Button
								onClick={handleAnalyze}
								disabled={!isValidSolanaAddress(walletAddress)}
									className='h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg whitespace-nowrap bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#4A0C13] hover:shadow-lg hover:shadow-sendo-red/50 text-white'
								style={{
									fontFamily: 'TECHNOS, sans-serif',
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
									borderRadius: 0,
								}}
							>
								<Search className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
								SCAN NOW
							</Button>
						</div>
					</div>

					<p className='text-xs sm:text-sm text-foreground/40 mt-2 sm:mt-3'>
						Example: 2fg5QD1eD7rzNNCsvnhmXFm5hqNgwTTG8p7kQ6f3rx6f
					</p>

					{/* Top 3 Loosers */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.3, duration: 0.8 }}
						className='mt-4 sm:mt-6 md:mt-8'
					>
						<div className='flex items-center justify-center gap-2 mb-2 sm:mb-3'>
							<Crown className='w-4 h-4 sm:w-5 sm:h-5 text-sendo-orange' />
							<p className='text-xs sm:text-sm md:text-base text-foreground/60 uppercase tracking-wider title-font'>
								BIGGEST LOOSERS TODAY
							</p>
						</div>

						<div className='grid grid-cols-3 gap-2 sm:gap-3 md:gap-4'>
							{topLoosers.map((looser) => (
								<button
									key={looser.rank}
									className='bg-foreground/5 border border-foreground/10 p-2 sm:p-3 md:p-4 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all cursor-pointer group'
									style={{ borderRadius: 0 }}
									type='button'
								>
									<div className='flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2'>
										<Crown
											className={`w-3 h-3 sm:w-4 sm:h-4 ${getRankColor(looser.rank)} group-hover:scale-110 transition-transform`}
										/>
									<span
										className={`text-base sm:text-lg md:text-xl font-bold ${getRankColor(looser.rank)} title-font numeric-font`}
									>
											#{looser.rank}
										</span>
									</div>
									<p className='text-[9px] sm:text-[10px] md:text-xs text-foreground/60 font-mono mb-1 sm:mb-2'>
										{formatWallet(looser.wallet)}
									</p>
									<p className='text-xs sm:text-sm md:text-base font-bold text-sendo-red group-hover:scale-105 transition-transform title-font numeric-font'>
										$
										{looser.missed >= 1000000
											? `${(looser.missed / 1000000).toFixed(2)}M`
											: `${(looser.missed / 1000).toFixed(0)}k`}
									</p>
								</button>
							))}
						</div>
					</motion.div>
				</motion.div>
			</div>

			{/* Gradient Overlay Bottom pour transition forte vers noir */}
			<div
				className='absolute bottom-0 left-0 right-0 h-48 sm:h-56 md:h-64 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none'
				style={{ zIndex: 5 }}
			/>
		</section>
	);
}
