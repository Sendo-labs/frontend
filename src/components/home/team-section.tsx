import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface TeamMember {
	name: string;
	role: string;
	image: string;
	socials: {
		twitter?: string;
		github?: string;
		linkedin?: string;
	};
}

const team: TeamMember[] = [
	{
		name: 'FLEO-TYPHON',
		role: 'CEO',
		image:
			'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/039ae2e84_u9457137444_Cinematic_anime_concept_art_portrait_of_a_mysteri_f89ed810-e4e4-48cf-baec-15bff380b5f1_1.png',
		socials: { twitter: '#', github: '#' },
	},
	{
		name: 'STAN',
		role: 'Core Developer',
		image:
			'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/039ae2e84_u9457137444_Cinematic_anime_concept_art_portrait_of_a_mysteri_f89ed810-e4e4-48cf-baec-15bff380b5f1_1.png',
		socials: { twitter: '#', github: '#' },
	},
	{
		name: 'Kidam',
		role: 'Full stack Web3 developer',
		image:
			'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de563762a326681f5a5a3/039ae2e84_u9457137444_Cinematic_anime_concept_art_portrait_of_a_mysteri_f89ed810-e4e4-48cf-baec-15bff380b5f1_1.png',
		socials: { twitter: '#', github: '#' },
	},
	{
		name: '0XCANET',
		role: 'UX/UI Designer',
		image:
			'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/039ae2e84_u9457137444_Cinematic_anime_concept_art_portrait_of_a_mysteri_f89ed810-e4e4-48cf-baec-15bff380b5f1_1.png',
		socials: { twitter: '#', linkedin: '#' },
	},
];

export default function TeamSection() {
	return (
		<section className='relative w-full min-h-screen flex items-center justify-center bg-background py-16 md:py-0 overflow-hidden'>
			<div className='max-w-[1400px] mx-auto w-full px-4 sm:px-6'>
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-foreground'
					style={{ fontFamily: 'TECHNOS, sans-serif' }}
				>
					THE{' '}
					<span className='bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent'>GUARDIANS</span>
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className='text-base sm:text-lg md:text-xl text-foreground/60 text-center mb-8 sm:mb-12 md:mb-20'
				>
					The minds behind the mission
				</motion.p>

				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8'>
					{team.map((member, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className='group'
						>
							<div
								className='relative overflow-hidden bg-foreground/5 border border-foreground/10 hover:border-[#FF6B00]/50 transition-all duration-300'
								style={{ borderRadius: 0 }}
							>
								<div className='relative aspect-square overflow-hidden'>
									<img
										src={member.image}
										alt={member.name}
										className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60' />

									<div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 sm:gap-3'>
										{member.socials.twitter && (
											<a
												href={member.socials.twitter}
												className='w-8 h-8 sm:w-10 sm:h-10 bg-foreground/10 flex items-center justify-center hover:bg-[#FF6B00] transition-colors'
												style={{ borderRadius: 0 }}
											>
												<Twitter className='w-4 h-4 sm:w-5 sm:h-5 text-foreground' />
											</a>
										)}
										{member.socials.github && (
											<a
												href={member.socials.github}
												className='w-8 h-8 sm:w-10 sm:h-10 bg-foreground/10 flex items-center justify-center hover:bg-[#FF6B00] transition-colors'
												style={{ borderRadius: 0 }}
											>
												<Github className='w-4 h-4 sm:w-5 sm:h-5 text-foreground' />
											</a>
										)}
										{member.socials.linkedin && (
											<a
												href={member.socials.linkedin}
												className='w-8 h-8 sm:w-10 sm:h-10 bg-foreground/10 flex items-center justify-center hover:bg-[#FF6B00] transition-colors'
												style={{ borderRadius: 0 }}
											>
												<Linkedin className='w-4 h-4 sm:w-5 sm:h-5 text-foreground' />
											</a>
										)}
									</div>
								</div>

								<div className='p-3 sm:p-4 md:p-6'>
									<h3
										className='text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground mb-1'
										style={{ fontFamily: 'TECHNOS, sans-serif' }}
									>
										{member.name}
									</h3>
									<p className='text-foreground/60 text-xs sm:text-sm'>{member.role}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
