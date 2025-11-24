/**
 * Pain Card Generator
 * Generates social media ready images for wallet analysis results
 */

export interface PainCardData {
	totalMissedUSD: number;
	rank?: string;
	topPainPoints: Array<{
		symbol: string;
		missedUSD: number;
		rank: number;
		ath_change_pct?: number;
		trade_price?: number;
		ath_price?: number;
	}>;
}

export type CardLevel = 'mild' | 'moderate' | 'severe';

/**
 * Determine card level based on total missed amount
 */
export function getCardLevel(totalMissedUSD: number): CardLevel {
	if (totalMissedUSD < 10000) return 'mild';
	if (totalMissedUSD < 50000) return 'moderate';
	return 'severe';
}

/**
 * Card themes configuration
 */
export function getCardTheme(level: CardLevel) {
	const themes = {
		mild: {
			title: 'REALLY...',
			subtitle1: 'You sold for few gains...',
			subtitle2: "Now you're crying? Cute.",
			bottomText: 'NOT EVERY PAIN IS A TRAGEDY... BUT IT STILL HURTS.',
			bgGradientStart: '#2a1a1a',
			bgGradientEnd: '#000000',
			titleFont: 'TECHNOS',
		},
		moderate: {
			title: 'MISSED AGAIN...',
			subtitle1: 'That tiny voice said "Wait a bit more."',
			subtitle2: 'You listened. It cost you everything.',
			bottomText: 'NOT SELLING AT THE RIGHT TIME... AGAIN.',
			bgGradientStart: '#1a0808',
			bgGradientEnd: '#000000',
			titleFont: 'TECHNOS',
		},
		severe: {
			title: 'QUIET DOWN...',
			subtitle1: 'You had the signal. You froze.',
			subtitle2: 'Now watch your gains burn.',
			bottomText: "DATA DOESN'T CARE ABOUT YOUR FEELINGS.",
			bgGradientStart: '#1a0000',
			bgGradientEnd: '#000000',
			titleFont: 'TECHNOS',
		},
	};

	return themes[level];
}

/**
 * Load an image from URL
 */
async function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = url;
	});
}

/**
 * Draw text with gradient
 */
function drawGradientText(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	fromColor: string,
	toColor: string,
	fontSize: number,
	font: string,
) {
	ctx.save();
	ctx.font = `bold ${fontSize}px ${font}, monospace`;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	const textWidth = ctx.measureText(text).width;
	const gradient = ctx.createLinearGradient(x, y, x + textWidth, y);
	gradient.addColorStop(0, fromColor);
	gradient.addColorStop(1, toColor);
	ctx.fillStyle = gradient;
	ctx.fillText(text, x, y);
	ctx.restore();
}

/**
 * Generate pain card image with Canvas
 */
