const fs = require("fs");
const path = require("path");

const EXISTING_FILE = path.join(__dirname, "..", "data", "grammar.json");
const GENERATED_FILE = path.join(__dirname, "..", "data", "generated-grammar.json");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "merged-grammar.json");

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

function requireField(lesson, fieldName, label, index) {
  if (lesson[fieldName] === undefined || lesson[fieldName] === null) {
    fail(`${label} item ${index + 1}: ${fieldName} is required.`);
  }
}

function validateNonEmptyString(value, fieldName, label, index) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} item ${index + 1}: ${fieldName} must be a non-empty string.`);
  }
}

function validateNonEmptyArray(value, fieldName, label, index) {
  if (!Array.isArray(value) || value.length === 0) {
    fail(`${label} item ${index + 1}: ${fieldName} must be an array with at least one item.`);
  }
}

function validateExamples(examples, label, index) {
  validateNonEmptyArray(examples, "examples", label, index);

  examples.forEach((example, exampleIndex) => {
    if (!example || typeof example !== "object" || Array.isArray(example)) {
      fail(`${label} item ${index + 1}: examples[${exampleIndex}] must be an object.`);
    }

    if (example.en === undefined || example.en === null) {
      fail(`${label} item ${index + 1}: examples[${exampleIndex}].en is required.`);
    }

    if (example.vi === undefined || example.vi === null) {
      fail(`${label} item ${index + 1}: examples[${exampleIndex}].vi is required.`);
    }
  });
}

function validateLesson(lesson, label, index) {
  if (!lesson || typeof lesson !== "object" || Array.isArray(lesson)) {
    fail(`${label} item ${index + 1}: item must be an object.`);
  }

  REQUIRED_FIELDS.forEach((fieldName) => requireField(lesson, fieldName, label, index));

  if (typeof lesson.id !== "number" || !Number.isFinite(lesson.id)) {
    fail(`${label} item ${index + 1}: id must be a number.`);
  }

  validateNonEmptyString(lesson.title, "title", label, index);
  validateNonEmptyString(lesson.titleVi, "titleVi", label, index);
  validateNonEmptyString(lesson.level, "level", label, index);
  validateNonEmptyString(lesson.toeicPart, "toeicPart", label, index);
  validateNonEmptyString(lesson.summary, "summary", label, index);
  validateNonEmptyArray(lesson.rules, "rules", label, index);
  validateExamples(lesson.examples, label, index);
}

function validateLessons(lessons, label) {
  lessons.forEach((lesson, index) => validateLesson(lesson, label, index));
}

function normalizeTitle(title) {
  return title.trim().toLowerCase();
}

function findDuplicateGeneratedValues(generatedLessons) {
  const ids = new Set();
  const titles = new Set();

  generatedLessons.forEach((lesson, index) => {
    if (ids.has(lesson.id)) {
      fail(`Generated grammar lesson ${index + 1}: duplicate id ${lesson.id} in generated-grammar.json.`);
    }

    ids.add(lesson.id);

    const normalizedTitle = normalizeTitle(lesson.title);

    if (titles.has(normalizedTitle)) {
      fail(
        `Generated grammar lesson ${index + 1}: duplicate title "${lesson.title}" in generated-grammar.json.`
      );
    }

    titles.add(normalizedTitle);
  });
}

function findConflicts(existingLessons, generatedLessons) {
  const existingIds = new Set(existingLessons.map((lesson) => lesson.id));
  const existingTitles = new Set(existingLessons.map((lesson) => normalizeTitle(lesson.title)));

  generatedLessons.forEach((lesson, index) => {
    if (existingIds.has(lesson.id)) {
      fail(`Generated grammar lesson ${index + 1}: id ${lesson.id} already exists in grammar.json.`);
    }

    if (existingTitles.has(normalizeTitle(lesson.title))) {
      fail(
        `Generated grammar lesson ${index + 1}: title "${lesson.title}" already exists in grammar.json.`
      );
    }
  });
}

function main() {
  const existingLessons = readJsonArray(EXISTING_FILE, "Existing grammar lessons");
  const generatedLessons = readJsonArray(GENERATED_FILE, "Generated grammar lessons");

  validateLessons(existingLessons, "Existing grammar lessons");
  validateLessons(generatedLessons, "Generated grammar lessons");
  findDuplicateGeneratedValues(generatedLessons);
  findConflicts(existingLessons, generatedLessons);

  const mergedLessons = [...existingLessons, ...generatedLessons].sort((a, b) => a.id - b.id);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(mergedLessons, null, 2)}\n`, "utf8");

  console.log(`Existing grammar lessons: ${existingLessons.length}`);
  console.log(`Generated grammar lessons: ${generatedLessons.length}`);
  console.log(`Merged grammar lessons: ${mergedLessons.length}`);
  console.log(`Output: ${relative(OUTPUT_FILE)}`);
  console.log(`${relative(EXISTING_FILE)} was not modified.`);
}

main();
