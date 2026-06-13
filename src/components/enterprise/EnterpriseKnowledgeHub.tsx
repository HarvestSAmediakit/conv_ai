import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, Image as ImageIcon, Video, Search, Plus, Filter, MoreHorizontal, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image';
  status: 'indexed' | 'pending' | 'error';
  date: string;
  size: string;
}

export default function EnterpriseKnowledgeHub() {
  const [items] = useState<KnowledgeItem[]>([
    { id: '1', title: 'Q2 Financial Projections.xlsx', type: 'xlsx', status: 'indexed', date: '2026-06-10', size: '2.4 MB' },
    { id: '2', title: 'Brand Identity Guidelines.pdf', type: 'pdf', status: 'indexed', date: '2026-06-05', size: '15.8 MB' },
    { id: '3', title: 'Product Roadmap 2027.pptx', type: 'pptx', status: 'pending', date: '2026-06-11', size: '8.1 MB' },
    { id: '4', title: 'User Interview Notes.docx', type: 'docx', status: 'indexed', date: '2026-05-28', size: '420 KB' }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'xlsx': return <FileSpreadsheet className="text-emerald-500" />;
      case 'pdf': return <FileText className="text-red-500" />;
      case 'pptx': return <ImageIcon className="text-amber-500" />; // Simplified
      case 'docx': return <FileText className="text-blue-500" />;
      default: return <FileText className="text-zinc-500" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Enterprise Knowledge Hub</h1>
          <p className="text-zinc-500">A unified, searchable lake for all your organizational data. Every file uploaded is automatically indexed and available to your AI Agents.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
             <Filter size={18} /> Filters
           </button>
           <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
             <Plus size={18} /> Upload Resource
           </button>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
           <Search className="text-zinc-500" size={20} />
           <input 
             type="text" 
             placeholder="Search across all documents, spreadsheets, and presentations..." 
             className="bg-transparent border-none text-white text-sm w-full focus:ring-0 placeholder:text-zinc-700 font-bold"
           />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-6">Resource</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Indexing Status</th>
                <th className="px-8 py-6">Date Added</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                        {getIcon(item.type)}
                      </div>
                      <span className="text-sm font-bold text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase px-2 py-1 bg-white/5 rounded-md">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {item.status === 'indexed' ? (
                         <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                           <CheckCircle size={14} /> Indexed
                         </div>
                       ) : item.status === 'pending' ? (
                         <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                           <Clock size={14} /> Processing...
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                           <AlertCircle size={14} /> Failed
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-zinc-500 font-medium">
                    {item.date}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-zinc-600 hover:text-white p-2">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-between px-4">
         <p className="text-xs text-zinc-600 font-bold">Showing 4 of 48 resources (8.2 GB Used of 100 GB)</p>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 text-zinc-500 rounded-xl text-xs font-bold hover:bg-white/10">Previous</button>
            <button className="px-4 py-2 bg-white/5 text-white rounded-xl text-xs font-bold hover:bg-white/10">Next</button>
         </div>
      </div>
    </div>
  );
}
