# BrandOS AI - System Architecture

## High-Level System Design

```
┌─────────────────────────────────────────────────────────┐
│                  CLIENT LAYER (Next.js/React)           │
│  Chat Interface | Operations Center | Dashboard | Mobile │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│           API GATEWAY & AUTHENTICATION                  │
│     (Next.js API Routes, JWT, RBAC, Rate Limiting)     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              APPLICATION SERVICE LAYER                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ CEO Agent Service                                │  │
│  │ - Intent Recognition                             │  │
│  │ - Agent Provisioning                             │  │
│  │ - Orchestration                                  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Agent Services (Strategy, Content, Design, etc.) │  │
│  │ - Agent Execution Logic                          │  │
│  │ - Tool Calling                                   │  │
│  │ - Workflow Generation                            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Integration Service                              │  │
│  │ - API Credential Management                      │  │
│  │ - Third-Party API Calling                        │  │
│  │ - Event Propagation                              │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Workflow Service                                 │  │
│  │ - Workflow Definition                            │  │
│  │ - Execution Orchestration                        │  │
│  │ - State Management                               │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Analytics Service                                │  │
│  │ - Metrics Collection                             │  │
│  │ - Aggregation & Reporting                        │  │
│  │ - Trend Detection                                │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│           MESSAGE QUEUE & EVENT BUS                     │
│  (Bull Queue, Redis Streams, Event-Driven Architecture) │
│  - Workflow Queue                                       │
│  - Background Job Queue                                 │
│  - Event Stream                                         │
│  - Retry Logic & Dead Letter Queue                      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              DATA & STORAGE LAYER                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ PostgreSQL                                       │  │
│  │ - Users, Teams, Organizations                   │  │
│  │ - Conversations, Messages, Context              │  │
│  │ - Workflows, Executions, Results                │  │
│  │ - Integrations, Credentials (encrypted)         │  │
│  │ - Analytics Events, Metrics                     │  │
│  │ - Audit Logs                                    │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Vector Database (Pinecone/Supabase pgvector)    │  │
│  │ - User Memory Embeddings                        │  │
│  │ - Brand Memory Embeddings                       │  │
│  │ - Campaign Context Embeddings                   │  │
│  │ - Knowledge Base                                │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Object Storage (S3)                             │  │
│  │ - Generated Assets                              │  │
│  │ - User Uploads                                  │  │
│  │ - Campaign Media                                │  │
│  │ - Workflow Artifacts                            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Cache Layer (Redis)                             │  │
│  │ - Session Data                                  │  │
│  │ - Frequently Accessed Data                      │  │
│  │ - Rate Limiting Counters                        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│         EXTERNAL INTEGRATIONS & AI SERVICES            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ AI Models                                        │  │
│  │ - OpenAI (GPT-4, GPT-4o, GPT-4-Turbo)          │  │
│  │ - Anthropic (Claude 3 Opus, Sonnet)            │  │
│  │ - Google AI (Gemini)                           │  │
│  │ - Model Router for Cost Optimization            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Third-Party APIs                                │  │
│  │ - Instagram, Facebook, LinkedIn, TikTok, X      │  │
│  │ - YouTube, Shopify, Stripe                      │  │
│  │ - HubSpot, Salesforce, Notion, Slack           │  │
│  │ - Gmail, Google Workspace, Microsoft 365       │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Observability & Monitoring                      │  │
│  │ - Sentry (Error Tracking)                       │  │
│  │ - OpenTelemetry (Tracing)                       │  │
│  │ - DataDog/New Relic (Metrics)                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Detailed Component Descriptions

### Frontend Architecture

**Technology Stack:**
- Next.js 15+ (App Router, Server Components)
- React 19+
- TypeScript
- Tailwind CSS
- shadcn/ui (Component Library)
- Framer Motion (Animations)
- React Query (Data Fetching)
- Zustand (State Management)
- React Flow (Network Visualization)
- D3.js (Advanced Visualization)
- WebGL (GPU-accelerated rendering)

**Core Features:**
- Server-side rendering for performance
- Progressive enhancement
- Offline support with service workers
- Real-time updates via WebSocket
- Optimistic UI updates

### Backend Services

**Technology Stack:**
- Node.js 20+
- Express.js or Fastify
- TypeScript
- PostgreSQL 15+
- Redis 7+
- Supabase (managed PostgreSQL + auth)

**Microservices:**

1. **CEO Agent Service**
   - Intent classification (using embeddings)
   - Agent provisioning logic
   - Orchestration and delegation
   - User communication generation

2. **Agent Services** (one service per agent family)
   - Strategy Agent
   - Content Agent
   - Design Agent
   - Analytics Agent
   - Integration Agent
   - etc.

3. **Workflow Engine**
   - Workflow definition parsing
   - Execution state machine
   - Task coordination
   - Error handling and retries

4. **Integration Service**
   - Credential encryption/decryption
   - API request management
   - Rate limiting per integration
   - Error handling and logging

5. **Memory Service**
   - Vector embeddings generation
   - Semantic search
   - Memory updates
   - Retrieval-Augmented Generation (RAG)

6. **Analytics Service**
   - Event ingestion
   - Metrics aggregation
   - Trend analysis
   - Reporting generation

### Message Queue & Event System

**Technology:**
- Bull (Redis-backed job queue)
- Redis Streams (Event Bus)
- Kafka (optional for high-scale scenarios)

**Queue Types:**
```
Workflow Queue
├─ Priority: High, Medium, Low
├─ Retry: Exponential backoff
└─ TTL: 7 days

