import { type ReactNode, type ReactElement } from 'react';

interface LocalizedSectionProps {
  zhContent: ReactNode;
  enContent: ReactNode;
}

export default function LocalizedSection({
  zhContent,
  enContent
}: LocalizedSectionProps): ReactElement {
  return (
    <>
      <span className="is-lang-zh">{zhContent}</span>
      <span className="is-lang-en">{enContent}</span>
    </>
  );
}
