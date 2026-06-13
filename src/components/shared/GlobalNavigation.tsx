import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, User, Home, LayoutGrid, PenTool,
  FileText, BarChart, Settings, Mic, Folder, TrendingUp, Palette, Globe
} from 'lucide-react';

interface GlobalNavigationProps {
  onOpenPricing?: () => void;
}

export default function GlobalNavigation({ onOpenPricing }: GlobalNavigationProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigateStand = [
    {
      label: "Discovery",
      items: [
        { to: "/catalog", icon: Home, label: "Curated Catalog Desk" },
        { to: "/discovery", icon: Globe, label: "Intelligence Directory" },
      ]
    },
    {
      label: "Workspace",
      items: [
        { to: "/publish", icon: Folder, label: "Publisher Workspace" },
        { to: "/marketplace", icon: LayoutGrid, label: "AI Agent Marketplace" },
      ]
    },
    {
      label: "Tools & Analytics",
      items: [
        { to: "/revenue", icon: TrendingUp, label: "Revenue ROI" },
        { to: "/branding", icon: Palette, label: "White Label" },
        { to: "/voice", icon: Mic, label: "Voice Remix Sandbox" },
      ]
    }
  ];

  const featuredPublications = [
    { to: "/pub/economist", label: "The Economist (AI Edition)" },
    { to: "/pub/rolling-stone", label: "Rolling Stone Magazine" },
    { to: "/pub/wsj", label: "The Wall Street Journal" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/hub?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 h-16 flex items-center">
        <div className="w-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-zinc-400 hover:text-white transition p-1"
            >
              <Menu size={24} />
            </button>
            <Link to="/home" className="flex items-center gap-2">
              <div className="bg-[#00c896] h-8 w-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
                C
              </div>
              <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                ConvoMag <span className="text-[#00c896]">OS</span>
              </span>
              <span className="text-lg font-bold tracking-tight text-[#00c896] sm:hidden">
                ConvoMag OS
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex flex-1 items-center bg-zinc-900 rounded-full px-3 py-1.5 border border-white/10 transition-all">
                <Search size={16} className="text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white text-sm w-full mx-2 focus:outline-none"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <Search size={20} />
              </button>
            )}
            
            <button
              onClick={onOpenPricing || (() => navigate('/profile'))}
              className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Global Sidebar Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#111111] border-r border-white/5 z-50 flex flex-col pt-4 pb-6"
            >
              <div className="px-6 flex flex-row items-center justify-between mb-8">
                <Link to="/home" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <span className="font-bold text-xl tracking-tight text-white">
                    ConvoMag<span className="text-[#00c896]">OS</span>
                  </span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="text-zinc-400 hover:text-white transition p-1">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto w-full">
                <nav className="flex flex-col space-y-6 px-6 pt-2">
                  {navigateStand.map((group, gIdx) => (
                    <div key={gIdx}>
                      <h3 className="text-xs font-semibold text-[#00c896] tracking-wider uppercase mb-3">{group.label}</h3>
                      <div className="flex flex-col space-y-1">
                        {group.items.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.to}
                            className="flex items-center gap-4 py-2.5 text-zinc-400 hover:text-zinc-100 transition-colors group w-full"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <item.icon size={20} className="group-hover:text-[#00c896] transition-colors" />
                            <span className="font-medium text-[15px]">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3">FEATURED PUBLICATIONS</h3>
                    <div className="flex flex-col space-y-3">
                      {featuredPublications.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          className="text-zinc-400 hover:text-zinc-100 text-[15px] transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
              <div className="px-6 py-6 border-t border-white/5 text-xs text-zinc-600">
                <p>Curated Design Calibrations</p>
                <p>&copy; 2026 ConvoMag OS Project</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
