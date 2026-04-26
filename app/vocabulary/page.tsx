"use client";

import { useEffect, useState } from "react";
import { words, WordLevel } from "@/data/words";
import BottomNav from "@/components/BottomNav";

type ToeicGoal = 450 | 650 | 750;

const topics = ["All", "Office", "Business", "Travel", "Shopping"];

const levels: ("All" | WordLevel)[] = [
  "All",
  "beginner",
  "intermediate",
  "advanced",
];

function getLevelLabel(level: WordLevel) {
  if (level === "beginner") return "Cơ bản";
  if (level === "intermediate") return "Trung bình";
  return "Nâng cao";
}

function getDifficultyText(difficulty: 1 | 2 | 3) {
  if (difficulty === 1) return "Dễ";
  if (difficulty === 2) return "Vừa";
  return "Khó";
}

export default function VocabularyPage() {
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState<"All" | WordLevel>("All");
  const [toeicGoal, setToeicGoal] = useState<ToeicGoal>(450);
  const [useGoalFilter, setUseGoalFilter] = useState(true);

  useEffect(() => {
    const savedToeicGoal = localStorage.getItem("toeicGoal");

    if (
      savedToeicGoal === "450" ||
      savedToeicGoal === "650" ||
      savedToeicGoal === "750"
    ) {
      setToeicGoal(Number(savedToeicGoal) as ToeicGoal);
    }
  }, []);

  const filteredWords = words.filter((item) => {
    const matchTopic = selectedTopic === "All" || item.topic === selectedTopic;
    const matchLevel = selectedLevel === "All" || item.level === selectedLevel;
    const matchGoal = !useGoalFilter || item.toeicTarget <= toeicGoal;

    return matchTopic && matchLevel && matchGoal;
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Danh sách từ vựng</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            TOEIC Vocabulary
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Lọc từ theo chủ đề, level và mục tiêu TOEIC của bạn.
          </p>
        </div>

        <div className="mb-5 rounded-3xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm opacity-90">Mục tiêu hiện tại</p>
          <h2 className="mt-1 text-2xl font-bold">
            TOEIC {toeicGoal}
            {toeicGoal === 750 ? "+" : ""}
          </h2>
          <p className="mt-2 text-sm opacity-90">
            {useGoalFilter
              ? "Đang chỉ hiện các từ phù hợp với mục tiêu này."
              : "Đang hiện tất cả từ trong kho."}
          </p>

          <button
            onClick={() => setUseGoalFilter(!useGoalFilter)}
            className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600"
          >
            {useGoalFilter ? "Hiện tất cả từ" : "Lọc theo mục tiêu"}
          </button>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow">
          <p className="text-sm font-semibold text-slate-800">Chủ đề</p>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {topics.map((topic) => {
              const isActive = selectedTopic === topic;

              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-800">Level</p>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {levels.map((level) => {
              const isActive = selectedLevel === level;

              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {level === "All" ? "All" : getLevelLabel(level)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Tìm thấy{" "}
            <span className="font-bold text-slate-900">
              {filteredWords.length}
            </span>{" "}
            từ
          </p>

          <button
            onClick={() => {
              setSelectedTopic("All");
              setSelectedLevel("All");
              setUseGoalFilter(true);
            }}
            className="text-sm font-semibold text-blue-600"
          >
            Xóa lọc
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {filteredWords.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-4 shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-blue-600">
                    {item.word}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.pronunciation}
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {item.topic}
                </span>
              </div>

              <p className="mt-3 text-base font-semibold text-slate-800">
                {item.meaning}
              </p>

              <div className="mt-3 rounded-xl bg-slate-50 p-3">
                <p className="text-sm text-slate-700">{item.example}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.exampleMeaning}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="font-semibold text-slate-800">
                    {getLevelLabel(item.level)}
                  </p>
                  <p className="mt-1 text-slate-500">Level</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="font-semibold text-slate-800">
                    TOEIC {item.toeicTarget}
                  </p>
                  <p className="mt-1 text-slate-500">Mục tiêu</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="font-semibold text-slate-800">
                    {getDifficultyText(item.difficulty)}
                  </p>
                  <p className="mt-1 text-slate-500">Độ khó</p>
                </div>
              </div>
            </div>
          ))}

          {filteredWords.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center shadow">
              <p className="text-lg font-bold text-slate-800">
                Không có từ phù hợp
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Hãy thử chọn chủ đề hoặc level khác.
              </p>
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}