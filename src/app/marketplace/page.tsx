import type { Metadata } from 'next';
import { QueryBoundary } from '@/components/shared/query-boundary';
import Marketplace from './client';

export const metadata: Metadata = {
	title: 'Marketplace',
	description: 'Marketplace to find and deploy plugins',
};

async function Page() {
	return (
		<QueryBoundary>
			<Content />
		</QueryBoundary>
	);
}

async function Content() {
	return <Marketplace />;
}

export default Page;
