import type { ABOUT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

interface HomepageProofPathSectionProps {
  proofPathEn: typeof ABOUT_CONTENT.en.proofPath;
  proofPathZh: typeof ABOUT_CONTENT.zh.proofPath;
}

export default function HomepageProofPathSection({
  proofPathEn,
  proofPathZh
}: HomepageProofPathSectionProps): ReactElement {
  return (
    <section className="c-home-proof-path" id="proof-path" aria-labelledby="homepageProofPathTitle">
      <div className="c-home-proof-path-copy">
        <p className="c-home-proof-path-eyebrow">
          <LocalizedSection zhContent={proofPathZh.eyebrow} enContent={proofPathEn.eyebrow} />
        </p>
        <h2 id="homepageProofPathTitle">
          <LocalizedSection zhContent={proofPathZh.title} enContent={proofPathEn.title} />
        </h2>
        <p className="c-home-proof-path-summary">
          <LocalizedSection zhContent={proofPathZh.summary} enContent={proofPathEn.summary} />
        </p>
      </div>
      <nav className="c-home-proof-path-links" aria-labelledby="homepageProofPathTitle">
        {proofPathZh.actions.map((actionZh, idx) => {
          const actionEn = proofPathEn.actions[idx] ?? actionZh;
          return (
            <a
              className="c-home-proof-path-link"
              href={actionZh.href}
              key={`${actionZh.href}-${actionZh.label}`}
            >
              <span className="c-home-proof-path-index">{String(idx + 1).padStart(2, '0')}</span>
              <span className="c-home-proof-path-link-copy">
                <strong>
                  <LocalizedSection zhContent={actionZh.label} enContent={actionEn.label} />
                </strong>
                <span>
                  <LocalizedSection zhContent={actionZh.note} enContent={actionEn.note} />
                </span>
              </span>
            </a>
          );
        })}
      </nav>
    </section>
  );
}
