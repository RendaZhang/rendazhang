import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

interface ExperienceEntry {
  readonly period: string;
  readonly company: string;
  readonly title: string;
  readonly summary?: string;
  readonly bullets?: ReadonlyArray<string>;
}

interface ExperienceSectionProps {
  experienceEn: { title: string; entries: ReadonlyArray<ExperienceEntry> };
  experienceZh: { title: string; entries: ReadonlyArray<ExperienceEntry> };
}

export default function ExperienceSection({
  experienceEn,
  experienceZh
}: ExperienceSectionProps): ReactElement {
  return (
    <section className="experience-section" id="experience">
      <h2 id="experienceTitle">
        <LocalizedSection zhContent={experienceZh.title} enContent={experienceEn.title} />
      </h2>
      <div id="experienceList">
        {experienceZh.entries.map((entry, idx) => (
          <div className="experience-item mb-4" key={idx}>
            <div className="section-header">
              <span className="experience-period mr-2">
                <LocalizedSection
                  zhContent={entry.period}
                  enContent={experienceEn.entries[idx].period}
                />
              </span>
              <span className="experience-company">
                <LocalizedSection
                  zhContent={entry.company}
                  enContent={experienceEn.entries[idx].company}
                />
              </span>
            </div>
            <h3 className="experience-role my-2">
              <LocalizedSection
                zhContent={entry.title}
                enContent={experienceEn.entries[idx].title}
              />
            </h3>
            {entry.summary && (
              <p>
                <LocalizedSection
                  zhContent={entry.summary}
                  enContent={experienceEn.entries[idx].summary}
                />
              </p>
            )}
            {entry.bullets && (
              <ul>
                {entry.bullets.map((b, i) => (
                  <li key={i}>
                    <LocalizedSection
                      zhContent={b}
                      enContent={experienceEn.entries[idx].bullets?.[i]}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
