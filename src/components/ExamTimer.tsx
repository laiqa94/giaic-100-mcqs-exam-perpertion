import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  initialSeconds: number; // e.g. 150 * 60 = 9000s
  onTimeExpired: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isRunning: boolean;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  initialSeconds,
  onTimeExpired,
  isPaused,
  onTogglePause,
  isRunning,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isPaused, onTimeExpired]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLowTime = secondsLeft < 600 && secondsLeft > 0; // less than 10 mins

  return (
    <div
      className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border font-mono text-xs transition-colors ${
        isLowTime
          ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse'
          : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-indigo-400'}`} />
        <span className="font-semibold text-sm tabular-nums tracking-wide">
          {formattedTime}
        </span>
      </div>

      <button
        onClick={onTogglePause}
        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        title={isPaused ? 'Resume Timer' : 'Pause Timer'}
      >
        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
