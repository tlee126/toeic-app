const fs = require("fs");
const path = require("path");

const MERGED_FILE = path.join(__dirname, "..", "data", "merged-words.json");
const WORDS_FILE = path.join(__dirname, "..", "data", "words.json");
const BACKUP_FILE = path.join(__dirname, "..", "data", "backup-words.json");

function relative(filePath) {
  return path.relative(process.cwd(), filePath);
}

function fail(message) {
  console.error(`Promote failed: ${message}`);
  process.exit(1);
}

function requireConfirmation() {
  if (!process.argv.includes("--confirm")) {
    console.error("Warning: this command will overwrite data/words.json.");
    console.error("Review data/merged-words.json before promoting vocabulary data.");
    console.error("Run the command again with explicit confirmation:");
    console.error("node scripts/promote-vocabulary.js --confirm");
    process.exit(1);
  }
}

function readMergedWords() {
  if (!fs.existsSync(MERGED_FILE)) {
    fail(`Merged vocabulary file not found: ${relative(MERGED_FILE)}.`);
  }

  let words;

  try {
    words = JSON.parse(fs.readFileSync(MERGED_FILE, "utf8"));
  } catch (error) {
    fail(`${relative(MERGED_FILE)} is not valid JSON: ${error.message}`);
  }

  if (!Array.isArray(words)) {
    fail(`${relative(MERGED_FILE)} must contain a JSON array.`);
  }

  if (words.length === 0) {
    fail(`${relative(MERGED_FILE)} must not be empty.`);
  }

  words.forEach((word, index) => {
    if (!word || typeof word !== "object" || Array.isArray(word)) {
      fail(`Item ${index + 1}: item must be an object.`);
    }

    if (word.id === undefined || word.id === null || word.id === "") {
      fail(`Item ${index + 1}: id is required.`);
    }

    if (word.word === undefined || word.word === null || word.word === "") {
      fail(`Item ${index + 1}: word is required.`);
    }
  });

  return words;
}

function main() {
  requireConfirmation();

  const mergedWords = readMergedWords();

  if (!fs.existsSync(WORDS_FILE)) {
    fail(`Current vocabulary file not found: ${relative(WORDS_FILE)}.`);
  }

  fs.copyFileSync(WORDS_FILE, BACKUP_FILE);
  fs.writeFileSync(WORDS_FILE, `${JSON.stringify(mergedWords, null, 2)}\n`, "utf8");

  console.log(`Backup created: ${relative(BACKUP_FILE)}`);
  console.log(`Promoted: ${relative(MERGED_FILE)} -> ${relative(WORDS_FILE)}`);
  console.log(`Total words: ${mergedWords.length}`);
}

main();
