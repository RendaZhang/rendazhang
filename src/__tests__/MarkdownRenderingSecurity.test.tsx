import { render as renderReact, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mermaidMock = vi.hoisted(() => ({
  initialize: vi.fn(),
  parse: vi.fn(),
  render: vi.fn()
}));

const highlightElementMock = vi.hoisted(() => vi.fn());
const loggerErrorMock = vi.hoisted(() => vi.fn());

vi.mock('mermaid', () => ({ default: mermaidMock }));
vi.mock('../utils/highlight', () => ({
  default: () => ({ highlightElement: highlightElementMock })
}));
vi.mock('../utils/logger', () => ({
  default: {
    log: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: loggerErrorMock
  }
}));

import useMarkdownPipeline, { applyEnhancements } from '../hooks/useMarkdownPipeline';

function MarkdownHarness({ markdown }: { markdown: string }) {
  const contentRef = useMarkdownPipeline(markdown, false);
  return <div ref={contentRef} data-testid="markdown-output" />;
}

describe('Markdown rendering security boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sanitizes executable HTML before placing Markdown output in the DOM', async () => {
    const { getByTestId } = renderReact(
      <MarkdownHarness
        markdown={
          '<p>Safe text</p><img src="x" onerror="alert(1)"><a href="javascript:alert(2)">Unsafe link</a><script>alert(3)</script>'
        }
      />
    );

    const output = getByTestId('markdown-output');
    await waitFor(() => expect(output.textContent).toContain('Safe text'));

    expect(output.querySelector('script')).toBeNull();
    expect(output.querySelector('img')?.hasAttribute('onerror')).toBe(false);
    expect(output.querySelector('a')?.hasAttribute('href')).toBe(false);
  });

  it('renders a validated Mermaid block and keeps non-Mermaid highlighting separate', async () => {
    mermaidMock.parse.mockResolvedValueOnce(true);
    mermaidMock.render.mockResolvedValueOnce({
      svg: '<svg role="img" aria-label="Example diagram"></svg>',
      bindFunctions: vi.fn()
    });
    const container = document.createElement('div');
    container.innerHTML = [
      '<pre><code class="language-typescript">const value = 1;</code></pre>',
      '<pre><code class="language-mermaid">graph TD; A--&gt;B</code></pre>'
    ].join('');

    await applyEnhancements(container);

    expect(highlightElementMock).toHaveBeenCalledTimes(1);
    expect(mermaidMock.parse).toHaveBeenCalledWith('graph TD; A-->B');
    expect(mermaidMock.render).toHaveBeenCalledOnce();
    expect(container.querySelector('svg[aria-label="Example diagram"]')).not.toBeNull();
  });

  it('leaves malformed Mermaid source as code and reports the bounded render failure', async () => {
    const renderError = new Error('Invalid diagram');
    mermaidMock.parse.mockRejectedValueOnce(renderError);
    const container = document.createElement('div');
    container.innerHTML = '<pre><code class="language-mermaid">not a diagram</code></pre>';
    const originalBlock = container.querySelector('pre');

    await expect(applyEnhancements(container)).resolves.toBeUndefined();

    expect(container.querySelector('pre')).toBe(originalBlock);
    expect(container.textContent).toContain('not a diagram');
    expect(mermaidMock.render).not.toHaveBeenCalled();
    expect(loggerErrorMock).toHaveBeenCalledWith('Mermaid render error:', renderError);
  });
});
