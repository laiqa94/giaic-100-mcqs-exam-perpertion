import React, { useState } from 'react';
import { Question } from '../data/types';
import { Bookmark, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface QuestionMatrixProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestions: Set<number>;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  isExamSubmitted?: boolean;
}

export const QuestionMatrix: React.FC<QuestionMatrixProps> = ({
  questions,
  userAnswers,
  flaggedQuestions,
  currentIndex,
  onSelectIndex,
  isExamSubmitted = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'flagged'>('all');

  const filteredIndexes = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q, idx }) => {
      const isAnswered = userAnswers[q.id] !== undefined;
      const isFlagged = flaggedQuestions.has(q.id);

      if (filter === 'unanswered') return !isAnswered;
      if (filter === 'flagged') return isFlagged;
      return true;
    });

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = flaggedQuestions.size;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <h4 className="text-sm font-semibold text-white">
          Question Navigator ({questions.length})
        </h4>
        <span className="text-xs text-slate-400 font-mono">
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg mb-4 text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-md transition-colors text-center ${
            filter === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({questions.length})
        </button>
        <button
          onClick={() => setFilter('unanswered')}
          className={`flex-1 py-1.5 rounded-md transition-colors text-center ${
            filter === 'unanswered'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Left ({unansweredCount})
        </button>
        <button
          onClick={() => setFilter('flagged')}
          className={`flex-1 py-1.5 rounded-md transition-colors text-center ${
            filter === 'flagged'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Flagged ({flaggedCount})
        </button>
      </div>

      {/* Question Number Badges Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredIndexes.map(({ q, idx }) => {
          const isAnswered = userAnswers[q.id] !== undefined;
          const isFlagged = flaggedQuestions.has(q.id);
          const isCurrent = idx === currentIndex;
          const isCorrect = userAnswers[q.id] === q.correctAnswer;

          let bg = 'bg-slate-950/80 text-slate-400 border-slate-800/80 hover:border-slate-700';

          if (isExamSubmitted) {
            if (isAnswered) {
              if (isCorrect) {
                bg = 'bg-emerald-950/50 text-emerald-300 border-emerald-500/50';
              } else {
                bg = 'bg-rose-950/50 text-rose-300 border-rose-500/50';
              }
            } else {
              bg = 'bg-slate-950/40 text-slate-600 border-slate-900';
            }
          } else if (isAnswered) {
            bg = 'bg-indigo-950/60 text-indigo-200 border-indigo-500/40 font-semibold';
          }

          if (isCurrent) {
            bg += ' ring-2 ring-indigo-400 text-white font-bold shadow-md';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectIndex(idx)}
              className={`relative h-9 rounded-lg border text-xs font-mono transition-all flex items-center justify-center cursor-pointer ${bg}`}
              title={`Q${q.id}: ${q.moduleTitle} (${isAnswered ? 'Answered: ' + userAnswers[q.id] : 'Unanswered'})`}
            >
              <span>{q.id}</span>
              {isFlagged && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-indigo-950 border border-indigo-500/40" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-slate-950 border border-slate-800" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Flagged</span>
        </div>
      </div>
    </div>
  );
};
