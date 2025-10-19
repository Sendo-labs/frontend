import type { Metadata } from 'next';
import Worker from './client';
import { QueryBoundary } from '@/components/shared/query-boundary';

export const metadata: Metadata = {
	title: 'Worker Dashboard',
	description: 'Worker dashboard to manage your worker',
};

async function Page() {
	return (
		<QueryBoundary>
			<Content />
		</QueryBoundary>
	);
}

async function Content() {
	return <Worker />;
}

export default Page;
