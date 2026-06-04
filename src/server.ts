import express from 'express';
import { createServer } from 'http';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import db, { initDb } from './db';
import { advertiserContext, roadAheadContext, bbqContext, leadershipContext } from './contexts';
import fs from 'fs';
import Stripe from 'stripe';
import * as pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { withTenant } from './lib/convo-mag/db';
import { processDocumentIngest } from './lib/convo-mag/processor';
import { executeTwoStageRAG } from './lib/convo-mag/retrieval';
import { processBillingWebhook } from './lib/convo-mag/billing';
import { tracer } from './lib/convo-mag/tracing';
import { ingestDocument, performRagSearch } from './services/ai';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const getAi = () => genAI;

app.set('trust proxy', 1);
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
const samplePdfPath = path.join(uploadsDir, 'sample.pdf');
if (!fs.existsSync(samplePdfPath)) {
  const b64 = "JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyA1IDAgUj4+ZW5kb2JqCjQgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PmVuZG9iago1IDAgb2JqPDwvTGVuZ3RoIDE0MD4+c3RyZWFtCkJUCi9GMSAyNCBUZgo3MCA3MDAgVGQKKENvbnZvTWFnIEFpIERpZ2l0YWwgRWRpdGlvbikgVGoKMCAtNjAgVGQKKENsaWNrIE1pYyBidXR0b24gdG8gdGFsayB0byB5b3VyIEFJIGNvbXBhbmlvbiBiZWxvdyEpIFRqCjAgLTMwIFRkCihUaGlzIGlzIGFuIG9mZmxpbmUgaW50ZXJhY3RpdmUgcmVhZGluZyBzZXNzaW9uLikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1NiAwMDAwMCBuIAowMDAwMDAwMTExIDAwMDAwIG4gCjAwMDAwMDAyMTIgMDAwMDAgbiAKMDAwMDAwMDI4MyAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQ3NgolJUVPRgo=";
  fs.writeFileSync(samplePdfPath, Buffer.from(b64, 'base64'));
}
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
}, express.static(uploadsDir));

// --- Stripe Integration ---
let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn('STRIPE_SECRET_KEY not found. Stripe features will be disabled.');
      return null;
    }
    stripe = new Stripe(key);
  }
  return stripe;
};

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return res.status(503).json({ error: 'Stripe service unavailable' });
    }

    const { priceId, magazineId } = req.body;
    
    // In a real app, you'd find the price in your DB or Stripe
    // For this demo, let's use a dynamic price if none provided
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: magazineId ? `Premium Access: ${magazineId}` : 'ConvoMag Pro Subscription',
              description: 'Unlock AI companion, high-quality TTS, and advanced interactive features.',
            },
            unit_amount: priceId === 'annual' ? 9900 : 999, // $99.00 or $9.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/hub?payment=success&mag=${magazineId || 'pro'}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/hub?payment=cancel`,
    });

    res.json({ id: session.id });
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Init database
initDb();

// --- API Routes for Database ---

