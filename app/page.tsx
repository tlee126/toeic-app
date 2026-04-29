"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { words } from "@/data/words";
import { questions } from "@/data/questions";
import { grammarLessons } from "@/data/grammar";
import BottomNav from "@/components/BottomNav";
import {
  getPracticedCount,
  getReviewedCount,
  getToeicGoal,
  getWordReviewData,
} from "@/lib/storage";
import type { ReviewData, ToeicGoal } from "@/types/study";

function getGoalDescription(goal: ToeicGoal) {
  if (goal === 450) {
    return "Tập trung từ cơ bản, ngữ pháp nền tảng và TOEIC Part 5 dễ.";
  }

  if (goal === 650) {
    return "Tăng vốn từ trung bình, luyện Part 5 đều và bắt đầu nâng độ khó.";
  }

  return "Ưu tiên từ khó hơn, độ chính xác cao và luyện tốc độ làm bài.";
}

export default function Home() {
  const [reviewedCount, setReviewedCount] = useState(0);
  const [practicedCount, setPracticedCount] = useState(0);
  const [toeicGoal, setToeicGoal] = useState<ToeicGoal>(450);
  const [reviewData, setReviewData] = useState<ReviewData>({});

  useEffect(() => {
    setReviewedCount(getReviewedCount());
    setPracticedCount(getPracticedCount());
    setToeicGoal(getToeicGoal());
    setReviewData(getWordReviewData());
  }, []);

  const wordsForGoal = words.filter((word) => word.toeicTarget <= toeicGoal);

  const weakWords = words.filter((word) => {
    const review = reviewData[word.id];
    return review?.rating === "forgot" || review?.rating === "hard";
  });

  const beginnerWords = wordsForGoal.filter((word) => word.level === "beginner");
  const intermediateWords = wordsForGoal.filter(
    (word) => word.level === "intermediate"
  );
  const advancedWords = wordsForGoal.filter((word) => word.level === "advanced");

  const suggestedGrammar = grammarLessons[0];

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-lg">
          <p className="text-sm opacity-90">Xin chào 👋</p>
          <h1 className="mt-2 text-3xl font-bold">TOEIC Study App</h1>
          <p className="mt-3 text-sm opacity-90">
            Học từ vựng, ngữ pháp và luyện TOEIC mỗi ngày trên điện thoại.
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-white p-5 shadow">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Mục tiêu hiện tại</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                TOEIC {toeicGoal}
                {toeicGoal === 750 ? "+" : ""}
              </h2>
            </div>

            <Link
              href="/settings"
              className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600"
            >
              Đổi mục tiêu
            </Link>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {getGoalDescription(toeicGoal)}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-2xl font-bold text-blue-600">
              {wordsForGoal.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">Từ hợp mục tiêu</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-2xl font-bold text-red-600">
              {weakWords.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">Từ cần ôn lại</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-2xl font-bold text-green-600">
              {practicedCount}
            </p>
            <p className="mt-1 text-sm text-slate-600">Câu đã luyện</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-2xl font-bold text-slate-800">
              {reviewedCount}
            </p>
            <p className="mt-1 text-sm text-slate-600">Tổng lượt ôn</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Học hôm nay</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Kế hoạch 10 phút 🚀
          </h2>

          <div className="mt-4 space-y-3">
            <Link
              href="/vocabulary"
              className="block rounded-2xl bg-blue-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-blue-700">1. Học 5 từ mới</p>
                  <p className="mt-1 text-sm text-blue-600">
                    Chọn từ phù hợp mục tiêu TOEIC {toeicGoal}
                    {toeicGoal === 750 ? "+" : ""}.
                  </p>
                </div>
                <span className="text-xl">📘</span>
              </div>
            </Link>

            <Link href="/review" className="block rounded-2xl bg-red-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-red-700">
                    2. Ôn lại từ yếu
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    Hiện có {weakWords.length} từ ở mức Quên hoặc Khó.
                  </p>
                </div>
                <span className="text-xl">🔁</span>
              </div>
            </Link>

            <Link
              href="/practice"
              className="block rounded-2xl bg-green-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-green-700">
                    3. Làm 5 câu Part 5
                  </p>
                  <p className="mt-1 text-sm text-green-600">
                    Kho hiện có {questions.length} câu luyện tập.
                  </p>
                </div>
                <span className="text-xl">✅</span>
              </div>
            </Link>

            <Link
              href="/grammar"
              className="block rounded-2xl bg-purple-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-purple-700">
                    4. Ôn 1 điểm ngữ pháp
                  </p>
                  <p className="mt-1 text-sm text-purple-600">
                    Gợi ý hôm nay: {suggestedGrammar?.title ?? "TOEIC Grammar"}
                  </p>
                </div>
                <span className="text-xl">✍️</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Kho dữ liệu hiện tại</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Nội dung học
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-900">
                {words.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">từ vựng</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-900">
                {questions.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">câu hỏi</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-900">
                {grammarLessons.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">bài ngữ pháp</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-900">
                {beginnerWords.length}/{intermediateWords.length}/
                {advancedWords.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                dễ/vừa/khó
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-slate-800">Chức năng học</h2>

          <div className="mt-3 space-y-3">
            <Link
              href="/vocabulary"
              className="block w-full rounded-2xl bg-white p-4 text-left shadow"
            >
              <p className="font-semibold text-slate-800">📘 Học từ vựng</p>
              <p className="mt-1 text-sm text-slate-500">
                Xem danh sách từ, lọc theo chủ đề, level và mục tiêu TOEIC.
              </p>
            </Link>

            <Link
              href="/flashcards"
              className="block w-full rounded-2xl bg-white p-4 text-left shadow"
            >
              <p className="font-semibold text-slate-800">🧠 Flashcard</p>
              <p className="mt-1 text-sm text-slate-500">
                Ôn tập bằng 4 mức: Quên, Khó, Nhớ, Rất nhớ.
              </p>
            </Link>

            <Link
              href="/review"
              className="block w-full rounded-2xl bg-white p-4 text-left shadow"
            >
              <p className="font-semibold text-slate-800">🔁 Ôn lại từ yếu</p>
              <p className="mt-1 text-sm text-slate-500">
                Tập trung vào các từ bạn đã đánh dấu Quên hoặc Khó.
              </p>
            </Link>

            <Link
              href="/grammar"
              className="block w-full rounded-2xl bg-white p-4 text-left shadow"
            >
              <p className="font-semibold text-slate-800">✍️ Ngữ pháp</p>
              <p className="mt-1 text-sm text-slate-500">
                Học các điểm ngữ pháp thường gặp trong TOEIC Part 5.
              </p>
            </Link>

            <Link
              href="/practice"
              className="block w-full rounded-2xl bg-white p-4 text-left shadow"
            >
              <p className="font-semibold text-slate-800">✅ Luyện tập</p>
              <p className="mt-1 text-sm text-slate-500">
                Làm câu hỏi trắc nghiệm TOEIC Part 5.
              </p>
            </Link>

            <Link
              href="/stats"
              className="block w-full rounded-2xl bg-white p-4 text-left shadow"
            >
              <p className="font-semibold text-slate-800">📊 Thống kê</p>
              <p className="mt-1 text-sm text-slate-500">
                Xem tiến độ học và mức nhớ flashcard.
              </p>
            </Link>

            <Link
              href="/settings"
              className="block w-full rounded-2xl bg-white p-4 text-left shadow"
            >
              <p className="font-semibold text-slate-800">🎯 Mục tiêu TOEIC</p>
              <p className="mt-1 text-sm text-slate-500">
                Chọn mục tiêu TOEIC 450, 650 hoặc 750+.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
