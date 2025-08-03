/*
 * CLAMPING VALUES
 */

export const MIN_OCTAVE = 2;
export const MAX_OCTAVE = 6;
export const MIN_FREQ = 20;
export const MAX_FREQ = 20000;
export const MIN_Q = 0;
export const MAX_Q = 30;
export const MIN_DETUNE = -12;
export const MAX_DETUNE = 12;
export const MIN_GLIDE = 0;
export const MAX_GLIDE = 2;
export const MIN_MIX_LEVEL = 0;
export const MAX_MIX_LEVEL = 1;
export const MIN_ATTACK = 0;
export const MAX_ATTACK = 2;
export const MIN_DECAY = 0;
export const MAX_DECAY = 2;
export const MIN_SUSTAIN = 0;
export const MAX_SUSTAIN = 1;
export const MIN_RELEASE = 0;
export const MAX_RELEASE = 2;
export const MIN_LFO_RATE = 0;
export const MAX_LFO_RATE = 20;
export const MIN_LFO_FILTER_DEPTH = 0;
export const MAX_LFO_FILTER_DEPTH = 5000;
export const MIN_LFO_PITCH_DEPTH = 0;
export const MAX_LFO_PITCH_DEPTH = 200;
export const MIN_LFO_LEVEL_DEPTH = 0;
export const MAX_LFO_LEVEL_DEPTH = 0.5;

/*
 * DEFAULT VALUES
 */
export const DEFAULT_OCTAVE = 4;
export const DEFAULT_FILTER_TYPE: BiquadFilterType = "lowpass";
export const DEFAULT_FILTER_SLOPE: 12 | 24 | 36 | 48 = 12;
export const DEFAULT_OSC_WAVEFORM: OscillatorType = "sine";
export const DEFAULT_MIX_LEVEL = 0.5;
export const DEFAULT_VOICING_MODE = false; // false = polyphonic, true = monophonic
