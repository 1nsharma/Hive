import { driver, Driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

let activeDriver: Driver | null = null;

export const stopActiveTour = () => {
  if (activeDriver) {
    activeDriver.destroy();
    activeDriver = null;
  }
};

export const startPublicWebsiteTour = (onComplete?: () => void) => {
  if (activeDriver) {
    activeDriver.destroy();
    activeDriver = null;
  }

  let completedHandled = false;
  const finishTour = () => {
    if (completedHandled) return;
    completedHandled = true;
    activeDriver = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onComplete) {
      onComplete();
    }
  };

  const steps: DriveStep[] = [
    {
      element: "#tour-brand",
      popover: {
        title: "🚛 Welcome to Truck Wala 24×7",
        description:
          "India's dedicated commercial vehicle breakdown and workshop operations network. Covering expressways, heavy haulage corridors, and authorized maintenance hubs.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#tour-emergency-sos",
      popover: {
        title: "⚡ 24×7 Highway SOS & Rescue",
        description:
          "Truck broken down on NH-48, NH-19, or freight corridors? Click Roadside SOS anytime to get instant GPS-located mobile technician dispatch with average 38-minute arrival.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#tour-book-service",
      popover: {
        title: "📅 Book Workshop Maintenance",
        description:
          "Schedule bay service for fleet trucks, computerized laptop diagnostics, brake overhaul, engine checkup, and wheel alignment with transparent pricing.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#tour-services-grid",
      popover: {
        title: "🛠️ Complete Commercial Services",
        description:
          "Explore specialized capabilities: Computerized Diagnostics, Heavy Engine & Transmission, Air-Brake & Suspension, and 100% Genuine OEM Spares.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#tour-how-it-works",
      popover: {
        title: "🔄 4-Stage Response Cycle",
        description:
          "From phone/WhatsApp SOS call to Mobile Van Dispatch, Bay Repair with photo evidence, and Final Quality Check Clearance.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#tour-testimonials",
      popover: {
        title: "⭐ Transporter Community Trust",
        description:
          "Real feedback and ratings from logistics fleet operators, container haulers, and independent truck drivers across major transit routes.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#tour-staff-login",
      popover: {
        title: "🔐 Staff & Fleet Owner Login",
        description:
          "Access the live workshop operations command center! Switch between Owner, Head Mechanic, Service Engineer, and Admin roles.",
        side: "left",
        align: "center",
      },
    },
  ];

  activeDriver = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    stagePadding: 8,
    stageRadius: 14,
    overlayColor: "rgba(15, 23, 42, 0.75)",
    overlayOpacity: 0.75,
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Got It! Explore 🚀",
    progressText: "Step {{current}} of {{total}}",
    onDestroyed: () => {
      finishTour();
    },
    onCloseClick: () => {
      finishTour();
      if (activeDriver) activeDriver.destroy();
    },
    steps,
  });

  activeDriver.drive();
  return activeDriver;
};

export const startPrivateDashboardTour = (onComplete?: () => void) => {
  if (activeDriver) {
    activeDriver.destroy();
    activeDriver = null;
  }

  let completedHandled = false;
  const finishTour = () => {
    if (completedHandled) return;
    completedHandled = true;
    activeDriver = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onComplete) {
      onComplete();
    }
  };

  const steps: DriveStep[] = [
    {
      element: "#tour-dashboard-header",
      popover: {
        title: "🏢 Workshop Operations Command",
        description:
          "Welcome to the internal shop floor cockpit. Here your team manages live vehicle bays, technician assignments, voice notes, and billing audits in real time.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#tour-role-selector",
      popover: {
        title: "👥 Multi-Role Simulator",
        description:
          "Switch between Owner (Rajesh Kumar), Mechanic (Amit Singh), Service Engineer (Vikram Verma), and Admin (Pooja Sharma) to test role-specific views and capabilities.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#tour-new-vehicle",
      popover: {
        title: "➕ New Vehicle Intake",
        description:
          "Admit incoming trucks into the workshop, assign designated bays (e.g., Bay 1 - Engine, Bay 2 - Diagnostics), specify driver contacts, and generate job cards.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "#tour-voice-note",
      popover: {
        title: "🎙️ Voice-First Hinglish Audio Note",
        description:
          "Mechanics with grease-stained hands can speak natural Hindi/Hinglish instructions. Our system parses vehicle numbers, symptoms, and parts automatically without typing.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "#tour-stats-grid",
      popover: {
        title: "📊 Operational Vital Signs",
        description:
          "Instant metrics on active vehicle bays, pending audit items, emergency highway dispatch units, and monthly workshop revenue.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#tour-active-jobs",
      popover: {
        title: "🔧 Active Repair Bay Board",
        description:
          "Real-time status of commercial vehicles undergoing repairs. View assigned mechanics, progress percentage, parts used, and photo proofs.",
        side: "top",
        align: "center",
      },
    },
    {
      element: "#tour-timeline-action",
      popover: {
        title: "📜 Vertical Audit Timeline & Evidence",
        description:
          "Click on 'View Timeline' for any truck to inspect step-by-step diagnostic milestones, attach before/after inspection photos, or mark repair steps completed.",
        side: "left",
        align: "center",
      },
    },
    {
      element: "#tour-nav-tabs",
      popover: {
        title: "🚀 Deep Operations Modules",
        description:
          "Jump straight into WhatsApp Ingestion, Audit Review Queue, Shelf Inventory Barcode Scanner, Purchase Orders, and Data Trust Center.",
        side: "bottom",
        align: "center",
      },
    },
  ];

  activeDriver = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    stagePadding: 8,
    stageRadius: 14,
    overlayColor: "rgba(15, 23, 42, 0.8)",
    overlayOpacity: 0.8,
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Ready to Work! ✓",
    progressText: "Step {{current}} of {{total}}",
    onDestroyed: () => {
      finishTour();
    },
    onCloseClick: () => {
      finishTour();
      if (activeDriver) activeDriver.destroy();
    },
    steps,
  });

  activeDriver.drive();
  return activeDriver;
};
