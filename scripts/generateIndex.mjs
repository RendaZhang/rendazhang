import { readdir, readFile, writeFile, stat, rm } from 'node:fs/promises';
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
      if (/\.d\.ts$/.test(entry.name)) continue;
      if (/^index\.(js|ts|jsx|tsx|cjs|mjs)$/.test(entry.name)) continue;
      files.push(entry.name);
    }
  }

  dirs.sort();
  files.sort();

  const linesJs = [];
  const linesTs = [];

  for (const d of dirs) {
    const subDir = path.join(dir, d);
    await generate(subDir);

    let hasJs = false;
    try {
      const jsPath = path.join(subDir, 'index.js');
      const jsContent = await readFile(jsPath, 'utf8');
      if (/\bexport\b/.test(jsContent) && !/\bexport\s*=/.test(jsContent)) {
        const relJs = './' + path.posix.join(d, 'index.js');
        linesJs.push(`export * from '${relJs}';`);
        hasJs = true;
      }
    } catch {}

    let hasTs = false;
    try {
      const tsPath = path.join(subDir, 'index.ts');
      const tsContent = await readFile(tsPath, 'utf8');
      if (/\bexport\b/.test(tsContent)) {
        const relTs = './' + path.posix.join(d, 'index.ts');
        linesTs.push(`export * from '${relTs}';`);
        hasTs = true;
      }
    } catch {}

    if (!hasTs && hasJs) {
      const relTs = './' + path.posix.join(d, 'index.js');
      linesTs.push(`export * from '${relTs}';`);
    }
  }

  for (const file of files) {
    const rel = './' + file;
    const filePath = path.join(dir, file);
    let content = '';
    try {
      content = await readFile(filePath, 'utf8');
    } catch {}
    const hasDefault = /\bexport\s+default\b/.test(content);
    const isModule = /\bexport\b/.test(content) && !/\bexport\s*=/.test(content);
    const ext = path.extname(file).toLowerCase();
    const isMinJs = /\.min\.js$/i.test(file);

    linesJs.push(`export * from '${rel}';`);
    if (hasDefault) {
      const name = toExportName(file);
      linesJs.push(`export { default as ${name} } from '${rel}';`);
    }

    if (!isMinJs && (isModule || ['.ts', '.tsx', '.jsx', '.mjs'].includes(ext))) {
      linesTs.push(`export * from '${rel}';`);
      if (hasDefault) {
        const name = toExportName(file);
        linesTs.push(`export { default as ${name} } from '${rel}';`);
      }
    }
  }

  if (linesJs.length) {
    await writeFile(path.join(dir, 'index.js'), linesJs.join('\n') + '\n');
  }
  if (linesTs.length) {
    await writeFile(path.join(dir, 'index.ts'), linesTs.join('\n') + '\n');
  } else {
    try {
      await rm(path.join(dir, 'index.ts'));
    } catch {}
  }
}

await generate(ROOT);
