"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";

type ToeicGoal = 450 | 650 | 750;

const goals: {
  value: ToeicGoal;
  title: string;
  description: string;
  level: string;
}[] = [
  {
    value: 450,
    title: "TOEIC 450",
    description: "Phù hợp người mới bắt đầu, cần nền tảng từ vựng và ngữ pháp cơ bản.",
    level: "Beginner",
  },
  {
    value: 650,
    title: "TOEIC 650",
    description: "Phù hợp người đã có nền tảng, muốn tăng điểm Reading và Part 5.",
    level: "Intermediate",
  },
  {
    value: 750,
    title: "TOEIC 750+",
    description: "Phù hợp người muốn học từ khó hơn, luyện tốc độ và độ chính xác.",
    level: "Advanced",
  },
];

export default function SettingsPage() {
  const [selectedGoal, setSelectedGoal] = useState<ToeicGoal>(450);

  useEffect(() => {
    const savedGoal = localStorage.getItem("toeicGoal");

    if (savedGoal === "450" || savedGoal === "650" || savedGoal === "750") {
      setSelectedGoal(Number(savedGoal) as ToeicGoal);
    }
  }, []);

  function handleSelectGoal(goal: ToeicGoal) {
    setSelectedGoal(goal);
    localStorage.setItem("toeicGoal", String(goal));
  }

  const selectedGoalData = goals.find((goal) => goal.value === selectedGoal);

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Cài đặt học tập</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Mục tiêu TOEIC
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Chọn mục tiêu hiện tại để app gợi ý nội dung học phù hợp hơn.
          </p>
        </div>

        <div className="rounded-3xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm opacity-90">Mục tiêu hiện tại</p>
          <h2 className="mt-2 text-3xl font-bold">
            TOEIC {selectedGoal}
            {selectedGoal === 750 ? "+" : ""}
          </h2>
          <p className="mt-2 text-sm opacity-90">
            {selectedGoalData?.description}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {goals.map((goal) => {
            const isActive = selectedGoal === goal.value;

            return (
              <button
                key={goal.value}
                onClick={() => handleSelectGoal(goal.value)}
                className={`w-full rounded-3xl border p-5 text-left shadow ${
                  isActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-transparent bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2
                      className={`text-xl font-bold ${
                        isActive ? "text-blue-700" : "text-slate-900"
                      }`}
                    >
                      {goal.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {goal.level}
                    </p>
                  </div>

                  {isActive && (
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                      Đang chọn
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  {goal.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Gợi ý</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            App sẽ dùng mục tiêu này để làm gì?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ở các bước tiếp theo, app có thể lọc từ vựng theo mục tiêu TOEIC,
            gợi ý bài học hôm nay và ưu tiên nội dung phù hợp với trình độ của bạn.
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}