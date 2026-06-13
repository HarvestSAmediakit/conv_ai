import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  SlidersHorizontal, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  X, 
  Star, 
  Check,
  Compass,
  MapPin,
  Bookmark,
  ExternalLink,
  ChevronDown,
  User,
  Sliders,
  BookOpen,
  Mic,
  Monitor,
  LayoutDashboard,
  Calendar,
  Headphones,
  Send,
  Volume2,
  Trash2,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PricingModal from './PricingModal';
import CacheManagerModal from './CacheManagerModal';
import GlobalSearchOverlay from './GlobalSearchOverlay';

interface Publication {
  id: string;
  title: string;
  coverUrl: string;
  date: string;
  type: 'magazine' | 'newspaper';
  publisher: string;
  category: string;
  pdfUrl?: string;
  viewCount?: number;
  aiEnabled?: boolean;
  pageCount?: number;
  summary?: string;
  topics?: string[];
  featuredArticles?: { title: string; page: number }[];
}

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilterType, setActiveFilterType] = useState<'all' | 'magazine' | 'newspaper'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [publishedMags, setPublishedMags] = useState<any[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // New navigation tab, details panel, and offline download managers
  const [activeTab, setActiveTab] = useState<'home' | 'library'>('home');
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [askQuery, setAskQuery] = useState('');
  const [offlineMags, setOfflineMags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('convomag_offline_downloads');
      return saved ? JSON.parse(saved) : ['mag_harvest_82', 'mag_1'];
    } catch {
      return ['mag_harvest_82', 'mag_1'];
    }
  });
  const [isCacheManagerOpen, setIsCacheManagerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleOfflineDownload = (id: string) => {
    setOfflineMags(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('convomag_offline_downloads', JSON.stringify(updated));
      return updated;
    });
  };

  // Premium hardcoded catalogs representing high-fidelity magazines and newspapers
  const premiumPublications: Publication[] = [
    {
      id: 'mag_harvest_82',
      title: 'Harvest SA June 2026',
      coverUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400',
      date: 'June 2026',
      type: 'magazine',
      publisher: 'Harvest SA Agricultural Press',
      category: 'AI',
      aiEnabled: true,
      pageCount: 84,
      summary: 'This prestigious farming edition provides exhaustive commodity analyses for South African fields. Prominently exploring the 12% increase in maize price indices, regional exports, seasonal rainfall trends, and heavy high-performance machinery such as New Holland twin-rotor combine harvesters.',
      topics: ['Agriculture', 'Economics', 'Food Security', 'Machinery'],
      featuredArticles: [
        { title: 'Maize Pricing & Market Shocks', page: 14 },
        { title: 'Twin Rotor Innovations & Fuel Efficiencies', page: 26 },
        { title: 'Rainwater Forecasts & Cape Crop Reports', page: 43 },
        { title: 'Cybersecurity Risks in Automated Tractors', page: 72 }
      ]
    },
    {
      id: 'mag_1',
      title: 'The Economist (Middle East and Africa)',
      coverUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=400',
      date: '30 May 2026',
      type: 'magazine',
      publisher: 'The Economist Newspaper Ltd',
      category: 'Business',
      aiEnabled: true,
      pageCount: 64,
      summary: 'A deep, critical dive into how foundational intelligence models are altering capital allocation, algorithmic trading speeds, and multi-tenant cloud architectures. Evaluates risks of automated bias and compute cluster scaling.',
      topics: ['Business', 'Machine Learning', 'Macroeconomics'],
      featuredArticles: [
        { title: 'Algorithmic Arbitrage Shocks', page: 8 },
        { title: 'Computational Cluster Scaling Costs', page: 22 },
        { title: 'The Sovereign AI Cloud Landscape', page: 45 }
      ]
    },
    {
      id: 'mag_rs',
      title: 'Rolling Stone',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
      date: '5 May 2026',
      type: 'magazine',
      publisher: 'Penske Media Corporation',
      category: 'AI', // Representing AI & smart features
      aiEnabled: true,
      pageCount: 90,
      summary: 'Examining creative AI tools, generative song systems, and the future of IP protection. Featuring long-form dialogues with modern synthesis producers and artists.',
      topics: ['Music Tech', 'Copyright', 'Creative Synths'],
      featuredArticles: [
        { title: 'Copyright Precedence in Generative Audio', page: 15 },
        { title: 'Long-Form Dialogue with Grimes & Holly Herndon', page: 38 },
        { title: 'Real-time Synthesizer Integration in FL Studio', page: 56 }
      ]
    },
    {
      id: 'mag_2',
      title: 'Winter Collection / Vogue Premium',
      coverUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=400',
      date: '15 May 2026',
      type: 'magazine',
      publisher: 'Vogue Publishing',
      category: 'Technology',
      aiEnabled: true,
      pageCount: 112,
      summary: 'Exploring luxury winter pairings, eco-synthetic textiles, and virtual 3D apparel fittings. Highlights sustainable, closed-loop garment collections for high winters.',
      topics: ['Fashion Tech', 'Sustainability', 'Vogue Premium'],
      featuredArticles: [
        { title: '3D Digital Prototyping in High Fashion', page: 12 },
        { title: 'Eco-Synthetic Fleece Thermal Conductivity', page: 34 },
        { title: 'The Closed-Loop Fabric Supply Chain', page: 60 }
      ]
    },
    {
      id: 'paper_wsj',
      title: 'The Wall Street Journal',
      coverUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400',
      date: '1 Jun 2026',
      type: 'newspaper',
      publisher: 'Dow Jones & Company',
      category: 'Business',
      aiEnabled: true,
      pageCount: 16,
      summary: 'Coverage of inflation indices, central bank responses, technology hardware stock corrections, and global supply constraints.',
      topics: ['Finances', 'Macroeconomics', 'Equities'],
      featuredArticles: [
        { title: 'Yield Curve Inversions and Bond Markets', page: 2 },
        { title: 'Semiconductor Fabrication Backlogs Ease', page: 5 },
        { title: 'Commercial Real Estate Valuations Rebound', page: 10 }
      ]
    },
    {
      id: 'paper_twp',
      title: 'The Washington Post',
      coverUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff2bac99?auto=format&fit=crop&q=80&w=400',
      date: '30 May 2026',
      type: 'newspaper',
      publisher: 'WP Company LLC',
      category: 'Business',
      pageCount: 24,
      summary: 'Broad news reports covering legislative carbon tax caps, global climate summits, municipal zoning updates, and public transport investment grids.',
      topics: ['Politics', 'Environment', 'Infrastructure'],
      featuredArticles: [
        { title: 'Carbon Tariff Negotiations in Brussels', page: 3 },
        { title: 'Subway Expansion Project Breaks Ground', page: 7 }
      ]
    },
    {
      id: 'paper_leadership',
      title: 'Leadership Online',
      coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
      date: '12 May 2026',
      type: 'newspaper',
      publisher: 'Leadership Media',
      category: 'Business',
      pageCount: 32,
      summary: 'A collection of corporate governance reviews, executive leadership profiles, and diversity initiatives within major pan-African industries.',
      topics: ['Corporate Governance', 'Pan-African Markets', 'Innovation'],
      featuredArticles: [
        { title: 'Pan-African Fintech Scaling Rules', page: 8 },
        { title: 'Foresight and Planning in Extreme Boardrooms', page: 18 }
      ]
    },
    {
      id: 'paper_bbq',
      title: 'BBQ Online Focus',
      coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=400',
      date: '10 May 2026',
      type: 'newspaper',
      publisher: 'BBQ Journal',
      category: 'AI',
      aiEnabled: true,
      pageCount: 40,
      summary: 'Discussions spotlighting black-owned business ventures, black economic empowerment structures, local enterprise grants, and automated supply chains.',
      topics: ['BEE Systems', 'Grants', 'SME Automation'],
      featuredArticles: [
        { title: 'Incubators Raising Early Seed Rounds', page: 4 },
        { title: 'The Role of AI Agents in SME Support', page: 12 }
      ]
    }
  ];

  useEffect(() => {
    fetch('/api/magazines')
      .then(res => res.json())
      .then(data => {
        // Map database magazines into our layout
        const formatted = data.map((m: any) => ({
          id: m.id,
          title: m.title,
          coverUrl: m.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
          date: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently Added',
          type: m.id.includes('paper') ? 'newspaper' : 'magazine',
          publisher: m.publisherId === 'pub_1' ? 'TechNews Media' : 'Independent Press',
          category: m.id === 'mag_2' ? 'Art' : 'Technology',
          aiEnabled: !!m.aiEnabled,
        }));
        setPublishedMags(formatted);
      })
      .catch(err => console.error("Marketplace fetch error:", err));
  }, []);

  // Merge premium preset catalogs with user uploaded database catalogs (preventing duplicates)
  const allPublications = [...premiumPublications];
  publishedMags.forEach(dbMag => {
    if (!allPublications.some(p => p.id === dbMag.id)) {
      allPublications.push(dbMag);
    }
  });

  // Synchronize offline bookcase magazines with service worker for background cache pre-fetching
  useEffect(() => {
    const syncOfflineLibrary = () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const libraryPubs = allPublications
          .filter(pub => offlineMags.includes(pub.id))
          .map(pub => {
            let pdfUrl = pub.pdfUrl;
            if (!pdfUrl) {
              pdfUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
            }
            return {
              id: pub.id,
              title: pub.title,
              pdfUrl: pdfUrl,
              coverUrl: pub.coverUrl
            };
          });

        console.log('[Marketplace] Dispatching SYNC_LIBRARY_OFFLINE to service worker with catalog:', libraryPubs);
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_LIBRARY_OFFLINE',
          publications: libraryPubs
        });
      }
    };

    // Synchronize immediately
    syncOfflineLibrary();

    // Trigger sync again if the activating SW controller changes
    navigator.serviceWorker.addEventListener('controllerchange', syncOfflineLibrary);
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', syncOfflineLibrary);
    };
  }, [offlineMags, publishedMags]);

  // Filter application
  const filteredPublications = allPublications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(search.toLowerCase()) || 
                          pub.publisher.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory ? pub.category.toLowerCase() === activeCategory.toLowerCase() : true;
    const matchesType = activeFilterType === 'all' ? true : pub.type === activeFilterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const magazinesList = filteredPublications.filter(p => p.type === 'magazine');
  const newspapersList = filteredPublications.filter(p => p.type === 'newspaper');

  const categories = [
    { name: 'Business', icon: '📈', color: 'bg-emerald-900/30 text-emerald-600' },
    { name: 'Technology', icon: '💻', color: 'bg-blue-50 text-blue-600' },
    { name: 'AI', icon: '🤖', color: 'bg-indigo-900/30 text-indigo-400' },
    { name: 'Sports', icon: '⚽', color: 'bg-green-50 text-green-600' },
    { name: 'Aviation', icon: '✈️', color: 'bg-cyan-50 text-cyan-500' },
    { name: 'Finance', icon: '💰', color: 'bg-amber-900/30 text-amber-600' }
  ];

  return (
    <div className="min-h-screen text-gray-100 pb-36 font-sans relative selection:bg-emerald-500/10 blueprint-grid">
      {/* Main Container depending on Tab Selection */}
      <AnimatePresence mode="wait">
        {activeTab === 'home' ? (
          <motion.div
            key="home-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Hero Card Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="bg-gradient-to-br from-[#00c896] via-[#05bfa0] to-[#04aa8a] text-white p-7 sm:p-10 rounded-3xl shadow-md relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#0A0A0A]/10 blur-xl pointer-events-none" />
                <div className="absolute left-1/3 top-2 w-28 h-28 rounded-full bg-[#0A0A0A]/5 blur-lg pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl">
                  <span className="bg-[#0A0A0A]/20 border border-white/25 text-white text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full inline-block mb-3">
                    ConvoMag Operating System
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 font-sans md:leading-tight">
                    Every Issue Gets Its Own AI.
                  </h1>
                  <p className="text-white/95 text-xs sm:text-sm leading-relaxed max-w-xl">
                    Upload a PDF document. instantly publish an interactive flipbook that can answer questions, explain articles, summarize complex items, guide readers to pages, and hold voice conversations about the issue.
                  </p>
                </div>
              </div>
            </section>

            {/* Horizontal Filter Buttons Option Stand */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveFilterType('all')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeFilterType === 'all' 
                      ? 'bg-zinc-900 text-white' 
                      : 'bg-[#0A0A0A] text-zinc-600 hover:bg-[#1A1A1A]/5 border border-white/10/80 shadow-xs'
                  }`}
                >
                  All Stand
                </button>
                <button 
                  onClick={() => setActiveFilterType('magazine')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeFilterType === 'magazine' 
                      ? 'bg-[#00c896] text-white' 
                      : 'bg-[#0A0A0A] text-zinc-600 hover:bg-[#1A1A1A]/5 border border-white/10/80 shadow-xs'
                  }`}
                >
                  Magazines
                </button>
                <button 
                  onClick={() => setActiveFilterType('newspaper')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeFilterType === 'newspaper' 
                      ? 'bg-[#00c896] text-white' 
                      : 'bg-[#0A0A0A] text-zinc-600 hover:bg-[#1A1A1A]/5 border border-white/10/80 shadow-xs'
                  }`}
                >
                  Newspapers
                </button>
              </div>

              {/* Sliders Pill to toggle state */}
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-[#0A0A0A] text-zinc-300 hover:bg-[#1A1A1A]/5 border border-white/10/80 rounded-full text-xs font-bold shadow-xs transition-all"
              >
                <SlidersHorizontal size={13} className="text-[#00c896]" />
                <span>Filter</span>
                {activeCategory && <span className="h-2 w-2 rounded-full bg-[#00c896]" />}
              </button>
            </section>

            {/* SEARCH BOX WRAPPER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
              <div 
                className="relative cursor-pointer group"
                onClick={() => setIsSearchOpen(true)}
              >
                <div className="w-full p-4 pl-12 rounded-2xl text-xs bg-[#0A0A0A] border border-white/5 shadow-xs transition-all text-zinc-400 flex items-center group-hover:border-white/10">
                  Search across all publications, articles and reports...
                </div>
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#00c896]">
                  <Search size={16} />
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center gap-2 pointer-events-none">
                  <span className="hidden sm:inline text-[9px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded border border-white/5 tracking-widest uppercase">
                     Platform Search
                  </span>
                  <div className="h-5 w-5 bg-indigo-500/10 rounded flex items-center justify-center text-indigo-500">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced Filter Dropdown */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#0A0A0A] border border-white/10/60 rounded-2xl p-4 mt-2 shadow-md space-y-2"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#00c896] mb-1">
                      Show Options
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => { setSearch('AI'); setShowFilterDropdown(false); }}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-900/30 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-300 hover:bg-indigo-100"
                      >
                        <Sparkles size={11} className="fill-indigo-600 text-indigo-400" />
                        <span>Has Smart Companion</span>
                      </button>
                      <button 
                        onClick={() => { setSearch('Economist'); setShowFilterDropdown(false); }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-[#1A1A1A]/10 rounded-lg text-xs font-semibold text-zinc-600"
                      >
                        The Economist Issues
                      </button>
                      <button 
                        onClick={() => { setSearch('Harvest'); setShowFilterDropdown(false); }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-[#1A1A1A]/10 rounded-lg text-xs font-semibold text-zinc-600"
                      >
                        Harvest SA Agricultural
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Curated Category Strip */}
            {activeCategory && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3">
                <div className="inline-flex items-center bg-zinc-900 text-white rounded-full px-4 py-1.5 shadow-sm text-xs font-semibold">
                  <span>Stand Category: <strong className="text-[#00c896]">{activeCategory}</strong></span>
                  <button 
                    onClick={() => setActiveCategory(null)}
                    className="ml-3 text-white/50 hover:text-white p-0.5 rounded-full"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* AI DECISION COLLECTIONS RAIL (Curated automatically) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 bg-indigo-500 rounded-full" />
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-950 font-sans flex items-center gap-2">
                    <span>AI Collections</span>
                    <span className="bg-indigo-100 text-indigo-300 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-lg uppercase tracking-wide">Dynamic</span>
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { title: 'Trending This Week', sub: 'Most read issues', badge: '🔥 Hot', color: 'from-orange-500 to-amber-500', searchq: 'AI' },
                  { title: 'Agriculture Insights', sub: 'Harvest & Farms', badge: '🌽 Crops', color: 'from-[#00c896] to-emerald-600', searchq: 'Harvest' },
                  { title: 'Business Intelligence', sub: 'Financial reports', badge: '📊 Stock', color: 'from-blue-600 to-indigo-600', searchq: 'Business' },
                  { title: 'Most Discussed Issues', sub: 'AI assistant volume', badge: '💬 Chat', color: 'from-purple-500 to-pink-500', searchq: 'Economist' },
                  { title: 'Recommended For You', sub: 'Curations match', badge: '✨ Picks', color: 'from-rose-500 to-red-500', searchq: 'Vogue' }
                ].map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearch(col.searchq)}
                    className="p-4 bg-[#0A0A0A] rounded-2xl shadow-xs border border-white/10/50 hover:border-zinc-300 hover:shadow-md text-left transition relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 h-1 text-white bg-gradient-to-r w-full transition" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                    <span className="text-[9px] font-extrabold uppercase bg-white/5 border border-white/5 text-zinc-600 px-2 py-0.5 rounded-md inline-block mb-2">
                      {col.badge}
                    </span>
                    <h4 className="text-xs font-bold text-gray-100 leading-snug tracking-tight mb-1 group-hover:text-[#00c896] transition">
                      {col.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-medium">
                      {col.sub}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* FEATURED AI PUBLICATIONS SECTION */}
            {!search && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-9">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎙️</span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 font-sans flex items-center gap-2">
                        Featured AI Publications
                        <span className="bg-indigo-100 text-indigo-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Voice Enabled</span>
                      </h2>
                      <p className="text-[10px] text-zinc-400 font-medium">Publications where you can literally speak directly with the pages</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-300">
                  {allPublications.filter(p => ['mag_harvest_82', 'paper_wsj', 'mag_1', 'mag_rs'].includes(p.id)).map((pub) => (
                    <div 
                      key={`featured-${pub.id}`}
                      className="relative overflow-hidden group bg-gradient-to-br from-zinc-900 via-zinc-850 to-indigo-950 text-white rounded-3xl p-5 border border-zinc-800/80 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-5"
                    >
                      {/* Left: Beautiful floating glow cover */}
                      <div 
                        onClick={() => setSelectedPub(pub)}
                        className="w-full sm:w-[130px] aspect-[3/4.2] sm:aspect-auto rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.4)] relative bg-black shrink-0 cursor-pointer"
                      >
                        <img 
                          src={pub.coverUrl} 
                          alt={pub.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-104"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 bg-indigo-600/90 text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-indigo-400/20 shadow-md">
                          🧠 AI READY
                        </span>
                      </div>

                      {/* Right: Info and rich interactive micro button tools */}
                      <div className="flex flex-col justify-between flex-1">
                        <div className="cursor-pointer" onClick={() => setSelectedPub(pub)}>
                          <p className="text-[10px] uppercase tracking-widest text-[#00c896] font-black flex items-center justify-between">
                            <span>{pub.category || 'AI Spotlight'}</span>
                            <span className="text-zinc-400 font-medium flex items-center gap-1.5 normal-case tracking-normal"><Clock size={11}/> {pub.pageCount || 84} min read</span>
                          </p>
                          <h3 className="text-sm font-extrabold tracking-tight mt-1 mb-1.5 leading-snug group-hover:text-[#00c896] transition-colors line-clamp-2">
                            {pub.title}
                          </h3>
                          <p className="text-[11px] text-zinc-350 line-clamp-2 leading-relaxed font-sans mb-3">
                            {pub.summary || "Full knowledge indices synthesized on premium storage. Conversational AI voice layers mapped directly inside."}
                          </p>
                          
                          {/* Analyzed core questions block */}
                          <div className="hidden sm:block mt-1">
                            <span className="text-[8px] tracking-widest uppercase font-extrabold text-indigo-400 block mb-1">SAMPLE COMPANION QUERY:</span>
                            <div className="bg-zinc-850 text-[10px] italic text-zinc-200 p-2 rounded-lg border border-zinc-700/35 line-clamp-1">
                              "{pub.id === 'mag_harvest_82' ? 'Which maize hybrids performed best?' : pub.id === 'paper_wsj' ? 'What does this say about computational cluster scaling?' : 'Explain key monetary developments.'}"
                            </div>
                          </div>
                        </div>

                        {/* Interactive upgraded option shortcuts */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-800/60">
                          <button
                            onClick={() => navigate(`/reader?pub=${pub.id}&chat=true`)}
                            className="py-2 px-1 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            <span>🎙️</span>
                            <span>Talk AI</span>
                          </button>
                          <button
                            onClick={() => navigate(`/reader?pub=${pub.id}&tts=true`)}
                            className="py-2 px-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            <span>🎧</span>
                            <span>Listen</span>
                          </button>
                          <button
                            onClick={() => navigate(`/reader?pub=${pub.id}`)}
                            className="py-2 px-1 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 border border-zinc-700/60 transition-all cursor-pointer whitespace-nowrap"
                          >
                            <span>📖</span>
                            <span>Read</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CURATED TRENDING MAGAZINES STRIP */}
            {magazinesList.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-9">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 bg-[#00c896] rounded-full" />
                    <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-950 font-sans">
                      Trending Magazines
                    </h2>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveFilterType('magazine');
                      setActiveCategory(null);
                    }}
                    className="text-xs font-bold text-zinc-500 hover:text-[#00c896] transition"
                  >
                    See All
                  </button>
                </div>

                <div className="flex overflow-x-auto pb-4 space-x-4.5 px-1 -mx-4 sm:mx-0 scrollbar-none">
                  {magazinesList.map((mag) => (
                    <motion.div
                      key={mag.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPub(mag)}
                      className="min-w-[175px] max-w-[190px] shrink-0 group cursor-pointer bg-[#0A0A0A] p-3 rounded-2xl border border-white/10/55 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        {/* Visual Cover Layer with AI Ready badge */}
                        <div className="aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-white/5 border border-white/10/40 relative shadow-xs">
                          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/15 via-transparent to-transparent z-10 pointer-events-none" />
                          <img 
                            src={mag.coverUrl} 
                            alt={mag.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                          {mag.aiEnabled ? (
                            <div className="absolute bottom-2 inset-x-2 bg-indigo-600/95 text-white text-[8px] font-black py-1 px-1.5 rounded-lg shadow-md flex items-center justify-center space-x-1 uppercase tracking-wider z-20 border border-indigo-400/20">
                              <span>🧠 AI READY</span>
                            </div>
                          ) : (
                            <div className="absolute bottom-2 inset-x-2 bg-zinc-900/90 text-white text-[8px] font-black py-1 px-1.5 rounded-lg text-center uppercase tracking-wide z-20">
                              <span>📖 Flipbook</span>
                            </div>
                          )}
                        </div>

                        {/* Structured details */}
                        <div className="mt-2.5 px-0.5">
                          <h3 className="font-sans font-bold text-xs text-gray-100 line-clamp-2 leading-snug group-hover:text-[#00c896] transition duration-200 min-h-[32px]">
                            {mag.title}
                          </h3>
                          <div className="text-[9px] text-zinc-500 font-medium mt-1.5 flex items-center justify-between">
                            <span>{mag.date || "Just now"}</span>
                            <span className="flex items-center gap-1"><Clock size={10} /> {mag.pageCount || 84} min read</span>
                          </div>
                        </div>
                      </div>

                      {/* Direct Navigation Shortcuts */}
                      <div className="mt-3.5 pt-2.5 border-t border-white/5 space-y-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/reader?pub=${mag.id}&chat=true`);
                            }}
                            className="py-1 px-1.5 bg-indigo-900/30 hover:bg-indigo-100 text-indigo-300 font-bold active:scale-95 text-[9px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            title="Conversational AI Chat"
                          >
                            <span>🧠 Ask</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/reader?pub=${mag.id}&tts=true`);
                            }}
                            className="py-1 px-1.5 bg-emerald-900/30 hover:bg-emerald-100 text-emerald-700 font-bold active:scale-95 text-[9px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            title="Listen to Narrator"
                          >
                            <span>🎧 Listen</span>
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/reader?pub=${mag.id}`);
                          }}
                          className="w-full py-1 bg-white/5 hover:bg-[#1A1A1A]/10 text-zinc-300 font-extrabold active:scale-95 text-[9px] rounded-lg border border-white/10/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>📖 Read Issue</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* CURATED NEWSPAPERS STRIP */}
            {newspapersList.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-9">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 bg-[#00c896] rounded-full" />
                    <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-950 font-sans">
                      Newspapers
                    </h2>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveFilterType('newspaper');
                      setActiveCategory(null);
                    }}
                    className="text-xs font-bold text-zinc-500 hover:text-[#00c896] transition"
                  >
                    See All
                  </button>
                </div>

                <div className="flex overflow-x-auto pb-4 space-x-4.5 px-1 -mx-4 sm:mx-0 scrollbar-none">
                  {newspapersList.map((paper) => (
                    <motion.div
                      key={paper.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPub(paper)}
                      className="min-w-[175px] max-w-[190px] shrink-0 group cursor-pointer bg-[#0A0A0A] p-3 rounded-2xl border border-white/10/55 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover image frame */}
                        <div className="aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-white/5 border border-white/10/40 relative shadow-xs">
                          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/15 via-transparent to-transparent z-10 pointer-events-none" />
                          <img 
                            src={paper.coverUrl} 
                            alt={paper.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                          {paper.aiEnabled ? (
                            <div className="absolute bottom-2 inset-x-2 bg-indigo-600/95 text-white text-[8px] font-black py-1 px-1.5 rounded-lg shadow-md flex items-center justify-center space-x-1 uppercase tracking-wider z-20 border border-indigo-400/20">
                              <span>🧠 AI READY</span>
                            </div>
                          ) : (
                            <div className="absolute bottom-2 inset-x-2 bg-zinc-900/90 text-white text-[8px] font-black py-1 px-2 rounded-lg text-center uppercase tracking-wide z-20">
                              <span>📖 Flipbook</span>
                            </div>
                          )}
                        </div>

                        {/* Details specs */}
                        <div className="mt-2.5 px-0.5">
                          <h3 className="font-sans font-bold text-xs text-gray-100 line-clamp-2 leading-snug group-hover:text-[#00c896] transition duration-200 min-h-[32px]">
                            {paper.title}
                          </h3>
                          <div className="text-[9px] text-zinc-500 font-medium mt-1.5 flex items-center justify-between">
                            <span>{paper.date || "Just now"}</span>
                            <span className="flex items-center gap-1"><Clock size={10} /> {paper.pageCount || 84} min read</span>
                          </div>
                        </div>
                      </div>

                      {/* Direct Navigation Shortcuts */}
                      <div className="mt-3.5 pt-2.5 border-t border-white/5 space-y-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/reader?pub=${paper.id}&chat=true`);
                            }}
                            className="py-1 px-1.5 bg-indigo-900/30 hover:bg-indigo-100 text-indigo-300 font-bold active:scale-95 text-[9px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            title="Conversational AI Chat"
                          >
                            <span>🧠 Ask</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/reader?pub=${paper.id}&tts=true`);
                            }}
                            className="py-1 px-1.5 bg-emerald-900/30 hover:bg-emerald-100 text-emerald-700 font-bold active:scale-95 text-[9px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            title="Listen to Narrator"
                          >
                            <span>🎧 Listen</span>
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/reader?pub=${paper.id}`);
                          }}
                          className="w-full py-1 bg-white/5 hover:bg-[#1A1A1A]/10 text-zinc-300 font-extrabold active:scale-95 text-[9px] rounded-lg border border-white/10/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>📖 Read Issue</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* CATEGORIES GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
              <div className="flex justify-between items-center mb-5 pb-2 border-b border-white/10/40">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-100 font-sans">
                  Categories
                </h2>
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest font-mono">
                  Stand Select
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((cat, idx) => {
                  const isActive = activeCategory === cat.name;

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveCategory(isActive ? null : cat.name);
                      }}
                      className={`p-5 rounded-2xl cursor-pointer text-center transition shadow-xs border flex flex-col items-center justify-center ${
                        isActive 
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm' 
                          : 'bg-[#0A0A0A] border-zinc-250/50 hover:bg-[#1A1A1A]/5 text-zinc-200'
                      }`}
                    >
                      <div className="text-3xl mb-2.5">
                        {cat.icon}
                      </div>
                      
                      <h4 className="text-xs font-bold tracking-tight">
                        {cat.name}
                      </h4>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Pro Companion Highlights Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16">
              <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10/50 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="max-w-2xl">
                  <h3 className="text-xs font-extrabold uppercase text-[#00c896] tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} className="fill-[#00c896] text-[#00c896]" />
                    <span>ConvoMag Multi-turn Synthesis</span>
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Select any issue in the stand with <strong>AI READY</strong> enabled. Click <strong>Ask AI</strong> to trigger live content scanning powered by Gemini. You can fetch specific fact listings without loading large file formats.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className="px-3 py-1 bg-indigo-900/30 text-indigo-300 font-bold border border-indigo-500/20 rounded-md text-[10px] uppercase font-mono">Offline RAG Ready</span>
                  <span className="px-3 py-1 bg-emerald-900/30 text-[#00c896] font-bold border border-emerald-100 rounded-md text-[10px] uppercase font-mono">PWA Cached</span>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          /* LIBRARY TAB (OFFLINE BOOKSHELF) */
          <motion.div
            key="library-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 pt-6"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-7 sm:p-10 rounded-3xl shadow-md relative overflow-hidden mb-8">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <span className="bg-indigo-500/20 border border-indigo-450 text-indigo-300 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full inline-block mb-3">
                  Local Device Bookshelf
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 font-sans md:leading-tight flex items-center gap-2">
                  <span>Your Offline Shelf</span>
                </h1>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  These publications are completely downloaded and cached via Service Workers in your private sandbox. You can read, listen and scan information without active internet connections.
                </p>
              </div>
            </div>

            {/* Offline Shelf Streams */}
            <div className="mb-6 flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
                <span>Currently Cached Issues ({offlineMags.length})</span>
              </h3>
              <button 
                onClick={() => setIsCacheManagerOpen(true)}
                className="text-[10px] font-bold text-zinc-500 hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer"
              >
                <Settings size={11} className="hover:rotate-45 transition-transform duration-300" />
                <span>Audit & Manage Cache</span>
              </button>
            </div>

            {offlineMags.length === 0 ? (
              <div className="p-12 text-center bg-[#0A0A0A] rounded-3xl border border-white/10/60 shadow-xs max-w-lg mx-auto my-12">
                <div className="inline-flex p-4 rounded-full bg-slate-50 text-zinc-400 mb-4 animate-bounce">
                  <BookOpen size={32} />
                </div>
                <h3 className="font-sans font-bold text-gray-100 text-sm mb-1">Your bookshelf is empty</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-6">
                  Browse our Premium Catalog, choose any publication from the stand list, and mark them as offline-ready to create your personal digital library.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition"
                >
                  Explore Curated Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4.5 mb-16">
                {premiumPublications.filter(p => offlineMags.includes(p.id)).map((pub) => {
                  return (
                    <motion.div
                      key={pub.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedPub(pub)}
                      className="group bg-[#0A0A0A] p-3.5 rounded-2xl border border-white/10/70 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover aspect and badge */}
                        <div className="aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-white/5 border border-white/10/20 relative shadow-sm">
                          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-transparent to-transparent z-10 pointer-events-none" />
                          <img 
                            src={pub.coverUrl} 
                            alt={pub.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform group-hover:scale-103"
                          />
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white font-black text-[8px] px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider z-20 flex items-center gap-1">
                            <span>ONLINE 💾</span>
                          </div>
                        </div>

                        {/* Text and stats */}
                        <div className="mt-3 px-0.5">
                          <h4 className="font-sans font-bold text-xs text-gray-100 line-clamp-2 leading-snug group-hover:text-indigo-400 transition">
                            {pub.title}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{pub.date || "Just now"}</p>
                            <span className="text-[9px] text-zinc-400 font-medium flex items-center gap-1"><Clock size={10} /> {pub.pageCount || 84} min</span>
                          </div>

                          <div className="mt-2.5 space-y-1 pt-2 border-t border-white/5">
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-900/30 px-2 py-0.5 rounded-md inline-block">
                              Offline Available
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PUBLICATION DETAILS DRAWER / OVERLAY MODAL ("The screen I would build next") */}
      <AnimatePresence>
        {selectedPub && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPub(null)}
              className="fixed inset-0 bg-black/60 z-[300] pointer-events-auto"
            />

            {/* Overlapping Pre-reading dialog card container */}
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] md:max-h-[90vh] bg-[#0A0A0A] rounded-t-[32px] box-shadow-2xl z-[350] border-t border-white/10 pointer-events-auto flex flex-col overflow-y-auto pb-8 custom-scrollbar"
            >
              {/* Internal layout block */}
              <div className="max-w-4xl mx-auto w-full p-6 sm:p-10 relative">
                
                {/* Drag Handle representation to feel highly fluid and mobile */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-1.5 bg-zinc-200 rounded-full" />
                </div>

                <button
                  onClick={() => setSelectedPub(null)}
                  className="absolute top-4 sm:top-8 right-4 sm:right-8 p-2.5 bg-white/10 text-zinc-500 hover:text-zinc-200 rounded-full transition-colors cursor-pointer"
                  title="Close presentation"
                >
                  <X size={18} />
                </button>

                {/* Main grid columns */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                  
                  {/* Left Column: Premium Cover & spec cards */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="aspect-[3/4.2] w-full max-w-[260px] rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 relative">
                      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/15 via-transparent to-transparent z-10 pointer-events-none" />
                      <img 
                        src={selectedPub.coverUrl} 
                        alt={selectedPub.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {selectedPub.aiEnabled && (
                        <div className="absolute top-3.5 right-3.5 bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest shadow-md z-20">
                          AI ASSISTED 🤖
                        </div>
                      )}
                    </div>

                    {/* Quick spec indicators */}
                    <div className="grid grid-cols-3 gap-2 w-full max-w-[260px] mt-4">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10/50 text-center">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">Pages</span>
                        <strong className="text-xs text-zinc-850 font-sans">{selectedPub.pageCount || 84}</strong>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10/50 text-center">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">AI DB</span>
                        <strong className="text-xs text-indigo-650 text-indigo-400 font-sans">Active 🤖</strong>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10/50 text-center">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">Audio</span>
                        <strong className="text-xs text-emerald-650 text-emerald-600 font-sans">TTS 🎧</strong>
                      </div>
                    </div>

                    {/* Offline toggle control */}
                    <button
                      onClick={() => toggleOfflineDownload(selectedPub.id)}
                      className={`w-full max-w-[260px] py-2 px-3.5 mt-4 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        offlineMags.includes(selectedPub.id)
                          ? 'bg-emerald-900/30 text-emerald-700 border-emerald-250/50 hover:bg-emerald-100'
                          : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-[#1A1A1A]/10'
                      }`}
                    >
                      <span>💾</span>
                      <span>{offlineMags.includes(selectedPub.id) ? "Saved in Digital Library Shelf" : "Save Offline to Bookshelf"}</span>
                    </button>
                  </div>

                  {/* Right Column: Descriptions, Summary, Chapters, Ask Companion Inline Panel */}
                  <div className="md:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Publication metadata header */}
                      <span className="px-3 py-1 bg-[#00c896]/10 text-[#00c896] border border-[#00c896]/15 text-[10px] uppercase tracking-widest font-black rounded-full inline-block mb-3">
                        {selectedPub.category || 'General'}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-100 tracking-tight leading-snug">
                        {selectedPub.title}
                      </h2>
                      <p className="text-xs font-medium text-zinc-450 mt-1">
                        Published by <span className="font-bold text-zinc-600">{selectedPub.publisher}</span> • {selectedPub.date}
                      </p>

                      {/* Summary text */}
                      <div className="mt-5">
                        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#00c896] mb-1 px-1">
                          Publication Summary
                        </h4>
                        <p className="p-4 bg-[#F5F6F8] border border-zinc-250/20 text-xs text-zinc-300 rounded-xl leading-relaxed whitespace-pre-line italic">
                          "{selectedPub.summary || "This digital edition is scanned and optimized for ConvoMag smart dialogues. Interact directly to fetch summaries of specific columns, tables or advertiser layouts."}"
                        </p>
                      </div>

                      {/* Topics badge lists */}
                      {selectedPub.topics && (
                        <div className="mt-4.5">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2 px-1">
                            Analyzed Topics & Keywords
                          </h4>
                          <div className="flex flex-wrap gap-1.5 pl-1">
                            {selectedPub.topics.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-zinc-600 hover:bg-[#1A1A1A]/10 transition text-[10px] uppercase font-bold tracking-wider font-mono cursor-pointer"
                                onClick={() => setSearch(tag)}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Featured chapters index */}
                      {selectedPub.featuredArticles && selectedPub.featuredArticles.length > 0 && (
                        <div className="mt-5">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2 px-1">
                            Featured Articles Indextree
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
                            {selectedPub.featuredArticles.map((art, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => navigate(`/reader?pub=${selectedPub.id}&page=${art.page - 1}`)}
                                className="p-2.5 bg-[#0A0A0A] border border-white/10 hover:border-[#00c896] hover:bg-[#1A1A1A]/5 font-sans rounded-xl text-[11px] font-bold text-zinc-200 text-left transition flex items-center justify-between group cursor-pointer"
                              >
                                <span className="line-clamp-1 flex-1 group-hover:text-[#00c896]">{art.title}</span>
                                <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-md text-zinc-400 ml-2 group-hover:text-[#00c896] group-hover:bg-[#00c896]/5 shrink-0">Page {art.page}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pre-reading Upgraded Matrix Options and Key Topics */}
                    <div className="mt-8 border-t border-white/5 pt-6">
                      <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#00c896] mb-3 px-1">
                        Select Conversational Reader Action
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        <button
                          onClick={() => navigate(`/reader?pub=${selectedPub.id}`)}
                          className="p-4 bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl text-left transition relative overflow-hidden group shadow-sm cursor-pointer"
                        >
                          <div className="font-sans font-extrabold text-xs flex items-center gap-2">
                            <span>📖</span> Read Flipbook
                          </div>
                          <p className="text-[10px] text-zinc-300 mt-1 leading-relaxed font-sans">
                            Open full crisp digital layout with real mechanical page flip sounds.
                          </p>
                        </button>

                        <button
                          disabled={!selectedPub.aiEnabled}
                          onClick={() => navigate(`/reader?pub=${selectedPub.id}&chat=true`)}
                          className={`p-4 rounded-2xl text-left transition relative overflow-hidden group shadow-sm cursor-pointer ${
                            selectedPub.aiEnabled
                              ? "bg-indigo-600 text-white hover:bg-indigo-750"
                              : "bg-white/10 text-zinc-400 border border-white/10 cursor-not-allowed"
                          }`}
                        >
                          <div className="font-sans font-extrabold text-xs flex items-center gap-2">
                            <span>🎙️</span> Talk To This Issue
                          </div>
                          <p className={`text-[10px] mt-1 leading-relaxed font-sans ${selectedPub.aiEnabled ? 'text-indigo-100' : 'text-zinc-400'}`}>
                            {selectedPub.aiEnabled 
                              ? "Initiate a speech dialogue or message the publication pages directly."
                              : "AI companion is not configured for this issue."}
                          </p>
                        </button>

                        <button
                          onClick={() => navigate(`/reader?pub=${selectedPub.id}&tts=true`)}
                          className="p-4 bg-emerald-900/30 text-emerald-95 border border-emerald-150 rounded-2xl text-left transition hover:bg-emerald-100 shadow-xs cursor-pointer"
                        >
                          <div className="font-sans font-extrabold text-xs flex items-center gap-2">
                            <span>🎧</span> Listen to Summary
                          </div>
                          <p className="text-[10px] text-emerald-700 mt-1 leading-relaxed font-sans">
                            Narrate the compiled summary with high-fidelity voice.
                          </p>
                        </button>

                        <button
                          onClick={() => navigate(`/reader?pub=${selectedPub.id}&search=true`)}
                          className="p-4 bg-[#0A0A0A] border border-white/10 text-zinc-850 hover:bg-[#1A1A1A]/5 rounded-2xl text-left transition hover:border-[#00c896] shadow-xs cursor-pointer"
                        >
                          <div className="font-sans font-extrabold text-xs flex items-center gap-2">
                            <span>🔍</span> Search Inside
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed font-sans">
                            Perform keyword and OCR searches across the issue.
                          </p>
                        </button>
                      </div>

                      {/* Key Topics Mapping Section */}
                      <div className="p-4 bg-amber-900/30 border border-amber-100/50 rounded-2xl mb-4 text-left">
                        <div className="font-sans font-extrabold text-xs text-amber-900 flex items-center gap-2 mb-1.5 font-sans">
                          <span>🔑</span> Key Topics Mapping
                        </div>
                        <p className="text-[10px] text-amber-850 leading-normal font-sans">
                          ConvoMag AI has index-mapped specific sections:{" "}
                          <strong>
                            {selectedPub.topics ? selectedPub.topics.slice(0, 3).join(", ") : "Structure indices"}
                          </strong>
                          . Ask questions in the custom live companion below to jump to pages automatically.
                        </p>
                      </div>

                      {/* QUICK ASK DYNAMIC COMPANION FORM */}
                      {selectedPub.aiEnabled && (
                        <div className="mt-5 bg-indigo-900/30/50 border border-indigo-200/30 p-4 rounded-2xl">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 mb-2 flex items-center gap-1.5">
                            <Sparkles size={11} className="fill-indigo-600 text-indigo-400" />
                            <span>Quick Ask Companion Panel</span>
                          </h4>
                          
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (askQuery.trim()) {
                                navigate(`/reader?pub=${selectedPub.id}&chat=true&ask=${encodeURIComponent(askQuery)}`);
                              }
                            }}
                            className="flex gap-2.5 items-center mt-1"
                          >
                            <input
                              id="details-conversational-ask-input"
                              type="text"
                              required
                              value={askQuery}
                              onChange={(e) => setAskQuery(e.target.value)}
                              placeholder="What would you like to know about this issue?"
                              className="flex-1 px-4 py-2.5 bg-[#0A0A0A] border border-white/10 rounded-xl text-[11px] text-zinc-200 placeholder-zinc-400 font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              disabled={!askQuery.trim()}
                              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                            >
                              <span>Ask AI</span>
                              <Send size={10} />
                            </button>
                          </form>

                          {/* Chips triggers */}
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {(selectedPub.id === 'mag_harvest_82' ? [
                              'Summarize maize pricing shifts',
                              'Twin rotor machinery innovations',
                              'Crops moisture outlook'
                            ] : [
                              'Highlights of this publication',
                              'Major topics described list',
                              'Explain data and facts'
                            ]).map((chipText) => (
                              <button
                                key={chipText}
                                type="button"
                                onClick={() => setAskQuery(chipText)}
                                className="px-2 py-0.5 bg-[#0A0A0A] hover:bg-indigo-100 text-zinc-600 hover:text-indigo-800 transition rounded-md border border-white/5-50 text-[9px] font-medium"
                              >
                                {chipText}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
      
      {isSearchOpen && (
        <GlobalSearchOverlay 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      )}
    </div>
  );
}
