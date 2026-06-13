import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Zap, 
  Download, 
  Star, 
  Filter, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  BrainCircuit,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';

const premiumAgents = [
  { id: 'ag-1', name: 'Legal Strategy Pro', desc: 'SAML-ready expert in regulatory compliance and contract node analysis.', price: '$49/mo', category: 'Legal', icon: Shield, color: 'text-blue-500' },
  { id: 'ag-2', name: 'Agri-Forecast Lead', desc: 'Trained on 10k+ harvest datasets with real-time commodity pricing hooks.', price: '$29/mo', category: 'Agriculture', icon: BrainCircuit, color: 'text-[#00c896]' },
  { id: 'ag-3', name: 'Med-Tech Clinical Guide', desc: 'Strict HIPAA-compliant medical research assistant for technical journals.', price: '$89/mo', category: 'Medical', icon: Cpu, color: 'text-purple-500' },
  { id: 'ag-4', name: 'Fin-Risk Analyzer', desc: 'Market sentiment modeling and ROI attribution for annual reports.', price: '$59/mo', category: 'Finance', icon: Layers, color: 'text-orange-500' },
];

export default function AgentStore() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight italic flex items-center gap-3">
             <ShoppingBag className="text-[#00c896]" size={32} />
             Intelligence Agent Store
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Deploy pre-trained cognitive personas to your publication lifecycle with one click.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white font-black text-sm hover:bg-zinc-50 transition-all flex items-center gap-2">
              <Settings size={18} />
              Manage My Agents
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#00c896] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search specialized agents by domain or logic type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-[#00c896]/10 transition-all font-medium text-sm shadow-sm"
            />
         </div>
         <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm">
            <Filter size={18} />
            All Verticals
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {premiumAgents.map((agent) => (
           <motion.div 
            key={agent.id}
            whileHover={{ y: -5 }}
            className="p-8 rounded-[40px] bg-white border border-zinc-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
           >
              <div className="mb-6 flex justify-between items-start">
                 <div className={`w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center ${agent.color} border border-zinc-100`}>
                    <agent.icon size={28} />
                 </div>
                 <div className="flex items-center gap-1 text-amber-500">
                    <Star size={12} className="fill-amber-500" />
                    <span className="text-[10px] font-black">5.0</span>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{agent.category}</div>
                    <h3 className="text-lg font-black text-zinc-900 tracking-tight">{agent.name}</h3>
                 </div>
                 <p className="text-xs text-zinc-500 leading-relaxed min-h-[48px]">
                    {agent.desc}
                 </p>
                 <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                    <div className="text-sm font-black text-zinc-900">{agent.price}</div>
                    <button className="flex items-center gap-1 text-[10px] font-black text-[#00c896] uppercase tracking-widest hover:translate-x-1 transition-transform">
                       Install Logic
                       <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="p-12 rounded-[48px] bg-zinc-900 text-white relative overflow-hidden">
         <Zap className="absolute -right-8 -top-8 text-[#00c896]/10 w-64 h-64 rotate-12" />
         <div className="max-w-2xl space-y-6 relative z-10">
            <h2 className="text-3xl font-black italic tracking-tight">Monetize Your Intelligence</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
               Do you have proprietary technical journals or research datasets? Package them as a shared Intelligence Node and earn revenue whenever other publishers license your factual ground truth.
            </p>
            <div className="flex gap-4">
               <button className="px-10 py-4 rounded-[20px] bg-[#00c896] text-white font-black text-sm hover:scale-[1.02] shadow-xl shadow-[#00c896]/20 transition-all">
                  Register Knowledge Asset
               </button>
               <button className="px-10 py-4 rounded-[20px] bg-white/5 border border-white/10 text-white font-black text-sm hover:bg-white/10 transition-all">
                  Creator FAQ
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