Background Job Queue
├─ Data sync jobs
├─ Analytics processing
├─ Cleanup tasks
└─ TTL: 24 hours

Event Stream
├─ User events
├─ Integration events
├─ Workflow events
└─ System events
```

### Database Schema (PostgreSQL)

**Core Tables:**
```
users
├─ id (UUID)
├─ email
├─ auth_provider
├─ created_at
└─ updated_at

organizations
├─ id (UUID)
├─ name
├─ owner_id (FK: users.id)
├─ settings (JSONB)
└─ created_at

teams
├─ id (UUID)
├─ org_id (FK: organizations.id)
├─ name
├─ members (JSONB)
└─ created_at

conversations
├─ id (UUID)
├─ user_id (FK: users.id)
├─ team_id (FK: teams.id)
├─ title
├─ created_at
└─ updated_at

messages
├─ id (UUID)
├─ conversation_id (FK: conversations.id)
├─ role (user | assistant)
├─ content (TEXT)
├─ metadata (JSONB)
├─ created_at
└─ updated_at

workflows
├─ id (UUID)
├─ user_id (FK: users.id)
├─ definition (JSONB)
├─ status (draft | active | archived)
├─ created_at
└─ updated_at

workflow_executions
├─ id (UUID)
├─ workflow_id (FK: workflows.id)
├─ status (running | completed | failed)
├─ started_at
├─ completed_at
├─ result (JSONB)
└─ error (TEXT)

integrations
├─ id (UUID)
├─ user_id (FK: users.id)
├─ provider (openai | anthropic | stripe | etc.)
├─ credential_id (FK: credentials.id - encrypted)
├─ status (connected | disconnected | error)
├─ created_at
└─ updated_at

credentials
├─ id (UUID)
├─ type (api_key | oauth_token | etc.)
├─ encrypted_value (encrypted)
├─ provider
├─ user_id (FK: users.id)
├─ created_at
└─ updated_at

analytics_events
├─ id (UUID)
├─ user_id (FK: users.id)
├─ event_type
├─ event_data (JSONB)
├─ timestamp
└─ TTL (auto-delete after 90 days)

audit_logs
├─ id (UUID)
├─ user_id (FK: users.id)
├─ action
├─ resource_type
├─ resource_id
├─ changes (JSONB)
├─ timestamp
└─ TTL (auto-delete after 1 year)

