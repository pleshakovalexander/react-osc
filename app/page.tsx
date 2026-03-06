import { SynthSettings } from "./components/synth-settings";
import { SynthWrapper } from "./components/synth-wrapper";

export default function Home() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <div>
          <SynthSettings></SynthSettings>
        </div>
        <div className="w-[420px] h-[300px]">
          <SynthWrapper></SynthWrapper>
        </div>
      </div>
    </>
  );
}
