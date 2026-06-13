import React from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  MessageSquare, 
  Search, 
  Compass, 
  ArrowRight,
  Zap,
  Layout,
  PenTool,
  BarChart3,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

const recommendations = [
  { 
    id: 1, 
    type: 'Content Strategy', 
    title: 'The "Soil Health" Gap', 
    desc: 'Semantic analysis shows 42% of readers in the Agri-Vertical are asking about organic soil amendments, but your recent publications only mention it in 2 paragraphs. You should commission a deep-dive technical report.',
    sentiment: 'High Interest',
    impact: 'High'
  },
  { 
    id: 2, 
    type: 'Sales Trigger', 
    title: 'Drilling Equipment Fatigue', 
    desc: 'Mining engineers are talking to the AI about wear-and-tear on specific 2024 drill models. This is a primary opening for your advertiser "Resilient Drills" to run a targeted lead-gen campaign.',
    sentiment: 'Buying Intent',
    impact: 'High'
  },
  { 
    id: 3, 
    type: 'Optimization', 
    title: 'Voice Persona Adjustment', 
    desc: 'Readers find the "Helena" voice too formal for the Lifestyle section. We recommend switching to the "Marco" persona for a 12% boost in session retention.',
    sentiment: 'Brand Voice',
    impact: 'Medium'
  },
];

export default function AIRecommendationEngine() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight italic flex items-center gap-3">
             <Sparkles className="text-purple-500" size={32} />
             Audience Intelligence Engine
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Deep semantic signals extracted from real-world conversational data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-8 rounded-[40px] border border-zinc-200 bg-white shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                         {rec.type}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-[#00c896]/10 text-[#00c896] text-[10px] font-black uppercase tracking-widest border border-[#00c896]/20">
                         {rec.sentiment}
                      </div>
                   </div>

                   <h3 className="text-xl font-black text-zinc-900 mb-4 tracking-tight">{rec.title}</h3>
                   <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                      {rec.desc}
                   </p>

                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">IMPACT: {rec.impact}</span>
                      </div>
                      <button className="flex items-center gap-2 text-sm font-bold text-zinc-900 group-hover:text-purple-600 transition-colors">
                         Action Intel
                         <ArrowRight size={16} />
                      </button>
                   </div>
                </div>
              ))}
           </div>

           <div className="p-8 rounded-3xl border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                 <Compass size={24} />
              </div>
              <div>
                 <h4 className="font-bold text-zinc-900">New Topic Detected</h4>
                 <p className="text-xs text-zinc-500 mt-1">Calculating semantic clusters for "Regenerative Energy" in your niche...</p>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 rounded-[32px] border border-zinc-900 bg-zinc-900 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-zinc-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="flex items-center gap-3">
                 <Target className="text-purple-400" size={20} />
                 <h4 className="font-black">Optimization Path</h4>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                       <span>SEMANTIC RECALL</span>
                       <span>94%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="w-[94%] h-full bg-purple-400" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                       <span>EDITORIAL ALIGNMENT</span>
                       <span>78%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="w-[78%] h-full bg-[#00c896]" />
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Lightbulb size={20} className="text-amber-400" />
                    <span className="text-xs font-bold text-zinc-300">AI PROMPT: "Synthesize Maize Gap"</span>
                 </div>
                 <button className="w-full py-3 rounded-2xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-all">
                    Generate Brief
                 </button>
              </div>
           </div>

           <div className="p-6 rounded-3xl border border-zinc-200 bg-white space-y-4">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">QUERY VELOCITY</h4>
              <div className="space-y-3">
                 {['Regulatory Hurdles', 'Mining ROI', 'AI Safety', 'Climate Policy'].map((tag, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-700">{tag}</span>
                      <div className="flex items-center gap-1.5">
                         <TrendingUp size={12} className="text-[#00c896]" />
                         <span className="text-[10px] font-black text-zinc-900">{24 + i*8}%</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
