import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SocialIcons from '../components/ui/data-display/SocialIcons';

describe('SocialIcons', () => {
  it('hides wechat modal by default', () => {
    render(<SocialIcons />);
    const modal = document.getElementById('wechatModal');
    expect(modal?.classList.contains('u-d-none')).toBe(true);
  });
});
