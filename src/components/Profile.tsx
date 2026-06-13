import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  ChevronLeft,
  User,
  BookOpen,
  Bookmark,
  LayoutGrid,
  Settings,
  Bell,
  CreditCard,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('convomag_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('convomag_token');
    localStorage.removeItem('convomag_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans pb-20 relative">
      {/* Background Dots Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header */}
      <header className="relative z-10 bg-[#0A0A0A] border-b border-white/5 flex items-center px-4 py-3">
        <button 
          onClick={() => navigate(-1)}
          className="text-zinc-600 hover:text-gray-100 transition-colors p-2 -ml-2"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-zinc-200 ml-2">Profile</h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-6 max-w-md mx-auto sm:max-w-3xl">
        {/* User Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0A] rounded-2xl p-6 shadow-sm border border-white/10 mb-6 flex items-center gap-4 animate-fade-in"
        >
          <div className="w-16 h-16 bg-[#00c896]/10 rounded-full flex items-center justify-center text-[#00c896]">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">{user?.name || 'Guest Reader'}</h2>
            <p className="text-zinc-500 text-sm">{user?.email || 'Anonymous session'}</p>
          </div>
        </motion.div>

        {/* Settings Links */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] rounded-2xl shadow-sm border border-white/10 overflow-hidden"
        >
          <div className="flex flex-col">
            <button className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-[#1A1A1A]/5 transition-colors text-left w-full">
              <div className="flex items-center gap-3 text-zinc-300">
                <Settings size={20} className="text-zinc-400" />
                <span className="font-medium">Account Settings</span>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </button>
            
            <button className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-[#1A1A1A]/5 transition-colors text-left w-full">
              <div className="flex items-center gap-3 text-zinc-300">
                <Bell size={20} className="text-zinc-400" />
                <span className="font-medium">Notifications</span>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </button>
            
            <button 
              onClick={() => navigate('/billing')}
              className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-[#1A1A1A]/5 transition-colors text-left w-full"
            >
              <div className="flex items-center gap-3 text-zinc-300">
                <CreditCard size={20} className="text-zinc-400" />
                <span className="font-medium">Subscription & Billing</span>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </button>
            
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center justify-between p-4 hover:bg-red-950/20 transition-colors text-left w-full border-t border-white/5"
              >
                <div className="flex items-center gap-3 text-red-500">
                  <LogOut size={20} />
                  <span className="font-medium">Log Out</span>
                </div>
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center justify-between p-4 hover:bg-emerald-950/20 transition-colors text-left w-full border-t border-white/5"
              >
                <div className="flex items-center gap-3 text-emerald-400">
                  <LogOut size={20} className="rotate-180" />
                  <span className="font-medium">Sign In to Dashboard</span>
                </div>
              </button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
