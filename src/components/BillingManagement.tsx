import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  CreditCard, 
  Check, 
  Zap, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Package
} from 'lucide-react';

export default function BillingManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>({
    status: 'active',
    plan: 'Pro Annual',
    nextBilling: '2027-06-12',
    amount: '$99.00',
    method: '•••• 4242'
  });

  const plans = [
    { name: 'Reader', price: 'Free', features: ['Core Reader Access', 'Limited AI Chats', 'Standard Quality TTS'], current: false },
    { name: 'Pro Monthly', price: '$9.99', features: ['Unlimited AI Chats', 'High-Fidelity TTS', 'Offline Downloads', 'Global Search'], current: false },
    { name: 'Pro Annual', price: '$99.00', features: ['Everything in Pro', 'Priority Feature Access', '2 Months Free', 'Export Analytics'], current: true },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1F1] font-sans selection:bg-indigo-500/30 pb-20">
      <header className="bg-[#0A0A0A] border-b border-white/5 flex items-center px-4 py-3 sticky top-0 z-50">
        <button 
          onClick={() => navigate('/profile')}
          className="text-zinc-600 hover:text-gray-100 transition-colors p-2"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-zinc-200 ml-2">Subscription & Billing</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Current Subscription Status */}
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] rounded-3xl border border-white/5 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Active Subscription</h2>
                    <p className="text-zinc-500 text-xs">Your plan is currently active and in good standing.</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Status: Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-6">
                <div>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Current Plan</p>
                  <p className="text-white font-bold">{subscription.plan}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Next Billing Date</p>
                  <p className="text-white font-bold">{subscription.nextBilling}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Amount</p>
                  <p className="text-white font-bold">{subscription.amount} / year</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-zinc-400" />
                    <p className="text-white font-bold">{subscription.method}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-5 py-2 text-xs font-bold transition-all flex items-center gap-2">
                  <ExternalLink size={14} /> Update Payment Method
                </button>
                <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl px-5 py-2 text-xs font-bold transition-all">
                  Cancel Subscription
                </button>
              </div>
            </motion.div>

            {/* Billing History */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0A0A0A] rounded-3xl border border-white/5 p-6"
            >
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-zinc-500" />
                Billing History
              </h3>
              <div className="space-y-4">
                {[
                  { date: 'Jun 12, 2026', amount: '$99.00', id: 'INV-00124', status: 'Paid' },
                  { date: 'Jun 12, 2025', amount: '$99.00', id: 'INV-00082', status: 'Paid' },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="text-zinc-400 group-hover:text-white transition-colors">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{inv.date}</p>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase">{inv.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-200 font-bold">{inv.amount}</p>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Plan Comparison Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col items-center"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none" />
              <Zap size={40} className="mb-4 opacity-50" />
              <h3 className="text-xl font-black mb-2 text-center">ConvoMag Enterprise</h3>
              <p className="text-center text-indigo-100 text-xs mb-6 px-4">
                Deploy AI digital publications across your entire organization with multi-user seats and custom LLM tuning.
              </p>
              <button className="w-full bg-white text-indigo-600 rounded-2xl py-3 text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                Contact Sales
              </button>
            </motion.div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Change Plan</h4>
              {plans.map((p, i) => (
                <div 
                  key={i} 
                  className={`p-5 rounded-3xl border transition-all ${
                    p.current 
                      ? 'bg-zinc-900 border-indigo-500/50 relative shadow-md' 
                      : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                    {p.current ? (
                      <span className="bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full border border-indigo-500/20">
                        Current
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-zinc-400">{p.price}</span>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {p.features.slice(0, 3).map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-[10px] text-zinc-500">
                        <Check size={12} className="text-[#00c896] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {!p.current && (
                    <button className="w-full mt-4 bg-white/5 hover:bg-white/10 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors">
                      Switch to {p.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
