"use client";

import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { Knob } from "@/components/common/knob";
import { ToggleButton, ToggleButtonGroup } from "@/components/common/toggle-button";
import { MAX_GLIDE, MIN_GLIDE } from "@/synth-engine/consts";
import { User, Users } from "lucide-react";

interface VoiceControllerProps {
  isMonophonic: boolean;
  glideTime: number;
  onMonophonicChange: (mono: boolean) => void;
  onGlideTimeChange: (time: number) => void;
}

export function VoiceController({
  isMonophonic,
  glideTime,
  onMonophonicChange,
  onGlideTimeChange,
}: VoiceControllerProps) {
  return (
    <div>
      <ControlHeader icon={<Users className="w-4 h-4" />} title="VOICING" />
      <ControlRow>
        <ToggleButtonGroup title="POLYPHONY">
          <ToggleButton
            enabled={!isMonophonic}
            onClick={() => onMonophonicChange(false)}
            icon={<Users className="w-4 h-4" />}
          />
          <ToggleButton
            enabled={isMonophonic}
            onClick={() => onMonophonicChange(true)}
            icon={<User className="w-4 h-4" />}
          />
        </ToggleButtonGroup>
        <Knob
          value={glideTime}
          min={MIN_GLIDE}
          max={MAX_GLIDE}
          step={0.01}
          label="GLIDE"
          unit="s"
          onChange={onGlideTimeChange}
          disabled={!isMonophonic}
        />
      </ControlRow>
    </div>
  );
}
