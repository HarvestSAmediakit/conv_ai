import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Play,
  ArrowRight,
  Mic,
  Headphones,
  FileText,
  UploadCloud,
  Sparkles,
  BarChart,
  User,
  LayoutGrid,
  PenTool,
  Settings,
  Home
} from 'lucide-react';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-zinc-900/90 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <span className="font-bold text-xl tracking-tight text-white">ConvoMag<span className="text-indigo-400">AI</span></span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-2 px-4">
                  {[
                    { to: "/home", icon: Home, label: "Home" },
                    { to: "/hub", icon: LayoutGrid, label: "Library" },
                    { to: "/publish", icon: PenTool, label: "Publication Studio" },
                    { to: "/reader", icon: FileText, label: "Smart Reader" },
                    { to: "/analytics", icon: BarChart, label: "Metrics & Analytics" },
                    { to: "/advertiser", icon: BarChart, label: "Sponsor Hub" },
                    { to: "/admin", icon: Settings, label: "System Setup" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.to}
                      className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={20} className="group-hover:text-indigo-400 transition-colors" /> 
                      <span className="font-medium tracking-wide">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMenuOpen(true)} className="text-zinc-300 hover:text-white transition-colors">
              <Menu size={24} />
            </button>
            <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              ConvoMag<span className="text-indigo-400">AI</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/publish" className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              <UploadCloud size={18} /> Studio
            </Link>
            <div className="w-px h-4 bg-white/20 mx-2 hidden md:block"></div>
            <Link to="/hub" className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95">
              Explore Library
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24">
        {/* 1. Cinematic Hero */}
        <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-32 text-center">
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          {/* Animated AI Orb */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mx-auto w-32 h-32 relative mb-12"
          >
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-40 animate-pulse mix-blend-screen" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-full animate-spin-slow opacity-80" style={{ animationDuration: '10s' }}></div>
            <div className="absolute inset-1 bg-black rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white/70">
              <Sparkles className="w-8 h-8 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
            
            <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 mb-8 max-w-5xl mx-auto leading-[1.1]"
          >
            Every Document Deserves Intelligence.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Upload any PDF. ConvoMag AI transforms magazines, reports, newspapers, research papers, and publications into conversational, voice-enabled experiences readers can explore, question, and listen to.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={() => navigate('/publish')} className="group flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] w-full sm:w-auto">
              Open Publication Studio <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/smart-reader')} className="flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-all w-full sm:w-auto">
              <Play fill="currentColor" size={16} /> View Interactive Demo
            </button>
          </motion.div>
        </section>

        {/* 2. Trusted Publishers */}
        <section className="border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <p className="text-center text-xs font-bold tracking-[0.2em] text-zinc-600 uppercase mb-10">Powering the Next Generation of Media</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale items-center pointer-events-none select-none">
               <span className="text-2xl font-serif font-bold">The Daily Journal</span>
               <span className="text-2xl font-bold tracking-tighter">TECH<span className="font-light">WEEK</span></span>
               <span className="text-2xl font-serif italic">Global Review</span>
               <span className="text-2xl font-black uppercase">Vanguard</span>
            </div>
          </div>
        </section>

        {/* 3. Upload -> Enrich -> Publish Flow */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">AI-Native Publishing Operating System.</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">One upload creates an interactive publication, search engine, podcast, and voice interface.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { title: "1. Upload", desc: "Drag and drop any standard PDF publication.", icon: UploadCloud, color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
              { title: "2. Enrich", desc: "Gemini AI parses structure, context, imagery, and narratives.", icon: Sparkles, color: "from-indigo-500/20 to-purple-500/20", iconColor: "text-indigo-400" },
              { title: "3. Publish", desc: "Instantly deploy an app-like experience across all devices.", icon: Play, color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" }
            ].map((step, i) => (
              <div key={i} className="relative p-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-colors group">
                <div className="bg-[#0A0A0A] p-10 rounded-[31px] h-full overflow-hidden relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ease-out`}>
                    <step.icon className={step.iconColor} size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. AI Podcast Showcase & Voice */}
        <section className="border-y border-white/5 bg-[#080808] py-32 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3/4 h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid xl:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold tracking-wide text-xs uppercase mb-8">
                Editorial Audio Engine
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">Every Publication Gets Its Own Podcast.</h2>
              <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                Generate dual-host discussions, executive summaries, and listener Q&A sessions directly from your static PDFs. Let readers listen intuitively.
              </p>
              
              <ul className="space-y-6 mb-12">
                {[
                  "Dual-host conversational analysis",
                  "Native advertiser promotional scripts",
                  "Multilingual voice synthesis",
                  "Interactive Voice Barging (Ask questions live)"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-zinc-300 font-medium">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                       <Sparkles size={14} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button onClick={() => navigate('/demo')} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.3)] w-full sm:w-auto justify-center">
                <Headphones size={20} /> Listen to Live Demo
              </button>
            </div>
            
            <div className="relative">
              {/* Glass Player Mockup */}
              <div className="relative z-10 bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[40px] p-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                   <div className="w-32 h-32 bg-indigo-500 rounded-full blur-3xl"></div>
                </div>

                <div className="flex items-center gap-5 mb-10 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-inner">
                    <div className="relative">
                      <Mic className="text-indigo-400" size={32} />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-[#0A0A0A]"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl tracking-tight mb-1 text-white">AI Podcast Mode</h4>
                    <p className="text-zinc-400 font-medium">Listening to: TechWeek Issue #42</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-10 relative z-10">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-indigo-500 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full translate-x-1 border-[3px] border-indigo-500"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 font-mono tracking-wider">
                    <span>12:04</span>
                    <span>34:28</span>
                  </div>
                </div>

                {/* Simulated Audio Waves */}
                <div className="flex items-center justify-between gap-1.5 h-16 mb-10 relative z-10">
                  {[20, 40, 70, 40, 90, 60, 30, 80, 50, 30, 60, 100, 70, 40, 20, 60, 80, 40, 20, 50, 20, 70, 40].map((h, i) => (
                    <div key={i} className="w-1.5 rounded-full animate-pulse" style={{ 
                        height: `${h}%`, 
                        animationDelay: `${i * 0.05}s`,
                        backgroundColor: i > 12 && i < 18 ? '#4ade80' : '#818cf8',
                        opacity: h > 50 ? 1 : 0.5
                    }}></div>
                  ))}
                </div>
                
                <div className="p-5 rounded-2xl bg-[#0A0A0A]/50 border border-white/5 backdrop-blur-md relative z-10">
                  <p className="text-indigo-200 text-sm leading-relaxed"><span className="font-bold text-white mr-2">Reader asks:</span>"Wait, can you explain that last point about soil health again?"</p>
                </div>
              </div>
              
              {/* Decorative Blur */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10 blur-2xl -z-10 rounded-[40px] transform scale-105"></div>
            </div>
          </div>
        </section>

        {/* 5. Metrics System */}
        <section className="max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Premium Editorial Intelligence.</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Track what actually matters. Beyond generic analytics, see how deeply readers understand your content.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Reader Intelligence Score", val: "92%" },
              { label: "Engagement Heatmaps", val: "Active" },
              { label: "Podcast Completion", val: "84%" },
              { label: "AI Question Volume", val: "1.2k" },
              { label: "Content Discovery Rate", val: "High" },
              { label: "Reader Attention Time", val: "12m" },
              { label: "Sponsor Conversion", val: "4.8%" },
              { label: "Generated Artifacts", val: "2,041" },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all text-left flex flex-col justify-between min-h-[140px] group cursor-default">
                <span className="text-zinc-400 text-sm font-medium tracking-wide group-hover:text-zinc-300 transition-colors">{stat.label}</span>
                <span className="text-3xl font-bold tracking-tight text-white mt-4">{stat.val}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <button onClick={() => navigate('/analytics')} className="text-white hover:text-white/80 font-semibold tracking-wide transition-colors inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 border border-white/10 rounded-full">
                 View Analytics Dashboard <ArrowRight size={16} />
             </button>
          </div>
        </section>
        
        {/* Call to action */}
         <section className="max-w-5xl mx-auto px-6 py-24 text-center">
            <div className="p-[1px] rounded-[48px] bg-gradient-to-b from-white/10 to-transparent">
              <div className="bg-[#0A0A0A] p-12 md:p-24 rounded-[47px] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-indigo-500/20 blur-[100px] pointer-events-none rounded-full"></div>
                
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">Ready to transform your publication?</h2>
                <button onClick={() => navigate('/publish')} className="relative z-10 bg-white text-black px-12 py-5 rounded-full text-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                  Upload PDF Now
                </button>
              </div>
            </div>
         </section>

      </main>

      <footer className="border-t border-white/5 bg-[#030303] py-12 text-center">
         <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="text-indigo-400" size={20} />
            <span className="font-bold text-xl tracking-tight text-white">ConvoMag<span className="text-indigo-400">AI</span></span>
         </div>
         <p className="text-sm font-medium tracking-wide text-zinc-500">© 2026 ConvoMag AI. The Intelligent Publishing Operating System.</p>
      </footer>
    </div>
  );
}
