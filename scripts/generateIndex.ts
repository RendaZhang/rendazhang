import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

type GenerateResult = { hasTs: boolean };

const ROOT = path.resolve('src');
const TS_FILE_EXTS = new Set(['.ts', '.tsx']);
const TEST_DIR = '__tests__';
const TEST_FILE_RE = /\.(test|spec)\.tsx?$/;

function toExportName(file: string): string {
  const name = path.parse(file).name;
  return name.replace(/[-_]+(\w)/g, (_, c) => c.toUpperCase());
}

async function generate(dir: string): Promise<GenerateResult> {
  const entries = await readdir(dir, { withFileTypes: true });
  const dirs: string[] = [];
  const tsFiles: string[] = [];
  let hasIndexTs = false;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name === TEST_DIR) continue;
      dirs.push(entry.name);
    } else if (entry.isFile()) {
      if (entry.name === 'index.ts') {
        hasIndexTs = true;
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (/^index\.(ts|tsx)$/.test(entry.name)) continue;
      if (TS_FILE_EXTS.has(ext)) {
        if (/\.d\.ts$/.test(entry.name)) continue;
        if (TEST_FILE_RE.test(entry.name)) continue;
        tsFiles.push(entry.name);
      }
    }
  }

  dirs.sort();
  tsFiles.sort();

  const subResults: Array<[string, GenerateResult]> = [];
  for (const d of dirs) {
    const res = await generate(path.join(dir, d));
    subResults.push([d, res]);
  }

  let hasTs = hasIndexTs || tsFiles.length > 0 || subResults.some(([, r]) => r.hasTs);

  const linesTs: string[] = [];

  if (hasIndexTs && dirs.length === 0 && tsFiles.length === 0) {
    return { hasTs };
  }

  if (hasTs) {
    for (const [d, r] of subResults) {
      if (r.hasTs) {
        linesTs.push(`export * from './${d}';`);
      }
    }
  }

  for (const file of tsFiles) {
    const relNoExt = './' + path.parse(file).name;
    const filePath = path.join(dir, file);
    let content = '';
    try {
      content = await readFile(filePath, 'utf8');
    } catch {
      /* ignore */
    }
    const hasDefault = /\bexport\s+default\b/.test(content);
    const isModule = /\bexport\b/.test(content) && !/\bexport\s*=/.test(content);

    if (isModule) {
      linesTs.push(`export * from '${relNoExt}';`);
      if (hasDefault) {
        const name = toExportName(file);
        linesTs.push(`export { default as ${name} } from '${relNoExt}';`);
      }
    }
  }

  if (hasTs) {
    const indexPath = path.join(dir, 'index.ts');
    if (linesTs.length) {
      const newContent = linesTs.join('\n') + '\n';
      let oldContent = '';
      try {
        oldContent = await readFile(indexPath, 'utf8');
      } catch {
        /* ignore */
      }
      if (oldContent !== newContent) {
        await writeFile(indexPath, newContent);
        const rel = path.relative(ROOT, indexPath);
        console.log(`Generated ${rel}`);
      }
    } else {
      try {
        await rm(indexPath);
        const rel = path.relative(ROOT, indexPath);
        console.log(`Removed ${rel}`);
      } catch {
        /* ignore */
      }
    }
  } else {
    const indexPath = path.join(dir, 'index.ts');
    try {
      await rm(indexPath);
      const rel = path.relative(ROOT, indexPath);
      console.log(`Removed ${rel}`);
    } catch {
      /* ignore */
    }
  }

  return { hasTs };
}

await generate(ROOT);
