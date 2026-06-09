"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  Variants
} from "framer-motion";
import { cn } from "@/lib/utils";
import { X, BookOpen, Activity } from "lucide-react";

// Defines the structured schema for ConvoMag publication cards
export type ImageItem = {
  id: number | string;
  title: string;
  desc: string;
  url: string;
  span: string; // Tailwind CSS grid span classes (e.g., "md:col-span-2 md:row-span-2")
  pages: number;
  status: "ready" | "processing" | "failed";
  updatedAt: string;
  path: string;
};

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[];
  title: string;
  description: string;
  onLaunchReader?: (item: ImageItem) => void;
  onViewAnalytics?: (item: ImageItem) => void;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const ImageModal = ({
  item,
  onClose,
  onLaunch,
}: {
  item: ImageItem;
  onClose: () => void;
  onLaunch?: (item: ImageItem) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl p-6 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col md:flex-row gap-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full md:w-1/2 aspect-[3/4] rounded-lg overflow-hidden border border-zinc-850 bg-zinc-900 flex-shrink-0">
          <img
            src={item.url}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        
        <div className="flex flex-col justify-between flex-1 py-2 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn(
                "px-2.5 py-0.5 rounded text-[10px] font-mono border backdrop-blur-md font-semibold tracking-wider",
                item.status === "ready" 
                 ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" 
                  : item.status === "processing"
                 ? "bg-amber-950/40 text-amber-400 border-amber-500/30 animate-pulse"
                  : "bg-red-950/40 text-red-400 border-red-500/30"
              )}>
                {item.status.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {item.pages} PAGES • COMPILED {item.updatedAt}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{item.desc}</p>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            {item.status === "ready" && onLaunch && (
              <button
                onPointerDownCapture={(e) => e.stopPropagation()} // Stop drag interaction events from bubbling
                onClick={() => {
                  onLaunch(item);
                  onClose();
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-650/15 cursor-pointer"
              >
                <BookOpen size={14} />
                Open Premium 3D Flipbook UI
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs py-3 px-6 rounded-lg transition-all cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </motion.div>
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-white/80 hover:text-white transition-colors cursor-pointer p-2 bg-zinc-900/60 rounded-full border border-zinc-850 backdrop-blur-sm shadow-xl"
        aria-label="Close modal viewer"
      >
        <X size={20} />
      </button>
    </motion.div>
  );
};

export function InteractiveImageBentoGallery({
  imageItems,
  title,
  description,
  onLaunchReader,
  onViewAnalytics
}: InteractiveImageBentoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null);
  const [dragConstraint, setDragConstraint] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  // Dynamically compute horizontal drag boundaries based on screen size
  useEffect(() => {
    const calculateConstraints = () => {
      if (gridRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const gridWidth = gridRef.current.scrollWidth;
        const newConstraint = Math.min(0, containerWidth - gridWidth - 32);
        setDragConstraint(newConstraint);
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);
    return () => window.removeEventListener("resize", calculateConstraints);
  }, [imageItems]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden bg-black py-16 sm:py-24"
    >
      <motion.div
        style={{ opacity, y }}
        className="container mx-auto px-4 text-center z-10 relative mb-8"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400 font-mono text-sm">
          {description}
        </p>
      </motion.div>

      <div
        ref={containerRef}
        className="relative mt-12 w-full cursor-grab active:cursor-grabbing overflow-visible"
      >
        <motion.div
          className="w-max"
          drag="x"
          dragConstraints={{ left: dragConstraint, right: 0 }}
          dragElastic={0.05}
        >
          <motion.div
            ref={gridRef}
            className="grid auto-cols-[minmax(18rem,1fr)] grid-flow-col gap-4 px-4 md:px-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {imageItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={cn(
                  "group relative flex h-full min-h-[18rem] w-full min-w-[18rem] cursor-pointer items-end overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950 p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  item.span,
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onTap={() => setSelectedItem(item)} // Framer Motion onTap isolates clicks from drags
                onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
                tabIndex={0}
                aria-label={`View publication ${item.title}`}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-70 group-hover:opacity-100"
                  draggable={false}
                />
                
                {/* Visual Status Badges */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <span className="bg-black/80 text-white border border-zinc-800 backdrop-blur-md text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                    {item.pages} PGS
                  </span>
                  <span className={cn(
                    "backdrop-blur-md text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border",
                    item.status === "ready" 
                     ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" 
                      : "bg-amber-950/40 text-amber-400 border-amber-500/30 animate-pulse"
                  )}>
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 w-full text-left">
                  <h3 className="text-lg font-bold text-white leading-tight mb-1">{item.title}</h3>
                  <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed mb-3">{item.desc}</p>
                  
                  {/* Action Elements with Event Propagation Stops */}
                  <div className="flex gap-2">
                    {onLaunchReader && item.status === "ready" && (
                      <button
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onLaunchReader(item);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <BookOpen size={10} /> OPEN VIEW
                      </button>
                    )}
                    {onViewAnalytics && (
                      <button
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewAnalytics(item);
                        }}
                        className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-mono text-[9px] font-bold px-2.5 py-1.5 rounded-full cursor-pointer transition-colors"
                      >
                        <Activity size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onLaunch={onLaunchReader}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default InteractiveImageBentoGallery;
