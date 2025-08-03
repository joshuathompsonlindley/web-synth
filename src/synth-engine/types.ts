export interface NoteVoice {
  oscillator1: OscillatorNode;
  oscillator2: OscillatorNode;
  osc1GainNode: GainNode;
  osc2GainNode: GainNode;
  mixerGainNode: GainNode;
  envelopeGainNode: GainNode;
  filterNodes: BiquadFilterNode[];
  osc1DetuneParam: AudioParam;
  osc2DetuneParam: AudioParam;
  osc1LevelParam: AudioParam;
  osc2LevelParam: AudioParam;
  mixerGainParam: AudioParam;
}

export interface LfoGainNodes {
  filter: GainNode | null;
  osc1Pitch: GainNode | null;
  osc2Pitch: GainNode | null;
  osc1Level: GainNode | null;
  osc2Level: GainNode | null;
}