// Get analytics for a magazine
app.get('/api/magazines/:id/analytics', (req, res) => {
  try {
    const id = req.params.id;
    const magazine = resolveMagazine(id);
    if (!magazine) return res.status(404).json({ error: 'Magazine not found' });
    
    // Return mock analytics data based on the magazine's stats
    res.json({
      stats: [
        { label: 'Total Readers', value: magazine.viewCount || 0, trend: 12.5 },
        { label: 'Podcast Plays', value: magazine.listenCount || 0, trend: 18.1 },
        { label: 'Avg. Read Time', value: '14m 20s', trend: 5.2 },
        { label: 'Link Clicks', value: Math.floor((magazine.viewCount || 0) * 0.3), trend: -2.4 },
      ],
      topPages: [
        { page: 1, views: Math.floor((magazine.viewCount || 0) * 0.9), title: 'Cover' },
        { page: 4, views: Math.floor((magazine.viewCount || 0) * 0.6), title: 'Featured Article' },
        { page: Math.floor((magazine.pageCount || 10) / 2), views: Math.floor((magazine.viewCount || 0) * 0.4), title: 'Advertiser Spread' },
      ],
      devices: {
        mobile: 65,
        desktop: 25,
        tablet: 10
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get advertiser details
app.get('/api/advertisers/:id', (req, res) => {
  try {
    const { id } = req.params;
    // Mock advertiser response
    const advertisers: Record<string, any> = {
      'toyota': {
        id: 'toyota',
        brand_name: 'Toyota South Africa',
        description: 'Lead the way with Toyota. Discover our latest range of reliable, durable and capable vehicles designed for South African roads.',
        website: 'https://www.toyota.co.za',
        phone: '+27 800 139 111',
        email: 'info@toyota.co.za',
        address: 'Stand 1, Wesco Park, Sandton',
        rating: 4.8,
        featured_products: [
          { id: 'p1', name: 'Hilux Double Cab', description: 'The legendary tough bakkie.', price: 'From R 550,000' },
          { id: 'p2', name: 'Fortuner', description: 'The luxury SUV of choice.', price: 'From R 680,000' }
        ]
      },
      'stihl': {
        id: 'stihl',
        brand_name: 'STIHL Forestry',
        description: 'Premium chainsaws, trimmers, and forestry equipment built for professionals.',
        website: 'https://www.stihl.co.za',
        phone: '+27 33 846 3800',
        email: 'info@stihl.co.za',
        address: 'Pietermaritzburg, KZN',
        rating: 4.9,
        featured_products: [
          { id: 's1', name: 'MS 382 Chainsaw', description: 'Heavy-duty performance for forestry.', price: 'Ask for quote' }
        ]
      }
    };
    
    // Auto-generate if not found
    const data = advertisers[id] || {
      id,
      brand_name: id.toUpperCase() + ' Corp',
      description: 'Your trusted partner delivering excellence.',
      website: `https://www.${id}.com`,
      phone: '1-800-CONTACT',
      email: `hello@${id}.com`,
      address: 'Business District, Tech Park',
      rating: 4.5,
      featured_products: [
        { id: '1', name: 'Premium Service', description: 'Comprehensive package tailored to your needs.', price: 'Custom' }
      ]
    };
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch advertiser' });
  }
});

// Get all magazines
app.get('/api/magazines', (req, res) => {
  try {
    const magazines = db.prepare('SELECT * FROM magazines ORDER BY createdAt DESC').all();
    res.json(
      magazines.map((m: any) => ({
        ...m,
        aiEnabled: !!m.aiEnabled,
        ttsEnabled: !!m.ttsEnabled,
        chatEnabled: !!m.chatEnabled,
        hardcover: !!m.hardcover,
        soundEnabled: m.soundEnabled !== undefined ? !!m.soundEnabled : true,
        rtl: !!m.rtl,
        themeBackground: m.themeBackground || 'slate',
        logoUrl: m.logoUrl || '',
        pageTransitionsSpeed: m.pageTransitionsSpeed !== undefined ? Number(m.pageTransitionsSpeed) : 1000
      }))
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch magazines' });
  }
});

// Proxy endpoint to download external PDFs to circumvent CORS errors on the client
app.get('/api/proxy-pdf', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }
  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || 'application/pdf';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error: any) {
    console.error("Proxy PDF failure, sending local sample fallback:", error);
    const samplePdfPath = path.join(process.cwd(), 'uploads', 'sample.pdf');
    if (fs.existsSync(samplePdfPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.sendFile(samplePdfPath);
    } else {
      res.status(500).send("Failed to proxy PDF: " + error.message);
    }
  }
});

// Helper to resolve magazine configs using SQLite with high-fidelity preset fallbacks
function resolveMagazine(id: string) {
  try {
    const dbMag = db.prepare('SELECT * FROM magazines WHERE id = ?').get(id) as any;
    if (dbMag) return dbMag;
  } catch (err) {
    console.warn("Database lookup failed, returning preset config:", err);
  }

  // Premium fallback preset values matching the list of magazines
  const presets: Record<string, any> = {
    'mag_harvest_82': {
      id: 'mag_harvest_82',
      publisherId: 'pub_1',
      title: 'Harvest SA June 2026',
      slug: 'harvest-sa-june-2026',
      coverUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400',
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      status: 'published',
      createdAt: new Date().toISOString(),
      aiEnabled: 1,
      ttsEnabled: 1,
      chatEnabled: 1,
      pageCount: 84,
      viewCount: 2450,
      listenCount: 610,
      aiPersonality: 'Expert Agricultural Consultant',
      aiContext: advertiserContext,
      logoUrl: '',
      rtl: 0,
      themeBackground: 'emerald',
      pageTransitionsSpeed: 1000,
      soundEnabled: 1,
      hardcover: 0
    },
    'paper_wsj': {
      id: 'paper_wsj',
      publisherId: 'pub_1',
      title: 'The Wall Street Journal AI Edition',
      slug: 'wsj-ai-edition',
      coverUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400',
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      status: 'published',
      createdAt: new Date().toISOString(),
      aiEnabled: 1,
      ttsEnabled: 1,
      chatEnabled: 1,
      pageCount: 16,
      viewCount: 15300,
      listenCount: 2950,
      aiPersonality: 'Financial News Agent',
      aiContext: leadershipContext,
      logoUrl: '',
      rtl: 0,
      themeBackground: 'slate',
      pageTransitionsSpeed: 800,
      soundEnabled: 1,
      hardcover: 0
    },
    'paper_twp': {
      id: 'paper_twp',
      publisherId: 'pub_1',
      title: 'The Washington Post',
      slug: 'washington-post',
      coverUrl: 'https://images.unsplash.com/photo-1622323530758-dc65df06059d?auto=format&fit=crop&q=80&w=400',
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      status: 'published',
      createdAt: new Date().toISOString(),
      aiEnabled: 1,
      ttsEnabled: 1,
      chatEnabled: 1,
      pageCount: 24,
      viewCount: 9280,
      listenCount: 1200,
      aiPersonality: 'Editorial Analyst',
      aiContext: leadershipContext,
      logoUrl: '',
      rtl: 0,
      themeBackground: 'neutral',
      pageTransitionsSpeed: 950,
      soundEnabled: 1,
      hardcover: 0
    },
    'paper_leadership': {
      id: 'paper_leadership',
      publisherId: 'pub_1',
      title: 'Leadership SA Monthly',
      slug: 'leadership-sa-monthly',
      coverUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      status: 'published',
      createdAt: new Date().toISOString(),
      aiEnabled: 1,
      ttsEnabled: 1,
      chatEnabled: 1,
      pageCount: 48,
      viewCount: 1850,
      listenCount: 300,
      aiPersonality: 'Corporate Strategist',
      aiContext: leadershipContext,
      logoUrl: '',
      rtl: 0,
      themeBackground: 'amber',
      pageTransitionsSpeed: 1000,
      soundEnabled: 1,
      hardcover: 0
    },
    'paper_bbq': {
      id: 'paper_bbq',
      publisherId: 'pub_2',
      title: 'Black Business Quarterly',
      slug: 'black-business-quarterly',
      coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      status: 'published',
      createdAt: new Date().toISOString(),
      aiEnabled: 1,
      ttsEnabled: 1,
      chatEnabled: 1,
      pageCount: 40,
      viewCount: 3100,
      listenCount: 450,
      aiPersonality: 'Business Intelligence Consultant',
      aiContext: bbqContext,
      logoUrl: '',
      rtl: 0,
      themeBackground: 'slate',
      pageTransitionsSpeed: 1000,
      soundEnabled: 1,
      hardcover: 0
    },
    'mag_rs': {
      id: 'mag_rs',
      publisherId: 'pub_1',
      title: 'Retail Tech & Security Digest',
      slug: 'retail-tech-security-digest',
      coverUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=400',
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      status: 'published',
      createdAt: new Date().toISOString(),
      aiEnabled: 1,
      ttsEnabled: 1,
      chatEnabled: 1,
      pageCount: 32,
      viewCount: 1100,
      listenCount: 190,
      aiPersonality: 'Loss Prevention Specialist',
      aiContext: roadAheadContext,
      logoUrl: '',
      rtl: 0,
      themeBackground: 'slate',
      pageTransitionsSpeed: 1000,
      soundEnabled: 1,
      hardcover: 0
    }
  };

  return presets[id] || null;
}

// Get a single magazine by id
app.get('/api/magazines/:id', (req, res) => {
  try {
    const magazine = resolveMagazine(req.params.id);
    if (!magazine) return res.status(404).json({ error: 'Magazine not found' });
    res.json({
      ...magazine,
      aiEnabled: !!magazine.aiEnabled,
      ttsEnabled: !!magazine.ttsEnabled,
      chatEnabled: !!magazine.chatEnabled,
      hardcover: !!magazine.hardcover,
      soundEnabled: magazine.soundEnabled !== undefined ? !!magazine.soundEnabled : true,
      rtl: !!magazine.rtl,
      themeBackground: magazine.themeBackground || 'slate',
      logoUrl: magazine.logoUrl || '',
      pageTransitionsSpeed: magazine.pageTransitionsSpeed !== undefined ? Number(magazine.pageTransitionsSpeed) : 1000
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch magazine' });
  }
});

// GET full-text search across slide / page content for a magazine
app.get('/api/magazines/:id/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.json({ results: [] });
    }
    const query = q.toLowerCase().trim();
    const id = req.params.id;

    // Retrieve magazine using resolveMagazine helper to support fallback presets
    const magazine = resolveMagazine(id);
    if (!magazine) {
      return res.status(404).json({ error: 'Magazine not found' });
    }

    // Determine what text sources we can search across
    let searchableText = magazine.aiContext || "";
    if (!searchableText) {
      if (id === 'mag_1' || magazine.title.toLowerCase().includes('harvest') || magazine.title.toLowerCase().includes('ai')) {
        searchableText = advertiserContext;
      } else if (magazine.title.toLowerCase().includes('road ahead')) {
        searchableText = roadAheadContext;
      } else if (magazine.title.toLowerCase().includes('bbq') || magazine.title.toLowerCase().includes('black business')) {
        searchableText = bbqContext;
      } else if (magazine.title.toLowerCase().includes('leadership')) {
        searchableText = leadershipContext;
      } else {
        searchableText = advertiserContext; // default fallback
      }
    }

    // Parse the searchable text into paragraphs/sections and find matching items
    // Let's split by double line breaks or markdown sections
    const sections = searchableText.split(/\n(?:#{1,4}\s+|\* )/);
    const results: any[] = [];

    sections.forEach((sec) => {
      if (sec.toLowerCase().includes(query)) {
        // Extract title or first line
        const lines = sec.trim().split('\n');
        if (lines.length === 0) return;
        const sectionTitle = lines[0].replace(/[#*`:]/g, '').trim();
        
        // Find page number if mentioned
        let pageNum = 1;
        const pageMatch = sec.match(/(?:page[:\s]?|page\s+x[:\s]?|target\s+publication\s+page[:\s]?|target\s+page\s+x[:\s]?)(\d+)/i);
        if (pageMatch && pageMatch[1]) {
          pageNum = parseInt(pageMatch[1], 10);
        } else {
          // Fallback guess based on length or just default to 1
          pageNum = Math.floor(Math.random() * (magazine.pageCount || 10)) + 1;
        }

        // Format a neat snippet highlighting the query
        const textWithoutTitle = lines.slice(1).join(' ').replace(/\s+/g, ' ');
        const queryIndex = textWithoutTitle.toLowerCase().indexOf(query);
        let snippet = textWithoutTitle;
        if (queryIndex !== -1) {
          const start = Math.max(0, queryIndex - 40);
          const end = Math.min(textWithoutTitle.length, queryIndex + query.length + 50);
          snippet = (start > 0 ? "..." : "") + textWithoutTitle.substring(start, end) + (end < textWithoutTitle.length ? "..." : "");
        } else {
          snippet = textWithoutTitle.substring(0, 100) + "...";
        }

        results.push({
          page: pageNum,
          title: sectionTitle || "Article Content",
          snippet: snippet.trim(),
        });
      }
    });

    res.json({ results: results.filter(r => r.title && r.title.length < 150).slice(0, 10) });
  } catch (error: any) {
    console.error("Search failed:", error);
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
});

// POST conversation scope chat assistant for a magazine
app.post('/api/magazines/:id/chat', async (req, res) => {
  const { id } = req.params;
  const { query, history } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    // Retrieve magazine using resolveMagazine helper to support fallback presets
    const magazine = resolveMagazine(id);
    if (!magazine) {
      return res.status(404).json({ error: 'Magazine not found' });
    }

    // Determine what text sources we can use
    let contextText = magazine.aiContext || "";
    if (!contextText) {
      if (id === 'mag_1' || magazine.title.toLowerCase().includes('harvest') || magazine.title.toLowerCase().includes('ai')) {
        contextText = advertiserContext;
      } else if (magazine.title.toLowerCase().includes('road ahead')) {
        contextText = roadAheadContext;
      } else if (magazine.title.toLowerCase().includes('bbq') || magazine.title.toLowerCase().includes('black business')) {
        contextText = bbqContext;
      } else if (magazine.title.toLowerCase().includes('leadership')) {
        contextText = leadershipContext;
      } else {
        contextText = advertiserContext; // default fallback
      }
    }

    let answerText = "";
    let pageNumbers: number[] = [];

    // Attempt Gemini call
    try {
      const ai = getAi();
      const personality = magazine.aiPersonality || "You are ConvoMag AI, an intelligent, professional conversational magazine companion.";
      const systemInstruction = `${personality}\n\nYou are answering questions about the magazine: "${magazine.title}".\n\nHere is the full text context and extract of the magazine content:\n${contextText}\n\nStrict guidelines:\n1. Answer the user query using the facts from the magazine context above.\n2. Include specific page number citations in your answer when mentioning facts (e.g. "[Page 5]"). If the page isn't clear, reconstruct it using the context's page mentions.\n3. Keep the response clean, engaging, professional, and directly useful.`;

      // Structure contents (history + new query)
      const contentsParts: any[] = [];
      if (history && Array.isArray(history)) {
        history.slice(-6).forEach(msg => {
          contentsParts.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }
      contentsParts.push({
        role: 'user',
        parts: [{ text: query }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contentsParts,
        config: {
          systemInstruction,
        }
      });

      answerText = response.text || "";

      // Extract referenced page numbers
      const pageRegex = /(?:page|pages|p\.)\s*(\d+)/gi;
      let match;
      while ((match = pageRegex.exec(answerText)) !== null) {
        const pNum = parseInt(match[1], 10);
        if (!isNaN(pNum) && !pageNumbers.includes(pNum)) {
          pageNumbers.push(pNum);
        }
      }

    } catch (aiError: any) {
      console.warn("Server chat: Falling back to local offline search engine:", aiError.message);
      
      const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const paragraphs = contextText.split(/\n\s*\n|\n(?=###|\*)/);
      const matchedParagraphs: string[] = [];

      paragraphs.forEach((p: string) => {
        let score = 0;
        queryWords.forEach((word: string) => {
          if (p.toLowerCase().includes(word)) score += 1;
        });
        if (score > 0) {
          matchedParagraphs.push(p);
        }
      });

      if (matchedParagraphs.length > 0) {
        matchedParagraphs.sort((a, b) => b.length - a.length);
        const topMatches = matchedParagraphs.slice(0, 3);
        
        answerText = `Here is what I found in the magazine concerning your query:\n\n` + 
          topMatches.map(m => m.trim()).join("\n\n") + 
          `\n\n*(Note: Showing direct entries found offline in the local index database. Configure GEMINI_API_KEY in Settings to enable live synthetic conversational dialogue.)*`;

        topMatches.forEach(m => {
          const pageMatch = m.match(/(?:page[:\s]?\s*|page\s+x[:\s]?\s*|target\s+publication\s+page[:\s]?\s*|target\s+page\s+x[:\s]?\s*)(\d+)/i);
          if (pageMatch && pageMatch[1]) {
            const pNum = parseInt(pageMatch[1], 10);
            if (!pageNumbers.includes(pNum)) pageNumbers.push(pNum);
          }
        });
      } else {
        answerText = `I searched this edition of "${magazine.title}" but didn't find any direct sections containing "${query}". Try searching for related keywords!\n\n*(Note: Displayed from local database search index.)*`;
      }
    }

    res.json({
      answer: answerText,
      pageSuggestions: pageNumbers
    });

  } catch (err: any) {
    console.error("Chat handler failure:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/magazines/:id/summarize-section', async (req, res) => {
  const { id } = req.params;
  const { heading, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Missing content parameter' });
  }

  try {
    const ai = getAi();
    const systemInstruction = `You are an AI reading assistant. Summarize the provided text in exactly two concise, punchy sentences. Make it engaging and easy to digest quickly. Ignore formatting or structural artifacts. Focus entirely on the core message.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [{
        role: 'user',
        parts: [{ text: `Section: ${heading || 'Untitled'}\n\nContent:\n${content}` }]
      }],
      config: {
        systemInstruction,
      }
    });

    res.json({ summary: response.text || "" });
  } catch (err: any) {
    console.error("Summarization failure:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a single magazine
app.delete('/api/magazines/:id', (req, res) => {
  try {
    const id = req.params.id;
    const mag = db.prepare('SELECT pdfUrl FROM magazines WHERE id = ?').get(id) as any;
    if (mag && mag.pdfUrl && mag.pdfUrl.startsWith('/uploads/')) {
      const fileName = path.basename(mag.pdfUrl);
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      if (fs.existsSync(filePath) && fileName !== 'sample.pdf') {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Failed to delete file", filePath, e);
        }
      }
    }
    db.prepare('DELETE FROM magazines WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete magazine: ' + error.message });
  }
});

// Update a single magazine (partial update)
app.put('/api/magazines/:id', (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    
    // Build dynamic query for allowed fields
    const allowedFields = [
      'title', 'coverUrl', 'status', 'aiEnabled', 'aiPersonality', 'aiContext', 
      'ttsEnabled', 'chatEnabled', 'pageCount', 'hardcover', 
      'soundEnabled', 'rtl', 'themeBackground', 'logoUrl', 'pageTransitionsSpeed'
    ];
    
    const updates: string[] = [];
    const params: any[] = [];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (['aiEnabled', 'ttsEnabled', 'chatEnabled', 'hardcover', 'soundEnabled', 'rtl'].includes(field)) {
          params.push(body[field] ? 1 : 0);
        } else if (field === 'pageTransitionsSpeed' || field === 'pageCount') {
          params.push(Number(body[field]));
        } else {
          params.push(body[field]);
        }
      }
    }
    
    if (updates.length > 0) {
      params.push(id);
      db.prepare(`UPDATE magazines SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update magazine: ' + error.message });
  }
});

// --- Ingestion Pipeline ---
app.post('/api/ingest', async (req, res) => {
  const { pdfData, fileName, magazineId } = req.body;
  const tenantId = "tenant_default"; // Mock tenant for now

  if (!pdfData || !magazineId) {
    return res.status(400).json({ error: "Missing pdfData or magazineId" });
  }

  try {
    const documentId = uuidv4();
    const storagePath = path.join(uploadsDir, `${documentId}.pdf`);
    const buffer = Buffer.from(pdfData.split(',')[1], 'base64');
    fs.writeFileSync(storagePath, buffer);

    db.prepare(`
      INSERT INTO documents (id, tenant_id, file_name, storage_path, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(documentId, tenantId, fileName || "uploaded.pdf", storagePath, "processing");

    // Also create the magazine record so it shows up in the UI
    db.prepare(`
      INSERT INTO magazines (id, publisherId, title, slug, status, createdAt, pdfUrl, aiEnabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      magazineId, 
      "pub_1", 
      fileName?.replace(".pdf", "") || "New Publication", 
      (fileName?.replace(".pdf", "") || "mag").toLowerCase().replace(/ /g, "-") + "-" + Date.now(),
      "processing",
      new Date().toISOString(),
      `/uploads/${documentId}.pdf`,
      1
    );

    // Extract text and start background ingestion
    const pdfParser = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default;
    const parsed = await pdfParser(buffer);
    const text = parsed.text;

    // Run ingestion in background
    ingestDocument(tenantId, documentId, fileName || "uploaded.pdf", text)
      .then(() => console.log(`Ingestion complete for ${documentId}`))
      .catch(err => console.error(`Ingestion failed for ${documentId}:`, err));

    res.json({ id: documentId, status: "processing" });
  } catch (error: any) {
    console.error("Ingestion Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Podcast Generation ---
app.post('/api/magazines/:id/podcast', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const prompt = `Create a professional podcast script outline for a magazine named "${title}". 
    The podcast should have two hosts discussing the key themes of a modern AI-powered digital magazine. 
    Output should be a structured JSON with "episode_name", "hosts", "segments" (array of {title, description, timestamp}).`;

    const result = await getAi().models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const script = JSON.parse(result.text || "{}");
    res.json(script);
  } catch (error: any) {
    console.error("Podcast Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- RAG Chat ---
app.post('/api/magazines/:id/chat-rag', async (req, res) => {
  const { id } = req.params;
  const { query, history } = req.body;
  const tenantId = "tenant_default";

  try {
    const contextChunks = await performRagSearch(tenantId, null, query, 5);
    const contextText = contextChunks.map(c => `Snippet: ${c.content}`).join("\n\n");

    const personality = "You are ConvoMag AI, a professional magazine assistant. Answer questions based ONLY on the provided context. If unsure, say so.";
    
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
       history.slice(-4).forEach((msg: any) => {
         contents.push({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] });
       });
    }
    contents.push({ role: 'user', parts: [{ text: `CONTEXT:\n${contextText}\n\nUSER QUERY: ${query}` }] });

    const result = await getAi().models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: personality
      }
    });

    res.json({
      answer: result.text || "",
      citations: contextChunks.map(c => ({ id: c.id, content: c.content }))
    });
  } catch (error: any) {
    console.error("RAG Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- API Routes for Bookshelves ---

// Get all bookshelves
app.get('/api/bookshelves', (req, res) => {
  try {
    const bookshelves = db.prepare('SELECT * FROM bookshelves').all();
    const bookshelvesWithMags = bookshelves.map((bs: any) => ({
      ...bs,
      magazines: db.prepare(`
        SELECT m.* FROM magazines m
        JOIN bookshelf_magazines bm ON m.id = bm.magId
        WHERE bm.bookshelfId = ?
        ORDER BY bm.position
      `).all(bs.id)
    }));
    res.json(bookshelvesWithMags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookshelves' });
  }
});

// Create bookshelf
app.post('/api/bookshelves', (req, res) => {
  try {
    const { title, publisherId } = req.body;
    const id = `shelf_${Date.now()}`;
    db.prepare('INSERT INTO bookshelves (id, title, publisherId, createdAt) VALUES (?, ?, ?, ?)').run(id, title, publisherId || 'pub_1', new Date().toISOString());
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bookshelf' });
  }
});

// Delete bookshelf
app.delete('/api/bookshelves/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM bookshelves WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bookshelf' });
  }
});

// Add magazine to bookshelf
app.post('/api/bookshelves/:id/magazines', (req, res) => {
  try {
    const { magId } = req.body;
    db.prepare('INSERT INTO bookshelf_magazines (bookshelfId, magId, position) VALUES (?, ?, ?)').run(req.params.id, magId, Date.now());
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add magazine to bookshelf' });
  }
});

// Remove magazine from bookshelf
app.delete('/api/bookshelves/:bookshelfId/magazines/:magId', (req, res) => {
  try {
    db.prepare('DELETE FROM bookshelf_magazines WHERE bookshelfId = ? AND magId = ?').run(req.params.bookshelfId, req.params.magId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove magazine from bookshelf' });
  }
});

// --- DOCUPIPE API KEY & EXTRACTION HELPERS ---

function getDocupipeApiKey(): string {
  try {
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("docupipe_api_key") as any;
    if (row && row.value) {
      return row.value;
    }
  } catch (e) {
    console.error("Error fetching docupipe api key from db", e);
  }
  return process.env.DOCUPIPE_API_KEY || '';
}

async function extractTextWithDocupipe(pdfBuffer: Buffer, fileName: string): Promise<string> {
  const docupipeKey = getDocupipeApiKey();
  if (!docupipeKey) {
    throw new Error('No DOCUPIPE_API_KEY is configured');
  }

  console.log(`[Docupipe] Submitting ${fileName} to Docupipe for extraction...`);
  // Encode buffer to base64
  const base64Contents = pdfBuffer.toString('base64');
  
  const payload = {
    document: {
      file: {
        contents: base64Contents,
        filename: fileName
      }
    }
  };

  const submitRes = await fetch('https://app.docupipe.ai/document', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'X-API-Key': docupipeKey
    },
    body: JSON.stringify(payload)
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    throw new Error(`Docupipe submission failed: ${submitRes.status} - ${errText}`);
  }

  const submitJson = await submitRes.json() as any;
  const documentId = submitJson.documentId;
  const jobId = submitJson.jobId || documentId;
  
  if (!documentId) {
    throw new Error(`Docupipe submission did not return a documentId: ${JSON.stringify(submitJson)}`);
  }

  console.log(`[Docupipe] Document submitted. documentId: ${documentId}, jobId: ${jobId}. Polling via job endpoint with exponential backoff...`);

  // Poll for completion matching user's Python snippet with exponential backoff
  let status = "processing";
  let waitMs = 2000;
  let totalAttempts = 0;
  let finalJobData: any = null;

  while (status === "processing") {
    totalAttempts++;
    if (totalAttempts > 15) {
      throw new Error(`Docupipe extraction failed to complete: processing timed out after ${totalAttempts} checks.`);
    }

    // Delay with exponential backoff
    await new Promise(resolve => setTimeout(resolve, waitMs));
    waitMs = Math.min(waitMs * 2, 16000); // capped at 16 seconds to avoid massive jumps

    console.log(`[Docupipe] Polling job status for jobId: ${jobId} (Attempt ${totalAttempts})...`);
    const statusRes = await fetch(`https://app.docupipe.ai/job/${jobId}`, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': docupipeKey
      }
    });

    if (!statusRes.ok) {
      console.warn(`[Docupipe] Failed to check status: ${statusRes.status}. Retrying...`);
      continue;
    }

    finalJobData = await statusRes.json() as any;
    status = finalJobData.status || "processing";
    console.log(`[Docupipe] Job status: ${status}`);

    if (status === 'failed') {
      throw new Error(`Docupipe background extraction failed: ${finalJobData.error || 'unknown job failure'}`);
    }
  }

  console.log(`[Docupipe] Job complete with status '${status}'. Parsing extraction payload...`);

  // Helper to extract text from given JSON node
  const grabText = (obj: any): string => {
    if (!obj) return '';
    if (obj.markdown) return obj.markdown;
    if (obj.text) return obj.text;
    if (obj.document) {
      if (obj.document.markdown) return obj.document.markdown;
      if (obj.document.text) return obj.document.text;
      if (Array.isArray(obj.document.pages)) {
        return obj.document.pages.map((p: any) => p.markdown || p.text || '').join('\n\n');
      }
    }
    if (Array.isArray(obj.pages)) {
      return obj.pages.map((p: any) => p.markdown || p.text || '').join('\n\n');
    }
    if (obj.data) {
      if (obj.data.markdown) return obj.data.markdown;
      if (obj.data.text) return obj.data.text;
    }
    return '';
  };

  let text = grabText(finalJobData);

  // Fallback: If job payload doesn't contain the extracted contents directly, query the document endpoint
  if (!text) {
    console.log(`[Docupipe] Job payload did not contain text directly. Querying /document/${documentId} fallback...`);
    try {
      const docRes = await fetch(`https://app.docupipe.ai/document/${documentId}`, {
        headers: {
          'accept': 'application/json',
          'X-API-Key': docupipeKey
        }
      });
      if (docRes.ok) {
        const docData = await docRes.json();
        text = grabText(docData);
      }
    } catch (e) {
      console.warn(`[Docupipe] Fallback document query failed:`, e);
    }
  }

  // Final fallback to raw JSON string if nothing matches
  if (!text && finalJobData) {
    text = JSON.stringify(finalJobData);
  }

  return text;
}

app.get('/api/docupipe/config', (req, res) => {
  const apiKey = getDocupipeApiKey();
  res.json({
    apiKeyConfigured: !!apiKey,
    hasEnvKey: !!process.env.DOCUPIPE_API_KEY,
    maskedKey: apiKey ? (apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : '••••••••') : ''
  });
});

app.post('/api/docupipe/config', (req, res) => {
  try {
    const { apiKey } = req.body;
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('docupipe_api_key', apiKey || '');
    res.json({ success: true, apiKeyConfigured: !!apiKey });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update Docupipe settings: ' + err.message });
  }
});

// --- DOCUPIPE STANDARDIZATION AGENT EXTRACTIONS ---

async function runBackgroundStandardization(
  extractionId: string,
  pdfBuffer: Buffer,
  fileName: string,
  schemaId: string,
  docupipeKey: string
) {
  const updateStatus = (status: string, updates: Record<string, any> = {}) => {
    try {
      const keys = Object.keys(updates);
      if (keys.length > 0) {
        const setClauses = ['status = ?', ...keys.map(k => `${k} = ?`)].join(', ');
        const values = [status, ...keys.map(k => {
          const val = updates[k];
          return (val && typeof val === 'object') ? JSON.stringify(val) : val;
        }), extractionId];
        db.prepare(`UPDATE docupipe_extractions SET ${setClauses} WHERE id = ?`).run(...values);
      } else {
        db.prepare('UPDATE docupipe_extractions SET status = ? WHERE id = ?').run(status, extractionId);
      }
    } catch (e) {
      console.error('[Local Schema Lab] Error updating background extraction SQLite record:', e);
    }
  };

  try {
    // Stage 1: Load and Parse PDF Text Natively
    updateStatus('uploading');
    console.log(`[Local Schema Lab] Natively parsing PDF text contents for job ${extractionId}...`);
    
    const pdfParser = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default;
    const parsed = await pdfParser(pdfBuffer);
    const extractedText = parsed.text || '';
    
    if (!extractedText.trim()) {
      throw new Error("No readable text content could be extracted from this PDF edition.");
    }

    console.log(`[Local Schema Lab] Successfully extracted ${extractedText.length} characters of plain text context.`);
    updateStatus('ingesting', { documentId: `local_${Date.now()}`, jobId: `job_${Date.now()}` });

    await new Promise(resolve => setTimeout(resolve, 800)); // Smooth transitions
    updateStatus('submitting_standardization');

    // Stage 2: Call In-App Gemini API to build structured schema
    console.log(`[Local Schema Lab] Requesting structured output from Gemini engine for schema: ${schemaId}...`);
    const ai = getAi();

    let systemInstruction = "";
    if (schemaId === "schema_toc_01") {
      systemInstruction = `You are a professional digital editor. Map and index the following table of contents / headings structure from the magazine's text. Organize it clean and structured.
Return EXACTLY a JSON dictionary structured as follows:
{
  "Frontmatter & Cover": {
    "title_or_editor_intro": "Details of preface and editor words line-by-line"
  },
  "Main Articles": {
    "article_1_heading": "Detailed page number, author, and paragraph highlights summary",
    "article_2_heading": "Detailed description of content theme"
  },
  "Closing sections": {
    "backmatter_details": "Index, contributors, advertiser index"
  }
}`;
    } else if (schemaId === "schema_ads_02") {
      systemInstruction = `You are a commercial advertising auditor. Scan the text context below and identify all sponsors, brands, promotional coupon codes, discounts, or ad banners mentioned.
Return EXACTLY a JSON dictionary structured as follows:
{
  "Active Brand Sponsors": {
    "brand_name_or_domain": "Sponsorship details, products promoted, page references if any"
  },
  "In-App Promotions": {
    "coupon_or_promo_code": "Special discounts mention, affiliate links or terms cited"
  }
}`;
    } else {
      systemInstruction = `You are an elite publishing data miner. Analyze the lease agreement, commercial rate cards, or general text context below and capture specific variables, schedules, and metrics.
Return EXACTLY a JSON dictionary structured as follows:
{
  "General Metadata & Rates": {
    "variable_name": "Key value or numeric target parsed cleanly"
  },
  "Provisions & Clauses": {
    "clause_title": "Summary of active terms or key constraints"
  }
}`;
    }

    updateStatus('polling_standardization');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: 'user', parts: [{ text: extractedText }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const outputText = response.text || "{}";
    let structuredJson = {};
    try {
      structuredJson = JSON.parse(outputText);
    } catch (je) {
      console.warn("[Local Schema Lab] JSON compilation failed from Gemini, assembling raw text payload:", je);
      structuredJson = { "Raw Extracted Content": { "text": outputText } };
    }

    updateStatus('retrieving_json');
    
    // Stage 3: Commit native JSON back to SQLite database
    console.log(`[Local Schema Lab] Updating SQLite records with compiled data...`);
    db.prepare('UPDATE docupipe_extractions SET status = ?, resultJson = ? WHERE id = ?')
      .run('completed', JSON.stringify(structuredJson), extractionId);

    console.log(`[Local Schema Lab] Complete! Native extraction successfully persisted for job: ${extractionId}`);

  } catch (err: any) {
    console.error(`[Local Schema Lab Job failed]:`, err);
    db.prepare('UPDATE docupipe_extractions SET status = ?, error = ? WHERE id = ?')
      .run('failed', err.message || String(err), extractionId);
  }
}

app.get('/api/docupipe/extractions', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM docupipe_extractions ORDER BY createdAt DESC').all();
    res.json(rows.map((row: any) => ({
      ...row,
      resultJson: row.resultJson ? JSON.parse(row.resultJson) : null
    })));
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to query extractions: ' + err.message });
  }
});

app.get('/api/docupipe/extractions/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM docupipe_extractions WHERE id = ?').get(req.params.id) as any;
    if (!row) {
      return res.status(404).json({ error: 'Extraction check failed: record not found' });
    }
    res.json({
      ...row,
      resultJson: row.resultJson ? JSON.parse(row.resultJson) : null
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to query extraction: ' + err.message });
  }
});

app.delete('/api/docupipe/extractions/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM docupipe_extractions WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete extraction: ' + err.message });
  }
});

app.post('/api/docupipe/standardize', (req, res) => {
  const docupipeKey = getDocupipeApiKey() || '';
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!docupipeKey && !geminiKey) {
    return res.status(401).json({ error: 'Gemini API Key is not configured. Please define GEMINI_API_KEY in settings to use the Native AI Parser.' });
  }

  const { pdfData, pdfUrl, magazineId, fileName, schemaId, schemaName } = req.body;
  if (!schemaId) {
    return res.status(400).json({ error: 'extraction schemaId target is required' });
  }

  try {
    let pdfBuffer: Buffer | null = null;
    let actualFileName = fileName || 'document.pdf';

    // Find and read the pdf document
    if (pdfData) {
      const base64Data = pdfData.includes(';base64,') ? pdfData.split(';base64,')[1] : pdfData;
      pdfBuffer = Buffer.from(base64Data, 'base64');
    } else if (pdfUrl) {
      actualFileName = path.basename(pdfUrl) || 'document.pdf';
    } else if (magazineId) {
      const mag = db.prepare('SELECT title, pdfUrl FROM magazines WHERE id = ?').get(magazineId) as any;
      if (!mag) return res.status(404).json({ error: 'Magazine not found' });
      actualFileName = `${mag.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;

      if (mag.pdfUrl) {
        if (mag.pdfUrl.startsWith('/uploads/') || mag.pdfUrl.startsWith('uploads/')) {
          const localPath = path.join(process.cwd(), mag.pdfUrl.replace(/^\/?uploads\//, 'uploads/'));
          if (fs.existsSync(localPath)) {
            pdfBuffer = fs.readFileSync(localPath);
          }
        }
      }
    }

    const extractionId = 'ext_' + Math.random().toString(36).substring(2, 11);
    
    db.prepare(`
      INSERT INTO docupipe_extractions (id, fileName, schemaId, schemaName, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      extractionId,
      actualFileName,
      schemaId,
      schemaName || 'Custom Schema',
      'queued',
      new Date().toISOString()
    );

    // Return the response immediately so browser isn't held hostage by 45s cloud processing loops
    res.json({
      success: true,
      extractionId,
      message: 'Background extraction successfully initiated on server queue'
    });

    // Run the multi-step polling chain asynchronously
    (async () => {
      try {
        if (!pdfBuffer && pdfUrl) {
          console.log(`[Background Standardize] Fetching PDF url at ${pdfUrl}...`);
          const response = await fetch(pdfUrl);
          if (!response.ok) throw new Error(`Remote url download failed with status ${response.status}`);
          const arrayBuffer = await response.arrayBuffer();
          pdfBuffer = Buffer.from(arrayBuffer);
        }

        if (!pdfBuffer && magazineId) {
          const mag = db.prepare('SELECT pdfUrl FROM magazines WHERE id = ?').get(magazineId) as any;
          if (mag && mag.pdfUrl && mag.pdfUrl.startsWith('http')) {
            console.log(`[Background Standardize] Pulling remote web address for magazine: ${mag.pdfUrl}...`);
            const response = await fetch(mag.pdfUrl);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              pdfBuffer = Buffer.from(arrayBuffer);
            }
          }
        }

        if (!pdfBuffer) {
          throw new Error('PDF content couldn\'t be loaded or resolved from database records.');
        }

        // Fire off background orchestrator
        await runBackgroundStandardization(extractionId, pdfBuffer, actualFileName, schemaId, docupipeKey);
      } catch (err: any) {
        console.error(`[Background Fetch/Init error] on ${extractionId}:`, err);
        db.prepare('UPDATE docupipe_extractions SET status = ?, error = ? WHERE id = ?')
          .run('failed', err.message || String(err), extractionId);
      }
    })();

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initiate standardization: ' + err.message });
  }
});

// --- HEYZINE API PROXY ENDPOINTS ---

function getHeyzineApiKey(): string | null {
  try {
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("heyzine_api_key") as any;
    if (row && row.value) {
      return row.value;
    }
  } catch (e) {
    console.error("Error fetching heyzine api key from db", e);
  }
  return process.env.HEYZINE_API_KEY || '598b59586ffb27aeb2ba8c86272490e0eab33209.60d93986b8a3b4e1';
}

function getHeyzineClientId(): string {
  return '60d93986b8a3b4e1';
}

async function handleHzResponse(hzRes: Response) {
  if (!hzRes.ok) {
    const errorMsg = await hzRes.text();
    console.error(`Heyzine API error: ${hzRes.status} ${errorMsg}`);
    throw new Error(`Heyzine API error: ${errorMsg}`);
  }
  return await hzRes.json();
}

app.get('/api/heyzine/config', (req, res) => {
  const apiKey = getHeyzineApiKey();
  res.json({
    apiKeyConfigured: !!apiKey,
    hasEnvKey: !!process.env.HEYZINE_API_KEY,
    maskedKey: apiKey ? (apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : '••••••••') : ''
  });
});

app.post('/api/heyzine/config', (req, res) => {
  try {
    const { apiKey } = req.body;
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('heyzine_api_key', apiKey || '');
    res.json({ success: true, apiKeyConfigured: !!apiKey });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update Heyzine settings: ' + err.message });
  }
});

app.get('/api/heyzine/publications', async (req, res) => {
  try {
    const apiKey = getHeyzineApiKey();
    if (!apiKey) return res.status(401).json({ error: 'Heyzine API key is not configured.' });

    const hzRes = await fetch('https://heyzine.com/api1/flipbook-list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const data = await handleHzResponse(hzRes);
    
    // Patch data to match existing frontend expectations
    const patchedPublications = Array.isArray(data) ? data.map((hzp: any) => ({
      id: hzp.id,
      name: hzp.title,
      cover: hzp.links?.thumbnail,
      totalPages: hzp.pages,
      canonicalLink: hzp.links?.custom || hzp.links?.base || hzp.links?.url || '',
      customizationOptions: {
         theme: "Default",
         hardcoverEnabled: false,
         rtlEnabled: false,
      }
    })) : [];

    res.json({ success: true, publications: patchedPublications });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to connect to Heyzine API' });
  }
});

app.post('/api/heyzine/publications', async (req, res) => {
  try {
    const { name, url, description } = req.body;
    
    // We expect the frontend to pass a full URL that Heyzine can fetch.
    const hzRes = await fetch('https://heyzine.com/api1/rest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pdf: url,
        client_id: getHeyzineClientId(),
        title: name,
        description: description,
        show_info: true,
        background_color: "ffffff"
      })
    });

    const hzJson = await handleHzResponse(hzRes);
    res.json({ success: true, url: hzJson.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create Heyzine flipbook' });
  }
});

// Mock tracked links for Heyzine since we aren't implementing full webhook tracking yet
app.get('/api/heyzine/tracked-links', async (req, res) => {
   res.json([]);
});

app.post('/api/heyzine/tracked-links', async (req, res) => {
   res.json({ success: true });
});

app.post('/api/heyzine/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const apiKey = getHeyzineApiKey();
    if (!apiKey) return res.status(401).json({ error: 'Heyzine API key is not configured.' });

    const hzRes = await fetch('https://heyzine.com/api1/flipbook-delete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    const hzJson = await handleHzResponse(hzRes);
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to delete Heyzine flipbook' });
  }
});

app.post('/api/magazines', async (req, res) => {
  try {
    const { publisherId, title, slug, coverUrl, pdfUrl, pdfData, status, aiEnabled, aiPersonality, aiContext, ttsEnabled, chatEnabled, pageCount } = req.body;
    let finalPdfUrl = pdfUrl || '';

    // Automatically convert public Google Slides URL to direct PDF export
    if (finalPdfUrl.toLowerCase().includes('docs.google.com/presentation/d/')) {
      const gsMatch = finalPdfUrl.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
      if (gsMatch && gsMatch[1]) {
        finalPdfUrl = `https://docs.google.com/presentation/d/${gsMatch[1]}/export/pdf`;
      }
    }

    // Local File Storage if we just have base64 from the client
    else if (pdfData) {
      const base64Data = pdfData.includes(';base64,') ? pdfData.split(';base64,')[1] : pdfData;
      const fileName = `mag_${Date.now()}.pdf`;
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      fs.writeFileSync(filePath, base64Data, 'base64');
      finalPdfUrl = `/uploads/${fileName}`;
    }

    const id = `mag_${Date.now()}`;

    // Ensure uniqueness of slug in the database
    const baseSlug = (slug || title || 'magazine').toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let finalSlug = baseSlug || 'magazine';
    let suffix = 1;
    while (true) {
      const existing = db.prepare('SELECT id FROM magazines WHERE slug = ?').get(finalSlug);
      if (!existing) {
        break;
      }
      finalSlug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const insert = db.prepare(`
      INSERT INTO magazines 
      (id, publisherId, title, slug, coverUrl, pdfUrl, status, createdAt, aiEnabled, aiPersonality, aiContext, ttsEnabled, chatEnabled, viewCount, listenCount, pageCount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
    `);
    
    // Insert immediately so the UI can continue without waiting for long PDF extraction
    insert.run(
      id, publisherId, title, finalSlug, coverUrl || '', finalPdfUrl, status || 'draft',
      new Date().toISOString(), aiEnabled ? 1 : 0, aiPersonality || null, aiContext || '', ttsEnabled ? 1 : 0, chatEnabled ? 1 : 0, Number(pageCount) || 0
    );
    
    res.json({ id });

    // Extract text from the PDF as a background async task
    (async () => {
      let extractedText = '';
      const docupipeKey = getDocupipeApiKey();
      try {
        console.log(`Extracting text from PDF for ${id} in background...`);
        let pdfBuffer: Buffer | null = null;
        if (pdfData) {
          const base64Data = pdfData.includes(';base64,') ? pdfData.split(';base64,')[1] : pdfData;
          pdfBuffer = Buffer.from(base64Data, 'base64');
        } else if (pdfUrl) {
          const pdfRes = await fetch(pdfUrl);
          if (pdfRes.ok) {
            const arrayBuffer = await pdfRes.arrayBuffer();
            pdfBuffer = Buffer.from(arrayBuffer);
          }
        }

        if (pdfBuffer) {
          
            console.log(`[Background] No Docupipe API Key configured. Using standard local pdf-parse...`);
            const pdfParser = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default;
            const parsed = await pdfParser(pdfBuffer);
            extractedText = parsed.text;
          
        }
        
        if (extractedText) {
          console.log(`Successfully extracted ${extractedText.length} characters from PDF for ${id}. Updating database...`);
          const finalAiContext = aiContext ? `${aiContext}\n\n[ACTUAL KNOWLEDGE BASE CONTENT FROM MAGAZINE]\n\n${extractedText}` : `[ACTUAL KNOWLEDGE BASE CONTENT FROM MAGAZINE]\n\n${extractedText}`;
          const update = db.prepare(`UPDATE magazines SET aiContext = ? WHERE id = ?`);
          update.run(finalAiContext, id);
          console.log(`Background PDF extraction completed for ${id}.`);
        }
      } catch (e) {
        console.error(`Failed to parse PDF text for ${id}:`, e);
      }
    })();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create magazine' });
  }
});

wss.on('connection', async (clientWs, request) => {
  console.log('Client connected to Live Bridge');
  
  const urlParams = new URLSearchParams(request.url?.split('?')[1]);
  const contextKey = urlParams.get('context') || 'issue_82_master';
  
  // Try to find the magazine in the database first
  const dbMag = db.prepare('SELECT * FROM magazines WHERE id = ?').get(contextKey.replace('_master', '').replace('_podcast', '')) as any;

  const isLeadership = contextKey.startsWith('leadership_') || [
    'vitality_sleep_focus', 'bonang_mohale_focus', 'lenacapavir_hiv_focus',
    'cgic_insurance_focus', 'history_decolon_focus', 'trade_fdi_focus',
    'service_delivery_focus', 'higher_education_focus', 'medical_costs_focus',
    'it_licensing_esg_focus'
  ].includes(contextKey);

  const isRoadAhead = contextKey.startsWith('road_ahead_') || [
    'toyota_focus', 'isuzu_focus', 'standard_bank_focus', 'shell_focus'
  ].includes(contextKey);

  const isBbq = contextKey.startsWith('bbq_') || [
    'nedbank_bbq_focus', 'mtn_bbq_focus', 'old_mutual_bbq_focus', 'telkom_bbq_focus'
  ].includes(contextKey);

  const isHarvest81 = contextKey.startsWith('harvest_81_');

  const baseSystemPrompt = `
You are ConvoMag AI, a premium publication companion. 
Your goal is to transform digital magazines into immersive conversational and podcast experiences.

CORE OPERATING DIRECTIVES:
1. **SOUTH AFRICAN IDENTITY:** You MUST ALWAYS speak with a distinct, authentic South African accent. Embrace South African pacing, tone, and local terminology where appropriate (e.g., "lekker", "just now", "howzit").
2. **KNOWLEDGE FIDELITY:** You are an expert on the content of the provided magazine. STRICTLY limit your responses to the advertisers, articles, and topics explicitly listed in the provided DIRECTORY or context. Do NOT invent advertisers or facts.
3. **MODE ADAPTIVITY:** 
   - **PODCAST MODE:** If designated as a Podcast Host, immediately begin an engaging, high-energy monologue upon connection. Walk the listener through the key highlights of the magazine.
   - **INTERACTIVE MODE:** If designated as an Assistant, warmly introduce yourself and then WAIT for user input. Do not monologue.
4. **INTERRUPT & RESUME:** Always allow user interruptions. Answer questions precisely, then seamlessly return to your narrative if in podcast mode.
`;

  let currentInstruction = `${baseSystemPrompt}\n\n`;
  let selectedVoice = "Aoede";

  if (dbMag) {
    currentInstruction += `--- CURRENT PUBLICATION: ${dbMag.title} ---\n\n`;
    
    if (dbMag.aiContext) {
      currentInstruction += `PRIMARY KNOWLEDGE BASE (MAGAZINE DIRECTORY):\n${dbMag.aiContext}\n\n`;
    } else {
      currentInstruction += `CONTEXT: We are currently reading "${dbMag.title}". Please assist the user with general questions about this publication's themes.\n\n`;
    }

    const personality = dbMag.aiPersonality || "Professional Assistant";
    currentInstruction += `ADOPTED PERSONA: ${personality}\n`;
    
    // Automatic Persona Expansion
    if (personality.includes("Casual")) {
      currentInstruction += "INSTRUCTION: Be warm, approachable, and use friendly language. Act like a helpful guide sitting next to the reader.\n";
    } else if (personality.includes("Industry Expert")) {
      currentInstruction += "INSTRUCTION: Be authoritative, technical, and precise. Offer deep insights into the subject matter mentioned in the directory.\n";
    } else if (personality.includes("Brand Ambassador")) {
      currentInstruction += "INSTRUCTION: Be enthusiastic and promotional. Focus on the value and quality of the brands and services featured in the magazine.\n";
    } else if (personality.includes("Technical")) {
      currentInstruction += "INSTRUCTION: Focus on troubleshooting, specifications, and data. Be practical and efficient.\n";
    }

    if (dbMag.title.toLowerCase().includes('harvest')) {
       currentInstruction += "\nSPECIAL BRANDING: You represent the Harvest SA publication group. Maintain an expert, helpful agricultural tone focused on the farming community.\n";
    }

    selectedVoice = (dbMag.title.toLowerCase().includes('road ahead') || dbMag.title.toLowerCase().includes('car')) ? "Fenrir" : "Aoede";
  } else {
    // Legacy mapping for hardcoded magazines for backward compatibility
    if (isHarvest81) {
      currentInstruction += `KNOWLEDGE BASE (Harvest Issue 81):\n${advertiserContext}\n\nPERSONA: Professional Assistant`;
      selectedVoice = "Aoede";
    } else if (isLeadership) {
      currentInstruction += `KNOWLEDGE BASE (Leadership Edition):\n${leadershipContext}\n\nPERSONA: Industry Expert`;
      selectedVoice = "Aoede";
    } else if (isRoadAhead) {
      currentInstruction += `KNOWLEDGE BASE (Road Ahead Automotive):\n${roadAheadContext}\n\nPERSONA: Brand Ambassador`;
      selectedVoice = "Fenrir";
    } else if (isBbq) {
      currentInstruction += `KNOWLEDGE BASE (BBQ Business Profile):\n${bbqContext}\n\nPERSONA: Technical Expert`;
      selectedVoice = "Charon";
    } else {
      currentInstruction += `KNOWLEDGE BASE:\n${advertiserContext}\n\nPERSONA: Professional Assistant`;
    }
  }

  // Focal Point Overlays (Dynamic Logic)
  const focusPoint = contextKey.split('_focus')[0];
  const focuses: Record<string, string> = {
    'croplan': 'Croplan Seeds specialists',
    'stihl': 'STIHL machinery technical support',
    'deere': 'John Deere Financial and equipment specialists',
    'new_holland': 'New Holland agricultural product leads',
    'pratley': 'Pratley Clinomix and livestock feed experts',
    'knittex': 'Knittex shade netting and crop protection systems',
    'finance': 'Trade Finance and Credit Insurance experts (Allianz/Prestige)',
    'vitality_sleep': 'Discovery Vitality (Sleep health focus)',
    'bonang_mohale': 'Leadership strategies with Prof Bonang Mohale',
    'toyota': 'Toyota South Africa Hilux fleet experts',
    'isuzu': 'Isuzu South Africa D-Max specialists',
  };

  if (focuses[focusPoint]) {
    currentInstruction += `\n\nDYNAMIC FOCUS: Today you are specifically representing ${focuses[focusPoint]}. Ensure your tone and knowledge prioritize their contributions to the magazine.`;
  }

  // Session Operational Mode
  if (contextKey.endsWith('_master')) {
    currentInstruction += "\n\nSESSION MODE [MASTER]: Warmly introduce yourself once, then WAIT for user questions. Do not monologue.";
  } else {
    currentInstruction += "\n\nSESSION MODE [PODCAST]: Immediately begin a high-energy monologue podcast covering the publication's highlights. Monologue until interrupted.";
  }

  // Final enforcing directives
  const universalDirectives = `
  
ENFORCEMENT RULES:
1. NEVER hallucinate details.
2. ALWAYS return to page context after answering a question.
3. MAINTAIN the South African accent at all times.
`;
  currentInstruction += universalDirectives;


  // Turn tracking and tag parsing state scoped to this connection
  let accumulatedTurnText = "";

  try {
    const session = await getAi().live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } }
        },
        systemInstruction: currentInstruction,
        outputAudioTranscription: {},
        inputAudioTranscription: {}
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          // Send back transcripts, audio, and interruption signals
          let audio: string | undefined = undefined;
          let rawText = "";
          let pageGo: number | undefined = undefined;
          let callPhone: string | undefined = undefined;
          let openUrl: string | undefined = undefined;
          
          // Extract user transcription if present
          const userParts = (message.serverContent as any)?.userTurn?.parts;
          let userText = "";
          if (userParts) {
            for (const part of userParts) {
              if (part.text) {
                userText += part.text;
              }
            }
          }
          
          const parts = message.serverContent?.modelTurn?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.inlineData?.data) {
                audio = part.inlineData.data;
              }
              if (part.text) {
                rawText += part.text;
               }
            }
          }
          
          if (rawText) {
            accumulatedTurnText += rawText;
          }
          
          // Smoothly detect [PAGE_GO:X] anytime at the start or mid-turn, extracting it immediately
          const match = accumulatedTurnText.match(/\[PAGE_GO:(\d+)\]/i);
          if (match) {
            pageGo = parseInt(match[1], 10);
            // Delete any found full tag form from the vocal transcript safely
            accumulatedTurnText = accumulatedTurnText.replace(/\[PAGE_GO:\d+\]/gi, "");
          }

          // Smoothly detect [CALL_PHONE:<number>] anytime and extract it
          const phoneMatch = accumulatedTurnText.match(/\[CALL_PHONE:([\+0-9]+)\]/i);
          if (phoneMatch) {
            callPhone = phoneMatch[1];
            // Delete any found call tag from the vocal transcript safely
            accumulatedTurnText = accumulatedTurnText.replace(/\[CALL_PHONE:[\+0-9]+\]/gi, "");
          }

          // Smoothly detect [OPEN_URL:<url>] anytime and extract it
          const urlMatch = accumulatedTurnText.match(/\[OPEN_URL:([^\]]+)\]/i);
          if (urlMatch) {
            openUrl = urlMatch[1].trim();
            // Delete any found url tag from the vocal transcript safely
            accumulatedTurnText = accumulatedTurnText.replace(/\[OPEN_URL:[^\]]+\]/gi, "");
          }
          
          const interrupted = message.serverContent?.interrupted;
          if (interrupted) {
            accumulatedTurnText = "";
          }
          
          const turnComplete = message.serverContent?.turnComplete;
          if (turnComplete) {
            accumulatedTurnText = "";
          }
          
          if (audio || rawText || interrupted || pageGo !== undefined || callPhone !== undefined || openUrl !== undefined || userText) {
            clientWs.send(JSON.stringify({ 
              audio, 
              text: accumulatedTurnText || undefined, 
              interrupted,
              pageGo,
              callPhone,
              openUrl,
              userText: userText || undefined
            }));
          }
        }
      }
    });

    session.sendClientContent({
      turns: [{ role: "user", parts: [{ text: "Hello! Let's start the DeepDive podcast now." }] }],
      turnComplete: true
    });

    clientWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.audio) {
          // Reset turn text accumulators because a new user speech query began
          accumulatedTurnText = "";
          
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" }
          });
        }
      } catch (err) {
        console.error("Error processing client frame:", err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client disconnected from Live Bridge');
      // session.close(); // SDK handles automatic cleanup on disconnect usually, but good to be explicit
    });

  } catch (error) {
    console.error("Failed to connect to Gemini Live:", error);
    clientWs.close();
  }
});

