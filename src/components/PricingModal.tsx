import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Check, Zap, Rocket, X } from 'lucide-react';

interface PricingProps {
  onClose: () => void;
}

export default function PricingModal({ onClose }: PricingProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const session = await response.json();
      if (session.error) throw new Error(session.error);

      // In a real app, you'd use your publishable key
      const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample';
      const stripe = await loadStripe(stripePublishableKey);
      
      if (stripe) {
        // @ts-ignore - redirectToCheckout is valid on client-side Stripe instance from stripe-js
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (error) console.error(error);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Failed to initiate checkout. Please ensure STRIPE_SECRET_KEY is configured.");
    } finally {
      setLoading(null);
    }
  };

  const tiers = [
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: '$9.99',
      interval: 'month',
      icon: <Zap className="text-amber-400" />,
      features: [
        'Unlimited AI Companion Access',
        'High-Fidelity Audio Synthesis',
        'Interactive Flipbook Features',
        'Ad-Free Reading Experience',
        'Offline PDF Downloads'
      ],
      buttonText: 'Get Pro Monthly',
      popular: false
    },
    {
      id: 'annual',
      name: 'Yearly Ultimate',
      price: '$99.00',
      interval: 'year',
      icon: <Rocket className="text-blue-400" />,
      features: [
        'All Monthly Pro Features',
        'Early Access to New Remixes',
        'Exclusive Publisher Interviews',
        'Priority Technical Support',
        'Save 20% vs Monthly'
      ],
      buttonText: 'Get Ultimate Yearly',
      popular: true
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Sidebar Image/Content */}
        <div className="md:w-1/3 bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white hidden md:flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Unlock the Future of Reading</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Experience magazines like never before with real-time AI conversations, 
              interactive overlays, and immersive audio experiences.
            </p>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-3 rounded-lg">
                <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
                   <Zap size={16} />
                </div>
                <span>Trusted by 50,000+ readers worldwide</span>
             </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="flex-1 p-8 md:p-12 text-white">
           <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">Choose your plan</h2>
              <p className="text-neutral-400 text-sm">Select the best way to support independent publishers.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tiers.map((tier) => (
                <div 
                  key={tier.id}
                  className={`relative p-6 rounded-xl border transition-all duration-300 ${
                    tier.popular 
                      ? 'bg-white/5 border-blue-500 shadow-lg shadow-blue-500/10' 
                      : 'bg-transparent border-white/10'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    {tier.icon}
                    <h3 className="font-bold text-lg">{tier.name}</h3>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-neutral-500 text-sm ml-1 select-none">/{tier.interval}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                        <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={loading !== null}
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                      tier.popular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    } disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {loading === tier.id ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      tier.buttonText
                    )}
                  </button>
                </div>
              ))}
           </div>

           <p className="mt-8 text-center text-[10px] text-neutral-600">
             Secure payment powered by Stripe. Cancel anytime with one click.
             Terms and conditions apply.
           </p>
        </div>
      </div>
    </div>
  );
}
