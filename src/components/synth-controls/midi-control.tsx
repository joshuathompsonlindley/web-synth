import { ControlHeader } from "@/components/common/control-header";
import { ControlRow } from "@/components/common/control-row";
import { PowerButton } from "@/components/common/power-button";
import { ToggleButtonGroup } from "@/components/common/toggle-button";
import { PianoIcon } from "lucide-react";

interface MidiControllerProps {
  midiEnabled: boolean;
  midiInputs: string[];
  selectedMidiInput: string | null;
  onMidiEnabledChange: (enabled: boolean) => void;
  onMidiInputChange: (input: string) => void;
}

export function MidiController({
  midiEnabled,
  midiInputs,
  selectedMidiInput,
  onMidiEnabledChange,
  onMidiInputChange,
}: MidiControllerProps) {
  return (
    <div>
      <ControlHeader icon={<PianoIcon className="h-4 w-4" />} title="MIDI SETUP" />
      <ControlRow>
        <ToggleButtonGroup title="ENABLED">
          <PowerButton enabled={midiEnabled} onClick={() => onMidiEnabledChange(!midiEnabled)} />
        </ToggleButtonGroup>
        <div className="w-full mb-4">
          <label htmlFor="midi-input" className="block text-xs font-bold text-slate-200 mb-2 tracking-wider">
            DEVICES
          </label>
          <select
            id="midi-input"
            value={selectedMidiInput || ""}
            onChange={(e) => onMidiInputChange(e.target.value)}
            className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white text-sm focus:ring-white/40 focus:border-white/40"
            disabled={!midiEnabled || midiInputs.length === 0}
          >
            <option value="">{midiInputs.length > 0 ? "Select a device" : "No devices found"}</option>
            {midiInputs.map((input) => (
              <option key={input} value={input}>
                {input}
              </option>
            ))}
          </select>
        </div>
      </ControlRow>
    </div>
  );
}
