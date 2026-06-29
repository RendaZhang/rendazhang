import hljs from 'highlight.js/lib/common';
import nginx from 'highlight.js/lib/languages/nginx';

let projectLanguagesRegistered = false;

export function getProjectHighlighter(): typeof hljs {
  if (!projectLanguagesRegistered) {
    hljs.registerLanguage('nginx', nginx);
    projectLanguagesRegistered = true;
  }
  return hljs;
}

export default getProjectHighlighter;
