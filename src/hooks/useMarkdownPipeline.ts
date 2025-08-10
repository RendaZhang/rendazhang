import { useEffect, useRef } from 'react';
import { UI_DURATIONS } from '../constants';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import logger from '../utils/logger';
let mermaidInitialized = false;

export function showHint(msg: string, duration: number = UI_DURATIONS.HINT): void {
  const hint = document.createElement('div');
  hint.className = 'c-hint-message';
  hint.textContent = msg;
  document.body.appendChild(hint);
  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), UI_DURATIONS.FADE);
  }, duration);
}

async function renderMermaidDiagrams(container: HTMLElement | null): Promise<void> {
  if (!container) return;
  const { default: mermaid } = await import('mermaid');
  if (!mermaidInitialized) {
    mermaid.initialize({ startOnLoad: false });
    mermaidInitialized = true;
  }
  const blocks = container.querySelectorAll<HTMLElement>(
    'pre code.language-mermaid, pre code.mermaid'
  );
  for (const block of Array.from(blocks)) {
    const pre = block.parentElement as HTMLElement;
    const code = block.textContent || '';
    try {
      if (typeof mermaid.parse === 'function') {
        await mermaid.parse(code);
      }
      const { svg, bindFunctions } = await mermaid.render(
        `mmd-${Math.random().toString(36).slice(2)}`,
        code
      );
      const wrapper = document.createElement('div');
      wrapper.innerHTML = svg;
      bindFunctions?.(wrapper);
      pre.replaceWith(wrapper);
    } catch (err) {
      logger.error('Mermaid render error:', err);
    }
  }
}

export async function applyEnhancements(container: HTMLElement | null): Promise<void> {
  if (!container) return;
  const { default: hljs } = await import('highlight.js');
  container.querySelectorAll<HTMLElement>('pre code').forEach((block) => {
    if (block.classList.contains('language-mermaid') || block.classList.contains('mermaid')) {
      return;
    }
    hljs.highlightElement(block);
  });
  await renderMermaidDiagrams(container);
}

export default function useMarkdownPipeline(
  markdown: string,
  enhance: boolean,
  onDone?: () => void
): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const html = DOMPurify.sanitize(marked.parse(markdown || '') as string);
    ref.current.innerHTML = html;
    const doCallback = () => {
      if (typeof onDone === 'function') onDone();
    };

    if (enhance) {
      applyEnhancements(ref.current).then(doCallback);
    } else {
      doCallback();
    }
  }, [markdown, enhance, onDone]);

  return ref;
}
