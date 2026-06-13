# ConvoMag AI — Conversational Digital Magazine Platform

> Transforming Static PDFs into Interactive, Conversational, Voice-Enabled Digital Experiences.

ConvoMag AI is a multi-tenant digital magazine SaaS platform designed for high-end publishers. It takes standard publications, processes layout structures, and builds fully responsive digital flipbooks. Readers don't just read the articles; they can talk directly to the magazine using a real-time voice-baging assistant, listen to automatic podcast-style audio narrations, and review interactive citation overlays.

---

## 🏗️ Core Architecture Overview

ConvoMag AI is built on a high-availability, hybrid data model that balances rapid horizontal scale, cost-efficiency, and secure tenancy.

```
                  ┌───────────────────────┐
                  │   Vite React Client   │
                  └───────────┬───────────┘
                              │ HTTPS / WSS
                              ▼
                  ┌───────────────────────┐
                  │  Express Full-Stack   │
                  └──────┬─────────┬──────┘
                         │         │
          (Multi-Tenant) │         │ (App State / Local Cache)
                         ▼         ▼
             ┌──────────────┐   ┌──────────────┐
             │  PostgreSQL  │   │ SQLite (WAL) │
             │ (pgvector)   │   └──────────────┘
             └──────────────┘
```

### 1. Hybrid Relational Data Strategy
- **SQLite (WAL Mode enabled)**: Houses light, standard administrative records (publishers, magazines, reader counts, settings, bookshelves) locally.
- **PostgreSQL (`pgvector` + RLS)**: Holds the high-dimension document page chunks and vector embeddings. Uses Transaction-Scoped Row-Level Security (RLS) policies to make cross-tenant disclosures structurally impossible.

### 2. Double-Stage RAG Pipeline
- **Retrieval Phase**: Utilizes native Gemini (`text-embedding-004` at 768 dim) or OpenAI (`text-embedding-3-small` at 1536 dim) matching on pgvector indices.
- **Rerank Refinement**: Integrates a Cohere client running `rerank-english-v3.0` to filter the top-matching contexts, yielding high citation accuracy.
- **Synthesis Grounding**: Leverages Gemini Flash models to produce highly engaging, context-grounded outputs completed with exact page-level footnotes.

---

## ⚡ Key Highlights & Capabilities

- **📖 Interactive Flipbooks**: Custom responsive page-turn physics engine with built-in multi-touch support for tablets and mobile devices.
- **🎙️ Duo Narrator Conversations**: Automatically converts standard article content into multi-voice, dual-host podcast channels.
- **🛡️ Multi-Tenant Isolation**: RLS and secure JWT authentication isolate every transaction per publisher.
- **💳 Stripe Subscription Portal**: Production-ready Stripe elements for subscription memberships and tier structures.
- **📈 Advanced Advertiser Dashboard**: Interactive analytics charts tracking reader click sessions, geographic locations, and heatmaps.

---

## 🚀 Step-by-Step Local Deployment & Operation

The stack is containerized and available to run locally with native services using a single command.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) with BuildKit enabled.
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher).

### Quickstart Command
```bash
# Clone and spin up PostgreSQL, Redis, and ConvoMag App services
docker compose up --build -d
```

### Verification
Once running, verify the container status and system logs:
```bash
# Check container statuses
docker compose ps

# Access live health endpoint
curl http://localhost:3000/api/health
```
The application will be accessible at: **`http://localhost:3000`**

---

## 🔐 Environment Integration Reference (`.env`)

Populate these keys in your `.env` file at the project root for local operations.

| Environmental Key | Required | Default | Definition / Purpose |
|-------------------|----------|---------|-------------------------|
| `PORT` | No | `3000` | The ingress binding Port. |
| `NODE_ENV` | No | `development` | The application execution mode. |
| `JWT_SECRET` | Yes | `changeme` | Signing key used to encrypt publisher sessions. |
| `GEMINI_API_KEY` | Yes | - | Google GenAI API key for embeddings and translation. |
| `COHERE_API_KEY` | No | - | Key used to run custom two-stage RAG reranking. |
| `OPENAI_API_KEY` | No | - | Secondary fallback embedding driver. |
| `STRIPE_SECRET_KEY`| No | - | Invoicing key for processing client memberships. |
| `DATABASE_URL` | No | - | PostgreSQL endpoint with pgvector integration. |
| `DATABASE_PATH` | No | `/app/data/database.sqlite` | SQLite database absolute disk path fallback. |

---

## 📁 System Project Structure

```text
├── Dockerfile                  # Hardened 4-stage multi-stage builder
├── docker-compose.yml          # Local multi-service orchestrator
├── package.json                # Core platform module mappings
├── schema.sql                  # SQLite baseline structure definitions
├── schema_pg.sql               # PostgreSQL pgvector + RLS setup commands
├── public/                     # Static media payloads and Service Workers
│   └── audio-processor.js      # Low-latency voice-activity handler
└── src/
    ├── server.ts               # Core full-stack Express API entry point
    ├── db.ts                   # SQLite connector and administrative migrations
    ├── App.tsx                 # Lazy-loaded router view boundaries
    ├── components/             # Visual interfaces modules
    │   ├── chat/               # Conversational AI Panels and live mic modes
    │   ├── flipbook/           # Interactive PDF flipbook engine
    │   └── analytics/          # Business intelligence charts
    ├── lib/                    # Shared helper and processing utilities
    └── services/
        └── ai.ts               # Resilient hybrid RAG, Cohere & OpenAI driver
```

---

## 📡 API Routing Dictionary

An exhaustive map of available core service routes.

### 🔑 Membership & Authentication
- `POST /api/auth/register` - Create publisher account credentials.
- `POST /api/auth/login` - Verify identity and request signed JWT.
- `GET /api/auth/me` - Map logged authentication token details.

### 📚 Digital Magazines
- `GET /api/magazines` - Fetch the catalog list of digital publications.
- `POST /api/magazines` - Upload or reference new PDF magazines.
- `GET /api/magazines/:id` - Fetch comprehensive details for a specific magazine.
- `DELETE /api/magazines/:id` - Cleanly remove magazine file records and indices.

### 🧠 Semantic Pipelines
- `POST /api/ingest` - Ingest document layers: runs chunk-splitting layout analysis.
- `POST /api/rag/chat` - Perform grounded client query with page citation footnotes.

### 💳 Webhooks & Invoicing
- `POST /api/webhooks/stripe` - Receive Stripe webhook notifications.

---

## 👩‍💻 Standard Local Build Verification

If you prefer building and verifying compilation manually outside Docker:
```bash
# 1. Install production and development system assets
npm install

# 2. Run standard syntax validation checks
npm run lint

# 3. Compile client and bundle background processes
npm run build

# 4. Spin up local dev server
npm run dev
```

---

## ✨ Developed with AI Studio

Ensured full production grade architectures, performance optimization, and strong multi-tenant security structures.
