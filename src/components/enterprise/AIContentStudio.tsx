import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Linkedin, 
  Twitter, 
  FileText, 
  Mail, 
  Globe, 
  Copy, 
  Check, 
  Download,
  Search,
  MessageSquare,
  Facebook,
  Loader2,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EcosystemData {
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    threads?: string;
  };
  blog: string;
  email: string;
  ads: { headline: string; description: string }[];
  seo: { keywords: string[]; meta: string; headline: string; sub: string };
}

export default function AIContentStudio({ magazineId, magazineTitle }: { magazineId: string; magazineTitle: string }) {
  const [activeAsset, setActiveAsset] = useState<'blog' | 'social' | 'email' | 'seo'>('social');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [data, setData] = useState<EcosystemData | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    // Mimic API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data for display
    setData({
      social: {
        linkedin: `🚀 Thrilled to announce the latest issue of ${magazineTitle}! \n\nWe dive deep into how AI is reshaping the industry vertical. From operational efficiency to customer engagement, discover why leading publishers are moving to an AI-first model.\n\nRead the full interactive edition here: https://convomag.ai/eco/${magazineId}\n\n#ConvoMag #DigitalPublishing #AI`,
        twitter: `The future of ${magazineTitle} is here. ⚡️ AI-powered, voice-enabled, and fully interactive. Check it out: https://convomag.ai/eco/${magazineId} #AI #Publishing`,
        facebook: `Transform your reading experience with ${magazineTitle}. Our new AI companion is ready to discuss the latest trends with you. Click below to start your journey.`,
        instagram: `POV: You just unlocked the most intelligent magazine on the planet. 🌎✨ Link in bio. #AI #Innovation #Reading`
      },
      blog: `## The Evolution of ${magazineTitle}: Why the Future is Intelligent\n\nIn our latest edition, we explore the intersection of traditional editorial values and cutting-edge artificial intelligence. As the publishing landscape shifts, static PDFs are becoming oracles of the past. ${magazineTitle} is leading the charge with its transformation into a dynamic, conversational entity.\n\n### Why Interaction Matters\nReaders today don't just want to consume content; they want to engage with it. By integrating Gemini-powered AI, we give our subscribers the ability to ask questions directly to the document, essentially turning Every page into a conversation.\n\n### Data-Driven Insights\nThis issue also highlights how data attribution is changing ROI for our advertisers. No longer are we guessing impressions; we are tracking real conversational sentiment...`,
      email: `Subject: Your Exclusive Access to ${magazineTitle} Intelligent Edition\n\nHi there,\n\nWe're excited to share something completely new with you today. The latest edition of ${magazineTitle} isn't just a magazine—it's a living, breathing digital ecosystem.\n\nWhat's waiting for you inside:\n- Talk to the Magazine: Ask our AI companion anything.\n- Voice Remix: Listen to curated sections as a high-quality podcast.\n- Instant Insights: Deep-dive into technical data with one click.\n\n[Launch Interactive Experience]\n\nStay ahead of the curve,\nThe ${magazineTitle} Team`,
      ads: [
        { headline: `Meet ${magazineTitle} AI`, description: `The first conversational magazine. Read, talk, and listen.` },
        { headline: `Intelligent Publishing`, description: `Upgrade to the AI edition of ${magazineTitle} today.` }
      ],
      seo: {
        keywords: ['AI magazine', 'Interactive PDF', 'ConvoMag', 'Digital Strategy', 'Publishing ROI'],
        meta: `Explore ${magazineTitle} - The world's first AI-powered conversational magazine. Features include Voice AI, Search, and real-time lead generation.`,
        headline: `The Intelligent Future of ${magazineTitle}`,
        sub: `Read, Talk, and Listen to your favorite publication like never before.`
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, [magazineId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const AssetCard = ({ title, icon: Icon, children, copyText, id }: any) => (
    <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-[#00c896]" />
          <span className="font-bold text-sm text-zinc-900">{title}</span>
        </div>
        <button 
          onClick={() => handleCopy(copyText, id)}
          className="p-2 rounded-lg hover:bg-zinc-200 transition-colors text-zinc-500"
        >
          {copied === id ? <Check size={16} className="text-[#00c896]" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">AI Content Studio</h1>
          <p className="text-zinc-500 text-sm mt-1">AI-generated marketing assets extracted from <b>{magazineTitle}</b>.</p>
        </div>
        <button 
          onClick={fetchAssets}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00c896] text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {loading ? 'Regenerating...' : 'Regenerate Content'}
        </button>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#00c896]/10 flex items-center justify-center text-[#00c896]">
            <Loader2 className="animate-spin" size={32} />
          </div>
          <div>
            <h3 className="font-black text-zinc-900">Training Marketing Models...</h3>
            <p className="text-sm text-zinc-500">We're decomposing your publication into viral assets.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'social', label: 'Social Media Pack', icon: Share2 },
              { id: 'blog', label: 'Blog Article', icon: FileText },
              { id: 'email', label: 'Email Newsletter', icon: Mail },
              { id: 'seo', label: 'SEO & Meta Discovery', icon: Search }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAsset(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${
                  activeAsset === tab.id 
                  ? 'bg-[#00c896]/5 border-[#00c896]/20 text-[#00c896]' 
                  : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeAsset === 'social' && (
                <motion.div 
                  key="social"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <AssetCard title="LinkedIn Update" icon={Linkedin} copyText={data?.social.linkedin} id="li">
                    <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">{data?.social.linkedin}</p>
                  </AssetCard>
                  <AssetCard title="Twitter / X Thread" icon={Twitter} copyText={data?.social.twitter} id="tw">
                    <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">{data?.social.twitter}</p>
                  </AssetCard>
                  <AssetCard title="Instagram Caption" icon={Share2} copyText={data?.social.instagram} id="ig">
                    <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">{data?.social.instagram}</p>
                  </AssetCard>
                  <AssetCard title="Facebook Post" icon={Facebook} copyText={data?.social.facebook} id="fb">
                    <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">{data?.social.facebook}</p>
                  </AssetCard>
                </motion.div>
              )}

              {activeAsset === 'blog' && (
                <motion.div 
                  key="blog"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AssetCard title="SEO-Optimized Blog Post" icon={FileText} copyText={data?.blog} id="blog">
                    <div className="prose prose-sm max-w-none prose-zinc">
                      <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#00c896] mb-4">DRAFT CONTENT</div>
                        <div className="text-zinc-600 text-sm whitespace-pre-wrap leading-loose font-serif italic">
                          {data?.blog}
                        </div>
                      </div>
                    </div>
                  </AssetCard>
                </motion.div>
              )}

              {activeAsset === 'email' && (
                <motion.div 
                  key="email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                   <AssetCard title="Subscriber Newsletter" icon={Mail} copyText={data?.email} id="mail">
                      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden max-w-md mx-auto shadow-inner">
                        <div className="h-2 bg-[#00c896]" />
                        <div className="p-8">
                          <div className="flex justify-center mb-6">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black text-xl italic">C</div>
                          </div>
                          <div className="text-zinc-600 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                            {data?.email}
                          </div>
                          <div className="mt-8 pt-8 border-t border-zinc-100 text-center text-[10px] text-zinc-400">
                            Sent via ConvoMag AI Cloud
                          </div>
                        </div>
                      </div>
                   </AssetCard>
                </motion.div>
              )}

              {activeAsset === 'seo' && (
                <motion.div 
                  key="seo"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <AssetCard title="Meta Tags & Descriptions" icon={Globe} copyText={data?.seo.meta} id="meta">
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">PAGE TITLE</div>
                        <div className="text-sm font-bold text-[#00c896]">{data?.seo.headline}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">META DESCRIPTION</div>
                        <div className="text-sm font-medium text-zinc-600">{data?.seo.meta}</div>
                      </div>
                    </div>
                  </AssetCard>

                  <AssetCard title="Target Keywords" icon={Search} copyText={data?.seo.keywords.join(', ')} id="keywords">
                    <div className="flex flex-wrap gap-2">
                       {data?.seo.keywords.map((kw, i) => (
                         <span key={i} className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                           {kw}
                         </span>
                       ))}
                    </div>
                  </AssetCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
