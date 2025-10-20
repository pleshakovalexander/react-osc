"use client";
import { useRef, useState } from "react";
import { MouseTracker, Position } from "./mouse-track";
import { closestNoteFrequency } from "./utils";
import { Synth } from "./synth";

const synth = new Synth();

export default function Home() {
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
    if (now - lastUpdateRef.current < 50) return; // max ~20 updates/sec
    lastUpdateRef.current = now;

    const frequency = closestNoteFrequency(position.x + 100);
    const volume = Math.min(1 - Math.max(0.1, position.y / 300), 1);

    synth.play(frequency, volume);
  };

  const startPlayingClicked = (): void => {
    setWaitingForFirstClick(false);
  };

  return (
    <div className="h-screen flex justify-center gap-2 pt-[28vh]">
      <div className="relative  w-[420px] h-[300px]">
        <MouseTracker positionChanged={trackpadPositionChanged} />
        {waitingForFirstClick && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-full w-full flex justify-center items-center">
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors duration-200 cursor-pointer"
              onClick={startPlayingClicked}
            >
              Start Playing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
