import wordsData from "./words.json";

export type WordLevel = "beginner" | "intermediate" | "advanced";

export type ToeicWord = {
  id: number;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  topic: string;
  level: WordLevel;
  toeicTarget: 450 | 650 | 750;
  difficulty: 1 | 2 | 3;
};

export const words = wordsData as ToeicWord[];