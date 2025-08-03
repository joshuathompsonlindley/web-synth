import {
  DEFAULT_FILTER_SLOPE,
  DEFAULT_FILTER_TYPE,
  DEFAULT_MIX_LEVEL,
  DEFAULT_OSC_WAVEFORM,
  DEFAULT_VOICING_MODE,
  MAX_FREQ,
  MAX_SUSTAIN,
  MIN_ATTACK,
  MIN_DECAY,
  MIN_DETUNE,
  MIN_FREQ,
  MIN_GLIDE,
  MIN_Q,
  MIN_RELEASE,
} from "@/synth-engine/consts";
import { connectLfoToFilters, createFilterChain } from "@/synth-engine/filter";
import type { LfoGainNodes, NoteVoice } from "@/synth-engine/types";

export class OscillatorManager {
  // The AudioContext used for audio processing.
  private audioContext: AudioContext;

  // A map of active note voices, keyed by note identifier.
  private oscillatorsRef: Map<string, NoteVoice>;

  // The destination AudioNode for the oscillator's output and lfo gain nodes.
  private outputNode: AudioNode;
  private lfoGainNodes: LfoGainNodes;

  // The currently active note reference for monophonic mode and glide functionality.
  private currentNoteRef: string | null = null;
  private glideTimeoutRef: NodeJS.Timeout | null = null;

  // Synthesizer parameters with default values.
  private isMonophonic = DEFAULT_VOICING_MODE;
  private glideTime = MIN_GLIDE;
  private attackTime = MIN_ATTACK;
  private decayTime = MIN_DECAY;
  private sustainLevel = MAX_SUSTAIN;
  private releaseTime = MIN_RELEASE;
  private filterEnvelopeAttack = MIN_ATTACK;
  private filterEnvelopeDecay = MIN_DECAY;
  private filterEnvelopeSustain = MAX_SUSTAIN;
  private filterEnvelopeRelease = MIN_RELEASE;
  private filterEnvelopeDepth = MIN_FREQ;
  private filterFrequency = MAX_FREQ;
  private filterQ = MIN_Q;
  private filterType: BiquadFilterType = DEFAULT_FILTER_TYPE;
  private filterSlope: 12 | 24 | 36 | 48 = DEFAULT_FILTER_SLOPE;
  private osc1Waveform: OscillatorType = DEFAULT_OSC_WAVEFORM;
  private osc1Level = DEFAULT_MIX_LEVEL;
  private osc1Detune = MIN_DETUNE;
  private osc2Waveform: OscillatorType = DEFAULT_OSC_WAVEFORM;
  private osc2Level = DEFAULT_MIX_LEVEL;
  private osc2Detune = MIN_DETUNE;
  private oscillatorMix = DEFAULT_MIX_LEVEL;

