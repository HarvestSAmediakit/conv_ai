import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Settings, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PRESETS = {
  croplan: {
    id: 'croplan',
    title: "Croplan Seed Expert",
    tagline: "Talk seamlessly to our virtual agronomist.",
    instruction: "You are an expert conversational agronomist representing Croplan seeds in South Africa. Respond to agricultural queries using casual, accessible, spoken English. Keep audio turns extremely short and natural. You are helpful, professional, and knowledgeable about crops and seeds in the region.",
    theme: "from-emerald-800 to-teal-700",
    pulse: "bg-emerald-500"
  },
  stihl: {
    id: 'stihl',
    title: "STIHL Equipment Specialist",
    tagline: "Instant audio support for tools & fleet care.",
    instruction: "You are a field equipment specialist for STIHL tools. Help the operator solve mechanical issues and evaluate tools efficiently. Keep voice responses direct, functional, and very concise. You are an expert in chainsaws, trimmers, and other outdoor power equipment.",
    theme: "from-orange-700 to-amber-600",
    pulse: "bg-orange-500"
  }
};

export default function RemixHarvestSA() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [activePreset, setActivePreset] = useState(PRESETS.croplan);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('Ready');

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const nextStartTimeRef = useRef(0);

  const toggleConnection = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  const connect = async () => {
    if (!apiKey) {
      alert("Please enter a Gemini API Key first.");
      return;
    }

    setIsConnecting(true);
    setStatus('Connecting...');

    try {
      // 1. Setup Audio Capture (16kHz for Live API Input)
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;
      
      await audioCtx.audioWorklet.addModule('/audio-processor.js');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(audioCtx, 'audio-processor');
      workletRef.current = worklet;
      
      // Capture only - DO NOT connect to audioCtx.destination to prevent speaker feedback loop
      source.connect(worklet);

      // 2. Setup WebSocket Connection
      const endpoint = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      const ws = new WebSocket(endpoint);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('Live');
        setIsConnected(true);
        setIsConnecting(false);

        // Protocol Handshake: Setup model and generation parameters
        const setup = {
          setup: {
            model: "models/gemini-2.0-flash-exp",
            generation_config: {
              response_modalities: ["AUDIO"],
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: "Aoede" 
                  }
                }
              }
            },
            system_instruction: {
              parts: [{ text: activePreset.instruction }]
            }
          }
        };
        ws.send(JSON.stringify(setup));
      };

      ws.onmessage = async (event) => {
        if (typeof event.data !== 'string') return;
        
        try {
          const msg = JSON.parse(event.data);
          const audioBase64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          
          if (audioBase64) {
            playAudio(audioBase64);
          }

          if (msg.serverContent?.interrupted) {
            // Server signaling to clear the audio buffer due to user interrupt
            stopPlayback();
          }
        } catch (err) {
          console.error("Payload parse error:", err);
        }
      };

      ws.onclose = () => disconnect();
      ws.onerror = () => disconnect();

      // Handle audio chunks from the worklet
      worklet.port.onmessage = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const uint8 = new Uint8Array(e.data);
          let binary = '';
          const len = uint8.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8[i]);
          }
          const base64 = btoa(binary);
          
          wsRef.current.send(JSON.stringify({
            realtime_input: {
              media_chunks: [{
                data: base64,
                mime_type: "audio/pcm;rate=16000"
              }]
            }
          }));
        }
      };

    } catch (err) {
      console.error("Connection failed:", err);
      alert("Multimodal pipeline failed: Ensure microphone access is granted and your API key is valid for Gemini 2.0 Flash.");
      setIsConnecting(false);
      setStatus('Failed');
      disconnect();
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setIsConnecting(false);
    setStatus('Ready');

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    stopPlayback();
  };

  const playAudio = (base64: string) => {
    if (!audioCtxRef.current) return;
    
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }
      
      const audioBuffer = audioCtxRef.current.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);
      
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtxRef.current.destination);
      
      let startTime = nextStartTimeRef.current;
      const now = audioCtxRef.current.currentTime;
      
      if (startTime < now) {
        startTime = now + 0.05; // Small buffer to avoid crackling
      }
      
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const stopPlayback = () => {
    nextStartTimeRef.current = 0;
  };

  const changePreset = (key: string) => {
    if (isConnected) disconnect();
    // @ts-ignore
    setActivePreset(PRESETS[key]);
  };

  return (
    <div className="bg-[#FAF9F6] h-screen overflow-hidden flex flex-col m-0 p-0 font-sans text-zinc-900 blueprint-grid">
      {/* Premium Editorial Header Console */}
      <div className="bg-[#FAF9F6]/90 text-zinc-900 px-6 py-4 flex items-center justify-between border-b border-zinc-200/50 z-50 backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <button 
            onClick={() => navigate('/hub')}
            className="p-2 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-all cursor-pointer"
            title="Return to Newsstand"
          >
            <BookOpen size={16} className="text-zinc-650" />
          </button>
          <span className="bg-zinc-100 border border-zinc-200 text-[8px] uppercase px-2.5 py-1 rounded font-mono tracking-widest text-zinc-600 font-semibold">Remix Exhibition</span>
          <h1 className="text-sm font-serif font-medium tracking-wide text-zinc-800">Harvest SA Multimodal Live API</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Gemini API Key" 
              className="bg-white/60 border border-zinc-200 rounded-xl text-xs pl-4 pr-10 py-2 w-48 text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all focus:w-64 placeholder:text-zinc-400"
            />
            <Settings size={13} className="absolute right-4.5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600" />
          </div>
          <select 
            onChange={(e) => changePreset(e.target.value)}
            className="bg-white/60 border border-zinc-200 rounded-xl text-xs px-4 py-2 text-zinc-700 font-mono focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
          >
            <option value="croplan">Scenario: Croplan Seed Expert</option>
            <option value="stihl">Scenario: STIHL Technical Guide</option>
          </select>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Digital Magazine Container */}
        <div className="w-full h-full bg-white relative">
          <iframe 
            src="https://www.harvestsa.co.za/magazine/82/mobile/" 
            className="w-full h-full border-none" 
            title="Harvest SA Magazine"
            allow="microphone"
          />
        </div>

        {/* Floating Interactive Voice Layer (Calm UX Bento Box) */}
        <motion.div 
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 right-6 w-80 glass-panel rounded-3xl shadow-2xl overflow-hidden z-50 border border-zinc-200/50"
        >
          {/* Widget Header with Subtle, Matte Gradient */}
          <div className={`bg-gradient-to-r ${activePreset.theme} p-5 text-white transition-all duration-500 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10 flex justify-between items-center">
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/90 opacity-90">Voice Companion</span>
              <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-full border border-white/5">
                <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? activePreset.pulse + ' animate-pulse' : 'bg-gray-400'}`} />
                <span className="font-mono text-[8px] uppercase tracking-wider">{status}</span>
              </div>
            </div>
            <h2 className="text-lg font-serif font-medium mt-3.5 relative z-10">{activePreset.title}</h2>
            <p className="text-xs text-white/80 mt-1 font-light relative z-10 leading-relaxed">{activePreset.tagline}</p>
          </div>

          {/* Control Panel */}
          <div className="p-6.5 flex flex-col items-center bg-white/70">
            <div className="relative mb-6">
              <AnimatePresence>
                {isConnected && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.25, opacity: 0.15 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2.0 }}
                    className={`absolute inset-0 rounded-full ${activePreset.pulse}`}
                  />
                )}
              </AnimatePresence>
              
              <button 
                onClick={toggleConnection}
                disabled={isConnecting}
                className={`relative z-10 w-20 h-20 cursor-pointer ${isConnecting ? 'bg-zinc-850' : (isConnected ? 'bg-rose-600 hover:bg-rose-500 border-rose-500/20' : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500/20')} text-white rounded-full flex items-center justify-center focus:outline-none border shadow-md transition-all active:scale-95 disabled:cursor-not-allowed`}
              >
                {isConnecting ? (
                  <RefreshCw className="h-7 w-7 animate-spin text-zinc-300" />
                ) : isConnected ? (
                  <MicOff className="h-7 w-7 text-white" />
                ) : (
                  <Mic className="h-7 w-7 text-white" />
                )}
              </button>
            </div>
            
            <p className="text-center text-xs text-zinc-550 font-light px-1 leading-relaxed">
              {isConnected 
                ? "Streaming audio in real-time. Speak to engage with the assistant." 
                : "Enter your Gemini API key above and tap the microphone to begin the low-latency conversation layer."}
            </p>
            
            <div className="mt-5 flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-50 border border-zinc-150 px-4 py-2 rounded-xl">
              <ExternalLink size={10} />
              <span>Reference Source: Harvest SA #82</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
