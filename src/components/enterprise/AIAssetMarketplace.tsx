import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Shield, Search, TrendingUp, Users, Plus, Check, Play } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  status: 'available' | 'active';
}

export default function AIAssetMarketplace() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent_sales',
      name: 'Conversion Pro',
      role: 'Sales Assistant',
      description: 'AI optimized for advertiser lead generation and high-intent commerce conversations.',
      icon: <TrendingUp className="text-emerald-500" />,
      tags: ['Commercial', 'Leads'],
      status: 'active'
    },
    {
      id: 'agent_research',
      name: 'Deep Research Unit',
      role: 'Researcher',
      description: 'Specializes in extracting deep insights from technical manuals and white papers.',
      icon: <Search className="text-indigo-500" />,
      tags: ['Academic', 'Analysis'],
      status: 'available'
    },
    {
      id: 'agent_support',
      name: 'Reader Butler',
      role: 'Support Assistant',
      description: 'Handles basic navigation, subscription queries, and reader technical support.',
      icon: <Users className="text-amber-500" />,
      tags: ['Reader Experience'],
      status: 'available'
    }
  ]);

  const handleDeploy = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">AI Agent Marketplace</h1>
          <p className="text-zinc-500 max-w-xl">Deploy specialized intelligence units across your publications to drive engagement, sales, and deep data analysis.</p>
        </div>
        <button className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all shrink-0 shadow-lg shadow-white/5">
          <Plus size={20} /> Build Custom Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-white/10 transition-all"
          >
            <div className="absolute top-0 right-0 p-8">
               <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
            </div>

            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               {agent.icon}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">{agent.role}</p>
            
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              {agent.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
               {agent.tags.map(tag => (
                 <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-zinc-400 uppercase">
                   {tag}
                 </span>
               ))}
            </div>

            <button
              onClick={() => handleDeploy(agent.id)}
              disabled={agent.status === 'active'}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                agent.status === 'active' 
                ? 'bg-zinc-900 text-zinc-500 cursor-default' 
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              {agent.status === 'active' ? <><Check size={18} /> Deployed</> : <><Zap size={18} /> Deploy to Tenant</>}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-indigo-600/5 border border-indigo-500/10 rounded-[3rem] p-12 text-center">
         <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
            <Shield size={40} />
         </div>
         <h2 className="text-2xl font-bold text-white mb-4">Enterprise Guardrails Enabled</h2>
         <p className="text-zinc-500 max-w-2xl mx-auto text-sm leading-relaxed">
           All marketplace agents operate under restricted tenant-isolation protocols. Conversational context never leaks between publishers, and enterprise PII is automatically scrubbed by the ConvoMag Privacy Layer.
         </p>
      </div>
    </div>
  );
}
