"use client";

import { useEffect, useMemo, useState } from "react";
import { words } from "@/data/words";
import BottomNav from "@/components/BottomNav";

type ReviewRating = "forgot" | "hard" | "good" | "easy";
type ToeicGoal = 450 | 650 | 750;

type WordReview = {
  rating: ReviewRating;
  count: number;
  lastReviewed: string;
};

type ReviewData = Record<number, WordReview>;

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

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [reviewData, setReviewData] = useState<ReviewData>({});
  const [toeicGoal, setToeicGoal] = useState<ToeicGoal>(450);
  const [useGoalFilter, setUseGoalFilter] = useState(true);
  const [smartMode, setSmartMode] = useState(true);

  useEffect(() => {
    const savedCount = localStorage.getItem("reviewedCount");
    const savedReviewData = localStorage.getItem("wordReviewData");
    const savedToeicGoal = localStorage.getItem("toeicGoal");

    if (savedCount) {
      setReviewedCount(Number(savedCount));
    }

    if (savedReviewData) {
      setReviewData(JSON.parse(savedReviewData));
    }

    if (
      savedToeicGoal === "450" ||
      savedToeicGoal === "650" ||
      savedToeicGoal === "750"
    ) {
      setToeicGoal(Number(savedToeicGoal) as ToeicGoal);
    }
  }, []);

  const studyWords = useMemo(() => {
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
  }, [reviewData, smartMode, toeicGoal, useGoalFilter]);

  const currentWord = studyWords[currentIndex] ?? studyWords[0];
  const currentReview = currentWord ? reviewData[currentWord.id] : undefined;

  function goToNextWord() {
    setShowMeaning(false);

    if (currentIndex < studyWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
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

    localStorage.setItem("reviewedCount", String(newReviewedCount));
    localStorage.setItem("wordReviewData", JSON.stringify(newReviewData));

    goToNextWord();
  }

  function handleResetProgress() {
    setReviewedCount(0);
    setReviewData({});

    localStorage.setItem("reviewedCount", "0");
    localStorage.removeItem("wordReviewData");
  }

  function handleToggleGoalFilter() {
    setCurrentIndex(0);
    setShowMeaning(false);
    setUseGoalFilter(!useGoalFilter);
  }

  function handleToggleSmartMode() {
    setCurrentIndex(0);
    setShowMeaning(false);
    setSmartMode(!smartMode);
  }

  const learnedWords = Object.keys(reviewData).length;

  if (!currentWord) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
        <section className="mx-auto max-w-md">
          <div className="rounded-3xl bg-white p-6 text-center shadow">
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
            Flashcard {currentIndex + 1} / {studyWords.length}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Ôn từ vựng
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            App sẽ ưu tiên các từ Quên/Khó trước để bạn ôn hiệu quả hơn.
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm opacity-90">Bộ từ đang học</p>
          <h2 className="mt-1 text-2xl font-bold">
            {useGoalFilter
              ? `TOEIC ${toeicGoal}${toeicGoal === 750 ? "+" : ""}`
              : "Tất cả từ"}
          </h2>
          <p className="mt-2 text-sm opacity-90">
            {smartMode
              ? "Chế độ thông minh: ưu tiên từ Quên/Khó trước."
              : "Chế độ thường: học theo thứ tự dữ liệu."}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleToggleGoalFilter}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600"
            >
              {useGoalFilter ? "Học tất cả" : "Theo mục tiêu"}
            </button>

            <button
              onClick={handleToggleSmartMode}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600"
            >
              {smartMode ? "Tắt thông minh" : "Bật thông minh"}
            </button>
          </div>
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

        <button
          onClick={() => setShowMeaning(!showMeaning)}
          className="mt-6 flex min-h-80 w-full flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-lg"
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

              <p className="mt-6 text-sm text-slate-400">Bấm để xem nghĩa</p>
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
        </button>

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
                <p className="mt-1 text-xs opacity-80">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowMeaning(false)}
          className="mt-4 w-full rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700 shadow"
        >
          Úp thẻ lại
        </button>

        <button
          onClick={handleResetProgress}
          className="mt-3 w-full rounded-2xl bg-slate-200 p-3 text-sm font-semibold text-slate-700"
        >
          Xóa tiến độ flashcard
        </button>
      </section>

      <BottomNav />
    </main>
  );
}