import type { ABOUT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

interface SkillsSectionProps {
  skillsEn: typeof ABOUT_CONTENT.en.skills;
  skillsZh: typeof ABOUT_CONTENT.zh.skills;
}

export default function SkillsSection({ skillsEn, skillsZh }: SkillsSectionProps): ReactElement {
  return (
    <section className="skills-section" id="skills">
      <h2 id="skillsTitle">
        <LocalizedSection zhContent={skillsZh.title} enContent={skillsEn.title} />
      </h2>
      <div id="skillsBars">
        {skillsZh.categories.map((cat, idx) => (
          <div className="skill-bar" key={idx}>
            <span className="skill-label">
              <LocalizedSection zhContent={cat.label} enContent={skillsEn.categories[idx].label} />
            </span>
            <progress max="100" value={cat.level} />
          </div>
        ))}
      </div>
      <ul id="skillsList">
        {skillsZh.items.map((item, idx) => (
          <li key={idx}>
            <LocalizedSection zhContent={item} enContent={skillsEn.items[idx]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
