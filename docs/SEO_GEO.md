# SEO / GEO 维护说明

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Content Positioning](#content-positioning)
- [Canonical Host](#canonical-host)
- [Sitemap](#sitemap)
- [llms.txt](#llmstxt)
- [Structured Data](#structured-data)
- [Docs SSR](#docs-ssr)
- [Soft 404](#soft-404)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

本文记录当前前端站点面向搜索引擎和生成式搜索系统的公开可发现性约定。目标是让搜索引擎和 AI 清楚识别“张人大 / Renda Zhang 是深圳后端、金融科技、保险平台、云原生、AI 全栈、Java/Spring、AWS/GCP 软件工程师，并于 2026 年 7 月加入金融壹账通担任后端开发高级工程师/TL”，同时避免暴露私密联系信息、聊天内容、表单内容或服务器细节。

Phase 10 的内容定位、可信证明和个人品牌约定见：[内容可信度与个人定位](./CONTENT_CREDIBILITY_POSITIONING.md)。SEO/GEO 文案、结构化数据和 `llms.txt` 必须与该文档确认的公开定位保持一致。

## Content Positioning

- 当前公开定位优先表达为：AI 全栈开发、云原生工程、金融科技/保险平台后端与 TL 经验。
- 主要可信证明优先来自 PersonalWeb、公开证书、工作经历和学习经历。
- 首页、证书页、docs、JSON-LD 和 `llms.txt` 应保持同一实体叙事：先给定位和证据，再给具体栈和经历细节。
- 不把个人网站描述成超出现有事实的商业平台；PersonalWeb 可以作为全栈工程、AI chat、SEO/GEO、部署和运维闭环证明。
- 新增 SEO/GEO 文案时，不添加未公开私人联系方式、客户敏感信息、聊天内容、表单提交内容、token、服务器路径或非公开运维细节。

## Canonical Host

- 公开 canonical host 固定为 `https://www.rendazhang.com`。
- `https://rendazhang.com/*` 应由 Nginx 301 到 `https://www.rendazhang.com/*`。
- `SITE_BASE_URL`、canonical、Open Graph URL、`robots.txt`、`sitemap.xml` 和 `llms.txt` 中的主域名必须保持一致。

## Sitemap

- `public/sitemap.xml` 只放主要职业品牌入口：`/`、`/docs/`、`/certifications/`。
- 每次主要内容、公开认证、技术文档或 SEO metadata 更新后，同步刷新 `lastmod`。
- `/deepseek_chat/` 是交互工具页，不作为主要 SEO 入口主动放入 sitemap；页面仍可通过站内导航访问。

## llms.txt

- `public/llms.txt` 是面向 LLM / AI 摘要系统的公开入口。
- 内容只能使用站点或公开资料已经展示的信息：姓名、职业定位、技能、公开页面、公开 profile 链接。
- 不添加手机号、邮箱、聊天内容、联系表单内容、token、服务器路径、私有配置或非公开身份信息。
- 当首页职业定位、认证页、技术文档页或公开 profile 链接发生变化时，同步更新 `llms.txt`。

## Structured Data

- 结构化数据由 `src/constants/meta.ts` 集中生成，`BaseLayout.astro` 负责输出
  `<script type="application/ld+json">`。
- 首页使用 `Person`、`WebSite`、`ProfilePage`、`BreadcrumbList` 和公开证书节点，定位职业品牌
  landing page。
- `/docs/` 使用 `WebPage` 和 `BreadcrumbList`，并保持文档正文 SSR/SSG 输出，避免 schema 与可见内容脱节。
- `/certifications/` 使用 `CollectionPage`、`ItemList`、`EducationalOccupationalCredential` 和
  `BreadcrumbList`，只描述页面上可见的公开认证信息。
- 结构化数据不得包含手机号、邮箱、联系表单内容、聊天内容、token、服务器路径或非公开身份信息。
- 修改结构化数据时，应同步补充或更新 `src/__tests__/structuredData.test.ts`，至少验证节点类型、canonical URL、公开技能/认证信号，以及敏感信息没有进入 JSON-LD。

## Docs SSR

- `/docs/` 必须在 Astro SSR/SSG 输出中包含 Markdown 正文 HTML，不能只依赖客户端 loader。
- `DocsEffects` 可以继续负责代码高亮、Mermaid、anchor 修正等客户端增强；无 JavaScript 抓取时也应能读到正文。
- 修改技术文档渲染逻辑后，至少检查：

```bash
npm run check
npm run smoke:browser
curl -sS https://www.rendazhang.com/docs/ | rg "Java|Spring|Kubernetes|技术文档|Technical"
```

## Soft 404

- 静态 Astro 站点不应把未知路径 fallback 到首页。
- Nginx `location /` 应优先返回真实静态文件，未知路径返回 404，并由现有 `error_page 404 /404.html` 展示错误页。
- 部署后验证：

```bash
curl -I https://www.rendazhang.com/
curl -I https://www.rendazhang.com/sitemap.xml
curl -I https://www.rendazhang.com/llms.txt
curl -I https://www.rendazhang.com/definitely-not-real
curl -I https://www.rendazhang.com/manifest.webmanifest
```

预期：主页、sitemap 和 `llms.txt` 返回 200；不存在的路径和未提供的 manifest 返回 404。
