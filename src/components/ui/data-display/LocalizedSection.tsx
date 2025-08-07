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
      <span className="lang-zh">{zhContent}</span>
      <span className="lang-en">{enContent}</span>
    </>
  );
}
