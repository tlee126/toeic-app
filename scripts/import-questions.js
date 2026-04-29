const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "..", "templates", "questions-template.csv");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "generated-questions.json");

const REQUIRED_HEADERS = [
  "id",
  "part",
  "question",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "answer",
  "explanation",
  "grammarPoint",
  "difficulty",
  "toeicTarget",
  "topic",
];

const VALID_DIFFICULTIES = new Set([1, 2, 3]);
const VALID_TOEIC_TARGETS = new Set([450, 650, 750]);

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

function toNumber(value, fieldName, rowNumber) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    fail(`Row ${rowNumber}: ${fieldName} must be a number.`);
  }

  return numberValue;
}

function requireValue(row, fieldName, rowNumber) {
  if (!row[fieldName]) {
    fail(`Row ${rowNumber}: ${fieldName} is required.`);
  }
}

function validateAndTransform(row, index) {
  const rowNumber = index + 2;
  const id = toNumber(row.id, "id", rowNumber);
  const difficulty = toNumber(row.difficulty, "difficulty", rowNumber);
  const toeicTarget = toNumber(row.toeicTarget, "toeicTarget", rowNumber);
  const options = [row.optionA, row.optionB, row.optionC, row.optionD];

  if (!Number.isInteger(id)) {
    fail(`Row ${rowNumber}: id must be an integer.`);
  }

  requireValue(row, "part", rowNumber);
  requireValue(row, "question", rowNumber);
  requireValue(row, "optionA", rowNumber);
  requireValue(row, "optionB", rowNumber);
  requireValue(row, "optionC", rowNumber);
  requireValue(row, "optionD", rowNumber);
  requireValue(row, "explanation", rowNumber);
  requireValue(row, "grammarPoint", rowNumber);

  if (!options.includes(row.answer)) {
    fail(`Row ${rowNumber}: answer must exactly match one of optionA, optionB, optionC, or optionD.`);
  }

  if (!VALID_DIFFICULTIES.has(difficulty)) {
    fail(`Row ${rowNumber}: difficulty must be 1, 2, or 3.`);
  }

  if (!VALID_TOEIC_TARGETS.has(toeicTarget)) {
    fail(`Row ${rowNumber}: toeicTarget must be 450, 650, or 750.`);
  }

  return {
    id,
    part: row.part,
    question: row.question,
    options,
    answer: row.answer,
    explanation: row.explanation,
    grammarPoint: row.grammarPoint,
    difficulty,
    toeicTarget,
    topic: row.topic,
  };
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    fail(`Input file not found: ${path.relative(process.cwd(), INPUT_FILE)}.`);
  }

  const csvContent = fs.readFileSync(INPUT_FILE, "utf8");
  const rows = parseCsv(csvContent);
  const questions = rows.map(validateAndTransform);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(questions, null, 2)}\n`, "utf8");

  console.log(
    `Imported ${questions.length} practice questions to ${path.relative(process.cwd(), OUTPUT_FILE)}`
  );
}

main();
