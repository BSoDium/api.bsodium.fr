import { exec } from "child_process";

// Only Puppeteer-based sources still need freeze scripts.
// API-based sources (GitHub, DeviantArt) now use ISR directly.
const freezeScripts = [
  "./src/app/api/featured/figma/freeze.ts",
  "./src/app/api/featured/researchgate/freeze.ts",
];

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

for (const script of freezeScripts) {
  processFile(script);
}
