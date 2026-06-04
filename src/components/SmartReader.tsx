import React, { useEffect, useState, useRef } from 'react';
import { loadMagazineContent, MagazineArticle } from '../lib/contentLoader';
import TalkToThisIssue from './TalkToThisIssue';
import { Sparkles, X, Loader2 } from 'lucide-react';

interface ReaderProps {
  magazineId: string;
}

function ArticleSection({ 
  sec, 
  magazineId 
}: { 
  sec: any; 
  magazineId: string; 
}) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSummarize = async () => {
    if (summary) {
      setShowTooltip(true);
      return;
    }
    
    setIsSummarizing(true);
    setShowTooltip(true);
    
    try {
      const res = await fetch(`/api/magazines/${magazineId}/summarize-section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heading: sec.heading,
          content: sec.content,
        })
      });
      
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummary("Failed to generate summary.");
      }
    } catch (err) {
      setSummary("Error generating summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <section 
      id={sec.id}
      className="article-section border-l-2 border-transparent hover:border-emerald-500/30 pl-4 transition-colors relative group"
      data-content={sec.content}
      data-heading={sec.heading}
    >
      <h2 className="text-xl font-bold text-white mb-3">{sec.heading}</h2>
      <p className="text-slate-300 leading-relaxed font-serif text-lg">{sec.content}</p>

      {/* Floating Action Button for Summarize */}
      <button
        onClick={handleSummarize}
        className="absolute top-0 right-0 -mt-2 -mr-2 md:-mr-12 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full shadow-lg flex items-center justify-center z-10"
        title="Quick Summary"
      >
        <Sparkles size={16} />
      </button>

      {/* Summary Tooltip / Popover */}
      {showTooltip && (
        <div className="absolute top-10 right-0 md:-right-12 w-64 md:w-80 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-2xl z-20 overflow-hidden transform transition-all duration-200">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
            <Sparkles size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">AI Summary</span>
          </div>
          {isSummarizing ? (
            <div className="flex flex-col items-center justify-center py-4 text-slate-400 space-y-2">
              <Loader2 size={24} className="animate-spin text-indigo-500" />
              <span className="text-sm">Synthesizing core points...</span>
            </div>
          ) : (
            <p className="text-sm text-slate-200 leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default function SmartReader({ magazineId }: ReaderProps) {
  const [articles, setArticles] = useState<MagazineArticle[]>([]);
  const [activeSectionText, setActiveSectionText] = useState<string>('');
  const [activeSectionHeading, setActiveSectionHeading] = useState<string>('');
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    async function init() {
      const data = await loadMagazineContent(magazineId);
      setArticles(data);
      if (data[0]?.sections[0]) {
        setActiveSectionText(data[0].sections[0].content);
        setActiveSectionHeading(data[0].sections[0].heading);
      }
    }
    init();
  }, [magazineId]);

  useEffect(() => {
    // Setup the observer to monitor what section the user is looking at
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const text = entry.target.getAttribute('data-content') || '';
          const heading = entry.target.getAttribute('data-heading') || '';
          setActiveSectionText(text);
          setActiveSectionHeading(heading);
        }
      });
    }, { root: null, rootMargin: '-20% 0px -60% 0px' }); // Triggers when section occupies prime reading space

    // Attach observer to elements
    const elements = document.querySelectorAll('.article-section');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [articles]);

  if (articles.length === 0) return <div className="p-8 text-white">Loading publication...</div>;

  const currentArticle = articles[0];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center px-6 shrink-0 bg-slate-950">
        <h1 className="text-white font-bold tracking-tight">ConvoMag AI Reader</h1>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Core Reading Panel */}
        <main className="flex-1 min-h-0 lg:min-w-0 overflow-y-auto p-6 md:p-12 space-y-8 bg-slate-950">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded">
              {currentArticle.category}
            </span>
            <h1 className="text-4xl font-extrabold text-white mt-4 mb-2">{currentArticle.title}</h1>
            <p className="text-sm text-slate-400 mb-10">Written by {currentArticle.author}</p>

            <div className="space-y-12 pb-24">
              {currentArticle.sections.map((sec) => (
                <ArticleSection key={sec.id} sec={sec} magazineId={magazineId} />
              ))}
            </div>
          </div>
        </main>

        {/* RIGHT: Contextual AI Sidebar Component */}
        <aside id="chatBox" className="w-full shrink-0 lg:w-[400px] xl:w-[480px] h-[50vh] lg:h-full border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col">
          {/* We pass the active viewing context directly into the chat interface */}
          <TalkToThisIssue 
            magazineId={magazineId} 
            personaName="Harvest Critic" 
            personaTone="intellectual-sharp"
            readingContext={`The reader is currently looking at the section "${activeSectionHeading}": "${activeSectionText}"`}
          />
        </aside>
      </div>
    </div>
  );
}
