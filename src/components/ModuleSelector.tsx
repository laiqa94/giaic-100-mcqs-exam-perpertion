import React from 'react';
import { modulesList } from '../data/allQuestions';
import { chapterRecordings } from '../data/chapterRecordings';
import { ModuleInfo } from '../data/types';
import { ExternalLink, Play, BookOpen, CheckCircle, Award, Video } from 'lucide-react';

interface ModuleSelectorProps {
  onSelectModule: (moduleId: string) => void;
  onOpenRecordings?: (moduleId?: string) => void;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  allQuestions: Array<{ id: number; moduleId: string; correctAnswer: 'A' | 'B' | 'C' | 'D' }>;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  onSelectModule,
  onOpenRecordings,
  userAnswers,
  allQuestions,
}) => {
  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
            Panaversity Agent Factory: 10 Course Modules
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Select any course module below to practice its dedicated set of 10 hard scenario-based MCQs.
            Practice mode reveals instant engineering rationales, distractor breakdowns, and Roman Urdu concept takeaways immediately upon answering.
          </p>
        </div>

        {onOpenRecordings && (
          <button
            onClick={() => onOpenRecordings()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-medium text-xs shadow-md shadow-rose-600/20 transition-all shrink-0 cursor-pointer self-start md:self-auto"
          >
            <Video className="w-4 h-4" />
            <span>Watch Live Session Recordings 🎥</span>
          </button>
        )}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modulesList.map((mod) => {
          const modQuestions = allQuestions.filter((q) => q.moduleId === mod.id);
          const recording = chapterRecordings.find((r) => r.moduleId === mod.id);
          const totalInMod = modQuestions.length;
          let answeredInMod = 0;
          let correctInMod = 0;

          modQuestions.forEach((q) => {
            if (userAnswers[q.id] !== undefined) {
              answeredInMod += 1;
              if (userAnswers[q.id] === q.correctAnswer) {
                correctInMod += 1;
              }
            }
          });

          const pct = answeredInMod > 0 ? Math.round((correctInMod / answeredInMod) * 100) : 0;
          const docUrl = `https://agentfactory.panaversity.org/docs/${mod.slug}`;

          return (
            <div
              key={mod.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono text-indigo-400 font-semibold">
                    <span>Module {mod.number.toString().padStart(2, '0')}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300 font-medium">10 Scenarios</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {recording && recording.videos.length > 0 && (
                      <a
                        href={recording.videos[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium transition-colors"
                        title="Watch YouTube Lecture"
                      >
                        <Video className="w-3 h-3" />
                        <span>Lecture 🎥</span>
                      </a>
                    )}
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors"
                      title="View Panaversity Documentation"
                    >
                      <span>Course Doc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {mod.title}
                </h3>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
                  {mod.description}
                </p>

                {/* Key Topics: Unboxed text separated by · */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 mb-5">
                  <span className="text-slate-500 font-medium">Topics:</span>
                  {mod.keyTopics.map((topic, i) => (
                    <React.Fragment key={topic}>
                      <span className="text-slate-300">{topic}</span>
                      {i < mod.keyTopics.length - 1 && (
                        <span aria-hidden="true" className="text-slate-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Progress & Launch Action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">
                    Progress: <strong className="text-white">{answeredInMod}/{totalInMod}</strong>
                  </span>
                  {answeredInMod > 0 && (
                    <span
                      className={`font-mono font-semibold ${
                        pct >= 75 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      ({pct}% acc)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onOpenRecordings && (
                    <button
                      onClick={() => onOpenRecordings(mod.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                      title="Watch recording session"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onSelectModule(mod.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Practice 10 Qs</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
