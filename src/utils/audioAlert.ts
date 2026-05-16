/**
 * Audio Alert System
 * Generates various alert sounds for trading signals
 */

type AlertType = 'buy' | 'sell' | 'warning' | 'highProbability';

export class AudioAlertSystem {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Enable/Disable audio alerts
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Play BUY alert (ascending tone)
   */
  public playBuyAlert(): void {
    this.playAlert('buy');
  }

  /**
   * Play SELL alert (descending tone)
   */
  public playSellAlert(): void {
    this.playAlert('sell');
  }

  /**
   * Play warning alert
   */
  public playWarningAlert(): void {
    this.playAlert('warning');
  }

  /**
   * Play high probability alert (triple beep)
   */
  public playHighProbabilityAlert(): void {
    this.playAlert('highProbability');
  }

  /**
   * Main alert player
   */
  private playAlert(type: AlertType): void {
    if (!this.isEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    switch (type) {
      case 'buy':
        this.playAscendingTone(ctx, now);
        this.vibrate([100, 50, 100]);
        break;
      case 'sell':
        this.playDescendingTone(ctx, now);
        this.vibrate([150, 50, 150]);
        break;
      case 'warning':
        this.playNeutralTone(ctx, now);
        this.vibrate([50, 50, 50, 50, 50]);
        break;
      case 'highProbability':
        this.playTripleBeep(ctx, now);
        this.vibrate([100, 100, 100, 100, 100, 100]);
        break;
    }
  }

  /**
   * Play ascending tone (BUY signal)
   */
  private playAscendingTone(ctx: AudioContext, startTime: number): void {
    const duration = 0.5;
    const startFreq = 800;
    const endFreq = 1200;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration);

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Play descending tone (SELL signal)
   */
  private playDescendingTone(ctx: AudioContext, startTime: number): void {
    const duration = 0.5;
    const startFreq = 1200;
    const endFreq = 800;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration);

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Play neutral tone (WARNING)
   */
  private playNeutralTone(ctx: AudioContext, startTime: number): void {
    const duration = 0.3;
    const frequency = 1000;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Play triple beep (HIGH PROBABILITY)
   */
  private playTripleBeep(ctx: AudioContext, startTime: number): void {
    const beepDuration = 0.2;
    const gap = 0.1;
    const frequency = 1200;

    for (let i = 0; i < 3; i++) {
      const time = startTime + i * (beepDuration + gap);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, time);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + beepDuration);

      osc.start(time);
      osc.stop(time + beepDuration);
    }
  }

  /**
   * Vibrate device (if supported)
   */
  private vibrate(pattern: number[]): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
}

// Export singleton instance
export const audioAlertSystem = new AudioAlertSystem();
