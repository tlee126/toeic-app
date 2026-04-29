"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { words } from "@/data/words";
import BottomNav from "@/components/BottomNav";
import SpeakButton from "@/components/SpeakButton";
import {
  clearWordReviewData,
  getReviewedCount,
  getToeicGoal,
  getWordReviewData,
  setReviewedCount as saveReviewedCount,
  setWordReviewData,
} from "@/lib/storage";
import type {
  ReviewData,
  ReviewRating,
  SessionSize,
  StudySessionRatingCounts,
  ToeicGoal,
} from "@/types/study";

type StudyWord = (typeof words)[number];

const initialSessionRatingCounts: StudySessionRatingCounts = {
  forgot: 0,
  hard: 0,
  good: 0,
  easy: 0,
};

const ratingOptions: {
  value: ReviewRating;
  label: string;
  description: string;
  className: string;
}[] = [
  {
    value: "forgot",
    label: "Quên",
    description: "Cần ôn lại sớm",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  {
    value: "hard",
    label: "Khó",
    description: "Còn chưa chắc",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    value: "good",
    label: "Nhớ",
    description: "Tạm ổn",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  {
    value: "easy",
    label: "Rất nhớ",
    description: "Đã nhớ tốt",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
];

const sessionSizeOptions: { value: SessionSize; label: string }[] = [
  { value: 5, label: "5 từ" },
  { value: 10, label: "10 từ" },
  { value: 20, label: "20 từ" },
  { value: "all", label: "Tất cả" },
];

function parseSessionSize(value: string): SessionSize {
  if (value === "all") return "all";
  return Number(value) as SessionSize;
}

function getRatingLabel(rating?: ReviewRating) {
  if (rating === "forgot") return "Quên";
  if (rating === "hard") return "Khó";
  if (rating === "good") return "Nhớ";
  if (rating === "easy") return "Rất nhớ";
  return "Chưa ôn";
}

function getLevelLabel(level: string) {
  if (level === "beginner") return "Cơ bản";
  if (level === "intermediate") return "Trung bình";
  return "Nâng cao";
}

function getPriorityScore(rating?: ReviewRating) {
  if (rating === "forgot") return 1;
  if (rating === "hard") return 2;
  if (!rating) return 3;
  if (rating === "good") return 4;
  return 5;
}

function getStudyWords(
  reviewData: ReviewData,
  smartMode: boolean,
  toeicGoal: ToeicGoal,
  useGoalFilter: boolean,
) {
  const filteredWords = words.filter((word) => {
    if (!useGoalFilter) return true;
    return word.toeicTarget <= toeicGoal;
  });

  if (!smartMode) return filteredWords;

  return [...filteredWords].sort((a, b) => {
    const aReview = reviewData[a.id];
    const bReview = reviewData[b.id];

    const priorityDiff =
      getPriorityScore(aReview?.rating) - getPriorityScore(bReview?.rating);

    if (priorityDiff !== 0) return priorityDiff;

    return a.difficulty - b.difficulty;
  });
}

export default function FlashcardsPage() {
  const sessionSizeRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [reviewData, setReviewData] = useState<ReviewData>({});
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [toeicGoal, setToeicGoal] = useState<ToeicGoal>(450);
  const [useGoalFilter, setUseGoalFilter] = useState(true);
  const [smartMode, setSmartMode] = useState(true);
  const [sessionSize, setSessionSize] = useState<SessionSize>("all");
  const [sessionWords, setSessionWords] = useState<StudyWord[]>([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [sessionRatingCounts, setSessionRatingCounts] =
    useState<StudySessionRatingCounts>(initialSessionRatingCounts);

  useEffect(() => {
    setReviewedCount(getReviewedCount());
    setReviewData(getWordReviewData());
    setToeicGoal(getToeicGoal());
    setHasLoadedProgress(true);
  }, []);

  const studyWords = useMemo(() => {
    return getStudyWords(reviewData, smartMode, toeicGoal, useGoalFilter);
  }, [reviewData, smartMode, toeicGoal, useGoalFilter]);

  function createSessionWords(
    sourceWords: StudyWord[] = studyWords,
    size: SessionSize = sessionSize,
  ) {
    if (size === "all") return sourceWords;
    return sourceWords.slice(0, size);
  }

  useEffect(() => {
    if (!hasLoadedProgress || sessionWords.length > 0 || studyWords.length === 0) {
      return;
    }

    setSessionWords(createSessionWords());
  }, [hasLoadedProgress, sessionWords.length, studyWords]);

  const currentWord = sessionWords[currentIndex] ?? sessionWords[0];
  const currentReview = currentWord ? reviewData[currentWord.id] : undefined;

  function resetSessionProgress() {
    setCurrentIndex(0);
    setShowMeaning(false);
    setIsSessionFinished(false);
    setSessionRatingCounts(initialSessionRatingCounts);
  }

  function startSession(nextSessionWords: StudyWord[]) {
    setSessionWords(nextSessionWords);
    resetSessionProgress();
  }

  function goToNextWord() {
    setShowMeaning(false);
    setCurrentIndex(currentIndex + 1);
  }

  function handleReview(rating: ReviewRating) {
    if (!currentWord) return;

    const newReviewedCount = reviewedCount + 1;

    const newReviewData: ReviewData = {
      ...reviewData,
      [currentWord.id]: {
        rating,
        count: currentReview ? currentReview.count + 1 : 1,
        lastReviewed: new Date().toISOString(),
      },
    };

    setReviewedCount(newReviewedCount);
    setReviewData(newReviewData);
    setSessionRatingCounts((currentCounts) => ({
      ...currentCounts,
      [rating]: currentCounts[rating] + 1,
    }));

    saveReviewedCount(newReviewedCount);
    setWordReviewData(newReviewData);

    if (currentIndex >= sessionWords.length - 1) {
      setShowMeaning(false);
      setIsSessionFinished(true);
      return;
    }

    goToNextWord();
  }

  function handleResetProgress() {
    setReviewedCount(0);
    setReviewData({});

    saveReviewedCount(0);
    clearWordReviewData();
  }

  function handleToggleGoalFilter() {
    const nextUseGoalFilter = !useGoalFilter;
    const nextStudyWords = getStudyWords(
      reviewData,
      smartMode,
      toeicGoal,
      nextUseGoalFilter,
    );

    startSession(createSessionWords(nextStudyWords));
    setUseGoalFilter(nextUseGoalFilter);
  }

  function handleToggleSmartMode() {
    const nextSmartMode = !smartMode;
    const nextStudyWords = getStudyWords(
      reviewData,
      nextSmartMode,
      toeicGoal,
      useGoalFilter,
    );

    startSession(createSessionWords(nextStudyWords));
    setSmartMode(nextSmartMode);
  }

  function handleSessionSizeChange(size: SessionSize) {
    startSession(createSessionWords(studyWords, size));
    setSessionSize(size);
  }

  function handleChangeSessionSizeFromSummary() {
    resetSessionProgress();
    sessionSizeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function handleCreateNewSession() {
    startSession(createSessionWords());
  }

  const learnedWords = Object.keys(reviewData).length;

  if (!currentWord) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
        <section className="mx-auto max-w-md">
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Chưa có từ để học
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Hãy kiểm tra lại dữ liệu từ vựng hoặc đổi mục tiêu TOEIC.
            </p>
          </div>
        </section>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div>
          <p className="text-sm text-slate-500">
            Flashcard {currentIndex + 1} / {sessionWords.length}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Ôn từ vựng
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            App sẽ ưu tiên các từ Quên/Khó trước để bạn ôn hiệu quả hơn.
          </p>
        </div>

        <div
          ref={sessionSizeRef}
          className="mt-5 rounded-3xl bg-white p-4 shadow-sm"
        >
          <p className="text-sm font-semibold text-slate-800">
            Cài đặt phiên học
          </p>

          <div className="mt-3 grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Bộ từ:</span>{" "}
              {useGoalFilter
                ? `TOEIC ${toeicGoal}${toeicGoal === 750 ? "+" : ""}`
                : "Tất cả từ"}
            </p>
            <p>
              <span className="font-semibold">Chế độ:</span>{" "}
              {smartMode ? "Thông minh" : "Thường"}
            </p>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Số từ trong phiên
            </span>
            <select
              value={String(sessionSize)}
              onChange={(event) =>
                handleSessionSizeChange(parseSessionSize(event.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-200"
            >
              {sessionSizeOptions.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleToggleGoalFilter}
              className="rounded-2xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white"
            >
              {useGoalFilter ? "Học tất cả" : "Theo mục tiêu"}
            </button>

            <button
              onClick={handleToggleSmartMode}
              className="rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-700"
            >
              {smartMode ? "Tắt thông minh" : "Bật thông minh"}
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Phiên hiện tại có {sessionWords.length} từ.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-sm text-blue-600">Tổng lượt ôn</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">
              {reviewedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-green-50 p-4">
            <p className="text-sm text-green-600">Từ đã chạm</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {learnedWords}
            </p>
          </div>
        </div>

        {isSessionFinished ? (
          <div className="mt-6 rounded-3xl bg-white p-6 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Hoàn thành phiên học
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Bạn đã hoàn thành phiên flashcard.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">Quên</p>
                <p className="mt-1 text-2xl font-bold text-red-700">
                  {sessionRatingCounts.forgot}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-700">Khó</p>
                <p className="mt-1 text-2xl font-bold text-orange-700">
                  {sessionRatingCounts.hard}
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-700">Nhớ</p>
                <p className="mt-1 text-2xl font-bold text-green-700">
                  {sessionRatingCounts.good}
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">Rất nhớ</p>
                <p className="mt-1 text-2xl font-bold text-blue-700">
                  {sessionRatingCounts.easy}
                </p>
              </div>
            </div>

            <button
              onClick={resetSessionProgress}
              className="mt-5 w-full rounded-2xl bg-blue-600 p-3 text-sm font-semibold text-white shadow-sm"
            >
              Học lại phiên này
            </button>

            <button
              onClick={handleCreateNewSession}
              className="mt-3 w-full rounded-2xl bg-white p-3 text-sm font-semibold text-blue-600 shadow-sm"
            >
              Tạo phiên mới
            </button>

            <button
              onClick={handleChangeSessionSizeFromSummary}
              className="mt-3 w-full rounded-2xl bg-slate-200 p-3 text-sm font-semibold text-slate-700"
            >
              Đổi số từ
            </button>
          </div>
        ) : (
          <>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowMeaning(!showMeaning)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setShowMeaning(!showMeaning);
                }
              }}
              className="mt-6 flex min-h-80 w-full flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-sm"
            >
              {!showMeaning ? (
                <>
                  <p className="text-sm text-slate-500">Từ tiếng Anh</p>

                  <h2 className="mt-4 text-4xl font-bold text-blue-600">
                    {currentWord.word}
                  </h2>

                  <p className="mt-3 text-slate-500">
                    {currentWord.pronunciation}
                  </p>

                  <div
                    className="mt-4"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <SpeakButton text={currentWord.word} />
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      {currentWord.topic}
                    </span>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                      {getLevelLabel(currentWord.level)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      TOEIC {currentWord.toeicTarget}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    Trạng thái: {getRatingLabel(currentReview?.rating)}
                  </p>

                  <p className="mt-6 text-sm text-slate-400">
                    Bấm để xem nghĩa
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-500">Nghĩa tiếng Việt</p>

                  <h2 className="mt-4 text-3xl font-bold text-slate-900">
                    {currentWord.meaning}
                  </h2>

                  <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-700">
                      {currentWord.example}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {currentWord.exampleMeaning}
                    </p>
                  </div>

                  <div
                    className="mt-4"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <SpeakButton text={currentWord.word} />
                  </div>

                  <p className="mt-6 text-xs text-blue-600">
                    Trạng thái hiện tại: {getRatingLabel(currentReview?.rating)}
                  </p>

                  {currentReview && (
                    <p className="mt-1 text-xs text-slate-500">
                      Bạn đã ôn từ này {currentReview.count} lần
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-slate-800">
                Bạn nhớ từ này thế nào?
              </p>

              <div className="grid grid-cols-2 gap-3">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleReview(option.value)}
                    className={`rounded-2xl border p-4 text-left shadow-sm ${option.className}`}
                  >
                    <p className="font-bold">{option.label}</p>
                    <p className="mt-1 text-xs opacity-80">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowMeaning(false)}
              className="mt-4 w-full rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700 shadow-sm"
            >
              Úp thẻ lại
            </button>

            <button
              onClick={handleResetProgress}
              className="mt-3 w-full rounded-2xl bg-slate-200 p-3 text-sm font-semibold text-slate-700"
            >
              Xóa tiến độ flashcard
            </button>
          </>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
