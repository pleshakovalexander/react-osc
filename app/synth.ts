class Synth {
  private currentFrequency: number | null = null;
  private currentVolume: number | null = null;
  private context: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  public initialize(): void {
    if (this.context === null) {
      this.setupOscillator();
    }
  }

  private getContext(): AudioContext {
    if (this.context === null) {
      this.context = new AudioContext();
    }
    return this.context;
  }

  private setupOscillator(): void {
    const context = this.getContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    this.osc = oscillator;
    this.gain = gain;
    const now = context.currentTime;
    this.gain.gain.setTargetAtTime(0, now, 0.1);
  }

  public play(frequency: number, volume: number = 1): void {
    const context = this.getContext();
    const now = context.currentTime;

    if (!this.osc || !this.gain) {
      this.setupOscillator();
    }

    if (!this.osc || !this.gain) return;

    // If already playing this frequency, do nothing
    if (frequency === this.currentFrequency && volume === this.currentVolume)
      return;

    this.currentFrequency = frequency;
    this.currentVolume = volume;

    this.gain.gain.setTargetAtTime(volume, now, 0.015);
    this.osc.frequency.setTargetAtTime(frequency, now, 0.015);
  }

  stop(): void {
    const context = this.getContext();

    if (!this.gain) return;

    const now = context.currentTime;

    this.gain.gain.setTargetAtTime(0, now, 0.1);
  }

  public changeType(type: OscillatorType) {
    if (this.osc == null) {
      return;
    }

    this.osc.type = type;
  }
}
const synth = new Synth();

export default synth;
