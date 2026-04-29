const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "..", "templates", "vocabulary-template.csv");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "generated-words.json");

const REQUIRED_HEADERS = [
  "id",
  "word",
  "pronunciation",
  "meaning",
  "example",
  "exampleMeaning",
  "topic",
  "level",
  "toeicTarget",
  "difficulty",
  "tags",
  "partOfSpeech",
];

const VALID_LEVELS = new Set(["beginner", "intermediate", "advanced"]);
const VALID_TOEIC_TARGETS = new Set([450, 650, 750]);
const VALID_DIFFICULTIES = new Set([1, 2, 3]);

function fail(message) {
  console.error(`Import failed: ${message}`);
  process.exit(1);
}

function parseCsv(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    fail("CSV file must include a header row and at least one data row.");
  }

  const headers = lines[0].split(",");
  const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    fail(`CSV file is missing required columns: ${missingHeaders.join(", ")}.`);
  }

  return lines.slice(1).map((line, index) => {
    const values = line.split(",");

    if (values.length !== headers.length) {
      fail(
        `Row ${index + 2} has ${values.length} columns but expected ${headers.length}. Avoid commas inside fields.`
      );
    }

    return headers.reduce((row, header, headerIndex) => {
      row[header] = values[headerIndex].trim();
      return row;
    }, {});
  });
}

function parseTags(value) {
  if (!value) {
    return [];
  }

  return value
    .split(";")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function toNumber(value, fieldName, rowNumber) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    fail(`Row ${rowNumber}: ${fieldName} must be a number.`);
  }

  return numberValue;
}

function validateAndTransform(row, index) {
  const rowNumber = index + 2;
  const id = toNumber(row.id, "id", rowNumber);
  const toeicTarget = toNumber(row.toeicTarget, "toeicTarget", rowNumber);
  const difficulty = toNumber(row.difficulty, "difficulty", rowNumber);

  if (!Number.isInteger(id)) {
    fail(`Row ${rowNumber}: id must be an integer.`);
  }

  if (!row.word) {
    fail(`Row ${rowNumber}: word is required.`);
  }

  if (!row.meaning) {
    fail(`Row ${rowNumber}: meaning is required.`);
  }

  if (!VALID_LEVELS.has(row.level)) {
    fail(`Row ${rowNumber}: level must be beginner, intermediate, or advanced.`);
  }

  if (!VALID_TOEIC_TARGETS.has(toeicTarget)) {
    fail(`Row ${rowNumber}: toeicTarget must be 450, 650, or 750.`);
  }

  if (!VALID_DIFFICULTIES.has(difficulty)) {
    fail(`Row ${rowNumber}: difficulty must be 1, 2, or 3.`);
  }

  return {
    id,
    word: row.word,
    pronunciation: row.pronunciation,
    meaning: row.meaning,
    example: row.example,
    exampleMeaning: row.exampleMeaning,
    topic: row.topic,
    level: row.level,
    toeicTarget,
    difficulty,
    tags: parseTags(row.tags),
    partOfSpeech: row.partOfSpeech,
  };
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    fail(`Input file not found: ${path.relative(process.cwd(), INPUT_FILE)}.`);
  }

  const csvContent = fs.readFileSync(INPUT_FILE, "utf8");
  const rows = parseCsv(csvContent);
  const words = rows.map(validateAndTransform);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(words, null, 2)}\n`, "utf8");

  console.log(
    `Imported ${words.length} vocabulary words to ${path.relative(process.cwd(), OUTPUT_FILE)}`
  );
}

main();
