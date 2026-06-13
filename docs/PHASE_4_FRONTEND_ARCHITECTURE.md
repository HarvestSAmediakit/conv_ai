# CONVOMAG AI™: Phase 4 - Complete Frontend Architecture

## 1. Frontend Architecture Overview
The frontend of ConvoMag AI is a high-performance, edge-rendered enterprise web application built on **Next.js 15** and **React 19**. It utilizes Server Components (RSC) for heavy data-fetching and SEO, and Client Components for highly interactive elements like the Document Reader, Voice UI, and Chat Interfaces. The UI is built using **Tailwind CSS**, **ShadCN UI**, and **Framer Motion** to deliver a premium, editorial, and cinematic experience that complies with "Apple + Tesla + OpenAI + Bloomberg" design standards.

## 2. Master Folder Structure

```text
/frontend
├── /src
│   ├── /app                     # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)               # Authentication grouping
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)          # Protected Application Routes
│   │   │   ├── admin/page.tsx
│   │   │   ├── advertiser/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── hub/page.tsx     # Marketplace
│   │   │   └── studio/page.tsx  # Publisher Studio
│   │   ├── reader               # Core Reader Architecture
│   │   │   └── [issueId]/page.tsx
│   │   ├── demo/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx             # Landing Page
│   ├── /components              # Shared React Components
│   │   ├── /ai                  # Conversational Components
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── VoiceOrb.tsx
│   │   │   └── PodcastPlayer.tsx
│   │   ├── /reader              # Reading & Flipbook Engine
│   │   │   ├── ConvoMagViewer.tsx
│   │   │   └── PageControls.tsx
│   │   ├── /ui                  # ShadCN primitive components
│   │   └── /shared              # Navbars, Sidebars, Footers
│   ├── /lib                     # Utilities and configurations
│   │   ├── /actions             # Next.js Server Actions (Mutations)
│   │   ├── /api                 # API/tRPC Client Configurations
│   │   ├── /hooks               # Custom React Hooks
│   │   │   ├── useVoiceStream.ts
│   │   │   └── useChatRag.ts
│   │   ├── /store               # Global State (Zustand)
│   │   └── utils.ts             # Tailwind class merging (cn)
│   ├── /providers               # Context Providers (Theme, Auth)
│   └── /styles                  # Global CSS (Tailwind entry)
├── public                       # Static assets, fonts, icons
├── tailwind.config.ts           # Tailwind configuration
├── next.config.mjs              # Next.js configuration
├── package.json
└── tsconfig.json
```

## 3. Component Architecture & Code Structure

### 3.1. Server Components vs. Client Components
- **Server Components (Default)**: Used for landing pages, directory listings, and analytics dashboards. Data is fetched efficiently on the server.
- **Client Components (`"use client"`)**: Used strictly at the leaf nodes of the component tree for interactivity (e.g., `<ConvoMagViewer />`, `<VoiceOrb />`, `<ChatPanel />`).

### 3.2. Core Domain Components
1. **`ConvoMagViewer.tsx`**: The core flipbook engine. Uses CSS 3D transforms (or specialized canvas/PDF rendering libraries) to display magazine pages smoothly. Integrates with the Intersection Observer API for lazy loading off-screen pages.
2. **`ChatPanel.tsx`**: A sliding drawer interface for the AI assistant. Maintains reading context (current page number) and injects it into LLM queries.
3. **`VoiceOrb.tsx`**: A floating, draggable action button leveraging Framer Motion. Interacts with the Web Audio API and WebSockets for real-time voice synthesis and barge-in.
4. **`PodcastPlayer.tsx`**: Persistent bottom bar for synthetic audio playback. Synchronizes audio progress with text highlighting if supported by the issue.

## 4. State Management & Data Flow
- **Local State**: Managed via `useState`/`useReducer` for isolated component mechanics (like dropdowns or local form inputs).
- **Global State**: Managed via **Zustand**. Used for reader settings (font size, theme), active podcast state (persists across route changes), and offline caching status.
- **Server State & Caching**: Managed via Next.js 15 native caching mechanisms, `fetch` deduplication, and SWR or React Query for real-time polling (e.g., processing statuses in the Publisher Studio).
- **Server Actions**: Used for form submissions (e.g., uploading a new PDF, updating AI settings) to reduce client-side JavaScript bundling.

## 5. Security Considerations
- **Secure Sessions**: Clerk handles stateless session management. JWTs are stored in HttpOnly cookies to prevent XSS.
- **Content Security Policy (CSP)**: Strict headers deployed via Next.js `middleware.ts` to prevent unauthorized execution of inline scripts and isolate WebAssembly modules if used for PDF rendering.
- **Sanitization**: All AI-generated text and HTML responses are sanitized using DOMPurify before being injected into the DOM to prevent accidental XSS from LLM hallucinations.

## 6. Scalability & Performance Strategy
- **Image Optimization**: Covers and thumbnails are served using `next/image` with WebP/AVIF formatting and automatic resizing down to edge devices.
- **Streaming SSR**: Large analytics dashboards use React `Suspense` boundaries. The skeleton loads instantly while the heavy analytical data resolves asynchronously on the server.
- **Progressive Web App (PWA)**: Service Workers (`next-pwa`) aggressively cache static assets, font files, and pre-fetched issues to enable the "Offline Reading" requirement.
- **PDF Streaming**: Large magazine issues are not downloaded fully to the client. The backend serves high-resolution tile images or byte-ranged PDF chunks on-demand as the user flips pages.

## 7. Deployment Strategy
- **Edge Deployment**: Deployed natively on **Vercel** to utilize Edge Functions for middleware (RBAC routing, redirects) and Vercel CDN for ultra-low latency delivery globally.
- **CI/CD Integration**: GitHub Actions runs ESLint, Prettier, TypeScript checks, and Playwright E2E tests before allowing merges to `main`. Every PR generates a unique preview URL.
- **Environment Targeting**: Strict separation of `.env.local` for development, `.env.preview` for staging, and `.env.production` heavily guarded in Vercel.

*(End of Phase 4)*
