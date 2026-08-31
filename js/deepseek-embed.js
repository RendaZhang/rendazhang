// Mark the chat page when it is loaded inside the same-origin Chat Widget iframe.
(() => {
  if (window.self !== window.top) {
    document.body.classList.add('is-embedded');
  }
})();
