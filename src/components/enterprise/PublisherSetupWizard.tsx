import React, { useState } from 'react';
import { 
  Rocket, 
  Upload, 
  Palette, 
  Bot, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Globe,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SetupWizardProps {
  onComplete: () => void;
}

export default function PublisherSetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    industry: 'Agriculture',
    brandName: '',
    primaryColor: '#00c896',
    aiPersonality: 'Professional Expert',
    magazineTitle: '',
    pdfFile: null as File | null
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const industries = [
    'Agriculture', 'Finance', 'Healthcare', 'Technology', 'Legal', 'Manufacturing', 'Fashion', 'Automotive'
  ];

  const handleFinish = async () => {
    setLoading(true);
    // Simulate setup logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00c896]/10 flex items-center justify-center text-[#00c896]">
            <Rocket size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900">Publisher Launch Wizard</h1>
            <p className="text-zinc-500 text-sm">Launch your AI-powered publication ecosystem in minutes.</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s}
              className={`h-full flex-1 transition-all duration-500 ${s <= step ? 'bg-[#00c896]' : 'bg-zinc-200'}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm min-h-[500px] flex flex-col overflow-hidden">
        <div className="flex-1 p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="text-[#00c896]" size={24} />
                  <h2 className="text-xl font-bold">Select Your Vertical</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setFormData({...formData, industry: ind})}
                      className={`p-4 rounded-2xl border text-sm font-medium transition-all ${
                        formData.industry === ind 
                        ? 'border-[#00c896] bg-[#00c896]/5 text-[#00c896]' 
                        : 'border-zinc-100 hover:border-zinc-300 text-zinc-600'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="text-[#00c896]" size={24} />
                  <h2 className="text-xl font-bold">Brand Kit Configuration</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Brand or Identity Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Harvest SA"
                      value={formData.brandName}
                      onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#00c896]/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Primary Brand Color</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-0 p-0 cursor-pointer overflow-hidden"
                      />
                      <span className="text-zinc-500 font-mono text-sm uppercase">{formData.primaryColor}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Upload className="text-[#00c896]" size={24} />
                  <h2 className="text-xl font-bold">Content Ingestion</h2>
                </div>
                <div 
                  className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center hover:border-[#00c896]/50 transition-all cursor-pointer bg-zinc-50/50"
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <Upload size={32} />
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-1">Upload Publication PDF</h3>
                  <p className="text-zinc-500 text-sm">Drag and drop your document here (Max 50MB)</p>
                  <input id="pdf-upload" type="file" accept=".pdf" className="hidden" />
                </div>
                {/* Simulated file display */}
                <div className="p-4 rounded-xl bg-[#00c896]/5 border border-[#00c896]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#00c896]" />
                    <span className="text-sm font-bold text-zinc-900">publication_draft.pdf</span>
                  </div>
                  <span className="text-[10px] bg-[#00c896] text-white px-2 py-0.5 rounded-full font-black">EXTRACTING...</span>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Bot className="text-[#00c896]" size={24} />
                  <h2 className="text-xl font-bold">AI Companion Identity</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'Professional Expert', desc: 'Authoritative, precise, and data-driven advisor.' },
                    { id: 'Conversational Friend', desc: 'Approachable, warm, and easy to talk to.' },
                    { id: 'C-Suite Strategist', desc: 'High-level summaries and business ROI focus.' },
                    { id: 'Technical Engineer', desc: 'Deep-dive analytical and code-aware personality.' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setFormData({...formData, aiPersonality: p.id})}
                      className={`w-full p-4 rounded-2xl border text-left transition-all ${
                        formData.aiPersonality === p.id 
                        ? 'border-[#00c896] bg-[#00c896]/5 ring-1 ring-[#00c896]' 
                        : 'border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <div className="font-bold text-zinc-900">{p.id}</div>
                      <div className="text-xs text-zinc-500">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#00c896]/10 flex items-center justify-center text-[#00c896] mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-black text-zinc-900">Ecosystem Ready!</h2>
                <p className="text-zinc-500 max-w-sm mx-auto">
                  We've initialized your brand kit, extracted your publication content, and prepared your AI Content Studio.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8 py-6 bg-zinc-50 rounded-3xl">
                  <div className="px-6 text-left">
                    <div className="text-[10px] font-black uppercase text-[#00c896] tracking-widest mb-1">BRAND</div>
                    <div className="text-sm font-bold text-zinc-900">{formData.brandName || 'Untitled Brand'}</div>
                  </div>
                  <div className="px-6 text-left">
                    <div className="text-[10px] font-black uppercase text-[#00c896] tracking-widest mb-1">VERTICAL</div>
                    <div className="text-sm font-bold text-zinc-900">{formData.industry}</div>
                  </div>
                  <div className="px-6 text-left mt-4 border-t border-zinc-200 pt-4">
                    <div className="text-[10px] font-black uppercase text-[#00c896] tracking-widest mb-1">AI PERSONALITY</div>
                    <div className="text-sm font-bold text-zinc-900">{formData.aiPersonality}</div>
                  </div>
                  <div className="px-6 text-left mt-4 border-t border-zinc-200 pt-4">
                    <div className="text-[10px] font-black uppercase text-[#00c896] tracking-widest mb-1">CONTENT ASSETS</div>
                    <div className="text-sm font-bold text-zinc-900">READY</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <button
            onClick={prevStep}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-zinc-500 hover:text-zinc-900 transition-all disabled:opacity-30"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          {step < 5 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:translate-x-1 transition-all"
            >
              Next Step
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-[#00c896] text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#00c896]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Deploying Ecosystem...
                </>
              ) : (
                <>
                  Launch My Publication
                  <Sparkles size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
