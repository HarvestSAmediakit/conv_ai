import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Mic, X, MessageSquare, Target, AudioLines, BookOpen, Loader2 } from 'lucide-react';

type PlaybackState = 'IDLE' | 'NARRATING' | 'LISTENING' | 'THINKING' | 'ANSWERING' | 'RESUMING';

export default function AudioInterruptReader() {
  const navigate = useNavigate();
  const [fsmState, setFsmState] = useState<PlaybackState>('IDLE');
  const [transcript, setTranscript] = useState<string>('');
  const [resumeCountdown, setResumeCountdown] = useState<number>(0);
  
  // Audio Simulation state
  const [audioLevel, setAudioLevel] = useState(0);

  // VAD Simulation: "Word" detection
  const handleSimulateInterrupt = () => {
    if (fsmState === 'NARRATING') {
      setFsmState('LISTENING');
      setTranscript("wait, what about the pricing?");
      setTimeout(() => {
        setFsmState('THINKING');
        setTimeout(() => {
          setFsmState('ANSWERING');
        }, 1500);
      }, 1000);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (fsmState === 'NARRATING' || fsmState === 'ANSWERING') {
      interval = setInterval(() => {
          setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [fsmState]);

  useEffect(() => {
    if (fsmState === 'ANSWERING') {
      const timer = setTimeout(() => {
        setFsmState('RESUMING');
        setResumeCountdown(3);
      }, 4000); // Simulate answer length
      return () => clearTimeout(timer);
    }
  }, [fsmState]);

  useEffect(() => {
    if (fsmState === 'RESUMING') {
      if (resumeCountdown > 0) {
        const timer = setTimeout(() => setResumeCountdown(resumeCountdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setFsmState('NARRATING');
      }
    }
  }, [fsmState, resumeCountdown]);


  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-[#00c896]/10 pb-24">
      {/* Top Header */}
      <header className="sticky top-0 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10/60 z-50 p-4 shrink-0 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
           <button onClick={() => navigate('/home')} className="p-2 bg-[#0A0A0A] border border-white/10 rounded-full hover:bg-[#1A1A1A]/5 transition-colors">
              <X size={18} />
           </button>
           <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Page 12 of 64</p>
              <h1 className="text-sm font-black text-gray-100">The Future of AI Reader</h1>
           </div>
        </div>
        <div className="bg-indigo-900/30 text-indigo-300 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20 flex items-center gap-2 cursor-pointer shadow-sm">
           Live Demo <span className={`w-2 h-2 rounded-full ${fsmState !== 'IDLE' ? 'bg-rose-500 animate-pulse' : 'bg-zinc-300'}`} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto p-6 md:p-10 relative">
         <div className={`transition-all duration-700 ${fsmState === 'LISTENING' || fsmState === 'THINKING' || fsmState === 'ANSWERING' || fsmState === 'RESUMING' ? 'opacity-30 blur-[2px] scale-[0.98]' : 'opacity-100'}`}>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">Navigating the Ad Landscape with Voice Intelligence</h2>
            <p className="text-lg leading-relaxed text-zinc-300 font-serif mb-6">
              <span className={`${fsmState === 'NARRATING' ? 'bg-[#00c896]/20 py-1' : ''}`}>The monetization layer is where things get interesting.</span> When the reader lands on an ad page, the system auto-detects it, overlays hotspots, surfaces brand metadata, and offers voice-activated Q&A about the product.
            </p>
            <p className="text-lg leading-relaxed text-zinc-300 font-serif mb-6">
              Instead of forcing users to click tiny URLs, they can simply ask "Are there any discounts?" and the AI dynamically parses the underlying text and visual data to synthesize a natural answer.
            </p>
            {/* Example Ad Block */}
            <div className="my-8 rounded-3xl overflow-hidden border border-white/10 relative group group-hover:border-indigo-300 transition-colors">
               <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800" alt="Gift Ad" className="w-full h-48 object-cover" />
               <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                 <Target size={12} /> Detected Ad
               </div>
            </div>
            <p className="text-lg leading-relaxed text-zinc-300 font-serif">
              This completely rewrites the paradigm for digital publications, bringing the personalized feeling of an in-store concierge into a passive reading experience.
            </p>
         </div>

         {/* Interruption Overlay */}
         {(fsmState === 'LISTENING' || fsmState === 'THINKING' || fsmState === 'ANSWERING' || fsmState === 'RESUMING') && (
           <div className="fixed inset-0 top-16 z-40 bg-zinc-900/10 backdrop-blur-[1px] flex items-center justify-center p-4">
              <div className="bg-[#0A0A0A] rounded-[2rem] border border-white/10 shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in zoom-in-95 duration-300">
                 
                 {/* User Query bubble */}
                 <div className="bg-indigo-900/30 border border-indigo-500/20 p-4 rounded-2xl rounded-tr-sm mb-4">
                    <p className="text-indigo-900 font-medium text-sm">"{transcript}"</p>
                 </div>

                 {/* AI Response Area */}
                 <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-[#00c896] shrink-0 flex items-center justify-center text-white shadow-md">
                      <MessageSquare size={18} />
                   </div>
                   <div className="flex-1">
                      {fsmState === 'THINKING' && (
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 h-10">
                           <Loader2 size={14} className="animate-spin text-[#00c896]" /> Searching Page Context...
                        </div>
                      )}
                      
                      {fsmState === 'ANSWERING' && (
                        <p className="text-zinc-200 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                           Yes! The current ad on page 12 mentions a 15% discount for all subscribers if you use the code 'CONVO15' at checkout. Would you like me to save that link?
                        </p>
                      )}

                      {fsmState === 'RESUMING' && (
                        <div className="space-y-4">
                          <p className="text-zinc-200 text-sm leading-relaxed text-opacity-50">
                             Yes! The current ad on page 12 mentions a 15% discount...
                          </p>
                          <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resuming narrative in {resumeCountdown}s</span>
                            <button onClick={() => setFsmState('NARRATING')} className="text-xs font-bold text-[#00c896] hover:bg-[#00c896]/10 px-3 py-1.5 rounded-lg transition-colors">
                              Continue Now &rarr;
                            </button>
                          </div>
                        </div>
                      )}
                   </div>
                 </div>
              </div>
           </div>
         )}
      </main>

      {/* Bottom Global Media Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/10 p-4 safe-area-pb z-50 flex items-center justify-center">
         <div className="w-full max-w-sm flex items-center justify-between gap-4">
            
            <button className="p-3 text-zinc-400 hover:text-zinc-200 transition-colors">
               <BookOpen size={20} />
            </button>

            {/* Main Play/VAD Central Button */}
            <div className="relative">
              {fsmState === 'IDLE' ? (
                 <button 
                   onClick={() => setFsmState('NARRATING')} 
                   className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 hover:scale-105 transition-all shadow-xl"
                 >
                    <Play size={24} className="ml-1" />
                 </button>
              ) : (
                 <button 
                   onMouseDown={handleSimulateInterrupt}
                   onTouchStart={handleSimulateInterrupt}
                   className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl border-4 ${
                     fsmState === 'LISTENING' ? 'bg-rose-500 border-rose-200 animate-pulse' : 
                     fsmState === 'NARRATING' ? 'bg-[#00c896] border-[#00c896]/30 hover:scale-105' : 
                     'bg-indigo-500 border-indigo-200'
                   }`}
                 >
                    {fsmState === 'LISTENING' ? <Mic size={24} className="text-white" /> : <AudioLines size={24} className="text-white" />}
                 </button>
              )}

              {/* Pulsing Audio Ring during Narration/Answering */}
              {(fsmState === 'NARRATING' || fsmState === 'ANSWERING') && (
                <div 
                  className="absolute inset-0 rounded-full border-2 border-[#00c896] pointer-events-none opacity-50"
                  style={{ transform: `scale(${1 + audioLevel / 200})`, transition: 'transform 0.1s ease-out' }}
                />
              )}
            </div>

            <button className="p-3 text-zinc-400 hover:text-zinc-200 transition-colors relative group">
               <MessageSquare size={20} />
               {fsmState === 'NARRATING' && (
                 <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap bubble-tail transition-opacity">
                   Hold mic to ask
                 </span>
               )}
            </button>
         </div>
      </div>
    </div>
  );
}
