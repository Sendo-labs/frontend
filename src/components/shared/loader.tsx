export default function Loader({ text, blur = false }: { text?: string; blur?: boolean }) {
	return (
		<div
			className={`min-h-screen flex items-center justify-center ${blur ? 'backdrop-blur-sm bg-background/50' : 'bg-background'}`}
		>
			<div className='text-center'>
				<div className='relative mx-auto w-40 h-16'>
					{/* Background logo (grisé) */}
					<div className='absolute inset-0 opacity-20'>
						<img
							src='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png'
							alt='SENDO'
							className='w-full h-full object-contain'
						/>
					</div>

					{/* Logo avec masque et gradient animé */}
					<div
						className='absolute inset-0'
						style={{
							maskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							maskSize: 'contain',
							maskRepeat: 'no-repeat',
							maskPosition: 'center',
							WebkitMaskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							WebkitMaskSize: 'contain',
							WebkitMaskRepeat: 'no-repeat',
							WebkitMaskPosition: 'center',
						}}
					>
						<div
							className='absolute inset-0 animate-fill-left-right bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red'
							style={{
								filter: 'drop-shadow(0 0 15px rgba(255, 90, 31, 0.6))',
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export function FullScreenLoader({ text, blur = false }: { text?: string; blur?: boolean }) {
	return (
		<div
			className={`fixed top-0 left-0 h-[100vh] w-full flex items-center justify-center z-50 ${blur ? 'backdrop-blur-sm bg-background/30' : 'bg-background'}`}
		>
			<div className='text-center'>
				<div className='relative mx-auto w-40 h-16'>
					{/* Background logo (grisé) */}
					<div className='absolute inset-0 opacity-20'>
						<img
							src='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png'
							alt='SENDO'
							className='w-full h-full object-contain'
						/>
					</div>

					{/* Logo avec masque et gradient animé */}
					<div
						className='absolute inset-0'
						style={{
							maskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							maskSize: 'contain',
							maskRepeat: 'no-repeat',
							maskPosition: 'center',
							WebkitMaskImage:
								'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png)',
							WebkitMaskSize: 'contain',
							WebkitMaskRepeat: 'no-repeat',
							WebkitMaskPosition: 'center',
						}}
					>
						<div
							className='absolute inset-0 animate-fill-left-right bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red'
							style={{
								filter: 'drop-shadow(0 0 15px rgba(255, 90, 31, 0.6))',
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
