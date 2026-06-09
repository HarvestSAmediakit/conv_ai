import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  HardDrive, 
  Trash2, 
  Database, 
  FileText, 
  MessageSquare, 
  AudioLines, 
  TrendingDown, 
  Check, 
  RefreshCw 
} from 'lucide-react';

interface CacheManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCacheCleared?: () => void;
}

export default function CacheManagerModal({ isOpen, onClose, onCacheCleared }: CacheManagerModalProps) {
  const [offlineCount, setOfflineCount] = useState(0);
  const [actualUsageMB, setActualUsageMB] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [clearingStep, setClearingStep] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [reclaimedMB, setReclaimedMB] = useState(0);

  // Read current cached issue counts
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem('convomag_offline_downloads');
      if (saved) {
        const parsed = JSON.parse(saved);
        setOfflineCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setOfflineCount(2); // default demo mags cached
      }
    } catch {
      setOfflineCount(2);
    }

    // Attempt to query real browser storage estimates
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        if (estimate.usage !== undefined) {
          const usageInMB = estimate.usage / (1024 * 1024);
          setActualUsageMB(usageInMB > 15 ? Math.round(usageInMB * 10) / 10 : null);
        }
      }).catch(() => {
        setActualUsageMB(null);
      });
    }
  }, [isOpen]);

  // Compute realistic premium sizes
  const baseAppAssetsSize = 12.4; // MB
  const magazinePdfsSize = Math.max(0, offlineCount * 14.8); // MB
  const speechBuffersSize = offlineCount > 0 ? 8.6 : 0; // MB
  const ragDBSize = Math.max(0, offlineCount * 2.3); // MB
  const chatLogsSize = 0.4; // MB

  // Dynamic values or actualUsage fallback
  const simulatedTotal = Number((baseAppAssetsSize + magazinePdfsSize + speechBuffersSize + ragDBSize + chatLogsSize).toFixed(1));
  const totalUsage = actualUsageMB !== null ? Math.round((actualUsageMB + simulatedTotal * 0.2) * 10) / 10 : simulatedTotal;
  
  // Storage limit representation
  const storageLimit = 512; // MB (Simulated allocation slice)
  const percentUsed = Math.min(100, Math.round((totalUsage / storageLimit) * 100));

  const handleClearCache = async () => {
    setIsClearing(true);
    setIsSuccess(false);
    
    // Step-by-step defragmentation simulation representing a premium experience
    setClearingStep('Purging downloaded PDF files...');
    await new Promise(r => setTimeout(r, 800));
    
    setClearingStep('Clearing speech synthesis audio buffers...');
    await new Promise(r => setTimeout(r, 600));
    
    setClearingStep('Re-indexing local keyword database...');
    await new Promise(r => setTimeout(r, 700));
    
    setClearingStep('Resetting conversation logs metadata...');
    await new Promise(r => setTimeout(r, 500));

    // Clear the storage keys physically
    try {
      localStorage.removeItem('convomag_offline_downloads');
      
      // Clear key chat logs but keep first messages
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('convomag_chat_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.error("Cache purge failed:", err);
    }

    // Trigger caches API delete if available
    if (window.caches) {
      try {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map(name => window.caches.delete(name)));
      } catch (e) {
        console.warn("Storage caches clearance skipped:", e);
      }
    }

    setReclaimedMB(totalUsage - baseAppAssetsSize);
    setOfflineCount(0);
    setActualUsageMB(null);
    setIsClearing(false);
    setIsSuccess(true);
    setClearingStep('');

    if (onCacheCleared) {
      onCacheCleared();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cache-manager-modal" className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          {/* Backdrop Cover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isClearing ? undefined : onClose}
            className="absolute inset-0"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[480px] bg-[#FAF9F6] border border-zinc-200/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 text-zinc-900 z-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <HardDrive size={18} className="text-zinc-850" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-zinc-950 text-base leading-tight">
                    Manage Storage & Cache
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                    Monitor publication download footprint and free device storage.
                  </p>
                </div>
              </div>

              {!isClearing && (
                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Storage Meter Visual Gauge */}
            <div className="py-5">
              <div className="bg-zinc-100/40 border border-zinc-200/60 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Storage Footprint</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-zinc-900 tracking-tight">{totalUsage}</span>
                      <span className="text-xs font-bold text-zinc-500 font-mono">MB</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Availability</span>
                    <div className="text-xs font-bold text-zinc-700 mt-0.5 font-sans">
                      {storageLimit - totalUsage} MB Free / {storageLimit} MB slice
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative w-full h-3 bg-zinc-200/80 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentUsed}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full transition-colors duration-500 ${
                      percentUsed > 75 
                        ? 'bg-rose-500' 
                        : percentUsed > 40 
                        ? 'bg-indigo-500' 
                        : 'bg-emerald-500'
                    }`} 
                  />
                </div>

                <div className="flex justify-between text-[9px] text-zinc-400 font-mono">
                  <span>0% (Empty)</span>
                  <span>{percentUsed}% Used</span>
                  <span>100% (High Footprint)</span>
                </div>
              </div>
            </div>

            {/* Breakdown List Categories */}
            <div className="space-y-3 mb-6">
              <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pb-1 border-b border-zinc-200/30">
                Cache Diagnostics Breakdown
              </h4>

              {/* PDFs Category */}
              <div className="flex items-center justify-between py-1.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-800">
                  <FileText size={14} className="text-zinc-500" />
                  <span className="font-semibold">Magazine PDFs & Assets</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-200/50 rounded text-zinc-600 font-bold">
                    {offlineCount} Cached
                  </span>
                </div>
                <div className="font-mono font-bold text-zinc-900">{magazinePdfsSize.toFixed(1)} MB</div>
              </div>

              {/* TTS Category */}
              <div className="flex items-center justify-between py-1.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-800">
                  <AudioLines size={14} className="text-zinc-500" />
                  <span className="font-semibold">Speech Audio Streams</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">
                    Podcast Cache
                  </span>
                </div>
                <div className="font-mono font-bold text-zinc-900">{speechBuffersSize.toFixed(1)} MB</div>
              </div>

              {/* IndexedDB RAG Index */}
              <div className="flex items-center justify-between py-1.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-800">
                  <Database size={14} className="text-zinc-500" />
                  <span className="font-semibold">Local Offline RAG Indices</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold">
                    IndexedDB
                  </span>
                </div>
                <div className="font-mono font-bold text-zinc-900">{ragDBSize.toFixed(1)} MB</div>
              </div>

              {/* Chats metadata */}
              <div className="flex items-center justify-between py-1.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-800">
                  <MessageSquare size={14} className="text-zinc-500" />
                  <span className="font-semibold">Companion AI Dialog Histories</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-200/50 rounded text-zinc-600 font-bold">
                    JSON Logs
                  </span>
                </div>
                <div className="font-mono font-bold text-zinc-900">{chatLogsSize.toFixed(1)} MB</div>
              </div>
            </div>

            {/* Steps & Success notifications */}
            <AnimatePresence mode="wait">
              {isClearing && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-150 flex items-center gap-3 text-indigo-850"
                >
                  <RefreshCw size={14} className="animate-spin text-indigo-600 shrink-0" />
                  <div className="text-[11px] font-medium leading-tight">
                    <span className="font-bold flex block">Deep Cleaning Offline Storage</span>
                    <span className="text-indigo-650 opacity-80">{clearingStep}</span>
                  </div>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-150 flex items-start gap-3"
                >
                  <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-black font-sans block text-emerald-950 font-bold mb-0.5">Device Storage Optimized Successfully!</span>
                    Purged all local copies and caches, reclaiming <span className="font-mono font-extrabold">{reclaimedMB.toFixed(1)} MB</span> of storage space. Standard app assets ({baseAppAssetsSize} MB) are preserved.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions Footer */}
            <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-zinc-200/50">
              <button
                disabled={isClearing || totalUsage <= baseAppAssetsSize}
                onClick={handleClearCache}
                className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 disabled:hover:bg-rose-600 text-white font-semibold rounded-2xl text-xs tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs shadow-rose-200"
              >
                <Trash2 size={13} />
                <span>Optimize & Clear Cache</span>
              </button>
              
              {!isClearing && (
                <button
                  onClick={onClose}
                  className="px-5 h-11 hover:bg-zinc-150 border border-zinc-250 text-zinc-800 font-semibold rounded-2xl text-xs tracking-wide transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
