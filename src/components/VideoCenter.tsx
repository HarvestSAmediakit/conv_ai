import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Youtube, Plus, Loader2, PlayCircle, BarChart2, X, Send } from 'lucide-react';
import VideoSummary from './VideoSummary';

interface VideoLog {
  id: string;
  title: string;
  summary: string;
  highlights: any[];
  youtubeUrl: string;
  createdAt: string;
}

export default function VideoCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<VideoLog[]>([]);
  
  // Create form state
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [currentResult, setCurrentResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSummaries();
    }
  }, [isOpen]);

  const fetchSummaries = async () => {
    try {
      const res = await fetch('/api/video-summaries');
      if (res.ok) {
        const data = await res.json();
        setSummaries(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSummarize = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setCurrentResult(null);
    try {
      const res = await fetch('/api/video-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          youtubeUrl,
          transcript
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentResult(data);
        setActiveTab('history');
        fetchSummaries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (summaryId: string) => {
    try {
      const res = await fetch('/api/video-summaries/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryId })
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <>
      {/* Floating Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[100] h-14 w-14 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/20 transition-all hover:scale-110 active:scale-95 group"
      >
        <Youtube size={24} className="group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] border border-zinc-800 w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-xl">
                    <Youtube className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">Multimodal Media Hub</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Phase 8: Video Summarization Engine</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-500 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-zinc-950 px-6 gap-6 shrink-0">
                <button 
                  onClick={() => setActiveTab('create')}
                  className={`py-3 text-xs font-bold transition-all border-b-2 ${activeTab === 'create' ? 'text-indigo-400 border-indigo-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                >
                  NEW SUMMARY
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`py-3 text-xs font-bold transition-all border-b-2 ${activeTab === 'history' ? 'text-indigo-400 border-indigo-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                >
                  PAST SUMMARIES ({summaries.length})
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'create' ? (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Video Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. AI Keynote 2024"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">YouTube URL (Opt)</label>
                          <input 
                            type="text" 
                            placeholder="https://youtube.com/..."
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Video Transcript</label>
                            <span className="text-[10px] text-zinc-600 font-mono">{transcript.length} chars</span>
                         </div>
                         <textarea 
                           rows={8}
                           placeholder="Paste the video transcript here for AI analysis..."
                           value={transcript}
                           onChange={(e) => setTranscript(e.target.value)}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none custom-scrollbar"
                         />
                      </div>
                    </div>

                    <button
                      onClick={handleSummarize}
                      disabled={loading || !transcript.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold text-sm py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>SYNTHESIZING WITH GEMINI...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          <span>GENERATE CINEMATIC SUMMARY</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[10px] text-zinc-600 leading-relaxed font-medium">
                      Analysis grounded by Firestore Vector Store & Deep Research Engine.<br />
                      Gemini 1.5 Flash provides 2-3 sentence summaries with key timestamp highlights.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-12 pb-12">
                    {summaries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-24 text-zinc-600 space-y-4">
                        <BarChart2 size={48} className="opacity-20" />
                        <p className="text-sm font-medium">No results in your multimodal vault yet.</p>
                      </div>
                    ) : (
                      summaries.map((item) => (
                        <VideoSummary
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          summary={item.summary}
                          highlights={item.highlights}
                          youtubeUrl={item.youtubeUrl}
                          onExport={handleExport}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
