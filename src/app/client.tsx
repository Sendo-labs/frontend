'use client';

import Footer from '@/components/home/footer';
import HeroSectionV3 from '@/components/home/hero-section-v3';
import LeaderboardSection from '@/components/home/leaderboard-section';
import MissingAthSection from '@/components/home/missing-ath-section';
import ProductSection from '@/components/home/product-section';
import RecallSection from '@/components/home/recall-section';
import ScannerSeparator from '@/components/home/scanner-separator';
import TeamSectionV2 from '@/components/home/team-section-v2';

export default function Home() {
	return (
		<div className='min-h-screen bg-background text-foreground relative overflow-x-hidden'>
			{/* Hero Section V3 */}
			<HeroSectionV3 />

			{/* Content - Relative to allow scrolling */}
			<div className='relative z-10'>
				{/* Missing ATH Section */}
				<MissingAthSection />

				{/* Scanner Separator */}
				<ScannerSeparator />

				{/* Product Section */}
				<ProductSection />

				{/* Leaderboard Section - Hall of Pain */}
				<LeaderboardSection />

				{/* Team Section */}
				<TeamSectionV2 />

				{/* Recall Section */}
				<RecallSection />

				{/* Footer */}
				<Footer />
			</div>
		</div>
	);
}
