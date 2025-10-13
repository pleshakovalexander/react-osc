"use client";
import { useRef, useState } from "react";
import { MouseTracker, Position } from "./mouse-track";
import { closestNoteFrequency } from "./utils";

export default function Home() {
  const contextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const currentFrequencyRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);
  const [waitingForFirstClick, setWaitingForFirstClick] = useState<boolean>(true);


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
    if (waitingForFirstClick) {
      return;
    }

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

  const startPlayingClicked = (): void => {
    setWaitingForFirstClick(false);
  };

  return (
    <div className="h-screen flex justify-center gap-2 pt-[28vh]">
      <div className="relative  w-[420px] h-[300px]">
        <MouseTracker positionChanged={trackpadPositionChanged} />
        {waitingForFirstClick && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-full w-full flex justify-center items-center" >
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors duration-200 cursor-pointer"
              onClick={startPlayingClicked}
            >
              Start Playing
            </button>
          </div>)}
      </div>
    </div>
  );
}
