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
            resume.setAttribute(
              'download',
              showZh ? data.resumeDownloads.zh : data.resumeDownloads.en
            );
          }
        }
        var skillsTitle = container.querySelector('#skillsTitle');
        if (skillsTitle && current.skills) skillsTitle.textContent = current.skills.title;
        var skillsBars = container.querySelector('#skillsBars');
        if (skillsBars && current.skills) {
          skillsBars.innerHTML = '';
          current.skills.categories.forEach(function (cat) {
            var bar = document.createElement('div');
            bar.className = 'skill-bar';
            var label = document.createElement('span');
            label.className = 'skill-label';
            label.textContent = cat.label;
            var progress = document.createElement('progress');
            progress.setAttribute('max', '100');
            progress.value = cat.level;
            bar.appendChild(label);
            bar.appendChild(progress);
            skillsBars.appendChild(bar);
          });
        }
        var skillsList = container.querySelector('#skillsList');
        if (skillsList && current.skills) {
          skillsList.innerHTML = '';
          current.skills.items.forEach(function (item) {
            var li = document.createElement('li');
            li.textContent = item;
            skillsList.appendChild(li);
          });
        }
        var expTitle = container.querySelector('#experienceTitle');
        if (expTitle && current.experience) expTitle.textContent = current.experience.title;
        var expList = container.querySelector('#experienceList');
        if (expList && current.experience) {
          expList.innerHTML = '';
          current.experience.entries.forEach(function (ent) {
            var item = document.createElement('div');
            item.className = 'experience-item';
            var header = document.createElement('div');
            header.className = 'experience-header';
            var period = document.createElement('span');
            period.className = 'experience-period';
            period.textContent = ent.period;
            var company = document.createElement('span');
            company.className = 'experience-company';
            company.textContent = ent.company;
            header.appendChild(period);
            header.appendChild(company);
            item.appendChild(header);
            var role = document.createElement('h3');
            role.className = 'experience-role';
            role.textContent = ent.title;
            item.appendChild(role);
            if (ent.summary) {
              var p = document.createElement('p');
              p.textContent = ent.summary;
              item.appendChild(p);
            }
            if (ent.bullets) {
              var ul = document.createElement('ul');
              ent.bullets.forEach(function (b) {
                var li = document.createElement('li');
                li.textContent = b;
                ul.appendChild(li);
              });
              item.appendChild(ul);
            }
            expList.appendChild(item);
          });
        }
        var eduTitle = container.querySelector('#educationTitle');
        if (eduTitle && current.education) eduTitle.textContent = current.education.title;
        var eduList = container.querySelector('#educationList');
        if (eduList && current.education) {
          eduList.innerHTML = '';
          current.education.entries.forEach(function (ent) {
            var item = document.createElement('div');
            item.className = 'education-item';
            var header = document.createElement('div');
            header.className = 'education-header';
            var period = document.createElement('span');
            period.className = 'education-period';
            period.textContent = ent.period;
            var school = document.createElement('span');
            school.className = 'education-school';
            school.textContent = ent.school;
            header.appendChild(period);
            header.appendChild(school);
            item.appendChild(header);
            var degree = document.createElement('h3');
            degree.className = 'education-degree';
            degree.textContent = ent.degree;
            item.appendChild(degree);
            if (ent.details) {
              var p = document.createElement('p');
              p.textContent = ent.details;
              item.appendChild(p);
            }
            eduList.appendChild(item);
          });
        }

        var blogTitle = container.querySelector('#blogTitle');
        if (blogTitle && current.blog) blogTitle.textContent = current.blog.title;
        var blogList = container.querySelector('#blogList');
        if (blogList && current.blog) {
          blogList.innerHTML = '';
          current.blog.entries.forEach(function (ent) {
            var item = document.createElement('div');
            item.className = 'blog-item';
            var header = document.createElement('div');
            header.className = 'blog-header';
            var category = document.createElement('span');
            category.className = 'blog-category';
            category.textContent = ent.category;
            var date = document.createElement('span');
            date.className = 'blog-date';
            date.textContent = ent.date;
            header.appendChild(category);
            header.appendChild(date);
            item.appendChild(header);
            var h3 = document.createElement('h3');
            var a = document.createElement('a');
            a.href = ent.url;
            a.target = '_blank';
            a.textContent = ent.title;
            h3.appendChild(a);
            item.appendChild(h3);
            blogList.appendChild(item);
          });
        }

        var contactTitle = container.querySelector('#contact .section-title');
        if (contactTitle && current.contact) contactTitle.textContent = current.contact.title;
        var contactLabels = container.querySelectorAll('#contact .contact-info strong');
        var contactValues = container.querySelectorAll('#contact .contact-info div');
        if (current.contact && contactLabels.length) {
          current.contact.info.forEach(function (info, i) {
            if (contactLabels[i]) contactLabels[i].textContent = info.label;
            if (contactValues[i]) contactValues[i].textContent = info.value;
          });
        }
        var form = container.querySelector('#contact form.contact-form');
        if (form && current.contact && current.contact.form) {
          var placeholders = current.contact.form.placeholders || {};
          var nameInput = form.querySelector('input[name="name"]');
          if (nameInput) nameInput.placeholder = placeholders.name;
          var contactInput = form.querySelector('input[name="contact"]');
          if (contactInput) contactInput.placeholder = placeholders.contact;
          var subjectInput = form.querySelector('input[name="_subject"]');
          if (subjectInput) subjectInput.placeholder = placeholders.subject;
          var messageInput = form.querySelector('textarea[name="message"]');
          if (messageInput) messageInput.placeholder = placeholders.message;
          var btn = form.querySelector('button[type="submit"]');
          if (btn) btn.textContent = current.contact.form.button;
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', function () {
      applyLang();
      document.documentElement.style.visibility = 'visible';
    });
  } else {
    applyLang();
    document.documentElement.style.visibility = 'visible';
  }
})();
