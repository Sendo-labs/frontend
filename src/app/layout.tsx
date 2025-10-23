import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import AgentPanel from '@/components/agent-panel';
import { GlobalProviders } from '@/lib/providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'SENDO - Wallet Analyzer, Worker & Educational Agent',
	description: 'Analyze wallets, run workers, and access educational content on the blockchain',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<style>{`
          @font-face {
            font-family: 'TECHNOS';
            src: url('https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c/68e3cd8726651e5fccb99f93_Technos-PKDZP.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
			</head>
			<body className={`${geistSans.variable} antialiased bg-background text-foreground min-h-screen`}>
				<GlobalProviders>
					<Navigation />
					<AgentPanel />
					{children}
				</GlobalProviders>
			</body>
		</html>
	);
}
