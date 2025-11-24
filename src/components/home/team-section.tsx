import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

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
			'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/039ae2e84_u9457137444_Cinematic_anime_concept_art_portrait_of_a_mysteri_f89ed810-e4e4-48cf-baec-15bff380b5f1_1.png',
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
		<section className='relative w-full h-screen flex items-center justify-center bg-background py-8 md:py-12 overflow-hidden'>
			<div className='max-w-[1400px] mx-auto w-full px-4 sm:px-6'>
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-3 md:mb-4 text-foreground title-font'
				>
					THE{' '}
					<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
						GUARDIANS
					</span>
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className='text-xs sm:text-sm md:text-base lg:text-lg text-foreground/60 text-center mb-6 sm:mb-8 md:mb-12'
				>
					The minds behind the mission
				</motion.p>

				<div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
					{team.map((member, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className='group'
						>
							<div
								className='relative overflow-hidden bg-foreground/5 border border-foreground/10 hover:border-sendo-orange/50 transition-all duration-300'
								style={{ borderRadius: 0 }}
							>
								<div className='relative aspect-square overflow-hidden'>
									<img
										src={member.image}
										alt={member.name}
										className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60' />

									<div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2'>
										{member.socials.twitter && (
											<a
												href={member.socials.twitter}
												className='w-8 h-8 sm:w-10 sm:h-10 bg-foreground/10 flex items-center justify-center hover:bg-sendo-orange transition-colors'
												style={{ borderRadius: 0 }}
											>
												<Twitter className='w-4 h-4 sm:w-5 sm:h-5 text-foreground' />
											</a>
										)}
										{member.socials.github && (
											<a
												href={member.socials.github}
												className='w-8 h-8 sm:w-10 sm:h-10 bg-foreground/10 flex items-center justify-center hover:bg-sendo-orange transition-colors'
												style={{ borderRadius: 0 }}
											>
												<Github className='w-4 h-4 sm:w-5 sm:h-5 text-foreground' />
											</a>
										)}
										{member.socials.linkedin && (
											<a
												href={member.socials.linkedin}
												className='w-8 h-8 sm:w-10 sm:h-10 bg-foreground/10 flex items-center justify-center hover:bg-sendo-orange transition-colors'
												style={{ borderRadius: 0 }}
											>
												<Linkedin className='w-4 h-4 sm:w-5 sm:h-5 text-foreground' />
											</a>
										)}
									</div>
								</div>

								<div className='p-2 sm:p-3 md:p-4'>
									<h3 className='text-xs sm:text-sm md:text-base lg:text-lg font-bold text-foreground mb-0.5 sm:mb-1 title-font uppercase'>
										{member.name}
									</h3>
									<p className='text-foreground/60 text-[10px] sm:text-xs md:text-sm'>{member.role}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
