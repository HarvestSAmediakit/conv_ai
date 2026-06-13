import React from 'react';
import GlobalNavigation from './GlobalNavigation';
import CookieConsent from '../legal/CookieConsent';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#050505] min-h-screen text-gray-100 font-sans selection:bg-[#00c896]/30 overflow-x-hidden">
      <GlobalNavigation />
      <main className="pt-16 pb-20 sm:pb-0 min-h-screen w-full">
        {children}
      </main>
      <CookieConsent />
    </div>
  );
}
