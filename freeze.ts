import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const directory = './src/app/api/featured';
const fileName = 'freeze.ts';

function processFile(filePath: string) {
  console.log(`Spawning process for file: ${filePath}`);
  // run `tsx ${filePath}` here
  exec(`tsx ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`::error file=${filePath},title=An error was encountered during the freezing process::${error}`);
      return;
    }
    
    if (stderr.length > 0)
      console.log(`::warning file=${filePath},title=Some issues were encountered during the freezing process::${stderr}`);
    if (stdout.length > 0)
      console.log(stdout);
  });
}

function traverseDirectory(directoryPath: string) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      traverseDirectory(filePath);
    } else if (stats.isFile() && path.basename(filePath) === fileName) {
      processFile(filePath);
    }
  }
}

traverseDirectory(directory);