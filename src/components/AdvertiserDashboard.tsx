import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, MessageSquare, Target, ArrowUpRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/advertiser/analytics')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch advertiser data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Aggregating Global Campaign Metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || [];
  const campaignsList = data?.campaigns || [];
  const conversationLog = data?.conversationLog || [];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1F1] font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="p-2 bg-[#0A0A0A] border border-white/5 hover:border-white/10 rounded-full transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                Advertiser Intelligence
              </h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">ConvoMag Monetization Hub</p>
            </div>
          </div>
          <button className="bg-white/5 text-white border border-white/10 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
            Export Report
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat: any, i: number) => {
            const Icon = i === 0 ? Target : i === 1 ? MessageSquare : i === 2 ? TrendingUp : Users;
            return (
              <div key={i} className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <Icon size={20} className="text-emerald-500" />
                  </div>
                  <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} className="mr-1" /> {stat.change}%
                  </span>
                </div>
                <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold tracking-tight text-[#F1F1F1]">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Active Campaigns Grid */}
        <h2 className="text-xl font-bold tracking-tight text-white mb-6">Active Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {campaignsList.map((campaign, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A] z-10 pointer-events-none" />
              <img src={campaign.img} alt={campaign.name} className="w-full h-48 object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  Page {campaign.page}
                </span>
              </div>
              <div className="relative z-20 p-6 -mt-8">
                <span className="inline-block bg-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border border-indigo-500/20">
                  {campaign.type}
                </span>
                <h3 className="font-bold text-lg text-white mb-4 leading-tight">{campaign.name}</h3>
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div>
                    <p className="text-emerald-400 text-lg font-bold">{campaign.conversion}</p>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Conversion</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-bold">{campaign.mentions.toLocaleString()}</p>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">AI Mentions</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advertiser Intelligence Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 border border-indigo-500/20 bg-indigo-500/5 rounded-3xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
             <h2 className="text-xl font-bold tracking-tight text-white mb-4 relative z-10">How AI Promotes Advertisers</h2>
             <p className="text-sm text-zinc-400 leading-relaxed mb-6 relative z-10">
               ConvoMag's Agricultural Intelligence Layer actively matches user inquiries with sponsor inventory. When readers ask farming or commodity questions, the system contextually weaves Advertiser value propositions naturally into the conversational stream.
             </p>

             <div className="bg-[#050505] border border-white/10 rounded-2xl p-5 relative z-10 font-mono text-xs">
               <div className="flex items-center gap-2 mb-3 text-zinc-500 pb-3 border-b border-white/5">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span>FUNNEL_TRACE_ACTIVE</span>
               </div>
               <div className="space-y-4">
                 <div>
                   <p className="text-indigo-400 font-bold mb-1">1. User Ask:</p>
                   <p className="text-zinc-300">"What fertilizer is best for drought-stressed maize?"</p>
                 </div>
                 <div>
                   <p className="text-emerald-400 font-bold mb-1">2. Semantic Match:</p>
                   <p className="text-zinc-300">Retrieving Campaign: Kynoch Fertilizer (Page 14)</p>
                 </div>
                 <div>
                   <p className="text-amber-400 font-bold mb-1">3. Organic Synthesis:</p>
                   <p className="text-zinc-300">Response generated linking drought resistance to Kynoch's foliar product.</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold tracking-tight text-white mb-6">AI Conversation Log</h2>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500">
                    <tr>
                      <th className="px-6 py-4 font-bold">Reader Query</th>
                      <th className="px-6 py-4 font-bold">AI Synthesis Snippet</th>
                      <th className="px-6 py-4 font-bold">Sponsor Match</th>
                      <th className="px-6 py-4 font-bold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {conversationLog.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-zinc-200 w-1/4">"{row.q}"</td>
                        <td className="px-6 py-4 font-serif text-xs italic opacity-80 w-1/3 leading-relaxed">{row.ans}</td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 whitespace-nowrap">
                            {row.match}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-zinc-600 font-mono">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 transition-colors text-white text-xs font-bold uppercase tracking-widest rounded-full">
                  Load More Logs
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
