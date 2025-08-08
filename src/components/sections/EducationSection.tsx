import type { ABOUT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

interface EducationSectionProps {
  educationEn: typeof ABOUT_CONTENT.en.education;
  educationZh: typeof ABOUT_CONTENT.zh.education;
}

export default function EducationSection({
  educationEn,
  educationZh
}: EducationSectionProps): ReactElement {
  return (
    <section className="education-section" id="education">
      <h2 id="educationTitle">
        <LocalizedSection zhContent={educationZh.title} enContent={educationEn.title} />
      </h2>
      <div id="educationList">
        {educationZh.entries.map((entry, idx) => (
          <div className="education-item mb-4" key={idx}>
            <div className="section-header">
              <span className="education-period mr-2">
                <LocalizedSection
                  zhContent={entry.period}
                  enContent={educationEn.entries[idx].period}
                />
              </span>
              <span className="education-school">
                <LocalizedSection
                  zhContent={entry.school}
                  enContent={educationEn.entries[idx].school}
                />
              </span>
            </div>
            <h3 className="education-degree my-2">
              <LocalizedSection
                zhContent={entry.degree}
                enContent={educationEn.entries[idx].degree}
              />
            </h3>
            <p>
              <LocalizedSection
                zhContent={entry.details}
                enContent={educationEn.entries[idx].details}
              />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
