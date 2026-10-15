# PetJanu Project Brief

**Project Name:** PetJanu  
**Domain:** petsjanu.com  
**Version:** 1.0.0  
**Status:** Phase 0 - Audit Complete  
**Industry:** Pet Care & Safety Technology  
**Market:** India (primary), Global expansion planned

---

## Executive Summary

PetJanu is India's public-facing pet safety and care platform that provides every pet with a digital identity through scannable QR/NFC smart collar tags. The platform enables 1-tap Lost Pet SOS alerts, 24/7 AI-powered health guidance, and an integrated pet products and services marketplace.

### Value Proposition

1. **For Pet Owners:** Peace of mind through instant lost pet recovery, AI health triage, and centralized pet health records
2. **For Finders:** Easy scanning without app downloads to reconnect lost pets with owners
3. **For Vets/Vendors:** Direct access to engaged pet owner community with integrated booking and payments

---

## Problem Statement

- **Lost Pets Crisis:** Millions of pets go missing annually in India with low reunion rates
- **Fragmented Pet Care:** Pet health records, vet appointments, and product purchases scattered across multiple platforms
- **Emergency Response Delays:** No standardized system for quick lost pet alerts and citizen sightings
- **Health Information Gaps:** Pet owners lack access to reliable, immediate veterinary guidance

---

## Solution Overview

### Core Features

1. **Digital Pet Identity**
   - Unique QR/NFC smart collar tags
   - Public profile pages at `/p/[slug]`
   - Privacy-preserving contact relay system

2. **Lost Pet SOS System**
   - 1-tap emergency mode activation
   - Real-time scanner alerts via SMS/WhatsApp
   - Citizen sighting submission with photo uploads

3. **AI Health Assistant**
   - Powered by Google Gemini 3.6 Flash
   - Symptom risk assessment (🟢 Low → 🔴 Urgent)
   - Veterinary guardrails and disclaimers

4. **Marketplace**
   - Curated pet food, supplements, grooming supplies
   - Tele-vet consultations
   - Home service bookings
   - Razorpay integration with GST invoicing

---

## Target Users

### Primary Personas

1. **Urban Pet Parents (25-45)**
   - Tech-savvy millennials and Gen Z
   - Treat pets as family members
   - Willing to invest in pet safety and wellness
   - Active on WhatsApp and social media

2. **Good Samaritans / Finders**
   - Citizens who encounter lost pets
   - Need frictionless way to help without app downloads
   - Motivated by empathy and community welfare

3. **Veterinary Professionals**
   - Seek digital presence and appointment management
   - Offer tele-consultation services
   - Want access to pet medical history

4. **Pet Product Vendors**
   - E-commerce sellers targeting pet owners
   - Need trusted marketplace with verified reviews
   - Require payment processing and order management

---

## Business Model

### Revenue Streams

1. **Hardware Sales:** QR/NFC smart collar tags (one-time + replacement)
2. **Premium Subscriptions:** Advanced features, unlimited AI consultations
3. **Marketplace Commission:** % of vendor transactions
4. **Service Booking Fees:** % of vet/grooming appointments
5. **Enterprise/B2B:** Kennels, shelters, veterinary chains

### Pricing Strategy

- **Freemium:** Basic pet profiles and SOS features free
- **Premium Tier:** ₹299/month or ₹2,999/year
- **Hardware:** ₹499-₹999 per tag depending on design

---

## Competitive Landscape

| Competitor | Focus | Differentiation |
|------------|-------|-----------------|
| Traditional Tags | Physical ID plates | PetJanu offers digital + instant notifications |
| Pet Tracking GPS | Real-time location | PetJanu focuses on community-based recovery |
| Vet Apps | Appointment booking | PetJanu includes hardware + lost pet recovery |
| E-commerce | Product sales only | PetJanu integrates services + safety features |

### Competitive Advantages

