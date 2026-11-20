import type { ReactElement, ReactNode } from 'react';
import LocalizedSection from '../ui/data-display/LocalizedSection';

const marks = {
  oneconnect: {
    ink: 'M11 39 28 24l18 15v20H11V39Zm35 0 18-15 18 15v20H46m-24 0V44h12v15m24 0V44h12v15M36 20l10-8 10 8M10 65h73',
    accent: 'M26 40h40m-7-6 7 6-7 6'
  },
  fanxin: {
    ink: 'M18 17h14v14H18zM43 17h14v14H43zM68 17h14v14H68zM18 48h14v14H18zM43 48h14v14H43zM68 48h14v14H68zM25 31v17m25-17v17m25-17v17',
    accent: 'M12 39h75m-6-5 6 5-6 5'
  },
  michaels: {
    ink: 'M14 22 48 11l34 11v13L48 46 14 35V22Zm0 14v10l34 11 34-11V35M14 47v10l34 11 34-11V46M48 33v35M14 22l34 11 34-11',
    accent: 'M26 27l22-8 22 8M25 43l8 3m-7 8 8 3'
  },
  'education-platform': {
    ink: 'M48 21C36 12 24 12 11 17v38c15-5 26-4 37 4 11-8 22-9 37-4V17c-13-5-25-5-37 4Zm0 0v38M19 25c8-1 14 0 21 4m-21 5c8-1 14 0 21 4m16-9c7-4 13-5 21-4m-21 13c7-4 13-5 21-4',
    accent: 'M21 44c6 0 12 1 18 4m18 0c6-3 12-4 18-4'
  },
  'ecommerce-platform': {
    ink: 'M16 22 48 11l32 11v32L48 66 16 54V22Zm0 0 32 12 32-12M48 34v32M32 17l32 11v12M25 42l14 5m-14 2 14 5',
    accent: 'M72 45v7l-10 4v-7z'
  },
  samsung: {
    ink: 'M31 6h35a5 5 0 0 1 5 5v52a5 5 0 0 1-5 5H31a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5Zm-5 48h45m-45-38h45M45 11h7m-7 50h7',
    accent: 'M10 22h24l12 11h15M10 44h24l12-11m9-6 6 6-6 6'
  },
  minnesota: {
    ink: 'M25 14h46v47H25zM32 22h32v31H32zM14 25h11m-11 12h11m-11 12h11m46-24h11M71 37h11M71 49h11M36 6v8m11-8v8m11-8v8M36 61v8m11-8v8m11-8v8',
    accent: 'm45 30-7 7 7 7m7-14 7 7-7 7'
  },
  lee: {
    ink: 'M32 14h33a22 22 0 0 1 0 44H32a22 22 0 0 1 0-44Zm0 7h33a15 15 0 0 1 0 30H32a15 15 0 0 1 0-30Zm0 7h33a8 8 0 0 1 0 16H32a8 8 0 0 1 0-16Z',
    accent: 'M44 14v14m8-14v14m8-14v14M37 51h21m-5-5 5 5-5 5'
  }
} as const;

type LocalizedText = { zh: string; en: string };

interface ResumeFoldProps {
  id: string;
  mark: keyof typeof marks;
  period: LocalizedText;
  organization: LocalizedText;
  title: LocalizedText;
  children: ReactNode;
}

export default function ResumeFold({
  id,
  mark,
  period,
  organization,
  title,
  children
}: ResumeFoldProps): ReactElement {
  const drawing = marks[mark];
  return (
    <li className="c-resume-leaf">
      <details className="c-resume-fold">
        <summary>
          <span className="c-resume-fold-period">
            <LocalizedSection zhContent={period.zh} enContent={period.en} />
          </span>
          <span className="c-resume-fold-organization">
            <span className="c-resume-fold-sign" aria-hidden="true" />
            <span>
              <LocalizedSection zhContent={organization.zh} enContent={organization.en} />
            </span>
          </span>
          <svg
            className="c-resume-fold-mark"
            viewBox="0 0 96 74"
            aria-hidden="true"
            focusable="false"
          >
            <path d={drawing.ink} />
            <path className="c-resume-fold-accent" d={drawing.accent} />
          </svg>
        </summary>
        <div className="c-resume-fold-body">
          <h3 className="c-resume-fold-detail-title" id={id} tabIndex={-1}>
            <LocalizedSection zhContent={title.zh} enContent={title.en} />
          </h3>
          {children}
        </div>
      </details>
    </li>
  );
}