// Upgrade HTTP to WebSocket for /live path
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// --- ConvoMag Production API Transitions ---

// Ingest Enqueue Route
app.post('/api/ingest', async (req, res) => {
  const { documentId, tenantId, localPdfPath, pdfData, fileName } = req.body;
  const tId = tenantId || 'tenant_default';
  const docId = documentId || `doc_${uuidv4().substring(0, 8)}`;
  
  try {
    let finalPdfPath = localPdfPath;

    // Handle base64 upload from frontend
    if (pdfData && !localPdfPath) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
      
      const safeFileName = (fileName || 'document.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
      finalPdfPath = path.join(uploadsDir, `${uuidv4()}_${safeFileName}`);
      
      const base64Data = pdfData.replace(/^data:application\/pdf;base64,/, "");
      fs.writeFileSync(finalPdfPath, base64Data, 'base64');
    }

    if (!finalPdfPath) {
      return res.status(400).json({ error: 'Missing PDF content (localPdfPath or pdfData)' });
    }

    // Step 0: Ensure document record exists in PG
    await withTenant(tId, async (client) => {
      await client.query(
        `INSERT INTO documents (id, tenant_id, title, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET updated_at = NOW()`,
        [docId, tId, fileName || 'Untitled Document', 'queued']
      );
    });

    // Process asynchronously (simulating BullMQ trigger)
    processDocumentIngest({ documentId: docId, tenantId: tId, localPdfPath: finalPdfPath }).catch(err => {
      tracer.error({ traceId: uuidv4(), documentId: docId, tenantId: tId }, 'Ingestion background task failed', err);
    });

    return res.status(202).json({
      status: 'queued',
      documentId: docId,
      message: 'Document enqueued for layout-aware parsing and semantic indexing.',
    });
  } catch (err: any) {
    tracer.error({ traceId: uuidv4(), documentId: docId, tenantId: tId }, 'Job enqueueing failed', err);
    return res.status(500).json({ error: 'Failed to schedule ingestion pipeline.' });
  }
});

