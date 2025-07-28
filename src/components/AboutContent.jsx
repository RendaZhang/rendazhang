import React from 'react';
import { ABOUT_CONTENT } from '../content/aboutContent.js';
import { IMAGE_PATHS, RESUME_EN_DOWNLOAD, RESUME_ZH_DOWNLOAD } from '../config.js';
import ContactSection from './ContactSection.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AboutContent() {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const contentEn = ABOUT_CONTENT.en;
  const contentZh = ABOUT_CONTENT.zh;
  const isZh = langKey === 'zh';
  const resumeHref = isZh ? IMAGE_PATHS.RESUME_ZH : IMAGE_PATHS.RESUME_EN;
  const resumeDownload = isZh ? RESUME_ZH_DOWNLOAD : RESUME_EN_DOWNLOAD;

  return (
    <div id="content">
      <section className="hero">
        <h1 id="heroHeading">
          <span className="lang-zh" dangerouslySetInnerHTML={{ __html: contentZh.heroHeading }} />
          <span className="lang-en" dangerouslySetInnerHTML={{ __html: contentEn.heroHeading }} />
        </h1>
      </section>
      <section className="about-section">
        <h2 id="aboutTitle">
          <span className="lang-zh">{contentZh.title}</span>
          <span className="lang-en">{contentEn.title}</span>
        </h2>
        <div id="aboutParagraphs">
          {contentZh.paragraphs.map((p, idx) => (
            <p key={idx}>
              <span className="lang-zh">{p}</span>
              <span className="lang-en">{contentEn.paragraphs[idx]}</span>
            </p>
          ))}
        </div>
        <ul id="aboutInfo">
          {contentZh.info.map((item, idx) => (
            <li key={idx}>
              <span className="lang-zh">{item.label}</span>
              <span className="lang-en">{contentEn.info[idx].label}</span>
              <span className="lang-zh">{item.value}</span>
              <span className="lang-en">{contentEn.info[idx].value}</span>
            </li>
          ))}
        </ul>
        <div className="resume-link">
          <a
            id="resumeLink"
            href={resumeHref}
            download={resumeDownload}
            className="btn btn-primary"
          >
            <span className="lang-zh">{contentZh.resumeLabel}</span>
            <span className="lang-en">{contentEn.resumeLabel}</span>
          </a>
          <a id="contactBtn" href="#contact" className="btn btn-secondary ms-2">
            <span className="lang-zh">{contentZh.contact.title}</span>
            <span className="lang-en">{contentEn.contact.title}</span>
          </a>
        </div>
      </section>
      <section className="education-section" id="education">
        <h2 id="educationTitle">
          <span className="lang-zh">{contentZh.education.title}</span>
          <span className="lang-en">{contentEn.education.title}</span>
        </h2>
        <div id="educationList">
          {contentZh.education.entries.map((entry, idx) => (
            <div className="education-item" key={idx}>
              <div className="education-header">
                <span className="education-period">
                  <span className="lang-zh">{entry.period}</span>
                  <span className="lang-en">{contentEn.education.entries[idx].period}</span>
                </span>
                <span className="education-school">
                  <span className="lang-zh">{entry.school}</span>
                  <span className="lang-en">{contentEn.education.entries[idx].school}</span>
                </span>
              </div>
              <h3 className="education-degree">
                <span className="lang-zh">{entry.degree}</span>
                <span className="lang-en">{contentEn.education.entries[idx].degree}</span>
              </h3>
              <p>
                <span className="lang-zh">{entry.details}</span>
                <span className="lang-en">{contentEn.education.entries[idx].details}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="blog-section" id="blog">
        <h2 id="blogTitle">
          <span className="lang-zh">{contentZh.blog.title}</span>
          <span className="lang-en">{contentEn.blog.title}</span>
        </h2>
        <div id="blogList">
          {contentZh.blog.entries.map((entry, idx) => (
            <div className="blog-item" key={idx}>
              <div className="blog-header">
                <span className="blog-category">
                  <span className="lang-zh">{entry.category}</span>
                  <span className="lang-en">{contentEn.blog.entries[idx].category}</span>
                </span>
                <span className="blog-date">
                  <span className="lang-zh">{entry.date}</span>
                  <span className="lang-en">{contentEn.blog.entries[idx].date}</span>
                </span>
              </div>
              <h3 className="blog-title">
                <a href={entry.url} target="_blank" rel="noopener noreferrer">
                  <span className="lang-zh">{entry.title}</span>
                  <span className="lang-en">{contentEn.blog.entries[idx].title}</span>
                </a>
              </h3>
            </div>
          ))}
        </div>
      </section>
      <section className="skills-section" id="skills">
        <h2 id="skillsTitle">
          <span className="lang-zh">{contentZh.skills.title}</span>
          <span className="lang-en">{contentEn.skills.title}</span>
        </h2>
        <div id="skillsBars">
          {contentZh.skills.categories.map((cat, idx) => (
            <div className="skill-bar" key={idx}>
              <span className="skill-label">
                <span className="lang-zh">{cat.label}</span>
                <span className="lang-en">{contentEn.skills.categories[idx].label}</span>
              </span>
              <progress max="100" value={cat.level} />
            </div>
          ))}
        </div>
        <ul id="skillsList">
          {contentZh.skills.items.map((item, idx) => (
            <li key={idx}>
              <span className="lang-zh">{item}</span>
              <span className="lang-en">{contentEn.skills.items[idx]}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="experience-section" id="experience">
        <h2 id="experienceTitle">
          <span className="lang-zh">{contentZh.experience.title}</span>
          <span className="lang-en">{contentEn.experience.title}</span>
        </h2>
        <div id="experienceList">
          {contentZh.experience.entries.map((entry, idx) => (
            <div className="experience-item" key={idx}>
              <div className="experience-header">
                <span className="experience-period">
                  <span className="lang-zh">{entry.period}</span>
                  <span className="lang-en">{contentEn.experience.entries[idx].period}</span>
                </span>
                <span className="experience-company">
                  <span className="lang-zh">{entry.company}</span>
                  <span className="lang-en">{contentEn.experience.entries[idx].company}</span>
                </span>
              </div>
              <h3 className="experience-role">
                <span className="lang-zh">{entry.title}</span>
                <span className="lang-en">{contentEn.experience.entries[idx].title}</span>
              </h3>
              {entry.summary && (
                <p>
                  <span className="lang-zh">{entry.summary}</span>
                  <span className="lang-en">{contentEn.experience.entries[idx].summary}</span>
                </p>
              )}
              {entry.bullets && (
                <ul>
                  {entry.bullets.map((b, i) => (
                    <li key={i}>
                      <span className="lang-zh">{b}</span>
                      <span className="lang-en">
                        {contentEn.experience.entries[idx].bullets[i]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
