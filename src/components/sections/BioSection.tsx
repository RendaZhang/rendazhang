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
        <button
          id="resumeLink"
          type="button"
          className="c-btn-primary"
          onClick={() => {
            const link = document.createElement('a');
            link.href = resumeHref;
            link.download = resumeDownload;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <LocalizedSection zhContent={contentZh.resumeLabel} enContent={contentEn.resumeLabel} />
        </button>
        <button
          id="contactBtn"
          type="button"
          className="c-btn-secondary"
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', '#contact');
          }}
        >
          <LocalizedSection
            zhContent={contentZh.contact.title}
            enContent={contentEn.contact.title}
          />
        </button>
      </div>
    </section>
  );
}
