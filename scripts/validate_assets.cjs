const fs = require('fs');
const path = require('path');

const imageRegex =
  /^[\w-]+-[\w-]+-(?:low|medium|high)-(?:square|circle|rectangle)-(\d+)x(\d+)\.(?:jpg|png)$/i;
const pdfRegex = /^[\w\u4e00-\u9fa5_]+\.pdf$/i;
const musicRegex = /^[\w-]+-[\w-]+-[\w-]+-[\w-]+\.mp3$/i;
const qrcodeRegex =
  /^qrcode-[\w-]+-(?:low|medium|high)-(?:square|circle|rectangle)-(\d+)x(\d+)\.jpg$/i;

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

const imageErrors = validate(path.join(__dirname, '..', 'public', 'images'), [
  imageRegex,
  pdfRegex
]);
const assetErrors = validate(path.join(__dirname, '..', 'src', 'assets'), [
  musicRegex,
  qrcodeRegex
]);

if (imageErrors.length || assetErrors.length) {
  console.error('Invalid file names detected:');
  if (imageErrors.length) console.error('Images:', imageErrors.join(', '));
  if (assetErrors.length) console.error('Assets:', assetErrors.join(', '));
  process.exit(1);
}
console.log('All asset file names follow the expected conventions.');
