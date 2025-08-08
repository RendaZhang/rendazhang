import type { ABOUT_CONTENT } from '../../content';
import { LocalizedSection } from '../ui';
import type { ReactElement } from 'react';

interface BlogSectionProps {
  blogEn: typeof ABOUT_CONTENT.en.blog;
  blogZh: typeof ABOUT_CONTENT.zh.blog;
}

export default function BlogSection({ blogEn, blogZh }: BlogSectionProps): ReactElement {
  return (
    <section className="blog-section" id="blog">
      <h2 id="blogTitle">
        <LocalizedSection zhContent={blogZh.title} enContent={blogEn.title} />
      </h2>
      <div id="blogList">
        {blogZh.entries.map((entry, idx) => (
          <div className="blog-item mb-4" key={idx}>
            <div className="section-header blog-header">
              <span className="blog-category mr-2">
                <LocalizedSection
                  zhContent={entry.category}
                  enContent={blogEn.entries[idx].category}
                />
              </span>
              <span className="blog-date">
                <LocalizedSection zhContent={entry.date} enContent={blogEn.entries[idx].date} />
              </span>
            </div>
            <h3 className="blog-title">
              <a href={entry.url} target="_blank" rel="noopener noreferrer">
                <LocalizedSection zhContent={entry.title} enContent={blogEn.entries[idx].title} />
              </a>
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
