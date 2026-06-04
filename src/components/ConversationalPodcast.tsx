import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Mic, Search, Volume2, ArrowRightCircle } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

interface ConversationalPodcastProps {
  articleTitle: string;
  articleText: string;
  assistantName: string;
}

type PodcastState = 'idle' | 'playing' | 'listening' | 'searching' | 'answering';

export default function ConversationalPodcast({ articleTitle, articleText, assistantName }: ConversationalPodcastProps) {
  const [state, setState] = useState<PodcastState>('idle');
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState<string>('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated synthetic podcast
  useEffect(() => {
    if (state === 'playing') {
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
             setState('idle');
             return 0;
          }
          return p + 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  const handlePlayPause = () => {
    if (state === 'idle') {
      setState('playing');
    } else if (state === 'playing') {
      setState('idle');
    }
  };

  const handleInterruptClick = () => {
    if (state === 'playing') {
      setState('listening');
      setTranscript('');
    }
  };

  const simulateReaderQuestion = () => {
    setTranscript('Wait, what did she say about GPT-5?');
    setState('searching');
    setTimeout(() => {
      setState('answering');
    }, 2000);
  };

  const handleResume = () => {
    setTranscript('');
    setState('playing');
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Dynamic Background Glow Based on State */}
      <div 
        className={`absolute inset-0 opacity-20 blur-3xl transition-colors duration-1000 ${
          state === 'playing' ? 'bg-emerald-500' : 
          state === 'listening' ? 'bg-rose-500' : 
          state === 'searching' ? 'bg-amber-400' :
          state === 'answering' ? 'bg-indigo-500' : 'bg-transparent'
        }`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
            <Volume2 size={12} className={state === 'playing' ? 'text-emerald-400' : ''} />
            <span>AI Podcast</span>
          </div>
          <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-medium">
            AI: {assistantName}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg leading-tight mb-5 line-clamp-2">
          {articleTitle}
        </h3>

        {/* Visualizer & Progress */}
        <div className="mb-6 relative">
          <div className="h-20 w-full bg-zinc-950/50 rounded-xl overflow-hidden flex items-center justify-center mb-3 border border-zinc-800/50">
            {state === 'idle' ? (
               <div className="text-zinc-600 font-medium text-xs flex items-center gap-2">
                 <Play size={10} /> Ready to play
               </div>
            ) : (
                <AudioVisualizer 
                  isActive={state === 'playing' || state === 'answering'} 
                  color={state === 'answering' ? '#6366f1' : '#10b981'}
                  shape="bars"
                />
            )}
            
            {state === 'listening' && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 flex items-center justify-center bg-rose-500/10"
              >
                <div className="flex flex-col items-center text-rose-400">
                  <Mic size={24} className="mb-2 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest uppercase">Listening...</span>
                </div>
              </motion.div>
            )}

            {state === 'searching' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-500/10 text-amber-400">
                 <Search size={20} className="mb-2 animate-bounce" />
                 <span className="text-xs font-bold tracking-widest uppercase">Scanning Article...</span>
              </div>
            )}
          </div>

          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all ease-linear"
              style={{ width: `${progress}%`, transitionDuration: state === 'playing' ? '100ms' : '0s' }}
            />
          </div>
        </div>

        {/* Interaction Panel */}
        <div className="min-h-[80px]">
          <AnimatePresence mode="wait">
            {(state === 'idle' || state === 'playing') && (
              <motion.div 
                key="controls"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between"
              >
                <button 
                  onClick={handlePlayPause}
                  className="w-12 h-12 flex items-center justify-center bg-white text-zinc-900 rounded-full hover:scale-105 transition-transform"
                >
                  {state === 'playing' ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current translate-x-0.5" />}
                </button>

                <button 
                  onClick={handleInterruptClick}
                  disabled={state !== 'playing'}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    state === 'playing' ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-transparent text-zinc-600 border border-zinc-800'
                  }`}
                >
                  <Mic size={14} /> Interrupt & Ask
                </button>
              </motion.div>
            )}

            {state === 'listening' && (
               <motion.div
                  key="listening"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
               >
                 <button 
                   onClick={simulateReaderQuestion}
                   className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-full text-xs transition-colors mb-2"
                 >
                   (Simulate User Question)
                 </button>
                 <button onClick={() => setState('playing')} className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider hover:text-zinc-300">
                   Cancel ✕
                 </button>
               </motion.div>
            )}

            {(state === 'searching' || state === 'answering') && (
               <motion.div
                 key="answering"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="space-y-3"
               >
                 <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/50 relative">
                   <p className="text-xs text-zinc-300 italic">"{transcript}"</p>
                 </div>
                 
                 {state === 'answering' && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="bg-indigo-900/40 border border-indigo-500/30 p-3 rounded-lg flex flex-col items-start gap-2"
                   >
                     <p className="text-xs text-indigo-200">
                       <span className="font-bold text-indigo-400">Luna:</span> "In paragraph 3, Sarah mentions GPT-5 will likely feature native reasoning protocols without needing chain-of-thought..."
                     </p>
                     
                     <div className="w-full h-px bg-indigo-500/20 my-1" />
                     
                     <div className="flex items-center justify-between w-full">
                       <span className="text-[10px] text-indigo-300 font-medium">Continue reading?</span>
                       <button 
                         onClick={handleResume}
                         className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-md px-3 py-1.5 text-xs font-bold transition-colors"
                       >
                         Resume <ArrowRightCircle size={14} />
                       </button>
                     </div>
                   </motion.div>
                 )}
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
