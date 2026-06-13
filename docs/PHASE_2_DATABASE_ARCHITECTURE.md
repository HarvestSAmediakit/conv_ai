# CONVOMAG AI™: Phase 2 - Complete Database Architecture

## 1. Database Strategy & Principles
**Primary Datastore**: PostgreSQL (AWS Aurora Serverless v2)
**ORM Engine**: Prisma ORM
**Multi-Tenant Architecture**: Logical isolation using a strict `tenantId` (Organization ID) on all tenant-specific tables. Row-Level Security (RLS) is applied at the database level to prevent cross-tenant data leakage.
**Vector Store**: Pinecone (external) paired with pgvector (internal PostgreSQL extension) for hybrid retrieval fallbacks.
**Scaling Strategy**: 
- **Write-Heavy**: Single primary writer node instance.
- **Read-Heavy**: Multiple read replicas. Prisma configured with Read Replicas extension for automated query routing.
- **Partitioning**: Time-series tables (Analytics, AI Usage, Audit Logs) partitioned by month using PostgreSQL declarative partitioning.

## 2. Complete Prisma Schema (`schema.prisma`)

```prisma
// ==========================================
// PRISMA CONFIGURATION
// ==========================================
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema", "postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL") // Connection pooling
  extensions = [pii_encryption, pgvector(map: "vector")]
}

// ==========================================
// SYSTEM ENUMS
// ==========================================
enum Role {
  SUPER_ADMIN
  TENANT_ADMIN
  EDITOR
  ADVERTISER
  READER
}

enum PublicationStatus {
  DRAFT
  PROCESSING
  PUBLISHED
  ARCHIVED
}

enum InterlocutorRole {
  USER
  AI_SYSTEM
}

enum SubscriptionTier {
  FREE
  PRO
  ENTERPRISE
}

// ==========================================
// 1. IDENTITY & MULTI-TENANCY
// ==========================================
model Organization {
  id             String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name           String
  domain         String?        @unique
  stripeAuthId   String?        // For connected accounts
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  members        OrganizationMember[]
  magazines      Magazine[]
  advertisers    Advertiser[]
  subscriptions  TenantSubscription?
  apiKeys        ApiKey[]
}

model User {
  id             String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  providerId     String         @unique // SSO/Clerk ID
  email          String         @unique
  name           String
  avatarUrl      String?
  globalRole     Role           @default(READER)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  memberships    OrganizationMember[]
  conversations  Conversation[]
  bookmarks      Bookmark[]
  analyticsLogs  AnalyticsEvent[]
}

model OrganizationMember {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId         String       @db.Uuid
  organizationId String       @db.Uuid
  role           Role

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@index([organizationId])
}

// ==========================================
// 2. PUBLICATIONS & KNOWLEDGE
// ==========================================
model Magazine {
  id             String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId String            @db.Uuid
  title          String
  slug           String            @unique
  description    String?
  aiPersonality  String?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  organization   Organization      @relation(fields: [organizationId], references: [id])
  issues         Issue[]
}

model Issue {
  id             String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  magazineId     String            @db.Uuid
  title          String
  status         PublicationStatus @default(DRAFT)
  publishDate    DateTime?
  pdfUrl         String?
  coverUrl       String?
  pageCount      Int               @default(0)
  createdAt      DateTime          @default(now())
  
  magazine       Magazine          @relation(fields: [magazineId], references: [id], onDelete: Cascade)
  pages          Page[]
  knowledgeDocs  KnowledgeDocument[]
}

model Page {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  issueId        String   @db.Uuid
  pageNumber     Int
  imageUrl       String
  extractedText  String?  @db.Text
  
  issue          Issue    @relation(fields: [issueId], references: [id], onDelete: Cascade)
  bookmarks      Bookmark[]

  @@unique([issueId, pageNumber])
}

// ==========================================
// 3. ADVERTISER INTELLIGENCE
// ==========================================
model Advertiser {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId String       @db.Uuid // If platform-owned
  name           String
  description    String?      @db.Text
  website        String?
  crmWebhookUrl  String?

  organization   Organization @relation(fields: [organizationId], references: [id])
  campaigns      Campaign[]
  products       Product[]
}

model Campaign {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  advertiserId   String       @db.Uuid
  name           String
  targetKeywords String[]
  budget         Decimal?
  startDate      DateTime
  endDate        DateTime?
  isActive       Boolean      @default(true)

  advertiser     Advertiser   @relation(fields: [advertiserId], references: [id], onDelete: Cascade)
}

model Product {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  advertiserId   String       @db.Uuid
  name           String
  description    String       @db.Text
  category       String
  price          Decimal?
  url            String?

  advertiser     Advertiser   @relation(fields: [advertiserId], references: [id], onDelete: Cascade)
}

// ==========================================
// 4. CONVERSATIONAL AI PIPELINE
// ==========================================
model Conversation {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId         String       @db.Uuid
  contextId      String       // References an Issue ID or general Magazine ID
  startedAt      DateTime     @default(now())
  lastMessageAt  DateTime     @updatedAt

  user           User         @relation(fields: [userId], references: [id])
  messages       Message[]
  aiUsageLogs    AIUsageLog[]
}

model Message {
  id             String           @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  conversationId String           @db.Uuid
  role           InterlocutorRole
  content        String           @db.Text
  audioUrl       String?          // If sent via voice/TTS
  pageReferences Int[]            // Grounding citations
  timestamp      DateTime         @default(now())

  conversation   Conversation     @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}

// ==========================================
// 5. RAG INDEXING
// ==========================================
model KnowledgeDocument {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  issueId        String       @db.Uuid
  type           String       // PDF, TOC, Advertiser_Brochure
  status         String       // PENDING, EMBEDDED, FAILED
  vectorId       String?      // Reference to Pinecone external index
  
  issue          Issue        @relation(fields: [issueId], references: [id], onDelete: Cascade)
}

// ==========================================
// 6. TELEMETRY & BILLING
// ==========================================
model AnalyticsEvent {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId         String?      @db.Uuid
  organizationId String       @db.Uuid
  eventType      String       // PAGE_VIEW, AUDIO_PLAY, QUESTION_ASKED, AD_CLICK
  metadata       Json         // Deep telemetry
  timestamp      DateTime     @default(now())

  user           User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  @@index([organizationId, eventType])
}

model AIUsageLog {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  conversationId String       @db.Uuid
  provider       String       // Gemini, OpenAI, Claude
  model          String
  tokensPrompt   Int
  tokensCompletion Int
  costEstimate   Decimal
  timestamp      DateTime     @default(now())

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}

model TenantSubscription {
  id             String           @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId String           @unique @db.Uuid
  tier           SubscriptionTier @default(FREE)
  stripeCustId   String?          @unique
  stripeSubId    String?          @unique
  status         String
  currentPeriodEnd DateTime

  organization   Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Bookmark {
  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId         String    @db.Uuid
  pageId         String    @db.Uuid
  note           String?   @db.Text
  createdAt      DateTime  @default(now())

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  page           Page      @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@unique([userId, pageId])
}
```

## 3. Database Indexes & Performance
- **Primary Keys**: Used UUIDv4 universally across the platform to avoid ID enumeration and support distributed insertion.
- **Foreign Keys**: Cascade operations configured explicitly on dependent entities (e.g., deleting an issue cascades to pages, knowledge docs).
- **Composite Indexes**: Set on heavily queried multi-tenant partitions such as `@@index([organizationId, eventType])` in the `AnalyticsEvent` table to ensure dashboards load instantly.
- **Connections**: Handled via PgBouncer or Prisma Accelerate for efficient connection pooling under load.

*(End of Phase 2)*
