import { ABOUT_CONTENT } from '../../content';
import {
  HERO_IMAGE_PATHS,
  IMAGE_PATHS,
  RESUME_EN_DOWNLOAD,
  RESUME_ZH_DOWNLOAD
} from '../../config.js';
import { MAIN_HERO } from '../../data';
import { ResponsiveHero } from '../ui';
import ContactSection from './ContactSection.jsx';
import { useLanguage } from '../providers';
import { LocalizedSection, SocialIcons } from '../ui';
import SocialIconsEffects from './SocialIconsEffects.jsx';
import { ChatWidget } from '../chat';

export default function AboutContent() {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const contentEn = ABOUT_CONTENT.en;
  const contentZh = ABOUT_CONTENT.zh;
  const isZh = langKey === 'zh';
  const resumeHref = isZh ? IMAGE_PATHS.RESUME_ZH : IMAGE_PATHS.RESUME_EN;
  const resumeDownload = isZh ? RESUME_ZH_DOWNLOAD : RESUME_EN_DOWNLOAD;
  const WIDTHS = [3840, 2560, 1920, 1280, 1000, 800, 400];

  return (
    <div id="content">
      <ResponsiveHero
        imageName="main-hero"
        imageMap={HERO_IMAGE_PATHS}
        imageWidths={WIDTHS}
        imagePlaceholder={MAIN_HERO}
        className="hero"
      >
        <h1 id="heroHeading">
          <LocalizedSection
            zhContent={<span dangerouslySetInnerHTML={{ __html: contentZh.heroHeading }} />}
            enContent={<span dangerouslySetInnerHTML={{ __html: contentEn.heroHeading }} />}
          />
        </h1>
      </ResponsiveHero>
      <SocialIcons />
      <SocialIconsEffects />
      <section className="about-section">
        <h2 id="aboutTitle">
          <LocalizedSection zhContent={contentZh.title} enContent={contentEn.title} />
        </h2>
        <div id="aboutParagraphs">
          {contentZh.paragraphs.map((p, idx) => (
            <p key={idx}>
              <LocalizedSection zhContent={p} enContent={contentEn.paragraphs[idx]} />
            </p>
          ))}
        </div>
        <ul id="aboutInfo">
          {contentZh.info.map((item, idx) => (
            <li className="mb-2" key={idx}>
              <LocalizedSection zhContent={item.label} enContent={contentEn.info[idx].label} />
              <LocalizedSection zhContent={item.value} enContent={contentEn.info[idx].value} />
            </li>
          ))}
        </ul>
        <div className="resume-link mt-3">
          <a
            id="resumeLink"
            href={resumeHref}
            download={resumeDownload}
            className="btn btn-primary"
          >
            <LocalizedSection zhContent={contentZh.resumeLabel} enContent={contentEn.resumeLabel} />
          </a>
          <a id="contactBtn" href="#contact" className="btn btn-secondary ms-2">
            <LocalizedSection
              zhContent={contentZh.contact.title}
              enContent={contentEn.contact.title}
            />
          </a>
        </div>
      </section>
      <section className="education-section" id="education">
        <h2 id="educationTitle">
          <LocalizedSection
            zhContent={contentZh.education.title}
            enContent={contentEn.education.title}
          />
        </h2>
        <div id="educationList">
          {contentZh.education.entries.map((entry, idx) => (
            <div className="education-item mb-4" key={idx}>
              <div className="section-header">
                <span className="education-period mr-2">
                  <LocalizedSection
                    zhContent={entry.period}
                    enContent={contentEn.education.entries[idx].period}
                  />
                </span>
                <span className="education-school">
                  <LocalizedSection
                    zhContent={entry.school}
                    enContent={contentEn.education.entries[idx].school}
                  />
                </span>
              </div>
              <h3 className="education-degree my-2">
                <LocalizedSection
                  zhContent={entry.degree}
                  enContent={contentEn.education.entries[idx].degree}
                />
              </h3>
              <p>
                <LocalizedSection
                  zhContent={entry.details}
                  enContent={contentEn.education.entries[idx].details}
                />
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="blog-section" id="blog">
        <h2 id="blogTitle">
          <LocalizedSection zhContent={contentZh.blog.title} enContent={contentEn.blog.title} />
        </h2>
        <div id="blogList">
          {contentZh.blog.entries.map((entry, idx) => (
            <div className="blog-item mb-4" key={idx}>
              <div className="section-header blog-header">
                <span className="blog-category mr-2">
                  <LocalizedSection
                    zhContent={entry.category}
                    enContent={contentEn.blog.entries[idx].category}
                  />
                </span>
                <span className="blog-date">
                  <LocalizedSection
                    zhContent={entry.date}
                    enContent={contentEn.blog.entries[idx].date}
                  />
                </span>
              </div>
              <h3 className="blog-title">
                <a href={entry.url} target="_blank" rel="noopener noreferrer">
                  <LocalizedSection
                    zhContent={entry.title}
                    enContent={contentEn.blog.entries[idx].title}
                  />
                </a>
              </h3>
            </div>
          ))}
        </div>
      </section>
      <section className="skills-section" id="skills">
        <h2 id="skillsTitle">
          <LocalizedSection zhContent={contentZh.skills.title} enContent={contentEn.skills.title} />
        </h2>
        <div id="skillsBars">
          {contentZh.skills.categories.map((cat, idx) => (
            <div className="skill-bar mb-2" key={idx}>
              <span className="skill-label">
                <LocalizedSection
                  zhContent={cat.label}
                  enContent={contentEn.skills.categories[idx].label}
                />
              </span>
              <progress max="100" value={cat.level} />
            </div>
          ))}
        </div>
        <ul id="skillsList">
          {contentZh.skills.items.map((item, idx) => (
            <li key={idx}>
              <LocalizedSection zhContent={item} enContent={contentEn.skills.items[idx]} />
            </li>
          ))}
        </ul>
      </section>
      <section className="experience-section" id="experience">
        <h2 id="experienceTitle">
          <LocalizedSection
            zhContent={contentZh.experience.title}
            enContent={contentEn.experience.title}
          />
        </h2>
        <div id="experienceList">
          {contentZh.experience.entries.map((entry, idx) => (
            <div className="experience-item mb-4" key={idx}>
              <div className="section-header">
                <span className="experience-period mr-2">
                  <LocalizedSection
                    zhContent={entry.period}
                    enContent={contentEn.experience.entries[idx].period}
                  />
                </span>
                <span className="experience-company">
                  <LocalizedSection
                    zhContent={entry.company}
                    enContent={contentEn.experience.entries[idx].company}
                  />
                </span>
              </div>
              <h3 className="experience-role my-2">
                <LocalizedSection
                  zhContent={entry.title}
                  enContent={contentEn.experience.entries[idx].title}
                />
              </h3>
              {entry.summary && (
                <p>
                  <LocalizedSection
                    zhContent={entry.summary}
                    enContent={contentEn.experience.entries[idx].summary}
                  />
                </p>
              )}
              {entry.bullets && (
                <ul>
                  {entry.bullets.map((b, i) => (
                    <li key={i}>
                      <LocalizedSection
                        zhContent={b}
                        enContent={contentEn.experience.entries[idx].bullets[i]}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
      <ContactSection />
      <ChatWidget />
    </div>
  );
}