memory_vectors
├─ id (UUID)
├─ user_id (FK: users.id)
├─ memory_type (user | brand | campaign | operational)
├─ embedding (vector)
├─ content (TEXT)
├─ metadata (JSONB)
├─ created_at
└─ updated_at
```

### Vector Database (pgvector in Supabase)

```sql
CREATE TABLE memory_embeddings (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  memory_type TEXT NOT NULL,
  embedding vector(1536),
  content TEXT NOT NULL,
  metadata jsonb,
  created_at timestamp,
  CONSTRAINT valid_memory_type 
    CHECK (memory_type IN ('user', 'brand', 'campaign', 'operational'))
);

CREATE INDEX ON memory_embeddings 
 USING ivfflat (embedding vector_cosine_ops)
 WHERE user_id IS NOT NULL;
```

## Security Architecture

### Authentication & Authorization
```
SSO/OAuth2 → JWT Tokens → RBAC
     ↓
Google/GitHub/Microsoft
     ↓
JWT Refresh Token (secure httpOnly cookie)
Access Token (short-lived, 15 min)
     ↓
Role-Based Access Control
├─ Owner
├─ Admin
├─ Member
├─ Viewer
└─ AI Agent (service account)
```

### Secrets Management
```
Credentials Input → Encryption → Storage
     ↓
User provides API key
     ↓
Encrypt with KMS
     ↓
Store encrypted in database
     ↓
On use: Decrypt from KMS
     ↓
Transfer to secure environment
     ↓
Automatically revoke after use
```

### Data Isolation
```
Tenant 1 (User A)
├─ Conversations
├─ Workflows
├─ Integrations
├─ Analytics
└─ Memory
     ↓ (Row-Level Security)
     ↓ (RLS Policies)
     ↓

Tenant 2 (User B)
├─ Conversations
├─ Workflows
├─ Integrations
├─ Analytics
└─ Memory
```

### Compliance & Audit
```
Every action logged:
- User action
- Timestamp
- Resource accessed
- Changes made
- IP address
- User agent
     ↓
Stored in audit_logs table
     ↓
Retained for 1 year (configurable)
     ↓
Exportable for compliance
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│  GitHub (Code Repository)               │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────��───────┐
│  GitHub Actions (CI/CD)                 │
│  - Tests                                │
│  - Build                                │
│  - Security Scan                        │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐  ┌────────▼─────────┐
│  Vercel        │  │  AWS Lambda      │
│  (Frontend)    │  │  (Backend)       │
│  - Next.js     │  │  - Node.js       │
│  - CDN         │  │  - API Routes    │
│  - Preview     │  │  - Cron Jobs     │
└───────┬────────┘  └────────┬─────────┘
        │                    │
        └────────┬───────────┘
                 │
        ┌────────▼──────────┐
        │  AWS RDS          │
        │  (PostgreSQL)     │
        │  - Primary        │
        │  - Replica        │
        │  - Backups        │
        └───────────────────┘
                 │
        ┌────────▼──────────┐
        │  AWS ElastiCache  │
        │  (Redis)          │
        │  - Sessions       │
        │  - Queue          │
        └───────────────────┘
                 │
        ┌────────▼──────────┐
        │  AWS S3           │
        │  (Object Storage) │
        │  - Assets         │
        │  - Uploads        │
        └───────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- **Frontend**: Vercel auto-scales globally via CDN
- **Backend**: Lambda scales automatically
- **Database**: PostgreSQL read replicas for high-traffic queries
- **Cache**: Redis cluster for distributed caching

### Performance Optimization
- Response caching strategies
- Query optimization & indexes
- Vector database optimization
- CDN edge caching
- Database connection pooling

### Rate Limiting
```
Per User:
├─ API calls: 10,000/hour
├─ Workflow executions: 1,000/day
├─ Agent invocations: 500/hour
└─ File uploads: 100GB/month

Per Integration:
├─ OpenAI: 90,000 TPM
├─ Anthropic: 50,000 TPM
└─ Third-party APIs: Per provider limits
```

