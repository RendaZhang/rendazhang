import React from 'react';
import { ABOUT_CONTENT } from '../content/aboutContent.js';
import { IMAGE_PATHS, RESUME_EN_DOWNLOAD, RESUME_ZH_DOWNLOAD } from '../config.js';
import ContactSection from './ContactSection.jsx';
import useContent from '../hooks/useContent.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AboutContent() {
  const { lang } = useLanguage();
  const content = useContent(ABOUT_CONTENT) || {};
  const isZh = lang && lang.startsWith('zh');
  const resumeHref = isZh ? IMAGE_PATHS.RESUME_ZH : IMAGE_PATHS.RESUME_EN;
  const resumeDownload = isZh ? RESUME_ZH_DOWNLOAD : RESUME_EN_DOWNLOAD;

  return (
    <div id="content">
      <section className="hero">
        <h1 id="heroHeading" dangerouslySetInnerHTML={{ __html: content.heroHeading }} />
      </section>
      <section className="about-section">
        <h2 id="aboutTitle">{content.title}</h2>
        <div id="aboutParagraphs">
          {content.paragraphs?.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
        <ul id="aboutInfo">
          {content.info?.map(({ label, value }, idx) => (
            <li key={idx}>
              <span>{label}</span>
              {value}
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
            {content.resumeLabel}
          </a>
          <a id="contactBtn" href="#contact" className="btn btn-secondary ms-2">
            {content.contact?.title}
          </a>
        </div>
      </section>
      <section className="education-section" id="education">
        <h2 id="educationTitle">{content.education?.title}</h2>
        <div id="educationList">
          {content.education?.entries?.map(({ period, school, degree, details }, idx) => (
            <div className="education-item" key={idx}>
              <div className="education-header">
                <span className="education-period">{period}</span>
                <span className="education-school">{school}</span>
              </div>
              <h3 className="education-degree">{degree}</h3>
              <p>{details}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="blog-section" id="blog">
        <h2 id="blogTitle">{content.blog?.title}</h2>
        <div id="blogList">
          {content.blog?.entries?.map(({ category, date, url, title }, idx) => (
            <div className="blog-item" key={idx}>
              <div className="blog-header">
                <span className="blog-category">{category}</span>
                <span className="blog-date">{date}</span>
              </div>
              <h3 className="blog-title">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {title}
                </a>
              </h3>
            </div>
          ))}
        </div>
      </section>
      <section className="skills-section" id="skills">
        <h2 id="skillsTitle">{content.skills?.title}</h2>
        <div id="skillsBars">
          {content.skills?.categories?.map(({ label, level }, idx) => (
            <div className="skill-bar" key={idx}>
              <span className="skill-label">{label}</span>
              <progress max="100" value={level} />
            </div>
          ))}
        </div>
        <ul id="skillsList">
          {content.skills?.items?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="experience-section" id="experience">
        <h2 id="experienceTitle">{content.experience?.title}</h2>
        <div id="experienceList">
          {content.experience?.entries?.map((entry, idx) => (
            <div className="experience-item" key={idx}>
              <div className="experience-header">
                <span className="experience-period">{entry.period}</span>
                <span className="experience-company">{entry.company}</span>
              </div>
              <h3 className="experience-role">{entry.title}</h3>
              {entry.summary && <p>{entry.summary}</p>}
              {entry.bullets && (
                <ul>
                  {entry.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
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
