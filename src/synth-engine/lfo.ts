import type { LfoGainNodes } from "@/synth-engine/types";

export class LfoManager {
  private audioContext: AudioContext;
  private lfoOscillator: OscillatorNode | null = null;
  private lfoGainNodes: LfoGainNodes = {
    filter: null,
    osc1Pitch: null,
    osc2Pitch: null,
    osc1Level: null,
    osc2Level: null,
  };
  private isInitialized = false;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  /**
   * Initializes and starts the LFO.
   * @param rate The LFO frequency in Hz.
   * @param waveform The LFO waveform type.
   * @param filterDepth The depth of LFO modulation on filter frequency.
   * @param osc1PitchDepth The depth of LFO modulation on oscillator 1 pitch.
   * @param osc2PitchDepth The depth of LFO modulation on oscillator 2 pitch.
   * @param osc1LevelDepth The depth of LFO modulation on oscillator 1 level.
   * @param osc2LevelDepth The depth of LFO modulation on oscillator 2 level.
   */
  init(
    rate: number,
    waveform: OscillatorType,
    filterDepth: number,
    osc1PitchDepth: number,
    osc2PitchDepth: number,
    osc1LevelDepth: number,
    osc2LevelDepth: number,
  ) {
    // Stop any existing LFO before starting a new one
    this.stop();

    const now = this.audioContext.currentTime;

    // Create the LFO oscillator
    this.lfoOscillator = this.audioContext.createOscillator();
    this.lfoOscillator.type = waveform;
    this.lfoOscillator.frequency.setValueAtTime(Math.max(0.1, Math.min(20, rate)), now);

    // Create gain nodes for LFO modulation
    this.lfoGainNodes.filter = this.audioContext.createGain();
    this.lfoGainNodes.osc1Pitch = this.audioContext.createGain();
    this.lfoGainNodes.osc2Pitch = this.audioContext.createGain();
    this.lfoGainNodes.osc1Level = this.audioContext.createGain();
    this.lfoGainNodes.osc2Level = this.audioContext.createGain();

    // Set initial gain values for modulation
    this.lfoGainNodes.filter.gain.setValueAtTime(Math.max(0, Math.min(5000, filterDepth)), now);
    this.lfoGainNodes.osc1Pitch.gain.setValueAtTime(Math.max(0, Math.min(1200, osc1PitchDepth)), now);
    this.lfoGainNodes.osc2Pitch.gain.setValueAtTime(Math.max(0, Math.min(1200, osc2PitchDepth)), now);
    this.lfoGainNodes.osc1Level.gain.setValueAtTime(Math.max(0, Math.min(1, osc1LevelDepth)), now);
    this.lfoGainNodes.osc2Level.gain.setValueAtTime(Math.max(0, Math.min(1, osc2LevelDepth)), now);

    // Connect the LFO oscillator to the gain nodes
    this.lfoOscillator.connect(this.lfoGainNodes.filter);
    this.lfoOscillator.connect(this.lfoGainNodes.osc1Pitch);
    this.lfoOscillator.connect(this.lfoGainNodes.osc2Pitch);
    this.lfoOscillator.connect(this.lfoGainNodes.osc1Level);
    this.lfoOscillator.connect(this.lfoGainNodes.osc2Level);

    // Start the LFO oscillator
    this.lfoOscillator.start();
    this.isInitialized = true;
  }

  /**
   * Stops and cleans up the LFO.
   */
  stop() {
    // Stop the oscillator if it exists
    if (this.lfoOscillator) {
      try {
        this.lfoOscillator.stop();
        this.lfoOscillator.disconnect();
      } catch (error) {
        throw error;
      }
      this.lfoOscillator = null;
    }

    // Disconnect all gain nodes
    for (const key in this.lfoGainNodes) {
      const node = this.lfoGainNodes[key as keyof LfoGainNodes];
      if (node) {
        try {
          node.disconnect();
        } catch (error) {
          throw error;
        }
        this.lfoGainNodes[key as keyof LfoGainNodes] = null;
      }
    }

    this.isInitialized = false;
  }

