// src/components/MagazineFlipbook.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';

export interface Citation {
  chunkId: string;
  documentId: string;
  pageNumber: number;
  boundingBox: [number, number, number, number]; // Coordinates format: [left, bottom, right, top]
  quote: string;
}

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
}

interface MagazineFlipbookProps {
  documentId: string;
  pagesUrls: string[]; // High-fidelity raster pages representing index layers
}

export const MagazineFlipbook: React.FC<MagazineFlipbookProps> = ({ documentId, pagesUrls }) => {
  const bookRef = useRef<any>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeCitations, setActiveCitations] = useState<Citation[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Initialize canvas refs array
  useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, pagesUrls.length);
  }, [pagesUrls]);

  // Clear previous highlighted paths before redraws
  const clearCanvasDrawings = () => {
    canvasRefs.current.forEach((canvas) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  };

  // Renders visual overlays from RAG citation coordinates 
  const renderOverlays = useCallback(() => {
    clearCanvasDrawings();

    activeCitations.forEach((cit) => {
      const pageIdx = cit.pageNumber - 1;
      const canvas = canvasRefs.current[pageIdx];
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const canvasBounds = canvas.getBoundingClientRect();
      const scaleX = canvas.width / canvasBounds.width;
      const scaleY = canvas.height / canvasBounds.height;

      // Extract coordinates: [left, bottom, right, top] in PDF points
      const [left, bottom, right, top] = cit.boundingBox;

      // Normalize PDF coordinate systems (792 points standard height)
      // Note: Coordinates in PDF usually have origin at bottom-left.
      // We convert to canvas coordinate system (top-left).
      const x = left * (canvas.width / 612); // Assuming 612 standard point width
      const y = (792 - top) * (canvas.height / 792); 
      const width = (right - left) * (canvas.width / 612);
      const height = (top - bottom) * (canvas.height / 792);

      ctx.save();
      ctx.fillStyle = 'rgba(255, 235, 59, 0.45)'; // Semi-transparent yellow highlight 
      ctx.strokeStyle = 'rgba(230, 81, 0, 0.9)';   // High-contrast orange border
      ctx.lineWidth = 2;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
      ctx.restore();
    });
  }, [activeCitations]);

  useEffect(() => {
    renderOverlays();
  }, [renderOverlays]);

  const handlePageSelection = useCallback((e: any) => {
    setCurrentPageIndex(e.data);
  }, []);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');

    try {
      const res = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, query }),
      });
      const data = await res.json();

      const assistantMessage: ChatMessage = {
        sender: 'assistant',
        text: data.answer,
        citations: data.citations,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.citations && data.citations.length > 0) {
        setActiveCitations(data.citations);
        
        // Flip directly to the page containing the first cited chunk
        const targetPage = data.citations[0].pageNumber - 1;
        if (bookRef.current) {
          bookRef.current.pageFlip().flip(targetPage);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Error retrieving grounded context.' },
      ]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-neutral-900 text-white overflow-hidden">
      {/* 3D Page Render Canvas Block */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <button
          onClick={() => { setActiveCitations([]); clearCanvasDrawings(); }}
          className="absolute top-4 left-4 bg-neutral-800 hover:bg-neutral-750 px-4 py-2 text-sm rounded shadow z-50"
        >
          Clear Overlays
        </button>

        <div className="relative shadow-2xl rounded-lg overflow-hidden bg-neutral-950">
          {/* @ts-ignore */}
          <HTMLFlipBook
            width={550}
            height={750}
            size="fixed"
            minWidth={300}
            maxWidth={800}
            minHeight={400}
            maxHeight={1100}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.6}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handlePageSelection}
            ref={bookRef}
            className="book-canvas-wrap"
          >
            {pagesUrls.map((url, index) => (
              <div key={index} className="relative w-full h-full bg-white flex items-center justify-center shadow-lg">
                <img
                  src={url}
                  alt={`Magazine page ${index + 1}`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
                <canvas
                  ref={(el) => { canvasRefs.current[index] = el; }}
                  width={550}
                  height={750}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
        <div className="mt-4 text-sm text-neutral-400">
          Showing Page {currentPageIndex + 1} of {pagesUrls.length}
        </div>
      </div>

      {/* Interactive Sidebar Panel */}
      <div className="w-[420px] border-l border-neutral-800 bg-neutral-950 flex flex-col h-full z-50">
        <div className="p-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold">Grounded Interactive Assistant</h3>
        </div>

        {/* Dynamic Log List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-lg max-w-[85%] text-sm ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-200'
              }`}>
                {msg.text}
              </div>
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {msg.citations.map((cit, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (bookRef.current) {
                          bookRef.current.pageFlip().flip(cit.pageNumber - 1);
                        }
                      }}
                      className="text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-indigo-400 px-2 py-1 rounded"
                    >
                      p. {cit.pageNumber}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Control UI */}
        <form onSubmit={handleQuerySubmit} className="p-4 border-t border-neutral-800 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about this page..."
            className="flex-1 rounded bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-sm font-medium">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
