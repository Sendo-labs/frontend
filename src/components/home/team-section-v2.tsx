import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, User } from 'lucide-react';

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
		name: 'KIDAM',
		role: 'Full Stack Web3 Developer',
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

export default function TeamSectionV2() {
	return (
		<section className='py-16 sm:py-20 px-4 sm:px-6'>
			<div className='max-w-7xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className='text-center mb-12 sm:mb-16'
				>
					<h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 uppercase px-4 title-font'>
						THE{' '}
						<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
							GUARDIANS
						</span>
					</h2>
					<p className='text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto px-4'>
						The minds behind the mission
					</p>
				</motion.div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
					{team.map((member, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className='bg-foreground/5 border-2 border-foreground/10 hover:border-sendo-orange/50 relative overflow-hidden transition-all hover:shadow-2xl group'
							style={{
								clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
							}}
						>
							{/* Image */}
							<div className='relative aspect-square overflow-hidden'>
								<img
									src={member.image}
									alt={member.name}
									className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60' />

								{/* Social links overlay */}
								<div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3'>
									{member.socials.twitter && (
										<a
											href={member.socials.twitter}
											className='w-10 h-10 bg-foreground/10 flex items-center justify-center hover:bg-sendo-orange transition-colors'
											style={{ borderRadius: 0 }}
										>
											<Twitter className='w-5 h-5 text-foreground' />
										</a>
									)}
									{member.socials.github && (
										<a
											href={member.socials.github}
											className='w-10 h-10 bg-foreground/10 flex items-center justify-center hover:bg-sendo-orange transition-colors'
											style={{ borderRadius: 0 }}
										>
											<Github className='w-5 h-5 text-foreground' />
										</a>
									)}
									{member.socials.linkedin && (
										<a
											href={member.socials.linkedin}
											className='w-10 h-10 bg-foreground/10 flex items-center justify-center hover:bg-sendo-orange transition-colors'
											style={{ borderRadius: 0 }}
										>
											<Linkedin className='w-5 h-5 text-foreground' />
										</a>
									)}
								</div>
							</div>

							{/* Info */}
							<div className='p-4 sm:p-6'>
								{/* Icon badge */}
								<div
									className='w-10 h-10 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center mb-3'
									style={{
										clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
									}}
								>
									<User className='w-5 h-5 text-white' />
								</div>

								<h3 className='text-lg sm:text-xl font-bold text-foreground mb-1 uppercase title-font'>
									{member.name}
								</h3>
								<p className='text-sm text-foreground/60'>{member.role}</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