export async function generatePainCardImage(data: PainCardData): Promise<Blob> {
	const level = getCardLevel(data.totalMissedUSD);
	const theme = getCardTheme(level);

	// Load character image and logo based on level
	const characterImagePath = `/pain-cards/character-${level}.png`;
	const logoImagePath = '/pain-cards/logo-sndo.png';

	try {
		const [characterImg, logoImg] = await Promise.all([loadImage(characterImagePath), loadImage(logoImagePath)]);

		// Create canvas
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) throw new Error('Could not get canvas context');

		// Set size (Social media optimized: 1200x630)
		canvas.width = 1200;
		canvas.height = 630;

		// Enable better rendering
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';

		// === BACKGROUND ===
		// Base gradient (radial from right center)
		const bgGradient = ctx.createRadialGradient(900, 315, 100, 900, 315, 700);
		bgGradient.addColorStop(0, theme.bgGradientStart);
		bgGradient.addColorStop(0.6, '#0a0000');
		bgGradient.addColorStop(1, theme.bgGradientEnd);
		ctx.fillStyle = bgGradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Subtle red glow on the right (behind character)
		ctx.globalAlpha = 0.2;
		const glowGradient = ctx.createRadialGradient(950, 315, 0, 950, 315, 450);
		glowGradient.addColorStop(0, '#FF223B');
		glowGradient.addColorStop(0.7, '#4A0C13');
		glowGradient.addColorStop(1, 'transparent');
		ctx.fillStyle = glowGradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;

		// Subtle noise texture
		ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
		for (let i = 0; i < 2000; i++) {
			const x = Math.random() * canvas.width;
			const y = Math.random() * canvas.height;
			ctx.fillRect(x, y, 1, 1);
		}

		// === CHARACTER IMAGE (Right side) ===
		// Draw character scaled to fit nicely on the right
		const charHeight = canvas.height;
		const charWidth = (characterImg.width / characterImg.height) * charHeight;
		const charX = canvas.width - charWidth + 50; // Slight overlap
		ctx.drawImage(characterImg, charX, 0, charWidth, charHeight);

		// === TEXT CONTENT (Left side) ===
		// Ensure consistent text alignment
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';

		// Brand name (top left) - IBM Plex Mono
		ctx.fillStyle = '#FFFFFF';
		ctx.font = '18px "IBM Plex Mono", monospace';
		ctx.fillText('SENDO.MARKET', 60, 70);

		// Title - TECHNOS font with gradient
		drawGradientText(ctx, theme.title, 60, 170, '#FF5C1A', '#FF223B', 80, theme.titleFont);

		// Subtitle line 1 - IBM Plex Mono
		ctx.fillStyle = '#FFFFFF';
		ctx.font = '22px "IBM Plex Mono", monospace';
		ctx.fillText(theme.subtitle1, 60, 220);

		// Subtitle line 2 - IBM Plex Mono (bold for emphasis)
		ctx.font = 'bold 22px "IBM Plex Mono", monospace';
		ctx.fillText(theme.subtitle2, 60, 250);

		// Main loss amount - IBM Plex Mono with gradient (aligned with rest of text)
		const formattedAmount = `-$${data.totalMissedUSD.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
		drawGradientText(ctx, formattedAmount, 60, 350, '#FF5C1A', '#FF223B', 100, 'IBM Plex Mono');

		// Bottom message - IBM Plex Mono (closer to amount)
		ctx.fillStyle = '#FFFFFF';
		ctx.font = '16px "IBM Plex Mono", monospace';
		ctx.fillText(theme.bottomText, 60, 385);

		// "TOP PAIN POINT:" header
		ctx.fillStyle = '#FFFFFF';
		ctx.font = 'bold 20px "IBM Plex Mono", monospace';
		ctx.fillText('TOP PAIN POINT:', 60, 460);

		// Pain points list (horizontal layout)
		const painPointXPositions = [60, 300, 540];

		data.topPainPoints.slice(0, 3).forEach((point, i) => {
			const xPos = painPointXPositions[i];
			const yPos = 500;

			// Rank box with gradient (leaderboard colors)
			const boxGradient = ctx.createLinearGradient(xPos, yPos, xPos, yPos + 42);
			if (i === 0) {
				// Gold gradient
				boxGradient.addColorStop(0, '#ffd700');
				boxGradient.addColorStop(1, '#ffa500');
			} else if (i === 1) {
				// Silver gradient
				boxGradient.addColorStop(0, '#e5e7eb');
				boxGradient.addColorStop(1, '#9ca3af');
			} else {
				// Bronze/Copper gradient
				boxGradient.addColorStop(0, '#f59e0b');
				boxGradient.addColorStop(1, '#92400e');
			}
			ctx.fillStyle = boxGradient;
			ctx.fillRect(xPos, yPos, 42, 42);

			// Rank number
			ctx.fillStyle = i === 2 ? '#FFFFFF' : '#000000'; // White for bronze, black for gold/silver
			ctx.font = 'bold 26px "IBM Plex Mono", monospace';
			ctx.textAlign = 'center';
			ctx.fillText((i + 1).toString(), xPos + 21, yPos + 30);
			ctx.textAlign = 'left';

			// Symbol
			ctx.fillStyle = '#FFFFFF';
			ctx.font = 'bold 20px "IBM Plex Mono", monospace';
			ctx.fillText(point.symbol.toUpperCase(), xPos + 52, yPos + 30);

			// Loss amount (red) with American formatting
			ctx.fillStyle = '#FF223B';
			ctx.font = '20px "IBM Plex Mono", monospace';
			const formattedLoss = `-$${point.missedUSD.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`;
			ctx.fillText(formattedLoss, xPos, yPos + 70);
		});

		// Logo (bottom right)
		const logoWidth = 80;
		const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
		ctx.drawImage(logoImg, canvas.width - logoWidth - 60, canvas.height - logoHeight - 40, logoWidth, logoHeight);

		// Convert to blob
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (blob) resolve(blob);
					else reject(new Error('Failed to generate image'));
				},
				'image/png',
				1.0,
			);
		});
	} catch (error) {
		console.error('Error loading images:', error);
		throw new Error('Failed to load character images. Please ensure they are in /public/pain-cards/');
	}
}

/**
 * Download pain card image
 */
export async function downloadPainCard(data: PainCardData) {
	try {
		const blob = await generatePainCardImage(data);
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `sendo-pain-card-${Date.now()}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error('Error generating pain card:', error);
		throw error;
	}
}

/**
 * Get share text for social media
 */
export function getShareText(data: PainCardData): string {
	return `I missed $${data.totalMissedUSD.toLocaleString('en-US')} by not selling at ATH! 💀\n\nRank: ${data.rank || 'Pain Holder'}\n\nCheck your pain at sendo.ai`;
}
