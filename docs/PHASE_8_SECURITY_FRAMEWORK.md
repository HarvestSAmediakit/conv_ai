# CONVOMAG AI™: Phase 8 - Security Framework

## 1. Security Principles
Enterprise-grade security adhering to principle of least privilege, defense in depth, and compliance with GDPR and POPIA.

## 2. Authentication & Authorization
- **Identity Provider**: Clerk (or Auth.js) managing passwords, MAF, Magic Links, and OAuth.
- **RBAC**: Strict Role-Based Access Control enforcing Super Admin, Tenant Admin, Editor, Advertiser, and Reader permissions via Fastify middleware.
- **Isolation**: Tenant IDs strictly enforced on every database query using Prisma and PostgreSQL RLS.

## 3. Data Protection
- **Encryption at Rest**: AWS KMS managing keys for Aurora PostgreSQL and S3 buckets.
- **Encryption in Transit**: TLS 1.3 enforced on all API endpoints and WebSockets via NGINX/ALB ingress.
- **PII Handling**: Audit logs anonymize or hash sensitive user information. Minimal PII collected.

## 4. Platform Security
- **WAF**: AWS WAF blocking OWASP Top 10, SQLi, and malicious bots.
- **Rate Limiting**: Redis-backed rate limiting per IP and per API key to prevent DDoS and LLM bill shock.
- **File Validation**: Strict MIME type, magic number verification, and virus scanning (e.g., ClamAV) on all PDF uploads before processing.
- **CSP & CORS**: Restrictive Content Security Policy preventing unauthorized script execution. CORS strictly locked to approved domains.

## 5. AI Security
- **Prompt Injection Defense**: Input sanitization and robust, bounded system prompts.
- **Data Segregation**: Pinecone namespaces ensure RAG contexts never leak between isolated tenants or publications.
