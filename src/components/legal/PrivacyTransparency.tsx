import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, FileText, Lock, Globe, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyTransparency() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Data Sovereignty (POPIA/GDPR)",
      icon: <Shield className="text-emerald-500" />,
      content: "All Harvest SA reader data is stored in high-security regional zones. We do not sell your personal reading habits or AI conversation transcripts to third parties."
    },
    {
      title: "AI Interaction Disclosure",
      icon: <Globe className="text-indigo-500" />,
      content: "Conversations with magazines are powered by Large Language Models. While highly accurate, AI can occasionally hallucinate facts. We log interactions primarily to improve context discovery."
    },
    {
      title: "Advertiser Transparency",
      icon: <FileText className="text-amber-500" />,
      content: "Advertisers receive aggregated, anonymized metrics on campaign engagement. They can see which products are being discussed but never 'who' is discussing them without explicit lead consent."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F1F1] font-sans selection:bg-indigo-500/30">
      <header className="bg-[#0A0A0A] border-b border-white/5 flex items-center px-4 py-4 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-white p-2">
          <ChevronLeft size={24} />
        </button>
        <div className="ml-2">
          <h1 className="text-lg font-bold">Privacy & Legal Transparency</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Trust Center / Version 2026.1</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-12">
           <h2 className="text-3xl font-black mb-4 tracking-tight">Our Commitment to Harvest SA Readers</h2>
           <p className="text-zinc-400 leading-relaxed">
             ConvoMag AI is designed with 'Privacy by Design' as a core architectural principle. 
             Unlike traditional digital publishing, we ensure your conversational patterns remain your own.
           </p>
        </div>

        <div className="space-y-6">
           {sections.map((s, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl"
             >
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center">
                      {s.icon}
                   </div>
                   <h3 className="font-bold text-lg text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed pl-14">
                  {s.content}
                </p>
             </motion.div>
           ))}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20">
           <div className="flex items-start gap-4">
              <AlertCircle className="text-indigo-500 mt-1 shrink-0" />
              <div>
                 <h4 className="text-white font-bold mb-2">Subject Access Requests</h4>
                 <p className="text-sm text-zinc-400 mb-6">
                   Under POPIA and GDPR, you have the right to request a full export of your interaction data or request permanent deletion (Right to be Forgotten).
                 </p>
                 <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">
                   Manage Data Privacy
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
