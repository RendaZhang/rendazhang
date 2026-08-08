import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const docsEffectsMocks = vi.hoisted(() => ({
  highlightElement: vi.fn(),
  initialize: vi.fn(),
  loggerError: vi.fn(),
  loggerLog: vi.fn(),
  parse: vi.fn(),
  run: vi.fn()
}));

vi.mock('marked', () => ({
  marked: { parse: docsEffectsMocks.parse }
}));
vi.mock('mermaid', () => ({
  default: {
    initialize: docsEffectsMocks.initialize,
    run: docsEffectsMocks.run
  }
}));
vi.mock('../constants', () => ({
  DOC_CONTENT: {
    README_ZH: 'Chinese docs',
    README_EN: 'English docs'
  }
}));
vi.mock('../utils/highlight', () => ({
  default: () => ({ highlightElement: docsEffectsMocks.highlightElement })
}));
vi.mock('../utils/logger', () => ({
  default: {
    log: docsEffectsMocks.loggerLog,
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: docsEffectsMocks.loggerError
  }
}));

import DocsEffects from '../components/sections/DocsEffects';

function markdownHtml(source: string): string {
  return [
    `<h1>${source}</h1>`,
    '<pre><code class="language-typescript">const value = 1;</code></pre>',
    `<pre><code class="language-mermaid">graph TD; ${source}--&gt;Done</code></pre>`
  ].join('');
}

function renderDocsEffects() {
  return render(
    <>
      <div id="content-zh" />
      <div id="content-en" />
      <DocsEffects />
    </>
  );
}

function dispatchLanguageChange(language: 'zh-CN' | 'en'): void {
  document.documentElement.lang = language;
  window.dispatchEvent(new CustomEvent('langChanged', { detail: language }));
}

describe('DocsEffects Mermaid language lifecycle', () => {
  beforeEach(() => {
    document.documentElement.lang = 'zh-CN';
    docsEffectsMocks.highlightElement.mockReset();
    docsEffectsMocks.initialize.mockReset();
    docsEffectsMocks.loggerError.mockReset();
    docsEffectsMocks.loggerLog.mockReset();
    docsEffectsMocks.parse.mockReset().mockImplementation(markdownHtml);
    docsEffectsMocks.run.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each([
    ['zh-CN', '#content-zh .language-mermaid'],
    ['en', '#content-en .language-mermaid']
  ] as const)(
    'renders only the initially visible %s language after one-time enhancement setup',
    async (language, querySelector) => {
      document.documentElement.lang = language;
      renderDocsEffects();

      await waitFor(() => {
        expect(docsEffectsMocks.run).toHaveBeenCalledWith({ querySelector });
      });

      expect(docsEffectsMocks.parse).toHaveBeenCalledTimes(2);
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
    expect(docsEffectsMocks.run).toHaveBeenNthCalledWith(2, {
      querySelector: '#content-en .language-mermaid'
    });

    act(() => dispatchLanguageChange('zh-CN'));
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(3));
    expect(docsEffectsMocks.run).toHaveBeenNthCalledWith(3, {
      querySelector: '#content-zh .language-mermaid'
    });

    await act(async () => {
      dispatchLanguageChange('zh-CN');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(docsEffectsMocks.parse).toHaveBeenCalledTimes(2);
    expect(docsEffectsMocks.highlightElement).toHaveBeenCalledTimes(2);
    expect(docsEffectsMocks.run).toHaveBeenCalledTimes(3);
  });

  it('uses the latest document language when a switch happens before setup is ready', async () => {
    let switched = false;
    docsEffectsMocks.parse.mockImplementation((source: string) => {
      if (!switched) {
        switched = true;
        dispatchLanguageChange('en');
      }
      return markdownHtml(source);
    });

    renderDocsEffects();

    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1));
    expect(docsEffectsMocks.run).toHaveBeenCalledWith({
      querySelector: '#content-en .language-mermaid'
    });
    expect(docsEffectsMocks.run).not.toHaveBeenCalledWith({
      querySelector: '#content-zh .language-mermaid'
    });
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
      .mockResolvedValueOnce(undefined);

    renderDocsEffects();
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1));

    act(() => dispatchLanguageChange('en'));
    expect(docsEffectsMocks.run).toHaveBeenCalledTimes(1);

    await act(async () => {
      finishInitialRender?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(2));
    expect(docsEffectsMocks.run).toHaveBeenLastCalledWith({
      querySelector: '#content-en .language-mermaid'
    });
  });

  it('contains Mermaid rejections and remains ready for the next language change', async () => {
    const renderError = new Error('Diagram render failed');
    docsEffectsMocks.run.mockRejectedValueOnce(renderError).mockResolvedValueOnce(undefined);

    renderDocsEffects();

    await waitFor(() => {
      expect(docsEffectsMocks.loggerError).toHaveBeenCalledWith(
        'Docs Mermaid render error:',
        renderError
      );
    });

    act(() => dispatchLanguageChange('en'));
    await waitFor(() => expect(docsEffectsMocks.run).toHaveBeenCalledTimes(2));
    expect(docsEffectsMocks.run).toHaveBeenLastCalledWith({
      querySelector: '#content-en .language-mermaid'
    });
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
});
