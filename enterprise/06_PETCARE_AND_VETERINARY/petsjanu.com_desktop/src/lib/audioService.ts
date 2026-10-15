/**
 * PetJanu Web Audio Synthesis Engine
 * Provides lightweight, zero-dependency interactive audio effects (inspired by Howler.js / Tone.js)
 * for NFC tag scans, SOS radar pings, emergency alarms, and user interactions.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Load mute preference from storage
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('petjanu_sound_muted') === 'true';
      } catch {
        this.isMuted = false;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('petjanu_sound_muted', String(this.isMuted));
      } catch {
        // ignore
      }
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * High-tech NFC tag tap sound (pleasant ascending two-tone chirp)
   */
  public playNfcTap(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // A6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Sonar radar ping sound for SOS beacon scanning
   */
  public playRadarPing(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Urgent SOS alarm pulse
   */
  public playSosAlarm(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 2; i++) {
        const startTime = now + i * 0.15;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, startTime);
        osc.frequency.linearRampToValueAtTime(950, startTime + 0.1);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.12);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Soft affirmative success chime
   */
  public playSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      notes.forEach((freq, idx) => {
        const startTime = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // ============================================================================
  // PETJANU AI PET ACOUSTIC SYNTHESIS ENGINE
  // ============================================================================

  /**
   * Canine Bark synthesizer with formant filtering & pitch envelope
   */
  public playCanineBark(pitchFactor: number = 1.0, intensity: 'calm' | 'alert' | 'playful' = 'alert'): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const count = intensity === 'playful' ? 2 : 1;
      const baseFreq = (intensity === 'calm' ? 180 : intensity === 'playful' ? 320 : 230) * pitchFactor;

      for (let i = 0; i < count; i++) {
        const startTime = now + i * 0.16;
        const duration = intensity === 'calm' ? 0.22 : 0.14;

        // Carrier oscillator
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq * 1.5, startTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, startTime + 0.04);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, startTime + duration);

        // Vocal tract formant filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(850 * pitchFactor, startTime);
        filter.Q.setValueAtTime(3.0, startTime);

        // Envelope
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      }
    } catch {
      // Audio policy fallback
    }
  }

  /**
   * Cheerful high-pitch playful yip / excited puppy vocalization
   */
  public playPlayfulYip(pitchFactor: number = 1.0): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const startFreq = 540 * pitchFactor;

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.6, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.8, now + 0.16);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 * pitchFactor, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio policy fallback
    }
  }

  /**
   * Low-frequency calming rumble / reassurance purr
   */
  public playCalmingRumble(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.3);
      osc.frequency.linearRampToValueAtTime(75, now + 0.7);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch {
      // Audio policy fallback
    }
  }

  /**
   * Cat Meow synthesizer with pitch glide and vocal formant
   */
  public playCatMeow(type: 'cheerful' | 'pleading' | 'chirp' = 'cheerful'): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';

      const duration = type === 'chirp' ? 0.15 : 0.55;
      const startFreq = type === 'pleading' ? 420 : 380;
      const peakFreq = type === 'chirp' ? 950 : 750;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(peakFreq, now + duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.9, now + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1250, now);
      filter.Q.setValueAtTime(4.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio policy fallback
    }
  }

  /**
   * Feline Purr synthesizer: 26Hz amplitude modulation on low carrier
   */
  public playCatPurr(durationSeconds: number = 1.6): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Carrier wave
      const carrier = ctx.createOscillator();
      carrier.type = 'triangle';
      carrier.frequency.setValueAtTime(58, now);

      // Amplitude LFO at feline purr frequency (26 Hz)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(26, now);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.12, now);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.2, now + 0.2);
      masterGain.gain.setValueAtTime(0.2, now + durationSeconds - 0.2);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

      lfo.connect(lfoGain.gain);
      carrier.connect(masterGain);
      masterGain.connect(ctx.destination);

      lfo.start(now);
      carrier.start(now);
      lfo.stop(now + durationSeconds);
      carrier.stop(now + durationSeconds);
    } catch {
      // Audio policy fallback
    }
  }

  /**
   * Standard Training Clicker sound (crisp 3kHz metallic impulse for positive reinforcement)
   */
  public playTrainingClicker(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Double click (down & up click)
      [0, 0.035].forEach((offset) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(3200, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 0.015);

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(2000, t);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.02);
      });
    } catch {
      // Audio policy fallback
    }
  }

  /**
   * High-Frequency Attention Whistle (Clean 6500Hz gentle tone)
   */
  public playUltrasonicWhistle(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(6500, now);
      osc.frequency.linearRampToValueAtTime(7200, now + 0.15);
      osc.frequency.linearRampToValueAtTime(6200, now + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio policy fallback
    }
  }

  /**
   * Bird Chirp synthesizer
   */
  public playBirdChirp(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.09;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2600, t);
        osc.frequency.linearRampToValueAtTime(4200, t + 0.035);
        osc.frequency.linearRampToValueAtTime(2800, t + 0.06);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.07);
      }
    } catch {
      // Audio policy fallback
    }
  }
}

export const audioService = new AudioService();
