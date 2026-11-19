import { Marked } from 'marked';

/** Use the README's generated DocToc fragments as stable links in each language. */
export function renderDocsMarkdown(markdown: string, language: 'zh' | 'en'): string {
  const headingIds: string[] = [];
  let inContents = false;
  const parser = new Marked({
    walkTokens(token) {
      if (token.type === 'html' && token.raw.startsWith('<!-- START doctoc')) inContents = true;
      if (token.type === 'html' && token.raw.startsWith('<!-- END doctoc')) inContents = false;
      if (token.type === 'link' && token.href.startsWith('#')) {
        token.href = `#${language}-${token.href.slice(1)}`;
        if (inContents) headingIds.push(decodeURIComponent(token.href.slice(1)));
      }
    },
    renderer: {
      heading({ depth, tokens }) {
        const id = headingIds.shift();
        if (!id) return false;
        const escapedId = id.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
        return `<h${depth} id="${escapedId}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      }
    }
  });
  return parser.parse(markdown, { async: false });
}
