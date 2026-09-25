/**
 * Audio Player Utilities for Gemini Neural Audio (PCM16 @ 24kHz)
 * and Browser Native Web Speech API fallback.
 */

let sharedAudioContext: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let isAudioPaused = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    sharedAudioContext = new AudioCtx({ sampleRate: 24000 });
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

/**
 * Play Raw PCM 16-bit 24kHz Mono audio returned by Gemini TTS
 */
export function playGeminiPcm(
  base64Data: string,
  sampleRate = 24000,
  onEnd?: () => void,
  onError?: (err: any) => void
): { stop: () => void; pause: () => void; resume: () => void } {
  try {
    stopAllAudio();

    const ctx = getAudioContext();
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32Array.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    currentSourceNode = source;
    isAudioPaused = false;

    source.onended = () => {
      if (currentSourceNode === source) {
        currentSourceNode = null;
      }
      onEnd?.();
    };

    source.start(0);

    return {
      stop: () => {
        try {
          source.stop();
        } catch {}
        currentSourceNode = null;
      },
      pause: () => {
        if (ctx.state === 'running') {
          ctx.suspend();
          isAudioPaused = true;
        }
      },
      resume: () => {
        if (ctx.state === 'suspended') {
          ctx.resume();
          isAudioPaused = false;
        }
      },
    };
  } catch (err) {
    console.error('Failed to play Gemini PCM audio:', err);
    onError?.(err);
    return {
      stop: () => {},
      pause: () => {},
      resume: () => {},
    };
  }
}

/**
 * Play using Web Speech API
 */
export function playWebSpeech(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    voiceName?: string;
    lang?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (e: any) => void;
  }
): { stop: () => void; pause: () => void; resume: () => void } {
  stopAllAudio();

  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    options?.onError?.(new Error('SpeechSynthesis not supported'));
    return { stop: () => {}, pause: () => {}, resume: () => {} };
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip excessive markdown artifacts for natural reading
  const naturalText = text
    .replace(/[`*#_]/g, '')
    .replace(/\[[A-D]\]:/g, 'Option ')
    .replace(/<[^>]*>/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(naturalText);
  utterance.rate = options?.rate ?? 1.0;
  utterance.pitch = options?.pitch ?? 1.0;

  // Try to pick selected voice
  const voices = window.speechSynthesis.getVoices();
  if (options?.voiceName) {
    const selectedVoice = voices.find((v) => v.name === options.voiceName);
    if (selectedVoice) utterance.voice = selectedVoice;
  } else if (options?.lang) {
    const langVoice = voices.find((v) => v.lang.startsWith(options.lang!));
    if (langVoice) utterance.voice = langVoice;
  } else {
    // Prefer modern natural English voice
    const englishVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    );
    if (englishVoice) utterance.voice = englishVoice;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    options?.onError?.(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    },
    pause: () => {
      window.speechSynthesis.pause();
    },
    resume: () => {
      window.speechSynthesis.resume();
    },
  };
}

export function stopAllAudio(): void {
  // Stop Web Audio
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch {}
    currentSourceNode = null;
  }
  if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }

  // Stop SpeechSynthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
