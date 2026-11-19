import { useEffect } from 'react';
import logger from '../../utils/logger';

type DocsLanguage = 'zh' | 'en';
type MermaidApi = (typeof import('mermaid'))['default'];

function getCurrentDocsLanguage(): DocsLanguage {
  return document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function getMermaidSelector(language: DocsLanguage): string {
  return language === 'zh' ? '#content-zh .language-mermaid' : '#content-en .language-mermaid';
}

export default function DocsEffects(): null {
  useEffect(() => {
    let cancelled = false;
    let mermaidApi: MermaidApi | null = null;
    let requestedLanguage: DocsLanguage | null = null;
    let renderPromise: Promise<void> | null = null;

    const drainMermaidRenders = async (): Promise<void> => {
      while (!cancelled && mermaidApi && requestedLanguage) {
        const language = requestedLanguage;
        requestedLanguage = null;

        const sourceBlocks = Array.from(
          document.querySelectorAll<HTMLElement>(getMermaidSelector(language))
        ).filter((block) => !block.hasAttribute('data-processed'));
        if (!sourceBlocks.length) continue;

        // Keep layout measurable even if a language switch hides the source mid-render.
        const staging = document.createElement('div');
        staging.className = 'c-docs-mermaid-render';
        staging.setAttribute('aria-hidden', 'true');
        staging.inert = true;
        staging.style.width = `${sourceBlocks[0].parentElement!.getBoundingClientRect().width}px`;
        const nodes = sourceBlocks.map((block) => {
          const clone = block.cloneNode(true) as HTMLElement;
          const pre = document.createElement('pre');
          pre.append(clone);
          staging.append(pre);
          return clone;
        });
        document.body.append(staging);

        try {
          for (const [index, node] of nodes.entries()) {
            if (cancelled) break;
            try {
              await mermaidApi.run({ nodes: [node] });
            } catch (error) {
              logger.error('Docs Mermaid render error:', error);
              continue;
            }
            const source = sourceBlocks[index];
            if (!cancelled && source.isConnected) {
              source.replaceChildren(...node.childNodes);
              source.setAttribute('data-processed', 'true');
            }
          }
        } finally {
          staging.remove();
        }
      }
    };

    const requestVisibleMermaidRender = (): void => {
      requestedLanguage = getCurrentDocsLanguage();
      if (cancelled || !mermaidApi || renderPromise) return;

      renderPromise = drainMermaidRenders()
        .catch((error) => {
          logger.error('Docs Mermaid render queue error:', error);
        })
        .finally(() => {
          renderPromise = null;
          if (!cancelled && requestedLanguage) requestVisibleMermaidRender();
        });
    };

    window.addEventListener('langChanged', requestVisibleMermaidRender);

    void import('../../utils/highlight')
      .then(({ default: getProjectHighlighter }) => {
        if (cancelled) return;
        const hljs = getProjectHighlighter();
        document
          .querySelectorAll<HTMLElement>('pre code:not(.language-mermaid)')
          .forEach((block) => {
            hljs.highlightElement(block);
          });
      })
      .catch((error) => logger.error('Docs code highlighting error:', error));

    void import('mermaid')
      .then(({ default: mermaid }) => {
        if (cancelled) return;
        mermaid.initialize({ startOnLoad: false });
        mermaidApi = mermaid;
        requestVisibleMermaidRender();
      })
      .catch((error) => logger.error('Docs Mermaid setup error:', error));

    return () => {
      cancelled = true;
      requestedLanguage = null;
      window.removeEventListener('langChanged', requestVisibleMermaidRender);
    };
  }, []);

  return null;
}
