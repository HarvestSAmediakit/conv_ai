import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Mic, Share2, Search, ArrowRight, Loader2, CheckCircle2, Layout, Smartphone } from 'lucide-react';

interface GenerationStep {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'loading' | 'done';
}

export default function DigitalEcosystemGenerator({ magId }: { magId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: 'extract', name: 'Knowledge Extraction', icon: <Search size={18} />, status: 'pending' },
    { id: 'web', name: 'AI Website Rendering', icon: <Globe size={18} />, status: 'pending' },
    { id: 'voice', name: 'Podcast Synthesis', icon: <Mic size={18} />, status: 'pending' },
    { id: 'social', name: 'Social Media Feed Generation', icon: <Share2 size={18} />, status: 'pending' },
    { id: 'seo', name: 'Search Engine Optimization', icon: <Smartphone size={18} />, status: 'pending' },
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate steps sequentially
    for (let i = 0; i < steps.length; i++) {
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'loading' } : s));
        await new Promise(r => setTimeout(r, 1500)); // AI context window ingestion simulation
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s));
    }

    try {
      await fetch('/api/factory/generate-ecosystem', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('convomag_token')}`
        },
        body: JSON.stringify({ magazineId: magId })
      });
    } catch (e) {
      console.error("Factory call error:", e);
    }

    setIsGenerating(false);
    setCompleted(true);
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -z-10" />
      
      {!completed ? (
        <div className="max-w-xl">
          <div className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-white/10">
             <Sparkles size={32} />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">AI Publication Factory</h2>
          <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
            One click to transform your static PDF into a complete digital content ecosystem. Our AI will automatically render a responsive website, write a podcast script, and generate a multi-channel social media kit.
          </p>

          <div className="space-y-4 mb-12">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  step.status === 'done' ? 'bg-emerald-500/10 text-emerald-500' : 
                  step.status === 'loading' ? 'bg-white/5 text-white' : 'bg-zinc-900 text-zinc-700'
                }`}>
                  {step.status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 
                   step.status === 'done' ? <CheckCircle2 size={18} /> : step.icon}
                </div>
                <span className={`text-sm font-bold ${step.status === 'done' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {step.name}
                </span>
                {step.status === 'loading' && (
                  <motion.div 
                    initial={{ scaleX: 0 }} 
                    animate={{ scaleX: 1 }} 
                    className="h-[1px] bg-indigo-500 flex-1 origin-left" 
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="group relative bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-700 transition-all flex items-center gap-3 overflow-hidden"
          >
            {isGenerating ? (
              <>Ingesting... <Loader2 className="animate-spin" /></>
            ) : (
              <>Start Generation Factory <ArrowRight className="group-hover:translate-x-2 transition-transform" /></>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
           <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 text-emerald-500">
              <CheckCircle2 size={48} />
           </div>
           <h2 className="text-3xl font-black text-white mb-4">Ecosystem Ready!</h2>
           <p className="text-zinc-500 mb-10 max-w-md mx-auto">
             The factory has successfully deployed your Intelligent Publication. You can now access your AI Website, Podcast feed, and Social Media kit.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <button className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
                 <Globe className="mx-auto mb-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-white block">View Website</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
                 <Mic className="mx-auto mb-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-white block">Listen Podcast</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
                 <Share2 className="mx-auto mb-3 text-amber-500 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-bold text-white block">Get Social Kit</span>
              </button>
           </div>

           <button 
             onClick={() => setCompleted(false)}
             className="mt-12 text-zinc-500 hover:text-white text-xs font-bold underline"
           >
             Re-run Factory Optimization
           </button>
        </motion.div>
      )}
    </div>
  );
}
