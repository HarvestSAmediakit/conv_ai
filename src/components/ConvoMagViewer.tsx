import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page as ReactPdfPage, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import HTMLFlipBook from 'react-pageflip';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Sparkles, BookOpen } from 'lucide-react';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Synthesize a realistic paper turning and rustling sound with Web Audio API
const playFlipSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Create a white noise buffer
    const bufferSize = ctx.sampleRate * 0.35; // 350ms duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Apply a bandpass filter to sound like sliding paper sheets
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.3);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Apply lowpass filter to remove excessive high frequencies
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(2200, ctx.currentTime);

    // Envelope node (fade-in quickly, fade-out smoothly)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    noiseSource.connect(filter);
    filter.connect(lpFilter);
    lpFilter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
    noiseSource.stop(ctx.currentTime + 0.35);
  } catch (err) {
    console.warn("Audio flip feedback synthesis failed:", err);
  }
};

// Toolbar Component
const Toolbar = ({ totalPages, currentPage, onPageChange, onZoomIn, onZoomOut, isDrawingMode, onToggleDrawing, progress, minutesRemaining }: any) => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-950/20 backdrop-blur-xl text-zinc-200 px-5 py-2 rounded-full flex flex-col items-center gap-1.5 shadow-xl z-50 pointer-events-auto border border-white/10" style={{ zIndex: 1000 }}>
    <div className="flex items-center gap-4">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="hover:text-white disabled:opacity-30 transition-colors shrink-0 text-[10px] font-medium uppercase tracking-widest cursor-pointer"
      >
        Prev
      </button>
      
      <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono font-medium text-zinc-400">
        <span className="text-white">{currentPage}</span>
        <span>/</span>
        <span>{totalPages}</span>
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="hover:text-white disabled:opacity-30 transition-colors shrink-0 text-[10px] font-medium uppercase tracking-widest cursor-pointer"
      >
        Next
      </button>

      <div className="w-px h-4 bg-white/10 shrink-0"></div>
      
      <div className="flex items-center gap-3 shrink-0">
        <button onClick={onToggleDrawing} className={`text-xs hover:text-white transition-colors ${isDrawingMode ? 'text-indigo-400' : 'text-zinc-500'} cursor-pointer`} title="Draw">✍️</button>
        <button onClick={onZoomOut} className="text-xs hover:text-white transition-colors text-zinc-500 cursor-pointer" title="Zoom Out">−</button>
        <button onClick={onZoomIn} className="text-xs hover:text-white transition-colors text-zinc-500 cursor-pointer" title="Zoom In">+</button>
      </div>
    </div>
    {/* Reading Progress Indicator */}
    <div className="w-full flex items-center justify-between text-[9px] text-zinc-400 gap-2">
      <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <span className="font-mono">{minutesRemaining} min left</span>
    </div>
  </div>
);

// Drawing Overlay Component
const DrawingOverlay = ({ isDrawingMode, pageNumber, drawings, onUpdateDrawings, width, height }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPath = useRef<Array<{x: number, y: number}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Redraw all saved drawings
    ctx.strokeStyle = 'rgba(255, 235, 59, 0.5)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    drawings.forEach((pathJson: string) => {
      const path = JSON.parse(pathJson);
      if (path.length > 2) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length - 1; i++) {
          const p1 = path[i];
          const p2 = path[i+1];
          const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
          ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        }
        ctx.stroke();
      } else if (path.length > 0) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach((point: {x: number, y: number}) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      }
    });
  }, [drawings, width, height]);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    if (!isDrawingMode) return;
    setIsDrawing(true);
    currentPath.current = [getCoordinates(e)];
  };

  const draw = (e: any) => {
    if (!isDrawing || !isDrawingMode) return;
    const pos = getCoordinates(e);
    currentPath.current.push(pos);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = 'rgba(255, 235, 59, 0.5)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentPath.current.length < 3) {
      ctx.beginPath();
      ctx.moveTo(currentPath.current[0].x, currentPath.current[0].y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      return;
    }

    const p0 = currentPath.current[currentPath.current.length - 3];
    const p1 = currentPath.current[currentPath.current.length - 2];
    const p2 = pos;
    const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onUpdateDrawings([...drawings, JSON.stringify(currentPath.current)]);
      currentPath.current = [];
    }
  };

  if (!isDrawingMode) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[100] touch-none cursor-crosshair"
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
};

