import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const docsEffectsMocks = vi.hoisted(() => ({
  highlightElement: vi.fn(),
  initialize: vi.fn(),
  loggerError: vi.fn(),
  inputs: vi.fn(),
  run: vi.fn()
}));

vi.mock('mermaid', () => ({
  default: {
    initialize: docsEffectsMocks.initialize,
    run: docsEffectsMocks.run
  }
}));
vi.mock('../utils/highlight', () => ({
  default: () => ({ highlightElement: docsEffectsMocks.highlightElement })
}));
vi.mock('../utils/logger', () => ({
  default: {
    log: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: docsEffectsMocks.loggerError
  }
}));

import DocsEffects from '../components/sections/DocsEffects';

import { renderDocsMarkdown } from '../utils/renderDocsMarkdown';

function docsHtml(language: 'zh' | 'en', title: string): string {
  const markdown = [
    '<!-- START doctoc -->',
    '',
    '- [Overview](#overview)',
    '',
    '<!-- END doctoc -->',
    '',
    `# ${title}`,
    '',
    '```typescript',
    'const value = 1;',
    '```',
    '',
    '```mermaid',
    `graph TD; ${title}-->Done`,
    '```'
  ].join('\n');
  return renderDocsMarkdown(markdown, language);
}

function renderDocsEffects() {
  return render(
    <>
      <div id="content-zh" dangerouslySetInnerHTML={{ __html: docsHtml('zh', 'Chinese docs') }} />
      <div id="content-en" dangerouslySetInnerHTML={{ __html: docsHtml('en', 'English docs') }} />
      <DocsEffects />
    </>
  );
}

function dispatchLanguageChange(language: 'zh-CN' | 'en'): void {
  document.documentElement.lang = language;
  window.dispatchEvent(new CustomEvent('langChanged', { detail: language }));
}

function completeRender({ nodes }: { nodes: HTMLElement[] }): Promise<void> {
  docsEffectsMocks.inputs(nodes.map((node) => node.textContent?.trim()));
  nodes.forEach((node) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.replaceChildren(svg);
  });
  return Promise.resolve();
}