  /**
   * Updates the LFO parameters. For waveform changes, restarts the LFO.
   * @param rate The LFO frequency in Hz.
   * @param waveform The LFO waveform type.
   * @param filterDepth The depth of LFO modulation on filter frequency.
   * @param osc1PitchDepth The depth of LFO modulation on oscillator 1 pitch.
   * @param osc2PitchDepth The depth of LFO modulation on oscillator 2 pitch.
   * @param osc1LevelDepth The depth of LFO modulation on oscillator 1 level.
   * @param osc2LevelDepth The depth of LFO modulation on oscillator 2 level.
   */
  update(
    rate: number,
    waveform: OscillatorType,
    filterDepth: number,
    osc1PitchDepth: number,
    osc2PitchDepth: number,
    osc1LevelDepth: number,
    osc2LevelDepth: number,
  ) {
    // If not initialized or no oscillator, initialize it
    if (!this.isInitialized || !this.lfoOscillator) {
      this.init(rate, waveform, filterDepth, osc1PitchDepth, osc2PitchDepth, osc1LevelDepth, osc2LevelDepth);
      return;
    }

    const now = this.audioContext.currentTime;

    // If the waveform has changed, reinitialize the LFO
    if (this.lfoOscillator.type !== waveform) {
      this.init(rate, waveform, filterDepth, osc1PitchDepth, osc2PitchDepth, osc1LevelDepth, osc2LevelDepth);
      return;
    }

    // Update the LFO frequency
    try {
      const clampedRate = Math.max(0.1, Math.min(20, rate));
      this.lfoOscillator.frequency.cancelScheduledValues(now);
      this.lfoOscillator.frequency.setValueAtTime(clampedRate, now);
    } catch (error) {
      throw error;
    }

    // Update the gain nodes for filter modulation
    if (this.lfoGainNodes.filter) {
      try {
        const clampedFilterDepth = Math.max(0, Math.min(5000, filterDepth));
        this.lfoGainNodes.filter.gain.cancelScheduledValues(now);
        this.lfoGainNodes.filter.gain.setValueAtTime(clampedFilterDepth, now);
      } catch (error) {
        throw error;
      }
    }

    // Update the gain nodes for oscillator 1 pitch modulation
    if (this.lfoGainNodes.osc1Pitch) {
      try {
        const clampedOsc1PitchDepth = Math.max(0, Math.min(1200, osc1PitchDepth));
        this.lfoGainNodes.osc1Pitch.gain.cancelScheduledValues(now);
        this.lfoGainNodes.osc1Pitch.gain.setValueAtTime(clampedOsc1PitchDepth, now);
      } catch (error) {
        throw error;
      }
    }

    // Update the gain nodes for oscillator 2 pitch modulation
    if (this.lfoGainNodes.osc2Pitch) {
      try {
        const clampedOsc2PitchDepth = Math.max(0, Math.min(1200, osc2PitchDepth));
        this.lfoGainNodes.osc2Pitch.gain.cancelScheduledValues(now);
        this.lfoGainNodes.osc2Pitch.gain.setValueAtTime(clampedOsc2PitchDepth, now);
      } catch (error) {
        throw error;
      }
    }

    // Update the gain nodes for oscillator 1 level modulation
    if (this.lfoGainNodes.osc1Level) {
      try {
        const clampedOsc1LevelDepth = Math.max(0, Math.min(1, osc1LevelDepth));
        this.lfoGainNodes.osc1Level.gain.cancelScheduledValues(now);
        this.lfoGainNodes.osc1Level.gain.setValueAtTime(clampedOsc1LevelDepth, now);
      } catch (error) {
        throw error;
      }
    }

    // Update the gain nodes for oscillator 2 level modulation
    if (this.lfoGainNodes.osc2Level) {
      try {
        const clampedOsc2LevelDepth = Math.max(0, Math.min(1, osc2LevelDepth));
        this.lfoGainNodes.osc2Level.gain.cancelScheduledValues(now);
        this.lfoGainNodes.osc2Level.gain.setValueAtTime(clampedOsc2LevelDepth, now);
      } catch (error) {
        throw error;
      }
    }
  }

  /**
   * Returns whether the LFO is initialized and running.
   * @returns True if the LFO is running, false otherwise.
   */
  isRunning(): boolean {
    return this.isInitialized && this.lfoOscillator !== null;
  }

  /**
   * Returns the LFO gain nodes for external connections.
   * @returns An object containing the LFO gain nodes.
   */
  getGainNodes(): LfoGainNodes {
    return this.lfoGainNodes;
  }
}
