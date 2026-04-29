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

  const suggestedGrammar = grammarLessons[0];

  const dailyPlan = [
    {
      href: "/vocabulary",
      title: "Học 5 từ mới",
      description: `Từ phù hợp mục tiêu TOEIC ${toeicGoal}${
        toeicGoal === 750 ? "+" : ""
      }.`,
      icon: "📘",
      className: "bg-blue-50 text-blue-700",
    },
    {
      href: "/review",
      title: "Ôn từ yếu",
      description: `${weakWords.length} từ đang ở mức Quên hoặc Khó.`,
      icon: "🔁",
      className: "bg-red-50 text-red-700",
    },
    {
      href: "/practice",
      title: "Làm 5 câu Part 5",
      description: `Kho hiện có ${questions.length} câu luyện tập.`,
      icon: "✅",
      className: "bg-green-50 text-green-700",
    },
    {
      href: "/grammar",
      title: "Ôn 1 điểm ngữ pháp",
      description: suggestedGrammar?.title ?? "TOEIC Grammar",
      icon: "✍️",
      className: "bg-purple-50 text-purple-700",
    },
  ];

  const stats = [
    {
      label: "Từ hợp mục tiêu",
      value: wordsForGoal.length,
      className: "text-blue-600",
    },
    {
      label: "Từ cần ôn",
      value: weakWords.length,
      className: "text-red-600",
    },
    {
      label: "Câu đã luyện",
      value: practicedCount,
      className: "text-green-600",
    },
    {
      label: "Lượt ôn",
      value: reviewedCount,
      className: "text-slate-800",
    },
  ];

  const mainFeatures = [
    {
      href: "/vocabulary",
      title: "Từ vựng",
      description: "Tra cứu, tìm kiếm và lọc từ theo mục tiêu.",
      icon: "📘",
    },
    {
      href: "/flashcards",
      title: "Flashcard",
      description: "Ôn tập với các phiên học ngắn và phát âm.",
      icon: "🧠",
    },
    {
      href: "/practice",
      title: "Luyện tập",
      description: "Làm câu hỏi TOEIC Part 5 theo phiên.",
      icon: "✅",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-sm">
          <h1 className="text-3xl font-bold">TOEIC Study App</h1>
          <p className="mt-3 text-sm leading-relaxed opacity-90">
            Học từ vựng, flashcard, ngữ pháp và luyện Part 5 mỗi ngày.
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-white p-4 shadow-sm">
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

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {getGoalDescription(toeicGoal)}
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Học hôm nay</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Kế hoạch 10 phút
          </h2>

          <div className="mt-4 space-y-3">
            {dailyPlan.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl p-4 ${item.className}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="mt-1 text-sm opacity-80">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xl">{item.icon}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className={`text-2xl font-bold ${item.className}`}>
                {item.value}
              </p>
              <p className="mt-1 text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Kho dữ liệu hiện tại</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Nội dung học
              </h2>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xl font-bold text-slate-900">
                {words.length}
              </p>
              <p className="mt-1 text-xs text-slate-600">từ</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xl font-bold text-slate-900">
                {questions.length}
              </p>
              <p className="mt-1 text-xs text-slate-600">câu</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xl font-bold text-slate-900">
                {grammarLessons.length}
              </p>
              <p className="mt-1 text-xs text-slate-600">bài</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-lg font-bold text-slate-800">Chức năng chính</h2>

          <div className="mt-3 space-y-3">
            {mainFeatures.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            <Link
              href="/more"
              className="block rounded-2xl bg-slate-200 p-4 text-center text-sm font-semibold text-slate-700"
            >
              Xem thêm chức năng
            </Link>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
