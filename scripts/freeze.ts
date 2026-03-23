import { exec } from "child_process";

// All Puppeteer-based freeze scripts have been removed.
// DeviantArt → replaced by ArtStation (public JSON API, uses ISR directly)
// Figma → removed entirely
// ResearchGate → returns empty array, no scraping needed
//
// This script is kept for future use if new freeze-based sources are added.
const freezeScripts: string[] = [];

function processFile(filePath: string) {
  console.log(`Spawning process for file: ${filePath}`);
  exec(`tsx ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(
        `::error file=${filePath},title=An error was encountered during the freezing process::${error}`,
      );
      return;
    }

    if (stderr.length > 0)
      console.log(
        `::warning file=${filePath},title=Some issues were encountered during the freezing process::${stderr}`,
      );
    if (stdout.length > 0) console.log(stdout);
  });
}

if (freezeScripts.length === 0) {
  console.log("No freeze scripts to run.");
} else {
  for (const script of freezeScripts) {
    processFile(script);
  }
}
