import { useEffect, useRef } from 'react';
import { UI_DURATIONS } from '../constants/index.ts';

declare global {
  interface Window {
    mermaid?: {
      parse?: (code: string) => Promise<void> | void;
      render: (
        id: string,
        code: string
      ) => Promise<{ svg: string; bindFunctions?: (element: HTMLElement) => void }>;
      initialize: (config: unknown) => void;
    };
    hljs?: {
      highlightElement: (element: HTMLElement) => void;
    };
    DOMPurify: { sanitize: (html: string) => string };
    marked: { parse: (markdown: string) => string };
  }
}

export function showHint(msg: string, duration: number = UI_DURATIONS.HINT): void {
  const hint = document.createElement('div');
  hint.className = 'hint-message';
  hint.textContent = msg;
  document.body.appendChild(hint);
  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), UI_DURATIONS.FADE);
  }, duration);
}

async function renderMermaidDiagrams(container: HTMLElement | null): Promise<void> {
  if (!container || !window.mermaid) return;
  const blocks = container.querySelectorAll<HTMLElement>(
    'pre code.language-mermaid, pre code.mermaid'
  );
  for (const block of Array.from(blocks)) {
    const pre = block.parentElement as HTMLElement;
    const code = block.textContent || '';
    try {
      if (typeof window.mermaid.parse === 'function') {
        await window.mermaid.parse(code);
      }
      const { svg, bindFunctions } = await window.mermaid.render(
        `mmd-${Math.random().toString(36).slice(2)}`,
        code
      );
      const wrapper = document.createElement('div');
      wrapper.innerHTML = svg;
      bindFunctions?.(wrapper);
      pre.replaceWith(wrapper);
    } catch (err) {
      console.error('Mermaid render error:', err);
    }
  }
}

export async function applyEnhancements(container: HTMLElement | null): Promise<void> {
  if (!container) return;
  if (window.hljs) {
    const hljs = window.hljs;
    container.querySelectorAll<HTMLElement>('pre code').forEach((block) => {
      if (block.classList.contains('language-mermaid') || block.classList.contains('mermaid')) {
        return;
      }
      hljs.highlightElement(block);
    });
  }
  await renderMermaidDiagrams(container);
}

export default function useMarkdownPipeline(
  markdown: string,
  enhance: boolean,
  onDone?: () => void
): React.MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const html = window.DOMPurify.sanitize(window.marked.parse(markdown || ''));
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
