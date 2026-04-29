"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";
import BottomNav from "@/components/BottomNav";
import {
  getPracticedCount,
  setPracticedCount as savePracticedCount,
} from "@/lib/storage";
import type { PracticeWrongAnswer, SessionSize } from "@/types/study";

const allGrammarPointsLabel = "All";
const sessionSizeOptions: SessionSize[] = [5, 10, 20, "all"];
const grammarPointOptions = [
  allGrammarPointsLabel,
  ...Array.from(new Set(questions.map((question) => question.grammarPoint))),
];

function getFilteredQuestions(grammarPoint: string) {
  if (grammarPoint === allGrammarPointsLabel) {
    return questions;
  }

  return questions.filter((question) => question.grammarPoint === grammarPoint);
}

function createSessionQuestions(size: SessionSize, grammarPoint: string) {
  const baseQuestions = getFilteredQuestions(grammarPoint);

  if (size === "all") {
    return baseQuestions;
  }

  return baseQuestions.slice(0, size);
}

function parseSessionSize(value: string): SessionSize {
  if (value === "all") {
    return "all";
  }

  return Number(value) as SessionSize;
}

export default function PracticePage() {
  const [selectedGrammarPoint, setSelectedGrammarPoint] = useState(
    allGrammarPointsLabel
  );
  const [sessionSize, setSessionSize] = useState<SessionSize>(5);
  const [sessionQuestions, setSessionQuestions] = useState(() =>
    createSessionQuestions(5, allGrammarPointsLabel)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [practicedCount, setPracticedCount] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<PracticeWrongAnswer[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = sessionQuestions[currentIndex];
  const hasQuestions = sessionQuestions.length > 0;
  const isAnswered = selectedAnswer !== "";
  const isCorrect = currentQuestion
    ? selectedAnswer === currentQuestion.answer
    : false;
  const isLastQuestion =
    hasQuestions && currentIndex === sessionQuestions.length - 1;

  useEffect(() => {
    setPracticedCount(getPracticedCount());
  }, []);

  function resetSessionProgress() {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setWrongAnswers([]);
    setIsFinished(false);
  }

  function startNewSession(size: SessionSize, grammarPoint: string) {
    setSessionQuestions(createSessionQuestions(size, grammarPoint));
    resetSessionProgress();
  }

  function handleSelectAnswer(option: string) {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(option);

    const newPracticedCount = practicedCount + 1;
    setPracticedCount(newPracticedCount);
    savePracticedCount(newPracticedCount);

    if (option === currentQuestion.answer) {
      setScore(score + 1);
    } else {
      setWrongAnswers([
        ...wrongAnswers,
        {
          questionId: currentQuestion.id,
          grammarPoint: currentQuestion.grammarPoint,
        },
      ]);
    }
  }

  function handleNextQuestion() {
    if (!isLastQuestion) {
      setSelectedAnswer("");
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  }

  function handleSelectSessionSize(size: SessionSize) {
    setSessionSize(size);
    startNewSession(size, selectedGrammarPoint);
  }

  function handleSelectGrammarPoint(grammarPoint: string) {
    setSelectedGrammarPoint(grammarPoint);
    startNewSession(sessionSize, grammarPoint);
  }

  function handleRepeatSession() {
    resetSessionProgress();
  }

  function handleCreateNewSession() {
    startNewSession(sessionSize, selectedGrammarPoint);
  }

  function handleResetPracticeCount() {
    setPracticedCount(0);
    savePracticedCount(0);
  }

  const accuracy = hasQuestions
    ? Math.round((score / sessionQuestions.length) * 100)
    : 0;

  const weakGrammarPoints = Array.from(
    new Set(wrongAnswers.map((item) => item.grammarPoint))
  );

  if (isFinished) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
        <section className="mx-auto max-w-md">
          <div className="rounded-3xl bg-white p-6 text-center shadow">
            <p className="text-sm text-slate-500">Kết quả luyện tập</p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Hoàn thành
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              Bạn đã làm xong bài luyện TOEIC Part 5.
            </p>

            <p className="mt-4 text-base font-semibold text-slate-700">
              Bạn đúng {score} / {sessionQuestions.length} câu
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-3xl font-bold text-green-700">{score}</p>
                <p className="text-sm text-green-600">câu đúng</p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-3xl font-bold text-blue-700">
                  {accuracy}%
                </p>
                <p className="text-sm text-blue-600">độ chính xác</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Nhận xét</p>

            {wrongAnswers.length === 0 ? (
              <>
                <h2 className="mt-2 text-xl font-bold text-green-700">
                  Rất tốt!
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Bạn không sai câu nào. Hãy tiếp tục luyện thêm câu khó hơn.
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Bạn nên ôn lại:
                </h2>

                <div className="mt-3 space-y-2">
                  {weakGrammarPoints.map((point) => (
                    <div
                      key={point}
                      className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700"
                    >
                      {point}
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  Những điểm này xuất hiện trong các câu bạn làm sai. Hãy quay
                  lại phần Ngữ pháp để ôn thêm.
                </p>
              </>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={handleRepeatSession}
              className="rounded-2xl bg-blue-600 p-4 font-semibold text-white shadow"
            >
              Làm lại phiên này
            </button>

            <button
              onClick={handleCreateNewSession}
              className="rounded-2xl bg-white p-4 font-semibold text-slate-700 shadow"
            >
              Tạo phiên mới
            </button>
          </div>

          <a
            href="/grammar"
            className="mt-3 block rounded-2xl bg-white p-4 text-center font-semibold text-slate-700 shadow"
          >
            Ôn ngữ pháp
          </a>

          <button
            onClick={handleResetPracticeCount}
            className="mt-4 w-full rounded-2xl bg-slate-200 p-3 text-sm font-semibold text-slate-700"
          >
            Xóa tổng số câu đã luyện
          </button>
        </section>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">
      <section className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            Câu {hasQuestions ? currentIndex + 1 : 0} /{" "}
            {sessionQuestions.length}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            TOEIC Part 5
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Chọn đáp án đúng cho câu còn thiếu.
          </p>
        </div>

        <div className="mb-5 rounded-2xl bg-white p-4 shadow">
          <p className="text-sm font-semibold text-slate-800">
            Bộ lọc luyện tập
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Số câu trong phiên
              </span>
              <select
                value={String(sessionSize)}
                onChange={(event) =>
                  handleSelectSessionSize(parseSessionSize(event.target.value))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                {sessionSizeOptions.map((size) => (
                  <option key={size} value={String(size)}>
                    {size === "all" ? "Tất cả" : `${size} câu`}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Chủ điểm ngữ pháp
              </span>
              <select
                value={selectedGrammarPoint}
                onChange={(event) =>
                  handleSelectGrammarPoint(event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                {grammarPointOptions.map((grammarPoint) => (
                  <option key={grammarPoint} value={grammarPoint}>
                    {grammarPoint}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Phiên hiện tại có {sessionQuestions.length} câu.
          </p>
        </div>

        <div className="mb-5 rounded-2xl bg-green-50 p-4">
          <p className="text-sm text-green-600">Tiến độ luyện tập</p>
          <p className="mt-1 text-2xl font-bold text-green-700">
            Đã luyện {practicedCount} câu
          </p>
        </div>

        {!hasQuestions ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow">
            <h2 className="text-xl font-bold text-slate-900">
              Chưa có câu hỏi cho chủ điểm này.
            </h2>
            <button
              onClick={() => handleSelectGrammarPoint(allGrammarPointsLabel)}
              className="mt-5 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow"
            >
              Chọn tất cả
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-3xl bg-white p-5 shadow">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {currentQuestion.part}
                </span>

                <span className="text-sm text-slate-500">Điểm: {score}</span>
              </div>

              <h2 className="text-xl font-bold leading-relaxed text-slate-900">
                {currentQuestion.question}
              </h2>

              <div className="mt-5 space-y-3">
                {currentQuestion.options.map((option) => {
                  let buttonClass =
                    "w-full rounded-2xl border p-4 text-left font-medium shadow-sm ";

                  if (!isAnswered) {
                    buttonClass += "border-slate-200 bg-white text-slate-700";
                  } else if (option === currentQuestion.answer) {
                    buttonClass +=
                      "border-green-500 bg-green-50 text-green-700";
                  } else if (option === selectedAnswer) {
                    buttonClass += "border-red-500 bg-red-50 text-red-700";
                  } else {
                    buttonClass += "border-slate-200 bg-white text-slate-400";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectAnswer(option)}
                      className={buttonClass}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p
                    className={`font-bold ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCorrect ? "Chính xác!" : "Chưa đúng"}
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    Đáp án đúng:{" "}
                    <span className="font-semibold">
                      {currentQuestion.answer}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {currentQuestion.explanation}
                  </p>

                  <p className="mt-2 text-xs text-blue-600">
                    Điểm ngữ pháp: {currentQuestion.grammarPoint}
                  </p>
                </div>
              )}
            </div>

            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="mt-5 w-full rounded-2xl bg-blue-600 p-4 font-semibold text-white shadow"
              >
                {isLastQuestion ? "Xem kết quả" : "Câu tiếp theo"}
              </button>
            )}
          </>
        )}

        <button
          onClick={handleResetPracticeCount}
          className="mt-4 w-full rounded-2xl bg-slate-200 p-3 text-sm font-semibold text-slate-700"
        >
          Xóa tổng số câu đã luyện
        </button>
      </section>

      <BottomNav />
    </main>
  );
}
