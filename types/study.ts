// Supported target TOEIC scores for user goal settings.
export type ToeicGoal = 450 | 650 | 750;

// Rating options used when reviewing vocabulary items.
export type ReviewRating = "forgot" | "hard" | "good" | "easy";

// Review history stored for a single vocabulary word.
export type WordReview = {
  rating: ReviewRating;
  count: number;
  lastReviewed: string;
};

// Review records keyed by vocabulary word id.
export type ReviewData = Record<number, WordReview>;

// Number of items/questions included in a study or practice session.
export type SessionSize = 5 | 10 | 20 | "all";

// Aggregated rating totals for a study session.
export type StudySessionRatingCounts = {
  forgot: number;
  hard: number;
  good: number;
  easy: number;
};

// Practice answers that were missed, used for grammar review suggestions.
export type PracticeWrongAnswer = {
  questionId: number;
  grammarPoint: string;
};
