import React from 'react';
import { BookOpen, Award, CheckCircle, RotateCcw, Clock, Sparkles, Video } from 'lucide-react';

interface HeaderProps {
  activeTab: 'mock-exam' | 'modules' | 'recordings' | 'quick-drill' | 'review' | 'study-sheet';
  setActiveTab: (tab: 'mock-exam' | 'modules' | 'recordings' | 'quick-drill' | 'review' | 'study-sheet') => void;
  examStarted: boolean;
  onResetProgress: () => void;
  answeredCount: number;
  totalQuestions: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  examStarted,
  onResetProgress,
  answeredCount,
  totalQuestions,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('mock-exam');
            }}
            className="text-lg lg:text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md shadow-indigo-500/20">
              AF
            </div>
            <span>Panaversity Agent Factory</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs lg:text-sm font-medium">
          <button
            onClick={() => setActiveTab('recordings')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'recordings'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-rose-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
            <span>Recordings 🎥</span>
          </button>
          <button
            onClick={() => setActiveTab('mock-exam')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'mock-exam'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Mock Exam (100)
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'modules'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            10 Course Modules
          </button>
          <button
            onClick={() => setActiveTab('quick-drill')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'quick-drill'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Quick Drill (20)
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'review'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Review & Mistakes
          </button>
          <button
            onClick={() => setActiveTab('study-sheet')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'study-sheet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            100 Qs Study Sheet
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200 font-medium">{answeredCount}</span>
            <span>/</span>
            <span>{totalQuestions}</span>
            <span className="text-slate-500">solved</span>
          </div>

          <button
            onClick={onResetProgress}
            title="Reset answers and progress"
            className="p-1.5 lg:px-2.5 lg:py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors text-xs flex items-center gap-1.5 border border-transparent hover:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className="md:hidden flex items-center justify-between gap-1 overflow-x-auto pt-2.5 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('recordings')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'recordings' ? 'bg-rose-600 text-white' : 'text-rose-300'
          }`}
        >
          🎥 Recordings
        </button>
        <button
          onClick={() => setActiveTab('mock-exam')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'mock-exam' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Mock (100)
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'modules' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Modules
        </button>
        <button
          onClick={() => setActiveTab('quick-drill')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'quick-drill' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Drill
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'review' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Mistakes
        </button>
        <button
          onClick={() => setActiveTab('study-sheet')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'study-sheet' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Study Sheet
        </button>
      </div>
    </header>
  );
};