describe('DocsEffects Mermaid language lifecycle', () => {
  beforeEach(() => {
    document.documentElement.lang = 'zh-CN';
    docsEffectsMocks.highlightElement.mockReset();
    docsEffectsMocks.initialize.mockReset();
    docsEffectsMocks.loggerError.mockReset();
    docsEffectsMocks.inputs.mockReset();
    docsEffectsMocks.run.mockReset().mockImplementation(completeRender);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each([
    ['zh-CN', 'Chinese docs'],
    ['en', 'English docs']
  ] as const)(
    'renders only the initially visible %s language after one-time enhancement setup',
    async (language, source) => {
      document.documentElement.lang = language;
      renderDocsEffects();

      await waitFor(() => {
        expect(docsEffectsMocks.inputs).toHaveBeenCalledWith([`graph TD; ${source}-->Done`]);
      });

      expect(docsEffectsMocks.highlightElement).toHaveBeenCalledTimes(2);
      expect(docsEffectsMocks.initialize).toHaveBeenCalledOnce();
      expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1);
    }
  );

  it('renders both live language-switch directions without repeating one-time work', async () => {
    renderDocsEffects();
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1));

    act(() => dispatchLanguageChange('en'));
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(2));
    expect(docsEffectsMocks.inputs).toHaveBeenNthCalledWith(2, ['graph TD; English docs-->Done']);

    act(() => dispatchLanguageChange('zh-CN'));
    await waitFor(() => expect(document.querySelector('#content-zh svg')).not.toBeNull());

    await act(async () => {
      dispatchLanguageChange('zh-CN');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(docsEffectsMocks.highlightElement).toHaveBeenCalledTimes(2);
    expect(docsEffectsMocks.run).toHaveBeenCalledTimes(2);
  });

  it('uses the latest document language when a switch happens before setup is ready', async () => {
    renderDocsEffects();
    act(() => dispatchLanguageChange('en'));

    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1));
    expect(docsEffectsMocks.inputs).toHaveBeenCalledWith(['graph TD; English docs-->Done']);
    expect(docsEffectsMocks.inputs).not.toHaveBeenCalledWith(['graph TD; Chinese docs-->Done']);
  });

  it('serializes a language switch that arrives during an active Mermaid render', async () => {
    let finishInitialRender: (() => void) | undefined;
    docsEffectsMocks.run
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            finishInitialRender = resolve;
          })
      )
      .mockImplementationOnce(completeRender);

    renderDocsEffects();
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1));

    act(() => dispatchLanguageChange('en'));
    expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1);
    const staging = document.querySelector('.c-docs-mermaid-render')!;
    expect(staging.getAttribute('aria-hidden')).toBe('true');
    expect(staging.contains(docsEffectsMocks.run.mock.calls[0][0].nodes[0])).toBe(true);
    expect(staging.closest('#content-zh')).toBeNull();
    expect(document.querySelector('#content-zh code.language-mermaid')?.textContent).toContain(
      'Chinese docs'
    );

    await act(async () => {
      finishInitialRender?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(2));
    expect(docsEffectsMocks.inputs).toHaveBeenLastCalledWith(['graph TD; English docs-->Done']);
    expect(document.querySelector('.c-docs-mermaid-render')).toBeNull();
  });

  it('preserves both documents, links, and diagram source when Mermaid cannot start', async () => {
    const setupError = new Error('Mermaid unavailable');
    docsEffectsMocks.initialize.mockImplementationOnce(() => {
      throw setupError;
    });
    renderDocsEffects();

    await waitFor(() =>
      expect(docsEffectsMocks.loggerError).toHaveBeenCalledWith(
        'Docs Mermaid setup error:',
        setupError
      )
    );
    for (const language of ['zh', 'en']) {
      const doc = document.getElementById(`content-${language}`)!;
      const href = doc.querySelector('a')!.getAttribute('href');
      expect(href).toBe(`#${language}-overview`);
      expect(doc.querySelector(href!)).toBe(doc.querySelector('h1'));
      expect(doc.querySelector('code.language-mermaid')?.textContent).toContain('graph TD;');
    }
    expect(docsEffectsMocks.highlightElement).toHaveBeenCalledTimes(2);
    expect(docsEffectsMocks.run).not.toHaveBeenCalled();
  });

  it('contains Mermaid rejections and remains ready for the next language change', async () => {
    const renderError = new Error('Diagram render failed');
    docsEffectsMocks.run.mockRejectedValueOnce(renderError).mockImplementationOnce(completeRender);

    renderDocsEffects();
    const source = document.querySelector('#content-zh pre:last-child')!;
    source.after(source.cloneNode(true));

    await waitFor(() => {
      expect(docsEffectsMocks.loggerError).toHaveBeenCalledWith(
        'Docs Mermaid render error:',
        renderError
      );
    });
    expect(document.querySelector('.c-docs-mermaid-render')).toBeNull();
    expect(document.querySelector('#content-zh code.language-mermaid')?.textContent).toContain(
      'Chinese docs'
    );
    await waitFor(() => expect(document.querySelectorAll('#content-zh svg')).toHaveLength(1));

    act(() => dispatchLanguageChange('en'));
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(3));
    expect(docsEffectsMocks.inputs).toHaveBeenLastCalledWith(['graph TD; English docs-->Done']);
  });

  it('removes its language listener on cleanup and ignores later events', async () => {
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const view = renderDocsEffects();

    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1));
    const listener = addListener.mock.calls.find(([event]) => event === 'langChanged')?.[1];
    expect(listener).toBeDefined();

    view.unmount();

    expect(removeListener).toHaveBeenCalledWith('langChanged', listener);
    await act(async () => {
      dispatchLanguageChange('en');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1);
  });

  it('removes an in-flight staging area without publishing after unmount', async () => {
    let finish: (() => void) | undefined;
    docsEffectsMocks.run.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        })
    );
    const view = renderDocsEffects();
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledOnce());
    const source = document.querySelector('#content-zh .language-mermaid')!;
    view.unmount();
    await act(async () => {
      finish?.();
    });
    expect(document.querySelector('.c-docs-mermaid-render')).toBeNull();
    expect(source.hasAttribute('data-processed')).toBe(false);
  });

  it('remounts with one active listener and no duplicate diagrams', async () => {
    const first = renderDocsEffects();
    await waitFor(() => expect(document.querySelectorAll('#content-zh svg')).toHaveLength(1));
    first.unmount();
    renderDocsEffects();
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(2));
    act(() => dispatchLanguageChange('en'));
    await waitFor(() => expect(document.querySelectorAll('#content-en svg')).toHaveLength(1));
    expect(docsEffectsMocks.loggerError.mock.calls).toEqual([]);
    expect(document.querySelectorAll('#content-zh svg')).toHaveLength(1);
    expect(docsEffectsMocks.run).toHaveBeenCalledTimes(3);
    expect(document.querySelector('.c-docs-mermaid-render')).toBeNull();
  });
});
