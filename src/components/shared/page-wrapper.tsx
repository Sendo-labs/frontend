export default function PageWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className='min-h-screen bg-background text-foreground pt-24 pb-12'>
			<div className='max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-20'>{children}</div>
		</div>
	);
}
