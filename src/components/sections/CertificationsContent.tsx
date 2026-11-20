import type { ReactElement, ReactNode } from 'react';
import { VERIFY_URLS } from '../../constants/meta';
import { CHAT_PAGE_PATH, DOCS_PAGE_PATH } from '../../constants/paths';
import {
  CERTIFICATION_DATES,
  CERTIFICATION_TOPICS,
  CERTIFICATIONS_CONTENT
} from '../../content/certificationsContent';
import LocalizedSection from '../ui/data-display/LocalizedSection';

export default function CertificationsContent({ children }: { children: ReactNode }): ReactElement {
  const { zh, en } = CERTIFICATIONS_CONTENT;
  const certZh = zh.certificate;
  const certEn = en.certificate;
  const chatHref = `${CHAT_PAGE_PATH}/?preset=certification_context`;

  return (
    <div className="c-cert-container">
      <article className="c-cert-card" id="aws-saa-c03" aria-labelledby="cert-title">
        <header className="c-cert-hero">
          <h1 id="cert-title">
            <LocalizedSection zhContent={certZh.title} enContent={certEn.title} />
          </h1>
        </header>
        <div className="c-cert-overview">
          <div className="c-cert-record">
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
                  <LocalizedSection zhContent={certZh.issuedLabel} enContent={certEn.issuedLabel} />
                </dt>
                <dd>
                  <time dateTime={CERTIFICATION_DATES.issued}>
                    <LocalizedSection zhContent={certZh.issued} enContent={certEn.issued} />
                  </time>
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
                  <time dateTime={CERTIFICATION_DATES.expires}>
                    <LocalizedSection zhContent={certZh.expires} enContent={certEn.expires} />
                  </time>
                </dd>
              </div>
            </dl>
            <p className="c-verify-links">
              <a
                className="c-verify-btn"
                href={VERIFY_URLS.CREDLY}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LocalizedSection zhContent={certZh.verifyCredly} enContent={certEn.verifyCredly} />
                <span aria-hidden="true">↗</span>
              </a>
              <a
                className="c-verify-btn"
                href={VERIFY_URLS.AWS}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LocalizedSection zhContent={certZh.verifyAws} enContent={certEn.verifyAws} />
                <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>
          <div className="c-cert-verification">{children}</div>
        </div>
      </article>

      <aside className="c-cert-notes">
        <details className="c-cert-coverage" id="cert-coverage">
          <summary>
            <span>
              <LocalizedSection zhContent={zh.coverageHeading} enContent={en.coverageHeading} />
            </span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
              <path d="M3 8h10M8 3v10" />
            </svg>
          </summary>
          <div className="c-cert-coverage-body">
            <p>
              <LocalizedSection zhContent={zh.coverageBasis} enContent={en.coverageBasis} />
            </p>
            <dl>
              {CERTIFICATION_TOPICS.map(({ title, description, source }) => (
                <div key={title.en}>
                  <dt>
                    <LocalizedSection zhContent={title.zh} enContent={title.en} />
                  </dt>
                  <dd>
                    <LocalizedSection zhContent={description.zh} enContent={description.en} />
                    <a href={source}>
                      <LocalizedSection
                        zhContent={`${zh.guideLink} · ${title.zh}`}
                        enContent={`${en.guideLink} · ${title.en}`}
                      />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <section className="c-cert-related" aria-labelledby="cert-related-title">
              <h2 id="cert-related-title">
                <LocalizedSection zhContent={zh.relatedHeading} enContent={en.relatedHeading} />
              </h2>
              <ul>
                <li>
                  <LocalizedSection
                    zhContent={<a href={`${DOCS_PAGE_PATH}/#zh-参考架构`}>{zh.architecture}</a>}
                    enContent={
                      <a href={`${DOCS_PAGE_PATH}/#en-reference-architecture`}>{en.architecture}</a>
                    }
                  />
                </li>
                <li>
                  <a href={chatHref}>
                    <LocalizedSection zhContent={zh.chat} enContent={en.chat} />
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </details>
      </aside>
    </div>
  );
}
