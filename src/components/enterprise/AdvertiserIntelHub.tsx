import React from 'react';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  MessageSquare, 
  PieChart, 
  ArrowUpRight,
  TrendingDown,
  DollarSign,
  Activity,
  Award,
  MousePointer2,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LineChart, Line } from 'recharts';

const adPerformanceData = [
  { segment: 'Tech Trends', impressions: 4500, engagement: 850, ctr: 18.8 },
  { segment: 'Crop Science', impressions: 3200, engagement: 640, ctr: 20.0 },
  { segment: 'Mining Safety', impressions: 5800, engagement: 1200, ctr: 20.6 },
  { segment: 'Green Energy', impressions: 2100, engagement: 310, ctr: 14.7 },
  { segment: 'Logistics', impressions: 3900, engagement: 740, ctr: 18.9 },
];

export default function AdvertiserIntelHub() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight italic flex items-center gap-3">
             <Target className="text-blue-500" size={32} />
             Advertiser Intelligence Hub
          </h1>
          <p className="text-zinc-500 text-sm mt-1">ROI transparency, lead attribution, and conversational ad placement analytics.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-black text-sm hover:bg-zinc-800 transition-all flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              Invite Partner
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Conversational Ad Rev', val: '$42,500', change: '+24%', icon: DollarSign, color: 'blue' },
           { label: 'Sponsor Leads', val: '842', change: '+12%', icon: Users, color: 'emerald' },
           { label: 'Avg AI Intent Score', val: '88/100', change: '+5%', icon: Target, color: 'purple' },
           { label: 'Content ROI Index', val: '4.2x', change: '+8%', icon: TrendingUp, color: 'amber' },
         ].map((stat, i) => (
           <div key={i} className="p-6 rounded-[32px] border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                 <stat.icon size={22} />
              </div>
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="flex items-baseline gap-2">
                 <div className="text-2xl font-black text-zinc-900">{stat.val}</div>
                 <div className="text-[10px] font-black text-emerald-500">{stat.change}</div>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ad Performance Chart */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-zinc-900 flex items-center gap-2">
                 <BarChart3 size={18} className="text-blue-500" />
                 Engagement by Content Segment
              </h3>
              <div className="flex gap-4">
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">• Conversational CTR</span>
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">• Total Impressions</span>
              </div>
           </div>
           
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={adPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="segment" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}}/>
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="engagement" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                       {adPerformanceData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#93c5fd'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Sponsor Health */}
        <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-900 text-white flex flex-col">
           <h3 className="font-black mb-6 flex items-center gap-2">
              <Activity size={18} className="text-blue-400" />
              Sponsor Retention Score
           </h3>
           
           <div className="flex-1 space-y-6">
              {[
                { name: 'John Deere SA', health: 98, status: 'Active' },
                { name: 'Standard Bank', health: 92, status: 'Active' },
                { name: 'Anglo American', health: 45, status: 'At Risk' },
                { name: 'Vodacom Global', health: 88, status: 'Active' },
              ].map((partner, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">{partner.name}</span>
                      <span className={partner.health < 50 ? 'text-red-400' : 'text-blue-400'}>{partner.health}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${partner.health < 50 ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{ width: `${partner.health}%` }} 
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-8 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                 <Zap size={14} className="text-blue-400" />
                 <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Growth Recommendation</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                 "Anglo American engagement is dropping in the 'ESG' section. Generate a specialized Sustainability Agent to boost partner value."
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Live Attribution */}
         <div className="p-8 rounded-[40px] border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <h3 className="font-black text-zinc-900 mb-6 flex items-center gap-2">
               <MousePointer2 size={18} className="text-emerald-500" />
               Lead Attribution Trace
            </h3>
            <div className="space-y-4">
               {[
                 { user: 'Sarah M.', intent: 'Technical Drill inquiry', partner: 'Atlas Copco', value: '$4,200', time: '10m ago' },
                 { user: 'Robert G.', intent: 'Seed selection guidance', partner: 'Pioneer SA', value: '$120', time: '1h ago' },
                 { user: 'Lindani Z.', intent: 'Asset financing options', partner: 'Absa Bank', value: '$14,000', time: '3h ago' },
               ].map((trace, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold italic">L</div>
                       <div>
                          <div className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">PARTNER: {trace.partner}</div>
                          <div className="text-sm font-bold text-zinc-900">{trace.intent}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-blue-500">{trace.value}</div>
                       <div className="text-[10px] text-zinc-400">{trace.time}</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* AI Placement Engine */}
         <div className="p-8 rounded-[40px] border border-zinc-900 bg-[#0A0A0A] text-white overflow-hidden relative">
            <Cpu size={120} className="absolute -right-12 -top-12 text-blue-500/10 rotate-12" />
            <h3 className="font-black text-white mb-6 flex items-center gap-2">
               <Zap size={18} className="text-blue-500" />
               AI Ad-Placement Logic
            </h3>
            <div className="space-y-6 relative z-10">
               <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-zinc-400 font-mono">Current Policy:</span>
                     <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase">Contextual Plus</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                     Agents will only inject product recommendations when conversational sentiment exceeds 0.85 and topic relevance is verified against document nodes.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                     <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">NODE OVERLAP</div>
                     <div className="text-xl font-black text-[#00c896]">92%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                     <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">PLMT DENSITY</div>
                     <div className="text-xl font-black text-blue-500">1.2 / session</div>
                  </div>
               </div>
               <button className="w-full py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all">
                  Optimize Placement Strategy
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
