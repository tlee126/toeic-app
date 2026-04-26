import grammarData from "./grammar.json";

export type GrammarExample = {
  en: string;
  vi: string;
};

export type GrammarLesson = {
  id: number;
  title: string;
  titleVi: string;
  level: string;
  toeicPart: string;
  summary: string;
  rules: string[];
  examples: GrammarExample[];
};

export const grammarLessons = grammarData as GrammarLesson[];