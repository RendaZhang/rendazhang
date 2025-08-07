import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import logger from '../src/utils/logger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imageRegex =
  /^[\w-]+-[\w-]+-(?:low|medium|high)-(?:square|circle|rectangle)-(\d+)x(\d+)\.(?:jpg|png|ico)$/i;
const pdfRegex = /^[\w\u4e00-\u9fa5_]+\.pdf$/i;
const musicRegex = /^[\w-]+-[\w-]+-[\w-]+-[\w-]+\.mp3$/i;
const qrcodeRegex =
  /^qrcode-[\w-]+-(?:low|medium|high)-(?:square|circle|rectangle)-(\d+)x(\d+)\.jpg$/i;
const readmeRegex = /^README(_EN)?\.md$/i;

function validate(dir: string, regexes: RegExp[]): string[] {
  const errors: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    const filePath = path.join(dir, name);
    if (fs.statSync(filePath).isDirectory()) continue;
    if (!regexes.some((r) => r.test(name))) {
      errors.push(name);
    }
  }
  return errors;
}

const assetErrors = validate(path.join(__dirname, '..', 'src', 'assets'), [
  musicRegex,
  qrcodeRegex,
  imageRegex,
  pdfRegex,
  readmeRegex
]);

if (assetErrors.length) {
  logger.error('Invalid file names detected:');
  logger.error('Assets:', assetErrors.join(', '));
  process.exit(1);
}

logger.log('All asset file names follow the expected conventions.');
