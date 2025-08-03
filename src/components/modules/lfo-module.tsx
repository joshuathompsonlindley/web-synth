"use client";

import { LfoSetupController } from "@/components/synth-controls/lfo-setup-control";
import { LfoTargetController } from "@/components/synth-controls/lfo-target-control";

interface LfoModuleProps {
  lfoRate: number;
  lfoWaveform: OscillatorType;
  lfoFilterDepth: number;
  lfoOsc1PitchDepth: number;
  lfoOsc2PitchDepth: number;
  lfoOsc1LevelDepth: number;
  lfoOsc2LevelDepth: number;
  onLfoRateChange: (rate: number) => void;
  onLfoWaveformChange: (waveform: OscillatorType) => void;
  onLfoFilterDepthChange: (depth: number) => void;
  onLfoOsc1PitchDepthChange: (depth: number) => void;
  onLfoOsc2PitchDepthChange: (depth: number) => void;
  onLfoOsc1LevelDepthChange: (depth: number) => void;
  onLfoOsc2LevelDepthChange: (depth: number) => void;
}

export function LfoModule({
  lfoRate,
  lfoWaveform,
  lfoFilterDepth,
  lfoOsc1PitchDepth,
  lfoOsc2PitchDepth,
  lfoOsc1LevelDepth,
  lfoOsc2LevelDepth,
  onLfoRateChange,
  onLfoWaveformChange,
  onLfoFilterDepthChange,
  onLfoOsc1PitchDepthChange,
  onLfoOsc2PitchDepthChange,
  onLfoOsc1LevelDepthChange,
  onLfoOsc2LevelDepthChange,
}: LfoModuleProps) {
  return (
    <div className="flex flex-col gap-6">
      <LfoSetupController
        lfoRate={lfoRate}
        lfoWaveform={lfoWaveform}
        onLfoRateChange={onLfoRateChange}
        onLfoWaveformChange={onLfoWaveformChange}
      />
      <LfoTargetController
        lfoFilterDepth={lfoFilterDepth}
        lfoOsc1LevelDepth={lfoOsc1LevelDepth}
        lfoOsc1PitchDepth={lfoOsc1PitchDepth}
        lfoOsc2LevelDepth={lfoOsc2LevelDepth}
        lfoOsc2PitchDepth={lfoOsc2PitchDepth}
        onLfoFilterDepthChange={onLfoFilterDepthChange}
        onLfoOsc1PitchDepthChange={onLfoOsc1PitchDepthChange}
        onLfoOsc2PitchDepthChange={onLfoOsc2PitchDepthChange}
        onLfoOsc1LevelDepthChange={onLfoOsc1LevelDepthChange}
        onLfoOsc2LevelDepthChange={onLfoOsc2LevelDepthChange}
      />
    </div>
  );
}
