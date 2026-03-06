import { create } from "zustand";
import synth from "./synth";

interface SynthState {
  on: boolean;
  turnOn: () => void;
  turnOff: () => void;
}

const useSynth = create<SynthState>((set) => ({
  on: false,
  turnOn: () => {
    synth.initialize();
    set({ on: true });
  },
  turnOff: () => {
    synth.stop();
    set({ on: false });
  },
}));

export default useSynth;