// @ts-ignore - react-pageflip doesn't have ideal TS types for the ref
const FlipPage = React.forwardRef(({ pageNumber, width, height, overlayType, isDrawingMode, drawings, onUpdateDrawings }: { pageNumber: number, width: number, height: number, overlayType?: string | null, isDrawingMode: boolean, drawings: string[], onUpdateDrawings: (data: string[]) => void }, ref: any) => {
  return (
    <div 
      ref={ref} 
      className="page-wrapper relative bg-white shadow-[10px_0_30px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center border-l border-zinc-100"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-full relative"
      >
        <DrawingOverlay 
          isDrawingMode={isDrawingMode} 
          pageNumber={pageNumber} 
          drawings={drawings} 
          onUpdateDrawings={onUpdateDrawings} 
          width={width}
          height={height}
        />
        <ReactPdfPage 
          pageNumber={pageNumber} 
          width={width} 
          height={height} 
          renderTextLayer={true} 
          renderAnnotationLayer={true}
          loading={<div className="animate-pulse bg-zinc-100 w-full h-full"></div>} 
        />
      </motion.div>
      {overlayType === 'leads-form' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-xs bg-white/95 backdrop-blur border border-zinc-200 p-6 rounded-2xl shadow-2xl z-50 pointer-events-auto">
          <h3 className="font-serif font-medium text-zinc-900 mb-1 text-lg">Subscribe to Updates</h3>
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-4 font-mono">Reader Subscription Portal</p>
          <input type="email" placeholder="Enter your email" className="w-full border border-zinc-200 bg-white p-3 rounded-xl mb-4 text-xs text-black focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans" />
          <button className="w-full bg-zinc-900 text-white py-3 rounded-xl hover:bg-zinc-800 transition-all text-xs font-bold tracking-wider uppercase">
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
});

export default function ConvoMagViewer({ 
  pdfUrl, 
  onPageChange, 
  startPage = 0, 
  magazineConfig,
  progress = 0,
  minutesRemaining = 0
}: { 
  pdfUrl: string, 
  onPageChange?: (pageIndex: number) => void, 
  startPage?: number, 
  magazineConfig?: any,
  progress?: number,
  minutesRemaining?: number
}) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 400, height: 600 });
  const [pageAspect, setPageAspect] = useState<number>(0.707); // Default A4 aspect ratio (width / height)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [internalCurrentPage, setInternalCurrentPage] = useState(startPage + 1);
  
  const bookRef = useRef<any>(null);
  const transformRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse local visual customizations
  const hardcover = !!(magazineConfig?.hardcover);
  const soundEnabled = magazineConfig?.soundEnabled !== undefined ? !!magazineConfig.soundEnabled : true;
  const rtl = !!(magazineConfig?.rtl);
  const themeBackground = magazineConfig?.themeBackground || 'slate';
  const logoUrl = magazineConfig?.logoUrl || '';
  const pageTransitionsSpeed = magazineConfig?.pageTransitionsSpeed !== undefined ? Number(magazineConfig.pageTransitionsSpeed) : 800;

  // Selected-text sparkles explanation tooltip state
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedTextCoords, setSelectedTextCoords] = useState<{ x: number, y: number } | null>(null);

  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [pageDrawings, setPageDrawings] = useState<Record<number, string[]>>({}); // pageNumber -> array of stroke data

  // Detect if the target pdfUrl is actually an interactive FlippingBook link or general webpage rather than a raw PDF
  const isWebpage = pdfUrl && pdfUrl.startsWith('http') && !pdfUrl.toLowerCase().endsWith('.pdf') && !pdfUrl.includes('/uploads/');

  // Container sizing with ResizeObserver to prevent any off-screen clipping
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(() => updateSize());
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Compute fitting width and height dynamically based on portrait/landscape screen aspect ratio
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0 || isWebpage) return;

    const isPortrait = containerSize.width < containerSize.height;

    // Set precise margins to leave room for top navbar, bottom toolbar, and floaters on mobile
    const topMargin = isPortrait ? 90 : 80;
    const bottomMargin = isPortrait ? 150 : 90; // extra breathing room at bottom on portrait phones/tablets for control bars
    const leftRightMargin = isPortrait ? 24 : 48;

    const availableWidth = containerSize.width - leftRightMargin;
    const availableHeight = containerSize.height - (topMargin + bottomMargin);

    let height = availableHeight;
    let width = height * pageAspect;

    if (isPortrait) {
      // Single page view fits available screen dimensions
      if (width > availableWidth) {
        width = availableWidth;
        height = width / pageAspect;
      }
    } else {
      // Landscape double-page spread view (two pages side-by-side)
      if (2 * width > availableWidth) {
        width = availableWidth / 2;
        height = width / pageAspect;
      }
    }

    // Secondary safety bound validation to guarantee zero content cutoff
    if (height > availableHeight) {
      height = availableHeight;
      width = height * pageAspect;
    }

    setPageDimensions({
      width: Math.floor(Math.max(100, width)),
      height: Math.floor(Math.max(150, height))
    });
  }, [containerSize, pageAspect, isWebpage]);

  // AI Context Logic: Handle text selection popover coordinates
  useEffect(() => {
    const handleTextSelection = (e: MouseEvent) => {
      // If client finishes selecting text
      const selection = window.getSelection();
      const txt = selection?.toString().trim() || '';

      if (txt.length > 0) {
        // Find center of current viewing area or click coordinates for placement
        setSelectedText(txt);
        setSelectedTextCoords({ x: e.clientX, y: e.clientY - 30 });
      } else {
        setSelectedText('');
        setSelectedTextCoords(null);
      }
    };

    window.addEventListener('mouseup', handleTextSelection);
    return () => window.removeEventListener('mouseup', handleTextSelection);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't flip if typing in an input, textarea, or contenteditable
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === 'INPUT' || 
        activeEl?.tagName === 'TEXTAREA' || 
        activeEl?.hasAttribute('contenteditable')
      ) {
        return;
      }
      
      if (!bookRef.current) return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'n' || e.key === 'N') {
         bookRef.current.pageFlip().flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'p' || e.key === 'P') {
         bookRef.current.pageFlip().flipPrev();
      } else if (e.key === ' ' || e.code === 'Space') {
         e.preventDefault(); // Prevents page scrolling down
         if (e.shiftKey) {
            bookRef.current.pageFlip().flipPrev();
         } else {
            bookRef.current.pageFlip().flipNext();
         }
      } else if (e.key === 'Home') {
         e.preventDefault();
         bookRef.current.pageFlip().turnToPage(0);
      } else if (e.key === 'End' && numPages) {
         e.preventDefault();
         bookRef.current.pageFlip().turnToPage(numPages - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages]);

  const onDocumentLoadSuccess = (pdfProxy: any) => {
    setNumPages(pdfProxy.numPages);

    pdfProxy.getPage(1).then((page: any) => {
      const viewport = page.getViewport({ scale: 1 });
      const aspect = viewport.width / viewport.height;
      setPageAspect(aspect);
    });
  };

  const handlePageFlip = useCallback((e: any) => {
    const newPage = e.data + 1;
    setInternalCurrentPage(newPage);
    
    // Synthesize physical turn sounds
    if (soundEnabled) {
      playFlipSound();
    }

    console.log(`📈 Analytics: Tracked dwell time & flip to page ${newPage}`);
    if (onPageChange) {
      onPageChange(e.data);
    }
  }, [onPageChange, soundEnabled]);

  const goToPage = useCallback((page: number) => {
    let p = Math.max(1, Math.min(page, numPages || 1));
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPage(p - 1); // 0-based
    }
  }, [numPages]);

  // Turn page dynamically when parent changes the state (e.g. from Search or Grid navigation)
  useEffect(() => {
    if (bookRef.current && startPage !== undefined) {
      try {
        const bookPageFlip = bookRef.current.pageFlip();
        if (bookPageFlip) {
          const bookCurrent = bookPageFlip.getCurrentPageIndex();
          if (bookCurrent !== startPage) {
            bookPageFlip.turnToPage(startPage);
          }
        }
      } catch (err) {
        console.warn("Could not transition page flip: ", err);
      }
    }
  }, [startPage]);

  // Expose a way to navigate via window event (for the websocket commands)
  useEffect(() => {
    const handleNavigation = (e: MessageEvent) => {
      if (e.data?.action === 'gotoPage' && bookRef.current) {
        try {
          const targetPage = Math.max(0, e.data.page - 1);
          bookRef.current.pageFlip().turnToPage(targetPage);
        } catch (err) {
           console.error("Could not turn page", err instanceof Error ? err.message : String(err));
        }
      }
    };
    window.addEventListener('message', handleNavigation);
    return () => window.removeEventListener('message', handleNavigation);
  }, []);

  const getOverlay = (pageIndex: number) => {
    // Show a lead form on page 4 as a default annotation
    if (pageIndex === 4) return 'leads-form';
    return null;
  };

  // Webpage rendering (If the PDF is actually a FlippingBook online pub / iframe compatible link)
  if (isWebpage) {
    return (
      <div className="w-full h-full bg-zinc-950 flex flex-col justify-between items-center relative p-4 animate-fade-in">
        <div className="w-full h-[calc(100%-60px)] bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-white/5">
          <iframe 
            src={pdfUrl} 
            className="w-full h-full border-0 bg-transparent" 
            title="Interactive Flipbook"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          />
        </div>
        <div className="h-10 flex items-center justify-center bg-white/5 backdrop-blur border border-white/10 px-6 rounded-full self-center">
          <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-indigo-400">FLIPPINGBOOK DIGITAL EM-AGAZINE PLAYER</span>
        </div>
      </div>
    );
  }

  const finalFileSource = React.useMemo(() => {
    if (!pdfUrl) return '';
    if (pdfUrl.startsWith('/') || pdfUrl.startsWith('blob:') || pdfUrl.includes('/api/proxy-pdf')) {
      return pdfUrl;
    }
    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
      return `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`;
    }
    return pdfUrl;
  }, [pdfUrl]);

  // Translate background string into aesthetic backdrops
  const getThemeClass = (theme: string) => {
    switch (theme) {
      case 'wooden': // warm chestnut oak desk
        return "bg-[#1f1a17]"; 
      case 'sand': // warm high-end beige paper matte desk
        return "bg-[#EFEBE4]";                
      case 'ocean': // deep sapphire/navy blue desk
        return "bg-[#0B1527]"; 
      case 'obsidian': // matte dark obsidian
        return "bg-[#09090B]"; 
      case 'brushed-steel': // industrial slate layout
        return "bg-[#1E2024]"; 
      case 'slate':
      default:
        return "bg-[#121213]";
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`viewer-container relative flex justify-center items-center w-full h-full overflow-hidden transition-all duration-700 ${getThemeClass(themeBackground)}`}
    >
      <AnimatePresence>
        {(!numPages || pageDimensions.width === 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center ${themeBackground === 'sand' ? 'bg-[#FAF9F6] text-zinc-900' : 'bg-[#09090b] text-white'}`}
          >
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-550 rounded-full animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500/60 animate-pulse">
              Calibrating Digital Edition
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand logo overlay watermark */}
      {logoUrl && (
        <div className="absolute top-6 left-6 z-40 pointer-events-none flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-lg">
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="h-5 object-contain" 
            onError={(e) => { (e.target as any).style.display = 'none'; }} 
          />
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-wider text-zinc-400 font-mono font-bold leading-none">PREMIERE PUBLICATION</span>
            <span className="text-[11px] font-serif font-bold text-white mt-0.5">{magazineConfig?.title || "ConvoMag"}</span>
          </div>
        </div>
      )}

      {/* Floating text-selection action menu with sparkles */}
      <AnimatePresence>
        {selectedText && selectedTextCoords && (
          <motion.button
            key="ai-text-popover"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            onClick={() => {
              window.postMessage({ action: 'explainText', text: selectedText }, '*');
              setSelectedText('');
              setSelectedTextCoords(null);
            }}
            className="absolute z-50 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] py-2.5 px-4 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 active:scale-95 cursor-pointer select-none"
            style={{ 
              left: `${selectedTextCoords.x}px`, 
              top: `${selectedTextCoords.y}px`, 
              transform: 'translate(-50%, -100%)',
              filter: 'drop-shadow(0 10px 15px rgba(79, 70, 229, 0.4))'
            }}
          >
            <Sparkles size={13} className="text-amber-300 animate-pulse" />
            <span>EXPLAIN WITH CONVOMAG AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: numPages ? 1 : 0, scale: numPages ? 1 : 0.98 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full h-full flex flex-col justify-center items-center"
      >
        {numPages && pageDimensions.width > 0 && (
          <Toolbar 
            totalPages={numPages} 
            currentPage={internalCurrentPage} 
            onPageChange={goToPage}
            onZoomIn={() => transformRef.current?.zoomIn()}
            onZoomOut={() => transformRef.current?.zoomOut()}
            isDrawingMode={isDrawingMode}
            onToggleDrawing={() => setIsDrawingMode(!isDrawingMode)}
            progress={progress}
            minutesRemaining={minutesRemaining}
          />
        )}

        <Document 
          file={finalFileSource} 
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("PDF Load Error:", error instanceof Error ? error.message : String(error))}
          loading={null}
          className="w-full h-full flex flex-col justify-center items-center"
        >
          {numPages && pageDimensions.width > 0 && (
            <div className="w-full h-full">
              <TransformWrapper
                ref={transformRef}
                initialScale={1}
              minScale={0.5}
              maxScale={4}
              wheel={{ step: 0.1, disabled: true }} // Disable mouse wheel zoom to prevent conflict with scrolling
              pinch={{ disabled: false }}
              doubleClick={{ disabled: false }}
            >
              <TransformComponent 
                wrapperClass="w-full h-full" 
                contentClass="w-full h-full"
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{ width: '100%', height: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                  {/* @ts-ignore - react-pageflip types are slightly outdated */}
                  <HTMLFlipBook
                    ref={bookRef}
                    key={numPages}
                    width={pageDimensions.width}
                    height={pageDimensions.height}
                    size="fixed"
                    minWidth={10}
                  maxWidth={3000}
                  minHeight={10}
                  maxHeight={4000}
                  showCover={true}
                  startPage={startPage}
                  mobileScrollSupport={true}
                  maxShadowOpacity={0.45}
                  usePortrait={containerSize.width < containerSize.height}
                  onFlip={handlePageFlip}
                  flippingTime={pageTransitionsSpeed}
                  drawShadow={true}
                  showPageCorners={hardcover}
                  className="mx-auto select-text"
                  style={{ margin: 'auto' }}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <FlipPage 
                      key={`page_${index + 1}`} 
                      pageNumber={index + 1} 
                      width={pageDimensions.width}
                      height={pageDimensions.height}
                      overlayType={getOverlay(index + 1)}
                      isDrawingMode={isDrawingMode}
                      drawings={pageDrawings[index + 1] || []}
                      onUpdateDrawings={(newDrawings: string[]) => setPageDrawings(prev => ({ ...prev, [index + 1]: newDrawings }))}
                    />
                  ))}
                  </HTMLFlipBook>
                </div>
              </TransformComponent>
            </TransformWrapper>
            </div>
          )}
        </Document>
      </motion.div>
    </div>
  );
}
