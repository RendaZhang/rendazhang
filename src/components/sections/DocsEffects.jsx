import { useEffect } from 'react';
import { DOC_PATHS, SCRIPT_PATHS } from '../../config.js';

export default function DocsEffects() {
  useEffect(() => {
    Promise.all([
      fetch(DOC_PATHS.README_ZH).then((res) => res.text()),
      fetch(DOC_PATHS.README_EN).then((res) => res.text())
    ])
      .then(([zhData, enData]) => {
        const htmlZh = marked.parse(zhData);
        const htmlEn = marked.parse(enData);

        const extractIds = (html) => {
          const match = html.match(/<!-- START doctoc[\s\S]*?-->([\s\S]*?)<!-- END doctoc/);
          if (!match) return [];
          const div = document.createElement('div');
          div.innerHTML = match[1];
          return Array.from(div.querySelectorAll('a[href^="#"]')).map((a) =>
            decodeURIComponent(a.getAttribute('href').slice(1))
          );
        };

        const anchorIdsZh = extractIds(htmlZh);
        const anchorIdsEn = extractIds(htmlEn);

        const parser = new DOMParser();
        const docZh = parser.parseFromString(htmlZh, 'text/html');
        const docEn = parser.parseFromString(htmlEn, 'text/html');

        if (anchorIdsZh.length) {
          const headingsZh = docZh.querySelectorAll('h1, h2, h3, h4, h5, h6');
          anchorIdsZh.forEach((id, i) => {
            if (headingsZh[i]) headingsZh[i].id = id;
          });
        }

        if (anchorIdsEn.length) {
          const headingsEn = docEn.querySelectorAll('h1, h2, h3, h4, h5, h6');
          anchorIdsEn.forEach((id, i) => {
            if (headingsEn[i]) headingsEn[i].id = id;
          });
        }

        document.getElementById('content-zh').innerHTML = docZh.body.innerHTML;
        document.getElementById('content-en').innerHTML = docEn.body.innerHTML;

        const loadScript = (src) => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            document.head.appendChild(script);
          });
        };

        Promise.all([loadScript(SCRIPT_PATHS.HIGHLIGHT), loadScript(SCRIPT_PATHS.MERMAID)]).then(
          () => {
            document.querySelectorAll('pre code:not(.language-mermaid)').forEach((block) => {
              hljs.highlightElement(block);
            });
            mermaid.initialize({ startOnLoad: false });
            const lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
            const mermaidSelector =
              lang.indexOf('zh') === 0
                ? '#content-zh .language-mermaid'
                : '#content-en .language-mermaid';
            mermaid.init(undefined, document.querySelectorAll(mermaidSelector));
            console.log('All enhancements applied');
          }
        );
      })
      .catch(() => {
        document.getElementById('content-zh').innerHTML = '<p>Error loading documentation</p>';
        document.getElementById('content-en').innerHTML = '<p>Error loading documentation</p>';
      });
  }, []);

  return null;
}
