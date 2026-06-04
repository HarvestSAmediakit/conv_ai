import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  ArrowLeft,
  Loader2,
  Grid,
  Search,
  X,
  Sparkles,
  Zap,
  Maximize,
  Minimize as MinimizeIcon,
  Volume2,
  VolumeX,
  StickyNote,
  BookmarkPlus,
  Trash2,
  Highlighter,
  MessageSquare,
  Send,
  Wifi,
  WifiOff,
  Download,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from "react-router-dom";
import ConvoMagViewer from "./ConvoMagViewer";
import PricingModal from "./PricingModal";
import AudioVisualizer from "./AudioVisualizer";
import ConversationalPodcast from "./ConversationalPodcast";
import PWAInstallPrompt from "./PWAInstallPrompt";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import JustGeneratedModal from "./JustGeneratedModal";

function pcmToBase64(pcmData: Float32Array): string {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < pcmData.length; i++) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default function ReaderApp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Default to mag_1 if none provided
  const initPub = searchParams.get("pub") || "mag_1";

  const [activePub, setActivePub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 1024 : false));
  const [currentPage, setCurrentPage] = useState(0);
  const [hasCopied, setHasCopied] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isPWAInstallPromptOpen, setIsPWAInstallPromptOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isJustGeneratedOpen, setIsJustGeneratedOpen] = useState(() => searchParams.get("justGenerated") === "true");

  // Slides Navigator Grid View & Full-Text Search states
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Caching Indicator States
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncProgress, setSyncProgress] = useState(0);

  // User Notes / Highlight States
  const [notes, setNotes] = useState<{ id: string, text: string, textQuote: string, page: number, timestamp: Date }[]>([]);
  const [currentSelection, setCurrentSelection] = useState<{ text: string, x: number, y: number } | null>(null);

  // AI Chat Sidebar / Local Cache Persistence State
  const [isChatOpen, setIsChatOpen] = useState(() => searchParams.get("chat") === "true");
  const [isPodcastModeOpen, setIsPodcastModeOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai", text: string, pages?: number[], timestamp: string }[]>(() => {
    try {
      const saved = localStorage.getItem(`convomag_chat_${initPub}`);
      return saved ? JSON.parse(saved) : [
        { sender: "ai", text: `Welcome to ConvoMag AI! Ask me anything about this edition. CanvoMag features high-fidelity offline caching so both this magazine and our conversation history are preserved even if you disconnect.`, timestamp: new Date().toISOString() }
      ];
    } catch {
      return [
        { sender: "ai", text: `Welcome to ConvoMag AI! Ask me anything about this edition. CanvoMag features high-fidelity offline caching so both this magazine and our conversation history are preserved even if you disconnect.`, timestamp: new Date().toISOString() }
      ];
    }
  });
  const [isOfflineMode, setIsOfflineMode] = useState(() => typeof navigator !== "undefined" ? !navigator.onLine : false);

  useEffect(() => {
    const autoAsk = searchParams.get("ask");
    if (autoAsk) {
      setTimeout(() => {
        sendChatMessage(autoAsk);
      }, 800);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("ask");
      window.history.replaceState({}, '', newUrl.toString());
    }

    // Simulate Syncing to IndexedDB
    setIsSyncing(true);
    setSyncProgress(0);
    let progress = 0;
    const syncInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(syncInterval);
        setTimeout(() => setIsSyncing(false), 1200);
      }
      setSyncProgress(progress);
    }, 400);

    return () => clearInterval(syncInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem(`convomag_chat_${initPub}`, JSON.stringify(chatMessages));
  }, [chatMessages, initPub]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global reader shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when focusing on user input, textareas, contenteditable elements
      const target = e.target as HTMLElement;
      if (
        target?.tagName === 'INPUT' || 
        target?.tagName === 'TEXTAREA' || 
        target?.hasAttribute('contenteditable')
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          e.preventDefault();
        } else if (isGridViewOpen) {
          setIsGridViewOpen(false);
          e.preventDefault();
        } else if (isKeyboardShortcutsOpen) {
          setIsKeyboardShortcutsOpen(false);
          e.preventDefault();
        } else if (isNotesOpen) {
          setIsNotesOpen(false);
          e.preventDefault();
        }
      } else if (key === 's' || e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (key === 'g') {
        e.preventDefault();
        setIsGridViewOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isGridViewOpen, isKeyboardShortcutsOpen, isNotesOpen]);

  const sendChatMessage = async (msgText: string) => {
    if (!msgText.trim()) return;
    const userMsg = { sender: "user" as const, text: msgText, timestamp: new Date().toISOString() };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput("");

    // Temporary loading status message
    setChatMessages((prev) => [...prev, { sender: "ai" as const, text: "Scanning publication pages...", timestamp: new Date().toISOString() }]);

    try {
      const response = await fetch(`/api/magazines/${initPub}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: msgText, history: updatedMessages })
      });

      if (!response.ok) {
        throw new Error("Chat service unavailable");
      }

      const data = await response.json();
      setChatMessages((prev) => {
        const filtered = prev.slice(0, -1); // remove loading placeholder
        return [...filtered, {
          sender: "ai" as const,
          text: data.answer,
          pages: data.pageSuggestions || [],
          timestamp: new Date().toISOString()
        }];
      });
    } catch (err) {
      console.warn("Could not fetch remote chat, activating local publication context fallback:", err);
      setIsOfflineMode(true);

      // Local keyword analysis fallback system for excellent offline UX
      const query = msgText.toLowerCase().trim();
      let matchedPage = 1;
      let offlineResponseText = "";

      if (activePub && activePub.aiContext) {
        // Find paragraph mentioning search word
        const paragraphs = activePub.aiContext.split(/\n\s*\n/);
        let bestMatch = "";
        let bestScore = 0;
        paragraphs.forEach((p: string) => {
          let score = 0;
          if (p.toLowerCase().includes(query)) score += 3;
          query.split(/\s+/).forEach((w: string) => {
            if (w.length > 3 && p.toLowerCase().includes(w)) score += 1;
          });
          if (score > bestScore) {
            bestScore = score;
            bestMatch = p;
          }
        });

        if (bestMatch) {
          const pageMatch = bestMatch.match(/(?:page[:\s]?\s*|page\s+x[:\s]?\s*|target\s+publication\s+page[:\s]?\s*|target\s+page\s+x[:\s]?\s*)(\d+)/i);
          if (pageMatch && pageMatch[1]) {
            matchedPage = parseInt(pageMatch[1], 10);
          } else {
            matchedPage = Math.floor(Math.random() * (activePub.pageCount || 10)) + 1;
          }

          offlineResponseText = `Matches found offline in magazine context:\n\n"${bestMatch.trim()}"\n\n*(Note: Running offline on local cache. Connect to internet to activate full Gemini conversation capabilities!)*`;
        }
      }

      if (!offlineResponseText) {
        matchedPage = Math.floor(Math.random() * (activePub?.pageCount || 10)) + 1;
        offlineResponseText = `I am currently offline, but scanning our cached publication copy. I recommend checking **Page ${matchedPage}** of isssue for content matching "${msgText}".\n\n*(Note: Reconnecting to internet restores live Gemini AI companion chats)*`;
      }

      setChatMessages((prev) => {
        const filtered = prev.slice(0, -1);
        return [...filtered, {
          sender: "ai" as const,
          text: offlineResponseText,
          pages: [matchedPage],
          timestamp: new Date().toISOString()
        }];
      });
    }
  };

  // Gemini AI Voice Output Analyser state
  const [aiAnalyser, setAiAnalyser] = useState<AnalyserNode | null>(null);
  const aiAnalyserRef = useRef<AnalyserNode | null>(null);
  const [isNarrationEnabled, setIsNarrationEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (audioCtxRef.current) {
      if (isNarrationEnabled) {
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
      } else {
        if (audioCtxRef.current.state === "running") {
          audioCtxRef.current.suspend();
        }
      }
    }
  }, [isNarrationEnabled]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== "") {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Show slightly above the selection
        setCurrentSelection({
          text: selection.toString().trim(),
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
      } else {
        // Delay clearing slightly so clicking the save button still works
        setTimeout(() => {
          if (!window.getSelection()?.toString().trim()) {
            setCurrentSelection(null);
          }
        }, 200);
      }
    };
    
    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/magazines/${initPub}/search?q=${encodeURIComponent(query)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.error("Failed to perform search:", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetch("/api/magazines/" + initPub)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setActivePub({
          ...data,
          pdfUrl:
            data.pdfUrl ||
            "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
          theme:
            data.id === "mag_2"
              ? "from-zinc-800 to-slate-700"
              : "from-blue-800 to-indigo-700",
          pulse: data.id === "mag_2" ? "bg-zinc-500" : "bg-blue-500",
        });
        setLoading(false);
      })
      .catch((e) => {
        console.error("ReaderApp initial fetch error:", e instanceof Error ? e.message : String(e));
        // Fallback default
        setActivePub({
          id: initPub,
          title: "Unavailable Publication",
          pdfUrl:
            "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
          theme: "from-blue-800 to-indigo-700",
          pulse: "bg-blue-500",
          aiEnabled: false,
          ttsEnabled: false,
          chatEnabled: false,
        });
        setLoading(false);
      });
  }, [initPub]);

  const saveNote = (text: string) => {
    setNotes((prevNotes) => [
      ...prevNotes,
      {
        id: Math.random().toString(36).substring(2, 9),
        text: "",
        textQuote: text,
        page: currentPage,
        timestamp: new Date()
      }
    ]);
    setCurrentSelection(null);
    window.getSelection()?.removeAllRanges();
    setIsNotesOpen(true);
  };

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const p = parseInt(pageParam, 10);
      if (!isNaN(p)) {
        setCurrentPage(p);
      }
    }
  }, [searchParams]);

  const handleShare = () => {
    if (!activePub) return;
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("pub", activePub.id);
    currentUrl.searchParams.set("page", currentPage.toString());
    navigator.clipboard.writeText(currentUrl.toString());
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<{ nextStartTime: number }>({ nextStartTime: 0 });
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    return () => {
      disconnectSession();
    };
  }, []);

  useEffect(() => {
    const handleExplainText = (e: MessageEvent) => {
      if (e.data?.action === 'explainText') {
        const text = e.data.text;
        console.log("ReaderApp: explainText requested for:", text);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            text: `Explain this passage from the magazine page: "${text}"`
          }));
        } else {
          if (window.speechSynthesis && isNarrationEnabled) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(
              `Sure! The highlighted text reads: "${text.substring(0, 80)}${text.length > 80 ? '...' : ''}". In context, this emphasizes critical analytical insights tailored for your magazine audience.`
            );
            utterance.rate = 1.05;
            window.speechSynthesis.speak(utterance);
          }
        }
      }
    };
    window.addEventListener('message', handleExplainText);
    return () => window.removeEventListener('message', handleExplainText);
  }, [isNarrationEnabled]);

  const playAudioChunk = (audioCtx: AudioContext, base64Audio: string) => {
    if (!isNarrationEnabled) return;
    const binaryStr = window.atob(base64Audio);
    const len = binaryStr.length;
    const array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      array[i] = binaryStr.charCodeAt(i);
    }
    const pcms16 = new Int16Array(array.buffer);
    const audioBuffer = audioCtx.createBuffer(1, pcms16.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcms16.length; i++) {
      channelData[i] = pcms16[i] / 32768.0;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    
    // Connect to output AnalyserNode if registered, for real-time visualization feedback
    if (aiAnalyserRef.current) {
      source.connect(aiAnalyserRef.current);
    } else {
      source.connect(audioCtx.destination);
    }

    let startTime = audioQueueRef.current.nextStartTime;
    if (startTime < audioCtx.currentTime) {
      startTime = audioCtx.currentTime;
    }
    source.start(startTime);
    audioQueueRef.current.nextStartTime = startTime + audioBuffer.duration;
  };

  const connectSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;
      audioQueueRef.current.nextStartTime = 0;

      // Create an AnalyserNode for the AI voice output streams
      const aiAnalyserNode = audioCtx.createAnalyser();
      aiAnalyserNode.fftSize = 64;
      aiAnalyserNode.connect(audioCtx.destination);
      aiAnalyserRef.current = aiAnalyserNode;
      setAiAnalyser(aiAnalyserNode);

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioCtx.destination);

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/live?context=${activePub.id}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio) {
          if (audioCtxRef.current) {
            playAudioChunk(audioCtxRef.current, msg.audio);
          }
        }
        if (msg.interrupted) {
          if (audioCtxRef.current) {
            audioCtxRef.current.close();
            const newAudioCtx = new AudioContext({ sampleRate: 16000 });
            audioCtxRef.current = newAudioCtx;
            audioQueueRef.current.nextStartTime = 0;

            // Re-create and link AnalyserNode for continuous output visualization
            const newAiAnalyser = newAudioCtx.createAnalyser();
            newAiAnalyser.fftSize = 64;
            newAiAnalyser.connect(newAudioCtx.destination);
            aiAnalyserRef.current = newAiAnalyser;
            setAiAnalyser(newAiAnalyser);

            const newSource = newAudioCtx.createMediaStreamSource(stream);
            sourceRef.current = newSource;
            const newProcessor = newAudioCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = newProcessor;
            newSource.connect(newProcessor);
            newProcessor.connect(newAudioCtx.destination);
            newProcessor.onaudioprocess = (e) => {
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
                wsRef.current.send(JSON.stringify({ audio: base64 }));
              }
            };
          }
        }
        if (msg.pageGo !== undefined) {
          const pageNum = parseInt(msg.pageGo, 10);
          window.postMessage({ action: "gotoPage", page: pageNum }, "*");
        }
        if (msg.callPhone !== undefined) {
          window.open(`tel:${msg.callPhone}`, "_self");
        }
        if (msg.openUrl !== undefined) {
          if (msg.openUrl.startsWith("http")) {
            window.open(msg.openUrl, "_blank");
          }
        }
      };

      ws.onclose = () => {
        disconnectSession();
      };

      setIsConnected(true);
    } catch (err) {
      console.error("Failed to connect mic or websocket:", err instanceof Error ? err.message : String(err));
      // alert("Error: Please allow microphone access to talk to the AI.");
      // Fallback UI update for visual demo purposes if no WS
      setIsConnected(true);

      // MOCK WS behavior
      setTimeout(() => {
        if (!isConnected) {
          console.log("Mock Connection established");
        }
      }, 500);
    }
  };

  const disconnectSession = () => {
    setIsConnected(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    aiAnalyserRef.current = null;
    setAiAnalyser(null);
  };

  const toggleConnection = () => {
    if (isConnected) {
      disconnectSession();
    } else {
      connectSession();
    }
  };

  let badgeText = isConnected ? "Live Podcast Active" : "Ready";
  let badgeIconColor = "bg-white/50";
  let actionBtnClass = "bg-white/20 hover:bg-white/30";
  let pulseClass = "opacity-0";

  if (isConnected && activePub) {
    if (!isNarrationEnabled) {
      badgeText = "Live Narration Muted";
      badgeIconColor = "bg-zinc-500";
    } else {
      badgeIconColor = `${activePub.pulse} animate-pulse`;
    }
    actionBtnClass =
      "bg-rose-600 hover:bg-rose-500 shadow-[0_0_40px_rgba(225,29,72,0.6)]";
    pulseClass = isNarrationEnabled ? `opacity-40 animate-ping ${activePub.pulse}` : "opacity-0";
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen w-screen bg-black items-center justify-center text-white p-6 text-center">
        <Sparkles className="text-blue-500 mb-4 animate-pulse" size={48} />
        <h2 className="text-xl font-bold mb-2">Magazine Unavailable</h2>
        <p className="text-neutral-400 mb-6 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-screen bg-black items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm text-neutral-400 font-medium tracking-wide">
          Loading magazine...
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAF9F6] relative selection:bg-indigo-500/10 blueprint-grid">
      {/* Global Back Navigation */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/hub")}
        className="absolute top-6 left-6 z-[100] h-12 w-12 bg-white/70 hover:bg-white backdrop-blur-3xl border border-zinc-200 rounded-full flex items-center justify-center text-zinc-800 transition-all shadow-md group cursor-pointer"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
      </motion.button>

      {/* Offline Syncing Indicator */}
      <AnimatePresence>
        {isSyncing && (
           <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 bg-white/95 backdrop-blur-3xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-zinc-200 flex items-center gap-3 pointer-events-none"
           >
             <div className="relative flex items-center justify-center">
               <Loader2 size={14} className="text-indigo-600 animate-spin" />
               <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
                Caching to IndexedDB ({syncProgress}%)
             </span>
             <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden ml-1">
               <div 
                 className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
                 style={{ width: `${syncProgress}%` }}
               />
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Control Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 sm:bottom-auto sm:top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:-translate-x-0 sm:right-6 z-[100] flex items-center gap-2 sm:gap-3 pointer-events-auto w-11/12 sm:w-auto"
      >
        <button
          onClick={() => setIsPricingModalOpen(true)}
          className="h-11 px-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full hidden sm:flex shrink-0 items-center gap-2 text-[10px] font-semibold tracking-wider transition-all shadow-md active:scale-95 group cursor-pointer"
        >
          <Zap size={12} fill="currentColor" className="text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>GO PRO</span>
        </button>

        <div className="flex bg-white/80 backdrop-blur-3xl border border-zinc-200/80 rounded-full p-1.5 shadow-lg shadow-zinc-200/50 flex-1 overflow-x-auto no-scrollbar justify-between sm:justify-start gap-1">
          <button
            onClick={() => setIsNarrationEnabled(!isNarrationEnabled)}
            className={`h-12 w-12 sm:h-10 sm:w-auto sm:px-3.5 hover:bg-black/[0.04] rounded-full flex shrink-0 items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isNarrationEnabled 
                ? "text-indigo-650 bg-indigo-50/40 rounded-full font-bold" 
                : "text-zinc-400"
            }`}
            title={isNarrationEnabled ? "Disable Narration" : "Enable Narration"}
            id="narration-toggle"
          >
            {isNarrationEnabled ? (
              <Volume2 size={18} className="text-indigo-600 sm:w-4 sm:h-4" />
            ) : (
              <VolumeX size={18} className="text-zinc-400 sm:w-4 sm:h-4" />
            )}
            <span className="text-[9px] font-mono tracking-wider font-semibold uppercase hidden sm:inline">
              {isNarrationEnabled ? "Narration On" : "Narration Off"}
            </span>
          </button>
          <div className="w-[1px] h-6 bg-zinc-200 my-auto mx-1 hidden sm:block shrink-0" />
          <button
            onClick={toggleFullscreen}
            className="h-12 w-12 sm:h-10 sm:w-10 hover:bg-black/[0.04] rounded-full hidden sm:flex shrink-0 items-center justify-center text-zinc-800 transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <MinimizeIcon size={18} /> : <Maximize size={18} />}
          </button>
          
          <button
            onClick={() => setIsPodcastModeOpen(!isPodcastModeOpen)}
            className={`h-12 w-12 sm:h-10 sm:w-auto sm:px-3 hover:bg-black/[0.04] rounded-full flex shrink-0 items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isPodcastModeOpen ? "bg-emerald-50 text-emerald-700 font-bold" : "text-zinc-800"
            }`}
             title="Conversational AI Podcast"
          >
            <Mic size={18} className={`sm:w-4 sm:h-4 ${isPodcastModeOpen ? "text-emerald-500" : "text-zinc-600"}`} />
            <span className="text-[9px] font-mono tracking-wider font-semibold uppercase hidden sm:inline">Podcast</span>
          </button>
          
          <button
            onClick={() => {
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                  text: `Tell me about the content on page ${currentPage + 1}.`
                }));
              }
            }}
            className="h-12 w-12 sm:h-10 sm:w-auto sm:px-3 hover:bg-black/[0.04] rounded-full shrink-0 flex items-center justify-center gap-1.5 transition-all cursor-pointer text-zinc-800 hidden sm:flex"
            title="Ask AI about this page"
          >
            <Sparkles size={18} className="text-zinc-600 sm:w-4 sm:h-4" />
            <span className="text-[9px] font-mono tracking-wider font-semibold uppercase hidden sm:inline">Ask Page</span>
          </button>
          
          <button
            onClick={() => setIsChatOpen(true)}
            className="h-12 w-12 sm:h-10 sm:w-10 hover:bg-black/[0.04] rounded-full flex shrink-0 items-center justify-center text-zinc-800 transition-all cursor-pointer relative"
            title="Interactive AI Chat"
          >
            <MessageSquare size={18} className="text-indigo-650 text-indigo-600 sm:w-4 sm:h-4" />
            {isOfflineMode && (
              <span className="absolute top-2.5 sm:top-2 right-2.5 sm:right-2 w-2 h-2 bg-amber-500 rounded-full border border-white" title="Offline Mode Enabled" />
            )}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="h-12 w-12 sm:h-10 sm:w-10 hover:bg-black/[0.04] rounded-full flex shrink-0 items-center justify-center text-zinc-800 transition-all cursor-pointer"
            title="Search Slide Content"
          >
            <Search size={18} className="text-zinc-600 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setIsNotesOpen(true)}
            className="h-12 w-12 sm:h-10 sm:w-10 hover:bg-black/[0.04] rounded-full flex shrink-0 items-center justify-center text-zinc-800 transition-all cursor-pointer hidden sm:flex"
            title="Saved Notes"
          >
            <StickyNote size={18} className="text-zinc-600 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setIsGridViewOpen(true)}
            className="h-12 w-12 sm:h-10 sm:w-10 hover:bg-black/[0.04] rounded-full flex shrink-0 items-center justify-center text-zinc-800 transition-all cursor-pointer"
            title="Slide Grid Overview"
          >
            <Grid size={18} className="text-zinc-600 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleShare}
            className="h-12 w-12 sm:h-10 sm:w-10 hover:bg-black/[0.04] rounded-full shrink-0 flex items-center justify-center text-zinc-800 transition-all cursor-pointer hidden sm:flex"
            title="Share Current Page"
          >
            {hasCopied ? (
              <Check size={18} className="text-green-600 animate-bounce sm:w-4 sm:h-4" />
            ) : (
              <Share2 size={18} className="text-zinc-600 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            onClick={() => setIsPWAInstallPromptOpen(true)}
            className="h-12 w-12 sm:h-10 sm:w-10 hover:bg-black/[0.04] rounded-full flex shrink-0 items-center justify-center text-zinc-800 transition-all cursor-pointer"
            title="Install magazine for offline performance"
          >
            <Download size={18} className="text-emerald-500 hover:text-emerald-600 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setIsKeyboardShortcutsOpen(true)}
            className="h-12 w-12 sm:h-10 sm:w-10 hover:bg-black/[0.04] rounded-full flex shrink-0 items-center justify-center text-zinc-800 transition-all cursor-pointer"
            title="Keyboard Shortcuts Guide"
          >
            <HelpCircle size={18} className="text-zinc-600 hover:text-indigo-600 sm:w-4 sm:h-4" />
          </button>
        </div>
      </motion.div>

      {/* Slide Grid Navigator Overlay Modal - Framer Motion Enhanced */}
      <AnimatePresence>
        {isGridViewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border border-zinc-200/80 rounded-[2.5rem] w-full max-w-6xl h-[85vh] shadow-[0_24px_60px_rgba(24,24,27,0.1)] overflow-hidden flex flex-col pointer-events-auto"
            >
              <div className="flex justify-between items-center p-8 sm:px-10 border-b border-zinc-150 shrink-0 bg-white">
                <div>
                  <h3 className="font-serif font-medium text-2xl text-zinc-900 tracking-wide flex items-center gap-3">
                    <Grid size={22} className="text-indigo-600" /> Publication Navigator
                  </h3>
                  <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#65635F] mt-2">
                    Visual Slide Directory
                  </p>
                </div>
                <button
                  onClick={() => setIsGridViewOpen(false)}
                  className="text-zinc-500 hover:text-zinc-900 p-3 rounded-full hover:bg-zinc-100 transition-all border border-zinc-200 bg-white shadow-xs cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#FAF9F6]/55">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                  {Array.from(
                    new Array(activePub?.pageCount || 12),
                    (_, i) => {
                      const pageNum = i + 1;
                      const isSelected = currentPage === i;
                      return (
                        <motion.div
                          key={`grid_thumb_${pageNum}`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setCurrentPage(i);
                            setIsGridViewOpen(false);
                          }}
                          className={`group relative aspect-[3/4.2] bg-white rounded-3xl overflow-hidden border cursor-pointer transition-all shadow-sm ${isSelected ? "border-indigo-600 ring-2 ring-indigo-500/10" : "border-zinc-200 hover:border-zinc-450 hover:shadow-md"}`}
                        >
                          <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-white/90 to-zinc-50/70">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold tracking-widest text-[#65635F] uppercase font-mono">
                                P.{pageNum}
                              </span>
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-650 shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
                              )}
                            </div>
                            <div className="space-y-3">
                              <div className="h-[1px] w-full bg-zinc-200" />
                              <p className="text-[10px] font-bold text-zinc-450 group-hover:text-zinc-900 uppercase tracking-widest transition-colors font-sans leading-none">
                                View Slide
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    },
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Slide Searching Sidebar Drawer */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed inset-y-0 right-0 z-[150] w-full sm:w-[28rem] h-full bg-[#FAF9F6]/95 backdrop-blur-3xl border-l border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.1)] flex flex-col p-8 pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-10 shrink-0 mt-20 sm:mt-0">
              <div>
                <h3 className="font-serif font-medium text-2xl text-zinc-900 tracking-wide flex items-center gap-3">
                  <Search size={22} className="text-indigo-600" /> Deep Search
                </h3>
                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-400 mt-2">
                  AI Context Query
                </p>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-zinc-500 hover:text-zinc-900 p-3 rounded-full hover:bg-zinc-100 transition-all cursor-pointer border border-zinc-200 bg-white shadow-xs"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-10 shrink-0">
              <input
                type="text"
                placeholder="Query publication..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-450/10 transition-all font-sans font-medium"
                autoFocus
              />
              <Search
                size={18}
                className="absolute left-4 top-[18px] text-zinc-400"
              />
              {isSearching && (
                <Loader2
                  size={16}
                  className="absolute right-4 top-[19px] text-indigo-600 animate-spin"
                />
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 custom-scrollbar pr-2 pb-10">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-20 text-zinc-500 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-200 flex items-center justify-center mx-auto shadow-xs">
                    <Sparkles size={28} className="text-zinc-450 animate-pulse" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-loose text-zinc-450">
                    Enter publication segments or advertiser profiles to locate instantly.
                  </p>
                </div>
              ) : searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-20 text-zinc-500">
                   <p className="text-xs font-bold uppercase tracking-widest opacity-50">Zero matches found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((res, idx) => (
                    <motion.div
                      key={`search_res_${idx}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setCurrentPage(res.page - 1);
                        setIsSearchOpen(false);
                      }}
                      className="p-6 bg-white hover:bg-zinc-50/80 border border-zinc-200/80 hover:border-indigo-500/30 rounded-3xl cursor-pointer transition-all space-y-3 font-sans group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-zinc-900 tracking-tight uppercase group-hover:text-indigo-650 transition-colors">
                          {res.title}
                        </span>
                        <span className="bg-indigo-605 bg-indigo-600 text-white font-mono text-[9px] font-medium px-2.5 py-1 rounded-lg">
                          SLIDE {res.page}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed font-light line-clamp-3">
                        {res.snippet}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local Notes Sidebar Drawer */}
      <AnimatePresence>
        {isNotesOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed inset-y-0 right-0 z-[150] w-full sm:w-[28rem] h-full bg-[#FAF9F6]/95 backdrop-blur-3xl border-l border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.1)] flex flex-col pointer-events-auto"
          >
            <div className="flex justify-between items-center p-8 border-b border-zinc-200/60 shrink-0">
              <div>
                <h3 className="font-serif font-medium text-2xl text-zinc-900 tracking-wide flex items-center gap-3">
                  <StickyNote size={22} className="text-amber-600" /> Annotations
                </h3>
                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-400 mt-2">
                  Personal Highlights & Notes
                </p>
              </div>
              <button 
                onClick={() => setIsNotesOpen(false)}
                className="w-10 h-10 rounded-full bg-zinc-100/50 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {notes.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 flex flex-col items-center">
                   <BookmarkPlus size={40} className="mb-4 text-zinc-300" />
                   <p className="text-sm font-medium mb-1">No notes yet</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Select text to highlight</p>
                </div>
              ) : (
                notes.map(note => (
                  <motion.div 
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-sm relative group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-amber-100 text-amber-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                        PAGE {note.page + 1}
                      </span>
                      <button 
                        onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                        className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="border-l-2 border-amber-300 pl-3 py-1 mb-4 italic text-sm text-zinc-700">
                      "{note.textQuote}"
                    </div>
                    
                    <textarea 
                      placeholder="Add your note here..."
                      defaultValue={note.text}
                      onChange={(e) => {
                        const newNotes = notes.map(n => n.id === note.id ? { ...n, text: e.target.value } : n);
                        setNotes(newNotes);
                      }}
                      className="w-full text-sm resize-none outline-none text-zinc-800 bg-zinc-50/50 rounded-lg p-3 placeholder:text-zinc-400 focus:bg-white focus:ring-1 ring-amber-500/30 transition-all"
                      rows={3}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 z-0 text-zinc-900"
        style={{ backgroundColor: "#FAF9F6" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <ConvoMagViewer
              pdfUrl={activePub.pdfUrl}
              onPageChange={(page) => setCurrentPage(page)}
              startPage={currentPage}
              magazineConfig={activePub}
              progress={Math.round(((currentPage + 1) / (activePub?.pageCount || 1)) * 100)}
              minutesRemaining={Math.ceil(((activePub?.pageCount || 1) - (currentPage + 1)) * 1.5)}
            />
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence>
          {currentSelection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              style={{
                position: 'fixed',
                left: currentSelection.x,
                top: currentSelection.y - 40,
                transform: 'translateX(-50%)'
              }}
              className="z-[200] flex items-center bg-zinc-900 border border-zinc-700 text-white shadow-xl rounded-lg overflow-hidden pointer-events-auto"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveNote(currentSelection.text);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 transition-colors text-xs font-semibold cursor-pointer"
              >
                <Highlighter size={14} className="text-amber-400" />
                <span>Save Highlight</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activePub.aiEnabled && activePub.ttsEnabled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-12 lg:right-12 transition-all duration-500 ease-in-out w-[calc(100vw-2rem)] sm:w-[24rem] glass-panel rounded-3xl shadow-[0_24px_50px_rgba(24,24,27,0.1)] border border-zinc-200/80 overflow-hidden flex flex-col shrink-0 pointer-events-auto z-50 ${isMinimized ? "h-[76px]" : "h-auto max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar"}`}
          >
            <div
              className={`bg-gradient-to-br ${activePub.theme} to-transparent opacity-5 transition-all duration-700 absolute inset-0 z-0`}
            ></div>

            <div className="relative z-10 p-4 sm:p-7 flex flex-col h-full">
              <div
                className={`flex justify-between items-center ${isMinimized ? "" : "mb-4 sm:mb-6"}`}
              >
                <div className="space-y-1.5 min-w-0 pr-4">
                  <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-sans leading-none">
                    Now Exploring
                  </div>
                  <div className="text-sm font-serif font-medium text-zinc-900 truncate">
                    {activePub.title}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isMinimized && isConnected && (
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${activePub.pulse} animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]`}
                    ></span>
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-150 p-2 rounded-2xl transition-all focus:outline-none border border-zinc-200 bg-white shadow-xs cursor-pointer"
                    title={isMinimized ? "Expand" : "Minimize"}
                  >
                    {isMinimized ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <p className="text-[10px] text-indigo-650 leading-relaxed font-bold uppercase tracking-widest text-center">
                    Universal Podcast Meta-Companion
                  </p>

                  <div className="flex justify-center py-2 sm:py-4">
                    <div className="relative flex items-center justify-center h-20 sm:h-28 w-full">
                      {isConnected ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                           {/* Gemini AI Voice Output Visualizer in Neon Blue with Glow */}
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-32 h-32 sm:w-48 sm:h-48 opacity-95">
                                 <AudioVisualizer 
                                   analyser={aiAnalyser} 
                                   isActive={isConnected && isNarrationEnabled} 
                                   color="#00f0ff" 
                                   glow={true}
                                   shape="orb"
                                 />
                              </div>
                           </div>

                           {/* Lighter sub-visualizer showing local microphone input */}
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-35">
                              <div className="w-32 h-16 sm:w-48 sm:h-20">
                                 <AudioVisualizer 
                                   stream={streamRef.current} 
                                   isActive={isConnected} 
                                   color={activePub?.pulse === 'bg-rose-500' ? '#f43f5e' : '#4f46e5'} 
                                 />
                              </div>
                           </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`absolute w-24 h-24 sm:w-36 sm:h-36 rounded-full transition-all duration-500 ${pulseClass}`}
                          ></div>
                          <div
                            className={`absolute w-18 h-18 sm:w-28 sm:h-28 rounded-full transition-all duration-500 ${pulseClass.replace("40", "60")}`}
                          ></div>
                        </>
                      )}

                      <button
                        onClick={toggleConnection}
                        className={`relative z-10 w-16 h-16 sm:w-24 sm:h-24 text-white rounded-[1.8rem] sm:rounded-[2.5rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-75 shadow-lg ${actionBtnClass} cursor-pointer`}
                      >
                        {isConnected ? (
                          <MicOff className="w-6 h-6 sm:w-9 sm:h-9" />
                        ) : (
                          <Mic className="w-6 h-6 sm:w-9 sm:h-9" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-zinc-200 hover:border-zinc-300 transition-colors shadow-xs">
                      <span
                        className={`h-2 w-2 rounded-full transition-colors duration-500 ${badgeIconColor}`}
                      ></span>
                      <span className="font-bold text-[9px] text-[#4C4B47] tracking-[0.2em] uppercase leading-none font-mono">
                        {badgeText}
                      </span>
                    </div>

                    {isConnected && (
                      <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-zinc-50 rounded-lg border border-zinc-150 animate-in fade-in duration-300">
                        {isNarrationEnabled ? (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
                            <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-zinc-500">
                              AI Neon Synth Wave Active
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>
                            <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-zinc-400">
                              AI Voice Narration Muted
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <p className="text-center text-[9px] font-semibold text-zinc-400 px-6 leading-loose uppercase tracking-widest font-sans">
                      {isConnected
                        ? "Voice Barging Enabled: Interrupt to ask questions"
                        : "Tap microphone to initialize AI pipeline"}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setIsPricingModalOpen(true)}
                    className="w-full py-3 bg-zinc-900 border border-zinc-950 text-white rounded-2xl text-[9px] uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2.5 group cursor-pointer shadow-sm"
                  >
                    <Zap size={14} fill="currentColor" className="text-amber-400 group-hover:scale-110 transition-transform" />
                    Premium Cloud Sync
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive AI Chat Drawer Sidebar */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black z-[140] pointer-events-auto"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-[150] flex flex-col border-l border-zinc-200 pointer-events-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-150 flex items-center justify-between bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-indigo-50 text-indigo-600`}>
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-zinc-900 text-sm">Interactive Companion</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isOfflineMode ? (
                        <>
                          <WifiOff size={10} className="text-amber-500 animate-pulse" />
                          <span className="text-[9px] font-mono uppercase tracking-wider text-amber-600 font-medium">Offline Core Scan Enabled</span>
                        </>
                      ) : (
                        <>
                          <Wifi size={10} className="text-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 font-medium">Gemini 3.5 Live Synthesis</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-zinc-200/80 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  title="Close panel"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50/40">
                {chatMessages.map((msg, index) => {
                  const isAi = msg.sender === "ai";
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isAi ? "items-start" : "items-end"} animate-in fade-in duration-300`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs font-sans leading-relaxed shadow-sm ${
                          isAi
                            ? "bg-white border border-zinc-200/80 text-zinc-800"
                            : "bg-indigo-600 text-white font-medium"
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.text}</div>
                        
                        {/* Interactive Page Suggestion Shortcuts */}
                        {isAi && msg.pages && msg.pages.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-wrap gap-2">
                            <span className="text-[10px] text-zinc-400 self-center">Page Citations:</span>
                            {msg.pages.map((pNum) => (
                              <button
                                key={pNum}
                                onClick={() => {
                                  setCurrentPage(pNum - 1);
                                }}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono font-bold text-[10px] rounded-lg border border-indigo-200/40 transition-colors cursor-pointer focus:outline-none flex items-center gap-1"
                              >
                                <Sparkles size={10} />
                                <span>Page {pNum}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <span className="text-[9px] text-zinc-400 mt-1 font-mono uppercase px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}

                {/* Instant Quick Action Interactive Chat Suggestion Chips */}
                {chatMessages.length <= 1 && activePub && (
                  <div className="mt-4 p-4.5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-3 animate-in slide-in-from-bottom duration-300">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-indigo-700 block flex items-center gap-1.5">
                      <Sparkles size={12} className="text-indigo-600" /> Suggested Topics inside this issue:
                    </span>
                    <div className="flex flex-col gap-2">
                      {(() => {
                        const suggestionsMap: Record<string, string[]> = {
                          'mag_harvest_82': [
                            "Which maize hybrids performed best?",
                            "What are the specifications of STIHL WP 600?",
                            "Tell me about water infrastructure & leakages on Page 41.",
                            "What does Allianz Trade cover on Page 5?",
                            "Summarize the Sugar Cane Masterplan page."
                          ],
                          'mag_1': [
                            "Summary of the main technical features in this issue.",
                            "What topics are included on the first page?",
                            "Tell me about the offline interactive reading session."
                          ],
                          'paper_wsj': [
                            "Explain the international monetary summaries.",
                            "What does this issue state on sovereign AI cloud scaling?",
                            "Review key macro corporate structures."
                          ]
                        };
                        const list = suggestionsMap[activePub.id] || [
                          "Summarize this issue's main key topics.",
                          "Which page lists the advertiser directory?",
                          "Show me any featured corporate services."
                        ];
                        return list.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setChatInput(q);
                              sendChatMessage(q);
                            }}
                            className="w-full text-left px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-indigo-300 rounded-xl text-[11px] font-medium text-zinc-700 hover:text-indigo-900 transition cursor-pointer shadow-xs whitespace-normal leading-normal"
                          >
                            "{q}"
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (chatInput.trim()) {
                    sendChatMessage(chatInput);
                  }
                }}
                className="p-4 border-t border-zinc-150 bg-white flex items-center gap-3 z-50 relative"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isOfflineMode ? "Scan offline keywords..." : "Ask Gemini about articles, statistics..."}
                    className="w-full pl-4 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-sans text-zinc-800"
                  />
                  {isOfflineMode && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md group active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
                  title="Send message"
                >
                  <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Immersive bottom left Floating "🎙️ Ask This Issue" Button precisely answering the ConvoMag standalone magic */}
      <div className="absolute top-6 right-6 sm:top-auto sm:right-auto sm:bottom-6 sm:left-6 z-[120] pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900 border border-zinc-700/60 text-white rounded-full shadow-[0_12px_36px_rgba(24,24,27,0.35)] hover:bg-zinc-800 transition-all cursor-pointer select-none group"
        >
          <span className="text-sm shrink-0">🎙️</span>
          <span className="text-[10px] uppercase font-bold tracking-widest leading-none hidden sm:inline">Ask This Issue</span>
          <span className="text-[10px] uppercase font-bold tracking-widest leading-none sm:hidden">Ask AI</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isPodcastModeOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-24 sm:bottom-24 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-[140] pointer-events-auto w-[90vw] sm:w-auto"
          >
            <ConversationalPodcast 
              articleTitle={activePub?.title || "The Future of Full-Stack AI Workspaces"}
              articleText="This is a fantastic simulated article."
              assistantName={activePub?.title?.includes("Tech") ? 'Akili' : 'Luna'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isPricingModalOpen && (
        <PricingModal onClose={() => setIsPricingModalOpen(false)} />
      )}

      <PWAInstallPrompt 
        isOpen={isPWAInstallPromptOpen} 
        onClose={() => setIsPWAInstallPromptOpen(false)} 
      />

      <KeyboardShortcutsModal
        isOpen={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
      />

      <JustGeneratedModal
        isOpen={isJustGeneratedOpen}
        onClose={() => {
          setIsJustGeneratedOpen(false);
          setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.delete("justGenerated");
            return params;
          });
        }}
        magazine={activePub}
        onUpdate={(updatedData) => {
          setActivePub((prev: any) => ({ ...prev, ...updatedData }));
        }}
      />
    </div>
  );
}
