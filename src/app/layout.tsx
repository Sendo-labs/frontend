import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import AgentChat from '@/components/agent-chat';
import { GlobalProviders } from '@/lib/providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
	variable: '--font-ibm-plex-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
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

          /* IBM Plex Mono for digits only via unicode-range */
          @font-face {
            font-family: 'IBM Plex Mono Digits';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('https://fonts.gstatic.com/s/ibmplexmono/v13/-F6qfjptAgt5VM-kVkqdyU8n1i8.woff2') format('woff2');
            unicode-range: U+0030-0039, U+002C, U+002E, U+002B, U+002D, U+0024, U+0025, U+003A; /* 0-9 , . + - $ % : */
          }
        `}</style>
			</head>
			<body className={`${geistSans.variable} ${ibmPlexMono.variable} antialiased bg-background text-foreground min-h-screen`}>
				<GlobalProviders>
					<Navigation />
					<AgentChat />
					{children}
				</GlobalProviders>
			</body>
		</html>
	);
}
