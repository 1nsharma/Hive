/**
 * Web Audio API synthesized kitchen order chime & Web Notification helper (MRC-06)
 * Zero external audio file dependencies - runs anywhere without CORS or 404 errors.
 */

class NotificationSoundService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play high-clarity 2-tone kitchen bell chime (523Hz -> 659Hz -> 784Hz)
  public playOrderChime(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Note 2: E5 (659.25 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.15);
      gain2.gain.setValueAtTime(0.35, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.7);

      // Note 3: G5 (783.99 Hz) bell ring
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(783.99, now + 0.3);
      gain3.gain.setValueAtTime(0.4, now + 0.3);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.3);
      osc3.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }

  // Request browser notification permission
  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  // Trigger system notification
  public showOrderNotification(token: string, mode: string, total: string): void {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(`🛎️ New Order: ${token}`, {
          body: `Order Mode: ${mode} · Total: ${total}\nTap to view in Merchant Board.`,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Notification error:', err);
      }
    }
  }
}

export const notificationService = new NotificationSoundService();
