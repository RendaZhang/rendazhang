import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutContent from '../components/sections/AboutContent';
import SkillsSection from '../components/sections/SkillsSection';

describe('homepage narrative components', () => {
  it('renders roles, results and their sources in the work and education folds', () => {
    const { container } = render(<AboutContent />);
    expect(container.querySelector('#aboutTitle')).toBeNull();
    expect(container.querySelectorAll('details.c-resume-fold')).toHaveLength(8);
    const michaels = container.querySelector('#experience-michaels');
    expect(michaels?.textContent).toContain('多环境部署');
    const fold = michaels?.closest('.c-resume-fold');
    expect(fold?.querySelector(':scope > summary')?.textContent).toContain('后端开发工程师');
    expect(fold?.querySelector('.c-resume-source')?.getAttribute('href')).toMatch(/#L288-L300$/);
    expect(fold?.querySelector('details.c-resume-more:not([open])')).not.toBeNull();
  });

  it('presents skill areas without percentage scores', () => {
    const { container } = render(<SkillsSection />);

    expect(container.querySelectorAll('.c-skill-index .c-skill-tab-link')).toHaveLength(4);
    expect(container.querySelector('a[href="#experience-michaels"]')?.textContent).toContain(
      '云端交付'
    );
    expect(container.querySelector('progress')).toBeNull();
    expect(container.textContent).toContain('Backend systems');
    expect(container.textContent).toContain('后端系统');
  });
});
