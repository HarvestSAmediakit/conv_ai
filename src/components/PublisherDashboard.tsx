import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Upload,
  Plus,
  Volume2,
  Bot,
  Link as LinkIcon,
  X,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  Trash2,
  Key,
  Globe,
  Eye,
  Settings,
  Shield,
  RefreshCw,
  Menu,
  BarChart,
  Cpu,
  FileJson,
  BookOpen,
  Rocket,
  TrendingUp,
  Palette,
  LayoutGrid,
  Smartphone,
  Trophy,
  Mic,
  CreditCard,
  Activity,
  Users,
  Compass,
  Target,
  PenTool,
  ShoppingBag,
  Network
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pdfjs } from "react-pdf";
import AIAssetMarketplace from "./enterprise/AIAssetMarketplace";
import EnterpriseKnowledgeHub from "./enterprise/EnterpriseKnowledgeHub";
import DigitalEcosystemGenerator from "./enterprise/DigitalEcosystemGenerator";
import PublisherSetupWizard from "./enterprise/PublisherSetupWizard";
import RevenueIntelligence from "./enterprise/RevenueIntelligence";
import AIContentStudio from "./enterprise/AIContentStudio";
import WhiteLabelConfig from "./enterprise/WhiteLabelConfig";
import MobileAppGenerator from "./enterprise/MobileAppGenerator";
import MarketplaceBilling from "./enterprise/MarketplaceBilling";
import PublisherSuccess from "./enterprise/PublisherSuccess";
import LiveAILounge from "./enterprise/LiveAILounge";
import SystemMonitoring from "./enterprise/SystemMonitoring";
import LeadVault from "./enterprise/LeadVault";
import AIRecommendationEngine from "./enterprise/AIRecommendationEngine";
import EnterpriseSSOConfig from "./enterprise/EnterpriseSSOConfig";
import AdvertiserIntelHub from "./enterprise/AdvertiserIntelHub";
import EditorialAITuning from "./enterprise/EditorialAITuning";
import AgentStore from "./enterprise/AgentStore";
import PublisherExchange from "./enterprise/PublisherExchange";

