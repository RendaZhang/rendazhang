import type { ReactElement } from 'react';
import type { ArticleEntry } from '../../content/aboutContent';
import LocalizedSection from '../ui/data-display/LocalizedSection';

interface ArticleCollection {
  readonly title: string;
  readonly entries: ReadonlyArray<ArticleEntry>;
}

interface BlogSectionProps {
  blogEn: ArticleCollection;
  blogZh: ArticleCollection;
}

function ThreadLockIllustration(): ReactElement {
  return (
    <svg className="c-blog-art" viewBox="0 0 280 164" aria-hidden="true" focusable="false">
      <path className="c-blog-art-grid" d="M16 28h248M16 136h248M140 16v132M24 52v60m232-60v60" />
      <path d="M36 55h46l20 16h7M244 109h-46l-20-16h-7" />
      <path d="M97 67l6 4-1-7m81 33-6-4 1 7M109 63v16m62 6v16" />
      <path className="c-blog-art-accent" d="M36 61h44l17 14m147 28h-44l-17-14" />
      <path d="M126 72V56a14 14 0 0 1 28 0v16m-22-1V56a8 8 0 0 1 16 0v15" />
      <rect className="c-blog-art-paper" x="116" y="71" width="48" height="39" rx="3" />
      <path className="c-blog-art-accent" d="M119 106h42m-39-31 4-4m30 39 4-4m-38 0 4-4" />
      <path d="M137 90a3 3 0 1 1 6 0c0 1.3-.6 2.3-1.6 2.8v5.7h-2.8v-5.7A3 3 0 0 1 137 90Z" />
      <circle className="c-blog-art-paper" cx="31" cy="58" r="5" />
      <circle className="c-blog-art-paper" cx="249" cy="106" r="5" />
      <path className="c-blog-art-grid" d="M42 38h19m-19 4h9m168 83h19m-9-4h9" />
    </svg>
  );
}

function TradingBotIllustration(): ReactElement {
  return (
    <svg className="c-blog-art" viewBox="0 0 280 164" aria-hidden="true" focusable="false">
      <path
        className="c-blog-art-grid"
        d="M24 26h232M24 47h232M24 68h232M24 89h232M24 110h232M24 131h232M44 23v108m27-108v108m27-108v108m27-108v108m27-108v108m27-108v108m27-108v108m27-108v108"
      />
      <path d="M24 26v105h232m-212 0v5m27-5v5m27-5v5m81-5v5m27-5v5m27-5v5" />
      <path
        className="c-blog-art-accent"
        d="m33 111 24-14 15 3 22-25 19 7 25-21 20 9 24-18 16 6 46-29"
      />
      <path d="M44 111v-15m27-3V78m27 18V60m81-4V37m27 29V38m27 14V23" />
      <path
        className="c-blog-art-paper"
        d="M40 100h8v8h-8zm27-19h8v9h-8zm27-10h8v17h-8zm81-28h8v8h-8zm27 2h8v14h-8zm27-15h8v14h-8z"
      />
      <path d="M141 76v6m-31 12h-5v13h5m62-13h5v13h-5" />
      <rect className="c-blog-art-paper" x="110" y="82" width="62" height="36" rx="5" />
      <path className="c-blog-art-accent" d="M130 109h22" />
      <circle className="c-blog-art-paper" cx="141" cy="73" r="3" />
      <circle cx="127" cy="97" r="3" />
      <circle cx="155" cy="97" r="3" />
    </svg>
  );
}

const illustrations = {
  'thread-lock': ThreadLockIllustration,
  'trading-bot': TradingBotIllustration
};

function ArticlePage({
  entry,
  language
}: {
  entry: ArticleEntry;
  language: 'en' | 'zh';
}): ReactElement {
  const id = `article-${entry.id}`;
  const Illustration = entry.illustration ? illustrations[entry.illustration] : null;

  return (
    <article className={`c-blog-article is-lang-${language}`} id={id} lang={language}>
      <a
        className="c-blog-article-link"
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-labelledby={`${id}-title`}
      >
        {Illustration && <Illustration />}
        <header className="c-blog-article-copy">
          <div className="c-blog-article-heading">
            <h3 className="c-blog-article-title" id={`${id}-title`}>
              {entry.title}
            </h3>
            <svg
              className="c-blog-article-arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M13 5h6v6m0-6-8 8m-2-7H5v13h13v-4" />
            </svg>
          </div>
          <p className="c-blog-article-meta">
            <span>{entry.category}</span>
            <time dateTime={entry.date}>{entry.date}</time>
          </p>
        </header>
      </a>
    </article>
  );
}

export default function BlogSection({ blogEn, blogZh }: BlogSectionProps): ReactElement {
  return (
    <section className="c-blog-section" id="blog">
      <h2 id="blogTitle">
        <LocalizedSection zhContent={blogZh.title} enContent={blogEn.title} />
      </h2>
      <div className="c-blog-entries" id="blogList">
        {blogZh.entries.map((entry) => (
          <ArticlePage entry={entry} language="zh" key={entry.id} />
        ))}
        {blogEn.entries.map((entry) => (
          <ArticlePage entry={entry} language="en" key={entry.id} />
        ))}
      </div>
    </section>
  );
}
