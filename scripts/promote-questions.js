const fs = require("fs");
const path = require("path");

const MERGED_FILE = path.join(__dirname, "..", "data", "merged-questions.json");
const QUESTIONS_FILE = path.join(__dirname, "..", "data", "questions.json");
const BACKUP_FILE = path.join(__dirname, "..", "data", "backup-questions.json");

const REQUIRED_FIELDS = ["id", "question", "options", "answer", "explanation", "grammarPoint"];

function relative(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, "/");
}

function fail(message) {
  console.error(`Promote failed: ${message}`);
  process.exit(1);
}

function requireConfirmation() {
  if (!process.argv.includes("--confirm")) {
    console.error("Warning: this command will overwrite data/questions.json.");
    console.error("Review data/merged-questions.json before promoting question data.");
    console.error("Run the command again with explicit confirmation:");
    console.error("node scripts/promote-questions.js --confirm");
    process.exit(1);
  }
}

function requireField(question, fieldName, index) {
  if (question[fieldName] === undefined || question[fieldName] === null || question[fieldName] === "") {
    fail(`Item ${index + 1}: ${fieldName} is required.`);
  }
}

function readMergedQuestions() {
  if (!fs.existsSync(MERGED_FILE)) {
    fail(`Merged questions file not found: ${relative(MERGED_FILE)}.`);
  }

  let questions;

  try {
    questions = JSON.parse(fs.readFileSync(MERGED_FILE, "utf8"));
  } catch (error) {
    fail(`${relative(MERGED_FILE)} is not valid JSON: ${error.message}`);
  }

  if (!Array.isArray(questions)) {
    fail(`${relative(MERGED_FILE)} must contain a JSON array.`);
  }

  if (questions.length === 0) {
    fail(`${relative(MERGED_FILE)} must not be empty.`);
  }

  questions.forEach((question, index) => {
    if (!question || typeof question !== "object" || Array.isArray(question)) {
      fail(`Item ${index + 1}: item must be an object.`);
    }

    REQUIRED_FIELDS.forEach((fieldName) => requireField(question, fieldName, index));

    if (!Array.isArray(question.options)) {
      fail(`Item ${index + 1}: options must be an array.`);
    }
  });

  return questions;
}

function main() {
  requireConfirmation();

  const mergedQuestions = readMergedQuestions();

  if (!fs.existsSync(QUESTIONS_FILE)) {
    fail(`Current questions file not found: ${relative(QUESTIONS_FILE)}.`);
  }

  fs.copyFileSync(QUESTIONS_FILE, BACKUP_FILE);
  fs.writeFileSync(QUESTIONS_FILE, `${JSON.stringify(mergedQuestions, null, 2)}\n`, "utf8");

  console.log(`Backup created: ${relative(BACKUP_FILE)}`);
  console.log(`Promoted: ${relative(MERGED_FILE)} -> ${relative(QUESTIONS_FILE)}`);
  console.log(`Total questions: ${mergedQuestions.length}`);
}

main();
