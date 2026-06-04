import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  User,
  BookOpen,
  Bookmark,
  LayoutGrid,
  Filter,
  MoreVertical,
  X,
  Home,
  BarChart,
  Settings,
  PenTool,
  Mic,
  Download
} from 'lucide-react';
import Carousel from './Carousel';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('magazines');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24 relative">
      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-lg text-emerald-600">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                  <Link to="/home" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <Home size={20} /> <span className="font-medium">Home</span>
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <User size={20} /> <span className="font-medium">Profile</span>
                  </Link>
                  <Link to="/hub" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <LayoutGrid size={20} /> <span className="font-medium">Marketplace</span>
                  </Link>
                  <Link to="/publish" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <PenTool size={20} /> <span className="font-medium">Publisher Dashboard</span>
                  </Link>
                  <Link to="/advertiser" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <BarChart size={20} /> <span className="font-medium">Advertiser Intelligence</span>
                  </Link>
                  <Link to="/analytics" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <BarChart size={20} /> <span className="font-medium">Analytics</span>
                  </Link>
                  <Link to="/admin" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <Settings size={20} /> <span className="font-medium">Admin Panel</span>
                  </Link>
                  <Link to="/demo" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                    <Mic size={20} /> <span className="font-medium">VAD Interrupt UI</span>
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMenuOpen(true)} className="text-zinc-600 p-2 -ml-2 hover:bg-gray-100 rounded-full"><Menu size={24} /></button>
                <h1 className="text-xl font-bold text-emerald-600 tracking-tight">ConvoMag AI</h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-zinc-600"><Search size={20} /></button>
                <button className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-emerald-700">Sign in</button>
                <button className="text-zinc-600"><MoreVertical size={20} /></button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 space-y-8">
        {/* AI Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-[2rem] p-8 text-white shadow-xl shadow-zinc-950/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="ai-orb"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">ConvoMag AI</span>
            </div>
            <span className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Online</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-[1.1]">
            "I've read every issue of this publication. Ask me anything."
          </h1>
          
          <div className="flex flex-wrap gap-2 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
              <span className="text-lg">🎤</span> Ask any publication
            </button>
            <button className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
              🔍 Search by topic
            </button>
          </div>
        </motion.div>
        
        {/* Newspaper Section */}
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Newspapers</h2>
                <a href="#" className="text-emerald-600 font-semibold text-sm">See All {'>'}</a>
            </div>
            <Carousel>
                <div onClick={() => navigate('/smart-reader')} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 min-w-[160px] cursor-pointer">
                    <div className="h-40 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400 font-bold italic">WSJ Cover</div>
                    <h3 className="font-bold text-sm truncate">The Wall Street Journal</h3>
                    <p className="text-xs text-gray-500">1 Jun 2026</p>
                </div>
                <div onClick={() => navigate('/smart-reader')} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 min-w-[160px] cursor-pointer">
                    <div className="h-40 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400 font-bold italic">WaPo Cover</div>
                    <h3 className="font-bold text-sm truncate">The Washington Post</h3>
                    <p className="text-xs text-gray-500">30 May 2026</p>
                </div>
            </Carousel>
        </section>

        {/* Magazine Section */}
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Magazines</h2>
                <a href="#" className="text-emerald-600 font-semibold text-sm">See All {'>'}</a>
            </div>
            <Carousel>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 min-w-[160px]">
                    <div className="h-40 bg-yellow-400 rounded-lg mb-2"></div>
                    <h3 className="font-bold text-sm truncate">The Economist</h3>
                    <p className="text-xs text-gray-500">30 May 2026</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 min-w-[160px]">
                    <div className="h-40 bg-gray-800 rounded-lg mb-2"></div>
                    <h3 className="font-bold text-sm truncate">Rolling Stone</h3>
                    <p className="text-xs text-gray-500">5 May 2026</p>
                </div>
            </Carousel>
        </section>

        {/* Categories */}
        <section>
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                    <Filter className="text-emerald-600" size={18} /> <span className="font-medium">Animals</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                    <LayoutGrid className="text-emerald-600" size={18} /> <span className="font-medium">Art</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                    <BookOpen className="text-emerald-600" size={18} /> <span className="font-medium">Automotive</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                    <Bookmark className="text-emerald-600" size={18} /> <span className="font-medium">Aviation</span>
                </div>
            </div>
        </section>
      </main>

      {/* Floating App Promo */}
      <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4.5 rounded-2xl flex items-center justify-between shadow-2xl z-40 max-w-lg mx-auto border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00c896]/15 text-[#00c896] rounded-xl flex items-center justify-center font-bold">
              <Download size={18} />
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#00c896]">ConvoMag Portable</p>
                <p className="text-xs text-zinc-300">Install for offline access & native-like flow.</p>
            </div>
        </div>
        <button 
          onClick={() => setIsPWAInstallOpen(true)}
          className="bg-[#00c896] hover:bg-[#00af83] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white cursor-pointer active:scale-95 transition-all"
        >
          Install App
        </button>
      </div>

      <PWAInstallPrompt 
        isOpen={isPWAInstallOpen} 
        onClose={() => setIsPWAInstallOpen(false)} 
      />

    </div>
  );
}
