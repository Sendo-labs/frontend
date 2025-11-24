import type { Metadata } from 'next';
import { QueryBoundary } from '@/components/shared/query-boundary';
import Onboarding from './client';

export const metadata: Metadata = {
	title: 'Onboarding',
	description: 'Onboarding to get started with Sendo',
};

async function Page() {
	return (
		<QueryBoundary>
			<Content />
		</QueryBoundary>
	);
}

async function Content() {
	return <Onboarding />;
}

export default Page;
