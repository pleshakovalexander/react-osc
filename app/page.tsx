"use client";
import { useRef } from "react";
import { MouseTracker, Position } from "./mouse-track";
import { closestNoteFrequency } from "./utils";

export default function Home() {
  const contextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const currentFrequencyRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  const getContext = () => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }
    return contextRef.current;
  };

  const setupOscillator = () => {
    const context = getContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainRef.current = gain;
  };

  const clickNote = (frequency: number) => {
    const context = getContext();
    const now = context.currentTime;

    if (!oscillatorRef.current || !gainRef.current) {
      setupOscillator();
    }

    const oscillator = oscillatorRef.current;
    const gain = gainRef.current;
    if (!oscillator || !gain) return;

    // If already playing this frequency, do nothing
    if (frequency === currentFrequencyRef.current) return;

    currentFrequencyRef.current = frequency;

    // Ensure volume is up smoothly
    gain.gain.setTargetAtTime(1, now, 0.05);

    // Glide frequency instead of hard reset
    oscillator.frequency.setTargetAtTime(frequency, now, 0.1);
  };

  const stopNote = () => {
    const context = getContext();
    const gain = gainRef.current;
    if (!gain) return;

    const now = context.currentTime;
    // Smooth fade out
    gain.gain.setTargetAtTime(0, now, 0.1);
  };

  const trackpadPositionChanged = (position: Position | null) => {
    if (position === null) {
      stopNote();
      return;
    }

    const now = performance.now();
    if (now - lastUpdateRef.current < 50) return; // max ~20 updates/sec
    lastUpdateRef.current = now;

    const frequency = closestNoteFrequency(position.x + 100);
    clickNote(frequency);
  };

  return (
    <div className="h-full flex justify-center content-center gap-2">
      <MouseTracker positionChanged={trackpadPositionChanged} />
    </div>
  );
}
