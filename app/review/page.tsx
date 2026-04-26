"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { words } from "@/data/words";
import BottomNav from "@/components/BottomNav";

type ReviewRating = "forgot" | "hard" | "good" | "easy";

type WordReview = {
  rating: ReviewRating;
  count: number;
  lastReviewed: string;
};

type ReviewData = Record<number, WordReview>;

function getRatingLabel(rating?: ReviewRating) {
  if (rating === "forgot") return "Quên";
  if (rating === "hard") return "Khó";
  if (rating === "good") return "Nhớ";
  if (rating === "easy") return "Rất nhớ";
  return "Chưa ôn";
}

function getRatingStyle(rating?: ReviewRating) {
  if (rating === "forgot") return "bg-red-50 text-red-700";
  if (rating === "hard") return "bg-orange-50 text-orange-700";
  if (rating === "good") return "bg-green-50 text-green-700";
  if (rating === "easy") return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

function getLevelLabel(level: string) {
  if (level === "beginner") return "Cơ bản";
  if (level === "intermediate") return "Trung bình";
  return "Nâng cao";
}

export default function ReviewPage() {
  const [reviewData, setReviewData] = useState<ReviewData>({});

  useEffect(() => {
    const savedReviewData = localStorage.getItem("wordReviewData");

    if (savedReviewData) {
      setReviewData(JSON.parse(savedReviewData));
    }
  }, []);

  const weakWords = words.filter((word) => {
    const review = reviewData[word.id];
    return review?.rating === "forgot" || review?.rating === "hard";
  });

  const forgotCount = weakWords.filter(
    (word) => reviewData[word.id]?.rating === "forgot"
  ).length;

  const hardCount = weakWords.filter(
    (word) => reviewData[word.id]?.rating === "hard"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Ôn tập thông minh</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Từ cần ôn lại
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Đây là các từ bạn đã đánh dấu Quên hoặc Khó trong Flashcard.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-2xl font-bold text-slate-900">
              {weakWords.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">Từ yếu</p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 shadow">
            <p className="text-2xl font-bold text-red-700">{forgotCount}</p>
            <p className="mt-1 text-sm text-red-600">Quên</p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-4 shadow">
            <p className="text-2xl font-bold text-orange-700">{hardCount}</p>
            <p className="mt-1 text-sm text-orange-600">Khó</p>
          </div>
        </div>

        {weakWords.length > 0 ? (
          <>
            <div className="mt-5 rounded-3xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">Gợi ý</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Hãy ưu tiên nhóm này trước
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Những từ ở đây là các từ bạn chưa chắc. Hãy quay lại Flashcard,
                bật chế độ thông minh và ôn lại chúng trước.
              </p>

              <Link
                href="/flashcards"
                className="mt-4 block rounded-2xl bg-blue-600 p-3 text-center text-sm font-semibold text-white"
              >
                Ôn bằng Flashcard
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {weakWords.map((word) => {
                const review = reviewData[word.id];

                return (
                  <div key={word.id} className="rounded-2xl bg-white p-4 shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-blue-600">
                          {word.word}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {word.pronunciation}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getRatingStyle(
                          review?.rating
                        )}`}
                      >
                        {getRatingLabel(review?.rating)}
                      </span>
                    </div>

                    <p className="mt-3 text-base font-semibold text-slate-800">
                      {word.meaning}
                    </p>

                    <div className="mt-3 rounded-xl bg-slate-50 p-3">
                      <p className="text-sm text-slate-700">{word.example}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {word.exampleMeaning}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="font-semibold text-slate-800">
                          {word.topic}
                        </p>
                        <p className="mt-1 text-slate-500">Chủ đề</p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="font-semibold text-slate-800">
                          {getLevelLabel(word.level)}
                        </p>
                        <p className="mt-1 text-slate-500">Level</p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="font-semibold text-slate-800">
                          {review?.count ?? 0}
                        </p>
                        <p className="mt-1 text-slate-500">Lượt ôn</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="mt-5 rounded-3xl bg-white p-6 text-center shadow">
            <p className="text-4xl">🎉</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              Chưa có từ yếu
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Hãy vào Flashcard và đánh dấu một số từ là Quên hoặc Khó. Sau đó
              chúng sẽ xuất hiện ở đây.
            </p>

            <Link
              href="/flashcards"
              className="mt-5 block rounded-2xl bg-blue-600 p-3 text-center text-sm font-semibold text-white"
            >
              Đi tới Flashcard
            </Link>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}