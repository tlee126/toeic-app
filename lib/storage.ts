import type { ReviewData, ToeicGoal } from "@/types/study";

export const STORAGE_KEYS = {
  toeicGoal: "toeicGoal",
  reviewedCount: "reviewedCount",
  practicedCount: "practicedCount",
  wordReviewData: "wordReviewData",
} as const;

export function isBrowser() {
  return typeof window !== "undefined";
}

export function getToeicGoal(defaultGoal: ToeicGoal = 450): ToeicGoal {
  if (!isBrowser()) {
    return defaultGoal;
  }

  const savedGoal = localStorage.getItem(STORAGE_KEYS.toeicGoal);

  if (savedGoal === "450" || savedGoal === "650" || savedGoal === "750") {
    return Number(savedGoal) as ToeicGoal;
  }

  return defaultGoal;
}

export function setToeicGoal(goal: ToeicGoal) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.toeicGoal, String(goal));
}

export function getReviewedCount() {
  if (!isBrowser()) {
    return 0;
  }

  return Number(localStorage.getItem(STORAGE_KEYS.reviewedCount) ?? 0);
}

export function setReviewedCount(count: number) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.reviewedCount, String(count));
}

export function getPracticedCount() {
  if (!isBrowser()) {
    return 0;
  }

  return Number(localStorage.getItem(STORAGE_KEYS.practicedCount) ?? 0);
}

export function setPracticedCount(count: number) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.practicedCount, String(count));
}

export function getWordReviewData(): ReviewData {
  if (!isBrowser()) {
    return {};
  }

  const savedData = localStorage.getItem(STORAGE_KEYS.wordReviewData);

  if (!savedData) {
    return {};
  }

  try {
    return JSON.parse(savedData) as ReviewData;
  } catch {
    return {};
  }
}

export function setWordReviewData(data: ReviewData) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.wordReviewData, JSON.stringify(data));
}

export function clearWordReviewData() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.wordReviewData);
}
