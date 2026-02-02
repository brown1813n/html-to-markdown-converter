import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Calendar, Clock, List } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface BlogPostProps {
  title: string;
  description?: string;
  date: string;
  readTime: string;
  content: string;
  onBack: () => void;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const BlogPost: React.FC<BlogPostProps> = ({ title, description, date, readTime, content, onBack }) => {
  // Handle SEO (Title and Description) on mount
  useEffect(() => {
    document.title = `${title} | Markdown Formatter & Converter`;

    // Try to find existing meta description
    let metaDescription = document.querySelector('meta[name="description"]');

    if (description) {
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }, [title, description]);

  // Generate TOC and process content to add IDs
  const { processedContent, toc } = useMemo(() => {
    // Basic server-side safeguard (though this is client-rendered)
    if (typeof window === 'undefined') {
        return { processedContent: content, toc: [] };
    }

    const div = document.createElement('div');
    div.innerHTML = content;

    const headings: TocItem[] = [];
    // Select H2 and H3 tags
    const headingElements = div.querySelectorAll('h2, h3');

    headingElements.forEach((el, index) => {
        const text = el.textContent || '';
        
        // Generate a slug from the text
        let slug = text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
            .replace(/(^-|-$)+/g, '');   // Remove leading/trailing hyphens
        
        // Fallback if slug is empty
        if (!slug) slug = `section-${index}`;

        // Ensure slug uniqueness within the document
        let uniqueSlug = slug;
        let counter = 1;
        while (headings.some(h => h.id === uniqueSlug)) {
            uniqueSlug = `${slug}-${counter++}`;
        }

        // Apply ID and scroll margin class for sticky header offset
        el.id = uniqueSlug;
        el.classList.add('scroll-mt-32');

        headings.push({
            id: uniqueSlug,
            text,
            level: parseInt(el.tagName.substring(1))
        });
    });

    return { 
        processedContent: div.innerHTML, 
        toc: headings 
    };
  }, [content]);

  // Scroll Spy to highlight active TOC item
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc, processedContent]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
          {/* Main Content Column */}
          <div className="lg:col-span-8 xl:col-span-9">
            
            {/* Navigation */}
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Converter
            </button>

            {/* Header */}
            <header className="mb-12 border-b border-slate-800 pb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 leading-tight">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium">
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  <Calendar className="w-4 h-4" />
                  {date}
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  <Clock className="w-4 h-4" />
                  {readTime}
                </div>
              </div>
            </header>

            {/* Content */}
            <article 
              className="prose prose-invert max-w-none prose-lg text-slate-300 prose-headings:text-slate-100 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-p:my-8 prose-headings:mt-16 prose-headings:mb-6 prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>

          {/* Sidebar Column (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
             <div className="sticky top-24 space-y-6">
                {toc.length > 0 && (
                    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                        <h4 className="flex items-center gap-2 font-semibold text-slate-100 mb-4 text-xs uppercase tracking-wider">
                            <List className="w-4 h-4" />
                            Table of Contents
                        </h4>
                        <nav className="flex flex-col space-y-2">
                            {toc.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                        setActiveId(item.id);
                                    }}
                                    className={`text-sm py-1.5 pl-3 border-l-2 transition-colors duration-200 block leading-relaxed ${
                                        activeId === item.id
                                        ? 'border-blue-500 text-blue-400 font-medium'
                                        : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                                    } ${item.level === 3 ? 'ml-3' : ''}`}
                                >
                                    {item.text}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
                
                {/* Ad Placement */}
                <AdBanner />
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
};