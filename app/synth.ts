export class Synth {
  private currentFrequency: number | null = null;
  private context: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  private getContext() {
    if (!this.context) {
      this.context = new AudioContext();
    }
    return this.context;
  }

  private setupOscillator() {
    const context = this.getContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    this.osc = oscillator;
    this.gain = gain;
  }

  public play(frequency: number, volume: number = 1) {
    const context = this.getContext();
    const now = context.currentTime;

    if (!this.osc || !this.gain) {
      this.setupOscillator();
    }

    if (!this.osc || !this.gain) return;

    // If already playing this frequency, do nothing
    if (frequency === this.currentFrequency) return;

    this.currentFrequency = frequency;

    // Ensure volume is up smoothly
    this.gain.gain.setTargetAtTime(volume, now, 0.05);

    // Glide frequency instead of hard reset
    this.osc.frequency.setTargetAtTime(frequency, now, 0.1);
  }

  stop() {
    const context = this.getContext();

    if (!this.gain) return;

    const now = context.currentTime;
    // Smooth fade out
    this.gain.gain.setTargetAtTime(0, now, 0.1);
  }
}
