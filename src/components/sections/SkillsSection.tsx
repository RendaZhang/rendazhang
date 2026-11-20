import { ABOUT_CONTENT, HOME_SKILL_INDEX } from '../../content/aboutContent';
import LocalizedSection from '../ui/data-display/LocalizedSection';

const marks = {
  backend: {
    ink: 'M7 8h34v8H7zM7 24h34v8H7zM24 16v8m0 8v8m-11 0h22',
    accent: 'M12 12h3m-3 16h3m17-16h4m-4 16h4'
  },
  ai: {
    ink: 'M6 9h36v28H6zM6 16h36m-30-3h2m4 0h2m-3 30h14m-7-6v6',
    accent: 'm14 22 5 5-5 5m11 0h9'
  },
  cloud: {
    ink: 'm24 6 17 9-17 9-17-9zm-17 17 17 9 17-9M7 31l17 9 17-9',
    accent: 'M24 12v7m-5-3.5h10m-5 11v1m0 7v1'
  },
  reliability: {
    ink: 'M6 8h36v31H6zM12 27h6l5-9 6 14 4-5h4M17 44h14M24 39v5',
    accent: 'M10 13h6m14 0h8'
  }
};

export default function SkillsSection() {
  return (
    <section className="c-skills-section c-skill-index" id="skills" aria-labelledby="skillsTitle">
      <h2 id="skillsTitle">
        <LocalizedSection
          zhContent={ABOUT_CONTENT.zh.skills.title}
          enContent={ABOUT_CONTENT.en.skills.title}
        />
      </h2>
      <div className="c-skill-index-grid" id="skillsGroups">
        {HOME_SKILL_INDEX.map(({ id, label, tools, connection, links }) => (
          <details className="c-skill-tab" key={id}>
            <summary>
              <svg
                viewBox="0 0 48 48"
                className="c-skill-tab-mark"
                aria-hidden="true"
                focusable="false"
              >
                <path d={marks[id].ink} />
                <path className="c-skill-tab-mark-accent" d={marks[id].accent} />
              </svg>
              <span className="c-skill-tab-title">
                <LocalizedSection zhContent={label.zh} enContent={label.en} />
              </span>
              <span className="c-skill-tab-pull" aria-hidden="true" />
            </summary>
            <div className="c-skill-tab-paper">
              <p className="c-skill-tab-tools">{tools}</p>
              <p className="c-skill-tab-text">
                <LocalizedSection zhContent={connection.zh} enContent={connection.en} />
              </p>
              <div className="c-skill-tab-links">
                {links.map(({ href, label: linkLabel }) => (
                  <a href={href} key={href}>
                    <LocalizedSection zhContent={linkLabel.zh} enContent={linkLabel.en} />
                    <span aria-hidden="true"> →</span>
                  </a>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
