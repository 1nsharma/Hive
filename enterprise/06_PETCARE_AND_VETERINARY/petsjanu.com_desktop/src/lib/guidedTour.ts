/**
 * Interactive Product Tour & Guided Onboarding Manager (Driver.js / Intro.js pattern)
 * Guides users through PetJanu's flagship features: Smart NFC/QR Tag, SOS Radar,
 * AI Symptom Triage, and Emergency Lost Poster generation.
 */

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  badge?: string;
  iconName?: string;
}

export const ONBOARDING_TOUR_STEPS: TourStep[] = [
  {
    id: 'step-welcome',
    title: 'Welcome to PetJanu Safety Platform',
    description: 'India\'s fastest pet recovery ecosystem. Let\'s take a 30-second tour of how your pet is protected 24/7.',
    badge: 'START TOUR',
    iconName: 'Sparkles'
  },
  {
    id: 'step-tag',
    title: 'Dual-Tech Smart Tag (NFC + QR)',
    description: 'Anyone who finds your pet taps with their phone or scans the QR code. Zero apps needed for the finder!',
    badge: 'HARDWARE',
    iconName: 'QrCode'
  },
  {
    id: 'step-radar',
    title: 'Real-Time SOS Radar & Sightings',
    description: 'If your pet goes missing, trigger SOS mode to broadcast alerts to nearby registered pet parents and shelters instantly.',
    badge: 'SAFETY MAP',
    iconName: 'MapPin'
  },
  {
    id: 'step-ai',
    title: 'AI Symptom & Triage Checker',
    description: 'Get immediate non-diagnostic guidance if your pet vomits, eats something toxic, or shows signs of illness.',
    badge: 'AI CARE',
    iconName: 'Activity'
  },
  {
    id: 'step-poster',
    title: 'Instant Lost Pet Poster Generator',
    description: 'Generate high-resolution printable missing pet posters with embedded scannable QR tags in one click.',
    badge: 'EMERGENCY TOOL',
    iconName: 'FileText'
  }
];

class GuidedTourManager {
  private currentStepIndex = 0;
  private isTourOpen = false;
  private listeners: Array<(isOpen: boolean, stepIndex: number) => void> = [];

  public startTour(): void {
    this.currentStepIndex = 0;
    this.isTourOpen = true;
    this.notify();
  }

  public nextStep(): void {
    if (this.currentStepIndex < ONBOARDING_TOUR_STEPS.length - 1) {
      this.currentStepIndex++;
      this.notify();
    } else {
      this.closeTour();
    }
  }

  public prevStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.notify();
    }
  }

  public closeTour(): void {
    this.isTourOpen = false;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('petjanu_tour_completed', 'true');
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public isCompleted(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('petjanu_tour_completed') === 'true';
    } catch {
      return false;
    }
  }

  public subscribe(cb: (isOpen: boolean, stepIndex: number) => void): () => void {
    this.listeners.push(cb);
    cb(this.isTourOpen, this.currentStepIndex);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify(): void {
    this.listeners.forEach(cb => cb(this.isTourOpen, this.currentStepIndex));
  }
}

export const guidedTour = new GuidedTourManager();
