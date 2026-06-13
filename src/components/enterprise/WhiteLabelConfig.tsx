import React, { useState } from 'react';
import { 
  Palette, 
  Globe, 
  Shield, 
  Mail, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2,
  ExternalLink,
  Laptop,
  Smartphone,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

export default function WhiteLabelConfig() {
  const [config, setConfig] = useState({
    brandName: 'Harvest SA Publishing',
    logoUrl: '',
    primaryColor: '#00c896',
    customDomain: 'mag.harvest-sa.co.za',
    supportEmail: 'ai-concierge@harvest-sa.co.za',
    enableSso: false,
    aiAvatarUrl: ''
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">White-Label Branding</h1>
          <p className="text-zinc-500 text-sm mt-1">Configure your own domain, branding, and platform identity.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? 'Applying...' : success ? 'Config Applied' : 'Save Platform Config'}
          {success ? <CheckCircle2 size={18} /> : <Save size={18} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity */}
          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <Palette className="text-[#00c896]" size={20} />
                <h3 className="font-black text-zinc-900">Visual Identity</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1.5">Platform Brand Name</label>
                   <input 
                      type="text" 
                      value={config.brandName}
                      onChange={(e) => setConfig({...config, brandName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#00c896]/20 transition-all text-sm font-medium"
                   />
                </div>
                <div>
                   <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1.5">Primary Theme Color</label>
                   <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={config.primaryColor}
                        onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                      />
                      <span className="text-zinc-500 font-mono text-sm uppercase">{config.primaryColor}</span>
                   </div>
                </div>
             </div>

             <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1.5">Platform Logo (URL)</label>
                <div className="flex gap-4">
                   <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="https://your-domain.com/logo.png"
                        value={config.logoUrl}
                        onChange={(e) => setConfig({...config, logoUrl: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#00c896]/20 transition-all text-sm font-medium"
                      />
                   </div>
                   <button className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all">
                      <ImageIcon size={20} />
                   </button>
                </div>
             </div>
          </div>

          {/* infrastructure */}
          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <Globe className="text-[#00c896]" size={20} />
                <h3 className="font-black text-zinc-900">Infrastructure & SSO</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1.5">Custom Domain</label>
                   <div className="relative">
                      <input 
                        type="text" 
                        value={config.customDomain}
                        onChange={(e) => setConfig({...config, customDomain: e.target.value})}
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#00c896]/20 transition-all text-sm font-medium"
                      />
                      <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-1.5">Concierge Support Email</label>
                   <div className="relative">
                      <input 
                        type="email" 
                        value={config.supportEmail}
                        onChange={(e) => setConfig({...config, supportEmail: e.target.value})}
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#00c896]/20 transition-all text-sm font-medium"
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-3">
                   <Shield className="text-[#00c896]" size={20} />
                   <div>
                      <div className="text-sm font-bold text-zinc-900">Enterprise SSO (SAML/Okta)</div>
                      <div className="text-[10px] text-zinc-500">Require corporate login for all readers.</div>
                   </div>
                </div>
                <button 
                  onClick={() => setConfig({...config, enableSso: !config.enableSso})}
                  className={`w-12 h-6 rounded-full transition-all relative ${config.enableSso ? 'bg-[#00c896]' : 'bg-zinc-300'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.enableSso ? 'right-1' : 'left-1'}`} />
                </button>
             </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
           <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm flex flex-col h-full uppercase tracking-widest text-[10px] font-black text-zinc-400">
              <div className="flex items-center justify-between mb-8">
                 <span>PLATFORM PREVIEW</span>
                 <div className="flex gap-2">
                    <button className="p-1.5 rounded bg-zinc-100 text-[#00c896]"><Laptop size={14} /></button>
                    <button className="p-1.5 rounded bg-zinc-50 text-zinc-400"><Smartphone size={14} /></button>
                 </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-zinc-100 rounded-3xl space-y-6">
                 {config.logoUrl ? (
                   <img src={config.logoUrl} alt="Logo" className="h-12 object-contain" />
                 ) : (
                   <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-white text-2xl font-black italic">
                      {config.brandName?.charAt(0) || 'C'}
                   </div>
                 )}
                 
                 <div className="space-y-2">
                    <h4 className="text-xl font-black text-zinc-900 normal-case tracking-tight">{config.brandName || 'Your Brand'}</h4>
                    <p className="text-zinc-500 text-[10px] normal-case tracking-normal">Powered by ConvoMag OS • Secure Reader Gateway</p>
                 </div>

                 <div className="w-full space-y-3">
                    <div 
                      className="w-full h-10 rounded-xl flex items-center justify-center text-white font-bold text-[11px] normal-case"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                       Access Dashboard
                    </div>
                    <div className="w-full h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-400 font-bold text-[11px] normal-case">
                       Support Docs
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-100 space-y-4 font-sans normal-case tracking-normal">
                 <div className="flex items-center gap-3 text-zinc-600">
                    <Eye size={16} />
                    <span className="text-xs font-bold font-sans">Public Portal:</span>
                    <span className="text-xs text-[#00c896] font-mono">{config.customDomain || 'pending'}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
