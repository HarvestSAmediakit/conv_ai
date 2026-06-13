import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Tag, 
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

const mockLeads = [
  { id: 1, name: 'John van den Berg', company: 'Cape Agri Partners', email: 'john@capeagri.co.za', phone: '+27 82 445 9901', intent: 'High', source: 'Harvest SA / AI Concierge', date: '10 mins ago', topic: 'Maize Seed Procurement' },
  { id: 2, name: 'Sarah Jenkins', company: 'Resilient Mining', email: 's.jenkins@resmining.com', phone: '+1 (415) 555-0122', intent: 'Medium', source: 'Mining Weekly / White Paper', date: '2 hours ago', topic: 'Equipment Leasing' },
  { id: 3, name: 'David Mbeki', company: 'First National Tech', email: 'david@fnt.co.za', phone: '+27 11 882 1044', intent: 'High', source: 'FinTech Pulse / Direct Chat', date: '5 hours ago', topic: 'Asset Management' },
  { id: 4, name: 'Elena Rossi', company: 'Milan Exports', email: 'elena@rossi.it', phone: '+39 02 443 1122', intent: 'Low', source: 'Global Trade Hub', date: '1 day ago', topic: 'Export Licenses' },
];

export default function LeadVault() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">The Lead Vault</h1>
          <p className="text-zinc-500 text-sm mt-1">High-intent prospects captured through AI conversations and document interaction.</p>
        </div>
        
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all">
              <Download size={18} />
              Export to CRM (CSV/API)
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
           <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">TOTAL LEADS CAPTURED</div>
           <div className="text-4xl font-black text-zinc-900 mb-4">1,422</div>
           <div className="flex items-center gap-2 text-[#00c896] text-xs font-bold font-sans">
              <ArrowUpRight size={14} />
              <span>+12% conversion this week</span>
           </div>
        </div>

        <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
           <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">HIGH-INTENT AUTO-DETECTED</div>
           <div className="text-4xl font-black text-zinc-900 mb-4">342</div>
           <div className="flex items-center gap-2 text-purple-500 text-xs font-bold font-sans">
              <TrendingUp size={14} />
              <span>Processing RAG scoring...</span>
           </div>
        </div>

        <div className="p-8 rounded-3xl border border-zinc-200 bg-[#00c896] text-white shadow-lg shadow-[#00c896]/20">
           <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">ESTIMATED PIPE VALUE</div>
           <div className="text-4xl font-black text-white mb-4">$2.4M</div>
           <div className="text-white/80 text-xs font-medium">Based on industry average attribution.</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#00c896] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search leads by name, company, or intent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-[#00c896]/10 transition-all font-medium text-sm"
            />
         </div>
         <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50 transition-all">
            <Filter size={18} />
            Filter Intent
         </button>
      </div>

      {/* Lead List */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                     <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Prospect / Company</th>
                     <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Captured For</th>
                     <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">AI Topic Segment</th>
                     <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Intent</th>
                     <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {mockLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-all group">
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-black italic border border-zinc-200">
                                {lead.name.charAt(0)}
                             </div>
                             <div>
                                <div className="text-sm font-black text-zinc-900">{lead.name}</div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1.5 mt-0.5">
                                   <Briefcase size={10} />
                                   {lead.company}
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="text-xs font-bold text-zinc-700">{lead.source}</div>
                          <div className="text-[10px] text-zinc-400 font-medium">{lead.date}</div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                             <Tag size={10} className="text-zinc-400" />
                             {lead.topic}
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             lead.intent === 'High' ? 'bg-[#00c896]/10 text-[#00c896]' : 
                             lead.intent === 'Medium' ? 'bg-purple-500/10 text-purple-600' : 
                             'bg-zinc-100 text-zinc-400'
                          }`}>
                             {lead.intent === 'High' ? 'Hot Alert' : lead.intent}
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <button className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:text-[#00c896] hover:border-[#00c896] transition-all">
                             <MessageSquare size={16} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 bg-zinc-50/50 border-t border-zinc-50 flex justify-center">
            <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-all flex items-center gap-2">
               Show More Prospects
               <ExternalLink size={12} />
            </button>
         </div>
      </div>
    </div>
  );
}
