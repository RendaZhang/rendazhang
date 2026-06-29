import { HERO_IMAGE_PATHS } from '../../constants';
import { MAIN_HERO } from '../../data';
import { LocalizedSection, ResponsiveHero, SocialIcons } from '../ui';
import SocialIconsEffects from './SocialIconsEffects';
import type { ReactElement } from 'react';

const WIDTHS = [3840, 2560, 1920, 1280, 1000, 800, 400];

interface HeroSectionProps {
  heroHeadingZh: string;
  heroHeadingEn: string;
  heroTaglinesZh: ReadonlyArray<string>;
  heroTaglinesEn: ReadonlyArray<string>;
}

export default function HeroSection({
  heroHeadingZh,
  heroHeadingEn,
  heroTaglinesZh,
  heroTaglinesEn
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
            <LocalizedSection
              zhContent="后端 · 云原生 · 金融科技"
              enContent="Backend · Cloud · FinTech"
            />
          </p>
          <h1 id="heroHeading">
            <LocalizedSection
              zhContent={<span dangerouslySetInnerHTML={{ __html: heroHeadingZh }} />}
              enContent={<span dangerouslySetInnerHTML={{ __html: heroHeadingEn }} />}
            />
          </h1>
          <div className="c-hero-tags" aria-label="Hero highlights">
            {heroTaglinesZh.slice(0, 4).map((taglineZh, idx) => (
              <span className="c-hero-tag" key={taglineZh}>
                <LocalizedSection zhContent={taglineZh} enContent={heroTaglinesEn[idx]} />
              </span>
            ))}
          </div>
          <div className="c-hero-actions" aria-label="Hero actions">
            <a className="c-hero-action c-hero-action-primary" href="#experience">
              <LocalizedSection zhContent="查看经历" enContent="View Experience" />
            </a>
            <a className="c-hero-action c-hero-action-secondary" href="#contact">
              <LocalizedSection zhContent="联系我" enContent="Contact Me" />
            </a>
          </div>
        </div>
        <a className="c-hero-scroll-cue" href="#aboutTitle" aria-label="Scroll to introduction">
          <LocalizedSection zhContent="继续了解" enContent="Explore" />
        </a>
      </ResponsiveHero>
      <SocialIcons />
      <SocialIconsEffects />
    </>
  );
}
