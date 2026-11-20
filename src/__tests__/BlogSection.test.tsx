import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BlogSection from '../components/sections/BlogSection';
import { CSDN_ARTICLES, MEDIUM_ARTICLES } from '../constants';
import { ABOUT_CONTENT } from '../content';

describe('BlogSection', () => {
  it('links each language to its original article without scripting', () => {
    const { container } = render(
      <BlogSection blogEn={ABOUT_CONTENT.en.blog} blogZh={ABOUT_CONTENT.zh.blog} />
    );

    expect(container.querySelector('.is-lang-en a')?.getAttribute('href')).toBe(
      MEDIUM_ARTICLES.QUANT_TRADING_AI_BOT
    );
    expect(container.querySelector('.is-lang-zh a')?.getAttribute('href')).toBe(
      CSDN_ARTICLES.JAVA_21_LOCK
    );
  });
});
