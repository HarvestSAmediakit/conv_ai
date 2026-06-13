import React from 'react';
import { 
  Globe, 
  Share2, 
  TrendingUp, 
  Users, 
  Zap, 
  MessageSquare, 
  Layers, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Network,
  Rocket
} from 'lucide-react';
import { motion } from 'motion/react';

const activeExchanges = [
  { id: 1, title: 'Agri-Tech Network', partners: 12, readers: '45k+', reach: 'Global', trending: true },
  { id: 2, title: 'Legal Research Lab', partners: 5, readers: '12k+', reach: 'Regional', trending: false },
  { id: 3, title: 'Mining Intelligence', partners: 8, readers: '28k+', reach: 'Africa/AU', trending: true },
];

export default function PublisherExchange() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight italic flex items-center gap-3">
             <Network className="text-[#00c896]" size={32} />
             The Publisher Exchange
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Cross-pollinate content nodes, syndicate archives, and join collaborative intelligence networks.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all">
           <Rocket size={18} className="text-[#00c896]" />
           Create New Exchange
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {activeExchanges.map((ex) => (
                 <div key={ex.id} className="p-8 rounded-[40px] border border-zinc-200 bg-white shadow-sm hover:shadow-xl transition-all relative group">
                    {ex.trending && (
                      <div className="absolute top-6 right-6">
                         <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 text-[8px] font-black uppercase tracking-widest">
                            <TrendingUp size={10} />
                            Trending
                         </div>
                      </div>
                    )}
                    <h3 className="text-xl font-black tracking-tight text-zinc-900 mb-6">{ex.title}</h3>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500 font-medium">Verified Partners</span>
                          <span className="font-bold text-zinc-900">{ex.partners}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500 font-medium">Combined MAU</span>
                          <span className="font-bold text-zinc-900">{ex.readers}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500 font-medium">Market Reach</span>
                          <span className="font-bold text-zinc-900">{ex.reach}</span>
                       </div>
                    </div>

                    <button className="w-full py-3 rounded-2xl bg-zinc-50 text-zinc-600 font-bold text-sm hover:bg-[#00c896] hover:text-white transition-all flex items-center justify-center gap-2">
                       Request Access
                       <ArrowRight size={16} />
                    </button>
                 </div>
               ))}
            </div>

            <div className="p-8 rounded-[48px] border border-[#00c896]/20 bg-[#00c896]/5 flex flex-col items-center justify-center text-center space-y-6 py-16">
               <Share2 size={48} className="text-[#00c896]" />
               <div className="max-w-xl space-y-2">
                  <h3 className="text-2xl font-black text-zinc-900">Syndication Dashboard</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                     Select specific content nodes or full archives to syndicate in the ConvoMag Network. Choose between <b>Exclusive Licensing</b> (Revenue Share) or <b>Open Access</b> (Traffic Driver).
                  </p>
               </div>
               <button className="px-10 py-3 rounded-2xl bg-zinc-900 text-white font-black text-sm hover:scale-[1.02] shadow-lg shadow-zinc-200 transition-all">
                  Configure Syndication Rules
               </button>
            </div>
         </div>

         <div className="space-y-6">
            <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-6">
               <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">NETWORK PULSE</h4>
               <div className="space-y-6">
                  {[
                    { label: 'Active Exchanges', val: '24' },
                    { label: 'Total Sync Nodes', val: '142.5k' },
                    { label: 'Licensed Volume', val: '$1.2M' },
                    { label: 'Global Latency', val: '18ms' },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                       <span className="text-xs font-bold text-zinc-900">{stat.val}</span>
                       <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <Sparkles size={20} className="text-[#00c896]" />
                  <h4 className="font-black text-zinc-900">Exchange Invitations</h4>
               </div>
               <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col gap-3">
                  <div className="text-xs font-bold text-zinc-900">TechDaily Network</div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">"Wants to syndicate your 'Harvest Reports' for their African Enterprise portal."</p>
                  <div className="flex gap-2">
                     <button className="flex-1 py-2 rounded-lg bg-[#00c896] text-white text-[10px] font-black uppercase tracking-widest shadow-sm">Review Offer</button>
                     <button className="px-3 py-2 rounded-lg bg-white border border-zinc-100 text-zinc-400">×</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
