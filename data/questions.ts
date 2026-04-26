import questionsData from "./questions.json";

export type ToeicQuestion = {
  id: number;
  part: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  grammarPoint: string;
};

export const questions = questionsData as ToeicQuestion[];