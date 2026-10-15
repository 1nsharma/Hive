import { driver, DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';

// Active driver instance tracker
let currentDriverInstance: ReturnType<typeof driver> | null = null;

export function stopActiveTour() {
  if (currentDriverInstance) {
    currentDriverInstance.destroy();
    currentDriverInstance = null;
  }
}

/**
 * Creates the base Driver.js configuration styled specifically for PetJanu's
 * botanical luxury emerald (#175741) and warm amber (#F0A21E) design language.
 */
function createPetJanuDriver(customConfig?: Partial<Config>) {
  // Destroy existing tour if any is running
  stopActiveTour();

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: 'rgba(10, 44, 33, 0.78)', // Deep Pine translucent backdrop
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: 'petjanu-driver-popover',
    nextBtnText: 'Next Step →',
    prevBtnText: '← Back',
    doneBtnText: 'Complete Tour 🐾',
    progressText: 'Pillar {{current}} of {{total}}',
    ...customConfig,
  });

  currentDriverInstance = driverObj;
  return driverObj;
}

/**
 * TOUR 1: Full PetJanu Economy & Ecosystem Walkthrough
 * Covers all core economic pillars: Hardware Tag -> Zero-Paywall Radar -> AI Triage -> Marketplace -> Care Booking -> Preventive Health -> Pricing.
 */
