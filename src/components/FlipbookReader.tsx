import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Settings, 
  Play, 
  Pause,
  Headphones,
  Info,
  ExternalLink,
  Layers
} from 'lucide-react';
import AIAssistant from './AIAssistant';
import { MagazineFlipbook } from './MagazineFlipbook';

interface Magazine {
  id: string;
  title: string;
  pdfUrl: string;
  themeBackground: string;
  pages?: string[];
}

export default function FlipbookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  
  // Example page URLs if none provided by API
  const defaultPages = [
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800',
  ];

  useEffect(() => {
    fetchMagazine();
  }, [id]);

  const fetchMagazine = async () => {
    try {
      const res = await fetch(`/api/magazines/${id}`);
      const data = await res.json();
      setMagazine(data);
    } catch (err) {
      console.error("Failed to fetch magazine", err);
    }
  };

  if (!magazine) return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <Layers className="text-zinc-800 animate-pulse" size={64} />
    </div>
  );

  return (
    <div className="h-screen w-screen bg-zinc-950">
       <div className="absolute top-4 left-4 z-[60] flex items-center gap-4">
          <button 
            onClick={() => navigate('/hub')}
            className="p-2 bg-zinc-900/50 hover:bg-zinc-800 backdrop-blur-md rounded-full text-zinc-400 hover:text-white transition-all border border-zinc-800"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-zinc-400 font-bold tracking-tight text-xs uppercase bg-zinc-900/50 px-3 py-1.5 backdrop-blur-md border border-zinc-800 rounded-lg">{magazine.title}</h1>
      </div>

      <MagazineFlipbook 
        documentId={magazine.id} 
        pagesUrls={magazine.pages || defaultPages} 
      />
    </div>
  );
}
