'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Menu, X, List } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const extractText = (children: React.ReactNode): string => {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (typeof children === 'object' && 'props' in (children as any)) return extractText((children as any).props.children);
  return '';
};

const QuickLinks = () => {
  const pathname = usePathname();
  
  const links = [
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
  ];

  return (
    <div className="mb-8 border-l border-white/10 pl-6 space-y-4">
       <Link href="/" className="inline-flex items-center gap-2 text-sendo-gray hover:text-white transition-colors text-sm font-bold uppercase tracking-wider mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
       </Link>
       
       <div className="flex flex-col space-y-2">
         {links.map((link) => (
           <Link 
             key={link.href} 
             href={link.href}
             className={cn(
               "text-sm transition-colors flex items-center justify-between group",
               pathname === link.href 
                 ? "text-sendo-red font-bold" 
                 : "text-muted-foreground hover:text-white"
             )}
           >
             {link.name}
             {pathname !== link.href && (
               <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
             )}
           </Link>
         ))}
       </div>
    </div>
  );
};

export function LegalPage({ title, lastUpdated, content }: LegalPageProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Extract headings for TOC
    const lines = content.split('\n');
    const items: TocItem[] = [];
    
    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        // Clean text: remove bold/italic markers
        const text = match[2].trim().replace(/\*\*/g, '').replace(/\*/g, '');
        const id = slugify(text);
        items.push({ id, text, level });
      }
    });
    
    setToc(items);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      // Get all headings
      const headingIds = toc.map(item => item.id);
      let currentActiveId = '';
      
      // Simple approach: find the first heading that is in the viewport or close to top
      // We want to highlight the section we are currently reading.
      // Usually this means the section heading is above the viewport middle, 
      // or it's the last heading we passed.
      
      // Let's find the last heading that is above the "reading line" (e.g. top 20% of screen)
      for (const id of headingIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        // If heading is above 150px from top (accounting for header)
        if (rect.top < 200) {
          currentActiveId = id;
        } else {
          // Since headings are in order, once we find one below, we stop
          break;
        }
      }
      
      // Edge case: scrolled to very bottom
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
          if (headingIds.length > 0) {
            currentActiveId = headingIds[headingIds.length - 1];
          }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (window.scrollY < 100 && headingIds.length > 0) {
         // If at top, maybe first one
         setActiveId(headingIds[0]);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once to set initial state
    setTimeout(handleScroll, 100); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        // Scroll with offset for sticky header if needed, though scroll-mt handles it usually
        // scrollIntoView is simplest
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveId(id);
        window.history.pushState(null, '', `#${id}`);
        setIsMobileMenuOpen(false);
      }
  };

  const renderToc = () => (
    <div className="border-l border-white/10 pl-6 space-y-4">
      <h4 className="text-sm font-bold text-sendo-gray uppercase tracking-wider mb-6">
        Table of Contents
      </h4>
      <nav className="flex flex-col space-y-3">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "text-sm transition-colors duration-200 hover:text-sendo-red line-clamp-1 block py-1",
              activeId === item.id 
                ? "text-sendo-red font-bold translate-x-1" 
                : "text-muted-foreground"
            )}
            style={{
              paddingLeft: `${(item.level - 1) * 12}px`
            }}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(item.id);
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-sendo-red/20 selection:text-sendo-red relative">
      {/* Mobile Quick Access Button */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <Button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-full w-12 h-12 shadow-xl shadow-sendo-red/20 bg-sendo-red hover:bg-sendo-dark-red border border-white/10"
          size="icon"
        >
          <List className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Mobile Sidebar Modal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-[85px] right-0 h-[calc(100vh-85px)] w-[80%] max-w-[320px] bg-[#0A0A0A] border-l border-white/10 z-50 lg:hidden overflow-y-auto p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                 <span className="text-sm font-bold uppercase tracking-wider text-sendo-gray">Quick Access</span>
                 <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                   <X className="w-5 h-5" />
                 </Button>
              </div>
              <QuickLinks />
              <div className="my-6 border-t border-white/5"></div>
              {renderToc()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sidebar / TOC - Desktop */}
          <aside className="lg:col-span-3 lg:sticky lg:top-48 h-fit hidden lg:block max-h-[calc(100vh-14rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-sendo-red/20 hover:scrollbar-thumb-sendo-red/50 scrollbar-track-transparent">
            <QuickLinks />
            {renderToc()}
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 lg:col-start-5 max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-12 border-b border-white/10 pb-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-sendo-gray font-mono">
                  {lastUpdated}
                </p>
              </div>

              <div className="max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => {
                       const text = extractText(props.children);
                       const id = slugify(text);
                       return <h2 id={id} className="text-2xl md:text-3xl mt-16 mb-8 scroll-mt-32 font-bold" {...props} />;
                    },
                    h2: ({ node, ...props }) => {
                       const text = extractText(props.children);
                       const id = slugify(text);
                       return <h3 id={id} className="text-xl md:text-2xl mt-10 mb-6 scroll-mt-32 font-semibold text-white/90" {...props} />;
                    },
                    h3: ({ node, ...props }) => {
                       const text = extractText(props.children);
                       const id = slugify(text);
                       return <h4 id={id} className="text-lg font-bold mt-8 mb-4 scroll-mt-32 text-sendo-red" {...props} />;
                    },
                    p: ({ node, ...props }) => (
                      <p className="mb-6 leading-relaxed text-white/80" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-white/80" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-white/80" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="pl-1 marker:text-sendo-red" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-white" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-sendo-red hover:text-sendo-orange transition-colors underline decoration-sendo-red/30 underline-offset-4" {...props} />
                    ),
                    hr: () => <hr className="my-12 border-white/10" />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-2 border-sendo-red pl-4 italic my-6 text-white/60 bg-white/5 p-4 rounded-r-md" {...props} />
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
