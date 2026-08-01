import { DOCS_PAGE_PATH, HERO_IMAGE_PATHS } from '../../constants';
import { MAIN_HERO } from '../../data';
import { LocalizedSection, ResponsiveHero, SocialIcons } from '../ui';
import SocialIconsEffects from './SocialIconsEffects';
import type { ReactElement } from 'react';

const WIDTHS = [3840, 2560, 1920, 1280, 1000, 800, 400];

interface HeroSectionProps {
  heroKickerZh: string;
  heroKickerEn: string;
  heroHeadingZh: string;
  heroHeadingEn: string;
  heroSummaryZh: string;
  heroSummaryEn: string;
}

export default function HeroSection({
  heroKickerZh,
  heroKickerEn,
  heroHeadingZh,
  heroHeadingEn,
  heroSummaryZh,
  heroSummaryEn
}: HeroSectionProps): ReactElement {
  return (
    <>
      <ResponsiveHero
        imageName="main-hero"
        imageMap={HERO_IMAGE_PATHS}
        imageWidths={WIDTHS}
        imagePlaceholder={MAIN_HERO}
        className="c-hero"
      >
        <div className="c-hero-copy">
          <p className="c-hero-kicker">
            <LocalizedSection zhContent={heroKickerZh} enContent={heroKickerEn} />
          </p>
          <h1 id="heroHeading">
            <LocalizedSection zhContent={heroHeadingZh} enContent={heroHeadingEn} />
          </h1>
          <p className="c-hero-summary">
            <LocalizedSection zhContent={heroSummaryZh} enContent={heroSummaryEn} />
          </p>
          <div className="c-hero-actions" aria-label="Hero actions">
            <a className="c-hero-action c-hero-action-primary" href={DOCS_PAGE_PATH}>
              <LocalizedSection
                zhContent="了解我如何构建 PersonalWeb"
                enContent="See How I Built PersonalWeb"
              />
            </a>
            <a className="c-hero-action c-hero-action-secondary" href="#proof-path">
              <LocalizedSection zhContent="了解我的工作" enContent="Explore My Work" />
            </a>
          </div>
        </div>
        <a
          className="c-hero-scroll-cue"
          href="#aboutTitle"
          aria-label="Jump to Renda's introduction"
        >
          <LocalizedSection zhContent="关于我" enContent="About Me" />
        </a>
      </ResponsiveHero>
      <SocialIcons />
      <SocialIconsEffects />
    </>
  );
}
