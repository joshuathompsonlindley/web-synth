"use client";

import { AmplitudeController } from "@/components/synth-controls/amp-control";
import { OsciallatorController } from "@/components/synth-controls/osc-control";
import { VoiceController } from "@/components/synth-controls/voice-control";

interface OsciallatorModuleProps {
  osc1Waveform: OscillatorType;
  osc1Level: number;
  osc1Detune: number;
  osc2Waveform: OscillatorType;
  osc2Level: number;
  osc2Detune: number;
  onOsc1WaveformChange: (waveform: OscillatorType) => void;
  onOsc1LevelChange: (level: number) => void;
  onOsc1DetuneChange: (detune: number) => void;
  onOsc2WaveformChange: (waveform: OscillatorType) => void;
  onOsc2LevelChange: (level: number) => void;
  onOsc2DetuneChange: (detune: number) => void;
  isMonophonic: boolean;
  glideTime: number;
  onMonophonicChange: (mono: boolean) => void;
  onGlideTimeChange: (time: number) => void;
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
  onAttackChange: (value: number) => void;
  onDecayChange: (value: number) => void;
  onSustainChange: (value: number) => void;
  onReleaseChange: (value: number) => void;
}

export function OscillatorProps({
  osc1Waveform,
  osc1Level,
  osc1Detune,
  osc2Waveform,
  osc2Level,
  osc2Detune,
  onOsc1WaveformChange,
  onOsc1LevelChange,
  onOsc1DetuneChange,
  onOsc2WaveformChange,
  onOsc2LevelChange,
  onOsc2DetuneChange,
  isMonophonic,
  glideTime,
  onMonophonicChange,
  onGlideTimeChange,
  attackTime,
  decayTime,
  sustainLevel,
  releaseTime,
  onAttackChange,
  onDecayChange,
  onSustainChange,
  onReleaseChange,
}: OsciallatorModuleProps) {
  return (
    <div className="flex flex-col gap-6">
      <OsciallatorController
        waveform={osc1Waveform}
        level={osc1Level}
        oscNumber={1}
        detune={osc1Detune}
        onDetuneChange={onOsc1DetuneChange}
        onLevelChange={onOsc1LevelChange}
        onWaveformChange={onOsc1WaveformChange}
      />
      <OsciallatorController
        waveform={osc2Waveform}
        level={osc2Level}
        detune={osc2Detune}
        oscNumber={2}
        onDetuneChange={onOsc2DetuneChange}
        onLevelChange={onOsc2LevelChange}
        onWaveformChange={onOsc2WaveformChange}
      />
      <VoiceController
        isMonophonic={isMonophonic}
        glideTime={glideTime}
        onMonophonicChange={onMonophonicChange}
        onGlideTimeChange={onGlideTimeChange}
      />
      <AmplitudeController
        attackTime={attackTime}
        decayTime={decayTime}
        sustainLevel={sustainLevel}
        releaseTime={releaseTime}
        onAttackChange={onAttackChange}
        onDecayChange={onDecayChange}
        onSustainChange={onSustainChange}
        onReleaseChange={onReleaseChange}
      />
    </div>
  );
}
