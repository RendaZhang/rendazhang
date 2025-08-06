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
  let skipCurrent = false;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      dirs.push(entry.name);
    } else if (entry.isFile()) {
      if (entry.name === 'index.ts') {
        try {
          const indexContent = await readFile(path.join(dir, entry.name), 'utf8');
          if (/@ts-nocheck/.test(indexContent)) {
            skipCurrent = true;
          }
        } catch {}
        continue;
      }

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
        const rel = './' + d;
        linesJs.push(`export * from '${rel}';`);
        hasJs = true;
      }
    } catch {}

    let hasTs = false;
    try {
      const tsPath = path.join(subDir, 'index.ts');
      const tsContent = await readFile(tsPath, 'utf8');
      if (/\bexport\b/.test(tsContent)) {
        const rel = './' + d;
        linesTs.push(`export * from '${rel}';`);
        hasTs = true;
      }
    } catch {}

    if (!hasTs && hasJs) {
      const rel = './' + d;
      linesTs.push(`export * from '${rel}';`);
    }
    if (!hasJs && hasTs) {
      const rel = './' + d;
      linesJs.push(`export * from '${rel}';`);
    }
  }

  if (skipCurrent) {
    return;
  }

  for (const file of files) {
    const rel = './' + file;
    const relNoExt = './' + path.parse(file).name;
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
      linesTs.push(`export * from '${relNoExt}';`);
      if (hasDefault) {
        const name = toExportName(file);
        linesTs.push(`export { default as ${name} } from '${relNoExt}';`);
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
