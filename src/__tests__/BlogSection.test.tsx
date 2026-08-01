import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BlogSection from '../components/sections/BlogSection';
import { CSDN_ARTICLES, MEDIUM_ARTICLES } from '../constants';
import { ABOUT_CONTENT } from '../content';

describe('BlogSection', () => {
  it('uses the URL owned by the active language', () => {
    const { rerender } = render(
      <BlogSection blogEn={ABOUT_CONTENT.en.blog} blogZh={ABOUT_CONTENT.zh.blog} isZh={false} />
    );

    expect(screen.getByRole('link').getAttribute('href')).toBe(
      MEDIUM_ARTICLES.QUANT_TRADING_AI_BOT
    );

    rerender(
      <BlogSection blogEn={ABOUT_CONTENT.en.blog} blogZh={ABOUT_CONTENT.zh.blog} isZh={true} />
    );

    expect(screen.getByRole('link').getAttribute('href')).toBe(CSDN_ARTICLES.JAVA_21_LOCK);
  });
});
