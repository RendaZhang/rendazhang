(function () {
  function applyLang() {
    var data = window.aboutPageData || {};
    var storedLang = localStorage.getItem('preferred_lang');
    var lang = storedLang || 'zh-CN';
    var showZh = lang.startsWith('zh');
    document.documentElement.lang = lang;

    var zh = document.getElementById('content-zh');
    var en = document.getElementById('content-en');
    if (zh && en) {
      zh.style.display = showZh ? '' : 'none';
      en.style.display = showZh ? 'none' : '';
    }

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
