import type { Metadata } from 'next';
import { QueryBoundary } from '@/components/shared/query-boundary';
import Analyzer from './client';

export const metadata: Metadata = {
	title: 'Analyzer',
	description: 'Analyzer to analyze a wallet',
};

async function Page() {
	return (
		<QueryBoundary>
			<Content />
		</QueryBoundary>
	);
}

async function Content() {
	return <Analyzer />;
}

export default Page;
