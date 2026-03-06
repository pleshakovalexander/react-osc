"use client";
import { useRef } from "react";
import { closestNoteFrequency } from "../utils";
import { MouseTracker, Position } from "./mouse-track";
import synth from "../synth";
import useSynth from "../store";

export const SynthWrapper = () => {
  const lastUpdateRef = useRef(0);
  const synthOn = useSynth(({ on }) => on);

  const trackpadPositionChanged = (position: Position | null) => {
    if (false === synthOn || position === null) {
      synth.stop();

      return;
    }

    const now = performance.now();
    if (now - lastUpdateRef.current < 50) return;
    lastUpdateRef.current = now;

    const frequency = closestNoteFrequency(position.x + 100);
    const volume = Math.min(1 - Math.max(0.1, position.y / 300), 1);

    synth.play(frequency, volume);
  };

  return (
    <div className="relative">
      <MouseTracker positionChanged={trackpadPositionChanged} />
    </div>
  );
};
