import { describe, expect, it } from 'vitest';

import { NAV_CONTENT, getNavigationItems, getPrimaryNavigationItems } from '../content/navContent';

describe('navigation content', () => {
  it('uses one shared route order for public and authenticated navigation', () => {
    const publicItems = getNavigationItems(false);
    const authenticatedItems = getNavigationItems(true);

    expect(publicItems.map(({ key, href }) => [key, href])).toEqual([
      ['home', '/'],
      ['chat', '/deepseek_chat'],
      ['certs', '/certifications'],
      ['docs', '/docs']
    ]);
    expect(authenticatedItems.at(-1)).toMatchObject({ key: 'profile', href: '/profile' });
    expect(NAV_CONTENT.en.drawer[publicItems[1].key]).toBe('AI Chat');
    expect(NAV_CONTENT.zh.drawer[publicItems[1].key]).toBe('AI 聊天');
  });

  it('keeps Home in the drawer but omits the duplicate desktop Home link', () => {
    const publicPrimaryItems = getPrimaryNavigationItems(false);
    const authenticatedPrimaryItems = getPrimaryNavigationItems(true);

    expect(publicPrimaryItems.map((item) => item.key)).toEqual(['chat', 'certs', 'docs']);
    expect(authenticatedPrimaryItems.map((item) => item.key)).toEqual([
      'chat',
      'certs',
      'docs',
      'profile'
    ]);
    expect(getNavigationItems(false).map((item) => item.key)).toContain('home');
    expect(publicPrimaryItems.map((item) => NAV_CONTENT.en.drawer[item.key])).not.toContain('Home');
    expect(publicPrimaryItems.map((item) => NAV_CONTENT.zh.drawer[item.key])).not.toContain('首页');
  });
});
