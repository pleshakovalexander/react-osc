import { SynthWrapper } from "./components/synth-wrapper";

export default function Home() {
  return (
    <div className="h-screen flex justify-center gap-2 pt-[28vh]">
      <div className="relative  w-[420px] h-[300px]">
        <SynthWrapper></SynthWrapper>
      </div>
    </div>
  );
}
