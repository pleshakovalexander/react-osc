"use client";
import { useRef, useState } from "react";
import { closestNoteFrequency } from "../utils";
import { MouseTracker, Position } from "./mouse-track";
import { Synth } from "../synth";

const synth = new Synth();

export const SynthWrapper = () => {
  const lastUpdateRef = useRef(0);
  const [waitingForFirstClick, setWaitingForFirstClick] =
    useState<boolean>(true);

  const trackpadPositionChanged = (position: Position | null) => {
    if (waitingForFirstClick) {
      return;
    }

    if (position === null) {
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

  const startPlayingClicked = (): void => {
    setWaitingForFirstClick(false);
  };

  return (
    <>
      <MouseTracker positionChanged={trackpadPositionChanged} />
      {waitingForFirstClick && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-full w-full flex justify-center items-center">
          <button
            className="
              bg-zinc-500 hover:bg-zinc-700 text-white 
              dark:bg-zinc-200 dark:hover:bg-zinc-100 dark:text-zinc-700
              rounded-lg shadow-lg transition-colors duration-200 cursor-pointer px-4 py-2"
            onClick={startPlayingClicked}
          >
            Start Playing
          </button>
        </div>
      )}
    </>
  );
};
