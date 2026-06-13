import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Activity,
  Zap,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, leads: 240, engagement: 85 },
  { name: 'Feb', revenue: 3000, leads: 198, engagement: 82 },
  { name: 'Mar', revenue: 2000, leads: 310, engagement: 88 },
  { name: 'Apr', revenue: 6780, leads: 520, engagement: 92 },
  { name: 'May', revenue: 5890, leads: 480, engagement: 90 },
  { name: 'Jun', revenue: 8390, leads: 610, engagement: 95 },
];

const categoryData = [
  { name: 'Subscriptions', value: 45, color: '#00c896' },
  { name: 'AI Ad Placements', value: 30, color: '#0ea5e9' },
  { name: 'Lead Sales', value: 15, color: '#f59e0b' },
  { name: 'Direct Sales', value: 10, color: '#8b5cf6' },
];

export default function RevenueIntelligence() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">Revenue Intelligence</h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time ROI intelligence and attribution modeling.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            <Calendar size={16} />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Platform ARR', val: '$142,500', change: '+12.5%', icon: DollarSign, color: 'emerald' },
          { label: 'Active Subscribers', val: '1,248', change: '+8.2%', icon: Users, color: 'blue' },
          { label: 'AI Lead Conversions', val: '312', change: '+24.1%', icon: Target, color: 'amber' },
          { label: 'Average LTV', val: '$420', change: '+5.4%', icon: TrendingUp, color: 'violet' },
        ].map((kpi, i) => (
          <div key={i} className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600 mb-4 transition-transform group-hover:scale-110`}>
              <kpi.icon size={22} />
            </div>
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-black text-zinc-900">{kpi.val}</div>
              <div className="flex items-center text-[10px] font-black text-[#00c896] mb-1">
                <ArrowUpRight size={12} />
                {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-zinc-900">Revenue Performance</h3>
              <p className="text-xs text-zinc-500">Subscription and ad-tech revenue trends.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00c896]" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Projection</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c896" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00c896" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00c896" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Mix */}
        <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <h3 className="font-black text-zinc-900 mb-6">Revenue Portfolio</h3>
          <div className="space-y-6">
            {categoryData.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-zinc-700">{cat.name}</span>
                  <span className="text-sm font-black text-zinc-900">{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000" 
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="flex items-center gap-3 mb-2">
              <Zap size={18} className="text-[#00c896]" />
              <div className="text-sm font-black text-zinc-900">ROI Prediction</div>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Based on current momentum, we project a 15% increase in Subscriptions if AI Agent training is optimized for the tech vertical.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marketplace Performance */}
        <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-zinc-900">Agent Performance</h3>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} />
              Live Marketplace
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Legal Advisor Bot', sales: 42, rev: '$4,200', rating: 4.9 },
              { name: 'Agri-Sales Pro', sales: 38, rev: '$3,800', rating: 4.8 },
              { name: 'ROI Strategist', sales: 25, rev: '$4,900', rating: 5.0 },
              { name: 'Customer Concierge', sales: 22, rev: '$1,100', rating: 4.6 },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 hover:border-zinc-200 transition-all cursor-pointer">
                <div>
                  <div className="text-sm font-bold text-zinc-900">{agent.name}</div>
                  <div className="text-[10px] text-zinc-500">{agent.sales} Licenses Sold</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-[#00c896]">{agent.rev}</div>
                  <div className="text-[10px] text-zinc-400">★ {agent.rating} Rating</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Attribution */}
        <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <h3 className="font-black text-zinc-900 mb-6">Lead Attribution Hub</h3>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#00c896' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#00c896]" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AI Conversational Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-zinc-200" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Static Forms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
