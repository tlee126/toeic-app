const path = require("path");
const { spawnSync } = require("child_process");

const IMPORT_SCRIPTS = [
  "import-vocabulary.js",
  "import-questions.js",
  "import-grammar.js",
];

function fail(message) {
  console.error(`Import failed: ${message}`);
  process.exit(1);
}

function runImport(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
  });

  if (result.error) {
    fail(`Could not run ${path.join("scripts", scriptName)}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`${path.join("scripts", scriptName)} exited with status ${result.status}.`);
  }
}

function main() {
  IMPORT_SCRIPTS.forEach(runImport);
  console.log("All CSV imports completed successfully.");
}

main();
