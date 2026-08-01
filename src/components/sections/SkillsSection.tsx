import type { ABOUT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

interface SkillsSectionProps {
  skillsEn: typeof ABOUT_CONTENT.en.skills;
  skillsZh: typeof ABOUT_CONTENT.zh.skills;
}

export default function SkillsSection({ skillsEn, skillsZh }: SkillsSectionProps): ReactElement {
  return (
    <section className="c-skills-section" id="skills">
      <h2 id="skillsTitle">
        <LocalizedSection zhContent={skillsZh.title} enContent={skillsEn.title} />
      </h2>
      <p className="c-section-summary">
        <LocalizedSection zhContent={skillsZh.summary} enContent={skillsEn.summary} />
      </p>
      <div className="c-skill-groups" id="skillsGroups">
        {skillsZh.categories.map((cat, idx) => (
          <article className="c-skill-group" key={cat.label}>
            <h3>
              <LocalizedSection zhContent={cat.label} enContent={skillsEn.categories[idx].label} />
            </h3>
            <p>
              <LocalizedSection
                zhContent={cat.description}
                enContent={skillsEn.categories[idx].description}
              />
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
