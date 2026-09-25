import React, { useState } from 'react';
import { Question } from '../data/types';
import { Bookmark, CheckCircle, XCircle, Search, Filter, Languages, ExternalLink, Volume2, VolumeX } from 'lucide-react';

interface ReviewCenterProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestions: Set<number>;
  onToggleFlag: (id: number) => void;
  onPlayVoice?: (text: string, label: string) => void;
  onStopVoice?: () => void;
  voiceIsPlaying?: boolean;
}

export const ReviewCenter: React.FC<ReviewCenterProps> = ({
  questions,
  userAnswers,
  flaggedQuestions,
  onToggleFlag,
  onPlayVoice,
  onStopVoice,
  voiceIsPlaying,
}) => {
  const [filterType, setFilterType] = useState<'incorrect' | 'flagged' | 'all-attempted'>('incorrect');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const filteredQuestions = questions.filter((q) => {
    const userAnswer = userAnswers[q.id];
    const isAnswered = userAnswer !== undefined;
    const isIncorrect = isAnswered && userAnswer !== q.correctAnswer;
    const isFlagged = flaggedQuestions.has(q.id);

    if (filterType === 'incorrect' && !isIncorrect) return false;
    if (filterType === 'flagged' && !isFlagged) return false;
    if (filterType === 'all-attempted' && !isAnswered) return false;

    if (selectedModule !== 'all' && q.moduleId !== selectedModule) return false;

    if (searchQuery.trim()) {
      const qText = `${q.scenario} ${q.question} ${q.corePrinciple} ${q.moduleTitle} ${q.urduSummary}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  const incorrectCount = questions.filter(
    (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctAnswer
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
          Diagnostic Mistakes & Review Center
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Deepen your engineering intuition by analyzing where your assumptions failed.
          Review the detailed enterprise rationales, why the distractors were dangerous in production, and the Roman Urdu takeaways.
        </p>

        {/* Filter controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterType('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Incorrect ({incorrectCount})
            </button>
            <button
              onClick={() => setFilterType('flagged')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'flagged'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flagged ({flaggedQuestions.size})
            </button>
            <button
              onClick={() => setFilterType('all-attempted')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'all-attempted'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Attempted ({Object.keys(userAnswers).length})
            </button>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scenarios, principles, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Review List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <CheckCircle className="w-12 h-12 text-emerald-400/50 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-200 mb-1">
            No questions found for this filter
          </h4>
          <p className="text-xs text-slate-500">
            {filterType === 'incorrect'
              ? 'Great work! You haven\'t logged any incorrect answers matching your search criteria.'
              : 'Try changing the filter or search query above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredQuestions.map((q) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            const isFlagged = flaggedQuestions.has(q.id);

            return (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-7 text-slate-200 shadow-md"
              >
                {/* Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 font-bold">
                      Q{q.id.toString().padStart(3, '0')}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300">Module {q.moduleNumber}: {q.moduleTitle}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{q.corePrinciple}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {userAnswer ? (
                      isCorrect ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                          <CheckCircle className="w-3.5 h-3.5" /> Solved
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold flex items-center gap-1 font-mono">
                          <XCircle className="w-3.5 h-3.5" /> Wrong: Picked {userAnswer}
                        </span>
                      )
                    ) : (
                      <span className="text-slate-500 font-mono">Not Answered</span>
                    )}

                    {onPlayVoice && (
                      <button
                        onClick={() =>
                          onPlayVoice(
                            `Question ${q.id}. Module: ${q.moduleTitle}. Scenario: ${q.scenario}. Question: ${q.question}. Correct answer is Option ${q.correctAnswer}: ${q.options[q.correctAnswer]}. Rationale: ${q.rationale}`,
                            `review-${q.id}`
                          )
                        }
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors ml-1"
                        title="Listen to full review audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onToggleFlag(q.id)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors ml-1"
                      title="Toggle Flag"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isFlagged ? 'text-amber-400 fill-amber-400' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Scenario */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                  <strong className="text-slate-400 block mb-1 font-mono uppercase tracking-wider text-[11px]">
                    Scenario
                  </strong>
                  {q.scenario}
                </div>

                {/* Question */}
                <h4 className="text-sm md:text-base font-semibold text-white mb-4">
                  {q.question}
                </h4>

                {/* Options display with correct highlighted */}
                <div className="space-y-2 mb-5">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const isUserChoice = userAnswer === key;
                    const isRightChoice = key === q.correctAnswer;

                    let rowStyle = 'bg-slate-950/40 border-slate-800/80 text-slate-400';
                    let badgeStyle = 'bg-slate-800 text-slate-400';

                    if (isRightChoice) {
                      rowStyle = 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100 font-medium';
                      badgeStyle = 'bg-emerald-600 text-white';
                    } else if (isUserChoice) {
                      rowStyle = 'bg-rose-950/30 border-rose-500/50 text-rose-100';
                      badgeStyle = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={key}
                        className={`p-3 rounded-xl border text-xs md:text-sm flex items-start gap-3 ${rowStyle}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-semibold text-xs shrink-0 mt-0.5 ${badgeStyle}`}
                        >
                          {key}
                        </div>
                        <div className="flex-1 leading-relaxed">{q.options[key]}</div>
                        {isRightChoice && (
                          <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0 self-center">
                            CORRECT
                          </span>
                        )}
                        {isUserChoice && !isRightChoice && (
                          <span className="text-[11px] font-mono text-rose-400 font-bold shrink-0 self-center">
                            YOUR CHOICE
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-3 text-xs md:text-sm">
                  <div>
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Engineering Rationale:
                    </div>
                    <p className="text-slate-300 leading-relaxed">{q.rationale}</p>
                  </div>

                  {/* Roman Urdu Takeaway */}
                  <div className="pt-2 border-t border-slate-800/80 bg-indigo-950/20 p-2.5 rounded-lg flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-indigo-300 mb-0.5 flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5" />
                        <span>Roman Urdu Takeaway (اردو خلاصہ):</span>
                      </div>
                      <p className="text-xs text-indigo-200/90 leading-relaxed">{q.urduSummary}</p>
                    </div>
                    {onPlayVoice && (
                      <button
                        onClick={() =>
                          onPlayVoice(
                            `Roman Urdu Summary: ${q.urduSummary}. Sahi jawab option ${q.correctAnswer} hai. Principle: ${q.corePrinciple}`,
                            `urdu-${q.id}`
                          )
                        }
                        className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[11px] font-medium flex items-center gap-1 shrink-0 transition-colors"
                        title="Sunen (Listen in Urdu voice)"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Sunen</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
