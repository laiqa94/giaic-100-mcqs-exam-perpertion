import React, { useState } from 'react';
import { Question } from '../data/types';
import { VoiceSettings, GeminiVoiceName } from '../hooks/useAiVoice';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Settings2,
  Sparkles,
  Languages,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Radio,
  Sliders,
  Check,
} from 'lucide-react';

interface VoiceControlsBarProps {
  question: Question;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentSection: string | null;
  activeVoiceNotice: string | null;
  settings: VoiceSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<VoiceSettings>>;
  onPlayFull: (q: Question) => void;
  onPlayScenario: (q: Question) => void;
  onPlayQuestionAndOptions: (q: Question) => void;
  onPlayUrdu: (q: Question) => void;
  onPlayRationale: (q: Question) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const VoiceControlsBar: React.FC<VoiceControlsBarProps> = ({
  question,
  isPlaying,
  isPaused,
  isLoading,
  currentSection,
  activeVoiceNotice,
  settings,
  onUpdateSettings,
  onPlayFull,
  onPlayScenario,
  onPlayQuestionAndOptions,
  onPlayUrdu,
  onPlayRationale,
  onPause,
  onResume,
  onStop,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const geminiVoices: { name: GeminiVoiceName; label: string; desc: string; gender: string }[] = [
    { name: 'Kore', label: 'Kore', desc: 'Clear Professional Female instructor', gender: 'Female' },
    { name: 'Puck', label: 'Puck', desc: 'Energetic, dynamic tech narrator', gender: 'Male' },
    { name: 'Zephyr', label: 'Zephyr', desc: 'Calm, thoughtful system explainer', gender: 'Neutral' },
    { name: 'Fenrir', label: 'Fenrir', desc: 'Deep authoritative architecture voice', gender: 'Male' },
    { name: 'Charon', label: 'Charon', desc: 'Formal, solemn auditor persona', gender: 'Male' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 md:p-4 text-slate-200 relative overflow-hidden shadow-lg shadow-black/20">
      {/* Background glow when playing */}
      {isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none animate-pulse" />
      )}

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        {/* Left: Engine & Master Control */}
        <div className="flex items-center gap-2.5">
          {/* Main Play / Pause / Stop */}
          {isPlaying ? (
            <div className="flex items-center gap-1.5">
              {isPaused ? (
                <button
                  onClick={onResume}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
                  title="Resume AI Voice"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">Resume</span>
                </button>
              ) : (
                <button
                  onClick={onPause}
                  className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
                  title="Pause AI Voice"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">Pause</span>
                </button>
              )}
              <button
                onClick={onStop}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                title="Stop AI Voice"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onPlayFull(question)}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
              title="Play complete scenario, question and all options"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isLoading ? 'Generating Audio...' : 'Read Full Question'}</span>
            </button>
          )}

          {/* Voice Waveform Equalizer indicator */}
          {isPlaying && (
            <div className="flex items-center gap-0.5 px-2 py-1 bg-indigo-950/70 rounded-lg border border-indigo-500/30">
              <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
              <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            </div>
          )}

          {activeVoiceNotice && (
            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30 animate-fade-in">
              {activeVoiceNotice}
            </span>
          )}
        </div>

        {/* Center: Targeted Speech Section Triggers */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs">
          <button
            onClick={() => onPlayScenario(question)}
            className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 whitespace-nowrap ${
              currentSection === 'scenario'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Read Scenario context only"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scenario</span>
          </button>

          <button
            onClick={() => onPlayQuestionAndOptions(question)}
            className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 whitespace-nowrap ${
              currentSection === 'question'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Read Question statement and 4 options"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Question & Options</span>
          </button>

          <button
            onClick={() => onPlayUrdu(question)}
            className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 whitespace-nowrap ${
              currentSection === 'urdu'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-emerald-950/30 hover:bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
            }`}
            title="Listen to Roman Urdu summary & key exam takeaway"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>اردو آواز (Urdu Voice)</span>
          </button>

          <button
            onClick={() => onPlayRationale(question)}
            className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 whitespace-nowrap ${
              currentSection === 'rationale'
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Listen to the core engineering proof & rationale"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Rationale</span>
          </button>
        </div>

        {/* Right: Settings Modal Launcher */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span>Voice:</span>
            <span className="text-indigo-300 font-semibold">
              {settings.engine === 'gemini' ? `Gemini (${settings.geminiVoice})` : 'Browser Speech'}
            </span>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1 text-xs"
            title="AI Voice Settings"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Voice Configuration Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">AI Voice Narration Settings</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Select Engine */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Voice Generation Engine
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, engine: 'gemini' }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.engine === 'gemini'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold text-xs text-indigo-300 flex items-center justify-between">
                    <span>Gemini Neural Voice</span>
                    {settings.engine === 'gemini' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Natural, human-like studio quality (Gemini 3.8 Flash Lite TTS)
                  </div>
                </button>

                <button
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, engine: 'browser' }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.engine === 'browser'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold text-xs text-indigo-300 flex items-center justify-between">
                    <span>Browser Web Speech</span>
                    {settings.engine === 'browser' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Instant sub-millisecond, zero latency, works offline
                  </div>
                </button>
              </div>
            </div>

            {/* Select Gemini Voice Character */}
            {settings.engine === 'gemini' && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Gemini Voice Persona
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {geminiVoices.map((v) => {
                    const isSelected = settings.geminiVoice === v.name;
                    return (
                      <button
                        key={v.name}
                        onClick={() => onUpdateSettings((prev) => ({ ...prev, geminiVoice: v.name }))}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-950/50 border-indigo-500 text-white font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-200">
                            {v.label} <span className="text-slate-500 font-normal">({v.gender})</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{v.desc}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Speed slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  Speech Speed
                </span>
                <span className="font-mono text-indigo-300 font-semibold">{settings.speed}x</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0.8, 1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => onUpdateSettings((prev) => ({ ...prev, speed: spd }))}
                    className={`py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                      settings.speed === spd
                        ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Read on Next */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">Auto-Read On Next Question</div>
                <div className="text-[11px] text-slate-400">
                  Automatically start voice reading when moving to next scenario
                </div>
              </div>
              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, autoReadOnNext: !prev.autoReadOnNext }))
                }
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.autoReadOnNext ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    settings.autoReadOnNext ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
