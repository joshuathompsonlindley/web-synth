"use client";

import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { Knob } from "@/components/common/knob";
import { ToggleButton, ToggleButtonGroup } from "@/components/common/toggle-button";
import { HighPass } from "@/components/icons/high-pass";
import { LowPass } from "@/components/icons/low-pass";
import { MAX_FREQ, MAX_Q, MIN_FREQ, MIN_Q } from "@/synth-engine/consts";
import { Filter } from "lucide-react";

interface FilterControllerProps {
  filterType: BiquadFilterType;
  filterFrequency: number;
  filterQ: number;
  filterSlope: 12 | 24 | 36 | 48;
  onFilterTypeChange: (type: BiquadFilterType) => void;
  onFilterFrequencyChange: (freq: number) => void;
  onFilterQChange: (q: number) => void;
  onFilterSlopeChange: (slope: 12 | 24 | 36 | 48) => void;
}

export function FilterController({
  filterType,
  filterFrequency,
  filterQ,
  filterSlope,
  onFilterTypeChange,
  onFilterFrequencyChange,
  onFilterQChange,
  onFilterSlopeChange,
}: FilterControllerProps) {
  return (
    <div>
      <ControlHeader icon={<Filter className="w-4 h-4" />} title="FILTER" />
      <ControlRow>
        <ToggleButtonGroup title="TYPE">
          <ToggleButton
            enabled={filterType == "lowpass"}
            onClick={() => onFilterTypeChange("lowpass")}
            icon={<LowPass className="w-4 h-4" />}
          />
          <ToggleButton
            enabled={filterType == "highpass"}
            onClick={() => onFilterTypeChange("highpass")}
            icon={<HighPass className="w-4 h-4" />}
          />
        </ToggleButtonGroup>
        <ToggleButtonGroup title="SLOPE">
          {[12, 24, 36, 48].map((slope) => (
            <ToggleButton
              key={slope}
              enabled={filterSlope === slope}
              onClick={() => onFilterSlopeChange(slope as 12 | 24 | 36 | 48)}
              icon={<span className="text-xs font-bold">{slope}db</span>}
            />
          ))}
        </ToggleButtonGroup>
        <Knob
          value={filterFrequency}
          min={MIN_FREQ}
          max={MAX_FREQ}
          step={10}
          label="CUTOFF"
          unit="Hz"
          onChange={onFilterFrequencyChange}
        />
        <Knob
          value={filterQ}
          min={MIN_Q}
          max={MAX_Q}
          step={0.1}
          unit="db"
          label="RESONANCE"
          onChange={onFilterQChange}
        />
      </ControlRow>
    </div>
  );
}
