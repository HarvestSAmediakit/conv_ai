import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Settings, 
  CheckCircle2, 
  Zap, 
  Monitor, 
  AppWindow,
  Cpu,
  RefreshCw,
  Loader2,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function MobileAppGenerator() {
  const [generating, setGenerating] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGenerating(false);
    setComplete(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">Mobile App Generator</h1>
          <p className="text-zinc-500 text-sm mt-1">Convert your publication ecosystem into installable PWA and native app packages.</p>
        </div>
        {!complete ? (
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-zinc-200"
          >
            {generating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="text-[#00c896]" />}
            {generating ? 'Generating Binary...' : 'Generate App Package'}
          </button>
        ) : (
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00c896] text-white font-bold text-sm hover:scale-[1.02] transition-all shadow-lg shadow-[#00c896]/20">
                <Download size={18} />
                Download APK/IPA
             </button>
             <button onClick={() => setComplete(false)} className="px-6 py-3 rounded-xl border border-zinc-200 font-bold text-sm text-zinc-500 hover:bg-zinc-50 transition-all">
                Reset
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
           <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <Settings className="text-[#00c896]" size={20} />
                 <h3 className="font-black text-zinc-900">App Build Settings</h3>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1.5">App Display Name</label>
                    <input type="text" defaultValue="Harvest SA AI" className="w-full px-4 py-3 rounded-xl border border-zinc-100 text-sm font-medium" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1.5">Version</label>
                        <input type="text" defaultValue="1.0.4" className="w-full px-4 py-3 rounded-xl border border-zinc-100 text-sm font-medium" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1.5">Build Target</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-zinc-100 text-sm font-medium bg-white">
                           <option>PWA + Android (Play)</option>
                           <option>iOS (App Store)</option>
                           <option>Enterprise Sideload</option>
                        </select>
                    </div>
                 </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Cpu size={18} className="text-zinc-400" />
                       <span className="text-sm font-bold text-zinc-700">Offline RAG Engine</span>
                    </div>
                    <div className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Included</div>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <RefreshCw size={18} className="text-zinc-400" />
                       <span className="text-sm font-bold text-zinc-700">Auto-Update (Push)</span>
                    </div>
                    <div className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Included</div>
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-3xl border border-zinc-200 bg-[#0A0A0A] text-white space-y-4">
              <div className="text-[10px] font-black uppercase text-[#00c896] tracking-widest">BUILD LOGS</div>
              <div className="font-mono text-[10px] space-y-1 text-zinc-500">
                 <div className="text-[#00c896]">&gt; ConvoMag OS Build v4.2.0 initialized</div>
                 <div>&gt; Extracting asset pipeline for "Harvest SA"</div>
                 <div>&gt; Compiling PWA manifest... DONE</div>
                 <div>&gt; Injecting local vector store (SQLite-Wasm)... DONE</div>
                 <div>&gt; Validating signing credentials... DONE</div>
                 {generating && <div className="text-white animate-pulse">&gt; Packaging app package... [RUNNING]</div>}
                 {complete && <div className="text-[#00c896]">&gt; SUCCESS: Bundle ready for deployment</div>}
              </div>
           </div>
        </div>

        {/* Device Preview */}
        <div className="flex items-center justify-center bg-zinc-50 rounded-3xl border border-zinc-200 p-10 min-h-[600px]">
           <div className="relative w-[300px] h-[600px] bg-zinc-900 rounded-[50px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden shadow-[#00c896]/10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-zinc-800 rounded-b-3xl z-20" />
              
              <div className="absolute inset-0 bg-[#050505] flex flex-col p-6 pt-12 space-y-6">
                 {/* Mock UI */}
                 <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#00c896] flex items-center justify-center font-black italic text-white text-xs">H</div>
                    <Share2 size={16} className="text-zinc-500" />
                 </div>
                 
                 <div className="space-y-4">
                    <div className="h-40 rounded-3xl bg-zinc-800/50 border border-white/5 flex items-center justify-center">
                       <Monitor size={32} className="text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                       <div className="h-4 w-3/4 bg-zinc-800 rounded-full" />
                       <div className="h-4 w-1/2 bg-zinc-800 rounded-full opacity-50" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="h-24 rounded-2xl bg-zinc-900 border border-white/5 p-3 flex flex-col justify-end">
                       <div className="text-[8px] font-black text-[#00c896] mb-1">AI CHAT</div>
                       <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
                    </div>
                    <div className="h-24 rounded-2xl bg-zinc-900 border border-white/5 p-3 flex flex-col justify-end">
                       <div className="text-[8px] font-black text-[#00c896] mb-1">PODCAST</div>
                       <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
                    </div>
                 </div>

                 <div className="mt-auto pb-4">
                    <div className="w-full h-12 rounded-2xl bg-[#00c896] flex items-center justify-center font-bold text-sm text-white">
                       Start Reading
                    </div>
                 </div>
              </div>

              {/* Status Bar Mock */}
              <div className="absolute top-2 left-8 right-8 flex justify-between items-center text-[10px] font-bold text-white/40 z-30">
                 <span>9:41</span>
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full border border-white/20" />
                    <div className="w-4 h-2.5 rounded bg-white/40" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
