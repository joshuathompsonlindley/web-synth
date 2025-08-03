"use client";

import { MidiController } from "@/components/synth-controls/midi-control";

interface MidiModuleProps {
  midiEnabled: boolean;
  midiInputs: string[];
  selectedMidiInput: string | null;
  onMidiEnabledChange: (enabled: boolean) => void;
  onMidiInputChange: (input: string) => void;
}

export function MidiModule({
  midiEnabled,
  midiInputs,
  selectedMidiInput,
  onMidiEnabledChange,
  onMidiInputChange,
}: MidiModuleProps) {
  return (
    <div className="flex flex-col gap-6">
      <MidiController
        midiEnabled={midiEnabled}
        midiInputs={midiInputs}
        selectedMidiInput={selectedMidiInput}
        onMidiEnabledChange={onMidiEnabledChange}
        onMidiInputChange={onMidiInputChange}
      />
    </div>
  );
}
