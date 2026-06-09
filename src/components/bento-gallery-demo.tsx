"use client";

import React from "react";
import InteractiveImageBentoGallery, { ImageItem } from "@/components/ui/bento-gallery";
import { useNavigate } from "react-router-dom";

const convaMagPublications: ImageItem[] = [
  {
    id: "5J2uHiDqdMfpSnxePUyP",
    title: "Tribe Magazine",
    desc: "An exclusive look at the future of digital communities, featuring interviews with top community builders.",
    url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    span: "md:col-span-2 md:row-span-2",
    pages: 74,
    status: "ready",
    updatedAt: "JUNE 04, 2026",
    path: "/reader"
  },
  {
    id: "6K3vIiEqdMfpSnxeQVyQ",
    title: "Convo Culture Lookbook",
    desc: "Focusing on local streetwear designer collaborations, visual styling aesthetics, and independent local photo essays.",
    url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
    span: "md:row-span-1",
    pages: 32,
    status: "ready",
    updatedAt: "MAY 15, 2026",
    path: "/reader"
  },
  {
    id: "7L4wJjFqdMfpSnxeRWyR",
    title: "Standard Bank CIB Report",
    desc: "Analyzing Credit Risk Operations and the integration of 'Human First' digital client interaction pipelines.",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    span: "md:row-span-1",
    pages: 45,
    status: "processing",
    updatedAt: "SYNCING NOW",
    path: "/reader"
  },
  {
    id: "8M5xKkGqdMfpSnxeSXyS",
    title: "The Induna Chronicles",
    desc: "An internal corporate handbook compiled automatically with AI outlines, glossary matching, and smart chapters.",
    url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800&auto=format&fit=crop",
    span: "md:row-span-2",
    pages: 18,
    status: "ready",
    updatedAt: "APRIL 02, 2026",
    path: "/reader"
  }
];

export default function InteractiveImageBentoGalleryDemo() {
  const navigate = useNavigate();

  const handleLaunchReader = (item: ImageItem) => {
    console.log(`Opening Premium 3D Flipbook UI for publication: ${item.id}`);
    navigate(item.path);
  };

  const handleViewAnalytics = (item: ImageItem) => {
    console.log(`Navigating to Telemetry Dashboard for: ${item.id}`);
    navigate("/analytics");
  };

  return (
    <div className="w-full antialiased bg-black min-h-screen relative py-12 flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none w-[70%] h-[70%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10 pt-16">
        <InteractiveImageBentoGallery
          imageItems={convaMagPublications}
          title="Your Digital Library"
          description="Swipe to explore your white-label publications, click to inspect metadata, or launch conversational RAG flipbooks."
          onLaunchReader={handleLaunchReader}
          onViewAnalytics={handleViewAnalytics}
        />
      </div>
    </div>
  );
}
