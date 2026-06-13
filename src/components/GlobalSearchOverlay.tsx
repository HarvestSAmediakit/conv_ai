import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, BookOpen, ExternalLink, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  coverUrl: string;
  publisher: string;
  snippet: string;
  type: 'magazine' | 'newspaper';
}

interface GlobalSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchOverlay({ isOpen, onClose }: GlobalSearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search/discover?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id: string) => {
    onClose();
    navigate(`/reader?pub=${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="relative border-b border-white/5">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                ref={inputRef}
                type="text"
                className="w-full h-16 pl-16 pr-20 bg-transparent text-white placeholder-zinc-500 outline-none text-lg font-medium"
                placeholder="Search across all publications..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && onClose()}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {loading ? (
                  <Loader2 className="animate-spin text-[#00c896]" size={20} />
                ) : query && (
                  <button onClick={() => setQuery('')} className="p-1 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
                    <X size={16} />
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  ESC
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {!query && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                    <Search size={32} />
                  </div>
                  <h3 className="text-white font-bold mb-2">Platform Discovery</h3>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    Search for articles, commodities, companies, or topics across our entire high-fidelity library.
                  </p>
                </div>
              )}

              {query && !loading && results.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-zinc-500">No results found for "{query}"</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="p-2">
                  <div className="px-4 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2">
                    {results.length} Matching Publications
                  </div>
                  <div className="space-y-1">
                    {results.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => handleSelect(res.id)}
                        className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-all flex gap-4 group"
                      >
                        <div className="w-16 h-20 bg-zinc-900 rounded-lg overflow-hidden border border-white/5 shrink-0 shadow-md">
                          <img src={res.coverUrl} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-[#00c896] uppercase tracking-wider">{res.type}</span>
                            <span className="text-zinc-500 text-[10px] group-hover:text-white transition-colors flex items-center gap-1">
                              Open Reader <CornerDownLeft size={10} />
                            </span>
                          </div>
                          <h4 className="text-white font-bold text-sm truncate mb-1 group-hover:text-[#00c896] transition-colors">{res.title}</h4>
                          <p className="text-zinc-500 text-xs line-clamp-2 italic font-serif leading-relaxed">
                            {res.snippet}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 grayscale opacity-50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Indexing Engine: Active</span>
                </div>
              </div>
              <p className="text-[9px] text-zinc-600 font-medium">Powering Agricultural Intelligence Across 240+ Publications</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
