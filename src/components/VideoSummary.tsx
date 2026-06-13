import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, FileText, Share2, Youtube, Clock, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

interface Highlight {
  timestamp: string;
  text: string;
}

interface VideoSummaryProps {
  id: string;
  title: string;
  summary: string;
  highlights: Highlight[];
  youtubeUrl?: string;
  onExport?: (id: string) => void;
}

export default function VideoSummary({ id, title, summary, highlights, youtubeUrl, onExport }: VideoSummaryProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (onExport) {
        await onExport(id);
      }
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto"
    >
      {/* Header / Video Preview Placeholder */}
      <div className="relative h-48 bg-zinc-900 flex items-center justify-center group overflow-hidden">
        {youtubeUrl ? (
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
        ) : null}
        <Youtube className="text-zinc-800 group-hover:text-red-500 transition-colors" size={64} />
        
        <div className="absolute bottom-4 left-4 z-20">
          <h3 className="text-white font-bold text-lg tracking-tight drop-shadow-md">{title}</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Cinematic Summary Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <FileText size={14} />
            <span>AI Executive Summary</span>
          </div>
          <p className="text-zinc-300 leading-relaxed font-serif italic text-lg">
            "{summary}"
          </p>
        </motion.div>

        {/* Highlights List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest border-b border-zinc-800 pb-2">
            <Clock size={14} />
            <span>Key Moments</span>
          </div>
          <div className="grid gap-3">
            {highlights.map((item, idx) => (
              <motion.button
                key={`${id}-highlight-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all text-left group"
              >
                <div className="bg-zinc-800 text-zinc-400 text-[10px] font-mono px-2 py-1 rounded group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  {item.timestamp}
                </div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors flex-1">
                  {item.text}
                </span>
                <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
          <div className="flex items-center gap-4">
             <button className="text-zinc-500 hover:text-zinc-300 text-xs font-bold flex items-center gap-2 transition-colors">
               <Play size={14} />
               WATCH FULL
             </button>
             <button className="text-zinc-500 hover:text-zinc-300 text-xs font-bold flex items-center gap-2 transition-colors">
               <Share2 size={14} />
               SHARE
             </button>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting || exported}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all
              ${exported 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              }
            `}
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : exported ? <CheckCircle2 size={14} /> : null}
            {exported ? 'EXPORTED' : 'EXPORT TO CREATOR STUDIO'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
