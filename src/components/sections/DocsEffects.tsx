import { useEffect } from 'react';
import { DOC_CONTENT } from '../../constants';
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
    let enhancementsReady = false;
    let mermaidApi: MermaidApi | null = null;
    let renderedLanguage: DocsLanguage | null = null;
    let requestedLanguage: DocsLanguage | null = null;
    let renderPromise: Promise<void> | null = null;

    const drainMermaidRenders = async (): Promise<void> => {
      while (!cancelled && mermaidApi && requestedLanguage) {
        const language = requestedLanguage;
        requestedLanguage = null;

        if (language === renderedLanguage) continue;

        try {
          await mermaidApi.run({ querySelector: getMermaidSelector(language) });
          if (!cancelled) renderedLanguage = language;
        } catch (error) {
          logger.error('Docs Mermaid render error:', error);
        }
      }
    };

    const requestVisibleMermaidRender = (): void => {
      requestedLanguage = getCurrentDocsLanguage();
      if (cancelled || !enhancementsReady || !mermaidApi || renderPromise) return;

      renderPromise = drainMermaidRenders()
        .catch((error) => {
          logger.error('Docs Mermaid render queue error:', error);
        })
        .finally(() => {
          renderPromise = null;
          if (!cancelled && requestedLanguage) requestVisibleMermaidRender();
        });
    };

    const handleLanguageChange = (): void => {
      requestVisibleMermaidRender();
    };

    window.addEventListener('langChanged', handleLanguageChange);

    const applyEnhancements = async () => {
      const [{ marked }, { default: getProjectHighlighter }, { default: mermaid }] =
        await Promise.all([import('marked'), import('../../utils/highlight'), import('mermaid')]);
      if (cancelled) return;

      const hljs = getProjectHighlighter();
      const zhData = DOC_CONTENT.README_ZH;
      const enData = DOC_CONTENT.README_EN;

      const htmlZh = marked.parse(zhData) as string;
      const htmlEn = marked.parse(enData) as string;

      const extractIds = (html: string): string[] => {
        const match = html.match(/<!-- START doctoc[\s\S]*?-->([\s\S]*?)<!-- END doctoc/);
        if (!match) return [];
        const div = document.createElement('div');
        div.innerHTML = match[1];
        return Array.from(div.querySelectorAll('a[href^="#"]')).map((a) =>
          decodeURIComponent(a.getAttribute('href')!.slice(1))
        );
      };

      const anchorIdsZh = extractIds(htmlZh);
      const anchorIdsEn = extractIds(htmlEn);

      const parser = new DOMParser();
      const docZh = parser.parseFromString(htmlZh, 'text/html');
      const docEn = parser.parseFromString(htmlEn, 'text/html');

      const applyAnchors = (doc: Document, anchorIds: string[], prefix: string): void => {
        if (anchorIds.length) {
          const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
          anchorIds.forEach((id, i) => {
            if (headings[i]) headings[i].id = `${prefix}${id}`;
          });
        }
        doc.querySelectorAll('a[href^="#"]').forEach((a) => {
          const rawId = decodeURIComponent(a.getAttribute('href')!.slice(1));
          a.setAttribute('href', `#${prefix}${rawId}`);
        });
      };

      applyAnchors(docZh, anchorIdsZh, 'zh-');
      applyAnchors(docEn, anchorIdsEn, 'en-');

      document.getElementById('content-zh')!.innerHTML = docZh.body.innerHTML;
      document.getElementById('content-en')!.innerHTML = docEn.body.innerHTML;

      document.querySelectorAll('pre code:not(.language-mermaid)').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
      mermaid.initialize({ startOnLoad: false });
      mermaidApi = mermaid;
      enhancementsReady = true;
      requestVisibleMermaidRender();
      logger.log('All enhancements applied');
    };

    void applyEnhancements().catch((error) => {
      logger.error('Docs enhancement error:', error);
      if (cancelled) return;
      document.getElementById('content-zh')!.innerHTML = '<p>加载文档时出错</p>';
      document.getElementById('content-en')!.innerHTML = '<p>Error loading documentation</p>';
    });

    return () => {
      cancelled = true;
      requestedLanguage = null;
      window.removeEventListener('langChanged', handleLanguageChange);
    };
  }, []);

  return null;
}
