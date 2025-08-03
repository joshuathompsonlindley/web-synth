"use client";

import { MixerController } from "@/components/synth-controls/mixer-control";

interface MixerSectionProps {
  volume: number;
  oscillatorMix: number;
  onVolumeChange: (volume: number) => void;
  onOscillatorMixChange: (mix: number) => void;
}

export function MixerSection({ volume, oscillatorMix, onVolumeChange, onOscillatorMixChange }: MixerSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <MixerController
        volume={volume}
        oscillatorMix={oscillatorMix}
        onVolumeChange={onVolumeChange}
        onOscillatorMixChange={onOscillatorMixChange}
      />
    </div>
  );
}
