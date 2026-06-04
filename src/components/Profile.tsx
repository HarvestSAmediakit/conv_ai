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

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20 relative">
      {/* Background Dots Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header */}
      <header className="relative z-10 bg-white border-b border-zinc-100 flex items-center px-4 py-3">
        <button 
          onClick={() => navigate(-1)}
          className="text-zinc-600 hover:text-zinc-900 transition-colors p-2 -ml-2"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-zinc-800 ml-2">Profile</h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-6 max-w-md mx-auto sm:max-w-3xl">
        {/* User Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 mb-6 flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-[#00c896]/10 rounded-full flex items-center justify-center text-[#00c896]">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Reader Account</h2>
            <p className="text-zinc-500 text-sm">reader@convomag.com</p>
          </div>
        </motion.div>

        {/* Settings Links */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"
        >
          <div className="flex flex-col">
            <button className="flex items-center justify-between p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors text-left w-full">
              <div className="flex items-center gap-3 text-zinc-700">
                <Settings size={20} className="text-zinc-400" />
                <span className="font-medium">Account Settings</span>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </button>
            
            <button className="flex items-center justify-between p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors text-left w-full">
              <div className="flex items-center gap-3 text-zinc-700">
                <Bell size={20} className="text-zinc-400" />
                <span className="font-medium">Notifications</span>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </button>
            
            <button className="flex items-center justify-between p-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors text-left w-full">
              <div className="flex items-center gap-3 text-zinc-700">
                <CreditCard size={20} className="text-zinc-400" />
                <span className="font-medium">Subscription & Billing</span>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </button>
            
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left w-full"
            >
              <div className="flex items-center gap-3 text-red-600">
                <LogOut size={20} />
                <span className="font-medium">Log Out</span>
              </div>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-3 flex items-center justify-between z-50 pb-[max(env(safe-area-inset-bottom),12px)]">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-zinc-600 transition-colors">
          <BookOpen strokeWidth={2.5} size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => navigate('/publish')} className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-zinc-600 transition-colors">
          <Bookmark size={24} />
          <span className="text-[10px] font-medium">Library</span>
        </button>
        <button onClick={() => navigate('/publish')} className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-zinc-600 transition-colors">
          <LayoutGrid size={24} />
          <span className="text-[10px] font-medium">Create</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-[#00c896]">
          <User size={24} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
}
