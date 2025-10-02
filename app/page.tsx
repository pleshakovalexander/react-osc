"use client";
import { MouseTracker, Position } from "./mouse-track";
import { closestNoteFrequency } from "./utils";

export default function Home() {
  const context = new AudioContext();

  let oscillator: OscillatorNode | null = null;

  let gain: GainNode | null = null;

  let currentFrequency: number | null = null;

  const setupOscillator = () => {
    oscillator = context.createOscillator();
    gain = context.createGain();

    oscillator.type = "sine";
    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
  };

  const clickNote = (frequency: number) => {
    const now = context.currentTime;

    if (oscillator === null) {
      setupOscillator();
    }

    if (!oscillator) {
      return;
    }

    if (!gain) {
      return;
    }

    // Cancel any previous automation to avoid conflicts
    oscillator.frequency.cancelScheduledValues(now);
    gain.gain.cancelScheduledValues(now);

    // If same note is playing, fade it out first
    if (frequency === currentFrequency) {
      gain.gain.cancelScheduledValues(now);
      // gain.gain.setValueAtTime(0, now + 0.01);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);

      gain.gain.cancelScheduledValues(context.currentTime + 0.1);
      // Make sure volume is up
      // gain?.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.11);

      return;
    }

    currentFrequency = frequency;

    // Make sure volume is up
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(1, now + 0.01);

    // Smooth glide in 0.3 seconds (tweak this time for faster/slower glide)
    oscillator.frequency.linearRampToValueAtTime(frequency, now + 0.3);
  };

  const stopNote = () => {
    if (!gain) return;

    const now = context.currentTime;

    // Fade out over 0.3s
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
  };

  const trackpadPositionChanged = (position: Position) => {
    const frequency = closestNoteFrequency(position.x + 100);

    clickNote(frequency);
  };

  return (
    <div className="h-full flex justify-center content-center gap-2">
      <MouseTracker positionChanged={trackpadPositionChanged} />
      <button className="bg-amber-300" onClick={() => clickNote(130.8)}>
        130.8
      </button>
      <button className="bg-amber-300" onClick={() => clickNote(174.6)}>
        174.6
      </button>
      <button className="bg-amber-300" onClick={() => clickNote(329.6)}>
        329.6
      </button>
      <button className="bg-amber-300" onClick={() => stopNote()}>
        stop
      </button>
    </div>
  );
}
