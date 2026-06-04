import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Wrench, 
  CheckCircle, 
  Settings, 
  BookOpen, 
  Bot, 
  Volume2, 
  VolumeX, 
  Layers, 
  Bookmark,
  Check,
  Edit2
} from 'lucide-react';

interface JustGeneratedModalProps {
  isOpen: boolean;
  onClose: () => void;
  magazine: any;
  onUpdate: (updatedData: any) => void;
}

export default function JustGeneratedModal({ isOpen, onClose, magazine, onUpdate }: JustGeneratedModalProps) {
  const [viewMode, setViewMode] = useState<'prompt' | 'edit'>('prompt');
  
  // Form states
  const [title, setTitle] = useState(magazine?.title || '');
  const [aiPersonality, setAiPersonality] = useState(magazine?.aiPersonality || 'Professional Assistant');
  const [aiContext, setAiContext] = useState(magazine?.aiContext || '');
  const [soundEnabled, setSoundEnabled] = useState(magazine?.soundEnabled !== undefined ? !!magazine.soundEnabled : true);
  const [hardcover, setHardcover] = useState(!!magazine?.hardcover);
  const [saving, setSaving] = useState(false);

  if (!magazine) return null;

  const handleUpdateStatusAndClose = async () => {
    setSaving(true);
    try {
      // Set status to published on save
      const response = await fetch(`/api/magazines/${magazine.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (response.ok) {
        onUpdate({ ...magazine, status: "published" });
      }
    } catch (e) {
      console.error("Failed to set published status:", e);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const handleSaveChangesAndClose = async () => {
    setSaving(true);
    try {
      const updatedFields = {
        title,
        aiPersonality,
        aiContext,
        soundEnabled,
        hardcover,
        status: "published"
      };

      const response = await fetch(`/api/magazines/${magazine.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        onUpdate({
          ...magazine,
          ...updatedFields
        });
      }
    } catch (e) {
      console.error("Failed to save edited magazine config:", e);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleUpdateStatusAndClose}
            className="absolute inset-0"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[500px] bg-[#FAF9F6] border border-zinc-200/80 rounded-[32px] shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 text-zinc-900 z-10"
          >
            {/* Standard Dismiss Button */}
            <button
              onClick={handleUpdateStatusAndClose}
              className="absolute right-6 top-6 p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="Save and continue"
            >
              <X size={16} />
            </button>

            {viewMode === 'prompt' ? (
              <div className="space-y-6 pt-2">
                {/* Visual success badge */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-100">
                    <CheckCircle size={24} className="text-emerald-500 animate-[bounce_1s_infinite]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#00c896] uppercase tracking-widest bg-emerald-50/70 border border-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                      Processing Complete
                    </span>
                    <h3 className="font-sans font-black text-zinc-950 text-lg leading-tight mt-1">
                      ConvoMag Ready!
                    </h3>
                  </div>
                </div>

                <div className="bg-white/80 border border-zinc-150 rounded-2xl p-4 flex items-start gap-4 shadow-xs">
                  {magazine.coverUrl ? (
                    <img 
                      src={magazine.coverUrl} 
                      alt={magazine.title} 
                      className="w-16 h-20 object-cover rounded-lg border border-zinc-200/60 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-zinc-100 rounded-lg border border-zinc-200/60 flex items-center justify-center shrink-0">
                      <BookOpen size={20} className="text-zinc-400" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Title</p>
                    <p className="text-sm font-black text-zinc-900 leading-tight">
                      {magazine.title || "Untitled Digital Magazine"}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">
                      {magazine.pageCount || 1} pages digitized • Offline engine loaded
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-zinc-650 text-xs sm:text-sm font-medium leading-relaxed">
                  <p>
                    Your dynamic vocal conversation model has been automatically calibrated with modern visual page overlays.
                  </p>
                  <p className="text-zinc-500 text-xs">
                    Would you like to customize the voice features, AI details, or title before continuing, or save and jump straight into reading?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <button
                    onClick={() => setViewMode('edit')}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white border border-zinc-200/90 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer select-none"
                  >
                    <Edit2 size={13} className="text-zinc-500" />
                    <span>Edit Settings</span>
                  </button>
                  <button
                    onClick={handleUpdateStatusAndClose}
                    disabled={saving}
                    className="py-3.5 px-4 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] select-none"
                  >
                    <span>Save & Read</span>
                    <BookOpen size={13} className="text-[#00c896]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 pt-1 flex flex-col max-h-[75vh]">
                {/* Editing view header */}
                <div className="border-b border-zinc-200/50 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Settings size={16} className="text-zinc-900" />
                    <h3 className="font-sans font-black text-zinc-950 text-base leading-tight">
                      Customize ConvoMag
                    </h3>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wider">
                    Fine-tune AI Personality and interface triggers
                  </p>
                </div>

                {/* Form scroll container */}
                <div className="space-y-4 overflow-y-auto pr-1 flex-1 py-1">
                  {/* Title field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block font-bold">
                      Magazine Title
                    </label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-800 focus:ring-4 focus:ring-zinc-100 focus:outline-none focus:border-zinc-400 transition-all shadow-sm"
                      placeholder="e.g. Harvest SA"
                    />
                  </div>

                  {/* Robot Voice Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block font-bold flex justify-between">
                      <span>Conversational Personality</span>
                      <span className="text-[#00c896] font-black tracking-normal select-none">Voice Enabled</span>
                    </label>
                    <select
                      value={aiPersonality}
                      onChange={(e) => setAiPersonality(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-800 focus:ring-4 focus:ring-zinc-100 focus:outline-none focus:border-zinc-400 appearance-none transition-all shadow-sm cursor-pointer"
                    >
                      <option>Professional Assistant</option>
                      <option>Casual Guide</option>
                      <option>Industry Expert</option>
                      <option>Brand Ambassador</option>
                      <option>Technical Support</option>
                    </select>
                  </div>

                  {/* AI Context index */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block font-bold">
                      Knowledge Directory Context override
                    </label>
                    <textarea
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs font-medium text-zinc-855 focus:ring-4 focus:ring-zinc-100 focus:outline-none focus:border-zinc-400 h-24 resize-none transition-all shadow-sm leading-relaxed"
                      placeholder="Add background notes or manual indexing data..."
                    />
                  </div>

                  {/* Toggle controls */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200/75 bg-white shadow-1xs cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 bg-white"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-zinc-800">Sound FX</span>
                        <span className="text-[9px] text-zinc-400 font-semibold leading-none">Rustling waves</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200/75 bg-white shadow-1xs cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={hardcover}
                        onChange={(e) => setHardcover(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 bg-white"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-zinc-800">3D Texture</span>
                        <span className="text-[9px] text-zinc-400 font-semibold leading-none">Hardcover card</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Foot actions */}
                <div className="grid grid-cols-2 gap-3 border-t border-zinc-200/40 pt-3.5 shrink-0">
                  <button
                    onClick={() => setViewMode('prompt')}
                    className="py-3 px-4 border border-zinc-200 text-zinc-650 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer select-none"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSaveChangesAndClose}
                    disabled={saving}
                    className="py-3 px-4 bg-zinc-950 hover:bg-zinc-850 text-[#00c896] font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99] shadow-sm select-none"
                  >
                    {saving ? "Saving..." : "Save Config"}
                    <Check size={13} className="text-[#00c896]" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
