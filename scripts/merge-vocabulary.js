const fs = require("fs");
const path = require("path");

const EXISTING_FILE = path.join(__dirname, "..", "data", "words.json");
const GENERATED_FILE = path.join(__dirname, "..", "data", "generated-words.json");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "merged-words.json");

const VALID_LEVELS = new Set(["beginner", "intermediate", "advanced"]);
const VALID_TOEIC_TARGETS = new Set([450, 650, 750]);
const VALID_DIFFICULTIES = new Set([1, 2, 3]);

function relative(filePath) {
  return path.relative(process.cwd(), filePath);
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

function requireField(word, fieldName, label, index) {
  if (word[fieldName] === undefined || word[fieldName] === null || word[fieldName] === "") {
    fail(`${label} item ${index + 1}: ${fieldName} is required.`);
  }
}

function validateWord(word, label, index) {
  if (!word || typeof word !== "object" || Array.isArray(word)) {
    fail(`${label} item ${index + 1}: item must be an object.`);
  }

  requireField(word, "id", label, index);
  requireField(word, "word", label, index);
  requireField(word, "meaning", label, index);
  requireField(word, "topic", label, index);
  requireField(word, "level", label, index);
  requireField(word, "toeicTarget", label, index);
  requireField(word, "difficulty", label, index);

  if (typeof word.id !== "number" || !Number.isFinite(word.id)) {
    fail(`${label} item ${index + 1}: id must be a number.`);
  }

  if (typeof word.word !== "string" || word.word.trim() === "") {
    fail(`${label} item ${index + 1}: word must be a non-empty string.`);
  }

  if (!VALID_LEVELS.has(word.level)) {
    fail(`${label} item ${index + 1}: level must be beginner, intermediate, or advanced.`);
  }

  if (!VALID_TOEIC_TARGETS.has(word.toeicTarget)) {
    fail(`${label} item ${index + 1}: toeicTarget must be 450, 650, or 750.`);
  }

  if (!VALID_DIFFICULTIES.has(word.difficulty)) {
    fail(`${label} item ${index + 1}: difficulty must be 1, 2, or 3.`);
  }
}

function validateWords(words, label) {
  words.forEach((word, index) => validateWord(word, label, index));
}

function findDuplicateGeneratedValues(generatedWords) {
  const ids = new Set();
  const normalizedWords = new Set();

  generatedWords.forEach((word, index) => {
    if (ids.has(word.id)) {
      fail(`Generated item ${index + 1}: duplicate id ${word.id} in generated-words.json.`);
    }

    ids.add(word.id);

    const normalizedWord = word.word.toLowerCase();

    if (normalizedWords.has(normalizedWord)) {
      fail(
        `Generated item ${index + 1}: duplicate word "${word.word}" in generated-words.json.`
      );
    }

    normalizedWords.add(normalizedWord);
  });
}

function findConflicts(existingWords, generatedWords) {
  const existingIds = new Set(existingWords.map((word) => word.id));
  const existingWordTexts = new Set(existingWords.map((word) => word.word.toLowerCase()));

  generatedWords.forEach((word, index) => {
    if (existingIds.has(word.id)) {
      fail(`Generated item ${index + 1}: id ${word.id} already exists in words.json.`);
    }

    if (existingWordTexts.has(word.word.toLowerCase())) {
      fail(`Generated item ${index + 1}: word "${word.word}" already exists in words.json.`);
    }
  });
}

function main() {
  const existingWords = readJsonArray(EXISTING_FILE, "Existing words");
  const generatedWords = readJsonArray(GENERATED_FILE, "Generated words");

  validateWords(existingWords, "Existing words");
  validateWords(generatedWords, "Generated words");
  findDuplicateGeneratedValues(generatedWords);
  findConflicts(existingWords, generatedWords);

  const mergedWords = [...existingWords, ...generatedWords].sort((a, b) => a.id - b.id);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(mergedWords, null, 2)}\n`, "utf8");

  console.log(`Existing words: ${existingWords.length}`);
  console.log(`Generated words: ${generatedWords.length}`);
  console.log(`Merged words: ${mergedWords.length}`);
  console.log(`Output: ${relative(OUTPUT_FILE)}`);
  console.log(`${relative(EXISTING_FILE)} was not modified.`);
}

main();
