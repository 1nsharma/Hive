# PetJanu Technical Architecture

**Version:** 1.0.0  
**Last Updated:** Phase 0 Audit  
**Status:** Active Development

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Web App   │  │  Mobile Web │  │  Public Pet Pages       │  │
│  │  (React 19) │  │   (PWA)     │  │  /p/[slug]              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CDN / Edge Layer                            │
│                    Vercel Edge Network                          │
│              SSL Termination + Static Assets                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Express.js Server (server.ts)                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │ API Routes  │  │ Vite Dev    │  │ Observability   │   │  │
│  │  │ /api/*      │  │ Middleware  │  │ Console         │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Auth Service   │ │   AI Service     │ │  Payment Service │
│   (Firebase)     │ │  (Gemini API)    │ │   (Razorpay)     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
              │               │               │
              ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌─────────────────────┐     ┌─────────────────────────────┐   │
│  │  Supabase (Primary) │     │  Firebase Firestore         │   │
│  │  - Users/Profiles   │     │  - Real-time sync           │   │
│  │  - Pets             │     │  - Session cache            │   │
│  │  - Orders/Bookings  │     │                             │   │
│  │  - Products/Services│     │                             │   │
│  └─────────────────────┘     └─────────────────────────────┘   │
│  ┌─────────────────────┐     ┌─────────────────────────────┐   │
│  │  Firebase Storage   │     │  LocalStorage (Fallback)    │   │
│  │  - Pet Photos       │     │  - Offline mode             │   │
│  │  - QR Codes         │     │  - Cart state               │   │
│  └─────────────────────┘     └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.8.x | Type safety |
| Vite | 6.2.x | Build tooling, dev server |
| Tailwind CSS | 4.1.x | Styling |
| Motion | 12.x | Animations |
| Lucide React | 0.546.x | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.21.x | HTTP server, routing |
| TypeScript | 5.8.x | Type safety |
| ESBuild | 0.25.x | Production bundling |

### Database & Storage

| Technology | Purpose | Usage |
|------------|---------|-------|
| Supabase PostgreSQL | Primary database | Users, pets, orders, bookings |
| Firebase Firestore | Secondary/real-time | Sessions, caching, real-time features |
| Firebase Storage | File storage | Pet photos, QR codes, media |
| LocalStorage | Client-side fallback | Offline mode, cart persistence |

### Authentication

| Provider | Methods | Notes |
|----------|---------|-------|
| Firebase Auth | Google OAuth, Phone OTP | Primary auth provider |
| Guest Mode | Phone-only | Limited functionality |

### Third-Party Services

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| Google Gemini AI | Health triage chatbot | Server-side API proxy |
| Razorpay | Payments, subscriptions | Webhook verification |
| Vercel | Hosting, serverless functions | Frontend + API deployment |
| Firebase | Auth, storage, firestore | Client SDK integration |

---

## Component Architecture

### Frontend Components

```
src/
├── components/
│   ├── LandingPage.tsx        # Home page
│   ├── Navbar.tsx             # Top navigation
│   ├── BottomNav.tsx          # Mobile bottom nav
│   ├── AuthModal.tsx          # Login/signup modal
│   ├── PetProfileModal.tsx    # Pet CRUD interface
│   ├── PublicPetPage.tsx      # Public tag profile view
│   ├── AIChatAssistant.tsx    # AI health chat interface
│   ├── Marketplace.tsx        # Product listings
│   ├── ServicesBooking.tsx    # Service appointments
│   ├── OrdersBookings.tsx     # Order history
│   ├── SightingReports.tsx    # Lost pet sightings
│   ├── RazorpayCheckoutModal.tsx  # Payment flow
│   └── [Feature Views]        # Health, Safety, Settings, etc.
├── context/
│   └── AuthContext.tsx        # Auth state management
├── lib/
│   ├── supabase.ts            # DB client
│   ├── firebase.ts            # Auth/storage client
│   ├── dbService.ts           # Data operations
│   ├── firebaseService.ts     # Firebase operations
│   ├── mockData.ts            # Seed data
│   └── errorMonitoring.ts     # Error tracking
├── types.ts                   # TypeScript interfaces
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

### Backend API Routes

```
api/
├── auth/
│   └── otp.ts                 # OTP authentication
├── chat/
│   └── index.ts               # AI chat endpoint
├── pets/
│   ├── index.ts               # Pet CRUD
│   └── [slug].ts              # Public pet lookup
├── products/
│   └── index.ts               # Product catalog
├── services/
│   └── index.ts               # Service listings
├── orders/
│   └── index.ts               # Order management
├── webhooks/
│   └── razorpay.ts            # Payment webhook handler
└── services/
    └── index.ts               # Service aggregation
```

---

## Data Flow Patterns

### Pet Profile Creation Flow

```
User → AuthContext → PetProfileModal → savePetToDb() 
                                      ↓
                        ┌─────────────────────────┐
                        │  isSupabaseConfigured?  │
                        └─────────────────────────┘
                               │ Yes         │ No
                               ▼             ▼
                    ┌─────────────────┐  ┌──────────────┐
                    │ Supabase INSERT │  │ LocalStorage │
                    │ + Firebase Sync │  │ Fallback     │
                    └─────────────────┘  └──────────────┘
                               │             │
                               └──────┬──────┘
                                      ▼
                              Update UI State
                                      ▼
                              Show Confirmation
```

### Lost Pet SOS Flow

```
Owner Toggles Lost Mode
         │
         ▼
updatePetLostStatusInDb(petId, true)
         │
         ▼
┌─────────────────────────┐
│  Update Public Profile  │
│  - Red SOS Banner       │
│  - Emergency Contacts   │
│  - Reward Display       │
└─────────────────────────┘
         │
         ▼
  Send WhatsApp/SMS Alerts
  to Emergency Contacts
         │
         ▼
  Monitor Scanner Sightings
```

### Payment Processing Flow

```
User Initiates Checkout
         │
         ▼
Razorpay Checkout Modal Opens
         │
         ▼
User Completes Payment
         │
         ▼
Razorpay Callback → Frontend
         │
         ▼
Server Receives Webhook
         │
         ▼
verifyWebhookSignature(payload, signature, secret)
         │
         ▼
Update Order Status in Supabase
         │
         ▼
Send Confirmation Email/SMS
```

### AI Health Triage Flow

```
User Submits Symptom Query
         │
         ▼
Frontend → POST /api/chat
         │
         ▼
Server Validates Request
         │
         ▼
Construct Gemini API Prompt
(with veterinary guardrails)
         │
         ▼
Google AI Studio Response
         │
         ▼
Parse & Format Response
         │
         ▼
Return Risk Assessment
(🟢 Low / 🟡 Monitor / 🟠 Vet / 🔴 Urgent)
```

---

## Security Architecture

### Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client     │     │  Firebase    │     │   Server     │
│              │     │    Auth      │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ 1. Sign In Request │                    │
       │───────────────────>│                    │
       │                    │                    │
       │ 2. JWT Token       │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ 3. Attach to Requests                  │
       │────────────────────────────────────────>│
       │                    │                    │
       │                    │ 4. Verify Token    │
       │                    │───────────────────>│
       │                    │                    │
       │ 5. Protected Response                   │
       │<────────────────────────────────────────│
```

### API Security Measures

1. **CORS Configuration:** Restricted origins
2. **Rate Limiting:** Per-IP and per-user limits
3. **Input Validation:** Zod/Joi schemas on all endpoints
4. **SQL Injection Prevention:** Parameterized queries via Supabase client
5. **XSS Protection:** React auto-escaping, CSP headers
6. **CSRF Protection:** Token validation on state-changing requests

### Secret Management

```
Environment Variables (.env.local):
- GEMINI_API_KEY (server-only)
- SUPABASE_SERVICE_ROLE_KEY (server-only)
- RAZORPAY_KEY_SECRET (server-only)
- RAZORPAY_WEBHOOK_SECRET (server-only)
- VITE_SUPABASE_URL (client-safe)
- VITE_SUPABASE_ANON_KEY (client-safe)
- VITE_RAZORPAY_KEY_ID (client-safe)
- VITE_FIREBASE_* (client-safe)
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────┐
│                    Vercel Platform                   │
│                                                      │
│  ┌─────────────────┐    ┌─────────────────────────┐ │
│  │  Static Assets  │    │   Serverless Functions  │ │
│  │  (dist/)        │    │   (api/**/*.ts)         │ │
│  │  - HTML/CSS/JS  │    │   - /api/chat           │ │
│  │  - Images       │    │   - /api/webhooks/*     │ │
│  └─────────────────┘    └─────────────────────────┘ │
│                                                      │
│  Edge Network: Global CDN with automatic caching    │
└─────────────────────────────────────────────────────┘
```

### Alternative: Cloud Run Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
COPY server.cjs ./
EXPOSE 8080
CMD ["node", "server.cjs"]
```

---

## Performance Optimizations

### Frontend

1. **Code Splitting:** Lazy-loaded feature views
2. **Vendor Chunking:** Separate bundles for React, icons, motion
3. **Image Optimization:** WebP format, lazy loading
4. **CSS Purging:** Tailwind JIT compilation
5. **Memoization:** React.memo for expensive components

### Backend

1. **Response Caching:** Redis-ready architecture
2. **Database Indexing:** Indexed queries on common lookups
3. **Connection Pooling:** Supabase client reuse
4. **Compression:** Gzip/Brotli on responses

---

## Monitoring & Observability

### In-Memory Observability Console

The `server.ts` includes a built-in CTO dashboard tracking:
- Request metrics (total, success, failure rates)
- API latency percentiles
- Token usage (AI consultations)
- Audit logs (sensitive actions)
- Event queue (published events)
- Storage files (uploaded assets)

### Recommended Additions

1. **Error Tracking:** Sentry or LogRocket
2. **Uptime Monitoring:** UptimeRobot or Pingdom
3. **Analytics:** Google Analytics 4 or Plausible
4. **Log Aggregation:** Papertrail or Datadog

---

## Scalability Considerations

### Current Limitations

1. **In-Memory Stores:** Audit logs and event queues reset on restart
2. **Single Server:** No horizontal scaling without load balancer
3. **Database Dual-Write:** Potential consistency issues between Supabase/Firebase

### Future Improvements

1. **Stateless Design:** Move observability data to database
2. **Container Orchestration:** Kubernetes or ECS for auto-scaling
3. **Database Consolidation:** Single source of truth
4. **Message Queue:** SQS or Pub/Sub for async processing
5. **CDN Integration:** CloudFlare for global asset delivery

---

## Disaster Recovery

### Backup Strategy

- **Supabase:** Daily automated backups (7-day retention)
- **Firebase:** Point-in-time recovery enabled
- **Storage:** Versioned buckets with lifecycle policies

### Rollback Procedures

1. **Code Rollback:** Git revert + Vercel redeploy
2. **Database Rollback:** Restore from backup snapshot
3. **Configuration Rollback:** Environment variable versioning

---

## Appendix

### Related Documents
- [DATA_MODEL.md](./DATA_MODEL.md) - Database schema details
- [ROADMAP.md](./ROADMAP.md) - Development timeline
- [SECURITY.md](../SECURITY.md) - Security policies

### External Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Razorpay Docs](https://razorpay.com/docs)