export function startFullEconomyTour(navigateTab: (tab: string) => void) {
  // Start on landing
  navigateTab('landing');

  setTimeout(() => {
    const steps: DriveStep[] = [
      {
        element: '#petjanu-brand-header',
        popover: {
          title: '🐾 Welcome to PetJanu Ecosystem',
          description:
            '<strong>India’s Unified Pet Safety & Care Economy</strong>.<br/><br/>PetJanu combines zero-battery NFC/QR collar hardware, zero-paywall lost pet emergency radar, 24/7 AI clinical triage, vetted vet/grooming services, and an open MCP developer network.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-hero-tag-cta',
        popover: {
          title: '🏷️ Pillar 1: Hardware Anchor (Smart NFC/QR Tags)',
          description:
            '<strong>Zero-Battery Passive Collar Tags</strong> linked directly to the pet’s digital cloud identity.<br/><br/>Anyone with an iPhone or Android can tap or scan without installing an app. Durable, waterproof, and designed for India’s climate.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-phone-demo-card',
        popover: {
          title: '🚨 Pillar 2: Zero-Paywall Lost Pet Radar & Sighting Beacon',
          description:
            '<strong>100% Free Emergency Reunions</strong>.<br/><br/>When a pet goes missing, the public page triggers a high-visibility SOS broadcast. Finders can transmit fuzzed GPS location pings (~110m privacy radius) or connect via privacy-masked WhatsApp with zero subscription barrier.',
          side: 'left',
          align: 'center',
        },
      },
      {
        element: '#tour-intent-router',
        popover: {
          title: '🧠 Pillar 3: Intent-Based AI Routing',
          description:
            '<strong>Pet Parents express intent, AI activates the economy</strong>.<br/><br/>Type any need in English or Hinglish (e.g., <em>"Mera pet kho gaya hai"</em> or <em>"Vaccination schedule"</em>) and the router instantly activates safety beacons, clinic routing, or marketplace diets.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '#tour-nav-dashboard',
        popover: {
          title: '🛡️ Pillar 4: Digital Health Passport & Due-Date Engine',
          description:
            '<strong>Vaccination & Medical Records Cloud</strong>.<br/><br/>Automated reminder engine for Rabies, DHPPiL, and deworming boosters with digital health cards for boarding, flights, and vet clinics.',
          side: 'bottom',
          align: 'center',
          onNextClick: () => {
            navigateTab('marketplace');
            setTimeout(() => currentDriverInstance?.moveNext(), 250);
          },
        },
      },
      {
        element: '#tour-marketplace-header',
        popover: {
          title: '🛍️ Pillar 5: Safety & Wellness Marketplace (Commerce Economy)',
          description:
            '<strong>Curated Hardware & Nutrition</strong>.<br/><br/>Laser-engraved brass tags, hypoallergenic organic kibble, waterproof harnesses, and GPS beacons with frictionless Razorpay UPI / Card checkout.',
          side: 'bottom',
          align: 'center',
          onNextClick: () => {
            navigateTab('services');
            setTimeout(() => currentDriverInstance?.moveNext(), 250);
          },
        },
      },
      {
        element: '#tour-services-header',
        popover: {
          title: '🩺 Pillar 6: Vetted Services & Tele-Vet Network',
          description:
            '<strong>On-Demand Tele-Consultation & Home Grooming</strong>.<br/><br/>Book verified veterinarians, fear-free dog trainers, and certified home groomers with calendar booking and instant appointment confirmation.',
          side: 'bottom',
          align: 'center',
          onNextClick: () => {
            navigateTab('ai');
            setTimeout(() => currentDriverInstance?.moveNext(), 250);
          },
        },
      },
      {
        element: '#tour-ai-chat-header',
        popover: {
          title: '🤖 Pillar 7: AI Clinical Guardrails (No-Diagnosis / No-Dosage)',
          description:
            '<strong>Safe, Responsible Veterinary AI Companion</strong>.<br/><br/>Strict clinical safety policies ensure emergency symptoms (toxins, seizures, bloat) immediately escalate to 24/7 clinics while filtering out dangerous medication dosages and protecting owner PII.',
          side: 'bottom',
          align: 'center',
          onNextClick: () => {
            navigateTab('pricing');
            setTimeout(() => currentDriverInstance?.moveNext(), 250);
          },
        },
      },
      {
        element: '#tour-pricing-header',
        popover: {
          title: '🏷️ Pillar 8: Fair & Sustainable Unit Economics',
          description:
            '<strong>Transparent Pricing for Every Indian Pet Parent</strong>.<br/><br/>• <strong>₹0 Forever</strong>: Core Digital Pet ID, Lost SOS & Reminders<br/>• <strong>₹149 – ₹999</strong>: One-time physical Smart NFC/QR collar tags<br/>• <strong>₹99/mo</strong>: PetJanu Plus AI photo triage & clinic discounts.',
          side: 'bottom',
          align: 'center',
        },
      },
    ];

    const driverObj = createPetJanuDriver({ steps });
    driverObj.drive();
  }, 150);
}

/**
 * TOUR 2: Smart Tag & Lost Pet Radar Tour
 */
export function startRadarTour(navigateTab: (tab: string) => void) {
  navigateTab('landing');
  setTimeout(() => {
    const steps: DriveStep[] = [
      {
        element: '#tour-hero-tag-cta',
        popover: {
          title: '🏷️ Passive Smart Tag Hardware',
          description:
            'Works universally with every smartphone camera and NFC reader. No charging required, lifetime durability.',
          side: 'bottom',
        },
      },
      {
        element: '#tour-phone-demo-card',
        popover: {
          title: '🚨 Zero-Paywall SOS Page',
          description:
            'Instantly switches to an emergency alert state when lost mode is enabled. Direct calling and WhatsApp deep-links are ready for citizens.',
          side: 'left',
        },
      },
      {
        element: '#tour-demo-sighting-panel',
        popover: {
          title: '📍 Fuzzed Coordinate Sighting Pings',
          description:
            'Citizens can transmit GPS coordinates with ~110m privacy fuzzing and IP-hashing, notifying the owner in real time without exposing personal identity.',
          side: 'top',
        },
      },
    ];

    const driverObj = createPetJanuDriver({ steps });
    driverObj.drive();
  }, 150);
}

/**
 * TOUR 3: AI Safety & Clinical Triage Tour
 */
export function startAiSafetyTour(navigateTab: (tab: string) => void) {
  navigateTab('ai');
  setTimeout(() => {
    const steps: DriveStep[] = [
      {
        element: '#tour-ai-chat-header',
        popover: {
          title: '🤖 24/7 AI Clinical Assistant',
          description:
            'Trained to provide calm, multi-lingual triage across dogs and cats in India.',
          side: 'bottom',
        },
      },
      {
        element: '#tour-ai-guardrails-badge',
        popover: {
          title: '🛡️ Strict Veterinary Safety Guardrails',
          description:
            '• <strong>No Prescription Dosages</strong>: AI never prescribes human or antibiotic dosages.<br/>• <strong>Emergency Escalation</strong>: Toxins, collapse, or bloat trigger instant red emergency warnings.<br/>• <strong>Zero PII Leakage</strong>: All logs are scrubbed.',
          side: 'bottom',
        },
      },
      {
        element: '#tour-ai-quick-prompts',
        popover: {
          title: '⚡ 1-Click Common Health Prompts',
          description:
            'Quickly test common pet emergencies like chocolate toxicity, vomiting, lethargy, or vaccination inquiries.',
          side: 'top',
        },
      },
    ];

    const driverObj = createPetJanuDriver({ steps });
    driverObj.drive();
  }, 150);
}

/**
 * TOUR 4: Marketplace & Commerce Economy Tour
 */
export function startCommerceTour(navigateTab: (tab: string) => void) {
  navigateTab('marketplace');
  setTimeout(() => {
    const steps: DriveStep[] = [
      {
        element: '#tour-marketplace-header',
        popover: {
          title: '🛍️ PetJanu Curated Commerce',
          description:
            'Hardware collar tags, GPS beacons, grain-free nutrition, and vet-approved wellness products.',
          side: 'bottom',
        },
      },
      {
        element: '#tour-marketplace-categories',
        popover: {
          title: '🔍 Category Filters',
          description:
            'Filter across Safety & Tags, Food & Care, Accessories, and Toys & Health.',
          side: 'bottom',
        },
      },
      {
        element: '#tour-marketplace-product-grid',
        popover: {
          title: '💳 Seamless Razorpay UPI / Card Checkout',
          description:
            'Zero-friction purchase flow supporting GPay, PhonePe, Paytm, Cards, and Net Banking across India.',
          side: 'top',
        },
      },
    ];

    const driverObj = createPetJanuDriver({ steps });
    driverObj.drive();
  }, 150);
}

/**
 * TOUR 5: Privacy, Security & MCP Developer Console Tour
 */
export function startSecurityTour(navigateTab: (tab: string) => void) {
  navigateTab('mcp');
  setTimeout(() => {
    const steps: DriveStep[] = [
      {
        element: '#tour-mcp-header',
        popover: {
          title: '🔌 Model Context Protocol (MCP) Open Server',
          description:
            'PetJanu provides open, structured MCP tool endpoints (`petjanu_triage_symptom`, `petjanu_verify_pet_tag`, `petjanu_calculate_diet`) for AI Agents & developers.',
          side: 'bottom',
        },
      },
      {
        element: '#tour-mcp-tools-list',
        popover: {
          title: '⚡ Live Interactive MCP Inspector',
          description:
            'Execute real JSON-RPC tool payloads, inspect strict Zod schema validation, and test AI triage pipelines directly in the browser.',
          side: 'bottom',
        },
      },
      {
        element: '#tour-mcp-live-tester',
        popover: {
          title: '🔒 Privacy First Architecture',
          description:
            'SHA-256 hashed IPs, fuzzed geolocation coordinates, masked phone relays, and full data export compliance.',
          side: 'top',
        },
      },
    ];

    const driverObj = createPetJanuDriver({ steps });
    driverObj.drive();
  }, 150);
}
