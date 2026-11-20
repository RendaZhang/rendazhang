import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BioSection from '../components/sections/BioSection';
import SkillsSection from '../components/sections/SkillsSection';
import { IMAGE_PATHS, RESUME_EN_DOWNLOAD, RESUME_ZH_DOWNLOAD } from '../constants';
import { ABOUT_CONTENT } from '../content';

describe('homepage narrative components', () => {
  it('keeps the corresponding resume downloads and contact link readable without scripting', () => {
    const { container } = render(
      <BioSection contentEn={ABOUT_CONTENT.en} contentZh={ABOUT_CONTENT.zh} />
    );

    const resumeEn = container.querySelector('#resumeLink .is-lang-en a');
    const resumeZh = container.querySelector('#resumeLink .is-lang-zh a');
    expect(resumeEn?.getAttribute('href')).toBe(IMAGE_PATHS.RESUME_EN);
    expect(resumeEn?.getAttribute('download')).toBe(RESUME_EN_DOWNLOAD);
    expect(resumeZh?.getAttribute('href')).toBe(IMAGE_PATHS.RESUME_ZH);
    expect(resumeZh?.getAttribute('download')).toBe(RESUME_ZH_DOWNLOAD);
    expect(container.querySelector('#contactBtn')?.getAttribute('href')).toBe('#contact');
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
