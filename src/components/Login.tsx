import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setFeedback({ status: 'error', message: 'Please fill in all requested fields.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { email, password, name, role: 'publisher' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication process failed.');
      }

      setFeedback({ 
        status: 'success', 
        message: isLogin ? 'Access granted! Opening terminal...' : 'Account successfully initialized!' 
      });

      // Write authentication token & secure payload to client state
      localStorage.setItem('convomag_token', data.token);
      localStorage.setItem('convomag_user', JSON.stringify(data.user));

      setTimeout(() => {
        navigate('/publish');
      }, 1000);

    } catch (err: any) {
      console.error("Auth Failure:", err);
      setFeedback({ status: 'error', message: err.message || 'Server did not respond.' });
    } finally {
      setIsLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@convomag.com');
    setPassword('admin123');
    setIsLogin(true);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Immersive background ambient mesh highlights */}
      <div className="absolute top-[-25%] left-[-20%] w-[80%] h-[70%] rounded-full bg-emerald-500/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/[0.03] blur-[150px] pointer-events-none" />
      
      {/* Decorative dots grid pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating launcher top navigation */}
      <button 
        onClick={() => navigate('/home')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-900/60 bg-zinc-950/20 hover:bg-zinc-900/40 backdrop-blur-md transition-all cursor-pointer"
        id="loginBackToHome"
      >
        <ArrowLeft size={14} />
         Reader Market
      </button>

      <div className="w-full max-w-sm z-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800/80 rounded-full text-zinc-400 text-[10px] tracking-widest font-bold uppercase mb-4 shadow-sm select-none">
            <Sparkles size={11} className="text-emerald-400 animate-pulse" />
             Core Security Gate
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight flex items-center justify-center gap-2">
            <Layers size={28} className="text-emerald-500" />
            ConvoMag <span className="text-zinc-500">AI</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            Premium Interactive Digital Publishing Portal
          </p>
        </div>

        <motion.div 
          layout
          className="bg-zinc-950/90 border border-zinc-850/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md"
        >
          {/* Tabs */}
          <div className="flex border-b border-zinc-900 mb-6 gap-2">
            <button 
              onClick={() => { setIsLogin(true); setFeedback(null); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${isLogin ? 'text-[#00c896] border-b-2 border-[#00c896]' : 'text-zinc-500 hover:text-zinc-300'}`}
              id="tabLogin"
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setFeedback(null); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${!isLogin ? 'text-[#00c896] border-b-2 border-[#00c896]' : 'text-zinc-500 hover:text-zinc-300'}`}
              id="tabRegister"
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#00c896]/60 transition-all font-medium"
                      id="registerNameInput"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#00c896]/60 transition-all font-medium"
                  id="authEmailInput"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Security Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#00c896]/60 transition-all font-medium"
                  id="authPasswordInput"
                />
              </div>
            </div>

            {/* Action feedback notifications */}
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`flex gap-2.5 p-3 rounded-xl border text-xs leading-relaxed ${
                    feedback.status === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {feedback.status === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  </div>
                  <span>{feedback.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00c896] hover:bg-[#00b084] disabled:opacity-55 disabled:hover:bg-[#00c896] text-black font-semibold rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,200,150,0.3)] transition-all cursor-pointer"
              id="authSubmitBtn"
            >
              {isLoading ? 'Decrypting credentials...' : isLogin ? 'Access Console' : 'Initialize Account'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Quick Admin seed autofill */}
          {isLogin && (
            <div className="mt-6 pt-5 border-t border-zinc-900 text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2.5">Investor Demo Access</p>
              <button 
                onClick={autofillAdmin}
                className="inline-flex items-center gap-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-2 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                id="loginAutofillAdmin"
              >
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
                Seed Profile: <span className="font-semibold text-zinc-300">admin@convomag.com</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
