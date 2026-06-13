# CONVOMAG AI™: Phase 1 - Complete Product & System Architecture

## 1. Executive Overview
**Platform Name**: ConvoMag AI™
**Tagline**: "Don't Just Read The Magazine. Talk To It."
**Brand Focus**: Harvest SA Magazine
**Launch Target**: July 2026
**Target Scale**: 10M Readers, 100k Advertisers, 50k Publications, 100M+ AI Queries/Month

ConvoMag AI is a multi-tenant, horizontally horizontally scalable SaaS platform that transforms static publishing assets into interactive, conversational, and voice-enabled experiences.

## 2. Core Product Suite (ConvoMag AI OS)
1. **ConvoMag Reader™**: AI-powered PDF/Flipbook rendering engine with deep-linking and offline caching.
2. **ConvoMag Voice™**: Two-way conversational voice assistant with WebRTC streaming and active barge-in.
3. **ConvoMag Podcast™**: Magazine-to-podcast synthetic audio engine utilizing multiple voice actors.
4. **ConvoMag Advertiser AI™**: Domain-specific synthetic agents that promote catalog products securely based on reader context.
5. **ConvoMag Insights™**: High-throughput telemetry and analytics engine.
6. **ConvoMag Studio™**: Publisher ingestion, configuration, and distribution dashboard.
7. **ConvoMag Admin™**: Global Super-Admin access control and health monitoring.

## 3. High-Level System Architecture

### 3.1. Infrastructure & Edge Layer
- **Cloud Provider**: AWS (Primary) / Google Cloud (AI Services Backup)
- **CDN & Edge**: CloudFront (for static asset delivery and edge caching)
- **WAF & Security**: AWS WAF, Shield Advanced
- **Ingress / API Gateway**: NGINX Ingress on Amazon EKS (Kubernetes)

### 3.2. Application Layer (Microservices / Modular Monolith)
- **Frontend App**: Next.js 15 / React 19 (SSR/ISR for fast load times). Delivered via Vercel or EKS pods.
- **Backend API**: Node.js + Fastify for high-throughput I/O and WebSocket streaming.
- **AI Orchestration Service**: Python/Node hybrid for managing RAG pipelines and LLM context building.
- **Background Workers**: BullMQ atop Redis for async document processing (PDF parsing, OCR, Embedding).

### 3.3. Data & Storage Layer
- **Relational Database**: PostgreSQL (via AWS Aurora Serverless v2 for horizontal scaling).
- **ORM**: Prisma for type-safe schema mapping and migrations.
- **Vector Database**: Pinecone (or Cloud SQL pgvector) for semantic document indexing.
- **Search Engine**: Elasticsearch for hybrid lexical search.
- **Cache & Pub/Sub**: Redis (ElastiCache) for WebSocket scaling, rate limiting, and session caching.
- **Object Storage**: AWS S3 for PDFs, synthesized audio buffers, and parsed images.

### 3.4. AI & RAG Pipeline Layer
- **LLM Routing**: Semantic router directing queries to Gemini 1.5 Pro/Flash (Primary), Claude 3 (Fallback), or OpenAI (Voice synthesis).
- **Voice Engine**: ElevenLabs or Google Cloud TTS/STT for ultra-low latency conversational streaming.
- **Embeddings**: `text-embedding-004` (Gemini) or OpenAI `text-embedding-3-small`.

## 4. User Flow & Data Flow
1. **Ingestion Flow**: Publisher uploads PDF -> S3 -> BullMQ triggers Document Processor -> OCR/Text Parse -> Chunking -> Vectorization -> Stored in Pinecone -> Status updated in Postgres.
2. **Reading Flow**: Reader requests issue -> CloudFront serves cached assets -> Fastify checks RBAC -> PostgreSQL returns metadata.
3. **Conversational Flow**: Reader talks to Web Microphone -> WebSocket streams audio -> STT transcribes -> AI Context Builder grabs Vector contexts -> LLM generates response -> TTS streams audio back to Web Client.

## 5. Security & Isolation Considerations
- **Multi-Tenancy**: Hard logical separation via Row-Level Security (RLS) in PostgreSQL.
- **Authentication**: Clerk for enterprise SSO, MFA, and B2B user management.
- **Data Privacy**: GDPR/POPIA compliant. PII anonymization in logging.
- **Rate Limiting**: Tiered API limits by API Key and User IP.

## 6. Scalability Strategy
- **Stateless API Services**: All Fastify nodes are stateless. Horizontal Auto-scaling (HPA) based on CPU/Memory thresholds.
- **Stateless WebSockets**: Redis Pub/Sub backplane ensures users can maintain real-time connections across any healthy node.
- **Database Read Replicas**: Heavy analytics and read-only Reader app queries routed to specialized Read Replicas.

*(End of Phase 1)*
