import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Check, ExternalLink } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('convomag_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async (type: 'all' | 'necessary') => {
    localStorage.setItem('convomag_cookie_consent', type);
    
    // Optionally log consent to server for compliance audit
    try {
      await fetch('/api/compliance/consent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('convomag_token')}`
        },
        body: JSON.stringify({ 
          consentType: `cookies_${type}`,
          version: '2026.1.0'
        })
      });
    } catch (e) { /* silent fail for guests */ }
    
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-[100] w-full max-w-md px-4"
        >
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
             <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
                   <Shield size={20} />
                </div>
                <div>
                   <h4 className="text-white font-bold text-sm mb-1">Privacy & Personalization</h4>
                   <p className="text-zinc-500 text-xs leading-relaxed">
                     We use cookies and AI interaction logs to improve your conversational reading experience. By continuing, you agree to our <a href="/privacy" className="text-white hover:underline">Privacy Policy</a> and POPIA compliance terms.
                   </p>
                </div>
             </div>

             <div className="flex gap-3">
                <button 
                  onClick={() => handleAccept('all')}
                  className="flex-1 bg-white text-black py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={14} /> Accept All
                </button>
                <button 
                  onClick={() => handleAccept('necessary')}
                  className="flex-1 bg-white/5 text-white border border-white/10 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                >
                  Necessary Only
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
