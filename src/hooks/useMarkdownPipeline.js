import { useEffect, useRef } from 'react';
import { UI_DURATIONS } from '../constants/index.js';

export function showHint(msg, duration = UI_DURATIONS.HINT) {
  const hint = document.createElement('div');
  hint.className = 'hint-message';
  hint.textContent = msg;
  document.body.appendChild(hint);
  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), UI_DURATIONS.FADE);
  }, duration);
}

async function renderMermaidDiagrams(container) {
  if (!container || !window.mermaid) return;
  const blocks = container.querySelectorAll('pre code.language-mermaid, pre code.mermaid');
  for (const block of blocks) {
    const pre = block.parentElement;
    const code = block.textContent;
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

export async function applyEnhancements(container) {
  if (!container) return;
  if (window.hljs) {
    container.querySelectorAll('pre code').forEach((block) => {
      if (block.classList.contains('language-mermaid') || block.classList.contains('mermaid')) {
        return;
      }
      window.hljs.highlightElement(block);
    });
  }
  await renderMermaidDiagrams(container);
}

export default function useMarkdownPipeline(markdown, enhance, onDone) {
  const ref = useRef(null);

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
  }, [markdown, enhance]);

  return ref;
}
