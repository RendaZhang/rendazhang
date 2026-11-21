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

// The previous public profile is the source for each selected result.
const publishedProfile =
  'https://github.com/RendaZhang/rendazhang/blob/27a4e2c99f3e0ee34c2f4fd3dd175473952f9def/src/content/aboutContent.ts';
const profileLines = {
  oneconnect: { en: '82-L92', zh: '261-L271' },
  fanxin: { en: '95-L106', zh: '274-L285' },
  michaels: { en: '109-L122', zh: '288-L300' },
  'education-platform': { en: '125-L133', zh: '303-L310' },
  'ecommerce-platform': { en: '136-L144', zh: '313-L321' },
  samsung: { en: '147-L157', zh: '324-L335' },
  minnesota: { en: '180-L185', zh: '357-L362' },
  lee: { en: '188-L193', zh: '365-L369' }
} satisfies Record<keyof typeof marks, LocalizedText>;

type LocalizedText = { zh: string; en: string };

interface ResumeFoldProps {
  id: string;
  mark: keyof typeof marks;
  period: LocalizedText;
  organization: LocalizedText;
  title: LocalizedText;
  result: LocalizedText;
  children: ReactNode;
}

export default function ResumeFold({
  id,
  mark,
  period,
  organization,
  title,
  result,
  children
}: ResumeFoldProps): ReactElement {
  const drawing = marks[mark];
  const source = profileLines[mark];
  return (
    <li className="c-resume-leaf">
      <details className="c-resume-fold">
        <summary>
          <span className="c-resume-fold-period">
            <LocalizedSection zhContent={period.zh} enContent={period.en} />
          </span>
          <span className="c-resume-fold-heading">
            <span className="c-resume-fold-organization">
              <LocalizedSection zhContent={organization.zh} enContent={organization.en} />
            </span>
            <span className="c-resume-fold-role">
              <LocalizedSection zhContent={title.zh} enContent={title.en} />
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
          <span className="c-resume-fold-sign" aria-hidden="true" />
        </summary>
        <div className="c-resume-fold-body">
          <p className="c-resume-fold-result" id={id} tabIndex={-1}>
            <LocalizedSection zhContent={result.zh} enContent={result.en} />
          </p>
          <LocalizedSection
            zhContent={
              <a className="c-resume-source" href={`${publishedProfile}#L${source.zh}`}>
                公开履历 <span aria-hidden="true">↗</span>
              </a>
            }
            enContent={
              <a className="c-resume-source" href={`${publishedProfile}#L${source.en}`}>
                Published résumé <span aria-hidden="true">↗</span>
              </a>
            }
          />
          <details className="c-resume-more">
            <summary>
              <LocalizedSection zhContent="更多细节" enContent="More details" />
            </summary>
            <div className="c-resume-more-body">{children}</div>
          </details>
        </div>
      </details>
    </li>
  );
}
