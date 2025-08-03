"use client";

import {
  DEFAULT_DETUNE,
  DEFAULT_FILTER_SLOPE,
  DEFAULT_FILTER_TYPE,
  DEFAULT_MIX_LEVEL,
  DEFAULT_OCTAVE,
  DEFAULT_OSC_WAVEFORM,
  DEFAULT_VOICING_MODE,
  MAX_FREQ,
  MAX_OCTAVE,
  MAX_SUSTAIN,
  MIN_ATTACK,
  MIN_DECAY,
  MIN_FREQ,
  MIN_GLIDE,
  MIN_LFO_FILTER_DEPTH,
  MIN_LFO_LEVEL_DEPTH,
  MIN_LFO_PITCH_DEPTH,
  MIN_LFO_RATE,
  MIN_OCTAVE,
  MIN_Q,
  MIN_RELEASE
} from "@/synth-engine/consts";
import { createFilterChain, updateFilterChain } from "@/synth-engine/filter";
import { LfoManager } from "@/synth-engine/lfo";
import { OscillatorManager } from "@/synth-engine/osc";
import type { NoteVoice } from "@/synth-engine/types";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Comprehensive synthesizer state and control interface.
 *
 * This hook manages the audio context, oscillator and filter parameters, envelopes, LFOs, and note playback for a synthesizer.
 * It exposes state variables and setters for all major synthesizer parameters, as well as methods to initialize audio, play/stop notes, and change octaves.
 *
 * @returns An object containing:
 * - State variables for all synthesizer parameters (volume, filter, envelopes, LFOs, oscillators, etc.)
 * - Setter functions for each parameter
 * - Methods: `initAudio`, `playNote`, `stopNote`, `changeOctave`
 * - The current set of active notes
 */
