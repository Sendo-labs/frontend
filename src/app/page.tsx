import type { Metadata } from 'next';
import { QueryBoundary } from '@/components/shared/query-boundary';
import Home from './client';

export const metadata: Metadata = {
	title: 'Welcome on SENDO',
	description: 'Welcome on SENDO',
};

async function Page() {
	return (
		<QueryBoundary>
			<Content />
		</QueryBoundary>
	);
}

async function Content() {
	return <Home />;
}

export default Page;
