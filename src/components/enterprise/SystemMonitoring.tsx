import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Server, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  HardDrive,
  Cpu,
  Zap,
  Globe,
  Lock,
  Cloud
} from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockMetrics = [
  { time: '00:00', load: 32, latency: 45 },
  { time: '04:00', load: 28, latency: 42 },
  { time: '08:00', load: 65, latency: 58 },
  { time: '12:00', load: 89, latency: 62 },
  { time: '16:00', load: 74, latency: 55 },
  { time: '20:00', load: 45, latency: 48 },
  { time: '23:59', load: 35, latency: 44 },
];

export default function SystemMonitoring() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastBackup, setLastBackup] = useState('2 hours ago');

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSyncing(false);
    setLastBackup('Just now');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">Monitoring & Recovery</h1>
          <p className="text-zinc-500 text-sm mt-1">Enterprise infrastructure health, node distribution, and automated recovery protocols.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Cloud size={18} />}
          {isSyncing ? 'Synchronizing Cluster...' : 'Trigger Global Backup'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Cluster Status', val: 'Operational', icon: Server, color: 'text-[#00c896]', bg: 'bg-[#00c896]/10' },
          { label: 'AI Node Health', val: '99.98%', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Data Redundancy', val: 'Active (3x)', icon: Database, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Security Layer', val: 'Shield-V4', icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon size={22} />
            </div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-xl font-black text-zinc-900">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Load */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-zinc-900 flex items-center gap-2">
               <Activity size={18} className="text-[#00c896]" />
               Infrastructure Traffic & Latency (ms)
            </h3>
            <div className="flex gap-4">
              <span className="text-[10px] font-black text-[#00c896] uppercase tracking-widest">• AI Compute</span>
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">• API Latency</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMetrics}>
                <defs>
                   <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#00c896" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#00c896" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}}/>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="latency" stroke="#00c896" strokeWidth={3} fill="url(#colorLatency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sync Status */}
        <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-900 text-white flex flex-col">
           <h3 className="font-black mb-6 flex items-center gap-2">
              <HardDrive size={18} className="text-[#00c896]" />
              Sync Integrity
           </h3>
           
           <div className="space-y-6 flex-1">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                 <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">LAST CONTENT SNAPSHOT</div>
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#00c896]" size={18} />
                    <span className="text-sm font-bold">{lastBackup}</span>
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>RECOVERY READINESS</span>
                    <span>99%</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[99%] h-full bg-[#00c896]" />
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <div className="text-[10px] font-black text-[#00c896] uppercase tracking-widest mb-4">ACTIVE EDGE NODES</div>
                 <div className="grid grid-cols-2 gap-3">
                    {['Frankfurt', 'New York', 'London', 'Tokyo'].map((city) => (
                      <div key={city} className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                         <Globe size={12} className="text-zinc-500" />
                         {city}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
           
           <div className="mt-8 p-4 rounded-2xl bg-[#00c896]/10 border border-[#00c896]/20">
              <div className="flex items-center gap-2 mb-1">
                 <Shield size={14} className="text-[#00c896]" />
                 <span className="text-[10px] font-black uppercase text-[#00c896] tracking-widest">Enterprise Guard</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                 Real-time DDoS protection and AES-256 session encryption is active for all reader conversational streams.
              </p>
           </div>
        </div>
      </div>

      {/* Node Events */}
      <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
         <h3 className="font-black text-zinc-900 mb-6 flex items-center gap-2">
            <Zap size={18} className="text-blue-500" />
            Infrastructure Event Log
         </h3>
         <div className="space-y-4">
            {[
              { event: 'Content Enrichment Protocol Complete', node: 'Node-4A', time: '12 mins ago', status: 'success' },
              { event: 'Automated Backup Verified', node: 'Snapshot-XX', time: '1 hour ago', status: 'success' },
              { event: 'Minor Latency Spike Detected', node: 'Node-7C', time: '3 hours ago', status: 'warning' },
              { event: 'AI Personality Weights Re-synced', node: 'Global-Edge', time: 'Yesterday', status: 'success' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                 <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${log.status === 'success' ? 'bg-[#00c896]/10 text-[#00c896]' : 'bg-amber-500/10 text-amber-600'}`}>
                       {log.status === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    </div>
                    <div>
                       <div className="text-sm font-bold text-zinc-900">{log.event}</div>
                       <div className="text-[10px] text-zinc-500">{log.node} • {log.time}</div>
                    </div>
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-zinc-300">LOG-00{i+42}</div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
