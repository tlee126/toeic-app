"use client";

import { useEffect, useState } from "react";
import { words, WordLevel } from "@/data/words";
import BottomNav from "@/components/BottomNav";
import SpeakButton from "@/components/SpeakButton";

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
  const [searchText, setSearchText] = useState("");

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

  function handleResetFilters() {
    setSearchText("");
    setSelectedTopic("All");
    setSelectedLevel("All");
    setUseGoalFilter(true);
  }

  const filteredWords = words.filter((item) => {
    const normalizedSearchText = searchText.trim().toLowerCase();
    const matchTopic = selectedTopic === "All" || item.topic === selectedTopic;
    const matchLevel = selectedLevel === "All" || item.level === selectedLevel;
    const matchGoal = !useGoalFilter || item.toeicTarget <= toeicGoal;
    const matchSearch =
      normalizedSearchText === "" ||
      [
        item.word,
        item.meaning,
        item.example,
        item.exampleMeaning,
        item.topic,
        item.level,
      ].some((value) => value.toLowerCase().includes(normalizedSearchText));

    return matchTopic && matchLevel && matchGoal && matchSearch;
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

        <div className="rounded-3xl bg-white p-4 shadow">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Bộ lọc</p>
              <p className="mt-1 text-xs text-slate-500">
                TOEIC {toeicGoal}
                {toeicGoal === 750 ? "+" : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Xóa lọc
            </button>
          </div>

          <label
            htmlFor="vocabulary-search"
            className="mt-4 block text-sm font-semibold text-slate-800"
          >
            Tìm kiếm
          </label>

          <input
            id="vocabulary-search"
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Tìm từ, nghĩa, ví dụ hoặc chủ đề..."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Chủ đề
              </span>
              <select
                value={selectedTopic}
                onChange={(event) => setSelectedTopic(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Level
              </span>
              <select
                value={selectedLevel}
                onChange={(event) =>
                  setSelectedLevel(event.target.value as "All" | WordLevel)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === "All" ? "All" : getLevelLabel(level)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 rounded-2xl bg-blue-50 p-3">
            <p className="text-sm font-semibold text-blue-700">
              {useGoalFilter
                ? "Đang lọc theo mục tiêu"
                : "Đang hiện tất cả từ"}
            </p>
            <button
              type="button"
              onClick={() => setUseGoalFilter(!useGoalFilter)}
              className="mt-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {useGoalFilter ? "Hiện tất cả từ" : "Lọc theo mục tiêu"}
            </button>
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
        </div>

        <div className="mt-4 space-y-4">
          {filteredWords.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-4 shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-blue-600">
                    {item.word}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm text-slate-500">
                      {item.pronunciation}
                    </p>
                    <SpeakButton text={item.word} />
                  </div>
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
