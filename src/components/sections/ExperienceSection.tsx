import type { ABOUT_CONTENT } from '../../content';
import LocalizedSection from '../ui/data-display/LocalizedSection';
import ResumeFold from './ResumeFold';
import type { ReactElement } from 'react';

interface ExperienceSectionProps {
  experienceEn: typeof ABOUT_CONTENT.en.experience;
  experienceZh: typeof ABOUT_CONTENT.zh.experience;
}

export default function ExperienceSection({
  experienceEn,
  experienceZh
}: ExperienceSectionProps): ReactElement {
  return (
    <section className="c-experience-section c-resume-section" id="experience">
      <h2 id="experienceTitle">
        <LocalizedSection zhContent={experienceZh.title} enContent={experienceEn.title} />
      </h2>
      <p className="c-section-summary">
        <LocalizedSection zhContent={experienceZh.summary} enContent={experienceEn.summary} />
      </p>
      <ol className="c-resume-roll" id="experienceList">
        {experienceZh.entries.map((entry, index) => {
          const translation = experienceEn.entries[index];
          return (
            <ResumeFold
              key={entry.id}
              id={`experience-${entry.id}`}
              mark={entry.id}
              period={{ zh: entry.period, en: translation.period }}
              organization={{ zh: entry.company, en: translation.company }}
              title={{ zh: entry.title, en: translation.title }}
            >
              <p>
                <LocalizedSection zhContent={entry.summary} enContent={translation.summary} />
              </p>
              <ul>
                {entry.bullets.map((bullet, bulletIndex) => (
                  <li key={bullet}>
                    <LocalizedSection
                      zhContent={bullet}
                      enContent={translation.bullets[bulletIndex]}
                    />
                  </li>
                ))}
              </ul>
            </ResumeFold>
          );
        })}
      </ol>
    </section>
  );
}
