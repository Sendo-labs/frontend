import type { Metadata } from 'next';
import { QueryBoundary } from '@/components/shared/query-boundary';
import Leaderboard from './client';

export const metadata: Metadata = {
	title: 'Leaderboard',
	description: 'Leaderboard to see the best performers',
};

async function Page() {
	return (
		<QueryBoundary>
			<Content />
		</QueryBoundary>
	);
}

async function Content() {
	return <Leaderboard />;
}

export default Page;
