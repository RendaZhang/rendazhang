(function () {
  function applyLang() {
    var data = window.aboutPageData || {};
    var contentData = window.aboutPageContent || {};
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

    if (contentData.zh && contentData.en) {
      var current = showZh ? contentData.zh : contentData.en;
      var container = document.getElementById('content');
      if (container) {
        var h1 = container.querySelector('#heroHeading');
        if (h1) h1.innerHTML = current.heroHeading;
        var title = container.querySelector('#aboutTitle');
        if (title) title.textContent = current.title;
        var ps = container.querySelector('#aboutParagraphs');
        if (ps) {
          ps.innerHTML = '';
          current.paragraphs.forEach(function (p) {
            var el = document.createElement('p');
            el.textContent = p;
            ps.appendChild(el);
          });
        }
        var info = container.querySelector('#aboutInfo');
        if (info) {
          info.innerHTML = '';
          current.info.forEach(function (item) {
            var li = document.createElement('li');
            var span = document.createElement('span');
            span.textContent = item.label;
            li.appendChild(span);
            li.appendChild(document.createTextNode(item.value));
            info.appendChild(li);
          });
        }
        var resume = container.querySelector('#resumeLink');
        if (resume) {
          resume.textContent = current.resumeLabel;
          if (data.resumePaths && data.resumeDownloads) {
            resume.setAttribute('href', showZh ? data.resumePaths.zh : data.resumePaths.en);
            resume.setAttribute('download', showZh ? data.resumeDownloads.zh : data.resumeDownloads.en);
          }
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', applyLang);
  } else {
    applyLang();
  }
})();
