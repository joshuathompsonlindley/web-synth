"use client";

import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { Knob } from "@/components/common/knob";
import {
  MAX_ATTACK,
  MAX_DECAY,
  MAX_RELEASE,
  MAX_SUSTAIN,
  MIN_ATTACK,
  MIN_DECAY,
  MIN_RELEASE,
  MIN_SUSTAIN,
} from "@/synth-engine/consts";
import { Activity } from "lucide-react";

interface AmplitudeControllerProps {
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
  onAttackChange: (value: number) => void;
  onDecayChange: (value: number) => void;
  onSustainChange: (value: number) => void;
  onReleaseChange: (value: number) => void;
}

export function AmplitudeController({
  attackTime,
  decayTime,
  sustainLevel,
  releaseTime,
  onAttackChange,
  onDecayChange,
  onSustainChange,
  onReleaseChange,
}: AmplitudeControllerProps) {
  return (
    <div>
      <ControlHeader icon={<Activity className="w-4 h-4" />} title="AMP ENVELOPE" />
      <ControlRow>
        <Knob
          value={attackTime}
          min={MIN_ATTACK}
          max={MAX_ATTACK}
          step={0.01}
          label="ATTACK"
          unit="s"
          onChange={onAttackChange}
        />
        <Knob
          value={decayTime}
          min={MIN_DECAY}
          max={MAX_DECAY}
          step={0.01}
          label="DECAY"
          unit="s"
          onChange={onDecayChange}
        />
        <Knob
          value={sustainLevel}
          min={MIN_SUSTAIN}
          max={MAX_SUSTAIN}
          step={0.01}
          label="SUSTAIN"
          unit="s"
          onChange={onSustainChange}
        />
        <Knob
          value={releaseTime}
          min={MIN_RELEASE}
          max={MAX_RELEASE}
          step={0.01}
          label="RELEASE"
          unit="s"
          onChange={onReleaseChange}
        />
      </ControlRow>
    </div>
  );
}
