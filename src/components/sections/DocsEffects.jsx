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

        const tocMatch = htmlEn.match(/<!-- START doctoc[\s\S]*?-->([\s\S]*?)<!-- END doctoc/);
        let anchorIds = [];
        if (tocMatch) {
          const temp = document.createElement('div');
          temp.innerHTML = tocMatch[1];
          anchorIds = Array.from(temp.querySelectorAll('a[href^="#"]')).map((a) =>
            decodeURIComponent(a.getAttribute('href').slice(1))
          );
        }

        const parser = new DOMParser();
        const docZh = parser.parseFromString(htmlZh, 'text/html');
        const docEn = parser.parseFromString(htmlEn, 'text/html');

        if (anchorIds.length) {
          const headingsZh = docZh.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const headingsEn = docEn.querySelectorAll('h1, h2, h3, h4, h5, h6');
          anchorIds.forEach((id, i) => {
            if (headingsZh[i]) headingsZh[i].id = id;
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
