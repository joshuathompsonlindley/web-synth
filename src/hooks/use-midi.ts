"use client";

import { useCallback, useEffect, useState } from "react";

interface UseMidiProps {
  onNoteStart: (note: string) => void;
  onNoteStop: (note: string) => void;
  initAudio: () => void;
}

const semitoneOffsetToNoteName: { [key: number]: string } = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B",
};

/**
 * Converts a MIDI note number to its corresponding note name with octave.
 *
 * @param midiNumber - The MIDI note number (0-127).
 * @returns The note name with octave (e.g., "C4") if the input is valid, or `null` if the MIDI number is out of range or invalid.
 */
function getNoteNameFromMidiNumber(midiNumber: number): string | null {
  if (midiNumber < 0 || midiNumber > 127) {
    return null; // MIDI notes are 0-127
  }

  // MIDI C0 is note 12, so octave 0. C4 is 60, so octave 4.
  const octave = Math.floor(midiNumber / 12) - 1;
  const semitone = midiNumber % 12;

  const noteName = semitoneOffsetToNoteName[semitone];
  if (noteName === undefined) {
    return null; // Should not happen with valid MIDI numbers
  }

  return `${noteName}${octave}`;
}

/**
 * MIDI hook.
 *
 * This hook manages MIDI device detection, selection, and message handling.
 * It enables MIDI support, tracks available devices, and listens for note-on and note-off events.
 *
 * @param onNoteStart - Callback invoked when a MIDI note-on event is received.
 * @param onNoteStop - Callback invoked when a MIDI note-off event is received.
 * @param initAudio - Callback to initialize audio context or related resources before handling MIDI events.
 *
 * @returns An object with the following properties:
 * - `midiEnabled`: Whether MIDI is enabled and available.
 * - `midiDevices`: Array of available MIDI input device names.
 * - `selectedMidiInput`: The currently selected MIDI input device name, or `null` if none is selected.
 * - `setSelectedMidiInput`: Setter function to change the selected MIDI input device.
 * - `setMidiEnabled`: Setter function to manually enable or disable MIDI.
 */
export function useMidi({ onNoteStart, onNoteStop, initAudio }: UseMidiProps) {
  const [midiEnabled, setMidiEnabled] = useState(false);
  const [midiDevices, setMidiDevices] = useState<string[]>([]);
  const [selectedMidiInput, setSelectedMidiInput] = useState<string | null>(null);

  // Callback to handle incoming MIDI messages
  const handleMidiMessage = useCallback(
    (event: MIDIMessageEvent) => {
      if (!event.data || event.data.length < 3) return; // Invalid MIDI message
      
      const [status, midiNote, velocity] = event.data;
      const noteName = getNoteNameFromMidiNumber(midiNote);

      if (!noteName) return;

      // Handle note-on (0x90) and note-off (0x80) messages
      if (status === 0x90 && velocity > 0) {
        initAudio();
        onNoteStart(noteName);
      } else if (status === 0x80 || (status === 0x90 && velocity === 0)) {
        onNoteStop(noteName);
      }
    },
    [onNoteStart, onNoteStop, initAudio],
  );

  // Effect to request MIDI access and set up device listeners
  useEffect(() => {
    try {
      if (!navigator.requestMIDIAccess({ sysex: false })) {
        return;
      }
    catch (error) {
      console.log("MIDI not supported");
      return;
    }

    let midiAccess: MIDIAccess | null = null;

    // Callback for successful MIDI access
    const onMIDISuccess = (access: MIDIAccess) => {
      midiAccess = access;
      setMidiEnabled(true);

      // Update devices and set up listeners
      const updateDevices = () => {
        const inputs: string[] = [];
        let currentSelectedStillExists = false;

        for (const input of midiAccess!.inputs.values()) {
          inputs.push(input.name || `Unnamed MIDI Input ${input.id}`);
          input.onmidimessage = handleMidiMessage;

          // Check if the currently selected MIDI input still exists
          if (selectedMidiInput && input.name === selectedMidiInput) {
            currentSelectedStillExists = true;
          }
        }

        setMidiDevices(inputs);

        // If the currently selected MIDI input no longer exists, select the first available input
        if (!currentSelectedStillExists && inputs.length > 0) {
          setSelectedMidiInput(inputs[0]);
        } else if (inputs.length === 0) {
          setSelectedMidiInput(null);
        }
      };

      // Initial device update
      midiAccess.onstatechange = () => {
        updateDevices();
      };

      updateDevices();
    };

    // Callback for failed MIDI access
    const onMIDIFailure = () => {
      setMidiEnabled(false);
      setMidiDevices([]);
      setSelectedMidiInput(null);
    };

    // Request MIDI access
    navigator.requestMIDIAccess({ sysex: false }).then(onMIDISuccess, onMIDIFailure);

    // Cleanup function to remove listeners and reset state
    return () => {
      if (midiAccess) {
        midiAccess.onstatechange = null;

        for (const input of midiAccess.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, [handleMidiMessage, selectedMidiInput]);

  return {
    midiEnabled,
    midiDevices,
    selectedMidiInput,
    setSelectedMidiInput,
    setMidiEnabled,
  };
}
