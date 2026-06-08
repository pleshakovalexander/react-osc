import { create } from "zustand";
import synth from "./synth";

interface SynthState {
  oscillatorType: OscillatorType;
  on: boolean;
  turnOn: () => void;
  turnOff: () => void;
  changeOscillatorType: (type: OscillatorType) => void;
}

const useSynth = create<SynthState>((set) => ({
  oscillatorType: "sine",
  on: false,
  turnOn: () => {
    synth.initialize();
    set({ on: true });
  },
  turnOff: () => {
    synth.stop();
    set({ on: false });
  },
  changeOscillatorType(type) {
    synth.changeType(type);
    set({ oscillatorType: type });
  },
}));

synth.changeType("sine");

export default useSynth;
