const fs = require("fs");
const path = require("path");

const MERGED_FILE = path.join(__dirname, "..", "data", "merged-grammar.json");
const GRAMMAR_FILE = path.join(__dirname, "..", "data", "grammar.json");
const BACKUP_FILE = path.join(__dirname, "..", "data", "backup-grammar.json");

const REQUIRED_FIELDS = [
  "id",
  "title",
  "titleVi",
  "level",
  "toeicPart",
  "summary",
  "rules",
  "examples",
];

function relative(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, "/");
}

function fail(message) {
  console.error(`Promote failed: ${message}`);
  process.exit(1);
}

function requireConfirmation() {
  if (!process.argv.includes("--confirm")) {
    console.error("Warning: this command will overwrite data/grammar.json.");
    console.error("Review data/merged-grammar.json before promoting grammar data.");
    console.error("Run the command again with explicit confirmation:");
    console.error("node scripts/promote-grammar.js --confirm");
    process.exit(1);
  }
}

function requireField(lesson, fieldName, index) {
  if (lesson[fieldName] === undefined || lesson[fieldName] === null || lesson[fieldName] === "") {
    fail(`Item ${index + 1}: ${fieldName} is required.`);
  }
}

function readMergedGrammarLessons() {
  if (!fs.existsSync(MERGED_FILE)) {
    fail(`Merged grammar file not found: ${relative(MERGED_FILE)}.`);
  }

  let lessons;

  try {
    lessons = JSON.parse(fs.readFileSync(MERGED_FILE, "utf8"));
  } catch (error) {
    fail(`${relative(MERGED_FILE)} is not valid JSON: ${error.message}`);
  }

  if (!Array.isArray(lessons)) {
    fail(`${relative(MERGED_FILE)} must contain a JSON array.`);
  }

  if (lessons.length === 0) {
    fail(`${relative(MERGED_FILE)} must not be empty.`);
  }

  lessons.forEach((lesson, index) => {
    if (!lesson || typeof lesson !== "object" || Array.isArray(lesson)) {
      fail(`Item ${index + 1}: item must be an object.`);
    }

    REQUIRED_FIELDS.forEach((fieldName) => requireField(lesson, fieldName, index));

    if (!Array.isArray(lesson.rules)) {
      fail(`Item ${index + 1}: rules must be an array.`);
    }

    if (!Array.isArray(lesson.examples)) {
      fail(`Item ${index + 1}: examples must be an array.`);
    }
  });

  return lessons;
}

function main() {
  requireConfirmation();

  const mergedLessons = readMergedGrammarLessons();

  if (!fs.existsSync(GRAMMAR_FILE)) {
    fail(`Current grammar file not found: ${relative(GRAMMAR_FILE)}.`);
  }

  fs.copyFileSync(GRAMMAR_FILE, BACKUP_FILE);
  fs.writeFileSync(GRAMMAR_FILE, `${JSON.stringify(mergedLessons, null, 2)}\n`, "utf8");

  console.log(`Backup created: ${relative(BACKUP_FILE)}`);
  console.log(`Promoted: ${relative(MERGED_FILE)} -> ${relative(GRAMMAR_FILE)}`);
  console.log(`Total grammar lessons: ${mergedLessons.length}`);
}

main();
