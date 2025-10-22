import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Twitter, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
					<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>TOUCH</span>
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
								className='w-full h-10 sm:h-12 text-foreground text-sm sm:text-base font-bold bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-orange hover:shadow-lg hover:shadow-sendo-red/50 transition-all'
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
						<h3 className='text-base sm:text-lg md:text-xl font-bold text-foreground mb-3 sm:mb-4 title-font'>FOLLOW US</h3>

						<div className='space-y-2 sm:space-y-3'>
							<a
								href='https://x.com/sendo_agent'
								className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<div
									className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-orange flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}
								>
									<Twitter className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
								</div>
								<div>
									<p className='text-foreground font-semibold text-xs sm:text-sm'>Twitter / X</p>
									<p className='text-foreground/60 text-[10px] sm:text-xs'>@sendo_agent</p>
								</div>
							</a>

							<a
								href='https://t.me/sendo_official'
								className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<div
									className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-orange flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}
								>
									<Send className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
								</div>
								<div>
									<p className='text-foreground font-semibold text-xs sm:text-sm'>Telegram</p>
									<p className='text-foreground/60 text-[10px] sm:text-xs'>t.me/sendo_official</p>
								</div>
							</a>

							<a
								href='https://discord.gg/sendo'
								className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<div
									className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-orange flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}
								>
									<MessageCircle className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
								</div>
								<div>
									<p className='text-foreground font-semibold text-xs sm:text-sm'>Discord</p>
									<p className='text-foreground/60 text-[10px] sm:text-xs'>discord.gg/sendo</p>
								</div>
							</a>

							<a
								href='mailto:contact@sendo.io'
								className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-sendo-orange/50 transition-all group'
								style={{ borderRadius: 0 }}
							>
								<div
									className='w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-orange flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
									style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}
								>
									<Mail className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
								</div>
								<div>
									<p className='text-foreground font-semibold text-xs sm:text-sm'>Email</p>
									<p className='text-foreground/60 text-[10px] sm:text-xs'>contact@sendo.io</p>
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
