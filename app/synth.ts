/*
  Super Simple TypeScript Synth with Lazy Init
  - User API: play(note: number | Hz), stop()
  - AudioContext is created lazily on first play() to avoid autoplay restrictions
  - Ensures only one note plays at a time
*/

export class Synth {
  public context: AudioContext | null = null;
  private master: GainNode | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  constructor() {}

  /** Ensure AudioContext and master node exist */
  private ensureContext() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.8;
      this.master.connect(this.context.destination);
    }
  }

  /** Play a note (number interpreted as Hz for now) */
  async play(noteOrHz: number) {
    this.ensureContext();
    if (!this.context || !this.master) return;

    await this.context.resume(); // ensure context is running

    // stop any currently playing sound first
    this.stop();

    const freq = noteOrHz; // your original frequency logic

    console.log(freq);

    this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();

    this.osc.type = "sawtooth";
    this.osc.frequency.value = freq;
    this.gain.gain.value = 0.8;

    this.osc.connect(this.gain);
    this.gain.connect(this.master);

    this.osc.start();
  }

  /** Stop the current note with a short fade to avoid clicks */
  stop() {
    if (this.gain && this.context) {
      const now = this.context.currentTime;
      this.gain.gain.cancelScheduledValues(now);
      this.gain.gain.setValueAtTime(this.gain.gain.value, now);
      this.gain.gain.linearRampToValueAtTime(0.0001, now + 0.05); // 50 ms fade
    }

    if (this.osc) {
      try {
        this.osc.stop(this.context!.currentTime + 0.05); // stop after fade
      } catch {}
      this.osc.disconnect();
      this.osc = null;
    }

    if (this.gain) {
      this.gain.disconnect();
      this.gain = null;
    }
  }
}
