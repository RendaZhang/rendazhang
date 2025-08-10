import { useEffect } from 'react';
import { DOC_CONTENT } from '../../constants';
import { marked } from 'marked';
import hljs from 'highlight.js';
import mermaid from 'mermaid';
import logger from '../../utils/logger';

export default function DocsEffects(): null {
  useEffect(() => {
    try {
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
      const lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
      const mermaidSelector =
        lang.indexOf('zh') === 0
          ? '#content-zh .language-mermaid'
          : '#content-en .language-mermaid';
      void mermaid.run({ querySelector: mermaidSelector });
      logger.log('All enhancements applied');
    } catch {
      document.getElementById('content-zh')!.innerHTML = '<p>加载文档时出错</p>';
      document.getElementById('content-en')!.innerHTML = '<p>Error loading documentation</p>';
    }
  }, []);

  return null;
}
