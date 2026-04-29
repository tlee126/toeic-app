"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { words } from "@/data/words";
import { questions } from "@/data/questions";
import BottomNav from "@/components/BottomNav";
import {
  getPracticedCount,
  getReviewedCount,
  getWordReviewData,
} from "@/lib/storage";
import type { ReviewData } from "@/types/study";

export default function StatsPage() {
  const [reviewedCount, setReviewedCount] = useState(0);
  const [practicedCount, setPracticedCount] = useState(0);
  const [reviewData, setReviewData] = useState<ReviewData>({});

  useEffect(() => {
    setReviewedCount(getReviewedCount());
    setPracticedCount(getPracticedCount());
    setReviewData(getWordReviewData());
  }, []);

  const learnedWords = Object.keys(reviewData).length;

  const forgotCount = Object.values(reviewData).filter(
    (item) => item.rating === "forgot"
  ).length;

  const hardCount = Object.values(reviewData).filter(
    (item) => item.rating === "hard"
  ).length;

  const goodCount = Object.values(reviewData).filter(
    (item) => item.rating === "good"
  ).length;

  const easyCount = Object.values(reviewData).filter(
    (item) => item.rating === "easy"
  ).length;

  const vocabularyProgress = Math.min(
    Math.round((learnedWords / words.length) * 100),
    100
  );

  const practiceProgress = Math.min(
    Math.round((practicedCount / questions.length) * 100),
    100
  );

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Tiến độ học tập</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Thống kê</h1>
          <p className="mt-2 text-sm text-slate-600">
            Theo dõi tiến độ học từ vựng, flashcard và luyện TOEIC Part 5.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Từ vựng</p>

            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">
                  {learnedWords}
                </p>
                <p className="text-sm text-slate-600">từ đã chạm</p>
              </div>

              <p className="text-sm font-semibold text-slate-700">
                {vocabularyProgress}%
              </p>
            </div>

            <div className="mt-4 h-3 rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-blue-600"
                style={{ width: `${vocabularyProgress}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-blue-50 p-3">
                <p className="text-2xl font-bold text-blue-700">
                  {reviewedCount}
                </p>
                <p className="text-sm text-blue-600">tổng lượt ôn</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-2xl font-bold text-slate-800">
                  {words.length}
                </p>
                <p className="text-sm text-slate-500">từ trong kho</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Mức nhớ Flashcard</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Bạn đang nhớ từ như thế nào?
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-2xl font-bold text-red-700">
                  {forgotCount}
                </p>
                <p className="text-sm text-red-600">Quên</p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-2xl font-bold text-orange-700">
                  {hardCount}
                </p>
                <p className="text-sm text-orange-600">Khó</p>
              </div>

              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-2xl font-bold text-green-700">
                  {goodCount}
                </p>
                <p className="text-sm text-green-600">Nhớ</p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-2xl font-bold text-blue-700">
                  {easyCount}
                </p>
                <p className="text-sm text-blue-600">Rất nhớ</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Các từ ở nhóm “Quên” và “Khó” nên được ưu tiên ôn lại.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Luyện tập</p>

            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {practicedCount}
                </p>
                <p className="text-sm text-slate-600">câu đã luyện</p>
              </div>

              <p className="text-sm font-semibold text-slate-700">
                {practiceProgress}%
              </p>
            </div>

            <div className="mt-4 h-3 rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-green-600"
                style={{ width: `${practiceProgress}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Kho hiện có {questions.length} câu hỏi.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Gợi ý hôm nay</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Học thêm một chút nhé 🚀
            </h2>

            {forgotCount + hardCount > 0 ? (
              <p className="mt-2 text-sm text-slate-600">
                Bạn đang có {forgotCount + hardCount} từ ở mức Quên/Khó. Hãy ưu
                tiên ôn flashcard trước.
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                Bạn có thể ôn 5 flashcard và làm 3 câu Part 5 để giữ nhịp học
                mỗi ngày.
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/flashcards"
                className="rounded-2xl bg-blue-600 p-3 text-center text-sm font-semibold text-white"
              >
                Ôn từ
              </Link>

              <Link
                href="/practice"
                className="rounded-2xl bg-green-600 p-3 text-center text-sm font-semibold text-white"
              >
                Luyện câu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
