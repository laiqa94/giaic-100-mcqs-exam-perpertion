import React, { useState } from 'react';
import { Question } from '../data/types';
import { modulesList } from '../data/allQuestions';
import { chapterRecordings } from '../data/chapterRecordings';
import { Printer, Search, ChevronDown, ChevronUp, BookOpen, ExternalLink, Languages, Check, Video } from 'lucide-react';

interface StudySheetViewProps {
  questions: Question[];
}

export const StudySheetView: React.FC<StudySheetViewProps> = ({ questions }) => {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedAll, setExpandedAll] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = () => {
    const nextState = !expandedAll;
    setExpandedAll(nextState);
    const updated: Record<number, boolean> = {};
    questions.forEach((q) => {
      updated[q.id] = nextState;
    });
    setExpandedItems(updated);
  };

  const filtered = questions.filter((q) => {
    if (selectedModule !== 'all' && q.moduleId !== selectedModule) return false;
    if (search.trim()) {
      const haystack = `${q.id} ${q.scenario} ${q.question} ${q.corePrinciple} ${q.urduSummary} ${q.moduleTitle}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 print:border-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
              Panaversity 100 Scenario Exam Study Sheet & Rationales
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Complete, verified reference curriculum covering all 100 scenario questions across the 10 crash courses.
              Use this high-density study guide for rapid pre-exam revision or print for offline review.
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handleToggleAll}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {expandedAll ? 'Collapse All Details' : 'Expand All Details'}
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 print:hidden">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All 10 Modules (100 Questions)</option>
            {modulesList.map((m) => (
              <option key={m.id} value={m.id}>
                Module {m.number}: {m.title}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by principle, keyword, or question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((q) => {
          const isExpanded = expandedItems[q.id] || expandedAll;

          return (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 transition-all print:border-b print:border-slate-300 print:text-black print:bg-white"
            >
              <div
                onClick={() => toggleItem(q.id)}
                className="cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="font-mono text-indigo-400 font-bold">
                      Q{q.id.toString().padStart(3, '0')}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300 font-medium">Module {q.moduleNumber}: {q.moduleTitle}</span>
                    {(() => {
                      const rec = chapterRecordings.find((r) => r.moduleId === q.moduleId);
                      if (rec && rec.videos.length > 0) {
                        return (
                          <>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <a
                              href={rec.videos[0].url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium print:hidden"
                              title="Watch Lecture on YouTube"
                            >
                              <Video className="w-3 h-3" />
                              <span>Lecture 🎥</span>
                            </a>
                          </>
                        );
                      }
                      return null;
                    })()}
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-amber-400 font-mono text-[11px]">{q.corePrinciple}</span>
                  </div>

                  <h3 className="text-sm md:text-base font-semibold text-white print:text-black leading-snug">
                    {q.question}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0 print:hidden">
                  <div className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                    Key: [{q.correctAnswer}]
                  </div>
                  <button className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Scenario snippet */}
              <div className="mt-3 text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <strong className="text-slate-300">Scenario:</strong> {q.scenario}
              </div>

              {/* Answer options */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                  const isCorrect = opt === q.correctAnswer;
                  return (
                    <div
                      key={opt}
                      className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                          : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center font-mono font-semibold text-[10px] shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {opt}
                      </span>
                      <span className="flex-1 leading-relaxed">{q.options[opt]}</span>
                    </div>
                  );
                })}
              </div>

              {/* Expanded rationale */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs md:text-sm">
                  <div>
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Engineering Rationale & Proof
                    </div>
                    <p className="text-slate-300 leading-relaxed">{q.rationale}</p>
                  </div>

                  {/* Roman Urdu summary */}
                  <div className="bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-xl">
                    <div className="text-xs font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5" />
                      <span>Roman Urdu Exam Takeaway (اردو خلاصہ):</span>
                    </div>
                    <p className="text-xs text-indigo-200/90 leading-relaxed">{q.urduSummary}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
