import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('src');
const JS_EXTS = new Set(['.js', '.cjs', '.mjs', '.jsx', '.ts', '.tsx']);

function toExportName(file) {
  const name = path.parse(file).name;
  return name.replace(/[-_]+(\w)/g, (_, c) => c.toUpperCase());
}

async function generate(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const dirs = [];
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      dirs.push(entry.name);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!JS_EXTS.has(ext)) continue;
      if (/^index\.(js|ts|jsx|tsx|cjs|mjs)$/.test(entry.name)) continue;
      files.push(entry.name);
    }
  }

  dirs.sort();
  files.sort();

  const lines = [];

  for (const d of dirs) {
    const subDir = path.join(dir, d);
    await generate(subDir);
    try {
      await stat(path.join(subDir, 'index.js'));
      const rel = './' + path.posix.join(d, 'index.js');
      lines.push(`export * from '${rel}';`);
    } catch {
      // no index.js in subdir
    }
  }

  for (const file of files) {
    const rel = './' + file;
    lines.push(`export * from '${rel}';`);
    try {
      const content = await readFile(path.join(dir, file), 'utf8');
      if (/\bexport\s+default\b/.test(content)) {
        const name = toExportName(file);
        lines.push(`export { default as ${name} } from '${rel}';`);
      }
    } catch {}
  }

  if (lines.length) {
    await writeFile(path.join(dir, 'index.js'), lines.join('\n') + '\n');
  }
}

await generate(ROOT);
