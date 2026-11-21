import { render, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BlogSection from '../components/sections/BlogSection';
import { CSDN_ARTICLES, MEDIUM_ARTICLES } from '../constants';
import { ABOUT_CONTENT } from '../content';

const { en, zh } = ABOUT_CONTENT;

describe('BlogSection', () => {
  it('links the illustrations and original titles to the correct source, with platform and date', () => {
    const { container } = render(<BlogSection blogEn={en.blog} blogZh={zh.blog} />);

    for (const [entry, language, url] of [
      [en.blog.entries[0], 'en', MEDIUM_ARTICLES.QUANT_TRADING_AI_BOT],
      [zh.blog.entries[0], 'zh', CSDN_ARTICLES.JAVA_21_LOCK]
    ] as const) {
      const article = container.querySelector<HTMLElement>('#article-' + entry.id)!;
      const link = within(article).getByRole('link', { name: entry.title });

      expect(article.classList.contains('is-lang-' + language)).toBe(true);
      expect(within(article).getAllByRole('link')).toHaveLength(1);
      expect(link.getAttribute('href')).toBe(url);
      expect(link.querySelector('.c-blog-art[aria-hidden="true"]')).not.toBeNull();
      expect(within(article).getByText(entry.category)).toBeDefined();
      expect(article.querySelector('time')?.dateTime).toBe(entry.date);
    }
  });

  it('supports adding an article to only one reading without altering the other', () => {
    const extra = {
      id: 'fixture-extra',
      category: 'Example',
      date: '2024-07-02',
      title: 'An extra English article',
      url: 'https://example.com/extra'
    };

    const { container } = render(
      <BlogSection blogEn={{ ...en.blog, entries: [...en.blog.entries, extra] }} blogZh={zh.blog} />
    );

    expect(container.querySelectorAll('article.is-lang-zh')).toHaveLength(1);
    expect(container.querySelectorAll('article.is-lang-en')).toHaveLength(2);
    const extraArticle = container.querySelector<HTMLElement>('#article-fixture-extra')!;
    const link = within(extraArticle).getByRole('link', { name: extra.title });
    expect(link.getAttribute('href')).toBe(extra.url);
    expect(link.querySelector('.c-blog-art')).toBeNull();
  });
});
