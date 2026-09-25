import React from 'react';
import { Question, ModuleInfo } from '../data/types';
import { modulesList } from '../data/allQuestions';
import { Award, CheckCircle, XCircle, AlertCircle, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';

interface ExamSummaryModalProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  isOpen: boolean;
  onClose: () => void;
  onReviewMistakes: () => void;
  onRetake: () => void;
}

export const ExamSummaryModal: React.FC<ExamSummaryModalProps> = ({
  questions,
  userAnswers,
  isOpen,
  onClose,
  onReviewMistakes,
  onRetake,
}) => {
  if (!isOpen) return null;

  // Calculate scores
  let correctCount = 0;
  const moduleScores: Record<string, { correct: number; total: number }> = {};

  // initialize modules
  modulesList.forEach((mod) => {
    moduleScores[mod.id] = { correct: 0, total: 0 };
  });

  questions.forEach((q) => {
    if (!moduleScores[q.moduleId]) {
      moduleScores[q.moduleId] = { correct: 0, total: 0 };
    }
    moduleScores[q.moduleId].total += 1;

    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount += 1;
      moduleScores[q.moduleId].correct += 1;
    }
  });

  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = percentage >= 75;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 text-slate-100 shadow-2xl relative my-8">
        {/* Header verdict banner */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg ${
              isPassed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-rose-500/10'
            }`}
          >
            {isPassed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            {isPassed ? 'Exam Passed: Outstanding Competence!' : 'Exam Needs Revision'}
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            {isPassed
              ? 'You demonstrated comprehensive mastery across the 10 Panaversity Agent Factory engineering modules.'
              : 'You scored below the 75% enterprise passing threshold. Review the flagged and missed rationales below.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                {correctCount} / {totalQuestions}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                Raw Score
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800" />

            <div className="text-center">
              <div
                className={`text-3xl font-extrabold font-mono tabular-nums ${
                  isPassed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {percentage}%
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                Percentage
              </div>
            </div>
          </div>
        </div>

        {/* Module breakdown */}
        <div className="py-6">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Module Competency Breakdown
          </h4>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {modulesList.map((mod) => {
              const score = moduleScores[mod.id] || { correct: 0, total: 10 };
              const modPct = Math.round((score.correct / (score.total || 1)) * 100);
              const modPassed = modPct >= 70;

              return (
                <div
                  key={mod.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-medium text-slate-200 truncate">
                      Module {mod.number}: {mod.title}
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          modPassed ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${modPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="font-mono text-right shrink-0">
                    <span className="text-white font-semibold">{score.correct}</span>
                    <span className="text-slate-500">/{score.total}</span>
                    <span
                      className={`ml-2 font-bold ${
                        modPassed ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {modPct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onReviewMistakes}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20 transition-colors"
            >
              <span>Review Missed Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
