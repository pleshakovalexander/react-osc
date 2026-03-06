"use client";
import useSynth from "../store";

export const SynthSettings = () => {
  const synthOn = useSynth(({ on }) => on);
  const start = useSynth(({ turnOn }) => turnOn);
  const stop = useSynth(({ turnOff }) => turnOff);

  const startPlayingClicked = (): void => {
    if (synthOn) {
      stop();
    } else {
      start();
    }
  };

  return (
    <>
      <button
        className="
              bg-zinc-500 hover:bg-zinc-700 text-white 
              dark:bg-zinc-200 dark:hover:bg-zinc-100 dark:text-zinc-700
              rounded-lg shadow-lg transition-colors duration-200 cursor-pointer px-4 py-2"
        onClick={startPlayingClicked}
      >
        {synthOn ? "stop" : "start"}
      </button>
    </>
  );
};
