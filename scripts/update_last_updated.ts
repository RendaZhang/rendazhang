import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from '../src/utils/logger';

/**
 * Regular expression that finds Markdown lines of the form:
 *
 * `- **最后更新**: Month DD, YYYY, HH:MM (UTC±HH:MM)` or
 * `- **Last Updated**: Month DD, YYYY, HH:MM (UTC±HH:MM)`
 *
 * Two capture groups are used: `prefix` for the static prefix and
 * `timestamp` for the actual timestamp string.
 */
const LINE_RE = /^(?<prefix>- \*\*(?:最后更新|Last Updated)\*\*: )(?<timestamp>[A-Za-z]+ \d{1,2}, \d{4}, \d{1,2}:\d{2} \(UTC[+-]\d{1,2}:\d{2}\))$/gm;

/**
 * Format the current date/time into the timestamp format expected by the docs.
 */
function formatNow(): string {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const minutes = String(Math.abs(offset) % 60).padStart(2, '0');
  const tzFormatted = `UTC${sign}${hours}:${minutes}`;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = months[now.getMonth()];
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${month} ${day}, ${year}, ${hour}:${minute} (${tzFormatted})`;
}

/**
 * Update the timestamp line in a single file if necessary.
 *
 * @param p Absolute or relative path to the Markdown file.
 * @returns Whether the file was modified.
 */
async function updateFile(p: string): Promise<boolean> {
  try {
    const text = await fs.promises.readFile(p, 'utf8');
    if (!LINE_RE.test(text)) {
      logger.log(`Skipping ${p}: no timestamp found`);
      return false;
    }
    LINE_RE.lastIndex = 0;
    const timestamp = formatNow();
    let updated = false;
    let newText = text.replace(LINE_RE, (match, _p1, oldTimestamp) => {
      if (oldTimestamp !== timestamp) {
        updated = true;
        logger.log(`Updating timestamp in ${p}: ${oldTimestamp} -> ${timestamp}`);
        return match.replace(oldTimestamp, timestamp);
      }
      return match;
    });
    if (updated) {
      if (!newText.endsWith('\n')) {
        newText += '\n';
      }
      await fs.promises.writeFile(p, newText, 'utf8');
      return true;
    }
    logger.log(`Timestamp unchanged in ${p}`);
    return false;
  } catch (e) {
    logger.error(`Error processing ${p}: ${(e as Error).message}`);
    return false;
  }
}

/**
 * Update multiple files, returning the number of errors encountered.
 */
export async function updateFiles(files: string[]): Promise<number> {
  let updatedCount = 0;
  let errorCount = 0;
  for (const file of files) {
    try {
      const stat = await fs.promises.stat(file);
      if (stat.isFile()) {
        const updated = await updateFile(file);
        if (updated) updatedCount += 1;
      }
    } catch (e) {
      logger.error(`Error processing ${file}: ${(e as Error).message}`);
      errorCount += 1;
    }
  }
  logger.log(`Updated timestamps in ${updatedCount}/${files.length} files`);
  return errorCount;
}

/**
 * CLI entry point. Accepts file paths as arguments and exits with the
 * number of files that failed to update.
 */
async function main() {
  const files = process.argv.slice(2);
  const errors = await updateFiles(files);
  process.exit(errors);
}

// Allow the script to be imported as a module or run directly
const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] === scriptPath) {
  main();
}
