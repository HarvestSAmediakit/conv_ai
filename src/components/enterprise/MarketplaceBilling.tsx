import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Package, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2,
  Lock,
  Zap,
  LayoutGrid,
  ShoppingBag,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

const licensePlans = [
  { id: 'standard', name: 'Standard Agent', price: '$29', features: ['Core Logic', 'Text Only', '1k Conversations/mo'], current: true },
  { id: 'premium', name: 'Premium Agent', price: '$99', features: ['Advanced RAG', 'Voice Enabled', 'Unlimited Chats', 'Commercial Rights'], current: false },
  { id: 'enterprise', name: 'Elite Partner', price: 'Custom', features: ['White-label Logic', 'Custom Model Tuning', 'Dedicated Support', 'API Access'], current: false },
];

export default function MarketplaceBilling() {
  const [activeTab, setActiveTab] = useState<'overview' | 'licensing' | 'payouts'>('overview');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">Financial Workspace</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage licenses, payout distribution, and marketplace revenue.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all">
            <Download size={16} />
            Export Statements
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-100 pb-px">
        {[
          { id: 'overview', label: 'Revenue Overview', icon: DollarSign },
          { id: 'licensing', label: 'Agent Licensing', icon: Lock },
          { id: 'payouts', label: 'Publisher Payouts', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? 'text-[#00c896]' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTabBr" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c896]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">TOTAL PLATFORM GROSS</div>
              <div className="text-4xl font-black text-zinc-900 mb-4">$842,500.00</div>
              <div className="flex items-center gap-2 text-[#00c896] text-xs font-bold">
                 <ArrowUpRight size={14} />
                 <span>+22.4% vs last cycle</span>
              </div>
            </div>
            
            <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">PENDING PAYOUTS</div>
              <div className="text-4xl font-black text-zinc-900 mb-4">$12,420.50</div>
              <div className="text-zinc-500 text-xs font-medium">Processing cycle ends in 4 days.</div>
            </div>

            <div className="p-8 rounded-3xl border border-zinc-200 bg-[#00c896] text-white shadow-lg shadow-[#00c896]/20">
              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">MARKETPLACE SHARE</div>
              <div className="text-4xl font-black text-white mb-4">$245,100.22</div>
              <div className="text-white/80 text-xs font-medium">Service fees and infrastructure credits.</div>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <h3 className="font-black text-zinc-900 mb-6 flex items-center gap-2">
               <ShoppingBag size={18} className="text-[#00c896]" />
               Recent Marketplace Transactions
            </h3>
            <div className="space-y-2">
               {[
                 { item: 'Legal Strategy Agent (Master)', user: 'LawReview Ltd', date: '2 mins ago', amount: '+$299.00', status: 'Success' },
                 { item: 'Publisher Pro License (Annual)', user: 'Mining Daily', date: '1 hour ago', amount: '+$5,400.00', status: 'Success' },
                 { item: 'Voice Clone (Premium Slot)', user: 'AgriNews SA', date: '4 hours ago', amount: '+$49.00', status: 'Success' },
                 { item: 'Enterprise SSO Add-on', user: 'Bank-X Publishing', date: '1 day ago', amount: '+$1,200.00', status: 'Success' },
               ].map((tx, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 hover:border-zinc-200 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-900 font-bold italic">C</div>
                       <div>
                          <div className="text-sm font-bold text-zinc-900">{tx.item}</div>
                          <div className="text-[10px] text-zinc-500">{tx.user} • {tx.date}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-[#00c896]">{tx.amount}</div>
                       <div className="text-[8px] font-black uppercase text-zinc-400">{tx.status}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'licensing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {licensePlans.map((plan) => (
              <div key={plan.id} className={`p-8 rounded-[32px] border transition-all ${plan.current ? 'border-[#00c896] bg-[#00c896]/5 ring-1 ring-[#00c896]' : 'border-zinc-200 bg-white opacity-80'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-900">
                      <Zap size={24} className={plan.current ? 'text-[#00c896]' : 'text-zinc-300'} />
                   </div>
                   {plan.current && <span className="bg-[#00c896] text-white text-[10px] font-black px-3 py-1 rounded-full">ACTIVE LICENSE</span>}
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-1">{plan.name}</h3>
                <div className="text-3xl font-black text-zinc-900 mb-6">{plan.price}<span className="text-sm text-zinc-400 font-medium"> / {plan.id === 'standard' ? 'mo' : plan.id === 'premium' ? 'agent' : ''}</span></div>
                
                <ul className="space-y-3 mb-8">
                   {plan.features.map((f, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                        <CheckCircle2 size={16} className="text-[#00c896]" />
                        {f}
                     </li>
                   ))}
                </ul>

                <button className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${plan.current ? 'bg-zinc-100 text-zinc-400 cursor-default' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}>
                   {plan.current ? 'Included in Bundle' : 'Purchase License'}
                </button>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <Lock className="text-[#00c896]" size={20} />
                <h3 className="font-black text-zinc-900">Enterprise Asset Protection</h3>
             </div>
             <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
                All AI agents deployed via the ConvoMag Marketplace are cryptographically bound to your tenant signature. This prevents logic exfiltration and ensures that your custom model tuning remains exclusive to your publications.
             </p>
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl border border-zinc-200 bg-[#0A0A0A] text-white">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                   <div className="text-[10px] font-black text-[#00c896] uppercase tracking-widest">PUBLISHER WITHDRAWAL STATUS</div>
                   <h3 className="text-3xl font-black">Authorized for Payout</h3>
                </div>
                <button className="px-8 py-3 rounded-2xl bg-[#00c896] text-white font-black text-sm hover:scale-[1.02] shadow-lg shadow-[#00c896]/20 transition-all">
                   Transfer Funds to Bank
                </button>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-white/5">
                <div>
                   <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">BANK ACCOUNT</div>
                   <div className="text-sm font-bold">•••• 8820 (Standard Chartered)</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">TAX STATUS</div>
                   <div className="text-sm font-bold text-[#00c896]">Verified / Active</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">TOTAL EARNED</div>
                   <div className="text-sm font-bold">$142,504.00</div>
                </div>
                <div>
                   <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">NEXT CYCLE</div>
                   <div className="text-sm font-bold">July 01, 2026</div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
