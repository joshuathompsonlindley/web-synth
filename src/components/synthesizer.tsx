"use client";

import { ModuleCard } from "@/components/common/module-card";
import { FilterModule } from "@/components/modules/filter-module";
import { LfoModule } from "@/components/modules/lfo-module";
import { MidiModule } from "@/components/modules/midi-module";
import { MixerSection } from "@/components/modules/mixer-module";
import { OscillatorProps } from "@/components/modules/osc-module";
import { useKeyboard } from "@/hooks/use-keyboard";
import { useMidi } from "@/hooks/use-midi";
import { useSynthesizer } from "@/hooks/use-synthesizer";

export default function Synthesizer() {
  const {
    // Audio state
    volume,
    setVolume,

    // Filter state
    filterFrequency,
    setFilterFrequency,
    filterQ,
    setFilterQ,
    filterType,
    setFilterType,
    filterSlope,
    setFilterSlope,

    // Envelope state
    attackTime,
    setAttackTime,
    decayTime,
    setDecayTime,
    sustainLevel,
    setSustainLevel,
    releaseTime,
    setReleaseTime,

    // Filter envelope state
    filterEnvelopeAttack,
    setFilterEnvelopeAttack,
    filterEnvelopeDecay,
    setFilterEnvelopeDecay,
    filterEnvelopeSustain,
    setFilterEnvelopeSustain,
    filterEnvelopeRelease,
    setFilterEnvelopeRelease,
    filterEnvelopeDepth,
    setFilterEnvelopeDepth,

    // LFO state
    lfoRate,
    setLfoRate,
    lfoWaveform,
    setLfoWaveform,
    lfoFilterDepth,
    setLfoFilterDepth,
    lfoOsc1PitchDepth,
    setLfoOsc1PitchDepth,
    lfoOsc2PitchDepth,
    setLfoOsc2PitchDepth,
    lfoOsc1LevelDepth,
    setLfoOsc1LevelDepth,
    lfoOsc2LevelDepth,
    setLfoOsc2LevelDepth,

    // Voice mode state
    isMonophonic,
    setIsMonophonic,
    glideTime,
    setGlideTime,

    // Oscillator state
    osc1Waveform,
    setOsc1Waveform,
    osc1Level,
    setOsc1Level,
    osc1Detune,
    setOsc1Detune,
    osc2Waveform,
    setOsc2Waveform,
    osc2Level,
    setOsc2Level,
    osc2Detune,
    setOsc2Detune,
    oscillatorMix,
    setOscillatorMix,

    // Octave state
    currentOctave,
    changeOctave,

    // Methods
    initAudio,
    playNote,
    stopNote,
  } = useSynthesizer();

  // Keyboard handling
  useKeyboard({
    onNoteStart: playNote,
    onNoteStop: stopNote,
    initAudio,
    currentOctave,
    changeOctave,
  });

  // MIDI handling
  const { midiDevices, selectedMidiInput, setSelectedMidiInput, midiEnabled, setMidiEnabled } = useMidi({
    onNoteStart: playNote,
    onNoteStop: stopNote,
    initAudio,
  });

  return (
    <div className="flex flex-col items-center gap-y-6">
      <div>
        <ModuleCard>
          <p className="text-sm">
            Use the keyboard to play notes or connect a MIDI device. Adjust the settings in each module to shape your
            sound.
          </p>
          <p className="mt-2 text-sm text-gray-400">Keyboard controls:</p>
          <div className="flex gap-x-4">
            <p className="mt-2 text-sm text-gray-400">
              <kbd className="bg-gray-600 text-white px-2 py-1 rounded-md text-sm">A</kbd> -{" "}
              <kbd className="bg-gray-600 text-white px-2 py-1 rounded-md text-sm">J</kbd>: Black Keys
            </p>
            <p className="mt-2 text-sm text-gray-400">
              <kbd className="bg-gray-600 text-white px-2 py-1 rounded-md text-sm">W</kbd> -{" "}
              <kbd className="bg-gray-600 text-white px-2 py-1 rounded-md text-sm">U</kbd>: White Keys
            </p>
            <p className="mt-2 text-sm text-gray-400">
              <kbd className="bg-gray-600 text-white px-2 py-1 rounded-md text-sm">Z</kbd>: Octave Down
            </p>
            <p className="mt-2 text-sm text-gray-400">
              <kbd className="bg-gray-600 text-white px-2 py-1 rounded-md text-sm">X</kbd>: Octave Up
            </p>
          </div>
        </ModuleCard>
      </div>
      <div className="px-6 mx-auto flex gap-x-6 justify-evenly">
        <div>
          <ModuleCard>
            <OscillatorProps
              osc1Waveform={osc1Waveform}
              osc1Level={osc1Level}
              osc1Detune={osc1Detune}
              osc2Waveform={osc2Waveform}
              osc2Level={osc2Level}
              osc2Detune={osc2Detune}
              onOsc1WaveformChange={setOsc1Waveform}
              onOsc1LevelChange={setOsc1Level}
              onOsc1DetuneChange={setOsc1Detune}
              onOsc2WaveformChange={setOsc2Waveform}
              onOsc2LevelChange={setOsc2Level}
              onOsc2DetuneChange={setOsc2Detune}
              isMonophonic={isMonophonic}
              glideTime={glideTime}
              onMonophonicChange={setIsMonophonic}
              onGlideTimeChange={setGlideTime}
              attackTime={attackTime}
              decayTime={decayTime}
              sustainLevel={sustainLevel}
              releaseTime={releaseTime}
              onAttackChange={setAttackTime}
              onDecayChange={setDecayTime}
              onSustainChange={setSustainLevel}
              onReleaseChange={setReleaseTime}
            />
          </ModuleCard>
        </div>
        <div className="flex flex-col gap-y-6">
          <ModuleCard>
            <FilterModule
              filterFrequency={filterFrequency}
              filterQ={filterQ}
              filterType={filterType}
              filterSlope={filterSlope}
              onFilterFrequencyChange={setFilterFrequency}
              onFilterQChange={setFilterQ}
              onFilterTypeChange={setFilterType}
              onFilterSlopeChange={setFilterSlope}
              filterEnvelopeAttack={filterEnvelopeAttack}
              filterEnvelopeDecay={filterEnvelopeDecay}
              filterEnvelopeSustain={filterEnvelopeSustain}
              filterEnvelopeRelease={filterEnvelopeRelease}
              filterEnvelopeDepth={filterEnvelopeDepth}
              onFilterEnvelopeAttackChange={setFilterEnvelopeAttack}
              onFilterEnvelopeDecayChange={setFilterEnvelopeDecay}
              onFilterEnvelopeSustainChange={setFilterEnvelopeSustain}
              onFilterEnvelopeReleaseChange={setFilterEnvelopeRelease}
              onFilterEnvelopeDepthChange={setFilterEnvelopeDepth}
            />
          </ModuleCard>
          <ModuleCard>
            <MixerSection
              volume={volume}
              oscillatorMix={oscillatorMix}
              onVolumeChange={setVolume}
              onOscillatorMixChange={setOscillatorMix}
            />
          </ModuleCard>
        </div>
        <div className="flex flex-col gap-y-6">
          <ModuleCard>
            <LfoModule
              lfoRate={lfoRate}
              lfoWaveform={lfoWaveform}
              lfoFilterDepth={lfoFilterDepth}
              lfoOsc1PitchDepth={lfoOsc1PitchDepth}
              lfoOsc2PitchDepth={lfoOsc2PitchDepth}
              lfoOsc1LevelDepth={lfoOsc1LevelDepth}
              lfoOsc2LevelDepth={lfoOsc2LevelDepth}
              onLfoRateChange={setLfoRate}
              onLfoWaveformChange={setLfoWaveform}
              onLfoFilterDepthChange={setLfoFilterDepth}
              onLfoOsc1PitchDepthChange={setLfoOsc1PitchDepth}
              onLfoOsc2PitchDepthChange={setLfoOsc2PitchDepth}
              onLfoOsc1LevelDepthChange={setLfoOsc1LevelDepth}
              onLfoOsc2LevelDepthChange={setLfoOsc2LevelDepth}
            />
          </ModuleCard>
          <ModuleCard>
            <MidiModule
              midiEnabled={midiEnabled}
              midiInputs={midiDevices}
              selectedMidiInput={selectedMidiInput}
              onMidiEnabledChange={setMidiEnabled}
              onMidiInputChange={setSelectedMidiInput}
            />
          </ModuleCard>
        </div>
      </div>
    </div>
  );
}
