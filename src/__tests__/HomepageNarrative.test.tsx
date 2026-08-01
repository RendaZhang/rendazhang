import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HeroSection from '../components/sections/HeroSection';
import HomepageProofPathSection from '../components/sections/HomepageProofPathSection';
import SkillsSection from '../components/sections/SkillsSection';
import { DOCS_PAGE_PATH } from '../constants';
import { ABOUT_CONTENT } from '../content';

describe('homepage narrative components', () => {
  it('keeps the hero centered on Renda and routes its actions accurately', () => {
    const { container } = render(
      <HeroSection
        heroKickerEn={ABOUT_CONTENT.en.heroKicker}
        heroKickerZh={ABOUT_CONTENT.zh.heroKicker}
        heroHeadingEn={ABOUT_CONTENT.en.heroHeading}
        heroHeadingZh={ABOUT_CONTENT.zh.heroHeading}
        heroSummaryEn={ABOUT_CONTENT.en.heroSummary}
        heroSummaryZh={ABOUT_CONTENT.zh.heroSummary}
      />
    );

    expect(container.querySelector('#heroHeading')?.textContent).toContain('Renda Zhang');
    expect(container.querySelector('#heroHeading')?.textContent).toContain('张人大');
    expect(container.querySelector('.c-hero-summary')?.textContent).toContain('PersonalWeb');
    expect(container.querySelectorAll('.c-hero-tag')).toHaveLength(0);

    const primaryAction = container.querySelector('.c-hero-action-primary');
    const secondaryAction = container.querySelector('.c-hero-action-secondary');
    expect(primaryAction?.getAttribute('href')).toBe(DOCS_PAGE_PATH);
    expect(primaryAction?.textContent).toContain('See How I Built PersonalWeb');
    expect(secondaryAction?.getAttribute('href')).toBe('#proof-path');
    expect(secondaryAction?.textContent).toContain('Explore My Work');
  });

  it('renders natural work destinations without redundant intent labels', () => {
    const { container } = render(
      <HomepageProofPathSection
        proofPathEn={ABOUT_CONTENT.en.proofPath}
        proofPathZh={ABOUT_CONTENT.zh.proofPath}
      />
    );

    const links = Array.from(container.querySelectorAll('.c-home-proof-path-link'));
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      ABOUT_CONTENT.en.proofPath.actions.map(({ href }) => href)
    );
    expect(container.querySelector('.c-home-proof-path-link-copy em')).toBeNull();
    expect(container.textContent).toContain('See how I built PersonalWeb');
    expect(container.textContent).toContain('了解我如何构建 PersonalWeb');
  });

  it('presents skill areas without percentage scores', () => {
    const { container } = render(
      <SkillsSection skillsEn={ABOUT_CONTENT.en.skills} skillsZh={ABOUT_CONTENT.zh.skills} />
    );

    expect(container.querySelectorAll('.c-skill-group')).toHaveLength(4);
    expect(container.querySelector('progress')).toBeNull();
    expect(container.textContent).toContain('Backend systems');
    expect(container.textContent).toContain('后端系统');
  });
});
