import { describe, it, expect } from 'vitest';
import { getEnv, refreshEnv, isProduction, getCdnUrl } from '../utils/env';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

describe('env utilities', () => {
  const envFile = path.posix.join(process.cwd().replace(/\\/g, '/'), 'src/utils/env.ts');

  it('resolves aliases and provides fallback', () => {
    const code = `import { getEnv, refreshEnv } from '${envFile}';\nrefreshEnv();\nconsole.log(JSON.stringify({tag: getEnv('TAG_NAME'), fallback: getEnv('UNKNOWN_KEY', 'fallback')}));`;
    const out = spawnSync('node', ['--import', 'tsx', '-e', code], {
      env: { ...process.env, PUBLIC_TAG_NAME: 'from-public' },
      encoding: 'utf-8'
    }).stdout.trim();
    const result = JSON.parse(out);
    expect(result.tag).toBe('from-public');
    expect(result.fallback).toBe('fallback');
  });

  it('refreshEnv refreshes cache for helpers', () => {
    const code = `import { refreshEnv, isProduction, getCdnUrl } from '${envFile}';\nrefreshEnv();\nconsole.log(JSON.stringify({prod: isProduction(), url: getCdnUrl('/asset.png')}));`;
    const first = JSON.parse(
      spawnSync('node', ['--import', 'tsx', '-e', code], {
        env: { ...process.env, PUBLIC_NODE_ENV: 'production', PUBLIC_CDN_BASE: 'https://cdn.example.com/' },
        encoding: 'utf-8'
      }).stdout.trim()
    );
    expect(first.prod).toBe(true);
    expect(first.url).toBe('https://cdn.example.com/asset.png');

    const second = JSON.parse(
      spawnSync('node', ['--import', 'tsx', '-e', code], {
        env: { ...process.env, PUBLIC_NODE_ENV: 'development', PUBLIC_CDN_BASE: 'https://cdn2.com/' },
        encoding: 'utf-8'
      }).stdout.trim()
    );
    expect(second.prod).toBe(false);
    expect(second.url).toBe('https://cdn2.com/asset.png');
  });
});
