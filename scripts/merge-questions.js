const fs = require("fs");
const path = require("path");

const EXISTING_FILE = path.join(__dirname, "..", "data", "questions.json");
const GENERATED_FILE = path.join(__dirname, "..", "data", "generated-questions.json");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "merged-questions.json");

const REQUIRED_FIELDS = [
  "id",
  "part",
  "question",
  "options",
  "answer",
  "explanation",
  "grammarPoint",
];
const VALID_DIFFICULTIES = new Set([1, 2, 3]);
const VALID_TOEIC_TARGETS = new Set([450, 650, 750]);

function relative(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, "/");
}

function fail(message) {
  console.error(`Merge failed: ${message}`);
  process.exit(1);
}

function readJsonArray(filePath, label) {
  if (!fs.existsSync(filePath)) {
    fail(`${label} file not found: ${relative(filePath)}.`);
  }

  let parsed;

  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${label} file is not valid JSON: ${error.message}`);
  }

  if (!Array.isArray(parsed)) {
    fail(`${label} file must contain an array: ${relative(filePath)}.`);
  }

  return parsed;
}

function requireField(question, fieldName, label, index) {
  if (question[fieldName] === undefined || question[fieldName] === null) {
    fail(`${label} item ${index + 1}: ${fieldName} is required.`);
  }
}

function validateNonEmptyString(value, fieldName, label, index) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} item ${index + 1}: ${fieldName} must be a non-empty string.`);
  }
}

function validateOptions(options, label, index) {
  if (!Array.isArray(options) || options.length !== 4) {
    fail(`${label} item ${index + 1}: options must be an array with exactly 4 items.`);
  }

  options.forEach((option, optionIndex) => {
    if (typeof option !== "string" || option.trim() === "") {
      fail(
        `${label} item ${index + 1}: options[${optionIndex}] must be a non-empty string.`
      );
    }
  });
}

function validateQuestion(question, label, index) {
  if (!question || typeof question !== "object" || Array.isArray(question)) {
    fail(`${label} item ${index + 1}: item must be an object.`);
  }

  REQUIRED_FIELDS.forEach((fieldName) => requireField(question, fieldName, label, index));

  if (typeof question.id !== "number" || !Number.isFinite(question.id)) {
    fail(`${label} item ${index + 1}: id must be a number.`);
  }

  validateNonEmptyString(question.part, "part", label, index);
  validateNonEmptyString(question.question, "question", label, index);
  validateOptions(question.options, label, index);

  if (typeof question.answer !== "string" || !question.options.includes(question.answer)) {
    fail(`${label} item ${index + 1}: answer must exactly match one of the options.`);
  }

  validateNonEmptyString(question.explanation, "explanation", label, index);
  validateNonEmptyString(question.grammarPoint, "grammarPoint", label, index);

  if (question.difficulty !== undefined && !VALID_DIFFICULTIES.has(question.difficulty)) {
    fail(`${label} item ${index + 1}: difficulty must be 1, 2, or 3.`);
  }

  if (question.toeicTarget !== undefined && !VALID_TOEIC_TARGETS.has(question.toeicTarget)) {
    fail(`${label} item ${index + 1}: toeicTarget must be 450, 650, or 750.`);
  }
}

function validateQuestions(questions, label) {
  questions.forEach((question, index) => validateQuestion(question, label, index));
}

function normalizeQuestionText(questionText) {
  return questionText.trim().toLowerCase();
}

function findDuplicateGeneratedValues(generatedQuestions) {
  const ids = new Set();
  const questionTexts = new Set();

  generatedQuestions.forEach((question, index) => {
    if (ids.has(question.id)) {
      fail(`Generated question ${index + 1}: duplicate id ${question.id} in generated-questions.json.`);
    }

    ids.add(question.id);

    const normalizedQuestionText = normalizeQuestionText(question.question);

    if (questionTexts.has(normalizedQuestionText)) {
      fail(
        `Generated question ${index + 1}: duplicate question text "${question.question}" in generated-questions.json.`
      );
    }

    questionTexts.add(normalizedQuestionText);
  });
}

function findConflicts(existingQuestions, generatedQuestions) {
  const existingIds = new Set(existingQuestions.map((question) => question.id));
  const existingQuestionTexts = new Set(
    existingQuestions.map((question) => normalizeQuestionText(question.question))
  );

  generatedQuestions.forEach((question, index) => {
    if (existingIds.has(question.id)) {
      fail(`Generated question ${index + 1}: id ${question.id} already exists in questions.json.`);
    }

    if (existingQuestionTexts.has(normalizeQuestionText(question.question))) {
      fail(
        `Generated question ${index + 1}: question text "${question.question}" already exists in questions.json.`
      );
    }
  });
}

function main() {
  const existingQuestions = readJsonArray(EXISTING_FILE, "Existing questions");
  const generatedQuestions = readJsonArray(GENERATED_FILE, "Generated questions");

  validateQuestions(existingQuestions, "Existing questions");
  validateQuestions(generatedQuestions, "Generated questions");
  findDuplicateGeneratedValues(generatedQuestions);
  findConflicts(existingQuestions, generatedQuestions);

  const mergedQuestions = [...existingQuestions, ...generatedQuestions].sort((a, b) => a.id - b.id);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(mergedQuestions, null, 2)}\n`, "utf8");

  console.log(`Existing questions: ${existingQuestions.length}`);
  console.log(`Generated questions: ${generatedQuestions.length}`);
  console.log(`Merged questions: ${mergedQuestions.length}`);
  console.log(`Output: ${relative(OUTPUT_FILE)}`);
  console.log(`${relative(EXISTING_FILE)} was not modified.`);
}

main();
