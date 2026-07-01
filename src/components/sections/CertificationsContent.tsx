import { VERIFY_URLS } from '../../constants';
import { CERTIFICATIONS_CONTENT } from '../../content';
import { useLanguage } from '../providers';
import { LocalizedSection, CredlyBadge } from '../ui';
import type { ReactElement } from 'react';

export default function CertificationsContent(): ReactElement {
  useLanguage();
  const textsEn = CERTIFICATIONS_CONTENT.en;
  const textsZh = CERTIFICATIONS_CONTENT.zh;

  return (
    <div className="c-cert-container">
      <header className="c-cert-hero">
        <h1>
          <LocalizedSection zhContent={textsZh.heading} enContent={textsEn.heading} />
        </h1>
        <p className="c-cert-hero-summary">
          <LocalizedSection zhContent={textsZh.summary} enContent={textsEn.summary} />
        </p>
      </header>

      <section className="c-cert-grid">
        {textsZh.certificates.map((certZh, idx) => {
          const certEn = textsEn.certificates[idx];
          return (
            <article className="c-cert-card" key={idx}>
              <div className="c-cert-card-copy">
                <h2>
                  <LocalizedSection zhContent={certZh.title} enContent={certEn.title} />
                </h2>
                <dl className="c-cert-meta">
                  <div>
                    <dt>
                      <LocalizedSection zhContent={certZh.nameLabel} enContent={certEn.nameLabel} />
                    </dt>
                    <dd>
                      <LocalizedSection zhContent={certZh.name} enContent={certEn.name} />
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <LocalizedSection
                        zhContent={certZh.issuedLabel}
                        enContent={certEn.issuedLabel}
                      />
                    </dt>
                    <dd>
                      <LocalizedSection zhContent={certZh.issued} enContent={certEn.issued} />
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <LocalizedSection
                        zhContent={certZh.expiresLabel}
                        enContent={certEn.expiresLabel}
                      />
                    </dt>
                    <dd>
                      <LocalizedSection zhContent={certZh.expires} enContent={certEn.expires} />
                    </dd>
                  </div>
                </dl>
                <section className="c-cert-proof" aria-labelledby={`cert-proof-${idx}`}>
                  <h3 id={`cert-proof-${idx}`}>
                    <LocalizedSection
                      zhContent={textsZh.proofHeading}
                      enContent={textsEn.proofHeading}
                    />
                  </h3>
                  <ul>
                    {textsZh.proofItems.map((itemZh, proofIdx) => (
                      <li key={itemZh}>
                        <LocalizedSection
                          zhContent={itemZh}
                          enContent={textsEn.proofItems[proofIdx]}
                        />
                      </li>
                    ))}
                  </ul>
                  <p className="c-cert-boundary">
                    <LocalizedSection zhContent={textsZh.boundary} enContent={textsEn.boundary} />
                  </p>
                </section>
              </div>
              <CredlyBadge />
              <p className="c-verify-links">
                <a
                  className="c-verify-btn c-btn-primary"
                  href={VERIFY_URLS.CREDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LocalizedSection
                    zhContent={certZh.verifyCredly}
                    enContent={certEn.verifyCredly}
                  />
                </a>
                <a
                  className="c-verify-btn c-btn-primary"
                  href={VERIFY_URLS.AWS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LocalizedSection zhContent={certZh.verifyAws} enContent={certEn.verifyAws} />
                </a>
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
