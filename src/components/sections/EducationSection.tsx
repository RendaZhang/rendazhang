import type { ABOUT_CONTENT } from '../../content';
import LocalizedSection from '../ui/data-display/LocalizedSection';
import ResumeFold from './ResumeFold';
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
    <section
      className="c-education-section c-resume-section"
      id="education"
      aria-labelledby="educationTitle"
    >
      <h2 id="educationTitle">
        <LocalizedSection zhContent={educationZh.title} enContent={educationEn.title} />
      </h2>
      <ol className="c-resume-roll" id="educationList">
        {educationZh.entries.map((entry, index) => {
          const translation = educationEn.entries[index];
          return (
            <ResumeFold
              key={entry.id}
              id={`education-${entry.id}`}
              mark={entry.id}
              period={{ zh: entry.period, en: translation.period }}
              organization={{ zh: entry.school, en: translation.school }}
              title={{ zh: entry.degree, en: translation.degree }}
              result={{ zh: entry.result, en: translation.result }}
            >
              <p>
                <LocalizedSection zhContent={entry.details} enContent={translation.details} />
              </p>
            </ResumeFold>
          );
        })}
      </ol>
    </section>
  );
}