1. **First-Mover in India:** Localized for Indian market conditions
2. **Privacy-First Design:** Phone masking protects user data
3. **No App Required for Finders:** Reduces friction in reunions
4. **Holistic Platform:** Combines safety, health, and commerce

---

## Technical Architecture Summary

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Motion for animations
- Component lazy-loading for performance

### Backend
- Node.js with Express
- Server-side API routes (`/api/*`)
- In-memory observability console (CTO dashboard)

### Database Strategy
- **Primary:** Supabase PostgreSQL (structured data)
- **Secondary:** Firebase Firestore (real-time features)
- **Fallback:** LocalStorage for offline resilience

### Authentication
- Firebase Auth (Google OAuth, Phone OTP)
- Guest mode support

### Payments
- Razorpay integration
- Webhook verification for payment events
- GST-compliant invoicing

### AI/ML
- Google Gemini 3.6 Flash API
- Server-side API proxying for key protection

### Hosting
- Vercel for frontend/serverless functions
- Cloud Run option for containerized deployment
- Firebase Storage for media assets

---

## Compliance & Legal

### Data Protection
- India DPDP Act compliance required
- GDPR considerations for global expansion
- Phone number masking for privacy

### Payments
- RBI regulations for payment aggregation
- PCI-DSS compliance via Razorpay

### Content
- Medical disclaimers for AI health advice
- User-generated content moderation policies

---

## Success Metrics (KPIs)

### Product Metrics
- Monthly Active Users (MAU)
- Lost Pet Reunion Rate (%)
- AI Consultations per User
- Marketplace Conversion Rate

### Business Metrics
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Hardware Unit Sales

### Technical Metrics
- Page Load Time (<3s target)
- API Response Time (<500ms p95)
- Uptime (99.9% SLA)
- Test Coverage (>80%)

---

## Go-to-Market Strategy

### Phase 1: Beta Launch (Months 1-2)
- Limited release in metro cities (Delhi, Mumbai, Bangalore)
- Partner with local vet clinics
- Social media awareness campaigns

### Phase 2: Growth (Months 3-6)
- Expand to top 10 Indian cities
- Influencer partnerships (pet Instagram accounts)
- Community group activations (RWAs, dog parks)

### Phase 3: Scale (Months 7-12)
- National marketing campaign
- Retail partnerships for hardware distribution
- B2B channel development (kennels, shelters)

---

## Team Structure (Recommended)

| Role | Responsibilities |
|------|------------------|
| Product Manager | Roadmap, user research, stakeholder management |
| Tech Lead | Architecture, code quality, technical decisions |
| Frontend Engineers (2) | UI/UX, React components, performance |
| Backend Engineer | APIs, database, integrations |
| DevOps Engineer | CI/CD, monitoring, infrastructure |
| QA Engineer | Testing strategy, automation |
| Security Consultant | Audits, compliance, vulnerability management |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low adoption in target market | High | Intensive community outreach, referral incentives |
| Payment gateway failures | Medium | Multiple gateway redundancy, manual reconciliation |
| Data breach | Critical | Regular security audits, encryption, minimal data retention |
| Regulatory changes | Medium | Legal counsel engagement, flexible architecture |
| AI misinformation liability | High | Clear disclaimers, human vet escalation path |

---

## Appendix

### Related Documents
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture details
- [DATA_MODEL.md](./DATA_MODEL.md) - Database schema and relationships
- [ROADMAP.md](./ROADMAP.md) - Development timeline and milestones
- [TASKS.md](./TASKS.md) - Detailed task breakdown
- [AGENTS.md](./AGENTS.md) - Agent role assignments

### External Resources
- [Firebase Console](https://console.firebase.google.com/)
- [Supabase Dashboard](https://app.supabase.com/)
- [Razorpay Dashboard](https://dashboard.razorpay.com/)
- [Google AI Studio](https://aistudio.google.com/)

---

**Last Updated:** Phase 0 Audit  
**Document Owner:** PM Agent  
**Review Cycle:** Bi-weekly during active development
