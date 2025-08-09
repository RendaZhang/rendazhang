import { IMAGE_PATHS, RESUME_EN_DOWNLOAD, RESUME_ZH_DOWNLOAD } from '../../constants';
import type { ABOUT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

interface BioSectionProps {
  contentEn: typeof ABOUT_CONTENT.en;
  contentZh: typeof ABOUT_CONTENT.zh;
  isZh: boolean;
}

export default function BioSection({ contentEn, contentZh, isZh }: BioSectionProps): ReactElement {
  const resumeHref = isZh ? IMAGE_PATHS.RESUME_ZH : IMAGE_PATHS.RESUME_EN;
  const resumeDownload = isZh ? RESUME_ZH_DOWNLOAD : RESUME_EN_DOWNLOAD;

  return (
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
          <li key={idx}>
            <LocalizedSection zhContent={item.label} enContent={contentEn.info[idx].label} />
            <LocalizedSection zhContent={item.value} enContent={contentEn.info[idx].value} />
          </li>
        ))}
      </ul>
      <div className="resume-link">
        <a id="resumeLink" href={resumeHref} download={resumeDownload} className="c-btn-primary">
          <LocalizedSection zhContent={contentZh.resumeLabel} enContent={contentEn.resumeLabel} />
        </a>
        <a id="contactBtn" href="#contact" className="c-btn-secondary">
          <LocalizedSection
            zhContent={contentZh.contact.title}
            enContent={contentEn.contact.title}
          />
        </a>
      </div>
    </section>
  );
}
