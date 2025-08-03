import type { LfoGainNodes } from "@/synth-engine/types";

/**
 * Creates a chain of BiquadFilterNodes.
 * @param audioContext The AudioContext.
 * @param filterType The type of filter ('lowpass' or 'highpass').
 * @param filterFrequency The cutoff frequency.
 * @param filterQ The Q factor (resonance).
 * @returns An array of BiquadFilterNode instances.
 */
export function createFilterChain(
  audioContext: AudioContext,
  filterType: BiquadFilterType,
  filterFrequency: number,
  filterQ: number,
): BiquadFilterNode[] {
  // Setup filter chain
  const maxFilters = 4;
  const filterNodes: BiquadFilterNode[] = [];
  const now = audioContext.currentTime;

  // Iterate over each filter and setup the nodes
  for (let i = 0; i < maxFilters; i++) {
    const filterNode = audioContext.createBiquadFilter();
    filterNode.type = filterType;
    filterNode.frequency.setValueAtTime(filterFrequency, now);
    filterNode.Q.setValueAtTime(filterQ, now);
    filterNodes.push(filterNode);
  }

  // Connect each filter node together
  for (let i = 0; i < filterNodes.length - 1; i++) {
    filterNodes[i].connect(filterNodes[i + 1]);
  }

  return filterNodes;
}

/**
 * Connects LFO to filter frequency for a specific set of filter nodes.
 * @param filterNodes The filter nodes to connect LFO to.
 * @param lfoGainNodes LFO gain nodes for modulation.
 * @param activeFilterCount Number of active filters in the chain.
 */
export function connectLfoToFilters(
  filterNodes: BiquadFilterNode[],
  lfoGainNodes: LfoGainNodes,
  activeFilterCount: number,
) {
  // Don't bother if filter isn't actually active
  if (
    !lfoGainNodes.filter ||
    activeFilterCount === 0 ||
    lfoGainNodes.filter.gain.value <= 0
  ) {
    return;
  }

  // Iterate over each filter node and connect to the LFO
  for (let i = 0; i < Math.min(activeFilterCount, filterNodes.length); i++) {
    try {
      lfoGainNodes.filter.connect(filterNodes[i].frequency);
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Updates the parameters of an existing filter chain.
 * @param audioContext The AudioContext.
 * @param filterNodes The array of BiquadFilterNode instances.
 * @param filterType The type of filter.
 * @param filterFrequency The cutoff frequency.
 * @param filterQ The Q factor.
 * @param filterSlope The filter slope (12, 24, 36, or 48 dB/octave).
 * @param filterBypassed Whether the filter is bypassed.
 * @param lfoGainNodes LFO gain nodes for modulation.
 * @param mainGainNode The main gain node to connect the filter chain to.
 */
export function updateFilterChain(
  audioContext: AudioContext,
  filterNodes: BiquadFilterNode[],
  filterType: BiquadFilterType,
  filterFrequency: number,
  filterQ: number,
  filterSlope: 12 | 24 | 36 | 48,
  lfoGainNodes: LfoGainNodes,
  mainGainNode: GainNode,
) {
  // Don't bother if the filter isn't actually active
  if (filterNodes.length === 0) return;

  const activeFilterCount = filterSlope / 12;
  const now = audioContext.currentTime;

  // Disconnect each node
  filterNodes.forEach((node) => node.disconnect());

  // Then reconnect them with the new parameters
  filterNodes.forEach((filterNode, index) => {
    if (index < activeFilterCount) {
      filterNode.type = filterType;
      filterNode.frequency.setValueAtTime(filterFrequency, now);
      filterNode.Q.setValueAtTime(filterQ, now);
    }
  });

  // Make sure the LFO targets are up to date
  connectLfoToFilters(filterNodes, lfoGainNodes, activeFilterCount);

  // Reconnect all the nodes together
  for (let i = 0; i < activeFilterCount - 1; i++) {
    filterNodes[i].connect(filterNodes[i + 1]);
  }

  if (activeFilterCount > 0) {
    filterNodes[activeFilterCount - 1].connect(mainGainNode);
  }
}
