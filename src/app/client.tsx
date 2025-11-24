'use client';

import React from 'react';
import TeamSectionV2 from '@/components/home/team-section-v2';
import RecallSection from '@/components/home/recall-section';
import Footer from '@/components/home/footer';
import HomepageNavbar from '@/components/home/homepage-navbar';
import HeroSectionV3 from '@/components/home/hero-section-v3';
import MissingAthSection from '@/components/home/missing-ath-section';
import ScannerSeparator from '@/components/home/scanner-separator';
import ProductSection from '@/components/home/product-section';
import LeaderboardSection from '@/components/home/leaderboard-section';

export default function Home() {
	return (
		<div className='min-h-screen bg-background text-foreground relative overflow-x-hidden'>
			{/* Homepage Navbar */}
			<HomepageNavbar />

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
