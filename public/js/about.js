(function () {
  function applyLang() {
    var data = window.aboutPageData || {};
    var storedLang = localStorage.getItem('preferred_lang');
    var lang = storedLang || 'zh-CN';
    var showZh = lang.startsWith('zh');
    document.documentElement.lang = lang;


    if (data.titles && data.descriptions) {
      var meta = document.querySelector('meta[name="description"]');
      document.title = showZh ? data.titles.zh : data.titles.en;
      if (meta) {
        meta.setAttribute('content', showZh ? data.descriptions.zh : data.descriptions.en);
      }
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', applyLang);
  } else {
    applyLang();
  }
})();