export function useSynthesizer() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const oscillatorsRef = useRef<Map<string, NoteVoice>>(new Map());
  const mainGainNodeRef = useRef<GainNode | null>(null);
  const filterNodesRef = useRef<BiquadFilterNode[]>([]);
  const lfoManagerRef = useRef<LfoManager | null>(null);
  const noteManagerRef = useRef<OscillatorManager | null>(null);
  const isInitializedRef = useRef(false);

  const [volume, setVolume] = useState(DEFAULT_MIX_LEVEL);
  const [filterFrequency, setFilterFrequency] = useState(MAX_FREQ);
  const [filterQ, setFilterQ] = useState(MIN_Q);
  const [filterType, setFilterType] = useState<BiquadFilterType>(DEFAULT_FILTER_TYPE);
  const [filterSlope, setFilterSlope] = useState<12 | 24 | 36 | 48>(DEFAULT_FILTER_SLOPE);
  const [attackTime, setAttackTime] = useState(MIN_ATTACK);
  const [decayTime, setDecayTime] = useState(MIN_DECAY);
  const [sustainLevel, setSustainLevel] = useState(MAX_SUSTAIN);
  const [releaseTime, setReleaseTime] = useState(MIN_RELEASE);

  const [isMonophonic, setIsMonophonic] = useState(DEFAULT_VOICING_MODE);
  const [glideTime, setGlideTime] = useState(MIN_GLIDE);

  const [filterEnvelopeAttack, setFilterEnvelopeAttack] = useState(MIN_ATTACK);
  const [filterEnvelopeDecay, setFilterEnvelopeDecay] = useState(MIN_DECAY);
  const [filterEnvelopeSustain, setFilterEnvelopeSustain] = useState(MAX_SUSTAIN);
  const [filterEnvelopeRelease, setFilterEnvelopeRelease] = useState(MIN_RELEASE);
  const [filterEnvelopeDepth, setFilterEnvelopeDepth] = useState(MIN_FREQ);

  const [lfoRate, setLfoRate] = useState(MIN_LFO_RATE);
  const [lfoWaveform, setLfoWaveform] = useState<OscillatorType>(DEFAULT_OSC_WAVEFORM);
  const [lfoFilterDepth, setLfoFilterDepth] = useState(MIN_LFO_FILTER_DEPTH);
  const [lfoOsc1PitchDepth, setLfoOsc1PitchDepth] = useState(MIN_LFO_PITCH_DEPTH);
  const [lfoOsc2PitchDepth, setLfoOsc2PitchDepth] = useState(MIN_LFO_PITCH_DEPTH);
  const [lfoOsc1LevelDepth, setLfoOsc1LevelDepth] = useState(MIN_LFO_LEVEL_DEPTH);
  const [lfoOsc2LevelDepth, setLfoOsc2LevelDepth] = useState(MIN_LFO_LEVEL_DEPTH);

  const [osc1Waveform, setOsc1Waveform] = useState<OscillatorType>(DEFAULT_OSC_WAVEFORM);
  const [osc1Level, setOsc1Level] = useState(DEFAULT_MIX_LEVEL);
  const [osc1Detune, setOsc1Detune] = useState(DEFAULT_DETUNE);
  const [osc2Waveform, setOsc2Waveform] = useState<OscillatorType>(DEFAULT_OSC_WAVEFORM);
  const [osc2Level, setOsc2Level] = useState(DEFAULT_MIX_LEVEL);
  const [osc2Detune, setOsc2Detune] = useState(DEFAULT_DETUNE);
  const [oscillatorMix, setOscillatorMix] = useState(DEFAULT_MIX_LEVEL);

  const [currentOctave, setCurrentOctave] = useState(DEFAULT_OCTAVE);

  // Initialize the audio context and synthesizer components
  const initAudio = useCallback(async () => {
    // If audio context is already initialized or in the process of being initialized, do nothing
    if (!audioContext && !isInitializedRef.current) {
      try {
        // Create a new AudioContext
        const ctx = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();

        // Check if the context is in a suspended state (e.g., due to user interaction requirements)
        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        // Create a main gain node for volume control
        const mainGainNode = ctx.createGain();
        mainGainNode.gain.setValueAtTime(volume, ctx.currentTime);

        // Connect the main gain node to the audio context destination
        try {
          mainGainNode.connect(ctx.destination);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw error;
        }

        // Set the audio context state
        setAudioContext(ctx);
        mainGainNodeRef.current = mainGainNode;

        // Initialize the filter chain
        filterNodesRef.current = createFilterChain(ctx, filterType, filterFrequency, filterQ);

        // Initialize the LFO manager
        lfoManagerRef.current = new LfoManager(ctx);

        // Initialize the oscillator manager with the audio context, oscillators map, main gain node, and LFO gain nodes
        noteManagerRef.current = new OscillatorManager(
          ctx,
          oscillatorsRef.current,
          mainGainNode,
          lfoManagerRef.current.getGainNodes(),
        );

        isInitializedRef.current = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        throw error;
      }
    }
  }, [audioContext, volume, filterType, filterFrequency, filterQ]);

  // Update the synthesizer state whenever a parameter changes
  useEffect(() => {
    if (noteManagerRef.current) {
      noteManagerRef.current.setSynthState({
        isMonophonic,
        glideTime: glideTime,
        attackTime: attackTime,
        decayTime: decayTime,
        sustainLevel: sustainLevel,
        releaseTime: releaseTime,
        filterEnvelopeAttack: filterEnvelopeAttack,
        filterEnvelopeDecay: filterEnvelopeDecay,
        filterEnvelopeSustain: filterEnvelopeSustain,
        filterEnvelopeRelease: filterEnvelopeRelease,
        filterEnvelopeDepth: filterEnvelopeDepth,
        filterFrequency: filterFrequency,
        filterQ: filterQ,
        filterType,
        filterSlope: 12,
        osc1Waveform,
        osc1Level: osc1Level,
        osc1Detune: osc1Detune,
        osc2Waveform,
        osc2Level: osc2Level,
        osc2Detune: osc2Detune,
        oscillatorMix: oscillatorMix,
      });
    }
  }, [
    isMonophonic,
    glideTime,
    attackTime,
    decayTime,
    sustainLevel,
    releaseTime,
    filterEnvelopeAttack,
    filterEnvelopeDecay,
    filterEnvelopeSustain,
    filterEnvelopeRelease,
    filterEnvelopeDepth,
    filterFrequency,
    filterQ,
    filterType,
    filterSlope,
    osc1Waveform,
    osc1Level,
    osc1Detune,
    osc2Waveform,
    osc2Level,
    osc2Detune,
    oscillatorMix,
  ]);

  // Update the filter chain whenever filter parameters change
  useEffect(() => {
    // Ensure audio context and filter nodes are available before updating the filter chain
    if (audioContext && filterNodesRef.current.length > 0) {
      const dummyGainNode = audioContext.createGain();

      updateFilterChain(
        audioContext,
        filterNodesRef.current,
        filterType,
        filterFrequency,
        filterQ,
        12,
        lfoManagerRef.current?.getGainNodes() || {
          filter: null,
          osc1Pitch: null,
          osc2Pitch: null,
          osc1Level: null,
          osc2Level: null,
        },
        dummyGainNode,
      );
    }
  }, [audioContext, filterFrequency, filterQ, filterType, filterSlope]);

  // Update the main gain node whenever the volume changes
  useEffect(() => {
    // Ensure audio context and main gain node are available before updating volume
    if (mainGainNodeRef.current && audioContext) {
      const now = audioContext.currentTime;
      mainGainNodeRef.current.gain.cancelScheduledValues(now);
      mainGainNodeRef.current.gain.setValueAtTime(volume, now);
    }
  }, [volume, audioContext]);

  // Initialize or update the LFO manager whenever LFO parameters change
  useEffect(() => {
    // Ensure audio context and LFO manager are available before initializing or updating
    if (lfoManagerRef.current && audioContext) {
      if (!lfoManagerRef.current.isRunning()) {
        lfoManagerRef.current.init(
          lfoRate,
          lfoWaveform,
          lfoFilterDepth,
          lfoOsc1PitchDepth,
          lfoOsc2PitchDepth,
          lfoOsc1LevelDepth,
          lfoOsc2LevelDepth,
        );
      } else {
        lfoManagerRef.current.update(
          lfoRate,
          lfoWaveform,
          lfoFilterDepth,
          lfoOsc1PitchDepth,
          lfoOsc2PitchDepth,
          lfoOsc1LevelDepth,
          lfoOsc2LevelDepth,
        );
      }
    }
  }, [
    audioContext,
    lfoRate,
    lfoWaveform,
    lfoFilterDepth,
    lfoOsc1PitchDepth,
    lfoOsc2PitchDepth,
    lfoOsc1LevelDepth,
    lfoOsc2LevelDepth,
  ]);

  // Update active notes parameters whenever oscillator parameters change
  useEffect(() => {
    if (noteManagerRef.current) {
      noteManagerRef.current.updateActiveNotesParameters();
    }
  }, [osc1Level, osc1Detune, osc1Waveform, osc2Level, osc2Detune, osc2Waveform, oscillatorMix]);

  // Update active notes filter parameters whenever filter parameters change
  useEffect(() => {
    if (noteManagerRef.current) {
      noteManagerRef.current.updateActiveNotesFilterParameters();
    }
  }, [filterFrequency, filterQ, filterType, filterSlope, filterEnvelopeDepth]);

  // Update active notes envelope parameters whenever envelope parameters change
  useEffect(() => {
    if (noteManagerRef.current) {
      noteManagerRef.current.updateActiveNotesEnvelopeParameters();
    }
  }, [sustainLevel]);

  /**
   * Plays the specified musical note using the note manager and updates the active notes state.
   *
   * @param note - The name or identifier of the note to play (e.g., "C4", "G#3").
   */
  const playNote = useCallback((note: string) => {
    if (noteManagerRef.current) {
      const newActiveNotes = noteManagerRef.current.playNote(note);
      setActiveNotes(newActiveNotes);
    }
  }, []);

  /**
   * Stops the playback of a specified note.
   *
   * This function interacts with the current note manager to stop the given note,
   * updates the list of active notes accordingly, and triggers a state update.
   *
   * @param note - The identifier (e.g., note name or MIDI value) of the note to stop.
   */
  const stopNote = useCallback((note: string) => {
    if (noteManagerRef.current) {
      const newActiveNotes = noteManagerRef.current.stopNote(note);
      setActiveNotes(newActiveNotes);
    }
  }, []);

  /**
   * Changes the current octave by a specified delta, ensuring the new octave
   * stays within the allowed range defined by MIN_OCTAVE and MAX_OCTAVE.
   *
   * @param delta - The amount to change the octave by; must be either -1 (decrement) or 1 (increment).
   */
  const changeOctave = useCallback((delta: -1 | 1) => {
    setCurrentOctave((prevOctave) => {
      const newOctave = Math.max(MIN_OCTAVE, Math.min(MAX_OCTAVE, prevOctave + delta));
      return newOctave;
    });
  }, []);

  /**
   * Sets the filter type for the synthesizer after validating the provided type.
   *
   * @param type - The desired filter type, specified as a `BiquadFilterType`.
   */
  const setValidatedFilterType = useCallback((type: BiquadFilterType) => {
    setFilterType(type);
  }, []);

  // Cleanup function to stop all notes and close the audio context when the component unmounts
  useEffect(() => {
    return () => {
      if (noteManagerRef.current) {
        noteManagerRef.current.cleanup();
      }
      if (lfoManagerRef.current) {
        lfoManagerRef.current.stop();
      }
      if (audioContext) {
        audioContext.close().catch(console.error);
      }
    };
  }, [audioContext]);

  return {
    volume,
    filterFrequency,
    filterQ,
    filterType,
    filterSlope,
    attackTime,
    decayTime,
    sustainLevel,
    releaseTime,
    activeNotes,
    isMonophonic,
    glideTime,
    filterEnvelopeAttack,
    filterEnvelopeDecay,
    filterEnvelopeSustain,
    filterEnvelopeRelease,
    filterEnvelopeDepth,
    lfoRate,
    lfoWaveform,
    lfoFilterDepth,
    lfoOsc1PitchDepth,
    lfoOsc2PitchDepth,
    lfoOsc1LevelDepth,
    lfoOsc2LevelDepth,
    osc1Waveform,
    osc1Level,
    osc1Detune,
    osc2Waveform,
    osc2Level,
    osc2Detune,
    oscillatorMix,
    currentOctave,
    setVolume,
    setFilterFrequency,
    setFilterQ,
    setFilterType: setValidatedFilterType,
    setFilterSlope,
    setAttackTime,
    setDecayTime,
    setSustainLevel,
    setReleaseTime,
    setIsMonophonic,
    setGlideTime,
    setFilterEnvelopeAttack,
    setFilterEnvelopeDecay,
    setFilterEnvelopeSustain,
    setFilterEnvelopeRelease,
    setFilterEnvelopeDepth,
    setLfoRate,
    setLfoWaveform,
    setLfoFilterDepth,
    setLfoOsc1PitchDepth,
    setLfoOsc2PitchDepth,
    setLfoOsc1LevelDepth,
    setLfoOsc2LevelDepth,
    setOsc1Waveform,
    setOsc1Level,
    setOsc1Detune,
    setOsc2Waveform,
    setOsc2Level,
    setOsc2Detune,
    setOscillatorMix,
    initAudio,
    playNote,
    stopNote,
    changeOctave,
  };
}
