import type { ReactElement, ReactNode } from 'react';
import { LocalizedSection } from './ui';
import { useLanguage } from './providers';

interface LocalizedText {
  zh: ReactNode;
  en: ReactNode;
}

interface ErrorSectionProps {
  code?: string;
  emoji?: string;
  title: LocalizedText;
  description: LocalizedText;
  homeLabel: LocalizedText;
}

export default function ErrorSection({
  code = '',
  emoji = '',
  title,
  description,
  homeLabel
}: ErrorSectionProps): ReactElement {
  useLanguage();
  return (
    <section className="error-section">
      {emoji && <div className="error-emoji">{emoji}</div>}
      {code && <div className="error-code">{code}</div>}
      <h1 className="error-title">
        <LocalizedSection zhContent={title.zh} enContent={title.en} />
      </h1>
      <p className="error-description">
        <LocalizedSection zhContent={description.zh} enContent={description.en} />
      </p>
      <a href="/" className="btn btn-primary">
        <LocalizedSection zhContent={homeLabel.zh} enContent={homeLabel.en} />
      </a>
    </section>
  );
}
