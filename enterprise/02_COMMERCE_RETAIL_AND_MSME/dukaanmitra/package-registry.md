# DukaanMitra Enterprise Package Registry

This document maintains the approved packages for the DukaanMitra AI Business OS to prevent dependency chaos and duplicate packages.

## 🚀 Core Framework
| Package | Version | Purpose | Use-Case | Alternatives | Risk Level |
|---------|---------|---------|-----------|--------------|------------|
| `react` / `react-dom` | ^18.2.0 | Core UI Library | Building the fundamental UI components. | Vue, Svelte | Low |
| `vite` | ^5.0.0 | Build Tool | Fast bundling and HMR for dev environment. | Next.js, Webpack | Low |
| `typescript` | ^5.0.0 | Type Safety | Ensuring enterprise-grade type safety across the OS. | JavaScript | Low |

## 🎨 UI & Design System
| Package | Version | Purpose | Use-Case | Alternatives | Risk Level |
|---------|---------|---------|-----------|--------------|------------|
| `tailwindcss` | ^3.4.0 | Styling | Utility-first CSS framework for rapid UI development. | Styled Components | Low |
| `framer-motion` | ^11.0.0 | Animations | Smooth transitions and layout animations for the OS feel. | React Spring | Low |
| `lucide-react` | ^0.300.0 | Icons | Consistent, lightweight vector icons. | HeroIcons, FontAwesome | Low |
| `clsx` / `tailwind-merge` | Latest | Class Merging | Dynamic class construction for reusable components. | Classnames | Low |

## 🔥 Backend & GCP
| Package | Version | Purpose | Use-Case | Alternatives | Risk Level |
|---------|---------|---------|-----------|--------------|------------|
| `firebase` | ^10.0.0 | Client SDK | Auth, Firestore, and Storage on the client. | Supabase, Appwrite | Medium |
| `firebase-admin` | ^12.0.0 | Server SDK | Secure backend operations and custom tokens. | Custom backend | Medium |

## 🤖 AI / Agents
| Package | Version | Purpose | Use-Case | Alternatives | Risk Level |
|---------|---------|---------|-----------|--------------|------------|
| `@google/genai` | Latest | AI Integration | Official Google SDK for Gemini models. | OpenAI, Langchain | Medium |
| `genkit` | Latest | Agent Framework | Orchestrating multi-agent workflows and tools. | Langchain, CrewAI | High |

## 📊 Analytics & Charts
| Package | Version | Purpose | Use-Case | Alternatives | Risk Level |
|---------|---------|---------|-----------|--------------|------------|
| `recharts` | ^2.10.0 | Data Visualization | Generating reports and business analytics charts. | Chart.js, D3 | Low |

## 📋 Forms & Validation
| Package | Version | Purpose | Use-Case | Alternatives | Risk Level |
|---------|---------|---------|-----------|--------------|------------|
| `zod` | ^3.22.0 | Schema Validation | Type-safe schema validation for APIs and forms. | Yup, Joi | Low |
| `react-hook-form` | ^7.50.0 | Form State | Managing complex business forms efficiently. | Formik | Low |

## 🏢 Enterprise Utilities
| Package | Version | Purpose | Use-Case | Alternatives | Risk Level |
|---------|---------|---------|-----------|--------------|------------|
| `date-fns` | ^3.0.0 | Date Manipulation | Formatting and parsing dates for ledgers and reports. | Moment, Day.js | Low |
| `nanoid` | ^5.0.0 | ID Generation | Generating unique, secure IDs for transactions. | UUID | Low |

*Note: This registry should be updated before installing any new package. Evaluate the necessity, security, and bundle impact before addition.*