// Secure Conversational Retrieval Route
app.post('/api/rag/chat', async (req, res) => {
  const { documentId, query, tenantId } = req.body;
  // Use a default tenantId if not provided for backward compatibility
  const tId = tenantId || 'tenant_default';

  if (!documentId || !query) {
    return res.status(400).json({ error: 'Missing documentId or query' });
  }

  try {
    const response = await executeTwoStageRAG(tId, documentId, query);
    return res.json(response);
  } catch (err: any) {
    tracer.error({ traceId: uuidv4(), documentId, tenantId: tId }, 'RAG pipeline error', err);
    return res.status(500).json({ error: 'Failed to retrieve grounded answer.' });
  }
});

// Get AI Studio Ingested Documents from PG
app.get('/api/production-docs', async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string || 'tenant_default';
    const docs = await withTenant(tenantId, async (client) => {
      const result = await client.query('SELECT * FROM documents ORDER BY created_at DESC');
      return result.rows;
    });
    res.json(docs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch production documents' });
  }
});

// Stripe Webhook with Raw Body
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  const stripeClient = getStripe();
  
  if (!signature || !stripeClient) {
    return res.status(400).json({ error: 'Missing webhook verification requirements' });
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripeClient.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook Signature validation failure: ${err.message}`);
    return res.status(400).json({ error: `Signature Validation Failed: ${err.message}` });
  }

  try {
    await processBillingWebhook(stripeEvent);
    return res.json({ received: true });
  } catch (error: any) {
    console.error(`Database synchronization failed: ${error.message}`);
    return res.status(500).json({ error: 'Failed to synchronize billing state' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    
    // Fallback for SPA routing in development to serve transformed index.html
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl || req.url;
      // Skip API and asset routes so other middlewares / static assets are handled
      if (url.startsWith('/api/') || url.startsWith('/uploads/') || url.includes('.')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${port}`);
  });
}

startServer();
