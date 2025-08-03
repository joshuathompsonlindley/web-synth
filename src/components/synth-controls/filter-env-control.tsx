"use client";

import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { Knob } from "@/components/common/knob";
import {
  MAX_ATTACK,
  MAX_DECAY,
  MAX_FREQ,
  MAX_RELEASE,
  MAX_SUSTAIN,
  MIN_ATTACK,
  MIN_DECAY,
  MIN_FREQ,
  MIN_RELEASE,
  MIN_SUSTAIN,
} from "@/synth-engine/consts";
import { Activity } from "lucide-react";

interface FilterEnvelopeControllerProps {
  filterEnvelopeAttack: number;
  filterEnvelopeDecay: number;
  filterEnvelopeSustain: number;
  filterEnvelopeRelease: number;
  filterEnvelopeDepth: number;
  onFilterEnvelopeAttackChange: (attack: number) => void;
  onFilterEnvelopeDecayChange: (decay: number) => void;
  onFilterEnvelopeSustainChange: (sustain: number) => void;
  onFilterEnvelopeReleaseChange: (release: number) => void;
  onFilterEnvelopeDepthChange: (depth: number) => void;
}

export function FilterEnvelopeController({
  filterEnvelopeAttack,
  filterEnvelopeDecay,
  filterEnvelopeSustain,
  filterEnvelopeRelease,
  filterEnvelopeDepth,
  onFilterEnvelopeAttackChange,
  onFilterEnvelopeDecayChange,
  onFilterEnvelopeSustainChange,
  onFilterEnvelopeReleaseChange,
  onFilterEnvelopeDepthChange,
}: FilterEnvelopeControllerProps) {
  return (
    <div>
      <ControlHeader icon={<Activity className="w-4 h-4" />} title="ENVELOPE" />
      <ControlRow>
        <Knob
          value={filterEnvelopeAttack}
          min={MIN_ATTACK}
          max={MAX_ATTACK}
          step={0.01}
          label="ATTACK"
          unit="s"
          onChange={onFilterEnvelopeAttackChange}
        />
        <Knob
          value={filterEnvelopeDecay}
          min={MIN_DECAY}
          max={MAX_DECAY}
          step={0.01}
          label="DECAY"
          unit="s"
          onChange={onFilterEnvelopeDecayChange}
        />
        <Knob
          value={filterEnvelopeSustain}
          min={MIN_SUSTAIN}
          max={MAX_SUSTAIN}
          step={0.01}
          label="SUSTAIN"
          unit="s"
          onChange={onFilterEnvelopeSustainChange}
        />
        <Knob
          value={filterEnvelopeRelease}
          min={MIN_RELEASE}
          max={MAX_RELEASE}
          step={0.01}
          label="RELEASE"
          unit="s"
          onChange={onFilterEnvelopeReleaseChange}
        />
        <Knob
          value={filterEnvelopeDepth}
          min={MIN_FREQ}
          max={MAX_FREQ}
          step={10}
          label="DEPTH"
          unit="Hz"
          onChange={onFilterEnvelopeDepthChange}
        />
      </ControlRow>
    </div>
  );
}
