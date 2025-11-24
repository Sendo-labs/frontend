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
		<section
			id='team'
			className='relative w-full pt-12 pb-20 sm:pt-16 sm:pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-40 px-4 sm:px-6 bg-black text-white'
			style={{ fontFamily: 'var(--font-ibm-plex-sans), monospace' }}
		>
			<div className='max-w-7xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className='mb-12 sm:mb-16'
				>
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
						className='text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-medium mb-8 text-white leading-tight sm:leading-[57.6px]'
						style={{
							fontFamily: 'var(--font-ibm-plex-sans), monospace',
							textAlign: 'left',
						}}
					>
						<span className='font-bold text-4xl sm:text-5xl md:text-[56px]'>The Guardians.</span>
						<br />
						<span className='block sm:inline text-3xl sm:text-4xl md:text-[48px] font-medium'>The minds behind the mission.</span>
					</motion.h2>
				</motion.div>

				<div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6'>
					{team.map((member, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className='bg-[#141414] border border-white/20 relative overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,34,59,0.15)] group'
							style={{
								borderRadius: '20px',
							}}
						>
							{/* Background Glow */}
							<div className='absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
							
							{/* Image */}
							<div className='relative aspect-square overflow-hidden rounded-t-[20px]'>
								<img
									src={member.image}
									alt={member.name}
									className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80' />

								{/* Social links overlay */}
								<div className='absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4'>
									{member.socials.twitter && (
										<a
											href={member.socials.twitter}
											className='w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-sendo-red hover:border-sendo-red hover:scale-110 transition-all duration-300 group/icon'
										>
											<Twitter className='w-5 h-5 text-white group-hover/icon:text-white' />
										</a>
									)}
									{member.socials.github && (
										<a
											href={member.socials.github}
											className='w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-sendo-red hover:border-sendo-red hover:scale-110 transition-all duration-300 group/icon'
										>
											<Github className='w-5 h-5 text-white group-hover/icon:text-white' />
										</a>
									)}
									{member.socials.linkedin && (
										<a
											href={member.socials.linkedin}
											className='w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-sendo-red hover:border-sendo-red hover:scale-110 transition-all duration-300 group/icon'
										>
											<Linkedin className='w-5 h-5 text-white group-hover/icon:text-white' />
										</a>
									)}
								</div>
							</div>

							{/* Info */}
							<div className='p-3 sm:p-6 relative z-10'>
								<div className='flex items-center justify-between mb-1 sm:mb-2'>
									<h3 className='text-sm sm:text-xl font-bold text-white uppercase tracking-wide truncate pr-2'>
										{member.name}
									</h3>
									<div className='w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sendo-orange to-sendo-red flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 flex-shrink-0'>
										<User className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
									</div>
								</div>
								<p className='text-[10px] sm:text-sm text-[#D0D0D0] font-mono border-t border-white/10 pt-2 sm:pt-3 mt-1 truncate'>
									{member.role}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}











