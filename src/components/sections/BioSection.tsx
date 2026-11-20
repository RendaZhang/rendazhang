import { IMAGE_PATHS, RESUME_EN_DOWNLOAD, RESUME_ZH_DOWNLOAD } from '../../constants';
import type { ABOUT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

interface BioSectionProps {
  contentEn: typeof ABOUT_CONTENT.en;
  contentZh: typeof ABOUT_CONTENT.zh;
}

export default function BioSection({ contentEn, contentZh }: BioSectionProps): ReactElement {
  return (
    <section className="c-about-section">
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
      <div className="c-resume-link">
        <span id="resumeLink">
          <LocalizedSection
            zhContent={
              <a
                className="c-btn-primary"
                href={IMAGE_PATHS.RESUME_ZH}
                download={RESUME_ZH_DOWNLOAD}
              >
                {contentZh.resumeLabel}
              </a>
            }
            enContent={
              <a
                className="c-btn-primary"
                href={IMAGE_PATHS.RESUME_EN}
                download={RESUME_EN_DOWNLOAD}
              >
                {contentEn.resumeLabel}
              </a>
            }
          />
        </span>
        <a id="contactBtn" className="c-btn-secondary" href="#contact">
          <LocalizedSection
            zhContent={contentZh.contact.title}
            enContent={contentEn.contact.title}
          />
        </a>
      </div>
    </section>
  );
}
