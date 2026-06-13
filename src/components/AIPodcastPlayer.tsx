import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  X, 
  Mic2, 
  Radio, 
  Loader2,
  Headphones
} from 'lucide-react';

interface Segment {
  title: string;
  description: string;
  timestamp: string;
}

interface PodcastData {
  episode_name: string;
  hosts: string[];
  segments: Segment[];
}

interface AIPodcastPlayerProps {
  magazineId: string;
  magazineTitle: string;
  onClose: () => void;
}

export default function AIPodcastPlayer({ magazineId, magazineTitle, onClose }: AIPodcastPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Fetch generated podcast script from server
    const fetchPodcast = async () => {
      try {
        const res = await fetch(`/api/magazines/${magazineId}/podcast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: magazineTitle })
        });
        const data = await res.json();
        setPodcast(data);
      } catch (err) {
        console.error("Failed to generate podcast:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcast();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [magazineId, magazineTitle]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 80 + 20);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const speakSegment = (idx: number) => {
    if (!podcast) return;
    window.speechSynthesis.cancel();

    const segment = podcast.segments[idx];
    const text = `Next up: ${segment.title}. ${segment.description}`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      if (idx < podcast.segments.length - 1) {
        setCurrentSegmentIdx(idx + 1);
        speakSegment(idx + 1);
      } else {
        setIsPlaying(false);
      }
    };

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speakSegment(currentSegmentIdx);
      }
    }
  };

  const handleSkipForward = () => {
    if (podcast && currentSegmentIdx < podcast.segments.length - 1) {
      setCurrentSegmentIdx(currentSegmentIdx + 1);
      speakSegment(currentSegmentIdx + 1);
    }
  };

  const handleSkipBack = () => {
    if (currentSegmentIdx > 0) {
      setCurrentSegmentIdx(currentSegmentIdx - 1);
      speakSegment(currentSegmentIdx - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-[70]"
    >
      <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Radio size={20} />
             </div>
             <div>
                <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">AI Podcast Mode</h4>
                <p className="text-white font-bold text-sm tracking-tight">{magazineTitle}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
             <Loader2 size={32} className="animate-spin text-emerald-500" />
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">Generating conversational synthesis...</p>
          </div>
        ) : (
          <>
            {/* Visualizer Area */}
            <div className="flex items-center justify-center gap-1.5 h-16 mb-8">
               {[...Array(16)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ 
                     height: isPlaying ? [10, audioLevel * (0.3 + Math.random() * 0.7), 10] : 4 
                   }}
                   transition={{ 
                     repeat: Infinity, 
                     duration: 0.5 + Math.random() * 0.5,
                     ease: "easeInOut"
                   }}
                   className="w-1.5 rounded-full bg-emerald-500/40"
                   style={{ height: '4px' }}
                 />
               ))}
            </div>

            {/* Current Segment Info */}
            <div className="text-center mb-10 px-4">
               <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                 {podcast?.segments[currentSegmentIdx]?.title}
               </h3>
               <p className="text-zinc-500 text-xs line-clamp-2 italic leading-relaxed">
                 {podcast?.segments[currentSegmentIdx]?.description}
               </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-8 mb-4">
               <button 
                 onClick={handleSkipBack}
                 className="p-3 text-zinc-400 hover:text-white transition-colors"
               >
                 <SkipBack size={24} />
               </button>

               <button 
                 onClick={togglePlay}
                 className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
               >
                 {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
               </button>

               <button 
                 onClick={handleSkipForward}
                 className="p-3 text-zinc-400 hover:text-white transition-colors"
               >
                 <SkipForward size={24} />
               </button>
            </div>

            {/* Host Details */}
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/5">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{podcast?.hosts[0]} (Anchor)</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{podcast?.hosts[1]} (Expert)</span>
               </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
