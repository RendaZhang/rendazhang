import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('src');
const JS_FILE_EXTS = new Set(['.js', '.cjs', '.mjs', '.jsx']);
const TS_FILE_EXTS = new Set(['.ts', '.tsx']);

function toExportName(file) {
  const name = path.parse(file).name;
  return name.replace(/[-_]+(\w)/g, (_, c) => c.toUpperCase());
}

async function generate(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const dirs = [];
  const jsFiles = [];
  const tsFiles = [];
  let skipCurrent = false;
  let hasIndexTs = false;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      dirs.push(entry.name);
    } else if (entry.isFile()) {
      if (entry.name === 'index.ts') {
        hasIndexTs = true;
        try {
          const indexContent = await readFile(path.join(dir, entry.name), 'utf8');
          if (/@ts-nocheck/.test(indexContent)) {
            skipCurrent = true;
          }
        } catch {}
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (/^index\.(js|ts|jsx|tsx|cjs|mjs)$/.test(entry.name)) continue;
      if (TS_FILE_EXTS.has(ext)) {
        if (/\.d\.ts$/.test(entry.name)) continue;
        tsFiles.push(entry.name);
      } else if (JS_FILE_EXTS.has(ext)) {
        jsFiles.push(entry.name);
      }
    }
  }

  dirs.sort();
  jsFiles.sort();
  tsFiles.sort();

  const relativePath = path.relative(ROOT, dir);
  const isTypesDir = relativePath.split(path.sep).includes('types');

  const subResults = [];
  for (const d of dirs) {
    const res = await generate(path.join(dir, d));
    subResults.push([d, res]);
  }

  let hasJs = jsFiles.length > 0;
  let hasTs = hasIndexTs || tsFiles.length > 0 || subResults.some(([, r]) => r.hasTs);
  if (isTypesDir) hasJs = false;

  const linesJs = [];
  const linesTs = [];

  if (skipCurrent) {
    return { hasJs, hasTs };
  }

  if (hasIndexTs && dirs.length === 0 && jsFiles.length === 0 && tsFiles.length === 0) {
    try {
      await rm(path.join(dir, 'index.js'));
    } catch {}
    return { hasJs, hasTs };
  }

  if (hasJs) {
    for (const [d, r] of subResults) {
      if (r.hasJs || r.hasTs) {
        linesJs.push(`export * from './${d}';`);
      }
    }
  }
  if (hasTs) {
    for (const [d, r] of subResults) {
      if (r.hasJs || r.hasTs) {
        linesTs.push(`export * from './${d}';`);
      }
    }
  }

  for (const file of jsFiles) {
    const rel = './' + file;
    const relNoExt = './' + path.parse(file).name;
    const filePath = path.join(dir, file);
    let content = '';
    try {
      content = await readFile(filePath, 'utf8');
    } catch {}
    const hasDefault = /\bexport\s+default\b/.test(content);
    const isModule = /\bexport\b/.test(content) && !/\bexport\s*=/.test(content);
    const isMinJs = /\.min\.js$/i.test(file);

    if (hasJs) {
      linesJs.push(`export * from '${rel}';`);
      if (hasDefault) {
        const name = toExportName(file);
        linesJs.push(`export { default as ${name} } from '${rel}';`);
      }
    }

    if (
      hasTs &&
      !isMinJs &&
      (isModule || ['.jsx', '.mjs'].includes(path.extname(file).toLowerCase()))
    ) {
      linesTs.push(`export * from '${relNoExt}';`);
      if (hasDefault) {
        const name = toExportName(file);
        linesTs.push(`export { default as ${name} } from '${relNoExt}';`);
      }
    }
  }

  for (const file of tsFiles) {
    const rel = './' + file;
    const relNoExt = './' + path.parse(file).name;
    const filePath = path.join(dir, file);
    let content = '';
    try {
      content = await readFile(filePath, 'utf8');
    } catch {}
    const hasDefault = /\bexport\s+default\b/.test(content);
    const isModule = /\bexport\b/.test(content) && !/\bexport\s*=/.test(content);

    if (hasJs) {
      linesJs.push(`export * from '${rel}';`);
      if (hasDefault) {
        const name = toExportName(file);
        linesJs.push(`export { default as ${name} } from '${rel}';`);
      }
    }

    if (isModule) {
      linesTs.push(`export * from '${relNoExt}';`);
      if (hasDefault) {
        const name = toExportName(file);
        linesTs.push(`export { default as ${name} } from '${relNoExt}';`);
      }
    }
  }

  if (hasJs) {
    if (linesJs.length) {
      await writeFile(path.join(dir, 'index.js'), linesJs.join('\n') + '\n');
    } else {
      try {
        await rm(path.join(dir, 'index.js'));
      } catch {}
    }
  } else {
    try {
      await rm(path.join(dir, 'index.js'));
    } catch {}
  }

  if (hasTs) {
    if (linesTs.length) {
      await writeFile(path.join(dir, 'index.ts'), linesTs.join('\n') + '\n');
    } else {
      try {
        await rm(path.join(dir, 'index.ts'));
      } catch {}
    }
  } else {
    try {
      await rm(path.join(dir, 'index.ts'));
    } catch {}
  }

  return { hasJs, hasTs };
}
await generate(ROOT);
