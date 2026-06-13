import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  ShieldCheck, 
  Globe, 
  Rocket, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Layout,
  Briefcase,
  Zap,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const financialData = [
  { year: 'Year 1', revenue: 1.55 },
  { year: 'Year 2', revenue: 8.2 },
  { year: 'Year 3', revenue: 30.5 },
  { year: 'Year 4', revenue: 110.0 },
  { year: 'Year 5', revenue: 250.0 },
];

interface InvestorPitchProps {
  onClose: () => void;
}

export default function InvestorPitch({ onClose }: InvestorPitchProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Hero
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20"
      >
        <Zap size={48} className="text-indigo-400" />
      </motion.div>
      <div className="space-y-4">
        <h1 className="text-6xl font-black text-white tracking-tighter">
          ConvoMag <span className="text-indigo-500">AI</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-xl mx-auto font-medium leading-relaxed">
          The constitutional core of federated publishing. Turning every document into a living, interactive knowledge artifact.
        </p>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
        <span>Investor Briefing</span>
        <span className="w-1 h-1 rounded-full bg-zinc-700" />
        <span>V1.0</span>
      </div>
    </div>,

    // Slide 2: Problem & Solution
    <div className="grid grid-cols-2 gap-12 h-full">
      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-rose-500 uppercase tracking-widest">The Problem</label>
          <h2 className="text-4xl font-bold text-white tracking-tight">Static PDFs are Dead.</h2>
        </div>
        <div className="space-y-6">
          {[
            "Magazines are passive & lack real-time engagement.",
            "Publishers struggle to monetize digital copies effectively.",
            "Reader behavior is a black box without real granular data.",
            "Corporate & Educational training is stuck in the 1990s."
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
              <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mt-0.5 shrink-0">
                <X size={12} />
              </div>
              <p className="text-zinc-400 text-sm font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest">The Solution</label>
          <h2 className="text-4xl font-bold text-white tracking-tight">Living Knowledge Base.</h2>
        </div>
        <div className="space-y-4">
          <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-3">
             <div className="flex items-center gap-3 text-indigo-400">
               <BarChart3 size={20} />
               <h3 className="font-bold text-lg">Cinematic Interactive Flipbooks</h3>
             </div>
             <p className="text-zinc-400 text-sm leading-relaxed">High-end UX coupled with grounded AI that answers reader questions on demand.</p>
          </div>
          <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-3">
             <div className="flex items-center gap-3 text-indigo-400">
               <ShieldCheck size={20} />
               <h3 className="font-bold text-lg">Federated Governance</h3>
             </div>
             <p className="text-zinc-400 text-sm leading-relaxed">Decentralized control for enterprise clients, ensuring data sovereignty and integrity.</p>
          </div>
        </div>
      </div>
    </div>,

    // Slide 3: Competitive Landscape
    <div className="space-y-12 h-full flex flex-col">
      <div className="text-center space-y-2">
         <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Competition</label>
         <h2 className="text-4xl font-bold text-white tracking-tight">Our Unfair Advantage</h2>
      </div>
      <div className="flex-1 bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900">
              <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Competitor</th>
              <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Focus</th>
              <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-indigo-400">The Differentiator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {[
              { name: 'Jasper / Copy.ai', focus: 'AI Copywriting', diff: 'Static text generation only' },
              { name: 'Canva', focus: 'Design & Layout', diff: 'No conversational AI integration' },
              { name: 'Issuu', focus: 'Traditional Flipbooks', diff: 'Zero AI interactivity or hosting' }
            ].map((comp, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/10 transition-colors">
                <td className="p-6 text-sm font-bold text-white">{comp.name}</td>
                <td className="p-6 text-sm text-zinc-500">{comp.focus}</td>
                <td className="p-6 text-sm text-rose-500 italic">Weakness: {comp.diff}</td>
              </tr>
            ))}
            <tr className="bg-indigo-500/5 border-t-2 border-indigo-500/20">
              <td className="p-6 text-sm font-black text-indigo-400">ConvoMag AI</td>
              <td className="p-6 text-sm text-indigo-300 font-bold">Multimodal Media Hub</td>
              <td className="p-6 text-sm text-indigo-400 font-bold bg-indigo-500/10">Full Cinematic AI + Governance</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>,

    // Slide 4: Financials & Growth
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Revenue Growth</label>
          <h2 className="text-4xl font-bold text-white tracking-tight">5-Year Monetization Roadmap</h2>
        </div>
        <div className="text-right">
          <p className="text-5xl font-black text-emerald-400">$250M</p>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Projected Year 5 ARR</p>
        </div>
      </div>
      
      <div className="flex-1 bg-zinc-950/50 rounded-3xl border border-zinc-800/50 p-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={financialData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `$${val}M`}
            />
            <Tooltip 
              contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
              itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRev)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Market Opportunity', title: 'EdTech & Publishing', icon: <Globe size={16} /> },
          { label: 'Target Industries', title: 'Legal, Med, Corp', icon: <Target size={16} /> },
          { label: 'Business Model', title: 'SaaS Tiers + Ads', icon: <BarChart3 size={16} /> }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <div className="text-indigo-400">{item.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</p>
              <p className="text-sm font-bold text-white">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // Slide 5: The Vision
    <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
      <div className="space-y-4 max-w-3xl">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-indigo-500 font-black text-xl tracking-[0.2em] mb-4"
        >
          OUR VISION
        </motion.div>
        <h2 className="text-6xl font-bold text-white leading-[1.1] tracking-tight">
          Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Access to Global Knowledge</span> through Federated Governance.
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4 group hover:border-indigo-500/30 transition-colors">
          <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit mx-auto text-indigo-400">
             <Rocket size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Go-To-Market</h3>
          <p className="text-zinc-500 text-sm">Pilot projects with Cape Town universities and global content hubs starting Q4 2026.</p>
        </div>
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4 group hover:border-indigo-500/30 transition-colors">
          <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mx-auto text-emerald-400">
             <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Partnerships</h3>
          <p className="text-zinc-500 text-sm">Strategic alliances with media houses and educational federations to scale reach.</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-zinc-200 transition-colors shadow-2xl"
      >
        Close Presentation
      </button>
    </div>
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Bar */}
      <div className="flex items-center justify-between p-8 z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-indigo-600/20">C</div>
          <span className="text-white font-bold tracking-tight text-xl">ConvoMag Premium Briefing</span>
        </div>
        <button 
          onClick={onClose}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Slide Container */}
      <div className="flex-1 relative overflow-hidden px-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full max-w-6xl mx-auto"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 left-0 right-0 z-20 px-12 flex items-center justify-between">
        <div className="flex gap-4">
          <button 
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className="h-14 w-14 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 transition-all border border-zinc-800"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
             disabled={currentSlide === slides.length - 1}
             onClick={() => setCurrentSlide(prev => prev + 1)}
             className="h-14 w-14 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 transition-all border border-zinc-800"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 bg-zinc-900/50 backdrop-blur-xl px-6 py-3 rounded-full border border-zinc-800/50">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-indigo-500' : 'w-1.5 bg-zinc-700 hover:bg-zinc-600'}`}
            />
          ))}
        </div>

        <div className="w-14 h-14" /> {/* Spacer */}
      </div>
    </div>
  );
}
