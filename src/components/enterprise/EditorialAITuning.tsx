import React, { useState } from 'react';
import { 
  PenTool, 
  Settings, 
  ShieldCheck, 
  Target, 
  Zap, 
  BookOpen, 
  Save, 
  RefreshCw, 
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
  BrainCircuit,
  Maximize2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function EditorialAITuning() {
  const [tuningStatus, setTuningStatus] = useState<'idle' | 'tuning' | 'ready'>('idle');
  const [safetyFilter, setSafetyFilter] = useState(85);

  const handleTune = async () => {
    setTuningStatus('tuning');
    await new Promise(resolve => setTimeout(resolve, 3000));
    setTuningStatus('ready');
    setTimeout(() => setTuningStatus('idle'), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">Editorial AI Tuning</h1>
          <p className="text-zinc-500 text-sm mt-1">Refine your AI expert personality, factual ground truth, and conversational boundaries.</p>
        </div>
        <button 
          onClick={handleTune}
          disabled={tuningStatus === 'tuning'}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#00c896] text-white font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-[#00c896]/20"
        >
          {tuningStatus === 'tuning' ? <RefreshCw className="animate-spin" size={18} /> : tuningStatus === 'ready' ? <CheckCircle2 size={18} /> : <Zap size={18} />}
          {tuningStatus === 'tuning' ? 'Re-tuning Nodes...' : tuningStatus === 'ready' ? 'Knowledge Propagated' : 'Apply Intelligence Tuning'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Tuning Controls */}
        <div className="lg:col-span-2 space-y-6">
           {/* Personality Engine */}
           <div className="p-8 rounded-[40px] border border-zinc-200 bg-white shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                 <BrainCircuit className="text-[#00c896]" size={24} />
                 <h3 className="text-xl font-black text-zinc-900">Conversational Personality</h3>
              </div>

              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Factual Rigor vs. Creativity</label>
                       <span className="text-[#00c896] font-black text-xs">ACADEMIC PRECISION</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-100 rounded-full relative overflow-hidden group">
                       <div className="absolute left-0 top-0 bottom-0 w-[85%] bg-[#00c896] transition-all" />
                       <div className="absolute left-[85%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#00c896] shadow-md z-10 cursor-pointer" />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-400">
                       <span>Creative Flair</span>
                       <span>Data Bound</span>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Safety & Compliance Filter</label>
                       <span className="text-amber-500 font-black text-xs">{safetyFilter}% STRICT</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={safetyFilter}
                      onChange={(e) => setSafetyFilter(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-3">
                    <div className="flex items-center gap-2">
                       <Target size={16} className="text-[#00c896]" />
                       <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Primary Tone</span>
                    </div>
                    <select className="w-full bg-transparent border-b border-zinc-200 py-2 outline-none text-sm font-bold text-zinc-600">
                       <option>Professional Technical Lead</option>
                       <option>Senior Investigative Journalist</option>
                       <option>Strategic Business Advisor</option>
                       <option>Friendly Concierge</option>
                    </select>
                 </div>
                 <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-3">
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={16} className="text-blue-500" />
                       <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Citation Depth</span>
                    </div>
                    <select className="w-full bg-transparent border-b border-zinc-200 py-2 outline-none text-sm font-bold text-zinc-600">
                       <option>Page Level (Default)</option>
                       <option>Section Only</option>
                       <option>Deep Node Metadata</option>
                       <option>Direct Quotes Only</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Knowledge Grounding */}
           <div className="p-8 rounded-[40px] border border-zinc-200 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <BookOpen className="text-blue-500" size={24} />
                    <h3 className="text-xl font-black text-zinc-900">Knowledge Grounding</h3>
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-100 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:bg-zinc-50 transition-all">
                    <FileText size={14} />
                    Add Ground Truth
                 </button>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed font-sans">
                 Upload "Factual Sovereignty" documents. When readers ask questions, the AI will prioritize these documents over its general training data or the PDF itself.
              </p>
              
              <div className="space-y-3">
                 {[
                   { name: '2026 Mining Safety Guidelines (Internal)', date: 'Final v2', nodes: 42 },
                   { name: 'Corporate Taxonomy & Glossary', date: 'v4.0', nodes: 128 },
                 ].map((doc, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500">
                            <Maximize2 size={18} />
                         </div>
                         <div>
                            <div className="text-sm font-black text-zinc-900">{doc.name}</div>
                            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{doc.date} • {doc.nodes} Nodes Indexed</div>
                         </div>
                      </div>
                      <button className="text-[10px] font-black text-red-400 uppercase tracking-widest">Unbind</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
           <div className="p-8 rounded-[32px] bg-[#0A0A0A] text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00c896]/10 rounded-full blur-[40px] pointer-events-none" />
              <div className="flex items-center gap-3">
                 <History className="text-[#00c896]" size={20} />
                 <h4 className="font-black">Revision History</h4>
              </div>
              <div className="space-y-4 font-mono text-[10px] text-zinc-500">
                 <div className="flex justify-between">
                    <span className="text-[#00c896]">LATEST</span>
                    <span>10 JUN / 14:02</span>
                 </div>
                 <p className="text-zinc-300 italic border-l-2 border-[#00c896]/30 pl-3">
                    Adjusted agricultural node weights to reduce drought variance.
                 </p>
                 <div className="flex justify-between opacity-50">
                    <span>STABLE</span>
                    <span>08 JUN / 09:41</span>
                 </div>
                 <p className="text-zinc-600 pl-3">
                    Implemented SAML Identity Mapping overrides.
                 </p>
              </div>
              <button className="w-full py-3 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                 Compare Iterations
              </button>
           </div>

           <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <AlertTriangle size={20} className="text-amber-500" />
                 <h4 className="font-black text-zinc-900">Hallucination Report</h4>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-2xl">
                 <div className="text-3xl font-black text-zinc-900">0.02%</div>
                 <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">DRIFT RATIO</div>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed text-center font-medium">
                 Extremely low drift detected. Your editorial ground truth is providing elite factual grounding.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
