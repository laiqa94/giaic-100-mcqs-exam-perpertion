import React, { useState, useEffect, useCallback } from 'react';
import { allQuestions, modulesList, getQuestionsByModule, getRandomDrill } from './data/allQuestions';
import { Question } from './data/types';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { QuestionMatrix } from './components/QuestionMatrix';
import { ExamTimer } from './components/ExamTimer';
import { ExamSummaryModal } from './components/ExamSummaryModal';
import { ModuleSelector } from './components/ModuleSelector';
import { ReviewCenter } from './components/ReviewCenter';
import { StudySheetView } from './components/StudySheetView';
import { VoiceControlsBar } from './components/VoiceControlsBar';
import { RecordingsHub } from './components/RecordingsHub';
import { useAiVoice } from './hooks/useAiVoice';
import { Play, CheckCircle, RotateCcw, AlertCircle, Bookmark, Zap, BookOpen, Send, Sparkles, Video } from 'lucide-react';

const STORAGE_KEY_ANSWERS = 'panaversity_exam_answers_v1';
const STORAGE_KEY_FLAGS = 'panaversity_exam_flags_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'mock-exam' | 'modules' | 'recordings' | 'quick-drill' | 'review' | 'study-sheet'>('mock-exam');
  
  // Current active set of questions
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(allQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedModuleTitle, setSelectedModuleTitle] = useState<string | null>(null);

  // User state
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FLAGS);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Exam flow states
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [showImmediateFeedback, setShowImmediateFeedback] = useState<boolean>(false);

  // Timer states
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // AI Voice Hook
  const voice = useAiVoice();

  // Persist answers and flags
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(userAnswers));
    } catch (e) {
      console.error('Failed to save answers', e);
    }
  }, [userAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FLAGS, JSON.stringify(Array.from(flaggedQuestions)));
    } catch (e) {
      console.error('Failed to save flags', e);
    }
  }, [flaggedQuestions]);

  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0];

  // Actions
  const handleSelectAnswer = useCallback((option: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  }, [currentQuestion]);

  const handleToggleFlag = useCallback((id?: number) => {
    const targetId = id ?? currentQuestion?.id;
    if (!targetId) return;

    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(targetId)) {
        next.delete(targetId);
      } else {
        next.add(targetId);
      }
      return next;
    });
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, activeQuestions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ignore when user is typing in search or input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '1' || e.key.toLowerCase() === 'a') {
        handleSelectAnswer('A');
      } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
        handleSelectAnswer('B');
      } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
        handleSelectAnswer('C');
      } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
        handleSelectAnswer('D');
      } else if (e.key.toLowerCase() === 'n' || e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key.toLowerCase() === 'p' || e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key.toLowerCase() === 'f') {
        handleToggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectAnswer, handleNext, handlePrev, handleToggleFlag]);

  // Switch to Mock Exam (100)
  const handleStartFullMock = () => {
    setActiveQuestions(allQuestions);
    setCurrentIndex(0);
    setSelectedModuleTitle(null);
    setShowImmediateFeedback(false);
    setIsExamSubmitted(false);
    setIsTimerRunning(true);
    setIsTimerPaused(false);
    setActiveTab('mock-exam');
  };

  // Launch Module Practice
  const handleLaunchModule = (moduleId: string) => {
    const modQuestions = getQuestionsByModule(moduleId);
    const modInfo = modulesList.find((m) => m.id === moduleId);
    setActiveQuestions(modQuestions);
    setCurrentIndex(0);
    setSelectedModuleTitle(modInfo ? `Module ${modInfo.number}: ${modInfo.title}` : null);
    setShowImmediateFeedback(true); // Instant feedback for practice
    setIsExamSubmitted(false);
    setIsTimerRunning(false);
    setActiveTab('mock-exam');
  };

  // Launch Quick Drill (20)
  const handleLaunchQuickDrill = () => {
    const drill = getRandomDrill(20);
    setActiveQuestions(drill);
    setCurrentIndex(0);
    setSelectedModuleTitle('Quick Drill (20 Randomized Hard Scenarios)');
    setShowImmediateFeedback(true);
    setIsExamSubmitted(false);
    setIsTimerRunning(false);
    setActiveTab('mock-exam');
  };

  // Submit Exam
  const handleSubmitExam = () => {
    const answeredCount = activeQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
    const unansweredCount = activeQuestions.length - answeredCount;

    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered questions out of ${activeQuestions.length}.\n\nAre you sure you want to finish and submit now?`
      );
      if (!confirmSubmit) return;
    }

    setIsExamSubmitted(true);
    setShowImmediateFeedback(true);
    setIsTimerRunning(false);
    setShowSummaryModal(true);
  };

  // Reset Progress
  const handleResetProgress = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all your answers and flags? This cannot be undone.'
    );
    if (!confirmReset) return;

    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setIsExamSubmitted(false);
    setShowImmediateFeedback(false);
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_FLAGS);
  };

  const answeredActiveCount = activeQuestions.filter((q) => userAnswers[q.id] !== undefined).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'mock-exam' && activeQuestions.length !== 100 && !selectedModuleTitle) {
            setActiveQuestions(allQuestions);
          }
        }}
        examStarted={!isExamSubmitted}
        onResetProgress={handleResetProgress}
        answeredCount={Object.keys(userAnswers).length}
        totalQuestions={allQuestions.length}
      />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {/* TAB 1: MOCK EXAM / TESTING ARENA */}
        {activeTab === 'mock-exam' && (
          <div className="space-y-6">
            {/* Top Subheader Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-indigo-400">
                    {selectedModuleTitle || 'Panaversity 100 Scenario Official Mock Exam'}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{activeQuestions.length} Questions</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-emerald-400 font-medium">Enterprise Hard Wording</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  Answered: {answeredActiveCount} / {activeQuestions.length} (
                  {Math.round((answeredActiveCount / activeQuestions.length) * 100)}%)
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Instant Feedback Toggle */}
                <button
                  onClick={() => setShowImmediateFeedback(!showImmediateFeedback)}
                  className={`text-xs px-3 py-2 rounded-xl border transition-colors font-medium ${
                    showImmediateFeedback
                      ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle instant rationale reveal"
                >
                  {showImmediateFeedback ? 'Immediate Rationale: ON' : 'Immediate Rationale: OFF'}
                </button>

                {/* Exam Countdown Timer (active during full mock) */}
                {isTimerRunning && (
                  <ExamTimer
                    initialSeconds={150 * 60} // 150 minutes
                    onTimeExpired={() => {
                      alert('Time has expired! Submitting your exam...');
                      handleSubmitExam();
                    }}
                    isPaused={isTimerPaused}
                    onTogglePause={() => setIsTimerPaused(!isTimerPaused)}
                    isRunning={isTimerRunning}
                  />
                )}

                {/* Submit Exam Button */}
                {!isExamSubmitted ? (
                  <button
                    onClick={handleSubmitExam}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Finish Exam</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSummaryModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Score Report</span>
                  </button>
                )}
              </div>
            </div>

            {/* Split Arena Layout: Question Card on Left (65%), Matrix on Right (35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-4">
                {/* AI Voice Controls Bar */}
                {currentQuestion && (
                  <VoiceControlsBar
                    question={currentQuestion}
                    isPlaying={voice.isPlaying}
                    isPaused={voice.isPaused}
                    isLoading={voice.isLoading}
                    currentSection={voice.currentSection}
                    activeVoiceNotice={voice.activeVoiceNotice}
                    settings={voice.settings}
                    onUpdateSettings={voice.setSettings}
                    onPlayFull={voice.playFullQuestion}
                    onPlayScenario={voice.playScenario}
                    onPlayQuestionAndOptions={voice.playQuestionAndOptions}
                    onPlayUrdu={voice.playUrduExplanation}
                    onPlayRationale={voice.playRationale}
                    onPause={voice.pause}
                    onResume={voice.resume}
                    onStop={voice.stop}
                  />
                )}

                {currentQuestion && (
                  <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={userAnswers[currentQuestion.id]}
                    onSelectAnswer={handleSelectAnswer}
                    isFlagged={flaggedQuestions.has(currentQuestion.id)}
                    onToggleFlag={handleToggleFlag}
                    showImmediateFeedback={showImmediateFeedback || isExamSubmitted}
                    currentIndex={currentIndex}
                    totalCount={activeQuestions.length}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    canNext={currentIndex < activeQuestions.length - 1}
                    canPrev={currentIndex > 0}
                    onPlayScenario={() => voice.playScenario(currentQuestion)}
                    onPlayQuestionAndOptions={() => voice.playQuestionAndOptions(currentQuestion)}
                    onPlayOption={(key, text) =>
                      voice.speakText(`Option ${key}: ${text}`, `option-${key}`, 'Clear exam reader')
                    }
                    onPlayUrdu={() => voice.playUrduExplanation(currentQuestion)}
                    onPlayRationale={() => voice.playRationale(currentQuestion)}
                    onWatchRecording={() => setActiveTab('recordings')}
                    currentPlayingSection={voice.currentSection}
                    isPlayingVoice={voice.isPlaying}
                  />
                )}

                {/* Keyboard Shortcuts Hint Bar */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>Keys:</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">1-4</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">A-D</kbd> Select</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">N</kbd> Next</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">P</kbd> Previous</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">F</kbd> Flag</span>
                  </div>
                  <div>Panaversity Certified Agent Exam Preparation</div>
                </div>
              </div>

              {/* Right Side Matrix & Quick Nav */}
              <div className="lg:col-span-4 space-y-4">
                <QuestionMatrix
                  questions={activeQuestions}
                  userAnswers={userAnswers}
                  flaggedQuestions={flaggedQuestions}
                  currentIndex={currentIndex}
                  onSelectIndex={(idx) => setCurrentIndex(idx)}
                  isExamSubmitted={isExamSubmitted}
                />

                {/* Quick actions box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                  <div className="font-semibold text-slate-300 pb-2 border-b border-slate-800">
                    Exam Navigation Actions
                  </div>
                  <button
                    onClick={() => setActiveTab('recordings')}
                    className="w-full text-left py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/50 text-rose-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium">All 10 Chapters Recordings 🎥</span>
                    <span className="font-mono text-rose-400 text-[10px]">Watch</span>
                  </button>
                  <button
                    onClick={handleStartFullMock}
                    className="w-full text-left py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Load Full 100 Mock Exam</span>
                    <span className="font-mono text-slate-500 text-[10px]">100 Qs</span>
                  </button>
                  <button
                    onClick={handleLaunchQuickDrill}
                    className="w-full text-left py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Random 20 Quick Drill</span>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('modules')}
                    className="w-full text-left py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Browse 10 Modules</span>
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CHAPTER RECORDINGS */}
        {activeTab === 'recordings' && (
          <RecordingsHub onPracticeModule={handleLaunchModule} />
        )}

        {/* TAB 2: MODULE SELECTOR */}
        {activeTab === 'modules' && (
          <ModuleSelector
            onSelectModule={handleLaunchModule}
            onOpenRecordings={() => setActiveTab('recordings')}
            userAnswers={userAnswers}
            allQuestions={allQuestions}
          />
        )}

        {/* TAB 3: QUICK DRILL */}
        {activeTab === 'quick-drill' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">20 Hard Scenarios Quick Drill</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Randomly pulls 20 rigorous scenario questions from across all 10 Panaversity Agent Factory modules with instant rationales enabled.
            </p>
            <button
              onClick={handleLaunchQuickDrill}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 20 Quick Drill Now</span>
            </button>
          </div>
        )}

        {/* TAB 4: REVIEW & MISTAKES CENTER */}
        {activeTab === 'review' && (
          <ReviewCenter
            questions={allQuestions}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={handleToggleFlag}
            onPlayVoice={(text, label) => voice.speakText(text, label)}
            onStopVoice={voice.stop}
            voiceIsPlaying={voice.isPlaying}
          />
        )}

        {/* TAB 5: STUDY SHEET & RATIONALES (PRINTABLE) */}
        {activeTab === 'study-sheet' && (
          <StudySheetView questions={allQuestions} />
        )}
      </main>

      {/* Exam Summary Modal */}
      <ExamSummaryModal
        questions={activeQuestions}
        userAnswers={userAnswers}
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        onReviewMistakes={() => {
          setShowSummaryModal(false);
          setActiveTab('review');
        }}
        onRetake={() => {
          setShowSummaryModal(false);
          handleStartFullMock();
        }}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-4 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            Panaversity Agent Factory Crash Courses Exam Preparation · All 10 Modules · 100 Hard Scenarios
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>May Allah grant success to all students 🤲🏻✨</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
