import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  X, 
  Share, 
  PlusSquare, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  Sparkles, 
  Wifi, 
  ArrowRight,
  Monitor,
  Check,
  Chrome,
  AlertCircle
} from 'lucide-react';

interface PWAInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
  floatingBannerOnly?: boolean;
}

export default function PWAInstallPrompt({ isOpen, onClose, floatingBannerOnly = false }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'other'>('desktop');
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  useEffect(() => {
    // 1. Detect if already running in standalone mode (installed)
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone === true;

    if (isInStandaloneMode()) {
      setIsInstalled(true);
    }

    // 2. Platform user-agent diagnostics
    const detectPlatform = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroid = /android/.test(ua);
      
      if (isIOS) return 'ios';
      if (isAndroid) return 'android';
      return 'desktop';
    };
    setPlatform(detectPlatform());

    // 3. Capture native 'beforeinstallprompt' event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('⭐️ Capture beforeinstallprompt event trigger successfully!');
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Capture 'appinstalled' event
    const handleAppInstalled = () => {
      console.log('🎉 Application installed successfully into user system!');
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerNativeInstall = async () => {
    if (!deferredPrompt) {
      console.warn('Native installer prompt not captured. Engaging visual instructions modal fallback.');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User installation choice outcome: ${outcome}`);
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('PWA install prompt exception error: ', err);
    }
  };

  if (isInstalled && !installSuccess) {
    return null; // Don't show anything structure if already installed
  }

  // Visual walkthrough logic depending on platform
  const renderInstructions = () => {
    switch (platform) {
      case 'ios':
        return (
          <div className="space-y-4">
            <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed">
              Apple Safari does not support automated install triggers yet. Setup your native magazine bookshelf manually in under 10 seconds:
            </p>
            <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4.5 space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5 flex-wrap">
                    Tap the native share button <Share size={15} className="text-zinc-650 inline-block" /> in Safari's utility drawer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-zinc-200/60 pt-3.5">
                <span className="bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">
                    Scroll down and select <span className="underline decoration-indigo-500 underline-offset-2">"Add to Home Screen"</span> option.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-zinc-200/60 pt-3.5">
                <span className="bg-[#00c896]/10 text-[#00c896] text-xs font-bold rounded-lg h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5 flex-wrap">
                    Click <span className="font-extrabold text-[#00c896]">Add</span> <PlusSquare size={14} className="text-[#00c896] inline-block" /> in the top right. Enjoy premium offline loading!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'android':
        return (
          <div className="space-y-4">
            <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed">
              Google Chrome offers seamless direct installation. Hit the button below or use Chrome's custom system menu:
            </p>
            {deferredPrompt ? (
              <button
                onClick={triggerNativeInstall}
                className="w-full bg-[#00c896] hover:bg-[#00af83] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>Install ConvoMag App</span>
              </button>
            ) : (
              <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4.5 space-y-3.5">
                <div className="flex items-start gap-3">
                  <span className="bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1">
                      Tap the Chrome menu <span className="font-extrabold">⋮</span> icon at the top right of your browser interface.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-t border-zinc-200/60 pt-3.5">
                  <span className="bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">
                      Tap <span className="underline decoration-indigo-500 underline-offset-2">"Install app"</span> or <span className="underline decoration-indigo-500 underline-offset-2">"Add to Home screen"</span> option.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'desktop':
      default:
        return (
          <div className="space-y-4">
            <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed">
              Install ConvoMag on your desktop block directly. Dock it to your macOS Dock or Windows Taskbar for instantaneous cold starts.
            </p>
            
            {deferredPrompt ? (
              <button
                onClick={triggerNativeInstall}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 "
              >
                <Download size={14} />
                <span>Install Native Desktop App</span>
              </button>
            ) : (
              <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 space-y-3.5">
                <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-2 mb-1">
                  <Chrome size={14} className="text-amber-500 shrink-0" />
                  <span>How to install in Google Chrome / Brave Browser:</span>
                </p>
                <div className="flex items-start gap-3">
                  <span className="bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p className="text-xs text-zinc-800 font-medium leading-tight">
                    Look at your browser’s URL bar in the top-right. Click the small <strong className="bg-zinc-100 px-1 rounded">App Install (Laptop & Arrow)</strong> icon.
                  </p>
                </div>
                <div className="flex items-start gap-3 border-t border-zinc-200/60 pt-3">
                  <span className="bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-xs text-zinc-800 font-medium leading-tight font-sans">
                    Confirm prompt and enjoy fullscreen, hardware-accelerated layouts, and offline companion caching.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          {/* Main Dialog Panel */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[450px] bg-white rounded-3xl shadow-2xl border border-zinc-150 overflow-hidden flex flex-col p-6 sm:p-8"
          >
            {/* Success screen overlay */}
            {installSuccess ? (
              <div className="text-center py-8 space-y-5 animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto h-16 w-16 bg-[#00c896]/10 text-[#00c896] rounded-2xl flex items-center justify-center shadow-xs">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Successfully Installed!</h3>
                  <p className="text-xs text-zinc-500 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                    ConvoMag AI resides securely on your Home Screen. You can now launch and view digital magazines even with zero network coverage.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Great, thanks!
                </button>
              </div>
            ) : (
              <>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors duration-200 cursor-pointer"
                  title="Dismiss setup guide"
                >
                  <X size={16} />
                </button>

                {/* Header info */}
                <div className="flex gap-4 items-start pb-5 border-b border-zinc-100">
                  <div className="h-12 w-12 bg-emerald-50 text-[#00c896] rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                    <Smartphone className="animate-bounce" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#00c896] bg-[#00c896]/10 px-2 py-0.5 rounded-full">
                        Offline Ready
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Secure Sandbox
                      </span>
                    </div>
                    <h3 className="font-sans font-black text-zinc-950 text-base mt-2">
                      Get ConvoMag App
                    </h3>
                  </div>
                </div>

                {/* Benefits section */}
                <div className="grid grid-cols-2 gap-3.5 my-5">
                  <div className="p-3 bg-zinc-50/70 border border-zinc-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[#00c896]">
                      <Wifi size={13} />
                      <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Fast Offline</span>
                    </div>
                    <p className="text-[9.5px] text-zinc-500 leading-tight">
                      Browse and read cached flipbooks instantly with no web latencies.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50/70 border border-zinc-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-600">
                      <Sparkles size={13} fill="currentColor" />
                      <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Companion Chat</span>
                    </div>
                    <p className="text-[9.5px] text-zinc-500 leading-tight">
                      Access cached smart companion AI scans of all offline publications.
                    </p>
                  </div>
                </div>

                {/* Platforms/Platform Instructions instructions content */}
                <div className="flex-1 mt-1 mb-3.5">
                  {renderInstructions()}
                </div>

                {/* Help Footer */}
                <div className="text-[10px] text-zinc-400 font-medium text-center border-t border-zinc-100 pt-4 flex items-center justify-center gap-1 flex-wrap">
                  <span>Running into issues? Pin it manually on your device menu web app builder.</span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
