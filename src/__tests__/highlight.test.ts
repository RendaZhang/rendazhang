import { describe, expect, it } from 'vitest';
import { getProjectHighlighter } from '../utils/highlight';

describe('project highlighter', () => {
  it('loads the common highlighter set plus the site docs nginx language', () => {
    const hljs = getProjectHighlighter();
    const languages = hljs.listLanguages();

    expect(languages).toContain('bash');
    expect(languages).toContain('typescript');
    expect(languages).toContain('nginx');
    expect(languages).not.toContain('1c');
  });
});
