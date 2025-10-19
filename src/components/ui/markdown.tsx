import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
	children: string;
	className?: string;
}

export function Markdown({ children, className = '' }: MarkdownProps) {
	return (
		<div className={`markdown-content ${className}`}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					// Code blocks
					pre: ({ children }) => (
						<pre className="overflow-x-auto bg-black/50 border border-white/10 p-4 my-2 text-sm font-mono">
							{children}
						</pre>
					),

					// Inline code
					code: ({ className, children, ...props }) => {
						const isInline = !className;
						if (isInline) {
							return (
								<code className="bg-white/10 px-1.5 py-0.5 text-sm font-mono text-sendo-green" {...props}>
									{children}
								</code>
							);
						}
						return (
							<code className={className} {...props}>
								{children}
							</code>
						);
					},

					// Headers
					h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2 text-white">{children}</h1>,
					h2: ({ children }) => <h2 className="text-xl font-semibold mt-3 mb-2 text-white">{children}</h2>,
					h3: ({ children }) => <h3 className="text-lg font-semibold mt-2 mb-1 text-white">{children}</h3>,

					// Paragraphs
					p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,

					// Lists
					ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
					ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,

					// Links
					a: ({ href, children }) => (
						<a
							href={href}
							className="text-sendo-green underline hover:text-sendo-orange transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							{children}
						</a>
					),

					// Blockquotes
					blockquote: ({ children }) => (
						<blockquote className="border-l-2 border-sendo-orange pl-4 my-2 italic text-white/80">
							{children}
						</blockquote>
					),

					// Tables
					table: ({ children }) => (
						<div className="overflow-x-auto my-2">
							<table className="min-w-full border border-white/10">{children}</table>
						</div>
					),
					th: ({ children }) => (
						<th className="border border-white/10 px-4 py-2 bg-white/5 text-left font-semibold">{children}</th>
					),
					td: ({ children }) => <td className="border border-white/10 px-4 py-2">{children}</td>,

					// Strong/Bold
					strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,

					// Emphasis/Italic
					em: ({ children }) => <em className="italic">{children}</em>,

					// Horizontal rule
					hr: () => <hr className="border-white/10 my-4" />,
				}}
			>
				{children}
			</ReactMarkdown>
		</div>
	);
}
