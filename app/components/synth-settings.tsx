"use client";
import { ChangeEventHandler } from "react";
import useSynth from "../store";

const OSCILATOR_TYPES: OscillatorType[] = [
  "sine",
  "square",
  "triangle",
  "sawtooth",
];

export const SynthSettings = () => {
  const synthOn = useSynth(({ on }) => on);
  const start = useSynth(({ turnOn }) => turnOn);
  const stop = useSynth(({ turnOff }) => turnOff);
  const oscType = useSynth(({ oscillatorType }) => oscillatorType);
  const changeOscType = useSynth(
    ({ changeOscillatorType }) => changeOscillatorType,
  );

  const startPlayingClicked = (): void => {
    if (synthOn) {
      stop();
    } else {
      start();
    }
  };

  const changeSynthType: ChangeEventHandler<
    HTMLSelectElement,
    HTMLSelectElement
  > = (event): void => {
    const newType = event.target.value as OscillatorType;
    if (OSCILATOR_TYPES.includes(newType)) {
      changeOscType(newType);
    }
  };

  return (
    <div className="flex gap-5">
      <button
        className="
              bg-zinc-500 hover:bg-zinc-700 text-white 
              dark:bg-zinc-200 dark:hover:bg-zinc-100 dark:text-zinc-700
              rounded-lg shadow-lg transition-colors duration-200 cursor-pointer px-4 py-2"
        onClick={startPlayingClicked}
      >
        {synthOn ? "stop" : "start"}
      </button>

      <select
        className="border-amber-50 border-2 rounded-lg px-4 py-2"
        value={oscType}
        onChange={changeSynthType}
      >
        {OSCILATOR_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};