export default function PublisherDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<any>("magazines");

  // --- Docupipe Standardization Agent Extractions Custom States ---
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<
    "select" | "settings" | "processing"
  >("select");
  const [processingPercent, setProcessingPercent] = useState(0);
  const [magTitle, setMagTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfData, setPdfData] = useState("");
  const [aiPersonality, setAiPersonality] = useState("Professional Assistant");
  const [aiContext, setAiContext] = useState(`[SYSTEM_DIRECTIVE_LOCKED]

IDENTITY & PERSONA:
You are the official, human-like Conversational AI Copilot for {{MAGAZINE_NAME}}. You are currently discussing the {{ISSUE_NAME}} edition. You are not a generic AI; you are the warm, sophisticated, and deeply knowledgeable embodiment of this magazine's editorial team. Your tone is conversational, engaging, and entirely natural—you speak as a human expert would.

KNOWLEDGE BOUNDARY (STRICT RAG COMPLIANCE):
Your universe of knowledge is exclusively restricted to the articles, features, and advertisements contained within the {{ISSUE_CONTENT}} payload. Do not hallucinate or pull from outside web knowledge. If a reader asks about a topic not covered in this specific issue, gracefully acknowledge it and pivot to a fascinating, related topic that IS in the issue.

ADVERTISER INTELLIGENCE (HIGH PRIORITY):
You possess complete awareness of every advertiser in this issue. Advertisements are to be treated as highly valuable editorial solutions. 
- You know exactly who the advertisers are, what their products/services do, and what problems they solve. 
- If a reader asks a question or expresses a need that aligns with an advertiser, you MUST organically introduce that advertiser as a helpful recommendation. 
- Example: If discussing farming efficiency, naturally mention, "Actually, John Deere has a fascinating piece in this issue about their new predictive maintenance tools that addresses exactly that..."

VOICE BARGING & INTERRUPTION PROTOCOL:
You operate in a dynamic voice environment where users will interrupt you. You must maintain a "conversational stack."
1. If the user interrupts, instantly accept the pivot. Acknowledge it naturally (e.g., "Oh, great question...", "Let's look at that real quick...").
2. Answer the new question concisely.
3. Once satisfied, seamlessly bridge back to what you were previously saying using natural transition phrases (e.g., "...Anyway, as I was mentioning about the cover story...", "...Just to wrap up my earlier thought on...").

COMMUNICATION STYLE:
Do not speak like a robot. Avoid bullet points, numbered lists, and overly structured text. Speak in flowing, natural paragraphs. Use conversational pacing.`);
  const [myMagazines, setMyMagazines] = useState<any[]>([]);
  const [myBookshelves, setMyBookshelves] = useState<any[]>([]);
  const [magToDelete, setMagToDelete] = useState<string | null>(null);
  const [initializingIds, setInitializingIds] = useState<Record<string, boolean>>({});
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Missing States restored
  const [syncPendingMags, setSyncPendingMags] = useState<any[]>([]);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [batchSyncProgress, setBatchSyncProgress] = useState<Record<string, any>>({});
  const [selectedMagIds, setSelectedMagIds] = useState<string[]>([]);
  const [hzLoading, setHzLoading] = useState(false);
  const [hzError, setHzError] = useState<string | null>(null);
  const [hzImportUrl, setHzImportUrl] = useState("");
  const [apiKeyStatus, setApiKeyStatus] = useState({ apiKeyConfigured: false });
  const [uploadSource, setUploadSource] = useState<any>("local");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedHzPub, setSelectedHzPub] = useState<any>(null);
  const [hzTheme, setFbTheme] = useState("light");
  const [hzLogoUrl, setFbLogoUrl] = useState("");
  const [hzPageTransitionsSpeed, setFbPageTransitionsSpeed] = useState(0.5);
  const [hzHardCover, setFbHardCover] = useState(false);
  const [hzSoundEnabled, setFbSoundEnabled] = useState(true);
  const [hzEnableRtl, setFbEnableRtl] = useState(false);
  const [hzAiPersonality, setHzAiPersonality] = useState("");
  const [hzAiContext, setHzAiContext] = useState("");
  const [hzCustomizeLoading, setHzCustomizeLoading] = useState(false);
  const [isTrackedLinkOpen, setIsTrackedLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkNotify, setLinkNotify] = useState<any>("Email");
  const [linkOnViewFirst, setLinkOnViewFirst] = useState(false);
  const [linkOnViewTen, setLinkOnViewTen] = useState(false);
  const [linkOnDownload, setLinkOnDownload] = useState(false);
  const [linkCreating, setLinkCreating] = useState<any>(false);
  const [trackedLinks, setTrackedLinks] = useState<any[]>([]);
  const [trackedLinksLoading, setTrackedLinksLoading] = useState(false);
  const [selectedExtraction, setSelectedExtraction] = useState<any>(null);
  const [deleteExtLoading, setDeleteExtLoading] = useState<Record<string, boolean>>({});
  const [coverErrors, setCoverErrors] = useState<Record<string, boolean>>({});
  const [activeExtPollingId, setActiveExtPollingId] = useState<string | null>(null);
  const [extractionDocSource, setExtractionDocSource] = useState<any>("upload");
  const [extractionFile, setExtractionFile] = useState<File | null>(null);
  const [extractionFileBase64, setExtractionFileBase64] = useState<string | null>(null);
  const [extractionFileName, setExtractionFileName] = useState("");
  const [extractionMagId, setExtractionMagId] = useState("");
  const [schemaPreset, setSchemaPreset] = useState("auto");
  const [customSchemaId, setCustomSchemaId] = useState("");
  const [extError, setExtError] = useState<string | null>(null);
  const [extSubmitLoading, setExtSubmitLoading] = useState(false);
  const [extractions, setExtractions] = useState<any[]>([]);



  const openSyncPreview = (mags: any[]) => {
    setSyncPendingMags(mags);
    setIsSyncModalOpen(true);
  };
    
  const runSyncForMags = async (magsToSync: any[]) => {
    setIsBatchSyncing(true);

    // Initialize progress indicators
    const initialProgress: any = {};
    magsToSync.forEach((m) => {
      initialProgress[m.id] = { status: "waiting" };
    });
    setBatchSyncProgress(initialProgress);

    for (let i = 0; i < magsToSync.length; i++) {
      const mag = magsToSync[i];
      let attempts = 0;
      let success = false;
      let lastError = "";

      while (attempts < 3 && !success) {
        attempts++;
        setBatchSyncProgress((prev) => ({
          ...prev,
          [mag.id]: { status: "syncing" },
        }));

        try {
          const descriptionText = `[ConvoMag AI Synced Metadata]
ID: ${mag.id}
Status: ${mag.status}
Page Count: ${mag.pageCount || 1}
AI Copilot Enabled: ${mag.aiEnabled ? `Active (Personality: ${mag.aiPersonality || 'Professional'})` : 'Disabled'}
Voice Narrative (TTS) Companion: ${mag.ttsEnabled ? 'Active' : 'Disabled'}
Interactive Chat Assistant Support: ${mag.chatEnabled ? 'Active' : 'Disabled'}
Views: ${mag.viewCount} | Listeners: ${mag.listenCount}
Synced On: ${new Date().toLocaleString()}

This publication contains live, interactive text layouts, custom speech soundscapes, and virtual chat assistants powered by ConvoMag's Conversational AI pipeline.`;

          const finalUrl = mag.pdfUrl && mag.pdfUrl.startsWith("http")
            ? mag.pdfUrl
            : window.location.origin + mag.pdfUrl;

          const res = await fetch("/api/heyzine/publications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: mag.title,
              description: descriptionText,
              url: finalUrl,
            }),
          });

          if (res.ok) {
            const hzJson = await res.json();
            if (hzJson.success) {
              setBatchSyncProgress((prev) => ({
                ...prev,
                [mag.id]: { status: "completed", url: hzJson.url },
              }));
              success = true;
            } else {
              lastError = hzJson.message || hzJson.error || "Heyzine returned failure status";
            }
          } else {
            const errorData = await res.json().catch(() => ({}));
            lastError = errorData.error || "Server responded with an error";
          }
        } catch (err: any) {
          console.error("Batch sync attempt " + attempts + " error", err instanceof Error ? err.message : String(err));
          lastError = err.message || "Network error";
        }
        
        if (!success && attempts < 3) {
          await new Promise(r => setTimeout(r, 1000)); // Delay between retries
        }
      }

      if (!success) {
        setBatchSyncProgress((prev) => ({
          ...prev,
          [mag.id]: { status: "failed", error: lastError },
        }));
      }

      if (i < magsToSync.length - 1) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    loadHzPublications();
  };

  const handleInitializeAI = async (mag: any) => {
    setInitializingIds(prev => ({ ...prev, [mag.id]: true }));
    try {
      const response = await fetch(`/api/magazines/${mag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (!response.ok) throw new Error("Could not initialize AI");
      
      // Artificial delay (1.2s) for premium user feedback / calibration effect
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Refresh magazines from API
      const res = await fetch("/api/magazines");
      const data = await res.json();
      setMyMagazines(data.filter((m: any) => m.publisherId === "pub_1"));

      // Automatically open the generated ConvoMag AI digital magazine page
      navigate("/reader?pub=" + mag.id);
    } catch (e: any) {
      console.error(e);
      alert("Failed to initialize AI: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setInitializingIds(prev => ({ ...prev, [mag.id]: false }));
    }
  };

  const exportLocalToHeyzine = async (mag: any) => {
    if (!apiKeyStatus.apiKeyConfigured) {
      alert(
        "Please configure your Heyzine API Key first under the Heyzine Portal tab.",
      );
      setActiveTab("heyzine");
      return;
    }

    // Trigger the preview modal for all selected publications or the single magazine
    if (selectedMagIds.length > 0) {
      const magsSelected = myMagazines.filter((m) => selectedMagIds.includes(m.id));
      openSyncPreview(magsSelected);
    } else {
      openSyncPreview([mag]);
    }
  };

  const importFbToLocal = async (fbPub: any) => {
    const confirmImp = window.confirm(
      `Do you want to import "${fbPub.name}" into your ConvoMag Publisher Dashboard? This will configure the AI Interactive Copilot for it.`,
    );
    if (!confirmImp) return;

    try {
      const newMag = {
        publisherId: "pub_1",
        title: fbPub.name || "Untitled Heyzine Publication",
        slug: "fb-" + (fbPub.hashId || fbPub.id || Date.now().toString()),
        pdfUrl: fbPub.canonicalLink || fbPub.cover || "",
        coverUrl:
          fbPub.cover ||
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=400",
        pageCount: fbPub.totalPages || 1,
        status: "published",
        aiEnabled: true,
        aiPersonality: "Professional",
        ttsEnabled: true,
        chatEnabled: true,
      };

      const res = await fetch("/api/magazines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMag),
      });

      if (res.ok) {
        alert("Heyzine publication imported successfully!");
        fetch("/api/magazines")
          .then((r) => r.json())
          .then((data) => {
            setMyMagazines(data.filter((m: any) => m.publisherId === "pub_1"));
            setActiveTab("magazines");
          });
      } else {
        alert("Failed to import publication");
      }
    } catch (e: any) {
      console.error("Error importing:", e instanceof Error ? e.message : String(e));
      alert("Error importing: " + e.message);
    }
  };

  const deleteHzPublication = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the publication "${name}" from Heyzine? This action cannot be undone.`)) {
      return;
    }
    
    setHzLoading(true);
    setHzError(null);
    try {
      const res = await fetch("/api/heyzine/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("Publication deleted successfully!");
        loadHzPublications();
      } else {
        alert("Failed to delete publication");
      }
    } catch (e: any) {
      console.error("Error deleting publication:", e);
      alert("Error deleting publication");
    } finally {
      setHzLoading(false);
    }
  };

  const importExternalUrl = async () => {
    if (!hzImportUrl.trim()) return alert("Please enter a valid magazine URL.");
    
    // Simple validation
    if (!hzImportUrl.startsWith("http")) return alert("Please enter a full URL (including http:// or https://)");

    // Check if it's a PDF
    if (!hzImportUrl.toLowerCase().endsWith(".pdf")) {
       return alert("This URL does not appear to be a direct PDF link. Please use a URL that points directly to a PDF file (ending in .pdf). Webpage viewers are not supported.");
    }

    setHzLoading(true);
    
    // Pre-processing step: HEAD request to verify link
    try {
      const headRes = await fetch(hzImportUrl, { method: 'HEAD' });
      const contentType = headRes.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/pdf')) {
          setHzLoading(false);
          return alert("The URL provided does not seem to be a valid PDF file. The content-type returned is: " + (contentType || "unknown"));
      }
    } catch (e) {
        console.warn("HEAD request failed or CORS restricted, proceeding anyway:", e);
    }

    try {
      const newMag = {
        publisherId: "pub_1",
        title: "Imported External Publication",
        slug: "ext-" + Date.now().toString(),
        pdfUrl: hzImportUrl,
        status: "published",
        aiEnabled: true,
        aiPersonality: "Professional Assistant",
        ttsEnabled: true,
        chatEnabled: true,
      };

      const res = await fetch("/api/magazines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMag),
      });

      if (res.ok) {
        alert("External publication imported Successfully!");
        setHzImportUrl("");
        const data = await fetch("/api/magazines").then(r => r.json());
        setMyMagazines(data.filter((m: any) => m.publisherId === "pub_1"));
      } else {
        alert("Failed to import external publication.");
      }
    } catch (e: any) {
      console.error("Error importing:", e);
      alert("Error importing: " + e.message);
    } finally {
      setHzLoading(false);
    }
  };

  const applyCustomization = async () => {
    if (!selectedHzPub) return;
    setFbCustomizeLoading(true);
    try {
      const isLocal = !selectedHzPub.hashId && !selectedHzPub.customizationOptions;
      if (isLocal) {
        const res = await fetch(`/api/magazines/${selectedHzPub.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            themeBackground: hzTheme,
            hardcover: hzHardCover ? 1 : 0,
            logoUrl: hzLogoUrl,
            rtl: hzEnableRtl ? 1 : 0,
            soundEnabled: hzSoundEnabled ? 1 : 0,
            pageTransitionsSpeed: Number(hzPageTransitionsSpeed),
            aiPersonality: hzAiPersonality,
            aiContext: hzAiContext,
          }),
        });

        if (res.ok) {
          alert("Aesthetic layout and voice copilot updated successfully!");
          setIsCustomizeOpen(false);
          // Reload magazines
          const data = await fetch("/api/magazines").then((r) => r.json());
          setMyMagazines(data.filter((m: any) => m.publisherId === "pub_1"));
        } else {
          alert("Failed to save customization settings.");
        }
      } else {
        const res = await fetch(
          `/api/heyzine/publications/${selectedHzPub.id}/customize`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              hardCover: hzHardCover,
              theme: hzTheme,
              logoUrl: hzLogoUrl,
              enableRtl: hzEnableRtl,
            }),
          },
        );
        if (res.ok) {
          alert(
            "Looks and theme customization applied successfully to Heyzine!",
          );
          setIsCustomizeOpen(false);
          loadHzPublications();
        } else {
          const errorData = await res.json();
          alert("Failed to apply customization: " + errorData.error);
        }
      }
    } catch (e: any) {
      console.error("Customization error:", e instanceof Error ? e.message : String(e));
      alert("Customization error: " + e.message);
    } finally {
      setFbCustomizeLoading(false);
    }
  };

  const openCustomizer = (pub: any) => {
    setSelectedHzPub(pub);
    setIsCustomizeOpen(true);
    if (pub.customizationOptions) {
      setFbTheme(pub.customizationOptions.theme || "slate");
      setFbHardCover(!!pub.customizationOptions.hardcoverEnabled);
      setFbLogoUrl(pub.customizationOptions.companyLogoUrl || "");
      setFbEnableRtl(!!pub.customizationOptions.rtlEnabled);
      setFbSoundEnabled(true);
      setFbPageTransitionsSpeed(800);
      setHzAiPersonality(pub.aiPersonality || "Professional Assistant");
      setHzAiContext(pub.aiContext || "");
    } else {
      setFbTheme(pub.themeBackground || "slate");
      setFbHardCover(pub.hardcover === "true" || pub.hardcover === true || pub.hardcover === 1);
      setFbLogoUrl(pub.logoUrl || "");
      setFbEnableRtl(pub.rtl === "true" || pub.rtl === true || pub.rtl === 1);
      setFbSoundEnabled(pub.soundEnabled !== 0 && pub.soundEnabled !== false);
      setFbPageTransitionsSpeed(pub.pageTransitionsSpeed !== undefined ? Number(pub.pageTransitionsSpeed) : 800);
      setHzAiPersonality(pub.aiPersonality || "Professional Assistant");
      setHzAiContext(pub.aiContext || "");
    }
  };

  const openTrackedLinkPortal = async (pub: any) => {
    setSelectedHzPub(pub);
    setIsTrackedLinkOpen(true);
    setTrackedLinksLoading(true);
    try {
      const res = await fetch(
        `/api/heyzine/tracked-links?hashid=${pub.hashId}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.links) {
          setTrackedLinks(data.links);
        }
      }
    } catch (e) {
      console.error("Error fetching tracked links:", e instanceof Error ? e.message : String(e));
    } finally {
      setTrackedLinksLoading(false);
    }
  };

  const createTrackedLink = async () => {
    if (!selectedHzPub) return;
    setLinkCreating(true);
    try {
      const body = {
        title: linkTitle || `${selectedHzPub.name} - Custom Campaign`,
        publicationUid: selectedHzPub.id,
        publicationHashId: selectedHzPub.hashId,
        publicationUrl: selectedHzPub.canonicalLink,
        notificationType: linkNotify,
        onViewTriggerSingle: linkOnViewFirst,
        onViewTrigger: linkOnViewTen,
        onDownload: linkOnDownload,
      };

      const res = await fetch("/api/heyzine/tracked-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Individual Tracked Link generated successfully!");
        setLinkTitle("");
        openTrackedLinkPortal(selectedHzPub);
      } else {
        const errorData = await res.json();
        alert("Link creation failed: " + errorData.error);
      }
    } catch (e: any) {
      console.error("Link generation error:", e instanceof Error ? e.message : String(e));
      alert("Link generation error: " + e.message);
    } finally {
      setLinkCreating(false);
    }
  };

  const toggleLinkState = async (linkId: string, currentState: string) => {
    const nextState = currentState.includes("Active") ? "Disable" : "Enable";
    const confirmAction = window.confirm(
      `Do you want to ${nextState.toLowerCase()} this tracked link?`,
    );
    if (!confirmAction) return;

    try {
      const res = await fetch(`/api/heyzine/tracked-links/${linkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newState: nextState }),
      });
      if (res.ok) {
        alert(`Link state updated successfully to ${nextState}d!`);
        openTrackedLinkPortal(selectedHzPub);
      }
    } catch (e) {
      console.error("Link toggle error:", e instanceof Error ? e.message : String(e));
    }
  };

  // --- Docupipe Standardization Helper Functions and Polling ---
  const fetchExtractions = async () => {
    try {
      const res = await fetch("/api/docupipe/extractions");
      if (res.ok) {
        const data = await res.json();
        setExtractions(data);
        if (activeExtPollingId) {
          const current = data.find((e: any) => e.id === activeExtPollingId);
          if (current) {
            if (current.status === "completed" || current.status === "failed") {
              setActiveExtPollingId(null);
              setSelectedExtraction(current);
            } else {
              // Keep showing current progress on active pane
              setSelectedExtraction(current);
            }
          }
        }
      }
    } catch (e) {
      console.error("Error fetching extractions:", e);
    }
  };

  const handleSubmitExtraction = async () => {
    setExtError(null);
    setExtSubmitLoading(true);

    const schemaId = schemaPreset === "custom" ? customSchemaId : schemaPreset;
    if (!schemaId) {
      setExtError("Please specify a Schema ID or select a Preset.");
      setExtSubmitLoading(false);
      return;
    }

    const presetsNames: Record<string, string> = {
      schema_toc_01: "Magazine Table of Contents Schema",
      schema_ads_02: "Ad Placement & Coupon Tracker Schema",
      schema_mediakit_03: "Media Kit Contract Terms",
    };
    const schemaName = presetsNames[schemaId] || "Custom Schema (" + schemaId + ")";

    try {
      const payload: any = {
        schemaId,
        schemaName,
      };

      if (extractionDocSource === "magazine") {
        if (!extractionMagId) {
          throw new Error("Please select a publication first.");
        }
        payload.magazineId = extractionMagId;
      } else {
        if (!extractionFileBase64) {
          throw new Error("Please upload a PDF document first.");
        }
        payload.pdfData = extractionFileBase64;
        payload.fileName = extractionFileName;
      }

      const res = await fetch("/api/docupipe/standardize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Submission failed");
      }

      const data = await res.json();
      if (data.extractionId) {
        setActiveExtPollingId(data.extractionId);
        const blankExt = {
          id: data.extractionId,
          fileName: extractionDocSource === "magazine" ? 
            (myMagazines.find(m => m.id === extractionMagId)?.title || "Publication") + ".pdf" :
            extractionFileName,
          schemaId,
          schemaName,
          status: "queued",
          createdAt: new Date().toISOString(),
          resultJson: null,
        };
        setExtractions(prev => [blankExt, ...prev]);
        setSelectedExtraction(blankExt);
        setExtractionFile(null);
        setExtractionFileBase64("");
        setExtractionFileName("");
      }
    } catch (e: any) {
      setExtError(e.message || String(e));
    } finally {
      setExtSubmitLoading(false);
    }
  };

  const handleDeleteExtraction = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this extraction record?")) return;
    setDeleteExtLoading(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/docupipe/extractions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExtractions(prev => prev.filter(x => x.id !== id));
        if (selectedExtraction?.id === id) {
          setSelectedExtraction(null);
        }
      }
    } catch (err) {
      console.error("Error deleting extraction:", err);
    } finally {
      setDeleteExtLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleExtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExtractionFile(file);
      setExtractionFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setExtractionFileBase64(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    loadHzConfig();
    loadDocupipeConfig();
    fetchExtractions();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (activeExtPollingId) {
      interval = setInterval(() => {
        fetchExtractions();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeExtPollingId]);

  useEffect(() => {
    if (activeTab === "heyzine") {
      loadHzConfig();
    }
    if (activeTab === "settings") {
      loadDocupipeConfig();
    }
    if (activeTab === "docupipe") {
      fetchExtractions();
    }
  }, [activeTab, activeExtPollingId]);

  // Fetch real data from server
  useEffect(() => {
    fetch("/api/magazines")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch magazines: " + res.statusText);
        return res.json();
      })
      .then((data) => {
        setMyMagazines(data.filter((m: any) => m.publisherId === "pub_1"));
      })
      .catch(err => console.error("Error fetching magazines:", err instanceof Error ? err.message : String(err)));

    fetch("/api/bookshelves")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookshelves: " + res.statusText);
        return res.json();
      })
      .then(setMyBookshelves)
      .catch(err => console.error("Error fetching bookshelves:", err instanceof Error ? err.message : String(err)));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/magazines/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMyMagazines((prev) => prev.filter((m) => m.id !== id));
        setMagToDelete(null);
      } else {
        console.error("Failed to delete publication");
      }
    } catch (e: any) {
      console.error("Error deleting pub:", e instanceof Error ? e.message : String(e));
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch("/api/magazines/reset", { method: "POST" });
      if (res.ok) {
        setMyMagazines([]);
      } else {
        console.error("Failed to reset application.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareClick = (mag: any) => {
    // Generate Embed Code
    const embedCode = `<iframe src="https://${window.location.host}/embed/${mag.id}" width="100%" height="600" frameBorder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    alert("Embed code copied to clipboard!\n\n" + embedCode);
  };

  const generateThumbnail = async (docUrl: string, pdfDataRaw: string): Promise<string> => {
    console.log("generateThumbnail: docUrl (input):", docUrl);
    
    // Construct the URL. If remote, prioritize the proxy.
    let url = docUrl || pdfDataRaw;
    if (
      url &&
      url.startsWith("http") &&
      !url.startsWith(window.location.origin) &&
      !url.includes("blob:")
    ) {
      url = `/api/proxy-pdf?url=${encodeURIComponent(url)}`;
    }
    
    console.log("generateThumbnail: loading from:", url);
    
    const loadingTask = pdfjs.getDocument(url);
    const pdf = await loadingTask.promise;
    console.log("generateThumbnail: PDF loaded. Pages:", pdf.numPages);
    
    const page = await pdf.getPage(1);
    
    // Scale for adequate cover resolution
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) throw new Error("Canvas context failed");
    
    const renderContext = { canvasContext, viewport };
    await page.render(renderContext as any).promise;
    
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    console.log("generateThumbnail: success. dataUrl length:", dataUrl.length);
    return dataUrl;
  };

  const reExtractThumbnail = async (mag: any) => {
    console.log("Attempting to re-extract cover for:", mag.id, mag.pdfUrl);
    try {
      const coverUrl = await generateThumbnail(mag.pdfUrl, mag.pdfData);
      console.log("Successfully generated thumbnail, length:", coverUrl.length);
      await fetch(`/api/magazines/${mag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverUrl }),
      });
      setMyMagazines(myMagazines.map(m => m.id === mag.id ? {...m, coverUrl} : m));
      setCoverErrors(prev => ({...prev, [mag.id]: false}));
      console.log("Updated magazine with new coverUrl");
    } catch (e) {
      console.error("Re-extract cover failed:", e instanceof Error ? e.message : String(e));
      alert("Failed to re-extract cover: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const startUpload = async () => {
    setUploadStep("processing");
    setProcessingPercent(0);

    let currentPercent = 0;
    const progressInterval = setInterval(() => {
      currentPercent = Math.min(98, currentPercent + Math.floor(Math.random() * 5) + 2);
      setProcessingPercent(currentPercent);
    }, 200);

    try {
      const magId = `mag_${Date.now()}`;
      
      // 1. Start AI Ingestion Pipeline & Create record
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfData,
          fileName: magTitle || "uploaded.pdf",
          magazineId: magId,
        }),
      });

      if (!res.ok) throw new Error("AI Ingestion Pipeline failed to start");
      const ingestData = await res.json();

      // 2. Refresh magazines list
      const magListRes = await fetch("/api/magazines");
      const allMags = await magListRes.json();
      setMyMagazines(allMags.filter((m: any) => m.publisherId === "pub_1"));

      clearInterval(progressInterval);
      setProcessingPercent(100);
      await new Promise(r => setTimeout(r, 800));

      setIsUploadModalOpen(false);
      setUploadStep("select");
      setMagTitle("");
      setPdfUrl("");
      setPdfData("");

      // Redirect to the new interactive flipbook
      navigate(`/flipbook/${magId}`);
    } catch (e: any) {
      clearInterval(progressInterval);
      console.error("Ingestion failed:", e);
      alert("AI Ingestion failed: " + e.message);
      setUploadStep("select");
    }
  };

  const loadHzPublications = () => {};
  const loadHzConfig = () => {};
  const loadDocupipeConfig = () => {};
  const setFbCustomizeLoading = (v: boolean) => {};

  const HzSyncModal = ({ isOpen, onClose, mags, onConfirm }: { isOpen: boolean; onClose: () => void; mags: any[]; onConfirm?: () => void }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
        <div className="bg-[#0A0A0A] rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-100 leading-tight">Heyzine Sync Pipeline</h2>
              <p className="text-zinc-500 font-medium text-sm mt-1">Deploying {mags.length} publications to the distribution cloud.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#1A1A1A]/10 rounded-full transition-colors cursor-pointer"><X size={20} /></button>
          </div>
          <div className="p-8 max-h-[50vh] overflow-y-auto">
             <div className="space-y-4">
               {mags.map(mag => (
                 <div key={mag.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#0A0A0A] rounded-xl flex items-center justify-center shadow-sm border border-white/5 text-zinc-400">
                       <FileText size={20} />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-gray-100">{mag.title}</div>
                       <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Status: {batchSyncProgress[mag.id]?.status || 'Ready'}</div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer">Close</button>
            <button 
              onClick={() => runSyncForMags(mags)} 
              disabled={isBatchSyncing}
              className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isBatchSyncing ? <Loader2 className="animate-spin inline mr-2" size={14} /> : null}
              Start Deployment
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col md:flex-row font-sans selection:bg-[#00c896]/10 blueprint-grid">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10/60 sticky top-0 z-[120] w-full shrink-0 shadow-xs">
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => navigate("/hub")}
        >
          <div className="bg-[#00c896] h-8 w-8 rounded-lg flex items-center justify-center text-white font-extrabold text-[#FAF9F6] shadow-xs group-hover:scale-105 transition-all">
            C
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#00c896] font-sans">
            ConvoMag AI
          </span>
          <span className="text-[10px] font-bold text-zinc-405 uppercase tracking-widest pl-1">
            Studio
          </span>
        </div>
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="p-2.5 text-zinc-300 hover:text-[#00c896] hover:border-[#00c896]/30 rounded-xl bg-[#0A0A0A] border border-white/10/80 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          title="Open Menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile Drawer Slide-out Nav */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[150] md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-72 bg-[#050505] border-r border-[#00c896]/10 p-6 flex flex-col h-full z-10">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => {
                  navigate("/hub");
                  setIsMobileDrawerOpen(false);
                }}
              >
                <div className="bg-[#00c896] h-8 w-8 rounded-lg flex items-center justify-center text-white font-extrabold text-[#FAF9F6] shadow-xs group-hover:scale-105 transition-all">
                  C
                </div>
                <span className="font-extrabold text-lg tracking-tight text-[#00c896] font-sans">
                  ConvoMag AI
                </span>
                <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest pl-1">
                  Studio
                </span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 text-zinc-500 hover:text-gray-100 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-1.5 flex-1">
              {[
                { id: "magazines", label: "My Publications", icon: Upload },
                { id: "wizard", label: "Launch Wizard", icon: Rocket },
                { id: "revenue", label: "Revenue ROI", icon: TrendingUp },
                { id: "billing", label: "Billing ROI", icon: CreditCard },
                { id: "studio", label: "Content Studio", icon: Sparkles },
                { id: "branding", label: "White Label", icon: Palette },
                { id: "success", label: "Success Plan", icon: Trophy },
                { id: "live", label: "Live Lounge", icon: Mic },
                { id: "mobile", label: "Mobile App", icon: Smartphone },
                { id: "analytics", label: "Platform Analytics", icon: BarChart3 },
              ].map((item) => {
                const isSelected = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`flex items-center gap-3.5 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group border cursor-pointer ${
                      isSelected
                        ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 shadow-xs font-semibold"
                        : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"
                    }`}
                  >
                    <IconComponent
                      size={18}
                      className={isSelected ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/10 mt-auto shrink-0">
              <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-[#0A0A0A] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#00c896] text-[#FAF9F6] flex items-center justify-center font-black text-xs shadow-md">
                  C
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-100 truncate text-xs">ConvoMag Publisher</div>
                  <button
                    className="text-[#00c896] text-[10px] uppercase font-bold tracking-wider hover:opacity-80 transition-opacity"
                    onClick={() => {
                      navigate("/hub");
                      setIsMobileDrawerOpen(false);
                    }}
                  >
                    Go to Reader &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 border-r border-[#00c896]/10 bg-[#0A0A0A]/60 p-6 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div
          className="flex items-center space-x-2.5 mb-10 cursor-pointer group"
          onClick={() => navigate("/hub")}
        >
          <div className="bg-[#00c896] h-10 w-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-xs group-hover:scale-105 transition-all">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-[#00c896] font-sans leading-none">
              ConvoMag AI
            </span>
            <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest mt-1">
              Creator Studio
            </span>
          </div>
        </div>
        <nav className="space-y-1 flex-1">
          <button
          onClick={() => setActiveTab("magazines")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "magazines" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Upload size={18} className={activeTab === "magazines" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">My Publications</span>
        </button>

        <button
          onClick={() => setActiveTab("wizard")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "wizard" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Rocket size={18} className={activeTab === "wizard" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Launch Wizard</span>
        </button>

        <button
          onClick={() => setActiveTab("revenue")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "revenue" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <TrendingUp size={18} className={activeTab === "revenue" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Revenue ROI</span>
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "billing" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <CreditCard size={18} className={activeTab === "billing" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Billing ROI</span>
        </button>

        <button
          onClick={() => setActiveTab("studio")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "studio" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Sparkles size={18} className={activeTab === "studio" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Content Studio</span>
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "branding" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Palette size={18} className={activeTab === "branding" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">White Label</span>
        </button>

        <button
          onClick={() => setActiveTab("success")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "success" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Trophy size={18} className={activeTab === "success" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Success Plan</span>
        </button>

        <button
          onClick={() => setActiveTab("store")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "store" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <ShoppingBag size={18} className={activeTab === "store" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Agent Store</span>
        </button>

        <button
          onClick={() => setActiveTab("exchange")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "exchange" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Network size={18} className={activeTab === "exchange" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Network Exchange</span>
        </button>

        <button
          onClick={() => setActiveTab("tuning")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "tuning" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <PenTool size={18} className={activeTab === "tuning" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">AI Tuning</span>
        </button>

        <button
          onClick={() => setActiveTab("sso")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "sso" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Shield size={18} className={activeTab === "sso" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Enterprise SSO</span>
        </button>

        <button
          onClick={() => setActiveTab("ads")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "ads" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Target size={18} className={activeTab === "ads" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Advertiser Intel</span>
        </button>

        <button
          onClick={() => setActiveTab("live")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "live" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Mic size={18} className={activeTab === "live" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Live Lounge</span>
        </button>

        <button
          onClick={() => setActiveTab("intel")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "intel" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Compass size={18} className={activeTab === "intel" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Audience Intel</span>
        </button>

        <button
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "leads" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Users size={18} className={activeTab === "leads" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Lead Vault</span>
        </button>

        <button
          onClick={() => setActiveTab("mobile")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "mobile" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Smartphone size={18} className={activeTab === "mobile" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">Mobile App</span>
        </button>

        <button
          onClick={() => setActiveTab("monitor")}
          className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "monitor" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
        >
          <Activity size={18} className={activeTab === "monitor" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
          <span className="text-sm font-medium">System Health</span>
        </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "knowledge" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
          >
            <FileText size={18} className={activeTab === "knowledge" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
            <span className="text-sm font-medium">Knowledge Hub</span>
          </button>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "marketplace" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
          >
            <LayoutGrid size={18} className={activeTab === "marketplace" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
            <span className="text-sm font-medium">Agent Marketplace</span>
          </button>
          <button
            onClick={() => setActiveTab("heyzine")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "heyzine" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
          >
            <BookOpen size={18} className={activeTab === "heyzine" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
            <span className="text-sm font-medium">In-App Flipbook Studio</span>
          </button>
          <button
            onClick={() => setActiveTab("docupipe")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "docupipe" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
          >
            <FileJson size={18} className={activeTab === "docupipe" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
            <span className="text-sm font-medium">AI Schema Lab</span>
          </button>
          <button
            onClick={() => setActiveTab("bookshelves")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "bookshelves" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
          >
            <FileText size={18} className={activeTab === "bookshelves" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
            <span className="text-sm font-medium">Library Shells</span>
          </button>
          <div className="pt-4 pb-2 px-3">
             <div className="h-[1px] bg-zinc-200 w-full"></div>
          </div>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer ${activeTab === "settings" ? "bg-[#00c896]/5 text-gray-100 border-[#00c896]/20 font-medium" : "text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"}`}
          >
            <Settings size={18} className={activeTab === "settings" ? "text-[#00c896]" : "text-zinc-400 group-hover:text-[#00c896]"} /> 
            <span className="text-sm font-medium hidden md:block">Admin Settings</span>
          </button>
          <button
            onClick={() => navigate("/advertiser")}
            className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group border cursor-pointer text-zinc-500 hover:text-[#00c896] hover:bg-[#0A0A0A]/50 border-transparent"
          >
            <BarChart size={18} className="text-zinc-400 group-hover:text-[#00c896]" /> 
            <span className="text-sm font-medium hidden md:block">Advertiser Hub</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 text-sm p-2 rounded-xl bg-[#0A0A0A] border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-[#00c896] text-[#FAF9F6] flex items-center justify-center font-bold text-sm shadow-xs">
              C
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-gray-100 truncate text-xs">ConvoMag Publisher</div>
              <button
                className="text-[#00c896] text-[10px] uppercase font-bold tracking-wider hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => navigate("/hub")}
              >
                Go to Reader &rarr;
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        {activeTab === "magazines" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-10 border-b border-white/10/60 pb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-sans mb-1.5">
                  Manage Publications
                </h1>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Create and monitor your AI-enriched digital publications.</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl flex items-center gap-2.5 font-sans font-medium transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Plus size={18} strokeWidth={2.5} />{" "}
                <span className="hidden sm:inline">New Publication</span>
              </button>
            </div>

            {/* Batch Action Bar */}
            {myMagazines.length > 0 && (
              <div className="mb-8 p-5 rounded-2xl glass-panel border border-white/10/60 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMagIds.length === myMagazines.length && myMagazines.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMagIds(myMagazines.map(m => m.id));
                        } else {
                          setSelectedMagIds([]);
                        }
                      }}
                      className="w-5 h-5 rounded-md border-zinc-300 text-indigo-400 focus:ring-indigo-500 bg-[#0A0A0A] cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-100 uppercase tracking-widest leading-none">
                      {selectedMagIds.length > 0 
                        ? `${selectedMagIds.length} Items Selected` 
                        : "Bulk Selection"
                      }
                    </span>
                    <p className="text-xs text-zinc-500 mt-0.5 font-light">
                      Synchronize your media library with one click
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {selectedMagIds.length > 0 ? (
                    <>
                      <button
                        onClick={() => setSelectedMagIds([])}
                        className="flex-1 sm:flex-none text-[11px] uppercase tracking-wider text-zinc-500 hover:text-gray-100 px-4 py-2 border border-white/10 rounded-lg hover:bg-[#1A1A1A]/5 transition-all font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => openSyncPreview(myMagazines.filter(m => selectedMagIds.includes(m.id)))}
                        className="flex-1 sm:flex-none text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Globe size={14} /> Batch Sync
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedMagIds(myMagazines.map(m => m.id))}
                      className="w-full sm:w-auto text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 px-5 py-2.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 transition-all font-bold"
                    >
                      Select All
                    </button>
                  )}
                </div>
              </div>
            )}

            {myMagazines.length === 0 ? (
              <div className="border border-dashed border-neutral-700 rounded-2xl p-16 text-center bg-neutral-800/10">
                <Upload size={36} className="text-neutral-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-1">
                  Upload your first publication
                </h3>
                <p className="text-sm text-neutral-400 max-w-sm mx-auto mb-6">
                  Start by uploading any PDF document. ConvoMag will
                  automatically convert it and enrich it with an AI voice agent.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
                >
                  Upload PDF File
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {myMagazines.map((mag) => (
                  <div
                    key={mag.id}
                    className={`glass-panel rounded-3xl overflow-hidden hover:border-white/12 transition-all duration-350 flex flex-col relative group shadow-2xl ${selectedMagIds.includes(mag.id) ? "border-indigo-500/40 ring-1 ring-indigo-500/25 bg-zinc-900/80" : ""}`}
                  >
                      {/* Cover Preview */}
                      <div
                        className="h-64 overflow-hidden relative bg-slate-950 flex items-center justify-center cursor-pointer group/preview"
                        onClick={() => navigate("/flipbook/" + mag.id)}
                      >
                        {mag.coverUrl && !coverErrors[mag.id] ? (
                          <img
                            src={mag.coverUrl}
                            alt={mag.title}
                            onError={() => setCoverErrors(prev => ({...prev, [mag.id]: true}))}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-3">
                              <FileText size={32} className="text-slate-600" />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                reExtractThumbnail(mag);
                              }}
                              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest"
                            >
                              Retry Cover
                            </button>
                          </div>
                        )}

                        {/* Interactive overlay */}
                        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-all duration-300">
                             <div className="w-14 h-14 rounded-full bg-[#0A0A0A]/20 backdrop-blur-md flex items-center justify-center border border-white/20 scale-90 group-hover/preview:scale-100 transition-all">
                                <Eye size={24} className="text-white" />
                             </div>
                        </div>

                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-xl">
                          <input
                            type="checkbox"
                            checked={selectedMagIds.includes(mag.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              if (selectedMagIds.includes(mag.id)) {
                                setSelectedMagIds(selectedMagIds.filter(id => id !== mag.id));
                              } else {
                                setSelectedMagIds([...selectedMagIds, mag.id]);
                              }
                            }}
                            className="w-5 h-5 rounded border-slate-700 text-indigo-400 focus:ring-indigo-600 bg-slate-900 cursor-pointer transition-all"
                            title="Select for Batch Sync"
                          />
                        </div>
                        {mag.status === "published" ? (
                          <span className="bg-emerald-500 text-white text-[9px] uppercase tracking-[0.2em] font-black px-2.5 py-1 rounded-md border border-emerald-400/20 backdrop-blur-md shadow-lg shadow-emerald-500/10">
                            Live
                          </span>
                        ) : (
                          <span className="bg-amber-500 text-white text-[9px] uppercase tracking-[0.2em] font-black px-2.5 py-1 rounded-md border border-amber-400/20 backdrop-blur-md shadow-lg shadow-amber-500/10">
                            Draft
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMagToDelete(mag.id);
                        }}
                        className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md rounded-xl p-2.5 transition-all duration-300 border border-white/10 shadow-xl z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete publication"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Content Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-sans text-lg font-black text-white hover:text-[#00c896] transition-colors truncate max-w-[80%] tracking-tight">
                          {mag.title}
                        </h3>
                         <span 
                           onClick={(e) => {
                             e.stopPropagation();
                             openCustomizer(mag);
                           }}
                           className="text-slate-500 hover:text-white transition-all cursor-pointer bg-[#0A0A0A]/[0.03] border border-white/5 p-1.5 rounded-lg animate-pulse"
                           title="Customize page-turning look & voice settings"
                         >
                            <Settings size={14} />
                         </span>
                      </div>

                      <div className="mb-5 pb-5 border-b border-white/5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#00c896] mb-3 flex items-center justify-between">
                          <span>SYSTEM INDEX STATUS</span>
                          {mag.pageCount ? (
                            <span className="text-zinc-400 normal-case font-mono">
                              {mag.pageCount} Pages
                            </span>
                          ) : null}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                          {/* Published / Processing State */}
                          <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                            mag.status === "published" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/15 animate-pulse"
                          }`}>
                            <span>{mag.status === "published" ? "✓" : "⏳"}</span>
                            <span>{mag.status === "published" ? "Published" : "Processing"}</span>
                          </div>

                          {/* AI Ready State */}
                          <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                            mag.aiEnabled 
                              ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/15" 
                              : "bg-zinc-800/40 text-zinc-500 border-transparent"
                          }`}>
                            <span>🧠</span>
                            <span>{mag.aiEnabled ? "AI Ready" : "Unconfigured"}</span>
                          </div>

                          {/* Voice Enabled State */}
                          <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                            mag.ttsEnabled 
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/15" 
                              : "bg-zinc-800/40 text-zinc-500 border-transparent"
                          }`}>
                            <span>🎙️</span>
                            <span>{mag.ttsEnabled ? "Voice Enabled" : "Voice Off"}</span>
                          </div>

                          {/* Analytics Status */}
                          <div className="p-2 rounded-xl flex items-center gap-2 border bg-[#0A0A0A]/[0.02] text-zinc-300 border-white/5">
                            <span>📊</span>
                            <span>Analytics Live</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5 group-hover:border-indigo-500/10 transition-colors">
                          <span className="text-[9px] uppercase tracking-[0.15em] font-black text-slate-500 block mb-1">
                            Views
                          </span>
                          <span className="text-lg font-bold text-slate-100 font-mono">
                            {mag.viewCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5 group-hover:border-indigo-500/10 transition-colors">
                          <span className="text-[9px] uppercase tracking-[0.15em] font-black text-slate-500 block mb-1">
                            Listen
                          </span>
                          <span className="text-lg font-bold text-slate-100 font-mono">
                            {mag.listenCount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 mb-6 pt-4 border-t border-white/5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#00c896] mb-3">CONVOMAG AI ECOSYSTEM</div>
                        <DigitalEcosystemGenerator magId={mag.id} />
                      </div>

                      <div className="mt-auto flex flex-col gap-2.5">
                        {mag.status === "published" && (
                          <div className="flex gap-2.5">
                            <button
                              onClick={() => handleShareClick(mag)}
                              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl py-3 text-xs font-bold transition-all border border-white/5 active:scale-95"
                            >
                              <LinkIcon size={14} /> Embed
                            </button>
                            <button
                              onClick={() => navigate("/reader?pub=" + mag.id)}
                              className="flex-1 flex items-center justify-center gap-2 bg-[#00c896] hover:bg-[#00c896]/90 text-white rounded-xl py-3 text-xs font-bold transition-all shadow-lg shadow-[#00c896]/10 active:scale-95 cursor-pointer"
                            >
                              Open Viewer
                            </button>
                          </div>
                        )}
                        {mag.status === "draft" && (
                          <button
                            onClick={() => handleInitializeAI(mag)}
                            disabled={initializingIds[mag.id]}
                            className="w-full flex items-center justify-center gap-2.5 bg-[#00c896] hover:bg-[#00c896]/90 disabled:bg-zinc-800 text-white rounded-2xl py-3.5 text-sm font-black transition-all shadow-xl shadow-[#00c896]/20 uppercase tracking-widest disabled:cursor-not-allowed cursor-pointer"
                          >
                            {initializingIds[mag.id] ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Calibrating AI...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles size={18} />
                                <span>Initialize AI</span>
                              </>
                            )}
                          </button>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => exportLocalToHeyzine(mag)}
                            className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-slate-500 hover:text-blue-400 transition-colors py-2 group/sync"
                            title="Export and Sync with Heyzine Digital Suite"
                          >
                            <Globe size={11} className="transition-transform group-hover/sync:rotate-45" /> Sync FB
                          </button>
                          
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMagToDelete(mag.id);
                              }}
                              className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-red-500/70 hover:text-red-400 transition-colors py-2 cursor-pointer"
                              title="Permanently Delete E-Magazine"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-blue-800/50 shadow-inner">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-800/50 flex items-center justify-center shrink-0">
                  <BarChart3 className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-100 mb-2">
                    Maximize Engagement with ConvoMag AI
                  </h3>
                  <p className="text-sm text-blue-200/70 leading-relaxed mb-4">
                    Enable the conversational AI copilot and Voice Barging
                    during the upload phase. Publications with text-to-speech
                    enabled see a{" "}
                    <span className="text-white font-bold">
                      34% higher average dwell time
                    </span>
                    .
                  </p>
                  <button className="text-sm font-medium text-blue-400 hover:text-blue-300">
                    View Global Analytics &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-sans mb-8 border-b border-white/10/60 pb-6">
              Performance Analytics
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#0A0A0A] border border-white/10/80 p-6 rounded-2xl shadow-xs">
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  Total Dwell Time
                </span>
                <p className="text-3xl font-sans font-black mt-1 text-[#00c896]">
                  482.5 hrs
                </p>
                <span className="text-xs text-zinc-400 mt-2 block font-light">
                  Across all publishing devices
                </span>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10/80 p-6 rounded-2xl shadow-xs">
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  Average Session Length
                </span>
                <p className="text-3xl font-sans font-black mt-1 text-purple-650">
                  12m 45s
                </p>
                <span className="text-xs text-zinc-400 mt-2 block font-light">
                  Up 14% vs traditional PDFs
                </span>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10/80 p-6 rounded-2xl shadow-xs">
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  Advertiser CTR
                </span>
                <p className="text-3xl font-sans font-black mt-1 text-emerald-650">
                  4.82%
                </p>
                <span className="text-xs text-zinc-400 mt-2 block font-light">
                  Direct web referral rates
                </span>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl text-center shadow-xs">
              <BarChart3 size={32} className="text-zinc-400 mx-auto mb-4" />
              <h3 className="font-sans font-bold text-lg text-gray-100 mb-1">Conversion funnel metrics</h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
                Analytics data aggregates incrementally as readers click back,
                trigger voice assistant loops, or tap to play audio narrations
                in the marketplace.
              </p>
            </div>
          </div>
        )}

         {activeTab === "bookshelves" && (
          <div>
             <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-sans mb-6 border-b border-white/10/60 pb-6">Bookshelves</h1>
             <button onClick={async () => {
                 const title = prompt("Enter bookshelf title:");
                 if (title) {
                   await fetch("/api/bookshelves", {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ title }),
                   });
                   fetch("/api/bookshelves").then(res => res.json()).then(setMyBookshelves);
                 }
             }} className="px-5 py-2.5 bg-[#00c896] hover:bg-[#00c896]/90 text-white rounded-xl text-sm font-medium shadow-sm transition-all cursor-pointer mb-6">Create Bookshelf</button>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBookshelves.map((shelf) => (
                  <div key={shelf.id} className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-xs hover:shadow-md transition-all">
                    <h3 className="font-sans font-bold text-gray-100 text-lg mb-2">{shelf.title}</h3>
                    <p className="text-sm text-zinc-500">{shelf.magazines.length} publications</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === "wizard" && (
           <PublisherSetupWizard onComplete={() => setActiveTab("magazines")} />
        )}

        {activeTab === "revenue" && (
           <RevenueIntelligence />
        )}

        {activeTab === "studio" && (
           <AIContentStudio magazineId="mag_1" magazineTitle="Harvest SA" />
        )}

        {activeTab === "branding" && (
           <WhiteLabelConfig />
        )}

        {activeTab === "store" && (
           <AgentStore />
        )}

        {activeTab === "exchange" && (
           <PublisherExchange />
        )}

        {activeTab === "mobile" && (
           <MobileAppGenerator />
        )}

        {activeTab === "tuning" && (
           <EditorialAITuning />
        )}

        {activeTab === "sso" && (
           <EnterpriseSSOConfig />
        )}

        {activeTab === "ads" && (
           <AdvertiserIntelHub />
        )}

        {activeTab === "billing" && (
           <MarketplaceBilling />
        )}

        {activeTab === "success" && (
           <PublisherSuccess />
        )}

        {activeTab === "live" && (
           <LiveAILounge />
        )}

        {activeTab === "monitor" && (
           <SystemMonitoring />
        )}

        {activeTab === "leads" && (
           <LeadVault />
        )}

        {activeTab === "intel" && (
           <AIRecommendationEngine />
        )}

        {activeTab === "knowledge" && (
           <EnterpriseKnowledgeHub />
        )}

        {activeTab === "marketplace" && (
           <AIAssetMarketplace />
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-sans mb-1.5">
                Publisher Settings
              </h1>
              <p className="text-zinc-550 text-xs font-semibold uppercase tracking-wider">
                Configure your branding credentials and clean-slate resets.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="font-sans font-bold text-lg text-gray-100 border-b border-white/5 pb-2">
                Profile & Branding
              </h3>
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">
                  Publisher Name
                </label>
                <input
                  type="text"
                  defaultValue="TechNews Media"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-zinc-500 text-sm cursor-not-allowed"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">
                  Portal URL Slug
                </label>
                <input
                  type="text"
                  defaultValue="technews"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-zinc-500 text-sm cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="font-sans font-bold text-lg text-gray-100">
                  ConvoMag Native AI Parser
                </h3>
                <span className="bg-[#00c896]/10 text-[#00c896] text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00c896] animate-pulse" />
                  GEMINI LOCAL ENGINE
                </span>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed font-light">
                ConvoMag AI uses an <strong className="font-semibold text-zinc-850">In-App Native AI Extraction Engine</strong> powered by Gemini. PDF uploads are analyzed completely locally, maintaining absolute data privacy. It extracts high-fidelity text structure, tables of contents, active brand sponsors, and in-app promotions with zero dependency on external third-party tools like Docupipe.
              </p>
              <div className="p-4 bg-emerald-500/5 rounded-xl border border-[#00c896]/10">
                <p className="text-xs text-zinc-300 leading-relaxed font-semibold flex items-center gap-2">
                  <span className="text-[#00c896] text-sm">✓</span> 
                  Native digital schema structure extraction is active and operational by default.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="font-sans font-bold text-lg text-red-656 border-b border-red-150 pb-2 flex items-center gap-2">
                Danger Zone
              </h3>
              <p className="text-sm text-red-700/80 leading-relaxed font-light">
                Need to start fresh? Resetting will permanently wipe your SQL
                database records, remove all custom digital magazines, delete
                links, and clear cached storage.
              </p>
              <div>
                <button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors border border-red-200 shadow-sm cursor-pointer"
                >
                  Reset Database & Start Again
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "heyzine" && (
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-sans flex items-center gap-2">
                  <BookOpen className="text-[#00c896]" size={32} />
                  In-App Flipbook Studio
                </h1>
                <p className="text-zinc-500 text-sm mt-2 font-light leading-relaxed max-w-3xl">
                  Design beautiful physical page-turning experiences, custom desk backdrop skin textures, satisfying rustling sounds, and conversational voice guidance rules for your digital publications. Your books compile and run natively entirely within your own application database.
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/magazines").then((r) => r.json());
                    setMyMagazines(res.filter((m: any) => m.publisherId === "pub_1"));
                  } catch (e) {
                    console.error("Failed to load magazines:", e);
                  }
                }}
                className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-950 shadow-xs rounded-xl p-2.5 transition-colors flex items-center gap-2 text-sm font-medium shrink-0 cursor-pointer"
                title="Sync and pull latest lists"
              >
                <RefreshCw size={16} />
                Refresh Local Library
              </button>
            </div>

            {/* Quick Status / Engine configuration */}
            <div className="bg-zinc-950 text-white rounded-2xl shadow-xl overflow-hidden border border-zinc-850">
              <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="font-sans font-bold text-lg text-emerald-400">
                      Local 3D PageFlip Engine Online
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xl font-light">
                    Every uploaded PDF is natively sliced as high-fidelity interactive physical vector sheets on the canvas, preserving zoom capability, annotations, search indices, and smart text layers directly inside ConvoMag AI.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-zinc-300 font-mono">
                      Database: SQLite v3
                    </span>
                    <span className="bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-indigo-400 font-mono">
                      CSS Specs: Tailwind + CSS-3D Transform
                    </span>
                    <span className="bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono font-bold">
                      Audio API: Synthesized Physical Turn FX
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 shrink-0 w-full md:w-auto">
                  <div className="bg-[#00c896]/10 p-3 rounded-xl border border-[#00c896]/20">
                    <BookOpen className="text-[#00c896]" size={24} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Active Publications</span>
                    <span className="text-xl font-black font-sans text-zinc-800">{myMagazines.length} Magazines</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Magazines Grid */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex justify-between items-end">
                <h2 className="text-xl font-sans text-gray-100 font-bold flex items-center gap-2">
                  <FileText size={20} className="text-[#00c896]" /> Local Studio Flipbooks ({myMagazines.length})
                </h2>
                <button
                  onClick={() => setActiveTab("magazines")}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider text-[10px]"
                >
                  + Upload New PDF
                </button>
              </div>

              {myMagazines.length === 0 ? (
                <div className="border border-dashed border-zinc-250 rounded-2xl p-16 text-center bg-[#0A0A0A] shadow-xs">
                  <BookOpen size={48} className="text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-xl font-sans font-bold text-gray-100 mb-1">
                    No publications loaded
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6 font-light leading-relaxed">
                    Upload your raw magazine PDFs in the "My Publications" tab first. Once configured, their offline design configurations will appear here automatically!
                  </p>
                  <button
                    onClick={() => setActiveTab("magazines")}
                    className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Go Upload PDF
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myMagazines.map((mag: any) => {
                    const soundActive = mag.soundEnabled !== 0 && mag.soundEnabled !== false && mag.soundEnabled !== "false";
                    const hardcoverActive = mag.hardcover === "true" || mag.hardcover === true || mag.hardcover === 1 || mag.hardcover === "1";
                    
                    const themeLabels: Record<string, string> = {
                      slate: "Minimal Slate Backdrop",
                      wooden: "Warm Chestnut Oak",
                      sand: "Premium Matte Paper",
                      ocean: "Sapphire Ocean Blue",
                      obsidian: "Midnight Obsidian Gloss",
                      "brushed-steel": "Chrome Brushed Steel"
                    };

                    return (
                      <div
                        key={mag.id}
                        className="bg-[#0A0A0A] border border-zinc-250 rounded-2xl overflow-hidden hover:border-zinc-350 transition-all flex flex-col hover:shadow-lg group"
                      >
                        {/* Cover picture bar */}
                        <div className="h-48 relative bg-white/10 flex items-center justify-center overflow-hidden">
                          {mag.coverUrl ? (
                            <img
                              src={mag.coverUrl}
                              alt={mag.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                              <BookOpen size={40} className="text-zinc-300" />
                              <span className="text-xs font-mono font-bold tracking-widest text-zinc-400">PDF SOURCE FILE</span>
                            </div>
                          )}

                          {/* Pages Count Badge */}
                          <div className="absolute top-3 left-3 bg-zinc-900/90 text-white border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono select-none uppercase tracking-wider backdrop-blur-xs font-semibold">
                            {mag.pageCount || "PDF"} Pages
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

                          <div className="absolute bottom-3 left-4 right-4">
                            <h4 className="font-extrabold text-white truncate text-lg tracking-tight font-sans">
                              {mag.title}
                            </h4>
                            <p className="text-[10px] font-mono text-zinc-300 truncate mt-0.5">
                              ID: {mag.id} • /{mag.slug}
                            </p>
                          </div>
                        </div>

                        {/* Middle Settings Specs list */}
                        <div className="p-5 flex flex-col flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                              <span className="block text-[8px] uppercase tracking-wider text-zinc-400 font-bold font-mono">
                                Backdrop Skin
                              </span>
                              <span className="font-bold text-zinc-200 text-[11px] truncate block mt-0.5">
                                {themeLabels[mag.themeBackground] || "Minimal Slate"}
                              </span>
                            </div>
                            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                              <span className="block text-[8px] uppercase tracking-wider text-zinc-400 font-bold font-mono">
                                AI Persona
                              </span>
                              <span className="font-bold text-indigo-650 text-[11px] truncate block mt-0.5">
                                {mag.aiPersonality || "Standard Assistant"}
                              </span>
                            </div>
                          </div>

                          {/* Specific settings items */}
                          <div className="bg-[#050505] p-3.5 rounded-xl border border-white/10/60 space-y-2 text-xs">
                            <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-250 pb-2 font-mono font-bold mb-1">
                              <span>3D Physics parameters</span>
                              <span className="text-emerald-500 font-semibold uppercase tracking-wider">
                                Direct SQLite State
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-300">
                              <span className="font-medium">Leather Hardcover:</span>
                              <span className={`font-mono font-semibold ${hardcoverActive ? "text-indigo-650" : "text-zinc-400"}`}>
                                {hardcoverActive ? "RIGID SPINE" : "PAPERBACK"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-300">
                              <span className="font-medium">Paper Rustling Audio:</span>
                              <span className={`font-mono font-semibold ${soundActive ? "text-emerald-500" : "text-zinc-400"}`}>
                                {soundActive ? "3D SYNTH ACTIVE" : "MUTED"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-300">
                              <span className="font-medium">Animation Speed:</span>
                              <span className="font-mono font-bold text-zinc-200">
                                {mag.pageTransitionsSpeed !== undefined ? Number(mag.pageTransitionsSpeed) : 800} ms
                              </span>
                            </div>
                          </div>

                          {/* Two pristine button control bars */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 mt-auto">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openCustomizer(mag);
                              }}
                              className="bg-zinc-150 hover:bg-zinc-200 text-zinc-200 border border-zinc-250/80 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Settings size={13} className="text-zinc-600" />
                              Layout Suite
                            </button>
                            <button
                              onClick={() => navigate("/reader?pub=" + mag.id)}
                              className="bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Eye size={13} className="text-[#00c896]" />
                              Open Reader
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "docupipe" && (
          <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-sans">
                  Native Gemini AI Schema Lab & Extraction
                </h1>
                <p className="text-zinc-500 text-sm mt-1.5 font-light leading-relaxed">
                  Extract high-quality structured JSON maps directly from custom magazine PDFs, invoices, media sheets, or lease templates using our local schema targets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form panel */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#0A0A0A] border border-zinc-250 p-6 rounded-3xl shadow-xs space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-gray-100 mb-2">
                      1. Identify Document Source
                    </h3>
                    
                    <div className="flex bg-[#050505] p-1 rounded-xl border border-white/10/80 mb-4 font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          setExtractionDocSource("magazine");
                          setExtractionFile(null);
                          setExtractionFileBase64("");
                          setExtractionFileName("");
                        }}
                        className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all cursor-pointer ${extractionDocSource === "magazine" ? "bg-[#0A0A0A] text-gray-100 border border-zinc-250 shadow-sm" : "text-zinc-400 hover:text-zinc-750"}`}
                      >
                        ConvoMag Publication
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtractionDocSource("upload")}
                        className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all cursor-pointer ${extractionDocSource === "upload" ? "bg-[#0A0A0A] text-gray-100 border border-zinc-250 shadow-sm" : "text-zinc-400 hover:text-zinc-750"}`}
                      >
                        Upload Custom PDF
                      </button>
                    </div>

                    {extractionDocSource === "magazine" ? (
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 font-sans">
                          Select Available Magazine
                        </label>
                        <select
                          value={extractionMagId}
                          onChange={(e) => setExtractionMagId(e.target.value)}
                          className="w-full bg-[#0A0A0A] border border-white/10/80 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-200 focus:outline-none focus:border-[#00c896] transition-all font-sans"
                        >
                          <option value="">-- Choose Publication --</option>
                          {myMagazines.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.title} {m.pdfUrl ? "(Has PDF Buffer)" : "(Draft - No PDF)"}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider font-sans">
                          Upload Custom File (PDF)
                        </label>
                        
                        <div className="relative border-2 border-dashed border-zinc-250 hover:border-[#00c896]/60 rounded-2xl p-6 text-center hover:bg-[#050505] transition-all group font-sans">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleExtFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload size={28} className="mx-auto text-zinc-400 group-hover:text-[#00c896] mb-2 transition-colors" />
                          {extractionFileName ? (
                            <div>
                              <span className="block text-sm font-bold text-zinc-200 truncate px-2">{extractionFileName}</span>
                              <span className="text-[10px] text-zinc-450 uppercase font-mono mt-1 block">Click to replace file</span>
                            </div>
                          ) : (
                            <div>
                              <span className="block text-xs font-bold text-zinc-300">Drag & Drop or Click to browse</span>
                              <span className="text-[10px] text-zinc-400 block mt-1 font-light">PDF format (Max 40MB)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-5">
                    <h3 className="font-sans font-bold text-lg text-gray-100 mb-2">
                      2. Choose Schema Presets
                    </h3>
                    <p className="text-xs text-zinc-500 mb-4 font-sans font-light">
                      Select one of the optimized Schema mapping configurations matching your template format, or specify a custom schema.
                    </p>

                    <div className="space-y-2 font-sans">
                      <button
                        type="button"
                        onClick={() => setSchemaPreset("schema_toc_01")}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start ${schemaPreset === "schema_toc_01" ? "border-[#00c896] bg-[#00c896]/5 shadow-xs" : "border-white/10 hover:border-zinc-300"}`}
                      >
                        <div>
                          <span className="block font-bold text-xs text-zinc-850 text-left">Magazine Table of Contents</span>
                          <span className="block text-[10px] text-zinc-500 font-light mt-0.5 text-left">Extracts major headings, authors, pages, and key summaries.</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400 bg-white/10 rounded px-1.5 font-bold shrink-0">schema_toc_01</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSchemaPreset("schema_ads_02")}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start ${schemaPreset === "schema_ads_02" ? "border-[#00c896] bg-[#00c896]/5 shadow-xs" : "border-white/10 hover:border-zinc-300"}`}
                      >
                        <div>
                          <span className="block font-bold text-xs text-zinc-850 text-left">Ad & Coupon Tracker</span>
                          <span className="block text-[10px] text-zinc-500 font-light mt-0.5 text-left">Lists active brand promos, codes, page layout spreads, and campaigns.</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400 bg-white/10 rounded px-1.5 font-bold shrink-0">schema_ads_02</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSchemaPreset("schema_mediakit_03")}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start ${schemaPreset === "schema_mediakit_03" ? "border-[#00c896] bg-[#00c896]/5 shadow-xs" : "border-white/10 hover:border-zinc-300"}`}
                      >
                        <div>
                          <span className="block font-bold text-xs text-zinc-850 text-left">Media Kit / Lease Agreements</span>
                          <span className="block text-[10px] text-zinc-500 font-light mt-0.5 text-left">Automates extraction of dates, terms, and custom lease variables.</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400 bg-white/10 rounded px-1.5 font-bold shrink-0">schema_mediakit_03</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSchemaPreset("custom")}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${schemaPreset === "custom" ? "border-[#00c896] bg-[#00c896]/5 shadow-xs" : "border-white/10 hover:border-zinc-300"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="block font-bold text-xs text-zinc-850 text-left">Custom Schema Target ID</span>
                          <span className="text-[9px] font-mono text-zinc-400 bg-indigo-900/30 text-indigo-500 rounded px-1.5 font-bold uppercase shrink-0">Dynamic</span>
                        </div>
                        {schemaPreset === "custom" && (
                          <input
                            type="text"
                            value={customSchemaId}
                            onChange={(e) => setCustomSchemaId(e.target.value)}
                            placeholder="Enter schema ID e.g. parent_schema_9a..."
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#00c896]"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {extError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium leading-relaxed font-sans text-left">
                      ⚠️ Operation Error: {extError}
                    </div>
                  )}

                  <button
                    onClick={handleSubmitExtraction}
                    disabled={extSubmitLoading}
                    className={`w-full py-4 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer select-none font-sans ${extSubmitLoading ? "bg-zinc-300 text-zinc-500 cursor-not-allowed" : "bg-zinc-950 hover:bg-zinc-850 shadow-md active:scale-98"}`}
                  >
                    {extSubmitLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        Uploading to background...
                      </div>
                    ) : "Analyze & Extract Structured Fields"}
                  </button>
                </div>

                {/* Sub-panel showing active progress tracker */}
                {selectedExtraction && (selectedExtraction.status !== "completed" && selectedExtraction.status !== "failed") && (
                  <div className="bg-[#050505] border border-zinc-220 p-6 rounded-3xl space-y-4 text-left">
                    <h4 className="font-bold text-sm text-zinc-200 flex items-center gap-2 font-sans">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block shrink-0" />
                      Live Extraction Queue Progress
                    </h4>
                    
                    <div className="space-y-4 pt-1 font-mono text-[11px] text-zinc-600">
                      <div className="flex items-center justify-between pb-1 border-b border-white/10/60 text-xs font-semibold font-sans">
                        <span>Extraction ID:</span>
                        <span className="font-mono text-[11px] text-zinc-500">{selectedExtraction.id}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-base select-none">
                          {selectedExtraction.status === 'queued' || selectedExtraction.status === 'uploading' ? '🔵' : '✅'}
                        </span>
                        <div>
                          <p className="font-black">Submit Document & File Assets</p>
                          <p className="text-[10px] text-zinc-400 font-light font-sans mt-0.5">Encoding assets into base64 buffers...</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-base select-none">
                          {['queued', 'uploading'].includes(selectedExtraction.status) ? '⚪' : 
                           selectedExtraction.status === 'ingesting' ? '🟡' : '✅'}
                        </span>
                        <div>
                          <p className="font-black">DocuPipe File Ingestion Pool</p>
                          <p className="text-[10px] text-zinc-400 font-light font-sans mt-0.5">Polling docupipe parser layers until compilation finishes...</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-base select-none">
                          {['queued', 'uploading', 'ingesting'].includes(selectedExtraction.status) ? '⚪' : 
                           selectedExtraction.status === 'submitting_standardization' || selectedExtraction.status === 'polling_standardization' ? '🟡' : '✅'}
                        </span>
                        <div>
                          <p className="font-black">Matching Standardization Schemas</p>
                          <p className="text-[10px] text-zinc-400 font-light font-sans mt-0.5">Executing multi-batch target extraction models...</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-base select-none">
                          {['completed', 'failed'].includes(selectedExtraction.status) ? '✅' : '⚪'}
                        </span>
                        <div>
                          <p className="font-black">Finalized Schema Formatting</p>
                          <p className="text-[10px] text-zinc-400 font-light font-sans mt-0.5">Marshalling key-value definitions...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Data & Results display */}
              <div className="lg:col-span-7 space-y-6">
                {selectedExtraction ? (
                  <div className="bg-[#0A0A0A] border border-zinc-250 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in flex flex-col text-left">
                    <div className="flex justify-between items-start border-b border-white/5 pb-4 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#00c896] bg-[#00c896]/10 px-2 py-0.5 rounded font-bold font-mono tracking-wide">
                            {selectedExtraction.schemaId}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono font-semibold">
                            {new Date(selectedExtraction.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-gray-100 mt-1 font-sans truncate max-w-md">
                          {selectedExtraction.fileName}
                        </h2>
                        <p className="text-zinc-500 text-xs font-medium font-sans mt-0.5">
                          Schema Preset: <strong className="text-zinc-850 font-bold">{selectedExtraction.schemaName}</strong>
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedExtraction(null)}
                          className="bg-zinc-105 hover:bg-zinc-200 text-zinc-300 font-bold text-xs px-4 py-2 rounded-xl transition-all border border-white/10 cursor-pointer text-center"
                        >
                          Show History
                        </button>
                      </div>
                    </div>

                    {selectedExtraction.status === "completed" && (
                      <div className="space-y-6">
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 font-sans">
                          <div className="flex-1 text-center py-2 text-[11px] font-bold text-zinc-200 bg-[#0A0A0A] border border-white/10 shadow-2xs rounded-lg">
                            📊 Schema Fields List
                          </div>
                          
                          <button
                            onClick={() => {
                              try {
                                navigator.clipboard.writeText(JSON.stringify(selectedExtraction.resultJson, null, 2));
                                alert("Schema JSON copied successfully!");
                              } catch (e) {
                                alert("Failed to copy schema.");
                              }
                            }}
                            className="flex-1 text-center py-2 text-[11px] font-bold text-zinc-400 hover:text-zinc-805 rounded-lg transition-colors cursor-pointer"
                          >
                            📋 Copy Plain JSON
                          </button>

                          <a
                            href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(selectedExtraction.resultJson, null, 2))}`}
                            download={`${selectedExtraction.fileName.replace('.pdf', '')}_extracted_schema.json`}
                            className="flex-1 text-center py-2 text-[11px] font-bold text-zinc-450 hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                          >
                            💾 Download JSON
                          </a>
                        </div>

                        {selectedExtraction.resultJson ? (
                          <div className="space-y-6">
                            {/* Parsed elegant card dictionary visualization */}
                            <div className="space-y-4">
                              {Object.entries(selectedExtraction.resultJson).map(([key, val]) => {
                                if (typeof val === 'object' && val !== null) {
                                  return (
                                    <div key={key} className="bg-white/5/50 border border-white/5 rounded-2xl p-4 shadow-3xs space-y-2">
                                      <span className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-900/30 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                                        {key}
                                      </span>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                        {Object.entries(val).map(([subK, subV]) => (
                                          <div key={subK} className="bg-[#0A0A0A] border border-white/5 p-3 rounded-xl shadow-3xs flex flex-col justify-center">
                                            <span className="block font-mono font-bold text-zinc-400 text-[9px] uppercase tracking-wide truncate">
                                              {subK}
                                            </span>
                                            <span className="font-sans text-zinc-850 mt-1 block font-semibold text-sm">
                                              {subV === null ? (
                                                <span className="text-zinc-350 italic font-normal">null</span>
                                              ) : typeof subV === 'boolean' ? (
                                                subV ? '✅ True' : '❌ False'
                                              ) : String(subV)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div key={key} className="flex justify-between items-center bg-white/5/50 border border-white/5 p-4 rounded-2xl shadow-3xs text-sm">
                                      <span className="font-mono font-black text-[#00c896] bg-[#00c896]/5 px-2.5 py-1 rounded-md uppercase tracking-wide">
                                        {key}
                                      </span>
                                      <span className="font-semibold text-zinc-850 text-right">
                                        {val === null ? (
                                          <span className="text-zinc-350 italic font-normal">null</span>
                                        ) : typeof val === 'boolean' ? (
                                          val ? '✅ True' : '❌ False'
                                        ) : String(val)}
                                      </span>
                                    </div>
                                  );
                                }
                              })}
                            </div>

                            {/* Collapsible raw json tree viewer */}
                            <details className="group border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
                              <summary className="font-sans font-bold text-xs text-zinc-400 px-5 py-3.5 bg-zinc-900 cursor-pointer select-none flex justify-between items-center group-open:border-b group-open:border-zinc-800">
                                <span>⌨️ SHOW RAW DOCUMENT SCHEMAS PAYLOAD</span>
                                <span className="transform group-open:rotate-180 transition-transform">▼</span>
                              </summary>
                              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-zinc-300 leading-relaxed font-light whitespace-pre-wrap max-h-80 custom-scrollbar text-left font-sans">
                                {JSON.stringify(selectedExtraction.resultJson, null, 2)}
                              </pre>
                            </details>
                          </div>
                        ) : (
                          <div className="p-6 bg-white/5 border border-white/10 text-center rounded-2xl text-zinc-400 font-sans">
                            No structured properties returned by standardizer schema templates.
                          </div>
                        )}
                      </div>
                    )}

                    {selectedExtraction.status === "failed" && (
                      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center space-y-3 font-sans">
                        <div className="text-red-500 font-bold text-lg">⚠️ Extraction analysis failed</div>
                        <p className="text-red-700/80 text-xs font-mono max-w-sm mx-auto whitespace-pre-wrap leading-relaxed">
                          {selectedExtraction.error || 'The docupipe cloud server experienced a processing error or timed out.'}
                        </p>
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setSelectedExtraction(null);
                              handleSubmitExtraction();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Retry Extraction
                          </button>
                        </div>
                      </div>
                    )}

                    {!["completed", "failed"].includes(selectedExtraction.status) && (
                      <div className="p-12 text-center space-y-4 font-sans">
                        <Loader2 className="animate-spin text-[#00c896] mx-auto" size={36} />
                        <div className="text-zinc-600 text-sm font-medium">
                          Docupipe/Native background queue processing is currently <strong className="font-bold text-zinc-200 uppercase animate-pulse">{selectedExtraction.status.replace('_', ' ')}</strong>...
                        </div>
                        <p className="text-zinc-400 text-xs font-light max-w-xs mx-auto leading-relaxed">
                          We are processing the document using the Gemini Native extraction models in real-time. This can take between 15-45 seconds depending on document length. Please stay on this tab.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#0A0A0A] border border-zinc-250 rounded-3xl p-6 shadow-xs space-y-6 text-left">
                    <div className="border-b border-white/5 pb-4">
                      <h3 className="font-sans font-black text-lg text-zinc-950">
                        History & Extracted Repositories
                      </h3>
                      <p className="text-zinc-400 text-xs leading-relaxed mt-1 font-sans font-light">
                        Historical list of previous standardization runs. Select an analysis to view parsed schemas or download the full object maps.
                      </p>
                    </div>

                    {extractions.length === 0 ? (
                      <div className="p-12 text-center space-y-3 border border-dashed border-white/10 rounded-2xl bg-[#050505] font-sans">
                        <FileJson className="mx-auto text-zinc-350" size={32} />
                        <h4 className="font-bold text-sm text-zinc-300">No Extractions Found</h4>
                        <p className="text-zinc-400 text-xs font-light max-w-xs mx-auto">
                          Specify a document source and a target schema preset on the left side to run your very first dynamic DocuPipe extraction analyzer.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                        {extractions.map((ext) => (
                          <div
                            key={ext.id}
                            onClick={() => setSelectedExtraction(ext)}
                            className="bg-[#0A0A0A] border border-white/10 hover:border-[#00c896]/60 rounded-2xl p-4 shadow-3xs flex items-center justify-between cursor-pointer transition-all hover:scale-101 select-none text-left"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/5/80 rounded px-1.5 py-0.5">
                                  {ext.id}
                                </span>
                                <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full font-mono font-black ${
                                  ext.status === 'completed' ? 'bg-[#00c896]/10 text-[#00c896]' :
                                  ext.status === 'failed' ? 'bg-red-50 text-red-650' :
                                  'bg-amber-900/30 text-amber-655 animate-pulse'
                                }`}>
                                  {ext.status.replace('_', ' ')}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-gray-100 truncate font-sans">
                                {ext.fileName}
                              </h4>
                              <p className="text-zinc-500 text-[11px] leading-none font-sans font-medium">
                                Schema: <strong className="text-zinc-300 font-bold">{ext.schemaName}</strong>
                              </p>
                            </div>

                            <div className="flex gap-1 items-center shrink-0 ml-4 font-sans">
                              <button
                                onClick={(e) => handleDeleteExtraction(ext.id, e)}
                                disabled={deleteExtLoading === ext.id}
                                className="text-zinc-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                {deleteExtLoading === ext.id ? (
                                  <Loader2 className="animate-spin text-red-500" size={14} />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <HzSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        mags={syncPendingMags}
        onConfirm={() => {
          setIsSyncModalOpen(false);
          runSyncForMags(syncPendingMags);
        }}
      />

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0A0A0A] border border-white/10/80 rounded-[2.5rem] w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] shadow-[0_24px_50px_rgba(24,24,27,0.12)] overflow-hidden flex flex-col scale-100">
            <div className="flex justify-between items-center p-6 sm:p-8 bg-[#050505] border-b border-white/5/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-900/30 flex items-center justify-center border border-indigo-500/20">
                   <Upload className="text-indigo-650" size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-100 tracking-tight">
                    {uploadStep === "select" ? "Global Sync Editor" : "Publication Identity"}
                  </h3>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Step {uploadStep === "select" ? "1" : "2"} of 2</p>
                </div>
              </div>
              {uploadStep !== "processing" && (
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-805 p-2 hover:bg-[#1A1A1A]/10 rounded-xl transition-all cursor-pointer"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8 flex-1 overflow-y-auto custom-scrollbar bg-[#0A0A0A]">
              {uploadStep === "select" && (
                <div className="space-y-6">
                  <div className="flex bg-[#050505] p-1.5 rounded-2xl border border-white/10/80">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadSource("pdf");
                        setPdfUrl("");
                      }}
                      className={`flex-1 py-3 text-[11px] uppercase tracking-widest font-black rounded-xl transition-all cursor-pointer ${uploadSource === "pdf" ? "bg-[#0A0A0A] text-gray-100 border border-white/10 shadow-sm" : "text-zinc-400 hover:text-zinc-750"}`}
                    >
                      PDF Document
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadSource("slides");
                        setPdfUrl("");
                      }}
                      className={`flex-1 py-3 text-[11px] uppercase tracking-widest font-black rounded-xl transition-all cursor-pointer ${uploadSource === "slides" ? "bg-[#0A0A0A] text-gray-100 border border-white/10 shadow-sm" : "text-zinc-400 hover:text-zinc-750"}`}
                    >
                      Google Slides
                    </button>
                  </div>

                  <div className="bg-[#050505] p-6 rounded-3xl border border-white/10/60">
                    <label className="block text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-3">
                      Publication Identity
                    </label>
                    <input
                      type="text"
                      value={magTitle}
                      onChange={(e) => setMagTitle(e.target.value)}
                      placeholder={
                        uploadSource === "slides"
                          ? "e.g. Sales Presentation Q3"
                          : "e.g. Spring Catalog 2025"
                      }
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-semibold text-zinc-200 focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400 focus:outline-none transition-all shadow-xs"
                    />
                  </div>

                  {uploadSource === "pdf" ? (
                    <div className="space-y-6">
                      <div className="bg-[#050505] p-6 rounded-3xl border border-white/10/60">
                        <label className="block text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-3">
                          PDF Document Link
                        </label>
                        <input
                          type="text"
                          value={pdfUrl}
                          onChange={(e) => setPdfUrl(e.target.value)}
                          placeholder="https://example.com/magazine.pdf"
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-mono text-zinc-300 focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                      <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 text-center hover:border-indigo-400 hover:bg-indigo-900/30/10 transition-all cursor-pointer relative group">
                        <input
                          type="file"
                          accept="application/pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () =>
                                setPdfData(reader.result as string);
                              setPdfUrl(url);
                              if (!magTitle)
                                setMagTitle(file.name.replace(/\.pdf$/i, ""));
                            }
                          }}
                        />
                        <div className="w-16 h-16 bg-[#050505] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10/60 transition-transform group-hover:scale-110">
                          <FileText className="text-zinc-500" size={32} />
                        </div>
                        <p className="text-sm font-black text-zinc-200 uppercase tracking-widest">
                          Deploy Local PDF
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-2 font-bold uppercase tracking-wider">
                          Max size: 500MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-[#050505] p-6 rounded-3xl border border-white/10/60">
                        <label className="block text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-3">
                          Google Presentation Key
                        </label>
                        <input
                          type="text"
                          value={pdfUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPdfUrl(val);
                            if (val.includes("docs.google.com") && !magTitle) {
                              setMagTitle(
                                "Google Presentation " +
                                  new Date().toLocaleDateString(),
                              );
                            }
                          }}
                          placeholder="Paste G-Slides URL here..."
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-mono text-zinc-300 focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400 focus:outline-none transition-all shadow-xs"
                        />
                        <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed font-bold uppercase tracking-wider">
                          Ensure share setting is set to{" "}
                          <strong className="text-indigo-650">
                            "Anyone with the link can view"
                          </strong>
                        </p>
                      </div>

                      <div className="bg-indigo-900/30/45 border border-indigo-500/20 p-6 rounded-3xl text-[10px] uppercase font-black tracking-widest text-indigo-650 leading-relaxed">
                        <h5 className="text-gray-100 flex items-center gap-1.5 mb-2 font-bold">
                          <Sparkles size={14} className="text-indigo-650" /> Power-Tip
                        </h5>
                        <p>
                          Open PowerPoint in Slides and select{" "}
                          <strong className="text-zinc-200">File &rarr; Save as Google Slides</strong> to import!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {uploadStep === "settings" && (
                <div className="space-y-6 text-zinc-805">
                  <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/20">
                    <h4 className="font-bold flex items-center gap-2 mb-1 text-zinc-850">
                      <Volume2 size={16} className="text-blue-600" /> Audio &
                      Podcast Features
                    </h4>
                    <p className="text-xs text-zinc-550 mb-3 font-semibold">
                      Allow users to listen to this publication with an AI
                      narrator.
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-zinc-300 text-indigo-650 focus:ring-indigo-500 bg-[#0A0A0A]"
                      />
                      <span className="text-sm font-semibold">
                        Enable Text-to-Speech Companion
                      </span>
                    </label>
                  </div>

                  <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-900/30/10">
                    <h4 className="font-bold flex items-center gap-2 mb-1 text-zinc-850">
                      <Bot size={16} className="text-indigo-400" />{" "}
                      Conversational Copilot
                    </h4>
                    <p className="text-xs text-zinc-550 mb-3 font-semibold">
                      Let readers ask questions about the articles to an AI
                      assistant.
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-zinc-300 text-indigo-650 focus:ring-indigo-500 bg-[#0A0A0A]"
                      />
                      <span className="text-sm font-semibold">
                        Enable Voice Barging Copilot
                      </span>
                    </label>

                    <div className="space-y-6">
                      <div className="bg-[#050505] p-6 rounded-3xl border border-white/10/60 shadow-xs">
                        <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest block mb-3">
                          Conversational Personality
                        </label>
                        <div className="relative">
                          <select
                            value={aiPersonality}
                            onChange={(e) => setAiPersonality(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-zinc-200 focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400 focus:outline-none appearance-none transition-all shadow-sm"
                          >
                            <option>Professional Assistant</option>
                            <option>Casual Guide</option>
                            <option>Industry Expert</option>
                            <option>Brand Ambassador</option>
                            <option>Technical Support</option>
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                             <Settings size={18} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#050505] p-6 rounded-3xl border border-white/10/60 shadow-xs">
                        <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest flex justify-between items-center mb-3">
                          Knowledge Directory / Context
                          <span className="text-[10px] text-indigo-650 bg-indigo-900/30 px-2.5 py-0.5 rounded-full lowercase font-semibold">Smart indexing</span>
                        </label>
                        <div className="relative">
                          <textarea 
                            value={aiContext}
                            onChange={(e) => setAiContext(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-3xl px-6 py-5 text-sm font-medium text-zinc-200 focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400 focus:outline-none h-40 resize-none transition-all leading-relaxed placeholder:text-zinc-350 shadow-sm"
                            placeholder="e.g. Page 5: Focus on irrigation technology. Page 12: Croplan technical data. Advertiser STIHL featured on page 24..."
                          ></textarea>
                           <div className="absolute bottom-4 right-4 pointer-events-none opacity-10 text-indigo-950">
                             <Bot size={40} />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {uploadStep === "processing" && (
                <div className="flex flex-col items-center justify-center h-full space-y-6 py-10 bg-[#0A0A0A]">
                  {/* Perfect SVG Circular progress tracker */}
                  <div className="relative flex items-center justify-center w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90 select-none" viewBox="0 0 100 100">
                      {/* Background Circle rail track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#FAF9F6"
                        strokeWidth="6"
                        fill="transparent"
                        className="stroke-zinc-100"
                      />
                      {/* Foreground Circle showing real-time progress */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#00c896"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 - (processingPercent / 100) * (2 * Math.PI * 40)}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out"
                      />
                    </svg>

                    {/* Content inside the circle tracker */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Bot
                        className="text-[#00c896] animate-pulse"
                        size={22}
                      />
                      <span className="text-sm font-black text-gray-100 mt-0.5 select-none font-mono">
                        {processingPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h4 className="font-bold text-lg text-zinc-850 animate-pulse">
                      {processingPercent === 100 ? "Sync Complete!" : "Analyzing Document"}
                    </h4>
                    
                    {/* Synchronized dynamic checklist of document steps */}
                    <ul className="text-xs text-zinc-300 space-y-3.5 text-left w-56 mx-auto mt-5">
                      <li className={`flex items-center gap-2.5 font-bold transition-all duration-300 ${
                        processingPercent >= 35 ? 'text-emerald-600' : 'text-zinc-200'
                      }`}>
                        {processingPercent >= 35 ? (
                          <CheckCircle2 size={15} className="text-[#00c896] shrink-0" />
                        ) : (
                          <Loader2 size={15} className="animate-spin text-[#00c896] shrink-0" />
                        )}
                        <span className={processingPercent < 35 ? 'font-black text-[#00c896]' : 'font-semibold'}>
                          Converting pages
                        </span>
                      </li>

                      <li className={`flex items-center gap-2.5 font-bold transition-all duration-300 ${
                        processingPercent >= 70 ? 'text-emerald-600' : 
                        processingPercent >= 35 ? 'text-zinc-200' : 'text-zinc-400'
                      }`}>
                        {processingPercent >= 70 ? (
                          <CheckCircle2 size={15} className="text-[#00c896] shrink-0" />
                        ) : processingPercent >= 35 ? (
                          <Loader2 size={15} className="animate-spin text-[#00c896] shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/10 shrink-0" />
                        )}
                        <span className={processingPercent >= 35 && processingPercent < 70 ? 'font-black text-[#00c896]' : 'font-semibold'}>
                          Extracting text layout
                        </span>
                      </li>

                      <li className={`flex items-center gap-2.5 font-bold transition-all duration-300 ${
                        processingPercent >= 100 ? 'text-emerald-600' : 
                        processingPercent >= 70 ? 'text-zinc-200' : 'text-zinc-400'
                      }`}>
                        {processingPercent >= 100 ? (
                          <CheckCircle2 size={15} className="text-[#00c896] shrink-0" />
                        ) : processingPercent >= 70 ? (
                          <Loader2 size={15} className="animate-spin text-[#00c896] shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/10 shrink-0" />
                        )}
                        <span className={processingPercent >= 70 && processingPercent < 100 ? 'font-black text-[#00c896]' : 'font-semibold'}>
                          Generating voice models
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {uploadStep !== "processing" && (
              <div className="p-6 sm:p-8 border-t border-white/5/85 bg-[#050505] flex justify-between items-center gap-4">
                {uploadStep === "settings" ? (
                  <>
                    <button
                      onClick={() => setUploadStep("select")}
                      className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-all rounded-xl border border-white/10 cursor-pointer hover:bg-[#1A1A1A]/5"
                    >
                      Back
                    </button>
                    <button
                      onClick={startUpload}
                      className="bg-indigo-650 text-white hover:bg-indigo-700 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Process & Publish</span>
                      <Sparkles size={16} className="group-hover:rotate-12 transition-transform text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <div />
                    <button
                      onClick={() => setUploadStep("settings")}
                      disabled={!magTitle}
                      className="bg-indigo-650 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                    >
                      <span>Next: AI Pipeline</span>
                      <Sparkles size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Batch Sync Progress Overlay Modal --- */}
      {isBatchSyncing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-md">
          <div className="bg-[#0A0A0A] border border-white/10/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5/80 bg-[#050505] flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Globe className="animate-spin text-blue-650" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-100">Heyzine Dynamic Sync</h3>
                <p className="text-xs text-zinc-500">
                  Syncing publication assets, metadata profiles, and Conversational AI payloads...
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto bg-[#0A0A0A]">
              {/* Overall Progress Bar */}
              {(() => {
                const total = Object.keys(batchSyncProgress).length;
                const completed = Object.values(batchSyncProgress).filter((p: any) => p.status === 'completed' || p.status === 'failed').length;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                return (
                  <div className="space-y-1.5 pb-4 border-b border-white/5/80">
                    <div className="flex justify-between text-xs font-semibold font-mono text-zinc-500">
                      <span>SYNC PROGRESS</span>
                      <span>{completed} / {total} COMPLETED ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-3 bg-[#0A0A0A]">
                {Object.keys(batchSyncProgress).map((magId) => {
                  const mag = myMagazines.find(m => m.id === magId);
                  const progress = batchSyncProgress[magId];
                  if (!mag) return null;
                  return (
                    <div key={magId} className="flex justify-between items-center p-3 rounded-lg bg-[#050505] border border-white/10/60">
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <div className="w-8 h-8 rounded bg-zinc-200/40 flex items-center justify-center shrink-0">
                          {mag.coverUrl ? (
                            <img src={mag.coverUrl} alt="" className="w-full h-full object-cover rounded animate-pulse" />
                          ) : (
                            <FileText size={16} className="text-zinc-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-200 truncate">{mag.title}</p>
                          <p className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            {mag.aiEnabled ? (
                              <span className="text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.2 rounded">AI Copilot</span>
                            ) : null}
                            <span>{mag.pageCount || 1} pgs</span>
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {progress.status === 'waiting' && (
                          <span className="text-zinc-500 text-[11px] font-mono flex items-center gap-1.5 font-bold">
                            Waiting...
                          </span>
                        )}
                        {progress.status === 'syncing' && (
                          <span className="text-blue-600 text-[11px] font-mono flex items-center gap-1.5 font-semibold animate-pulse">
                            <Loader2 size={12} className="animate-spin text-blue-600" /> Syncing...
                          </span>
                        )}
                        {progress.status === 'completed' && (
                          <span className="text-emerald-600 text-[11px] font-mono flex items-center gap-1.5 font-bold">
                            Success ✅
                          </span>
                        )}
                        {progress.status === 'failed' && (
                          <span className="text-red-500 text-[11px] font-mono flex items-center gap-1.5 font-bold" title={progress.error}>
                            Failed ❌
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-[#050505] border-t border-white/5/80 flex justify-end gap-2">
              {Object.values(batchSyncProgress).every((p: any) => p.status === 'completed' || p.status === 'failed') ? (
                <button
                  onClick={() => {
                    setIsBatchSyncing(false);
                    setSelectedMagIds([]); // Reset selection on completion
                  }}
                  className="px-5 py-2.5 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Close & Done
                </button>
              ) : (
                <button
                  onClick={() => setIsBatchSyncing(false)}
                  className="px-4 py-2 rounded-lg text-zinc-500 hover:text-zinc-200 font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Run in Background
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Customize Digital Suite Looks Modal --- */}
      {isCustomizeOpen && selectedHzPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm shadow-2xl">
          <div className="bg-[#0A0A0A] border border-white/10/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-white/5/80 bg-[#050505]">
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-100">
                <Settings
                  size={20}
                  className="text-indigo-650"
                />{" "}
                Custom Layout Suite
              </h3>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 p-2 hover:bg-[#1A1A1A]/10 rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 max-h-[70vh] overflow-y-auto bg-[#0A0A0A] text-zinc-200">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
                  Selected Publication
                </span>
                <h4 className="text-base font-bold text-gray-100 mt-0.5">
                  {selectedHzPub.title || selectedHzPub.name}
                </h4>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  ID: {selectedHzPub.id}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5/80">
                {/* Selected Skin Theme */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-zinc-500 block">
                    Desk Backdrop Skin Theme
                  </label>
                  <select
                    value={hzTheme}
                    onChange={(e) => setFbTheme(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-zinc-250 rounded-lg px-4 py-3 text-sm font-semibold focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400 focus:outline-none text-zinc-200"
                  >
                    <option value="slate">Minimal Deep Charcoal (Slate)</option>
                    <option value="wooden">Warm Chestnut Oak Desk (Wooden)</option>
                    <option value="sand">Premium Matte Sand Paper (Beige)</option>
                    <option value="ocean">Sapphire Gradient Backdrop (Ocean Blue)</option>
                    <option value="obsidian">Gloss Matte Dark (Midnight Obsidian)</option>
                    <option value="brushed-steel">Industrial Brushed Sheet (Steel Chrome)</option>
                  </select>
                </div>

                {/* Top Brand logo url */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-zinc-500 block">
                    Top Branding Logo Overlay URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={hzLogoUrl}
                    onChange={(e) => setFbLogoUrl(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-zinc-250 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold">
                    Overlay a custom company watermark logo on the corner of the reader.
                  </p>
                </div>

                {/* Transitions Duration (Slider) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs uppercase tracking-wider font-bold text-zinc-500">
                    <span>Page Flip Animation Speed</span>
                    <span className="text-indigo-650 font-mono font-black">{hzPageTransitionsSpeed} ms</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={hzPageTransitionsSpeed}
                    onChange={(e) => setFbPageTransitionsSpeed(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono font-bold leading-none mt-1">
                    <span>Ultra Fast (100ms)</span>
                    <span>Standard (800ms)</span>
                    <span>Cinema Slow (2000ms)</span>
                  </div>
                </div>

                {/* Switch checkbox options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-start gap-3 p-3 bg-[#050505] border border-white/10/60 rounded-xl cursor-pointer hover:border-zinc-300 transition-all select-none">
                    <input
                      type="checkbox"
                      checked={hzHardCover}
                      onChange={(e) => setFbHardCover(e.target.checked)}
                      className="w-5 h-5 rounded border-zinc-300 text-indigo-650 bg-[#0A0A0A] mt-0.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-850">
                        Leather Hardcover
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                        Generates a classic physical rigid spine texture.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#050505] border border-white/10/60 rounded-xl cursor-pointer hover:border-zinc-300 transition-all select-none">
                    <input
                      type="checkbox"
                      checked={hzSoundEnabled}
                      onChange={(e) => setFbSoundEnabled(e.target.checked)}
                      className="w-5 h-5 rounded border-zinc-300 text-indigo-650 bg-[#0A0A0A] mt-0.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-850">
                        Rustling Sound FX
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                        Plays highly satisfying pages flip rustling sounds.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-[#050505] border border-white/10/60 rounded-xl cursor-pointer hover:border-zinc-300 transition-all select-none col-span-1 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={hzEnableRtl}
                      onChange={(e) => setFbEnableRtl(e.target.checked)}
                      className="w-5 h-5 rounded border-zinc-300 text-indigo-650 bg-[#0A0A0A] mt-0.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-850">
                        RTL (Right-To-Left) Orientation
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                        Select this for books in Hebrew, Arabic, Persian, or custom magazines styled right-to-left.
                      </span>
                    </div>
                  </label>
                </div>

                {/* AI Guidance Context inside same modal! */}
                <div className="space-y-4 pt-4 border-t border-white/10/60">
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-500 block">
                    AI Conversational Custom Intelligence
                  </span>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 block">AI Voice Assistant Character Name</label>
                    <input
                      type="text"
                      value={hzAiPersonality}
                      onChange={(e) => setHzAiPersonality(e.target.value)}
                      placeholder="Professional Assistant / Interactive Curator"
                      className="w-full bg-[#0A0A0A] border border-[#dddddd] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00c896]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-500 block">Knowledge Directory Custom System Guidelines</label>
                    <textarea
                      rows={3}
                      value={hzAiContext}
                      onChange={(e) => setHzAiContext(e.target.value)}
                      placeholder="Add system behavior guidelines, specific corporate values, contact details, or background facts..."
                      className="w-full bg-[#0A0A0A] border border-[#dddddd] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00c896]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/5/80 bg-[#050505] flex justify-end gap-3">
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-bold text-zinc-500 hover:text-zinc-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={applyCustomization}
                disabled={hzCustomizeLoading}
                className="px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase font-bold bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                {hzCustomizeLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Customizing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} /> Commit Layout Specs
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Tracked Links Generation Portal Modal --- */}
      {isTrackedLinkOpen && selectedHzPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-[#0A0A0A] border border-white/10/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-white/5/80 bg-[#050505] text-gray-100">
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-100">
                <LinkIcon size={20} className="text-blue-600 animate-pulse" />{" "}
                Individual Tracked Campaign Links
              </h3>
              <button
                onClick={() => setIsTrackedLinkOpen(false)}
                className="text-zinc-400 hover:text-zinc-805 p-2 hover:bg-[#1A1A1A]/10 rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto bg-[#0A0A0A] text-zinc-805">
              {/* Publication snapshot info */}
              <div className="bg-[#050505] border border-white/10/60 p-4 rounded-xl flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 border border-white/10/80 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-zinc-905 truncate text-sm">
                    {selectedHzPub.name}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    Interactive Base Link:{" "}
                    <a
                      href={selectedHzPub.canonicalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline font-semibold"
                    >
                      {selectedHzPub.canonicalLink}
                    </a>
                  </p>
                </div>
              </div>

              {/* Generate Form */}
              <div className="p-5 rounded-xl border border-white/10 bg-[#050505] space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-650">
                  Spawn Individual Tracked Link
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-semibold block">
                      Campaign/Recipient Target Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sales Outreach - Acme Corporation"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-200 font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-semibold block">
                      Notification Dispatch Alert Mode
                    </label>
                    <select
                      value={linkNotify}
                      onChange={(e) => setLinkNotify(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-200 focus:outline-none focus:ring-4 focus:ring-indigo-150 focus:border-indigo-400"
                    >
                      <option value="Email">
                        Instant Delivery Email Notification
                      </option>
                      <option value="StateAndEmail">
                        Silent Update (No Emails)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-zinc-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={linkOnViewFirst}
                      onChange={(e) => setLinkOnViewFirst(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 bg-[#0A0A0A] focus:ring-blue-500"
                    />
                    <span>Alert on first view</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-zinc-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={linkOnViewTen}
                      onChange={(e) => setLinkOnViewTen(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 bg-[#0A0A0A] focus:ring-blue-500"
                    />
                    <span>Alert on deep reading</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-zinc-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={linkOnDownload}
                      onChange={(e) => setLinkOnDownload(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 bg-[#0A0A0A] focus:ring-blue-500"
                    />
                    <span>Alert on PDF downloads</span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={createTrackedLink}
                    disabled={linkCreating || !linkTitle.trim()}
                    className="bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-xs"
                  >
                    {linkCreating ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />{" "}
                        Provisioning Link...
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Deploy Individual Campaign Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Links Container */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  Deployed De-duplicated Links ({trackedLinks.length})
                </h4>
                {trackedLinksLoading ? (
                  <div className="py-12 text-center text-xs text-zinc-500 bg-[#0A0A0A]">
                    <Loader2
                      size={24}
                      className="animate-spin text-indigo-650 mx-auto mb-2"
                    />
                    Loading analytics links...
                  </div>
                ) : trackedLinks.length === 0 ? (
                  <div className="border border-white/10/80 rounded-xl p-8 text-center text-xs text-zinc-450 bg-white/5/50">
                    No tracked campaign targets built for this publication yet.
                    Start by filling the tracking alert form above!
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[25vh] overflow-y-auto pr-1">
                    {trackedLinks.map((link: any) => (
                      <div
                        key={link.id}
                        className="bg-[#050505] p-4 border border-white/10/60 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-300 transition-colors"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1 w-full">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs truncate text-gray-100 max-w-[200px] block">
                              {link.title || link.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-widest uppercase font-bold ${link.state === "Deactivated" || link.state === "Disabled" ? "bg-red-50 text-red-750 border border-red-200" : "bg-emerald-900/30 text-emerald-700 border border-emerald-200"}`}
                            >
                              {link.state || "Active"}
                            </span>
                          </div>

                          {/* Copy link bar */}
                          <div className="flex items-center gap-1.5 bg-[#0A0A0A] border border-white/5/80 px-2.5 py-1.5 user-select-all rounded w-full">
                            <input
                              type="text"
                              readOnly
                              value={link.linkUrl || link.canonicalLink || ""}
                              onClick={(e) => {
                                (e.target as HTMLInputElement).select();
                                navigator.clipboard.writeText(
                                  link.linkUrl || link.canonicalLink || "",
                                );
                              }}
                              title="Click to select all & Copy Url"
                              className="bg-transparent border-none text-[10px] font-mono text-zinc-600 w-full focus:outline-none cursor-pointer font-medium"
                            />
                            <span className="text-[8px] uppercase tracking-wider text-zinc-400 hover:text-zinc-200 font-bold px-1 font-mono select-none">
                              Copy
                            </span>
                          </div>

                          <div className="flex gap-2.5 text-[10px] text-zinc-500 font-mono font-medium">
                            <span>
                              Views:{" "}
                              <strong className="text-zinc-850 font-bold">
                                {link.viewsCount || 0}
                              </strong>
                            </span>
                            <span>
                              Alerts:{" "}
                              <strong className="text-indigo-650 font-bold">
                                {link.notificationsType || "Email"}
                              </strong>
                            </span>
                            <span>
                              Setup:{" "}
                              <strong className="text-zinc-300 font-semibold">
                                {link.notifOnFirstView ? "View1" : ""}
                                {link.notifOnSpentTime ? ", Read10" : ""}
                                {link.notifOnDownload ? ", DL" : ""}
                              </strong>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleLinkState(link.id, link.state)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all shrink-0 cursor-pointer ${link.state === "Deactivated" || link.state === "Disabled" ? "bg-emerald-900/30 hover:bg-emerald-100/85 text-emerald-700 border border-emerald-200" : "bg-red-50 hover:bg-red-105/85 text-red-700 border border-red-200"}`}
                        >
                          {link.state === "Deactivated" ||
                          link.state === "Disabled"
                            ? "Reactivate Link"
                            : "Deactivate Link"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-white/5/80 bg-[#050505] flex justify-end">
              <button
                onClick={() => setIsTrackedLinkOpen(false)}
                className="px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase font-bold bg-[#050505] hover:bg-[#1A1A1A]/10 border border-white/10 text-zinc-600 hover:text-zinc-850 transition-colors cursor-pointer"
              >
                Done & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {magToDelete !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMagToDelete(null)}
          />
          <div className="bg-[#0A0A0A] rounded-2xl shadow-2xl relative z-10 w-full max-w-sm overflow-hidden p-6 text-center shadow-red-900/10 border border-white/5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 text-red-500">
              <Trash2 size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-[17px] font-black font-sans text-gray-100 mb-2 leading-tight">
              Delete "{myMagazines.find(m => m.id === magToDelete)?.title || 'Publication'}"?
            </h3>
            <p className="text-sm font-medium text-zinc-500 mb-8 leading-relaxed">
              This action cannot be undone. Your publication and its configured AI context will be permanently lost.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMagToDelete(null)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/10 border border-white/10/60 text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(magToDelete)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
