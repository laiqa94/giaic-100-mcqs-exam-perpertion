import React, { useState } from 'react';
import { Question } from '../data/types';
import { chapterRecordings } from '../data/chapterRecordings';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Languages,
  Volume2,
  VolumeX,
  Video,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | undefined;
  onSelectAnswer: (option: 'A' | 'B' | 'C' | 'D') => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  showImmediateFeedback?: boolean;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
  canNext: boolean;
  onPlayScenario?: (q: Question) => void;
  onPlayQuestionAndOptions?: (q: Question) => void;
  onPlayOption?: (optionKey: 'A' | 'B' | 'C' | 'D', text: string) => void;
  onPlayUrdu?: (q: Question) => void;
  onPlayRationale?: (q: Question) => void;
  onWatchRecording?: (moduleId: string) => void;
  currentPlayingSection?: string | null;
  isPlayingVoice?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isFlagged,
  onToggleFlag,
  showImmediateFeedback = false,
  currentIndex,
  totalCount,
  onNext,
  onPrev,
  canPrev,
  canNext,
  onPlayScenario,
  onPlayQuestionAndOptions,
  onPlayOption,
  onPlayUrdu,
  onPlayRationale,
  onWatchRecording,
  currentPlayingSection,
  isPlayingVoice,
}) => {
  const [showUrdu, setShowUrdu] = useState<boolean>(true);
  const options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  const hasAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const chapterRec = chapterRecordings.find((r) => r.moduleId === question.moduleId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 text-slate-100 shadow-xl shadow-black/20">
      {/* Top Metadata Row: Unboxed text separated by · */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-indigo-400 font-semibold">
            Q{question.id.toString().padStart(3, '0')}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-300 font-medium">Module {question.moduleNumber}: {question.moduleTitle}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-amber-400/90 font-medium">{question.difficulty}</span>

          {chapterRec && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              {onWatchRecording ? (
                <button
                  onClick={() => onWatchRecording(question.moduleId)}
                  className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer"
                  title="Watch Chapter Recording"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Session 🎥</span>
                </button>
              ) : (
                <a
                  href={chapterRec.videos[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors font-medium"
                  title="Watch Chapter Recording on YouTube"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Session 🎥</span>
                </a>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUrdu(!showUrdu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 transition-colors"
            title="Toggle Roman Urdu summary"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showUrdu ? 'Urdu ON' : 'Urdu OFF'}</span>
          </button>

          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isFlagged
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {isFlagged ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Flagged</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Flag for Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scenario Section */}
      <div
        className={`mb-6 rounded-xl p-4 md:p-5 transition-all ${
          currentPlayingSection === 'scenario'
            ? 'bg-indigo-950/40 border border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
            : 'bg-slate-950/70 border border-slate-800/90'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
            <span>Enterprise Scenario Context</span>
            {currentPlayingSection === 'scenario' && isPlayingVoice && (
              <span className="text-[10px] text-indigo-400 font-mono animate-pulse">● Speaking...</span>
            )}
          </div>

          {onPlayScenario && (
            <button
              onClick={() => onPlayScenario(question)}
              className="text-slate-400 hover:text-indigo-300 p-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px]"
              title="Listen to scenario with AI voice"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voice</span>
            </button>
          )}
        </div>
        <p className="text-slate-200 text-sm md:text-base leading-relaxed">
          {question.scenario}
        </p>
      </div>

      {/* Target Question */}
      <div
        className={`mb-6 p-2 rounded-xl transition-all ${
          currentPlayingSection === 'question'
            ? 'bg-indigo-950/30 border border-indigo-500/40'
            : ''
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base md:text-lg font-semibold text-white leading-snug flex-1">
            {question.question}
          </h3>
          {onPlayQuestionAndOptions && (
            <button
              onClick={() => onPlayQuestionAndOptions(question)}
              className="text-slate-400 hover:text-indigo-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1 text-xs"
              title="Listen to Question and all 4 options"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Read Q & Options</span>
            </button>
          )}
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-8">
        {options.map((key) => {
          const text = question.options[key];
          const isSelected = selectedAnswer === key;
          const isThisCorrect = key === question.correctAnswer;
          const isPlayingThisOption = currentPlayingSection === `option-${key}`;

          let optionStyle = 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/40 hover:bg-slate-800/50 text-slate-300';
          let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

          if (showImmediateFeedback && hasAnswered) {
            if (isThisCorrect) {
              optionStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-100 ring-1 ring-emerald-500/30';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-500';
            } else if (isSelected && !isThisCorrect) {
              optionStyle = 'border-rose-500/60 bg-rose-950/30 text-rose-100 ring-1 ring-rose-500/30';
              badgeStyle = 'bg-rose-600 text-white border-rose-500';
            } else {
              optionStyle = 'border-slate-800/50 bg-slate-950/20 text-slate-500 opacity-60';
              badgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
            }
          } else if (isSelected) {
            optionStyle = 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50 shadow-sm';
            badgeStyle = 'bg-indigo-600 text-white border-indigo-500';
          }

          if (isPlayingThisOption) {
            optionStyle += ' ring-2 ring-indigo-400 bg-indigo-950/30';
          }

          return (
            <div
              key={key}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group ${optionStyle}`}
            >
              <button
                type="button"
                onClick={() => onSelectAnswer(key)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-semibold text-xs shrink-0 border mt-0.5 transition-colors cursor-pointer ${badgeStyle}`}
              >
                {key}
              </button>

              <div
                onClick={() => onSelectAnswer(key)}
                className="flex-1 text-sm md:text-[15px] leading-relaxed pt-0.5 cursor-pointer"
              >
                {text}
              </div>

              {/* Individual Option Voice Button */}
              {onPlayOption && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayOption(key, `Option ${key}: ${text}`);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-indigo-300 hover:bg-slate-800/80 transition-colors shrink-0"
                  title={`Listen to Option ${key}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}

              {showImmediateFeedback && hasAnswered && isThisCorrect && (
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
              )}
              {showImmediateFeedback && hasAnswered && isSelected && !isThisCorrect && (
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Immediate Rationale & Breakdown if enabled and answered */}
      {showImmediateFeedback && hasAnswered && (
        <div className="mb-8 pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            {isCorrect ? (
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Correct Answer: Option {question.correctAnswer}
              </span>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <X className="w-4 h-4" /> Incorrect Selection: Correct is Option {question.correctAnswer}
              </span>
            )}

            {onPlayRationale && (
              <button
                onClick={() => onPlayRationale(question)}
                className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 p-1 rounded hover:bg-slate-800"
                title="Listen to rationale with AI voice"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Rationale</span>
              </button>
            )}
          </div>

          <div
            className={`bg-slate-950 rounded-xl p-4 md:p-5 border transition-all space-y-3 ${
              currentPlayingSection === 'rationale'
                ? 'border-amber-500/50 ring-1 ring-amber-500/30'
                : 'border-slate-800/80'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Engineering Rationale & Core Logic
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {question.rationale}
              </p>
            </div>

            {/* Distractor Breakdown */}
            {question.distractorBreakdown && (
              <div className="pt-2 border-t border-slate-900 space-y-1.5">
                <div className="text-xs font-semibold text-slate-400">
                  Why other options fail in production:
                </div>
                {options.map((opt) => {
                  if (opt === question.correctAnswer) return null;
                  const whyBad = question.distractorBreakdown[opt];
                  if (!whyBad) return null;
                  return (
                    <div key={opt} className="text-xs text-slate-400 pl-2 border-l-2 border-slate-800">
                      <strong className="text-slate-300 font-mono">[{opt}]:</strong> {whyBad}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Roman Urdu Takeaway */}
            {showUrdu && (
              <div
                className={`pt-3 border-t border-slate-800 rounded-lg p-3 transition-all ${
                  currentPlayingSection === 'urdu'
                    ? 'bg-emerald-950/30 border border-emerald-500/40 ring-1 ring-emerald-500/30'
                    : 'bg-indigo-950/20'
                }`}
              >
                <div className="text-xs font-semibold text-indigo-300 mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" />
                    <span>Roman Urdu Concept Takeaway (اردو خلاصہ):</span>
                  </div>
                  {onPlayUrdu && (
                    <button
                      onClick={() => onPlayUrdu(question)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-[11px]"
                      title="Listen to Urdu Voice"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>اردو آواز سنیں</span>
                    </button>
                  )}
                </div>
                <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
                  {question.urduSummary}
                </p>
              </div>
            )}

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <span className="text-slate-500">Core Principle:</span>
              <span className="text-slate-300 font-medium">{question.corePrinciple}</span>
            </div>
          </div>
        </div>
      )}

      {/* Card Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            canPrev
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer'
              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous (P)</span>
        </button>

        <div className="text-slate-400 font-mono">
          Question <span className="text-white font-semibold">{currentIndex + 1}</span> of{' '}
          <span className="text-slate-400">{totalCount}</span>
        </div>

        <button
          onClick={onNext}
          disabled={!canNext}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            canNext
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm cursor-pointer'
              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
          }`}
        >
          <span>Next (N)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
