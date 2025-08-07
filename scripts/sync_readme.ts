import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import logger from '../src/utils/logger';

// Resolve paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const rootReadme = path.join(root, 'README.md');
const assetsReadme = path.join(root, 'src', 'assets', 'README.md');
const rootReadmeEn = path.join(root, 'README_EN.md');
const assetsReadmeEn = path.join(root, 'src', 'assets', 'README_EN.md');

function copyAndStage(src: string, dest: string): void {
  if (fs.existsSync(src)) {
    try {
      fs.copyFileSync(src, dest);
      logger.log(`Copied ${src} to ${dest}`);
    } catch (err: any) {
      logger.error(`Failed to copy file: ${err.message}`);
      process.exit(1);
    }
    try {
      execFileSync('git', ['add', dest]);
      logger.log(`Added ${dest} to git`);
    } catch (err: any) {
      logger.error(`Failed to add file to git: ${err.message}`);
      process.exit(1);
    }
  } else {
    logger.error(`File ${src} does not exist`);
    process.exit(1);
  }
}

copyAndStage(rootReadme, assetsReadme);
copyAndStage(rootReadmeEn, assetsReadmeEn);
