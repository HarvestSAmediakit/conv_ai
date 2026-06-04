import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  HelpCircle, 
  Keyboard, 
  Command,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  // Listen to Escape key to close the modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const shortcuts = [
    {
      category: "Page Navigation",
      items: [
        { keys: ["→", "↓", "Space", "N"], action: "Flip to next page" },
        { keys: ["←", "↑", "Shift + Space", "P"], action: "Flip to previous page" },
        { keys: ["Home"], action: "Jump back to Front Cover (Page 1)" },
        { keys: ["End"], action: "Skip forward to Back Cover" },
      ]
    },
    {
      category: "Interface & Controls",
      items: [
        { keys: ["S", "/"], action: "Toggle full-text search drawer" },
        { keys: ["G"], action: "Toggle grid view navigator" },
        { keys: ["Esc"], action: "Dismiss active drawer, search, or overlay" },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
          {/* Backdrop Cover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 380 }}
            className="relative w-full max-w-[480px] bg-[#FAF9F6] border border-zinc-200/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 text-zinc-900 z-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <Keyboard size={20} className="text-zinc-800" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-zinc-950 text-base leading-tight">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                    Navigate the ConvoMag viewer with lightning speed.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                title="Dismiss help modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content List */}
            <div className="py-4 space-y-6 flex-1 max-h-[460px] overflow-y-auto pr-2">
              {shortcuts.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-3">
                  <h4 className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-black">
                    {cat.category}
                  </h4>
                  <div className="space-y-2">
                    {cat.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx} 
                        className="flex items-center justify-between py-2 border-b border-zinc-100/50 last:border-0"
                      >
                        <span className="text-xs text-zinc-600 font-medium max-w-[200px]">
                          {item.action}
                        </span>
                        
                        <div className="flex items-center gap-1.5 flex-wrap justify-end max-w-[220px]">
                          {item.keys.map((key, kIdx) => (
                            <React.Fragment key={kIdx}>
                              {kIdx > 0 && <span className="text-[10px] text-zinc-400 font-semibold px-0.5">or</span>}
                              <kbd className="min-w-[24px] h-6 px-1.5 bg-white border border-zinc-200 border-b-[3px] rounded-md flex items-center justify-center font-mono text-[10px] sm:text-xs font-black text-zinc-800 shadow-xs cursor-default">
                                {key}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Tip / Sparkle Footer */}
            <div className="mt-2 bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-3.5 flex items-start gap-2.5">
              <Sparkles size={14} className="text-indigo-500 mt-0.5 shrink-0" fill="currentColor" />
              <p className="text-[10.5px] text-indigo-950 font-medium leading-normal">
                Did you know? ConvoMag saves your highlight logs and scribbles on the go. Switch to <strong>Flipped view</strong> or zoom for details!
              </p>
            </div>

            {/* Primary close action */}
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer active:scale-[0.99]"
            >
              Continue Reading
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
