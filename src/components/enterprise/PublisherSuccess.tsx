import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Flag, 
  Rocket, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  BarChart3,
  Award,
  Globe,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export default function PublisherSuccess() {
  const roadmap = [
    { id: 1, title: 'Identity Extraction', desc: 'Auto-detected vertical and brand kit colors.', status: 'complete' },
    { id: 2, title: 'AI Agent Training', desc: 'RAG pipeline indexed 342 technical nodes.', status: 'complete' },
    { id: 3, title: 'Mobile Binary Packaged', desc: 'Android APK and PWA manifest ready.', status: 'complete' },
    { id: 4, title: 'Revenue Engine Hook', desc: 'Stripe Connect and ad-network verification.', status: 'pending' },
    { id: 5, title: 'Public OS Domain', desc: 'SSL propagation on mag.yourdomain.com.', status: 'pending' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">Publisher Success Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Operational health, deployment roadmap, and optimization goals.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ECOSYSTEM HEALTH</div>
              <div className="text-sm font-black text-[#00c896]">92% OPTIMIZED</div>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-[#00c896]/10 flex items-center justify-center text-[#00c896]">
              <TrendingUp size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Success Roadmap */}
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <Flag className="text-[#00c896]" size={20} />
                 <h3 className="font-black text-zinc-900">Launch Roadmap</h3>
              </div>

              <div className="space-y-6">
                 {roadmap.map((item, i) => (
                   <div key={item.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            item.status === 'complete' 
                            ? 'bg-[#00c896] border-[#00c896] text-white' 
                            : 'bg-white border-zinc-200 text-zinc-300'
                         }`}>
                            {item.status === 'complete' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                         </div>
                         {i < roadmap.length - 1 && (
                           <div className={`w-0.5 flex-1 my-1 transition-all ${
                              item.status === 'complete' ? 'bg-[#00c896]' : 'bg-zinc-100'
                           }`} />
                         )}
                      </div>
                      <div className="pb-6">
                         <h4 className={`font-bold transition-all ${
                            item.status === 'complete' ? 'text-zinc-900' : 'text-zinc-400'
                         }`}>{item.title}</h4>
                         <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all">
                 <div className="flex items-center gap-3 mb-4">
                    <Target className="text-purple-500" size={20} />
                    <h4 className="font-bold text-zinc-900">Current AI Goal</h4>
                 </div>
                 <p className="text-sm text-zinc-500 mb-6 font-medium">Reduce halluncination rate on 'Harvest Forecasting' queries to under 0.5%.</p>
                 <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-purple-500" />
                 </div>
                 <div className="flex justify-between mt-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>PROGRESS</span>
                    <span>80%</span>
                 </div>
              </div>

              <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all">
                 <div className="flex items-center gap-3 mb-4">
                    <Award className="text-amber-500" size={20} />
                    <h4 className="font-bold text-zinc-900">Publisher Tier</h4>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-3xl font-black text-zinc-900 tracking-tighter">GOLD</div>
                    <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest">Top 5%</div>
                 </div>
                 <p className="text-[10px] text-zinc-400 mt-4">Next Tier: DIAMOND (+1,000 MAU required)</p>
              </div>
           </div>
        </div>

        {/* Advisor Column */}
        <div className="space-y-6">
           <div className="p-8 rounded-[32px] border border-[#00c896]/20 bg-[#00c896]/5 text-zinc-900 space-y-6 relative overflow-hidden">
              <Sparkles size={40} className="absolute -right-4 -top-4 text-[#00c896]/10 rotate-12" />
              <div className="flex items-center gap-3">
                 <Rocket className="text-[#00c896]" size={20} />
                 <h3 className="font-black">Success Advisor</h3>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                 "I've analyzed your lead generation patterns. Your 'Equipment Reviews' section is currently converting 4x higher than 'Global Policy'. I recommend training a specialized <b>Sales Concierge Agent</b> for that specific section."
              </p>
              <button className="w-full py-3 rounded-2xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all">
                 Accept Recommendation
              </button>
           </div>

           <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-4">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">QUICK INSIGHTS</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Avg Session', val: '12m 42s', icon: Zap },
                   { label: 'AI Resolution', val: '94%', icon: MessageSquare },
                   { label: 'Market Reach', val: '12 Countries', icon: Globe },
                   { label: 'Pub. Health', val: 'Excellent', icon: BarChart3 },
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <stat.icon size={16} className="text-zinc-400" />
                         <span className="text-xs font-bold text-zinc-600">{stat.label}</span>
                      </div>
                      <span className="text-xs font-black text-zinc-900">{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
