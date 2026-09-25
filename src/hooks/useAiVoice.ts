import { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '../data/types';
import { playGeminiPcm, playWebSpeech, stopAllAudio } from '../utils/audioPlayer';

export type VoiceEngine = 'gemini' | 'browser';
export type GeminiVoiceName = 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';

export interface VoiceSettings {
  engine: VoiceEngine;
  geminiVoice: GeminiVoiceName;
  speed: number;
  autoReadOnNext: boolean;
  urduAccent: boolean;
}

const STORAGE_KEY_VOICE_SETTINGS = 'panaversity_voice_settings_v1';

const defaultSettings: VoiceSettings = {
  engine: 'gemini',
  geminiVoice: 'Kore',
  speed: 1.0,
  autoReadOnNext: false,
  urduAccent: true,
};

export function useAiVoice() {
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOICE_SETTINGS);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [activeVoiceNotice, setActiveVoiceNotice] = useState<string | null>(null);

  const activeControlRef = useRef<{ stop: () => void; pause: () => void; resume: () => void } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VOICE_SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopAllAudio();
    if (activeControlRef.current) {
      activeControlRef.current.stop();
      activeControlRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
    setCurrentSection(null);
  }, []);

  const pause = useCallback(() => {
    if (activeControlRef.current) {
      activeControlRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (activeControlRef.current) {
      activeControlRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  /**
   * Internal speak dispatcher: tries Gemini TTS first if engine='gemini',
   * otherwise or upon error immediately falls back to Web Speech API.
   */
  const speakText = useCallback(
    async (
      text: string,
      sectionName: string,
      stylePrompt?: string,
      isUrduText = false
    ) => {
      stop();
      setIsLoading(true);
      setCurrentSection(sectionName);

      // Function to trigger browser speech fallback
      const fallbackToBrowser = () => {
        setIsLoading(false);
        setIsPlaying(true);
        setActiveVoiceNotice('Browser Voice');
        setTimeout(() => setActiveVoiceNotice(null), 3000);

        const ctrl = playWebSpeech(text, {
          rate: settings.speed,
          lang: isUrduText ? 'ur-PK' : 'en-US',
          onStart: () => {
            setIsLoading(false);
            setIsPlaying(true);
          },
          onEnd: () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentSection(null);
          },
          onError: () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentSection(null);
          },
        });
        activeControlRef.current = ctrl;
      };

      if (settings.engine === 'browser') {
        fallbackToBrowser();
        return;
      }

      // Gemini Neural Voice via /api/tts
      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceName: settings.geminiVoice,
            style:
              stylePrompt ||
              (isUrduText
                ? 'Clear, encouraging teacher explaining in friendly Urdu tone'
                : 'Articulate, professional software systems examiner, authoritative yet clear'),
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        if (!data.audio) {
          throw new Error('No audio returned from Gemini endpoint');
        }

        setIsLoading(false);
        setIsPlaying(true);
        setActiveVoiceNotice(`Gemini AI (${settings.geminiVoice})`);
        setTimeout(() => setActiveVoiceNotice(null), 3500);

        const ctrl = playGeminiPcm(
          data.audio,
          data.sampleRate || 24000,
          () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentSection(null);
          },
          (err) => {
            console.warn('PCM Playback error, falling back to Web Speech', err);
            fallbackToBrowser();
          }
        );

        activeControlRef.current = ctrl;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.warn('Gemini TTS failed or offline, switching to browser voice:', err?.message || err);
        fallbackToBrowser();
      }
    },
    [settings, stop]
  );

  // High-level speak actions for an exam question
  const playScenario = useCallback(
    (q: Question) => {
      const text = `Scenario for Question ${q.id}. ${q.scenario}`;
      speakText(text, 'scenario', 'Careful, deliberate scenario narrator presenting a high-stakes engineering dilemma');
    },
    [speakText]
  );

  const playQuestionAndOptions = useCallback(
    (q: Question) => {
      const text = `${q.question}. Option A: ${q.options.A}. Option B: ${q.options.B}. Option C: ${q.options.C}. Option D: ${q.options.D}.`;
      speakText(text, 'question', 'Precise, clear academic exam reader');
    },
    [speakText]
  );

  const playFullQuestion = useCallback(
    (q: Question) => {
      const text = `Module ${q.moduleNumber}, ${q.moduleTitle}. Question ${q.id}. Scenario: ${q.scenario}. Question: ${q.question}. Option A: ${q.options.A}. Option B: ${q.options.B}. Option C: ${q.options.C}. Option D: ${q.options.D}.`;
      speakText(text, 'full', 'Professional engineering instructor reading complete question');
    },
    [speakText]
  );

  const playUrduExplanation = useCallback(
    (q: Question) => {
      const text = `Roman Urdu Exam Concept: ${q.urduSummary}. Core Principle: ${q.corePrinciple}. Sahi jawab Option ${q.correctAnswer} hai.`;
      speakText(text, 'urdu', 'Warm, supportive mentor explaining the key takeaway in conversational Urdu', true);
    },
    [speakText]
  );

  const playRationale = useCallback(
    (q: Question) => {
      const text = `Correct Answer is Option ${q.correctAnswer}. Engineering Rationale: ${q.rationale}. Core Principle: ${q.corePrinciple}.`;
      speakText(text, 'rationale', 'Senior software architect explaining technical proof and failure modes');
    },
    [speakText]
  );

  return {
    settings,
    setSettings,
    isPlaying,
    isPaused,
    isLoading,
    currentSection,
    activeVoiceNotice,
    stop,
    pause,
    resume,
    speakText,
    playScenario,
    playQuestionAndOptions,
    playFullQuestion,
    playUrduExplanation,
    playRationale,
  };
}
