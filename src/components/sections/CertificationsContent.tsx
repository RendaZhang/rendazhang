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
    <div className="container">
      <h1>
        <LocalizedSection zhContent={textsZh.heading} enContent={textsEn.heading} />
      </h1>

      <section className="cert-grid">
        {textsZh.certificates.map((certZh, idx) => {
          const certEn = textsEn.certificates[idx];
          return (
            <article className="cert-card" key={idx}>
              <h2>
                <LocalizedSection zhContent={certZh.title} enContent={certEn.title} />
              </h2>
              <p>
                <LocalizedSection
                  zhContent={
                    <>
                      <strong>{certZh.nameLabel}</strong> {certZh.name}
                    </>
                  }
                  enContent={
                    <>
                      <strong>{certEn.nameLabel}</strong> {certEn.name}
                    </>
                  }
                />
              </p>
              <p>
                <LocalizedSection
                  zhContent={
                    <>
                      <strong>{certZh.issuedLabel}</strong> {certZh.issued}
                      &nbsp;&nbsp;•&nbsp;&nbsp;
                      <strong>{certZh.expiresLabel}</strong> {certZh.expires}
                    </>
                  }
                  enContent={
                    <>
                      <strong>{certEn.issuedLabel}</strong> {certEn.issued}
                      &nbsp;&nbsp;•&nbsp;&nbsp;
                      <strong>{certEn.expiresLabel}</strong> {certEn.expires}
                    </>
                  }
                />
              </p>
              <CredlyBadge />
              <p className="verify-links">
                <a
                  className="verify-btn btn-primary"
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
                  className="verify-btn btn-primary"
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
