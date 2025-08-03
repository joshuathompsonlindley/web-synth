"use client";

import { useEffect } from "react";

interface UseKeyboardProps {
  onNoteStart: (note: string) => void;
  onNoteStop: (note: string) => void;
  initAudio: () => void;
  currentOctave: number;
  changeOctave: (delta: -1 | 1) => void;
}

const keyboardMap: { [key: string]: string } = {
  a: "C",
  w: "C#",
  s: "D",
  e: "D#",
  d: "E",
  f: "F",
  t: "F#",
  g: "G",
  y: "G#",
  h: "A",
  u: "A#",
  j: "B",
};

/**
 * Hook for handling keyboard input to the synthesizer.
 *
 * This hook listens for keyboard events to trigger note start/stop actions,
 * octave changes, and manages the UI state of pressed keys.
 *
 * - Pressing "z" decreases the octave.
 * - Pressing "x" increases the octave.
 * - Pressing mapped keys triggers note start/stop events.
 *
 * @param onNoteStart - Callback invoked when a note should start playing. Receives the full note name (e.g., "C4").
 * @param onNoteStop - Callback invoked when a note should stop playing. Receives the full note name.
 * @param initAudio - Callback to initialize audio context or resources before playing a note.
 * @param currentOctave - The current octave number used to construct full note names.
 * @param changeOctave - Callback to change the current octave. Receives a delta (e.g., -1 or 1).
 */
export function useKeyboard({ onNoteStart, onNoteStop, initAudio, currentOctave, changeOctave }: UseKeyboardProps) {
  useEffect(() => {
    // Handle keydown and keyup events for note start/stop and octave changes
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "z" && !event.repeat) {
        changeOctave(-1);
        return;
      }
      if (event.key.toLowerCase() === "x" && !event.repeat) {
        changeOctave(1);
        return;
      }

      // Check if the key corresponds to a note in the keyboard map
      const baseNoteName = keyboardMap[event.key.toLowerCase()];

      // If a valid note is pressed and it's not a repeat, initialize audio and start the note
      if (baseNoteName && !event.repeat) {
        initAudio();
        const fullNote = `${baseNoteName}${currentOctave}`;
        onNoteStart(fullNote);
      }
    };

    // Handle keyup events to stop the note
    const handleKeyUp = (event: KeyboardEvent) => {
      const baseNoteName = keyboardMap[event.key.toLowerCase()];

      // If a valid note is released, stop the note
      if (baseNoteName) {
        const fullNote = `${baseNoteName}${currentOctave}`;
        onNoteStop(fullNote);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onNoteStart, onNoteStop, initAudio, currentOctave, changeOctave]);
}
