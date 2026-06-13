# CONVOMAG AI™: Phase 7 - DevOps Infrastructure

## 1. DevOps Strategy
The infrastructure is designed for high availability, zero-downtime deployments, and horizontal scalability. We employ a multi-cloud approach: Vercel for the Frontend edge, AWS for the robust backend APIs and databases.

## 2. Infrastructure as Code (IaC)
- **Tooling**: Terraform or AWS CDK.
- **Environments**: Dev, Staging, Production. All infrastructure configurations are version-controlled.

## 3. Cloud Architecture (AWS)
- **Compute**: Amazon EKS (Kubernetes) hosting the Fastify Node.js microservices and BullMQ workers. Application Auto Scaling (HPA) configured based on CPU and memory thresholds.
- **Database**: Amazon Aurora PostgreSQL (Serverless v2) mapped to Prisma.
- **Cache**: Amazon ElastiCache (Redis) for session state, rate limiting, and BullMQ queues.
- **Storage**: Amazon S3 for PDF uploads, optimized images, and generated audio files.
- **CDN**: CloudFront sitting in front of S3 for edge caching of heavy media assets.

## 4. CI/CD Pipeline (GitHub Actions)
### Pipeline Stages:
1. **Lint & Test**: ESLint, Prettier, TypeScript compilation, Jest unit tests on every PR.
2. **Build**: Build Next.js application, build Docker images for Fastify backend.
3. **Security Scan**: SonarQube / Dependabot checks for vulnerabilities.
4. **Deploy to Staging**: Push Docker images to ECR, deploy to Staging Kubernetes namespace.
5. **E2E Testing**: Playwright tests run against Staging.
6. **Deploy to Production**: Manual approval gate. Rolling update deployment to EKS to ensure zero downtime.

## 5. Observability & Monitoring
- **Logging**: Datadog or ELK Stack (Elasticsearch, Logstash, Kibana) centralizing logs from all services.
- **Metrics**: Prometheus & Grafana to monitor EKS cluster health, Redis memory, and PostgreSQL connections.
- **APM**: OpenTelemetry tracing API requests from the Next.js edge through Fastify to the database and external LLM APIs.
- **Alerting**: PagerDuty integrated with critical thresholds (e.g., API latency > 1s, 5xx error rate > 1%).
