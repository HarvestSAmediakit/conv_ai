import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Users, 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileKey,
  Fingerprint,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export default function EnterpriseSSOConfig() {
  const [provider, setProvider] = useState('Okta');
  const [status, setStatus] = useState<'active' | 'configuring' | 'disabled'>('active');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">Identity & SSO</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage enterprise authentication, SAML protocols, and reader access controls.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#00c896]/10 text-[#00c896] text-xs font-black uppercase tracking-widest border border-[#00c896]/20">
           <ShieldCheck size={16} />
           Security Status: Hardened
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Provisioning */}
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 rounded-[40px] border border-zinc-200 bg-white shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Key className="text-[#00c896]" size={24} />
                    <h3 className="text-xl font-black text-zinc-900">SSO Provider Configuration</h3>
                 </div>
                 <div className="flex gap-2">
                    {['Okta', 'Azure AD', 'SAML 2.0', 'Auth0'].map((p) => (
                      <button 
                        key={p}
                        onClick={() => setProvider(p)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                          provider === p 
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-200' 
                          : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <div>
                       <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Entity ID / Metadata URL</label>
                       <input 
                         type="text" 
                         defaultValue={`https://sso.convomag.ai/auth/${provider.toLowerCase().replace(' ', '')}/metadata`}
                         className="w-full px-4 py-3 rounded-xl border border-zinc-100 text-xs font-mono text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00c896]/20 transition-all font-medium"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">ACS URL (Assertion Consumer Service)</label>
                       <div className="relative">
                          <input 
                            type="text" 
                            readOnly
                            defaultValue="https://api.convomag.ai/sso/callback"
                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-50 bg-zinc-50 text-xs font-mono text-zinc-400 font-medium"
                          />
                          <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
                       </div>
                    </div>
                 </div>

                 <div className="p-6 rounded-3xl bg-[#0A0A0A] text-white flex flex-col justify-between">
                    <div className="space-y-1">
                       <div className="text-[10px] font-black text-[#00c896] uppercase tracking-widest">ENCRYPTION CERTIFICATE</div>
                       <div className="text-xs font-mono text-zinc-500 break-all leading-tight">
                          MIIDBTCCAe2gAwIBAgIQY6X.../convomag_production_key_01.pem
                       </div>
                    </div>
                    <button className="w-full mt-6 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                       Download Certificate
                    </button>
                 </div>
              </div>

              <div className="pt-8 border-t border-zinc-100 flex items-center justify-between">
                 <div className="flex items-center gap-4 text-sm font-bold text-zinc-500">
                    <CheckCircle2 className="text-[#00c896]" size={18} />
                    SCIM User Provisioning Active
                 </div>
                 <button className="px-6 py-3 rounded-xl bg-[#00c896] text-white font-black text-sm hover:scale-[1.02] shadow-lg shadow-[#00c896]/20 transition-all">
                    Test Integration
                 </button>
              </div>
           </div>

           <div className="p-8 rounded-[40px] border border-zinc-200 bg-white shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <Users className="text-[#00c896]" size={24} />
                 <h3 className="text-xl font-black text-zinc-900">Access Governance</h3>
              </div>
              <div className="space-y-4">
                 {[
                   { group: 'Full Access (Internal)', users: 142, role: 'Editor' },
                   { group: 'Partner Tier (Mining Vertical)', users: 890, role: 'Reader' },
                   { group: 'Executive Dashboard', users: 12, role: 'Admin' },
                 ].map((g, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400">
                            <Fingerprint size={20} />
                         </div>
                         <div>
                            <div className="text-sm font-black text-zinc-900">{g.group}</div>
                            <div className="text-[10px] text-zinc-500">{g.users} mapped identifiers</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ROLE</div>
                         <div className="text-sm font-bold text-zinc-900">{g.role}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Status & Logs */}
        <div className="space-y-6">
           <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-900 text-white space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="font-black flex items-center gap-2">
                    <RefreshCw size={18} className="text-[#00c896]" />
                    Audit Logs
                 </h3>
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">LIVE</span>
              </div>
              <div className="space-y-4">
                 {[
                   { event: 'SAML Token Exchange', user: 'adm-01', time: '2s ago' },
                   { event: 'User Provisioned (SCIM)', user: 'idp-32', time: '14m ago' },
                   { event: 'Identity Check Passed', user: 'ext-44', time: '1h ago' },
                   { event: 'SSO Config Updated', user: 'superadmin', time: 'Yesterday' },
                 ].map((log, i) => (
                   <div key={i} className="flex items-center justify-between text-xs pb-4 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="font-mono text-zinc-400">
                         <span className="text-[#00c896]">{'>'}</span> {log.event}
                      </div>
                      <div className="text-right text-zinc-600 font-bold">{log.time}</div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <Lock className="text-amber-500" size={20} />
                 <h4 className="font-black text-zinc-900">Two-Factor Override</h4>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                 For accounts not mapped to SSO, require hardware keys (YubiKey) or TOTP authentication for dashboard access.
              </p>
              <div className="flex items-center justify-between pt-4">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">STATUS</span>
                 <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest">ENFORCED</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
