import { HERO_IMAGE_PATHS } from '../../constants';
import { MAIN_HERO } from '../../data';
import { LocalizedSection, ResponsiveHero, SocialIcons } from '../ui';
import SocialIconsEffects from './SocialIconsEffects';
import type { ReactElement } from 'react';

const WIDTHS = [3840, 2560, 1920, 1280, 1000, 800, 400];

interface HeroSectionProps {
  heroHeadingZh: string;
  heroHeadingEn: string;
}

export default function HeroSection({
  heroHeadingZh,
  heroHeadingEn
}: HeroSectionProps): ReactElement {
  return (
    <>
      <ResponsiveHero
        imageName="main-hero"
        imageMap={HERO_IMAGE_PATHS}
        imageWidths={WIDTHS}
        imagePlaceholder={MAIN_HERO}
        className="hero"
      >
        <h1 id="heroHeading">
          <LocalizedSection
            zhContent={<span dangerouslySetInnerHTML={{ __html: heroHeadingZh }} />}
            enContent={<span dangerouslySetInnerHTML={{ __html: heroHeadingEn }} />}
          />
        </h1>
      </ResponsiveHero>
      <SocialIcons />
      <SocialIconsEffects />
    </>
  );
}
