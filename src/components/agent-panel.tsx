'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnimatedMarkdown } from '@/components/ui/animated-markdown';
import { Tool } from '@/components/ui/tool';
import { useElizaAgent } from '@/hooks/useElizaAgent';
import { useElizaChat } from '@/hooks/use-eliza-chat';
import { AgentMessage } from '@/types/agent';

interface ToolPart {
	type: string;
	state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
	input: Record<string, unknown>;
	output: string | Record<string, unknown>;
	toolCallId: string;
	errorText: string | null;
}

export default function AgentPanel() {
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [animatedMessagesSet, setAnimatedMessagesSet] = useState(new Set<string>());

	// Fetch agent from Eliza server
	const { agent, isLoading: agentLoading, error: agentError } = useElizaAgent();

	// Chat hook
	const {
		messages,
		isLoading,
		isAgentThinking,
		sendMessage,
		error: chatError,
		animatedMessageId,
	} = useElizaChat({
		agentId: agent?.id,
	});

	const scrollToBottom = (smooth = true) => {
		messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Scroll to bottom immediately when chat opens
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
				{!isOpen && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						onClick={() => setIsOpen(true)}
						className='fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg hover:shadow-sendo-red/50 flex items-center justify-center transition-all group'
						style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
					>
						<MessageCircle className='w-7 h-7 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform' />
						<motion.div
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
							className='absolute -top-1 -right-1 w-3 h-3 bg-sendo-green'
							style={{ borderRadius: 0 }}
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
						className='fixed inset-0 z-[100] flex items-end md:items-center justify-end'
						onWheel={(e) => e.stopPropagation()}
						onTouchMove={(e) => e.stopPropagation()}
					>
						{/* Backdrop */}
						<div className='absolute inset-0 bg-black/60' onClick={() => setIsOpen(false)} />

						{/* Drawer */}
						<motion.div
							initial={{ x: 400, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 400, opacity: 0 }}
							transition={{ duration: 0.3, ease: 'easeOut' }}
							className='chat-drawer relative w-full md:w-[400px] h-[80vh] md:h-[600px] md:m-6 bg-background border-2 border-sendo-orange/30 flex flex-col'
							style={{ borderRadius: 0 }}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className='flex items-center justify-between p-4 border-b border-foreground/10 bg-gradient-to-r from-sendo-orange/10 to-sendo-red/10'>
								<div className='flex items-center gap-3'>
									<div
										className='w-10 h-10 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center'
										style={{
											clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
										}}
									>
										<Sparkles className='w-5 h-5 text-white' />
									</div>
									<div>
										<h3 className='text-white font-bold text-sm uppercase title-font'>
											{agent?.name || 'sEnDO'}{' '}
											<span className='bg-gradient-to-r from-sendo-orange to-sendo-red bg-clip-text text-transparent'>
												AGENT
											</span>
										</h3>
										<p className='text-sendo-green text-xs flex items-center gap-1'>
											{agentLoading ? (
												<span className='w-1.5 h-1.5 bg-sendo-green animate-pulse' style={{ borderRadius: 0 }} />
											) : agent ? (
												<span className='w-1.5 h-1.5 bg-sendo-green animate-pulse' style={{ borderRadius: 0 }} />
											) : (
												<span className='w-1.5 h-1.5 bg-sendo-red animate-pulse' style={{ borderRadius: 0 }} />
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
									style={{ borderRadius: 0 }}
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

							{/* Messages */}
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
												I'm your AI assistant powered by ElizaOS. Ask me anything about your wallet, trading strategies,
												or crypto!
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
														isUser ? 'bg-foreground/10' : 'bg-gradient-to-r from-sendo-orange to-sendo-red'
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
														className={`p-3 ${
															isUser
																? 'bg-gradient-to-r from-sendo-orange to-sendo-red text-white'
																: 'bg-foreground/5 text-foreground'
														}`}
														style={{ borderRadius: 0 }}
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
											className='w-8 h-8 bg-gradient-to-r from-sendo-orange to-sendo-red flex items-center justify-center flex-shrink-0'
											style={{
												clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
											}}
										>
											<Sparkles className='w-4 h-4 text-white' />
										</div>
										<div className='bg-foreground/5 p-3 flex items-center gap-2' style={{ borderRadius: 0 }}>
											<Loader2 className='w-4 h-4 text-sendo-orange animate-spin' />
											<span className='text-foreground/60 text-sm'>Thinking...</span>
										</div>
									</div>
								)}

								<div ref={messagesEndRef} />
							</div>

							{/* Input */}
							<div className='border-t border-foreground/10 p-4 bg-background'>
								<div className='flex items-end gap-2'>
									<Textarea
										ref={inputRef}
										value={input}
										onChange={(e) => setInput(e.target.value)}
										onKeyDown={handleKeyPress}
										placeholder={agent ? 'Ask me anything...' : 'Connecting...'}
										className='h-full bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/30 resize-none min-h-0'
										disabled={isLoading || isAgentThinking || !agent}
										rows={2}
										style={{ borderRadius: 0 }}
									/>

									<Button
										onClick={handleSend}
										disabled={!input.trim() || isLoading || isAgentThinking || !agent}
										size='icon'
										className='bg-gradient-to-r from-sendo-orange to-sendo-red hover:shadow-lg hover:shadow-sendo-red/50 flex-shrink-0 h-[72px] w-12 disabled:opacity-50'
										style={{
											clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
											borderRadius: 0,
										}}
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
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
