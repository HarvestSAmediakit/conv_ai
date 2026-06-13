import { pgTable, text, integer, timestamp, boolean, real, primaryKey, foreignKey, pgEnum } from 'drizzle-orm/pg-core';

export const publishers = pgTable('publishers', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const magazines = pgTable('magazines', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  publisherId: text('publisher_id').references(() => publishers.id).notNull(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  coverUrl: text('cover_url'),
  pdfUrl: text('pdf_url'),
  status: text('status').notNull(), // 'draft' | 'published'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  aiEnabled: boolean('ai_enabled').default(false).notNull(),
  aiPersonality: text('ai_personality'),
  aiContext: text('ai_context'),
  ttsEnabled: boolean('tts_enabled').default(false).notNull(),
  chatEnabled: boolean('chat_enabled').default(false).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  listenCount: integer('listen_count').default(0).notNull(),
  pageCount: integer('page_count').default(0),
  themeBackground: text('theme_background').default('slate'),
  soundEnabled: boolean('sound_enabled').default(true),
  logoUrl: text('logo_url'),
  rtl: boolean('rtl').default(false),
  pageTransitionsSpeed: integer('page_transitions_speed').default(1000),
});

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value'),
});

export const bookshelves = pgTable('bookshelves', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  title: text('title').notNull(),
  publisherId: text('publisher_id').references(() => publishers.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookshelfMagazines = pgTable('bookshelf_magazines', {
  bookshelfId: text('bookshelf_id').references(() => bookshelves.id, { onDelete: 'cascade' }).notNull(),
  magId: text('mag_id').references(() => magazines.id, { onDelete: 'cascade' }).notNull(),
  position: integer('position').default(0).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.bookshelfId, table.magId] }),
  };
});

export const docupipeExtractions = pgTable('docupipe_extractions', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').default('tenant_default').notNull(),
  fileName: text('file_name').notNull(),
  schemaId: text('schema_id'),
  schemaName: text('schema_name'),
  documentId: text('document_id'),
  jobId: text('job_id'),
  standardizationId: text('standardization_id'),
  status: text('status').notNull(),
  resultJson: text('result_json'),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  fileName: text('file_name').notNull(),
  storagePath: text('storage_path').notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const knowledgeChunks = pgTable('knowledge_chunks', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  documentId: text('document_id').references(() => documents.id, { onDelete: 'cascade' }).notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  content: text('content').notNull(),
  embedding: text('embedding').notNull(), // JSON string for now, or you could use pgvector if enabled
  metadata: text('metadata'), // JSON string
  pageNumber: integer('page_number').default(1),
  boundingBox: text('bounding_box'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const chunkEmbeddings = pgTable('chunk_embeddings', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  chunkId: text('chunk_id').references(() => knowledgeChunks.id, { onDelete: 'cascade' }).notNull(),
  embedding: text('embedding').notNull(), // We store it as text for now, but we'll cast to vector in raw SQL if needed
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull(),
  plan: text('plan').notNull(),
  status: text('status').notNull(),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').unique(), // Firebase UID for foreign keys if we want to use string
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  name: text('name'),
  role: text('role').default('user').notNull(),
  tenantId: text('tenant_id').default('tenant_default').notNull(),
  emailVerified: boolean('email_verified').default(false),
  mfaEnabled: boolean('mfa_enabled').default(false),
  mfaSecret: text('mfa_secret'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const advertisers = pgTable('advertisers', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').default('tenant_default').notNull(),
  name: text('name').notNull(),
  contactEmail: text('contact_email'),
  crmIntegration: text('crm_integration'),
  leadCount: integer('lead_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  userId: text('user_id'),
  action: text('action').notNull(),
  resourceType: text('resource_type'),
  resourceId: text('resource_id'),
  metadata: text('metadata'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const formsLegalConsents = pgTable('forms_legal_consents', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  consentType: text('consent_type').notNull(),
  version: text('version').notNull(),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const advertiserProducts = pgTable('advertiser_products', {
  id: text('id').primaryKey(),
  advertiserId: text('advertiser_id').references(() => advertisers.id, { onDelete: 'cascade' }).notNull(),
  productName: text('product_name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  price: real('price'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const agriInsights = pgTable('agri_insights', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  topic: text('topic').notNull(),
  content: text('content').notNull(),
  region: text('region'),
  source: text('source'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiAgents = pgTable('ai_agents', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  personality: text('personality'),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const enterpriseKb = pgTable('enterprise_kb', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  title: text('title').notNull(),
  fileType: text('file_type').notNull(),
  storagePath: text('storage_path').notNull(),
  extractionStatus: text('extraction_status').default('pending'),
  vectorStatus: text('vector_status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const generatedEcosystems = pgTable('generated_ecosystems', {
  id: text('id').primaryKey(),
  magazineId: text('magazine_id').references(() => magazines.id, { onDelete: 'cascade' }).notNull(),
  tenantId: text('tenant_id').notNull(),
  websiteStatus: text('website_status').default('none'),
  websiteUrl: text('website_url'),
  podcastStatus: text('podcast_status').default('none'),
  socialPackJson: text('social_pack_json'),
  seoPackJson: text('seo_pack_json'),
  lastGeneratedAt: timestamp('last_generated_at'),
});

export const whiteLabelConfigs = pgTable('white_label_configs', {
  tenantId: text('tenant_id').primaryKey(),
  brandName: text('brand_name'),
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color'),
  customDomain: text('custom_domain'),
  supportEmail: text('support_email'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const videoSummaries = pgTable('video_summaries', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  title: text('title').notNull(),
  youtubeUrl: text('youtube_url'),
  transcript: text('transcript'),
  summary: text('summary'),
  highlights: text('highlights'), // JSON string of Array<{timestamp: string, text: string}>
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
