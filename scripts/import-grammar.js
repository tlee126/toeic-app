const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "..", "templates", "grammar-template.csv");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "generated-grammar.json");

const REQUIRED_HEADERS = [
  "id",
  "title",
  "titleVi",
  "level",
  "toeicPart",
  "summary",
  "rules",
  "exampleEn1",
  "exampleVi1",
  "exampleEn2",
  "exampleVi2",
  "relatedQuestionIds",
];

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

function parseList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseRelatedQuestionIds(value, rowNumber) {
  return parseList(value).map((item) => {
    const id = toNumber(item, "relatedQuestionIds", rowNumber);

    if (!Number.isInteger(id)) {
      fail(`Row ${rowNumber}: relatedQuestionIds must contain integers.`);
    }

    return id;
  });
}

function parseExamples(row) {
  const examples = [
    {
      en: row.exampleEn1,
      vi: row.exampleVi1,
    },
  ];

  if (row.exampleEn2 || row.exampleVi2) {
    examples.push({
      en: row.exampleEn2,
      vi: row.exampleVi2,
    });
  }

  return examples;
}

function validateAndTransform(row, index) {
  const rowNumber = index + 2;
  const id = toNumber(row.id, "id", rowNumber);
  const rules = parseList(row.rules);
  const relatedQuestionIds = parseRelatedQuestionIds(row.relatedQuestionIds, rowNumber);

  if (!Number.isInteger(id)) {
    fail(`Row ${rowNumber}: id must be an integer.`);
  }

  requireValue(row, "title", rowNumber);
  requireValue(row, "titleVi", rowNumber);
  requireValue(row, "level", rowNumber);
  requireValue(row, "toeicPart", rowNumber);
  requireValue(row, "summary", rowNumber);
  requireValue(row, "exampleEn1", rowNumber);
  requireValue(row, "exampleVi1", rowNumber);

  if (rules.length === 0) {
    fail(`Row ${rowNumber}: rules must have at least one rule.`);
  }

  return {
    id,
    title: row.title,
    titleVi: row.titleVi,
    level: row.level,
    toeicPart: row.toeicPart,
    summary: row.summary,
    rules,
    examples: parseExamples(row),
    relatedQuestionIds,
  };
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    fail(`Input file not found: ${path.relative(process.cwd(), INPUT_FILE)}.`);
  }

  const csvContent = fs.readFileSync(INPUT_FILE, "utf8");
  const rows = parseCsv(csvContent);
  const grammarLessons = rows.map(validateAndTransform);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(grammarLessons, null, 2)}\n`, "utf8");

  console.log(
    `Imported ${grammarLessons.length} grammar lessons to ${path.relative(process.cwd(), OUTPUT_FILE)}`
  );
}

main();
