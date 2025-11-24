'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnimatedMarkdown } from '@/components/ui/animated-markdown';
import { Tool } from '@/components/ui/tool';
import { useElizaAgent } from '@/hooks/use-eliza-agent';
import { useElizaChat } from '@/hooks/use-eliza-chat';
import type { AgentMessage } from '@/types/agent';
import { usePrivy } from '@privy-io/react-auth';
import { LoginButton } from './auth/login';

interface ToolPart {
	type: string;
	state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
	input: Record<string, unknown>;
	output: string | Record<string, unknown>;
	toolCallId: string;
	errorText: string | null;
}

export default function AgentChat() {
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [animatedMessagesSet, setAnimatedMessagesSet] = useState(new Set<string>());
	const [showButton, setShowButton] = useState(false);

	const { authenticated, user } = usePrivy();

	// Get userId from privy user (use wallet address as fallback)
	const userId = user?.id;

	// Fetch or create agent for the authenticated user
	const { agent, isLoading: agentLoading, error: agentError } = useElizaAgent({ userId: userId || null });

	// Chat hook
	const {
		messages,
		isLoading,
		isAgentThinking,
		sendMessage,
		error: chatError,
		animatedMessageId,
	} = useElizaChat({
		agentId: agent?.id || null,
		userId: userId || null,
	});

	const scrollToBottom = (smooth = true) => {
		messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only scroll when messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Scroll to bottom immediately when chat opens
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only scroll when isOpen changes
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => scrollToBottom(false), 100);
		}
	}, [isOpen]);

	// Mark animated message as seen after animation
	useEffect(() => {
		if (animatedMessageId && !animatedMessagesSet.has(animatedMessageId)) {
			const timer = setTimeout(() => {
				setAnimatedMessagesSet((prev) => new Set([...prev, animatedMessageId]));
			}, 5000); // Match the animation duration
			return () => clearTimeout(timer);
		}
	}, [animatedMessageId, animatedMessagesSet]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	// Détecter quand on scroll au-delà de la Hero section
	useEffect(() => {
		const checkScrollPosition = () => {
			// Trouver la Hero section (elle a une classe min-h-screen)
			const heroSection = document.querySelector('section[class*="min-h-screen"]');
			if (!heroSection) {
				// Si on ne trouve pas la section, afficher le bouton après un certain scroll
				setShowButton(window.scrollY > window.innerHeight);
				return;
			}

			const heroBottom = heroSection.getBoundingClientRect().bottom;
			// Afficher le bouton quand on dépasse le bas de la Hero section
			setShowButton(heroBottom <= 0);
		};

		// Vérifier immédiatement après un court délai pour laisser le DOM se charger
		const timeoutId = setTimeout(checkScrollPosition, 100);

		// Écouter les événements de scroll avec throttling
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					checkScrollPosition();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', checkScrollPosition);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', checkScrollPosition);
		};
	}, []);

	const handleSend = async () => {
		if (!input.trim() || isLoading || isAgentThinking || !agent) return;

		const userInput = input;
		setInput('');

		try {
			await sendMessage(userInput);
		} catch (err) {
			console.error('[AgentPanel] Error sending message:', err);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	// Convert agent action messages to tool parts for Tool component
	const convertToToolPart = (message: AgentMessage): ToolPart => {
		// Try to parse rawMessage if it exists
		let toolData: Record<string, any> = {};
		if (message.rawMessage) {
			try {
				const parsed = typeof message.rawMessage === 'string' ? JSON.parse(message.rawMessage) : message.rawMessage;
				toolData = parsed as Record<string, any>;
			} catch (e) {
				console.warn('[AgentPanel] Could not parse rawMessage:', e);
			}
		}

		return {
			type: toolData.tool?.name || message.type || 'action',
			state: 'output-available',
			input: toolData.tool?.input || toolData.input || {},
			output: toolData.tool?.output || toolData.output || message.text,
			toolCallId: message.id,
			errorText: null,
		};
	};

	return (
		<>
			{/* Floating Button */}
			<AnimatePresence>
				{!isOpen && showButton && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
						onClick={() => setIsOpen(true)}
						className='fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 flex items-center justify-center transition-all group'
						style={{ 
							clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
							willChange: 'opacity, transform',
							transform: 'translateZ(0)'
						}}
					>
						<MessageCircle className='w-7 h-7 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform' />
						<motion.div
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: [0.25, 0.1, 0.25, 1] }}
							className='absolute -top-1 -right-1 w-3 h-3 bg-sendo-green'
							style={{ borderRadius: 0, willChange: 'transform', transform: 'translateZ(0)' }}
						/>
					</motion.button>
				)}
			</AnimatePresence>

			{/* Drawer Panel */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
						style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
						className='fixed inset-0 z-[100] flex items-end md:items-center justify-end'
						onWheel={(e) => e.stopPropagation()}
						onTouchMove={(e) => e.stopPropagation()}
					>
						{/* Backdrop */}
						<button className='absolute inset-0 bg-black/60' onClick={() => setIsOpen(false)} type='button' />

						{/* Drawer */}
						<motion.div
							initial={{ x: 400, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 400, opacity: 0 }}
							transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
							style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
							className='chat-drawer relative w-full md:w-[400px] h-[80vh] md:h-[600px] md:m-6 bg-background border-2 border-sendo-orange/30 flex flex-col rounded-none'
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className='flex items-center justify-between p-4 border-b border-foreground/10 bg-gradient-to-r from-sendo-orange/10 via-sendo-red/10 to-sendo-dark-red/10'>
								<div className='flex items-center gap-3'>
									<div
										className='w-10 h-10 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center'
										style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
									>
										<Sparkles className='w-5 h-5 text-white' />
									</div>
									<div>
										<h3 className='text-white font-bold text-sm uppercase title-font'>
											sEnDO{' '}
											<span className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red bg-clip-text text-transparent'>
												AGENT
											</span>
										</h3>
										<p className='text-sendo-green text-xs flex items-center gap-1'>
											{agentLoading ? (
												<span className='w-1.5 h-1.5 bg-sendo-green animate-pulse rounded-none' />
											) : agent ? (
												<span className='w-1.5 h-1.5 bg-sendo-green animate-pulse rounded-none' />
											) : (
												<span className='w-1.5 h-1.5 bg-sendo-red animate-pulse rounded-none' />
											)}
											{agentLoading ? (
												'CONNECTING...'
											) : agent ? (
												<span className='text-sendo-green'>ONLINE</span>
											) : (
												<span className='text-sendo-red'>OFFLINE</span>
											)}
										</p>
									</div>
								</div>
								<button
									onClick={() => setIsOpen(false)}
									className='w-8 h-8 bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors'
									type='button'
								>
									<X className='w-5 h-5 text-foreground/60' />
								</button>
							</div>

							{/* Error State */}
							{(agentError || chatError) && (
								<div className='p-4 bg-red-500/10 border-b border-red-500/30'>
									<p className='text-red-400 text-sm'>{agentError || chatError}</p>
								</div>
							)}

							{/* Login Required State */}
							{!authenticated && (
								<div className='flex items-center justify-center h-full'>
									<div className='text-center max-w-xs'>
										<Sparkles className='w-12 h-12 text-sendo-orange mx-auto mb-4' />
										<h4 className='text-white font-bold mb-2 title-font'>LOGIN REQUIRED</h4>
										<p className='text-foreground/60 text-sm mb-6'>Login to start chatting with your agent.</p>
										<div className='flex justify-center'>
											<LoginButton />
										</div>
									</div>
								</div>
							)}

							{/* Messages */}
							{authenticated && (
								<div className='flex-1 overflow-y-auto p-4 space-y-4'>
									{agentLoading ? (
										<div className='flex items-center justify-center h-full'>
											<div className='text-center'>
												<Loader2 className='w-8 h-8 text-sendo-orange mx-auto mb-2 animate-spin' />
												<p className='text-foreground/60 text-sm'>Connecting to agent...</p>
											</div>
										</div>
									) : !agent ? (
										<div className='flex items-center justify-center h-full'>
											<div className='text-center'>
												<p className='text-foreground/60 text-sm'>Agent not available</p>
												<p className='text-foreground/40 text-xs mt-2'>Check server connection</p>
											</div>
										</div>
									) : messages.length === 0 ? (
										<div className='flex items-center justify-center h-full'>
											<div className='text-center max-w-xs'>
												<Sparkles className='w-12 h-12 text-sendo-orange mx-auto mb-4' />
												<h4 className='text-white font-bold mb-2'>Welcome to sEnDO Agent!</h4>
												<p className='text-foreground/60 text-sm'>
													I'm your AI assistant powered by ElizaOS. Ask me anything about your wallet, trading
													strategies, or crypto!
												</p>
											</div>
										</div>
									) : (
										messages.map((message) => {
											const isUser = message.senderId !== agent.id;
											const isActionMessage = message.type === 'agent_action' || message.source === 'agent_action';

											return (
												<div key={message.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
													<div
														className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
															isUser
																? 'bg-foreground/10'
																: 'bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red'
														}`}
														style={{
															clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
														}}
													>
														{isUser ? (
															<span className='text-foreground text-xs'>👤</span>
														) : (
															<Sparkles className='w-4 h-4 text-white' />
														)}
													</div>

													<div className={`flex-1 max-w-[80%] ${isUser ? 'flex justify-end' : ''}`}>
														<div
															className={`p-3 rounded-none ${
																isUser
																	? 'bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red text-white'
																	: 'bg-foreground/5 text-foreground'
															}`}
														>
															{isActionMessage ? (
																<Tool toolPart={convertToToolPart(message)} />
															) : (
																<>
																	<div className='text-sm leading-relaxed'>
																		{!isUser &&
																		message.id === animatedMessageId &&
																		!animatedMessagesSet.has(message.id) ? (
																			<AnimatedMarkdown
																				shouldAnimate={true}
																				messageId={message.id}
																				maxDurationMs={5000}
																				onUpdate={() => scrollToBottom(true)}
																			>
																				{message.text}
																			</AnimatedMarkdown>
																		) : (
																			<AnimatedMarkdown shouldAnimate={false}>{message.text}</AnimatedMarkdown>
																		)}
																	</div>
																	{message.createdAt && (
																		<p className='text-[10px] mt-2 opacity-60'>
																			{new Date(message.createdAt).toLocaleTimeString([], {
																				hour: '2-digit',
																				minute: '2-digit',
																			})}
																		</p>
																	)}
																</>
															)}
														</div>
													</div>
												</div>
											);
										})
									)}

									{isAgentThinking && (
										<div className='flex gap-3'>
											<div
												className='w-8 h-8 bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red flex items-center justify-center flex-shrink-0'
												style={{
													clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
												}}
											>
												<Sparkles className='w-4 h-4 text-white' />
											</div>
											<div className='bg-foreground/5 p-3 flex items-center gap-2 rounded-none'>
												<Loader2 className='w-4 h-4 text-sendo-orange animate-spin' />
												<span className='text-foreground/60 text-sm'>Thinking...</span>
											</div>
										</div>
									)}

									<div ref={messagesEndRef} />
								</div>
							)}

							{/* Input */}
							{authenticated && (
								<div className='border-t border-foreground/10 p-4 bg-background'>
									<div className='flex items-end gap-2'>
										<Textarea
											ref={inputRef}
											value={input}
											onChange={(e) => setInput(e.target.value)}
											onKeyDown={handleKeyPress}
											placeholder={agent ? 'Ask me anything...' : 'Connecting...'}
											className='h-full bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/30 resize-none min-h-0 rounded-none'
											disabled={isLoading || isAgentThinking || !agent}
											rows={2}
										/>

										<Button
											onClick={handleSend}
											disabled={!input.trim() || isLoading || isAgentThinking || !agent}
											size='icon'
											className='bg-gradient-to-r from-sendo-orange via-sendo-red to-sendo-dark-red hover:shadow-lg hover:shadow-sendo-red/50 flex-shrink-0 h-[72px] w-12 disabled:opacity-50 rounded-none'
											style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
										>
											{isLoading ? (
												<Loader2 className='w-5 h-5 animate-spin' />
											) : (
												<Send className='w-5 h-5 text-foreground' />
											)}
										</Button>
									</div>
									<p className='text-foreground/40 text-[10px] mt-2'>Press Enter to send • Shift+Enter for new line</p>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
