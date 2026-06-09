import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, MessageSquare, Target, ArrowUpRight, ArrowLeft } from 'lucide-react';

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const [adExtractions, setAdExtractions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/docupipe/extractions')
      .then(res => res.json())
      .then((data: any[]) => {
         const ads = data.filter((d) => d.schemaId === 'schema_ads_02' && d.status === 'completed' && d.resultJson);
         setAdExtractions(ads);
      })
      .catch(err => console.error("Failed to load extractions", err));
  }, []);

  // Helper to extract campaigns
  const getCampaigns = () => {
    let campaigns: any[] = [];
    adExtractions.forEach(ex => {
       const json = ex.resultJson;
       if (json && json["Active Brand Sponsors"]) {
         Object.entries(json["Active Brand Sponsors"]).forEach(([brand, desc]) => {
           campaigns.push({
             name: brand,
             type: "Detected Sponsor",
             page: "Document " + ex.id.substring(0,4),
             desc: String(desc),
             conversion: (Math.random() * 5 + 1).toFixed(1) + "%",
             img: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=400"
           });
         });
       }
       if (json && json["In-App Promotions"]) {
         Object.entries(json["In-App Promotions"]).forEach(([code, desc]) => {
           campaigns.push({
             name: "Promo: " + code,
             type: "Coupon Code",
             page: "Document " + ex.id.substring(0,4),
             desc: String(desc),
             conversion: (Math.random() * 5 + 1).toFixed(1) + "%",
             img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400"
           });
         });
       }
    });

    if (campaigns.length === 0) {
      return [
        { name: "Rolex Submariner Cover Ad", type: "Full Page", page: '4', conversion: "4.2%", img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400" },
        { name: "Volvo XC90 Spread", type: "Two-Page Spread", page: '12', conversion: "3.8%", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400" },
        { name: "Sony Headphones Promo", type: "Half Page", page: '28', conversion: "6.1%", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400" },
      ];
    }
    return campaigns;
  };

  const campaignsList = getCampaigns();

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-[#00c896]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="p-2 bg-[#0A0A0A] border border-white/10 rounded-full hover:bg-[#1A1A1A]/5 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-100">Advertiser Intelligence</h1>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mt-1">ConvoMag Monetization Hub</p>
            </div>
          </div>
          <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer">
            Export Report
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Ad Views', value: '1,247,592', change: '+12.5%', icon: Target },
            { label: 'Voice Q&A Engagements', value: '89,431', change: '+24.8%', icon: MessageSquare },
            { label: 'Avg. Engagement Time', value: '2m 14s', change: '+5.2%', icon: TrendingUp },
            { label: 'Unique Readers', value: '412,900', change: '+18.1%', icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10/60 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#00c896]/10 rounded-xl">
                  <stat.icon size={20} className="text-[#00c896]" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-900/30 px-2 py-1 rounded-md">
                  <ArrowUpRight size={12} className="mr-1" /> {stat.change}
                </span>
              </div>
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2">
             <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-3xl border border-white/10/60 shadow-sm h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black tracking-tight text-gray-100">Engagement Over Time</h2>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-600 outline-none cursor-pointer">
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>Year to Date</option>
                  </select>
                </div>
                <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 border-b border-white/5 pb-2">
                   {[...Array(30)].map((_, i) => {
                     const height1 = Math.random() * 60 + 20;
                     const height2 = Math.random() * 30 + 10;
                     return (
                        <div key={i} className="w-full flex flex-col justify-end gap-1 group relative cursor-crosshair">
                           <div style={{height: `${height2}%`}} className="w-full bg-indigo-200 rounded-t-sm group-hover:bg-indigo-300 transition-colors" />
                           <div style={{height: `${height1}%`}} className="w-full bg-[#00c896] rounded-t-sm group-hover:bg-emerald-500 transition-colors" />
                        </div>
                     )
                   })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                    <div className="w-3 h-3 rounded-full bg-[#00c896]" /> Ad Views
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                    <div className="w-3 h-3 rounded-full bg-indigo-200" /> Voice Queries
                  </div>
                </div>
             </div>
          </div>

          {/* Top Voice Queries */}
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-3xl border border-white/10/60 shadow-sm h-full">
              <h2 className="text-lg font-black tracking-tight text-gray-100 mb-6 flex items-center gap-2">
                <MessageSquare className="text-indigo-500" size={20} /> Top Voice Questions
              </h2>
              <div className="space-y-4">
                {[
                  { q: "Where can I buy this nearby?", count: 12453, trend: "up" },
                  { q: "What's the price of the pro model?", count: 8392, trend: "up" },
                  { q: "Is this compatible with iPhone?", count: 6210, trend: "down" },
                  { q: "Are there any discounts available?", count: 4192, trend: "up" },
                  { q: "How long does shipping take?", count: 2841, trend: "neutral" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between border-b border-white/5 last:border-0 pb-4 last:pb-0">
                     <p className="text-sm font-medium text-zinc-300 w-3/4 leading-snug">"{item.q}"</p>
                     <div className="text-right">
                        <p className="text-xs font-bold text-gray-100">{item.count.toLocaleString()}</p>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Queries</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Hotspots */}
        <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-3xl border border-white/10/60 shadow-sm">
           <h2 className="text-lg font-black tracking-tight text-gray-100 mb-6 flex items-center gap-2">
             <Target className="text-rose-500" size={20} /> Detected Campaign Hotspots
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaignsList.map((campaign, i) => (
                 <div key={i} className="border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-zinc-300 transition-colors">
                    <div className="h-32 bg-white/10 relative overflow-hidden">
                       <img src={campaign.img} alt={campaign.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                          Page {campaign.page}
                       </div>
                    </div>
                    <div className="p-4">
                       <h3 className="font-bold text-gray-100 text-sm mb-1">{campaign.name}</h3>
                       <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">{campaign.type}</span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-900/30 px-2 py-1 rounded">{campaign.conversion} CTR</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  )
}
