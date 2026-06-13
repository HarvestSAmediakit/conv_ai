# CONVOMAG AI™: Phase 3 - Complete Backend Architecture

## 1. Backend Architecture Overview
The backend is built as a highly modular, decoupled monolith utilizing Node.js with the Fastify framework, designed for extreme high throughput and low-overhead WebSocket streaming. It is implemented in pure TypeScript. 

## 2. Master Folder Structure

```text
/backend
├── /src
│   ├── /api
│   │   ├── /controllers     # Route logic (Auth, Magazine, RAG, Voice, Analytics)
│   │   ├── /routes          # Fastify route declarations & fastify-schema
│   │   ├── /middlewares     # Authentication, RBAC, Rate Limiting
│   │   └── /plugins         # Fastify custom plugins
│   ├── /services            # Core business logic (LLM Orchestration, RAG)
│   │   ├── /ai
│   │   │   ├── gemini.service.ts
│   │   │   ├── openai.service.ts
│   │   │   ├── claude.service.ts
│   │   │   └── router.service.ts # Model routing logic
│   │   ├── /rag
│   │   │   ├── chunker.service.ts
│   │   │   ├── embeddings.service.ts
│   │   │   └── pinecone.service.ts
│   │   ├── /voice
│   │   │   ├── tts.service.ts
│   │   │   └── stt.service.ts
│   │   ├── /payments
│   │   │   └── stripe.service.ts
│   │   └── /analytics
│   │       └── event-logger.service.ts
│   ├── /db
│   │   ├── prisma.client.ts
│   │   └── /repositories    # Data access layer
│   ├── /jobs                # BullMQ Queue Processors
│   │   ├── document-processing.job.ts
│   │   ├── embedding-generation.job.ts
│   │   └── async-webhook.job.ts
│   ├── /config              # Environment, Logger configurations
│   ├── /utils               # Helper functions
│   ├── /websockets          # Real-time event handlers
│   │   ├── chat.socket.ts
│   │   └── voice-stream.socket.ts
│   └── server.ts            # Fastify application entry point
├── /prisma
│   ├── schema.prisma        # Database schema
│   └── /migrations
├── package.json
├── tsconfig.json
└── Dockerfile
```

## 3. Core Services & Data Flow

### 3.1. API & Route Layer (Fastify)
Routes are segmented by domain: Authentication, Tenant Administration, Reader App, AI Interactions, and Webhooks. Fastify's native JSON schema validation is strictly used to validate all payloads, reducing the attack surface.

### 3.2. AI Orchestration Engine (`router.service.ts`)
When a reader queries the AI:
1. Fastify controller validates the request.
2. The core semantic router assesses the query depth. 
3. Highly complex semantic queries route to Claude 3.5 Sonnet. Fast queries requiring vast context windows route to Gemini 1.5 Pro. Pure voice synthesis routes to OpenAI TTS or ElevenLabs.
4. RAG Service kicks in, querying `pinecone.service.ts` to fetch chunked context from the requested Magazine.

### 3.3. Document Processing Pipeline (`document-processing.job.ts`)
Operates outside the request-response cycle via `BullMQ`.
1. User uploads PDF to S3.
2. S3 fires Event Notification -> SNS -> SQS -> BullMQ Worker.
3. PDF text is extracted and chunked semantically.
4. Gemini's `text-embedding-004` API vectorizes the chunks.
5. Vectors are pushed to Pinecone with associated metadata (Page Number, Issue ID).

### 3.4. WebSocket Infrastructure Layer (`voice-stream.socket.ts`)
To support ConvoMag Voice™:
1. Fastify hooks into `@fastify/websocket`.
2. Audio buffers flow via raw binary WebSocket frames.
3. Node.js pipes the streams to Deepgram or Google STT for transcription, retaining under 300ms latency for "barge-in".

## 4. Security Considerations
- **Authentication**: Validation of Clerk/Auth.js JWTs via standard middleware on every protected route.
- **Tenant Context Injection**: JWT middleware injects `x-tenant-id` into the Fastify request context. Repositories automatically enforce `where: { tenantId: req.tenantId }`.
- **Rate Limiting**: `fastify-rate-limit` connected to Redis clusters prevents LLM API abuse (e.g., max 50 queries / hour for free tier).

## 5. Scalability Considerations
- **Node Event Loop Protection**: CPU-intensive tasks (like complex mathematical ranking, massive JSON manipulation) are offloaded to Node `worker_threads` to avoid blocking the main server loop.
- **Connection Pooling**: Prisma connected via PgBouncer ensures zero latency connection spikes to the Aurora cluster.
- **ElastiCache Backplane**: Using Redis Pub/Sub so a WebSocket message published on Node A can reach users connected to Node B.

## 6. Deployment Strategy
- **Containerization**: Packaged into tiny Alpine-based Docker containers.
- **Instrumentation**: PM2 or native Node cluster mode is not used; instead, Kubernetes handles horizontal replication of individual single-threaded Node containers as traffic spikes.
- **Health Checks**: Fastify `/api/health` probes continuously verify Postgres, Redis, and LLM API connectivity.
