import React, { useState, useEffect } from 'react';
import {
  chapterRecordings,
  ChapterRecording,
  ChapterVideo,
  SHARE_STUDENTS_MESSAGE,
} from '../data/chapterRecordings';
import {
  Play,
  CheckCircle2,
  Circle,
  ExternalLink,
  Share2,
  Check,
  Video,
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Search,
  ListOrdered,
  X,
  Volume2,
} from 'lucide-react';

interface RecordingsHubProps {
  onPracticeModule: (moduleId: string) => void;
}

const STORAGE_KEY_WATCHED_VIDEOS = 'giaic_watched_chapters_v1';

export const RecordingsHub: React.FC<RecordingsHubProps> = ({ onPracticeModule }) => {
  // Watched state persisted in localStorage
  const [watchedChapters, setWatchedChapters] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHED_VIDEOS);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [activeVideo, setActiveVideo] = useState<{
    chapter: ChapterRecording;
    video: ChapterVideo;
  } | null>(null);

  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'unwatched' | 'watched'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist watched chapters
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_WATCHED_VIDEOS,
        JSON.stringify(Array.from(watchedChapters))
      );
    } catch (e) {
      console.error('Failed to save watched chapters', e);
    }
  }, [watchedChapters]);

  const toggleWatched = (chapterNumber: number) => {
    setWatchedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterNumber)) {
        next.delete(chapterNumber);
      } else {
        next.add(chapterNumber);
      }
      return next;
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(SHARE_STUDENTS_MESSAGE);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopySingleUrl = async (url: string, id: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopiedLinkIndex(id);
        setTimeout(() => setCopiedLinkIndex(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const watchedCount = watchedChapters.size;
  const progressPercent = Math.round((watchedCount / chapterRecordings.length) * 100);

  const filteredChapters = chapterRecordings.filter((chap) => {
    const isWatched = watchedChapters.has(chap.chapterNumber);
    if (filterMode === 'watched' && !isWatched) return false;
    if (filterMode === 'unwatched' && isWatched) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = chap.title.toLowerCase().includes(query);
      const matchDesc = chap.description.toLowerCase().includes(query);
      const matchTopics = chap.keyTopics.some((t) => t.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchTopics) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Official Live Sessions Collection
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              GIAIC Exam Preparation – All 10 Chapters Recordings 🎥
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Watch the Live Sessions in sequence, then practice scenario-based MCQs for exam preparation.
              Share them with students who may need them for their preparation! ❤️
            </p>

            {/* Sequence guidance note */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-300 bg-indigo-950/50 border border-indigo-800/60 rounded-xl px-3.5 py-2">
              <ListOrdered className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Recommended sequence: Watch session <strong>#1 through #10</strong> sequentially, then test your comprehension in the Practice Arena.</span>
            </div>
          </div>

          {/* Action & Stats Panel */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {/* Share With Students Button */}
            <button
              onClick={handleShare}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all shadow-lg cursor-pointer ${
                copiedShare
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
              }`}
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>List Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share All 10 Recordings</span>
                </>
              )}
            </button>

            {/* Progress indicator */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-center min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Sessions Watched</span>
                <span className="font-mono text-white font-bold">{watchedCount} / 10</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5 text-right font-mono">
                {progressPercent}% Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Video Theater (if any video is active) */}
      {activeVideo && (
        <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-4 md:p-6 shadow-2xl relative scroll-mt-24">
          <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                Chapter {activeVideo.chapter.chapterNumber.toString().padStart(2, '0')}
              </span>
              <h3 className="font-bold text-white text-base md:text-lg">
                {activeVideo.video.label}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeVideo.video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* YouTube Iframe Player */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.video.youtubeId}?autoplay=1&rel=0`}
              title={activeVideo.video.label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>

          {/* Video Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2">
            <button
              onClick={() => toggleWatched(activeVideo.chapter.chapterNumber)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                watchedChapters.has(activeVideo.chapter.chapterNumber)
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {watchedChapters.has(activeVideo.chapter.chapterNumber) ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Marked as Watched</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span>Mark as Watched</span>
                </>
              )}
            </button>

            <button
              onClick={() => onPracticeModule(activeVideo.chapter.moduleId)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>Practice Chapter {activeVideo.chapter.chapterNumber} Scenario MCQs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All 10 Chapters ({chapterRecordings.length})
          </button>
          <button
            onClick={() => setFilterMode('unwatched')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              filterMode === 'unwatched'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            To Watch ({10 - watchedCount})
          </button>
          <button
            onClick={() => setFilterMode('watched')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              filterMode === 'watched'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Watched ({watchedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or title..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Chapters Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredChapters.map((chapter) => {
          const isWatched = watchedChapters.has(chapter.chapterNumber);

          return (
            <div
              key={chapter.chapterNumber}
              className={`bg-slate-900 border rounded-2xl p-5 md:p-6 flex flex-col justify-between transition-all duration-200 hover:border-slate-700 ${
                isWatched
                  ? 'border-emerald-900/40 bg-slate-900/90'
                  : 'border-slate-800 shadow-md'
              }`}
            >
              <div>
                {/* Header line */}
                <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded-md">
                      #{chapter.chapterNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {chapter.videos.length > 1 ? `${chapter.videos.length} Sessions` : 'Live Session'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleWatched(chapter.chapterNumber)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                      isWatched
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'
                    }`}
                    title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
                  >
                    {isWatched ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Watched</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-slate-500" />
                        <span>Unwatched</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-white mb-2 hover:text-indigo-300 transition-colors">
                  {chapter.title}
                </h2>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
                  {chapter.description}
                </p>

                {/* Video Links / Buttons */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Video Session{chapter.videos.length > 1 ? 's' : ''}:
                  </div>
                  {chapter.videos.map((vid, vIdx) => {
                    const isCurrentActive =
                      activeVideo?.chapter.chapterNumber === chapter.chapterNumber &&
                      activeVideo?.video.youtubeId === vid.youtubeId;

                    return (
                      <div
                        key={vid.youtubeId}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                          isCurrentActive
                            ? 'bg-indigo-950/70 border-indigo-500 text-white'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => setActiveVideo({ chapter, video: vid })}
                            className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                            title="Play embedded"
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                          <div className="truncate">
                            <div className="font-medium truncate text-white">{vid.label}</div>
                            {vid.badge && (
                              <span className="text-[10px] text-indigo-400 font-mono">
                                {vid.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleCopySingleUrl(vid.url, `${chapter.chapterNumber}-${vIdx}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Copy link"
                          >
                            {copiedLinkIndex === `${chapter.chapterNumber}-${vIdx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Open on YouTube"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Key Topics Tag list */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 mb-5">
                  <span className="text-slate-500 font-medium">Exam Topics:</span>
                  {chapter.keyTopics.map((topic, i) => (
                    <React.Fragment key={topic}>
                      <span className="text-slate-300">{topic}</span>
                      {i < chapter.keyTopics.length - 1 && (
                        <span aria-hidden="true" className="text-slate-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <a
                  href={`https://agentfactory.panaversity.org/docs/${chapter.docSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors text-[11px]"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Docs Guide</span>
                </a>

                <button
                  onClick={() => onPracticeModule(chapter.moduleId)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Practice 10 MCQs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share / Study Footer Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
          <span>Spread Knowledge With Fellow GIAIC Students</span>
          <span className="text-rose-500">❤️</span>
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Exam preparation is most effective when studying in groups. Copy the full link directory to share in your class WhatsApp groups, Discord, or Telegram channels.
        </p>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
        >
          {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{copiedShare ? 'Message Copied!' : 'Copy Formatted Chapter List'}</span>
        </button>
      </div>
    </div>
  );
};
