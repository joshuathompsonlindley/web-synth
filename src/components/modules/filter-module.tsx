"use client";

import { FilterController } from "@/components/synth-controls/filter-control";
import { FilterEnvelopeController } from "@/components/synth-controls/filter-env-control";

interface FilterModuleProps {
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
  filterType: BiquadFilterType;
  filterFrequency: number;
  filterQ: number;
  filterSlope: 12 | 24 | 36 | 48;
  onFilterTypeChange: (type: BiquadFilterType) => void;
  onFilterFrequencyChange: (freq: number) => void;
  onFilterQChange: (q: number) => void;
  onFilterSlopeChange: (slope: 12 | 24 | 36 | 48) => void;
}

export function FilterModule({
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
  filterType,
  filterFrequency,
  filterQ,
  filterSlope,
  onFilterTypeChange,
  onFilterFrequencyChange,
  onFilterQChange,
  onFilterSlopeChange,
}: FilterModuleProps) {
  return (
    <div className="flex flex-col gap-6">
      <FilterController
        filterFrequency={filterFrequency}
        filterQ={filterQ}
        filterType={filterType}
        filterSlope={filterSlope}
        onFilterFrequencyChange={onFilterFrequencyChange}
        onFilterQChange={onFilterQChange}
        onFilterTypeChange={onFilterTypeChange}
        onFilterSlopeChange={onFilterSlopeChange}
      />
      <FilterEnvelopeController
        filterEnvelopeAttack={filterEnvelopeAttack}
        filterEnvelopeDecay={filterEnvelopeDecay}
        filterEnvelopeSustain={filterEnvelopeSustain}
        filterEnvelopeRelease={filterEnvelopeRelease}
        filterEnvelopeDepth={filterEnvelopeDepth}
        onFilterEnvelopeAttackChange={onFilterEnvelopeAttackChange}
        onFilterEnvelopeDecayChange={onFilterEnvelopeDecayChange}
        onFilterEnvelopeSustainChange={onFilterEnvelopeSustainChange}
        onFilterEnvelopeReleaseChange={onFilterEnvelopeReleaseChange}
        onFilterEnvelopeDepthChange={onFilterEnvelopeDepthChange}
      />
    </div>
  );
}
