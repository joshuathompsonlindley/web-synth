"use client";

import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { Knob } from "@/components/common/knob";
import { ToggleButton, ToggleButtonGroup } from "@/components/common/toggle-button";
import { MAX_DETUNE, MAX_MIX_LEVEL, MIN_DETUNE, MIN_MIX_LEVEL } from "@/synth-engine/consts";
import { Square, Triangle, Waves } from "lucide-react";

interface OsciallatorControllerProps {
  waveform: OscillatorType;
  oscNumber: number;
  level: number;
  detune: number;
  onWaveformChange: (waveform: OscillatorType) => void;
  onLevelChange: (level: number) => void;
  onDetuneChange: (detune: number) => void;
}

export function OsciallatorController({
  waveform,
  oscNumber,
  level,
  detune,
  onWaveformChange,
  onLevelChange,
  onDetuneChange,
}: OsciallatorControllerProps) {
  return (
    <div>
      <ControlHeader
        icon={<span className="text-white text-xs font-bold">{oscNumber}</span>}
        title={`OSC ${oscNumber}`}
      />
      <ControlRow>
        <ToggleButtonGroup title="WAVEFORM">
          <ToggleButton
            enabled={waveform === "sine"}
            onClick={() => onWaveformChange("sine")}
            icon={<Waves className="w-4 h-4" />}
          />
          <ToggleButton
            enabled={waveform === "square"}
            onClick={() => onWaveformChange("square")}
            icon={<Square className="w-4 h-4" />}
          />
          <ToggleButton
            enabled={waveform === "sawtooth"}
            onClick={() => onWaveformChange("sawtooth")}
            icon={<Triangle className="w-4 h-4 rotate-90" />}
          />
          <ToggleButton
            enabled={waveform === "triangle"}
            onClick={() => onWaveformChange("triangle")}
            icon={<Triangle className="w-4 h-4" />}
          />
        </ToggleButtonGroup>
        <Knob
          value={level}
          min={MIN_MIX_LEVEL}
          max={MAX_MIX_LEVEL}
          step={0.01}
          label="LEVEL"
          onChange={onLevelChange}
        />
        <Knob
          value={detune}
          min={MIN_DETUNE}
          max={MAX_DETUNE}
          step={0.01}
          label="DETUNE"
          unit="st"
          onChange={onDetuneChange}
        />
      </ControlRow>
    </div>
  );
}
