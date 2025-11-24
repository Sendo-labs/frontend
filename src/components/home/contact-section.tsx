import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SOCIAL_LINKS } from '@/lib/constants';

interface FormData {
	email: string;
	message: string;
}

export default function ContactSection() {
	const [formData, setFormData] = useState<FormData>({
		email: '',
		message: '',
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
		setFormData({ email: '', message: '' });
	};

	return (
		<section className='relative w-full h-screen flex items-center justify-center bg-background py-8 md:py-12 overflow-hidden'>
			<div className='max-w-[1400px] mx-auto w-full px-4 sm:px-6'>
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-3 md:mb-4 text-foreground title-font'
				>
					GET IN{' '}
					<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
						TOUCH
					</span>
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className='text-xs sm:text-sm md:text-base lg:text-lg text-foreground/60 text-center mb-6 sm:mb-8'
				>
					Join the community or reach out to us
				</motion.p>

				<div className='grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8'>
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3, duration: 0.8 }}
					>
						<form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4'>
							<div>
								<Input
									type='email'
									placeholder='Your email'
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className='h-10 sm:h-12 bg-foreground/5 border-foreground/20 text-foreground placeholder:text-foreground/40 focus:border-sendo-orange'
									style={{ borderRadius: 0 }}
									required
								/>
							</div>
							<div>
								<Textarea
									placeholder='Your message'
									value={formData.message}
									onChange={(e) => setFormData({ ...formData, message: e.target.value })}
									className='min-h-16 sm:min-h-20 md:min-h-24 bg-foreground/5 border-foreground/20 text-foreground placeholder:text-foreground/40 focus:border-sendo-orange resize-none'
									style={{ borderRadius: 0 }}
									required
								/>
							</div>
							<Button
								type='submit'
								className='w-full h-10 sm:h-12 text-foreground text-sm sm:text-base font-bold bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 transition-all'
								style={{
									fontFamily: 'TECHNOS, sans-serif',
									clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
									borderRadius: 0,
								}}
							>
								<Send className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
								SEND MESSAGE
							</Button>
						</form>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4, duration: 0.8 }}
						className='flex flex-col justify-center'
					>
						<h3 className='text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 sm:mb-4 title-font'>
							FOLLOW US
						</h3>

						<div className='space-y-2 sm:space-y-3'>
							<a
								href={SOCIAL_LINKS.Twitter.url}
								className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<div
									className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}
								>
									<svg
										role='img'
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
										className='w-4 h-4 sm:w-5 sm:h-5 fill-white'
									>
										<title>X</title>
										<path d='M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z' />
									</svg>
								</div>
								<div>
									<p className='text-foreground font-semibold text-xs sm:text-sm'>Twitter / X</p>
									<p className='text-foreground/60 text-[10px] sm:text-xs'>@{SOCIAL_LINKS.Twitter.username}</p>
								</div>
							</a>

							<a
								href={SOCIAL_LINKS.Farcaster.url}
								className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<div
									className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}
								>
									<svg
										role='img'
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
										className='w-4 h-4 sm:w-5 sm:h-5 fill-white'
									>
										<title>Farcaster</title>
										<path d='M18.24.24H5.76C2.5789.24 0 2.8188 0 6v12c0 3.1811 2.5789 5.76 5.76 5.76h12.48c3.1812 0 5.76-2.5789 5.76-5.76V6C24 2.8188 21.4212.24 18.24.24m.8155 17.1662v.504c.2868-.0256.5458.1905.5439.479v.5688h-5.1437v-.5688c-.0019-.2885.2576-.5047.5443-.479v-.504c0-.22.1525-.402.358-.458l-.0095-4.3645c-.1589-1.7366-1.6402-3.0979-3.4435-3.0979-1.8038 0-3.2846 1.3613-3.4435 3.0979l-.0096 4.3578c.2276.0424.5318.2083.5395.4648v.504c.2863-.0256.5457.1905.5438.479v.5688H4.3915v-.5688c-.0019-.2885.2575-.5047.5438-.479v-.504c0-.2529.2011-.4548.4536-.4724v-7.895h-.4905L4.2898 7.008l2.6405-.0005V5.0419h9.9495v1.9656h2.8219l-.6091 2.0314h-.4901v7.8949c.2519.0177.453.2195.453.4724' />
									</svg>
								</div>
								<div>
									<p className='text-foreground font-semibold text-xs sm:text-sm'>Farcaster</p>
									<p className='text-foreground/60 text-[10px] sm:text-xs'>@{SOCIAL_LINKS.Farcaster.username}</p>
								</div>
							</a>

							<a
								href={SOCIAL_LINKS.Discord.url}
								className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<div
									className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}
								>
									<svg
										role='img'
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
										className='w-4 h-4 sm:w-5 sm:h-5 fill-white'
									>
										<title>Discord</title>
										<path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z' />
									</svg>
								</div>
								<div>
									<p className='text-foreground font-semibold text-xs sm:text-sm'>Discord</p>
									<p className='text-foreground/60 text-[10px] sm:text-xs'>{SOCIAL_LINKS.Discord.username}</p>
								</div>
							</a>

							<a
								href={`mailto:${SOCIAL_LINKS.Email.url}`}
								className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<div
									className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}
								>
									<Mail className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
								</div>
								<div>
									<p className='text-foreground font-semibold text-xs sm:text-sm'>Email</p>
									<p className='text-foreground/60 text-[10px] sm:text-xs'>{SOCIAL_LINKS.Email.username}</p>
								</div>
							</a>
						</div>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className='mt-6 sm:mt-8 text-center text-foreground/40 text-[10px] sm:text-xs px-4'
				>
					<p>©{new Date().getFullYear()} sEnDO. All rights reserved.</p>
					<p className='mt-1 sm:mt-2'>Built by degens, for degens.</p>
				</motion.div>
			</div>
		</section>
	);
}