  private noteNameToSemitoneOffsetInOctave: { [key: string]: number } = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };

  /**
   * Creates an instance of the synthesizer engine's oscillator.
   *
   * @param audioContext - The AudioContext used for audio processing.
   * @param oscillatorsRef - A map referencing active note voices by their string identifiers.
   * @param outputNode - The destination AudioNode for the oscillator's output.
   * @param lfoGainNodes - An object containing gain nodes for low-frequency oscillators (LFOs).
   */
  constructor(
    audioContext: AudioContext,
    oscillatorsRef: Map<string, NoteVoice>,
    outputNode: AudioNode,
    lfoGainNodes: LfoGainNodes,
  ) {
    this.audioContext = audioContext;
    this.oscillatorsRef = oscillatorsRef;
    this.outputNode = outputNode;
    this.lfoGainNodes = lfoGainNodes;
  }

  // Update synth state with new parameters.
  setSynthState(state: {
    isMonophonic: boolean;
    glideTime: number;
    attackTime: number;
    decayTime: number;
    sustainLevel: number;
    releaseTime: number;
    filterEnvelopeAttack: number;
    filterEnvelopeDecay: number;
    filterEnvelopeSustain: number;
    filterEnvelopeRelease: number;
    filterEnvelopeDepth: number;
    filterFrequency: number;
    filterQ: number;
    filterType: BiquadFilterType;
    filterSlope: 12 | 24 | 36 | 48;
    osc1Waveform: OscillatorType;
    osc1Level: number;
    osc1Detune: number;
    osc2Waveform: OscillatorType;
    osc2Level: number;
    osc2Detune: number;
    oscillatorMix: number;
  }) {
    Object.assign(this, state);
  }

  /**
   * Glides the frequency of a note voice to a target frequency over the specified glide time.
   * @param noteVoice The NoteVoice object containing oscillators and parameters.
   * @param targetFrequency The target frequency to glide to.
   * @param startTime The time at which the glide starts.
   */
  private glideToFrequency(noteVoice: NoteVoice, targetFrequency: number, startTime: number) {
    // Calculate the end time for the glide
    const endTime = startTime + this.glideTime;

    // Cancel any existing scheduled values for the oscillators' frequencies
    noteVoice.oscillator1.frequency.cancelScheduledValues(startTime);
    noteVoice.oscillator2.frequency.cancelScheduledValues(startTime);

    // Set the current frequency to the oscillator's value at the start time and then ramp to the target frequency
    noteVoice.oscillator1.frequency.setValueAtTime(noteVoice.oscillator1.frequency.value, startTime);
    noteVoice.oscillator1.frequency.linearRampToValueAtTime(targetFrequency, endTime);
    noteVoice.oscillator2.frequency.setValueAtTime(noteVoice.oscillator2.frequency.value, startTime);
    noteVoice.oscillator2.frequency.linearRampToValueAtTime(targetFrequency, endTime);
  }

  /**
   * Applies the filter envelope to the filter nodes of a note voice.
   * @param filterNodes The array of BiquadFilterNode instances.
   * @param startTime The time at which the envelope starts.
   */
  private applyFilterEnvelope(filterNodes: BiquadFilterNode[], startTime: number) {
    // If no filter nodes are provided, exit early
    if (filterNodes.length === 0) return;

    // Calculate the start, peak, and sustain frequencies based on the filter envelope parameters
    const startFreq = Math.max(MIN_FREQ, this.filterFrequency - this.filterEnvelopeDepth);
    const peakFreq = this.filterFrequency + this.filterEnvelopeDepth;
    const sustainFreq = this.filterFrequency + this.filterEnvelopeDepth * this.filterEnvelopeSustain;

    // Apply the filter envelope to each filter node
    filterNodes.forEach((filterNode) => {
      filterNode.frequency.cancelScheduledValues(startTime);
      filterNode.frequency.setValueAtTime(startFreq, startTime);
      filterNode.frequency.linearRampToValueAtTime(peakFreq, startTime + this.filterEnvelopeAttack);
      filterNode.frequency.linearRampToValueAtTime(
        sustainFreq,
        startTime + this.filterEnvelopeAttack + this.filterEnvelopeDecay,
      );
    });
  }

  /**
   * Applies the filter envelope release phase to the filter nodes of a note voice.
   * @param filterNodes The array of BiquadFilterNode instances.
   * @param releaseStartTime The time at which the release phase starts.
   */
  private applyFilterEnvelopeRelease(filterNodes: BiquadFilterNode[], releaseStartTime: number) {
    // If no filter nodes are provided, exit early
    if (filterNodes.length === 0) return;

    // Calculate the release end frequency based on the filter envelope depth
    const releaseEndFreq = Math.max(MIN_FREQ, this.filterFrequency - this.filterEnvelopeDepth);

    // Apply the release phase to each filter node
    filterNodes.forEach((filterNode) => {
      const currentValue = filterNode.frequency.value;
      filterNode.frequency.cancelScheduledValues(releaseStartTime);
      filterNode.frequency.setValueAtTime(currentValue, releaseStartTime);
      filterNode.frequency.linearRampToValueAtTime(releaseEndFreq, releaseStartTime + this.filterEnvelopeRelease);
    });
  }

  /**
   * Creates and configures a dual oscillator voice for a single note.
   * @param audioContext The AudioContext.
   * @param frequency The base frequency of the note.
   * @param osc1Waveform Waveform for oscillator 1.
   * @param osc1Level Level for oscillator 1.
   * @param osc1Detune Detune for oscillator 1 (in semitones).
   * @param osc2Waveform Waveform for oscillator 2.
   * @param osc2Level Level for oscillator 2.
   * @param osc2Detune Detune for oscillator 2 (in semitones).
   * @param oscillatorMix Mix ratio between oscillator 1 and 2 (0 to 1).
   * @param lfoEnabled Whether LFO is enabled.
   * @param lfoGainNodes LFO gain nodes for modulation.
   * @param crossModEnabled Whether cross modulation is enabled.
   * @param crossModDepth The cross modulation depth in Hz.
   * @param crossModRatio The cross modulation frequency ratio.
   * @returns An object containing the created audio nodes for the voice.
   */
  private createOscillatorVoice(
    audioContext: AudioContext,
    frequency: number,
    osc1Waveform: OscillatorType,
    osc1Level: number,
    osc1Detune: number,
    osc2Waveform: OscillatorType,
    osc2Level: number,
    osc2Detune: number,
    oscillatorMix: number,
    lfoGainNodes: LfoGainNodes,
  ): Omit<NoteVoice, "filterNodes"> {
    const now = audioContext.currentTime;

    // Create oscillators and gain nodes for each oscillator
    const oscillator1 = audioContext.createOscillator();
    const osc1GainNode = audioContext.createGain();
    const oscillator2 = audioContext.createOscillator();
    const osc2GainNode = audioContext.createGain();

    // Create a mixer gain node to combine the two oscillators
    const mixerGainNode = audioContext.createGain();

    // Create an envelope gain node for the final output
    const envelopeGainNode = audioContext.createGain();

    // Set the initial gain values for the oscillators
    const osc1MixLevel = Math.cos((oscillatorMix * Math.PI) / 2);
    const osc2MixLevel = Math.sin((oscillatorMix * Math.PI) / 2);

    // Configure the oscillators and gain nodes
    oscillator1.type = osc1Waveform;
    oscillator1.frequency.setValueAtTime(frequency, now);
    oscillator1.detune.setValueAtTime(osc1Detune * 100, now);
    osc1GainNode.gain.setValueAtTime(osc1Level * osc1MixLevel, now);

    oscillator2.type = osc2Waveform;
    oscillator2.frequency.setValueAtTime(frequency, now);
    oscillator2.detune.setValueAtTime(osc2Detune * 100, now);
    osc2GainNode.gain.setValueAtTime(osc2Level * osc2MixLevel, now);

    // Connect the LFO to the osciallators pitch
    if (lfoGainNodes.osc1Pitch && lfoGainNodes.osc2Pitch) {
      if (lfoGainNodes.osc1Pitch.gain.value > 0) {
        lfoGainNodes.osc1Pitch.connect(oscillator1.detune);
      }
      if (lfoGainNodes.osc2Pitch.gain.value > 0) {
        lfoGainNodes.osc2Pitch.connect(oscillator2.detune);
      }
    }

    // Connect the LFO to the oscillators level
    if (lfoGainNodes.osc1Level && lfoGainNodes.osc2Level) {
      if (lfoGainNodes.osc1Level.gain.value > 0) {
        lfoGainNodes.osc1Level.connect(osc1GainNode.gain);
      }
      if (lfoGainNodes.osc2Level.gain.value > 0) {
        lfoGainNodes.osc2Level.connect(osc2GainNode.gain);
      }
    }

    // Connect the oscillators to their respective gain nodes
    oscillator1.connect(osc1GainNode);
    oscillator2.connect(osc2GainNode);
    osc1GainNode.connect(mixerGainNode);
    osc2GainNode.connect(mixerGainNode);

    // Set the mixer gain node to combine the two oscillators
    mixerGainNode.gain.setValueAtTime(1, now);
    mixerGainNode.connect(envelopeGainNode);

    // Start the oscillators
    oscillator1.start();
    oscillator2.start();

    return {
      oscillator1,
      oscillator2,
      osc1GainNode,
      osc2GainNode,
      mixerGainNode,
      envelopeGainNode,
      osc1DetuneParam: oscillator1.detune,
      osc2DetuneParam: oscillator2.detune,
      osc1LevelParam: osc1GainNode.gain,
      osc2LevelParam: osc2GainNode.gain,
      mixerGainParam: mixerGainNode.gain,
    };
  }

  /**
   * Applies ADS (Attack, Decay, Sustain) automation to an AudioParam.
   * @param param The AudioParam to automate (e.g., GainNode.gain, BiquadFilterNode.frequency).
   * @param startTime The time at which the attack phase begins.
   * @param attackTime The duration of the attack phase.
   * @param decayTime The duration of the decay phase.
   * @param sustainLevel The target value for the sustain phase (0 to 1 for gain, or a frequency for filter).
   * @param initialValue The value to start the attack from (e.g., 0 for amplitude, 20000 for filter).
   * @param targetValue The peak value after attack (e.g., 1 for amplitude, cutoff frequency for filter).
   */
  private applyADS(
    param: AudioParam,
    startTime: number,
    attackTime: number,
    decayTime: number,
    sustainLevel: number,
    initialValue: number,
    targetValue: number,
  ) {
    param.cancelScheduledValues(startTime);
    param.setValueAtTime(initialValue, startTime);
    param.linearRampToValueAtTime(targetValue, startTime + attackTime);
    param.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
  }

  /**
   * Applies the release phase of an ADSR envelope to an AudioParam.
   * @param param The AudioParam to automate.
   * @param releaseStartTime The time at which the release phase begins.
   * @param releaseTime The duration of the release phase.
   * @param releaseEndValue The value to ramp to at the end of the release phase.
   */
  private applyRelease(param: AudioParam, releaseStartTime: number, releaseTime: number, releaseEndValue: number) {
    param.cancelScheduledValues(releaseStartTime);
    param.setValueAtTime(param.value, releaseStartTime);
    param.linearRampToValueAtTime(releaseEndValue, releaseStartTime + releaseTime);
  }

  /**
   * Converts a musical note (e.g., "C4", "A#3") to its corresponding MIDI note number.
   * Returns null if the note format is invalid.
   *
   * @param note The musical note to convert.
   * @returns The MIDI note number or null if invalid.
   */
  private getMidiNoteNumber(note: string): number | null {
    // Validate the note format using a regular expression
    const match = note.match(/([A-G]#?)([0-9])/);
    if (!match) return null;

    // Extract the note name and octave from the match
    const [, noteName, octaveStr] = match;
    const octave = Number.parseInt(octaveStr, 10);
    const semitoneOffset = this.noteNameToSemitoneOffsetInOctave[noteName];

    // If the octave is invalid or semitone offset is undefined, return null
    if (semitoneOffset === undefined) return null;

    // MIDI note number = (octave + 1) * 12 + semitone_in_octave
    // For example, C0 is MIDI note 12, C4 is MIDI note 60.
    return (octave + 1) * 12 + semitoneOffset;
  }

  /**
   * Converts a musical note (e.g., "C4", "A#3") to its corresponding frequency in Hz.
   * Uses the formula: f = f0 * 2^((n - n0) / 12), where f0 is the frequency of reference note n0.
   * Returns null if the note format is invalid.
   *
   * @param note The musical note to convert.
   * @returns The frequency in Hz or null if invalid.
   */
  private getFrequencyForNote(note: string): number | null {
    const midiNoteNumber = this.getMidiNoteNumber(note);
    if (midiNoteNumber === null) return null;

    // Calculate the frequency using the formula for equal temperament tuning
    return 440.0 * Math.pow(2, (midiNoteNumber - 69) / 12);
  }

  /**
   * Plays a musical note by creating an oscillator voice for it.
   * If the note is already playing, it returns the current active notes.
   * If monophonic mode is enabled, it stops any currently playing note before starting the new one.
   *
   * @param note The musical note to play (e.g., "C4", "A#3").
   * @returns A Set of currently active notes after playing the requested note.
   */
  playNote(note: string): Set<string> {
    // Get the frequency for the note
    const frequency = this.getFrequencyForNote(note);
    const now = this.audioContext.currentTime;

    // If the note is invalid, return the current active notes
    if (frequency === null) {
      return new Set(this.oscillatorsRef.keys());
    }

    // If monophonic mode is enabled, handle glide and current note reference
    if (this.isMonophonic) {
      if (this.currentNoteRef && this.oscillatorsRef.has(this.currentNoteRef)) {
        const existingNoteData = this.oscillatorsRef.get(this.currentNoteRef)!;

        // If glide time is set, clean up any existing glide timeout
        if (this.glideTimeoutRef) {
          clearTimeout(this.glideTimeoutRef);
        }

        // Delete the current note from oscillatorsRef and set the new note
        this.oscillatorsRef.delete(this.currentNoteRef);
        this.oscillatorsRef.set(note, existingNoteData);
        this.currentNoteRef = note;

        // Glide to the new frequency
        this.glideToFrequency(existingNoteData, frequency, now);
        return new Set([note]);
      }

      // Stop any currently playing note if monophonic
      this.oscillatorsRef.forEach((_, noteKey) => this.stopNote(noteKey));
      this.oscillatorsRef.clear();
      this.currentNoteRef = note;
    } else {
      if (this.oscillatorsRef.has(note)) {
        return new Set(this.oscillatorsRef.keys());
      }
    }

    try {
      // Create a new oscillator voice for the note
      const voiceNodes = this.createOscillatorVoice(
        this.audioContext,
        frequency,
        this.osc1Waveform,
        this.osc1Level,
        this.osc1Detune,
        this.osc2Waveform,
        this.osc2Level,
        this.osc2Detune,
        this.oscillatorMix,
        this.lfoGainNodes,
      );

      // Apply the filter to the oscillator voice
      const voiceFilterNodes = createFilterChain(
        this.audioContext,
        this.filterType,
        this.filterFrequency,
        this.filterQ,
      );

      // Connect through filter chain or directly to output
      const activeFilterCount = this.filterSlope / 12;

      // If filters are active, connect the envelope gain node to the first filter node
      if (activeFilterCount > 0 && voiceFilterNodes.length > 0) {
        voiceNodes.envelopeGainNode.connect(voiceFilterNodes[0]);
        voiceFilterNodes[activeFilterCount - 1].connect(this.outputNode);

        connectLfoToFilters(voiceFilterNodes, this.lfoGainNodes, activeFilterCount);

        this.applyFilterEnvelope(voiceFilterNodes.slice(0, activeFilterCount), now);
      } else {
        voiceNodes.envelopeGainNode.connect(this.outputNode);
      }

      // Set the envelope gain node to 0 initially
      voiceNodes.envelopeGainNode.gain.setValueAtTime(0, now);

      // Apply ADSR envelope to the envelope gain node
      this.applyADS(voiceNodes.envelopeGainNode.gain, now, this.attackTime, this.decayTime, this.sustainLevel, 0, 1);

      // Create new NoteVoice object with all nodes
      const noteVoice: NoteVoice = {
        ...voiceNodes,
        filterNodes: voiceFilterNodes,
      };

      // Set the current note reference and return the note voice
      this.oscillatorsRef.set(note, noteVoice);
      return new Set(this.oscillatorsRef.keys());
    } catch {
      return new Set(this.oscillatorsRef.keys());
    }
  }

  /**
   * Stops a musical note by releasing its envelope and disconnecting its audio nodes.
   * If monophonic mode is enabled, it stops the current note reference.
   *
   * @param note The musical note to stop (e.g., "C4", "A#3").
   * @returns A Set of currently active notes after stopping the requested note.
   */
  stopNote(note: string): Set<string> {
    // If no note is playing or we're in monophonic mode, return the current active notes
    if (this.isMonophonic && this.currentNoteRef !== note) {
      return new Set(this.oscillatorsRef.keys());
    }

    // Get the note data from the oscillators reference
    const noteData = this.oscillatorsRef.get(note);

    if (noteData) {
      const { oscillator1, oscillator2, osc1GainNode, osc2GainNode, mixerGainNode, envelopeGainNode, filterNodes } =
        noteData;
      const now = this.audioContext.currentTime;

      // Apply the release phase to the envelope gain node
      this.applyRelease(envelopeGainNode.gain, now, this.releaseTime, 0);

      const activeFilterCount = this.filterSlope / 12;

      // If filters are active, apply the filter envelope release
      if (activeFilterCount > 0 && filterNodes.length > 0) {
        this.applyFilterEnvelopeRelease(filterNodes.slice(0, activeFilterCount), now);
      }

      // Calculate the cleanup time after which the nodes will be disconnected
      const cleanupTime = Math.max(this.releaseTime, this.filterEnvelopeRelease) * 1000 + 100;

      // Schedule the disconnection of nodes after the cleanup time
      setTimeout(() => {
        try {
          oscillator1.stop();
          oscillator2.stop();
          osc1GainNode.disconnect();
          osc2GainNode.disconnect();
          mixerGainNode.disconnect();
          envelopeGainNode.disconnect();
          filterNodes.forEach((node) => node.disconnect());
          oscillator1.disconnect();
          oscillator2.disconnect();
        } catch (error) {
          throw error;
        }
      }, cleanupTime);

      // Remove the note from the oscillators reference
      this.oscillatorsRef.delete(note);

      // If monophonic mode is enabled, clear the current note reference
      if (this.isMonophonic) {
        this.currentNoteRef = null;
      }
    }
    return new Set(this.oscillatorsRef.keys());
  }

  /**
   * Updates the parameters of all currently active notes in real-time.
   * This includes oscillator levels, detune, and waveform types.
   */
  updateActiveNotesParameters() {
    // If no oscillators are active, exit early
    if (this.oscillatorsRef.size === 0) return;

    requestAnimationFrame(() => {
      try {
        // Calculate the mix levels for oscillators based on the oscillatorMix parameter
        const osc1MixLevel = Math.cos((this.oscillatorMix * Math.PI) / 2);
        const osc2MixLevel = Math.sin((this.oscillatorMix * Math.PI) / 2);

        // Iterate over each active note voice and update its parameters
        this.oscillatorsRef.forEach((noteVoice) => {
          const now = this.audioContext.currentTime;
          const rampTime = now + 0.01;

          try {
            // Update oscillator levels, detune, and waveform types
            noteVoice.osc1LevelParam.cancelScheduledValues(now);
            noteVoice.osc1LevelParam.setValueAtTime(noteVoice.osc1LevelParam.value, now);
            noteVoice.osc1LevelParam.exponentialRampToValueAtTime(
              Math.max(0.001, this.osc1Level * osc1MixLevel),
              rampTime,
            );

            noteVoice.osc2LevelParam.cancelScheduledValues(now);
            noteVoice.osc2LevelParam.setValueAtTime(noteVoice.osc2LevelParam.value, now);
            noteVoice.osc2LevelParam.exponentialRampToValueAtTime(
              Math.max(0.001, this.osc2Level * osc2MixLevel),
              rampTime,
            );

            noteVoice.osc1DetuneParam.cancelScheduledValues(now);
            noteVoice.osc1DetuneParam.setValueAtTime(noteVoice.osc1DetuneParam.value, now);
            noteVoice.osc1DetuneParam.linearRampToValueAtTime(this.osc1Detune * 100, rampTime);

            noteVoice.osc2DetuneParam.cancelScheduledValues(now);
            noteVoice.osc2DetuneParam.setValueAtTime(noteVoice.osc2DetuneParam.value, now);
            noteVoice.osc2DetuneParam.linearRampToValueAtTime(this.osc2Detune * 100, rampTime);

            noteVoice.oscillator1.type = this.osc1Waveform;
            noteVoice.oscillator2.type = this.osc2Waveform;
          } catch {
            // If any error occurs, set the values directly
            noteVoice.osc1LevelParam.value = this.osc1Level * osc1MixLevel;
            noteVoice.osc2LevelParam.value = this.osc2Level * osc2MixLevel;
            noteVoice.osc1DetuneParam.value = this.osc1Detune * 100;
            noteVoice.osc2DetuneParam.value = this.osc2Detune * 100;
            noteVoice.oscillator1.type = this.osc1Waveform;
            noteVoice.oscillator2.type = this.osc2Waveform;
          }
        });
      } catch (error) {
        throw error;
      }
    });
  }

  /**
   * Updates filter parameters for all currently active notes.
   * This includes filter type, frequency, Q factor, and LFO connections.
   */
  updateActiveNotesFilterParameters() {
    // If no oscillators are active, exit early
    if (this.oscillatorsRef.size === 0) return;

    requestAnimationFrame(() => {
      try {
        const now = this.audioContext.currentTime;
        const rampTime = now + 0.01;
        const activeFilterCount = this.filterSlope / 12;

        // For each active note voice, update the filter parameters
        this.oscillatorsRef.forEach((noteVoice) => {
          // Disconnect any existing filter connections
          if (this.lfoGainNodes.filter) {
            try {
              this.lfoGainNodes.filter.disconnect();
            } catch {}
          }

          // Rebuild the filter chain with the new parameters
          noteVoice.filterNodes.forEach((filterNode, index) => {
            if (index < activeFilterCount) {
              try {
                filterNode.type = this.filterType;
                filterNode.frequency.cancelScheduledValues(now);
                filterNode.frequency.setValueAtTime(filterNode.frequency.value, now);
                filterNode.frequency.exponentialRampToValueAtTime(Math.max(20, this.filterFrequency), rampTime);
                filterNode.Q.cancelScheduledValues(now);
                filterNode.Q.setValueAtTime(filterNode.Q.value, now);
                filterNode.Q.linearRampToValueAtTime(this.filterQ, rampTime);
              } catch {
                filterNode.frequency.value = this.filterFrequency;
                filterNode.Q.value = this.filterQ;
              }
            }
          });

          // Connect the LFO to the filter nodes if applicable
          connectLfoToFilters(noteVoice.filterNodes, this.lfoGainNodes, activeFilterCount);
        });
      } catch (error) {
        throw error;
      }
    });
  }

  /**
   * Updates the envelope parameters for all currently active notes.
   * This includes attack, decay, sustain, and release times.
   */
  updateActiveNotesEnvelopeParameters() {
    if (this.oscillatorsRef.size === 0) return;

    requestAnimationFrame(() => {
      try {
        const now = this.audioContext.currentTime;

        // Iterate over each active note voice and update its envelope parameters
        this.oscillatorsRef.forEach((noteVoice) => {
          try {
            const currentGain = noteVoice.envelopeGainNode.gain.value;
            if (currentGain > 0 && currentGain < 1) {
              noteVoice.envelopeGainNode.gain.cancelScheduledValues(now);
              noteVoice.envelopeGainNode.gain.setValueAtTime(currentGain, now);
              noteVoice.envelopeGainNode.gain.linearRampToValueAtTime(this.sustainLevel, now + 0.05);
            }
          } catch {}
        });
      } catch (error) {
        throw error;
      }
    });
  }

  /**
   * Cleans up all active notes.
   */
  cleanup() {
    // Stop all oscillators and disconnect their nodes
    this.oscillatorsRef.forEach((noteData) => {
      try {
        // Stop the oscillators and disconnect all nodes
        noteData.oscillator1.stop();
        noteData.oscillator2.stop();
        noteData.osc1GainNode.disconnect();
        noteData.osc2GainNode.disconnect();
        noteData.mixerGainNode.disconnect();
        noteData.envelopeGainNode.disconnect();
        noteData.filterNodes.forEach((node) => node.disconnect());
        noteData.oscillator1.disconnect();
        noteData.oscillator2.disconnect();
      } catch (error) {
        throw error;
      }
    });

    this.oscillatorsRef.clear();

    if (this.glideTimeoutRef) {
      clearTimeout(this.glideTimeoutRef);
    }
  }
}
