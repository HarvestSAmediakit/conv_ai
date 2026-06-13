import React, { useState } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  MapPin, 
  Filter, 
  Globe, 
  MessageSquare, 
  TrendingUp,
  Sparkles,
  ArrowRight,
  User,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';

const publications = [
  { id: '1', title: 'Harvest SA', vertical: 'Agriculture', subscribers: '1.2k', rating: 4.9, image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400', logo: 'H' },
  { id: '2', title: 'Mining Weekly', vertical: 'Resources', subscribers: '4.5k', rating: 4.8, image: 'https://images.unsplash.com/photo-1579308119253-1563f9cdb8df?auto=format&fit=crop&q=80&w=400', logo: 'M' },
  { id: '3', title: 'Legal Review', vertical: 'Legal', subscribers: '8.1k', rating: 5.0, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400', logo: 'L' },
  { id: '4', title: 'FinTech Pulse', vertical: 'Finance', subscribers: '12k', rating: 4.7, image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=400', logo: 'F' },
];

export default function DiscoveryPortal() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#00c896]/20 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c896]/10 text-[#00c896] text-[10px] font-black uppercase tracking-widest border border-[#00c896]/20">
              <Sparkles size={12} />
              THE INTELLIGENT DIRECTORY
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">Explore the ConvoMag Ecosystem</h1>
           <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Find and talk to the world's most intelligent publications. Every document here is powered by Gemini AI and ready for your questions.
           </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#00c896]" size={20} />
              <input 
                type="text" 
                placeholder="Search by publication name, vertical, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-3xl bg-white border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-[#00c896]/10 transition-all text-sm font-medium shadow-sm"
              />
           </div>
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm">
              <Filter size={18} />
              All Verticals
           </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {publications.map((magazine) => (
             <motion.div 
              key={magazine.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
             >
                <div className="h-40 overflow-hidden relative">
                   <img src={magazine.image} alt={magazine.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <div className="text-[10px] font-black text-white uppercase tracking-widest bg-[#00c896] px-2 py-0.5 rounded">
                         {magazine.vertical}
                      </div>
                   </div>
                </div>
                <div className="p-6 space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-100 flex items-center justify-center text-white font-black text-xs italic">
                         {magazine.logo}
                      </div>
                      <div>
                         <h3 className="font-bold text-zinc-900 leading-tight">{magazine.title}</h3>
                         <div className="flex items-center gap-2 mt-0.5">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-black text-zinc-400">{magazine.rating} • {magazine.subscribers} Readers</span>
                         </div>
                      </div>
                   </div>

                   <p className="text-xs text-zinc-500 leading-relaxed">
                      Latest Edition: "The Future of Infrastructure" - Featuring AI Insights from top leads.
                   </p>

                   <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <MessageSquare size={14} className="text-[#00c896]" />
                         <span className="text-[10px] font-black uppercase text-[#00c896] tracking-widest">AI ACTIVE</span>
                      </div>
                      <ArrowRight size={16} className="text-zinc-300 group-hover:text-[#00c896] group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Categories / Trending */}
        <div className="flex flex-wrap justify-center gap-4 py-8">
           {[
             { label: '🔥 Trending', count: '12' },
             { label: '💎 Enterprise', count: '45' },
             { label: '🌍 Global News', count: '89' },
             { label: '📊 Research', count: '32' },
             { label: '🛠 Technical', count: '102' },
           ].map((cat, i) => (
             <button key={i} className="px-6 py-2 rounded-full border border-zinc-200 bg-white text-xs font-bold text-zinc-500 hover:border-[#00c896] hover:text-[#00c896] transition-all">
                {cat.label} <span className="text-[10px] text-zinc-300 ml-1 font-black">{cat.count}</span>
             </button>
           ))}
        </div>

        {/* Call to Action */}
        <div className="p-12 rounded-[48px] bg-zinc-900 text-white text-center space-y-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#00c896]/10 rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
           
           <h2 className="text-3xl font-black italic tracking-tight">Become an Intelligent Publisher</h2>
           <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
              Upload your publication and join the ecosystem. Transform your readers into active participants with our AI operating system.
           </p>
           <button className="px-10 py-4 rounded-[20px] bg-[#00c896] text-white font-black text-sm hover:scale-[1.02] shadow-xl shadow-[#00c896]/20 transition-all">
              Launch Your Magazine Now
           </button>
        </div>

      </div>
    </div>
  );
}
