import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { Knob } from "@/components/common/knob";
import {
  MAX_LFO_FILTER_DEPTH,
  MAX_LFO_LEVEL_DEPTH,
  MAX_LFO_PITCH_DEPTH,
  MIN_LFO_FILTER_DEPTH,
  MIN_LFO_LEVEL_DEPTH,
  MIN_LFO_PITCH_DEPTH,
} from "@/synth-engine/consts";
import { Target } from "lucide-react";

interface LfoTargetControllerProps {
  lfoFilterDepth: number;
  lfoOsc1PitchDepth: number;
  lfoOsc2PitchDepth: number;
  lfoOsc1LevelDepth: number;
  lfoOsc2LevelDepth: number;
  onLfoFilterDepthChange: (depth: number) => void;
  onLfoOsc1PitchDepthChange: (depth: number) => void;
  onLfoOsc2PitchDepthChange: (depth: number) => void;
  onLfoOsc1LevelDepthChange: (depth: number) => void;
  onLfoOsc2LevelDepthChange: (depth: number) => void;
}

export function LfoTargetController({
  lfoFilterDepth,
  lfoOsc1PitchDepth,
  lfoOsc2PitchDepth,
  lfoOsc1LevelDepth,
  lfoOsc2LevelDepth,
  onLfoFilterDepthChange,
  onLfoOsc1PitchDepthChange,
  onLfoOsc2PitchDepthChange,
  onLfoOsc1LevelDepthChange,
  onLfoOsc2LevelDepthChange,
}: LfoTargetControllerProps) {
  return (
    <div>
      <ControlHeader icon={<Target className="h-4 w-4" />} title="MATRIX" />
      <ControlRow>
        <Knob
          value={lfoFilterDepth}
          min={MIN_LFO_FILTER_DEPTH}
          max={MAX_LFO_FILTER_DEPTH}
          step={10}
          label="FILTER"
          unit="Hz"
          onChange={onLfoFilterDepthChange}
        />
        <Knob
          value={lfoOsc1PitchDepth}
          min={MIN_LFO_PITCH_DEPTH}
          max={MAX_LFO_PITCH_DEPTH}
          step={1}
          label="OSC1 PITCH"
          unit="ct"
          onChange={onLfoOsc1PitchDepthChange}
        />
        <Knob
          value={lfoOsc2PitchDepth}
          min={MIN_LFO_PITCH_DEPTH}
          max={MAX_LFO_PITCH_DEPTH}
          step={1}
          label="OSC2 PITCH"
          unit="ct"
          onChange={onLfoOsc2PitchDepthChange}
        />
        <Knob
          value={lfoOsc1LevelDepth}
          min={MIN_LFO_LEVEL_DEPTH}
          max={MAX_LFO_LEVEL_DEPTH}
          step={0.01}
          label="OSC1 LEVEL"
          onChange={onLfoOsc1LevelDepthChange}
        />
        <Knob
          value={lfoOsc2LevelDepth}
          min={MIN_LFO_LEVEL_DEPTH}
          max={MAX_LFO_LEVEL_DEPTH}
          step={0.01}
          label="OSC2 LEVEL"
          onChange={onLfoOsc2LevelDepthChange}
        />
      </ControlRow>
    </div>
  );
}
