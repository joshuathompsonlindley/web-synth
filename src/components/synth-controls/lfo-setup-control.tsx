import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { Knob } from "@/components/common/knob";
import { ToggleButton, ToggleButtonGroup } from "@/components/common/toggle-button";
import { SawWave } from "@/components/icons/saw-wave";
import { SineWave } from "@/components/icons/sine-wave";
import { SquareWave } from "@/components/icons/square-wave";
import { TriangleWave } from "@/components/icons/triangle-wave";
import { MAX_LFO_RATE, MIN_LFO_RATE } from "@/synth-engine/consts";
import { Radio } from "lucide-react";

interface LfoSetupControllerProps {
  lfoRate: number;
  lfoWaveform: OscillatorType;
  onLfoRateChange: (rate: number) => void;
  onLfoWaveformChange: (waveform: OscillatorType) => void;
}

export function LfoSetupController({
  lfoRate,
  lfoWaveform,
  onLfoWaveformChange,
  onLfoRateChange,
}: LfoSetupControllerProps) {
  return (
    <div>
      <ControlHeader icon={<Radio className="w-4 h-4" />} title="LFO" />
      <ControlRow>
        <ToggleButtonGroup title="WAVEFORM">
          <ToggleButton
            enabled={lfoWaveform === "sine"}
            onClick={() => onLfoWaveformChange("sine")}
            icon={<SineWave className="w-4 h-4" />}
          />
          <ToggleButton
            enabled={lfoWaveform === "square"}
            onClick={() => onLfoWaveformChange("square")}
            icon={<SquareWave className="w-4 h-4" />}
          />
          <ToggleButton
            enabled={lfoWaveform === "sawtooth"}
            onClick={() => onLfoWaveformChange("sawtooth")}
            icon={<SawWave className="w-4 h-4 rotate-90" />}
          />
          <ToggleButton
            enabled={lfoWaveform === "triangle"}
            onClick={() => onLfoWaveformChange("triangle")}
            icon={<TriangleWave className="w-4 h-4" />}
          />
        </ToggleButtonGroup>
        <Knob
          value={lfoRate}
          min={MIN_LFO_RATE}
          max={MAX_LFO_RATE}
          step={0.1}
          label="RATE"
          unit="Hz"
          onChange={onLfoRateChange}
        />
      </ControlRow>
    </div>
  );
}
