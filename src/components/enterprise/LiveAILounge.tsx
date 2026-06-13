import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX,
  Sparkles,
  Zap,
  Activity,
  User,
  Radio,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LiveAILounge() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoice, setActiveVoice] = useState('Helena (Expert)');
  const [transcript, setTranscript] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock speech activity
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setTranscript(prev => [...prev.slice(-3), "Publisher: How is the harvest looking this year for maize?"]);
        setTimeout(() => {
          setTranscript(prev => [...prev.slice(-3), "AI (Helena): Based on technical nodes 4A and 2B, we expect a 12% surplus in the Free State region due to early rainfall."]);
          setIsSpeaking(true);
          setTimeout(() => setIsSpeaking(false), 3000);
        }, 1500);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight italic flex items-center gap-3">
             <Radio className="text-[#00c896]" size={32} />
             Live AI Discussion Lounge
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time low-latency voice interaction with your PDF content nodes.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c896] animate-pulse" />
              Latency: 42ms
           </div>
           <button className="p-2 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-all">
              <Settings size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stage */}
        <div className="lg:col-span-2 p-12 rounded-[48px] bg-[#050505] text-white flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
           {/* Ambient Background */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00c89608,transparent_70%)]" />
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

           {/* AI Avatar Visualizer */}
           <div className="relative mb-16">
              <div className={`w-48 h-48 rounded-full border-2 border-[#00c896]/20 flex items-center justify-center relative z-10 transition-all duration-500 ${isSpeaking ? 'scale-110 shadow-[0_0_80px_-20px_#00c896]' : ''}`}>
                 <div className="p-8 rounded-full bg-zinc-900 border border-white/10 relative overflow-hidden group">
                    <User size={64} className={`text-[#00c896] transition-all duration-500 ${isSpeaking ? 'scale-125 brightness-150' : 'opacity-40'}`} />
                 </div>
                 
                 {/* Voice Ripples */}
                 {isSpeaking && (
                   <motion.div 
                     initial={{ scale: 1, opacity: 0.5 }}
                     animate={{ scale: 1.5, opacity: 0 }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="absolute inset-0 rounded-full border-2 border-[#00c896] z-0"
                   />
                 )}
              </div>
           </div>

           <div className="text-center space-y-4 mb-20 relative z-10 px-8">
              <h2 className="text-2xl font-black italic tracking-tight">
                 {isSpeaking ? 'Helena is speaking...' : isListening ? 'Listening for your voice...' : 'Awaiting Connection'}
              </h2>
              <div className="flex justify-center gap-1 h-8">
                 {[...Array(8)].map((_, i) => (
                   <motion.div 
                    key={i}
                    animate={isSpeaking || isListening ? { height: [8, 24, 8] } : { height: 4 }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className={`w-1.5 rounded-full ${isSpeaking ? 'bg-[#00c896]' : isListening ? 'bg-zinc-600' : 'bg-zinc-800'}`}
                   />
                 ))}
              </div>
           </div>

           {/* Controls */}
           <div className="flex items-center gap-6 relative z-10">
              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                 <Volume2 size={24} />
              </button>
              
              <button 
                onClick={() => setIsListening(!isListening)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                  ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' 
                  : 'bg-[#00c896] text-white shadow-xl shadow-[#00c896]/20'
                }`}
              >
                 {isListening ? <MicOff size={32} /> : <Mic size={32} />}
              </button>

              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                 <RotateCcw size={24} />
              </button>
           </div>
        </div>

        {/* transcript & Insights */}
        <div className="space-y-6">
           <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                    <Activity size={16} className="text-[#00c896]" />
                    Live Transcript
                 </h3>
                 <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">REAL-TIME</div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-medium" ref={scrollRef}>
                 {transcript.length === 0 ? (
                   <div className="h-full flex items-center justify-center text-xs text-zinc-400 text-center italic">
                      Start the microphone to begin transcripting the AI discussion.
                   </div>
                 ) : (
                   transcript.map((line, i) => (
                     <div key={i} className={`p-3 rounded-2xl text-xs leading-relaxed ${line.startsWith('AI') ? 'bg-[#00c896]/5 text-[#00c896] border border-[#00c896]/10' : 'bg-zinc-50 text-zinc-600'}`}>
                        {line}
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-6">
              <div>
                 <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">ACTIVE VOICE PROFILE</h4>
                 <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-[10px] font-black italic">H</div>
                       <span className="text-xs font-bold text-zinc-900">{activeVoice}</span>
                    </div>
                    <button className="text-[10px] font-black text-[#00c896] uppercase tracking-widest">Change</button>
                 </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 text-white">
                 <div className="flex items-center gap-3 mb-2">
                    <Cpu size={16} className="text-[#00c896]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00c896]">Node Intelligence</span>
                 </div>
                 <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
                    Node ID: CONVO-88-XA
                    Type: Harvest-Domain-Specific
                    Weights: 0.94 Alpha-Quantized
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
