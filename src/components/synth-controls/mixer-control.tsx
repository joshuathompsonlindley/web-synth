import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { Knob } from "@/components/common/knob";
import { MAX_MIX_LEVEL, MIN_MIX_LEVEL } from "@/synth-engine/consts";
import { Volume2 } from "lucide-react";

interface MixerControllerProps {
  volume: number;
  oscillatorMix: number;
  onVolumeChange: (volume: number) => void;
  onOscillatorMixChange: (mix: number) => void;
}

export function MixerController({
  volume,
  oscillatorMix,
  onVolumeChange,
  onOscillatorMixChange,
}: MixerControllerProps) {
  return (
    <div>
      <ControlHeader icon={<Volume2 className="w-4 h-4" />} title="MIXER" />
      <ControlRow>
        <Knob
          value={oscillatorMix}
          min={MIN_MIX_LEVEL}
          max={MAX_MIX_LEVEL}
          step={0.01}
          onChange={onOscillatorMixChange}
          label="OSC MIX"
        />
        <Knob
          value={volume}
          min={MIN_MIX_LEVEL}
          max={MAX_MIX_LEVEL}
          step={0.01}
          onChange={onVolumeChange}
          label="MASTER"
        />
      </ControlRow>
    </div>
  );
}
