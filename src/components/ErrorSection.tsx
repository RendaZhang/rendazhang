import type { ReactElement, ReactNode } from 'react';
import LocalizedSection from './ui/data-display/LocalizedSection';

interface LocalizedText {
  zh: ReactNode;
  en: ReactNode;
}

interface ErrorSectionProps {
  code: '404' | '500';
  title: LocalizedText;
  description: LocalizedText;
  homeLabel: LocalizedText;
}

export default function ErrorSection({
  code,
  title,
  description,
  homeLabel
}: ErrorSectionProps): ReactElement {
  return (
    <section className="c-error-section" aria-labelledby="error-page-title" data-error-code={code}>
      <div className="c-error-imprint">
        <p className="c-error-code">{code}</p>
        <svg className="c-error-art" viewBox="0 0 152 83" aria-hidden="true" focusable="false">
          {code === '404' ? (
            <>
              <path className="c-error-art-accent" d="M9 65h25l10-15h20" />
              <path className="c-error-art-lost" d="M66 50h17" />
              <path d="M84 14h42l14 14v42H84zm42 0v14h14M95 37h33m-33 10h22m-22 10h16" />
              <path d="M14 15h28M14 20h15m20 49h21" />
              <circle className="c-error-art-accent" cx="9" cy="65" r="3" />
            </>
          ) : (
            <>
              <path d="M9 22h39v43H9zm95 0h39v43h-39zM16 33h25m-25 16h25m70-16h25m-25 16h25" />
              <path className="c-error-art-accent" d="M48 43h15m27 0h14m-30-11-6 11h12l-6 12" />
              <path d="M52 16h14m22 0h14M52 71h14m22 0h14M19 58h4m92 0h4" />
            </>
          )}
        </svg>
      </div>

      <div className="c-error-copy">
        <h1 className="c-error-title" id="error-page-title">
          <LocalizedSection zhContent={title.zh} enContent={title.en} />
        </h1>
        <p className="c-error-description">
          <LocalizedSection zhContent={description.zh} enContent={description.en} />
        </p>
        <a href="/" className="c-btn-primary c-error-home">
          <span aria-hidden="true">←</span>
          <LocalizedSection zhContent={homeLabel.zh} enContent={homeLabel.en} />
        </a>
      </div>
    </section>
  );
}
