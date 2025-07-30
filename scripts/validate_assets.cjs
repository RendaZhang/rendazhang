const fs = require('fs');
const path = require('path');

const imageRegex =
  /^[\w-]+-[\w-]+-(?:low|medium|high)-(?:square|circle|rectangle)-(\d+)x(\d+)\.(?:jpg|png|ico)$/i;
const pdfRegex = /^[\w\u4e00-\u9fa5_]+\.pdf$/i;
const musicRegex = /^[\w-]+-[\w-]+-[\w-]+-[\w-]+\.mp3$/i;
const qrcodeRegex =
  /^qrcode-[\w-]+-(?:low|medium|high)-(?:square|circle|rectangle)-(\d+)x(\d+)\.jpg$/i;
const readmeRegex = /^README(_EN)?\.md$/i;

function validate(dir, regexes) {
  const errors = [];
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
  console.error('Invalid file names detected:');
  console.error('Assets:', assetErrors.join(', '));
  process.exit(1);
}
console.log('All asset file names follow the expected conventions.');
