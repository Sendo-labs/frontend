export default function Loader({ text, blur = false }: { text?: string, blur?: boolean }) {
	return (
		<div className={`min-h-screen flex items-center justify-center ${blur ? 'backdrop-blur-sm bg-background/50' : 'bg-background'}`}>
			<div className='text-center'>
				<div className='w-16 h-16 border-4 border-sendo-orange border-t-transparent mx-auto mb-4 rounded-none animate-pulse' />
				<p className='text-foreground/60 text-sm uppercase title-font'>{text || 'Loading....'}</p>
			</div>
		</div>
	);
}

export function FullScreenLoader({ text, blur = false }: { text?: string, blur?: boolean }) {
	return (
		<div className={`fixed top-0 left-0 h-[100vh] w-full flex items-center justify-center z-50 ${blur ? 'backdrop-blur-sm bg-background/30' : 'bg-background'}`}>
			<div className='text-center'>
				<div className='w-16 h-16 border-4 border-sendo-orange border-t-transparent mx-auto mb-4 rounded-none animate-pulse' />
				<p className='text-foreground/60 text-sm uppercase title-font'>{text || 'Loading....'}</p>
			</div>
		</div>
	);
}