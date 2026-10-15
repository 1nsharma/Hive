# 🐾 PetJanu — India's Public Pet Safety & Care Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=petjanu)](https://vercel.com/petjanu)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

[PetJanu](https://petsjanu.com) is India's public-facing pet safety and care platform. It provides every pet with a digital identity, scannable QR/NFC smart collar tags, 1-tap Lost Pet SOS alerts, 24/7 AI health guidance, and an integrated pet products and services marketplace.

---

## ✨ Core Features

1. **Digital Pet Identity & Public Tag Profiles (`/p/[slug]`):**
   - Instant digital pet passport storing breed, medical history, vaccination records, and dietary needs.
   - Privacy-preserving contact relay via phone masking and WhatsApp notification proxies.
   - Citizen sighting submission flow with live location tagging and photo uploads.

2. **1-Tap Lost Pet SOS Mode:**
   - Immediately transforms a pet's public tag page into a high-visibility red emergency alert banner.
   - Sends real-time SMS and WhatsApp scanner alerts to pet parents when tags are scanned.

3. **Smart Collar Tag Hardware:**
   - Waterproof QR & NFC smart collar tags for instantaneous mobile camera scanning (no app download required for finders).

4. **24/7 AI Health & Clinical Triage Assistant:**
   - Powered by Gemini 3.6 Flash for rapid symptom risk assessment (🟢 Low, 🟡 Monitor, 🟠 Vet Recommended, 🔴 Urgent).
   - Strict veterinary guardrails ensuring clear clinical disclaimers.

5. **Pet Products Store & Vet Services:**
   - Curated pet food, health supplements, grooming supplies, and accessories.
   - Tele-vet consultations and home grooming appointments with Razorpay GST tax invoicing.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6.2
- **Styling:** Tailwind CSS 4.1
- **Animations:** Motion
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.21
- **API Routes:** Serverless-style `/api/*` endpoints
- **Bundling:** ESBuild 0.25

### Data & Storage
- **Primary Database:** Supabase PostgreSQL
- **Secondary Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google OAuth, Phone OTP)
- **File Storage:** Firebase Storage

### Third-Party Integrations
- **Payments:** Razorpay (India)
- **AI/ML:** Google Gemini 3.6 Flash API
- **Hosting:** Vercel (frontend), Cloud Run option (backend)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x or Bun
- Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/petjanu/petjanu-app.git
cd petjanu-app

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
cp .env.example .env.local
# Edit .env.local and fill in your credentials

# 4. Start local development server
npm run dev
```

The app will be accessible at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite + Express) |
| `npm run build` | Build for production (Vite + ESBuild) |
| `npm run start` | Run production server |
| `npm run test` | Run Vitest unit tests |
| `npm run type-check` | TypeScript type check (`tsc --noEmit`) |
| `npm run env:check` | Validate required `.env` variables |
| `npm run check-all` | Run env:check, type-check, test, and build |
| `npm run preview` | Preview production build locally |

---

## 📁 Project Structure

```
petjanu-app/
├── api/                    # Serverless API routes
│   ├── auth/               # Authentication endpoints
│   ├── chat/               # AI chat endpoints
│   ├── pets/               # Pet CRUD operations
│   ├── products/           # Product catalog
│   ├── services/           # Service bookings
│   ├── orders/             # Order management
│   └── webhooks/           # Payment webhooks
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── context/            # Context providers
│   ├── lib/                # Utilities & clients
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── docs/                   # Documentation
│   ├── PROJECT_BRIEF.md    # Product requirements
│   ├── ARCHITECTURE.md     # Technical architecture
│   ├── DATA_MODEL.md       # Database schema
│   ├── ROADMAP.md          # Development timeline
│   ├── TASKS.md            # Task breakdown
│   ├── AGENTS.md           # Team roles
│   ├── DECISIONS.md        # Architecture decisions
│   └── RUNBOOK.md          # Operations manual
├── supabase/               # Database migrations
├── functions/              # Firebase Cloud Functions
├── public/                 # Static assets
├── .env.example            # Environment template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
└── server.ts               # Main server file
```

---

## 🔒 Security & Privacy

PetJanu prioritizes user data privacy and security:

- **Phone Masking:** Owner contact details are protected behind secure proxy relays when tags are scanned.
- **Server-Side API Proxying:** All AI API keys and payment secrets remain strictly server-side.
- **Environment Variables:** Sensitive configuration stored in `.env.local` (never committed).
- **Data Protection:** See [SECURITY.md](./SECURITY.md) and [PRIVACY.md](./PRIVACY.md) for detailed guidelines.

### Security Contacts

- **Security Issues:** security@petsjanu.com
- **General Support:** support@petsjanu.com

---

## 📄 Documentation

| Document | Description |
|----------|-------------|
| [PROJECT_BRIEF.md](./docs/PROJECT_BRIEF.md) | Product requirements, personas, GTM strategy |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, tech stack, data flow diagrams |
| [DATA_MODEL.md](./docs/DATA_MODEL.md) | Database schema, ERD, TypeScript types |
| [ROADMAP.md](./docs/ROADMAP.md) | 6-sprint development timeline |
| [TASKS.md](./docs/TASKS.md) | Detailed task breakdown by sprint |
| [AGENTS.md](./docs/AGENTS.md) | Team role assignments and responsibilities |
| [DECISIONS.md](./docs/DECISIONS.md) | Architecture Decision Records (ADRs) |
| [RUNBOOK.md](./docs/RUNBOOK.md) | Operations manual, incident response |

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) before getting started.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Website:** [https://petsjanu.com](https://petsjanu.com)
- **Support Email:** support@petsjanu.com
- **Security Contact:** security@petsjanu.com
- **Documentation:** [docs/](./docs/)

---

## 🙏 Acknowledgments

- Built with ❤️ for pet lovers across India
- Powered by modern web technologies and cloud infrastructure
- Inspired by the need for safer communities for pets and their families

---

**Version:** 1.0.1  
**Last Updated:** Phase 2 - QA & CI Passing  
**Status:** Active Development (Tests Passing)
