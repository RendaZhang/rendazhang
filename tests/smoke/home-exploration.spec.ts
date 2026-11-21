import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';

const articleLinks = {
  zh: 'https://blog.csdn.net/qq_40286307/article/details/148540386',
  en: 'https://rendazhang.medium.com/quantitative-trading-101-building-your-ai-trading-bot-from-scratch-cb928c834fc1'
};

async function guardChat(page: Page) {
  const requests: string[] = [];
  await page.route(
    (url) => /^\/(?:cloudchat|deepseek_chat)(?:\/|$)/.test(url.pathname),
    async (route) => {
      requests.push(new URL(route.request().url()).pathname);
      await route.abort();
    }
  );
  return requests;
}

function foldAt(page: Page, fragment: string) {
  return page.locator('details.c-resume-fold').filter({ has: page.locator(fragment) });
}

async function expectResumeDownload(page: Page, link: Locator, filename: string) {
  await expect(link).toHaveAttribute('download', filename);
  const [download] = await Promise.all([page.waitForEvent('download'), link.tap()]);
  expect(download.suggestedFilename()).toBe(filename);
  expect(await download.failure()).toBeNull();
  const file = await readFile(await download.path());
  expect(file.subarray(0, 5).toString()).toBe('%PDF-');
  await download.delete();
}

test.describe('home exploration without scripts', () => {
  test.use({ javaScriptEnabled: false });

  test('keyboard opens stories from home fragments and follows related work', async ({ page }) => {
    const chat = await guardChat(page);
    await page.goto('/#education', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#education:target')).toBeVisible();
    await expect(page.locator('#education details.c-resume-fold')).toHaveCount(2);
    const lee = foldAt(page, '#education-lee');
    const leeSummary = lee.locator(':scope > summary');
    await expect(leeSummary).toContainText('李学院');
    await expect(lee).not.toHaveAttribute('open', '');
    await leeSummary.press('Enter');
    await expect(leeSummary).toBeFocused();
    await expect(lee).toHaveAttribute('open', '');
    await expect(lee.getByText(/越野跑.*数学辅导/)).toBeVisible();

    await page.goto('/#experience-samsung', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#experience-samsung:target')).toBeVisible();
    await expect(page.locator('#experience details.c-resume-fold')).toHaveCount(6);
    const samsung = foldAt(page, '#experience-samsung');
    await expect(samsung).toHaveAttribute('open', '');
    await expect(samsung.getByText(/盖乐世社区与盖乐世空间合并期间的反馈模块/)).toBeVisible();

    await page.goto('/#skills', { waitUntil: 'domcontentloaded' });
    const skills = page.locator('#skills.c-skill-index:target');
    await expect(skills).toBeVisible();
    const cloud = skills.getByRole('link', { name: /^云端交付/ });
    await expect(cloud).toHaveAttribute('href', '#experience-michaels');
    await cloud.press('Enter');
    const michaels = foldAt(page, '#experience-michaels');
    await expect(page.locator('#experience-michaels:target')).toBeVisible();
    await expect(michaels).toHaveAttribute('open', '');
    await expect(michaels.locator('.c-resume-fold-result')).toContainText(
      '负责 GCP Kubernetes/Docker 多环境部署、CI/CD 自动化、发布准备、日志、配置、数据预热与数据库迁移。',
      { useInnerText: true }
    );
    await expect(michaels.getByRole('link', { name: '公开履历', exact: true })).toHaveAttribute(
      'href',
      /^https:\/\/github\.com\/RendaZhang\/rendazhang\/blob\/[a-f\d]{40}\/.+#L\d+/
    );
    const more = michaels.locator('details.c-resume-more');
    await expect(more).not.toHaveAttribute('open', '');
    await more.locator('summary').press('Enter');
    await expect(more).toHaveAttribute('open', '');

    await page.goto('/#skills', { waitUntil: 'domcontentloaded' });
    await skills.getByRole('link', { name: '试玩《请求旅程》', exact: true }).press('Enter');
    await expect(page.locator('#showcase:target')).toBeInViewport();
    expect(chat).toEqual([]);
  });
});

test.describe('home exploration at 390 px', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: 'dark',
    contextOptions: { reducedMotion: 'reduce' }
  });

  test('tap opens facts and locale chooses the original article and resume', async ({ page }) => {
    test.setTimeout(120_000);
    const chat = await guardChat(page);
    await page.addInitScript(() => localStorage.setItem('preferred_theme', JSON.stringify('dark')));
    await page.goto('/#experience', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#experience:target')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true
    );

    const samsung = foldAt(page, '#experience-samsung');
    await samsung.locator(':scope > summary').tap();
    await expect(samsung.getByText(/盖乐世社区与盖乐世空间合并期间的反馈模块/)).toBeVisible();

    await page.goto('/#education', { waitUntil: 'domcontentloaded' });
    const lee = foldAt(page, '#education-lee');
    await lee.locator(':scope > summary').tap();
    await expect(lee.getByText(/越野跑.*数学辅导/)).toBeVisible();

    await page.goto('/#skills', { waitUntil: 'domcontentloaded' });
    const skills = page.locator('#skills.c-skill-index');
    const cloud = skills.getByRole('link', { name: /^云端交付/ });
    const cloudSize = await cloud.boundingBox();
    expect(cloudSize?.width).toBeGreaterThanOrEqual(44);
    expect(cloudSize?.height).toBeGreaterThanOrEqual(44);
    await cloud.tap();
    await expect(page.locator('#experience-michaels:target')).toBeInViewport();
    await expect(foldAt(page, '#experience-michaels')).toHaveAttribute('open', '');

    await page.goto('/#blog', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#blog:target')).toBeInViewport();
    await page.goto('/#article-java-21-lock', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#article-java-21-lock:target')).toBeInViewport();
    const article = page.locator('#blog .c-blog-article:visible');
    const original = article.locator('.c-blog-article-link');
    await expect(original).toHaveAttribute('href', articleLinks.zh);
    await expect(original).toContainText('Tomcat 停摆');
    await expect(article).toContainText('CSDN');
    await expect(article.locator('time')).toHaveAttribute('datetime', '2025-06-09');
    await expectResumeDownload(
      page,
      page.getByRole('link', { name: '中文简历', exact: true }),
      '个人简历_张人大_20250922.pdf'
    );

    const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
    await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
    await page.getByRole('button', { name: '切换语言' }).tap();
    await page.getByRole('button', { name: 'English', exact: true }).tap();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(lee).toHaveAttribute('open', '');
    await expect(
      lee.getByText('Ran cross-country and tutored math.', { exact: true })
    ).toBeVisible();

    await page.goto('/#education', { waitUntil: 'domcontentloaded' });
    const minnesota = foldAt(page, '#education-minnesota');
    const summary = minnesota.locator(':scope > summary');
    await expect(minnesota).not.toHaveAttribute('open', '');
    await expect(summary).toContainText('Bachelor of Science in Computer Science', {
      useInnerText: true
    });
    await summary.scrollIntoViewIfNeeded();
    const before = await summary.boundingBox();
    expect(before?.width).toBeGreaterThanOrEqual(44);
    expect(before?.height).toBeGreaterThanOrEqual(44);
    await summary.tap();
    await expect(minnesota).toHaveAttribute('open', '');
    await expect(summary).toBeInViewport({ ratio: 1 });
    await expect(minnesota.locator('.c-resume-fold-result')).toContainText(
      'Graduated with a GPA of 3.79.',
      { useInnerText: true }
    );
    const after = await summary.boundingBox();
    expect(Math.abs((after?.y ?? Infinity) - (before?.y ?? -Infinity))).toBeLessThanOrEqual(2);
    await expect(summary).toContainText('Bachelor of Science in Computer Science', {
      useInnerText: true
    });

    await page.goto('/#article-quant-trading-ai-bot', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#article-quant-trading-ai-bot:target')).toBeInViewport();
    await expect(original).toHaveAttribute('href', articleLinks.en);
    await expect(original).toContainText('Building Your AI Trading Bot from Scratch');
    await expect(article).toContainText('Medium');
    await expect(article.locator('time')).toHaveAttribute('datetime', '2024-03-15');
    await expectResumeDownload(
      page,
      page.getByRole('link', { name: 'English CV', exact: true }),
      'Resume_RendaZhang_20250922.pdf'
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    expect(chat).toEqual([]);
  });
});

const sharedArticles = [
  {
    preference: 'English',
    locale: /^en(?:-|$)/,
    articleId: 'article-java-21-lock',
    originalTitle:
      'Java 21 实战 | 虚拟线程让 Tomcat 停摆 | 我在 Task‑System 中找到了那把“失踪的锁”',
    source: articleLinks.zh,
    preferredArticleId: 'article-quant-trading-ai-bot'
  },
  {
    preference: '中文',
    locale: /^zh(?:-|$)/,
    articleId: 'article-quant-trading-ai-bot',
    originalTitle: 'Quantitative Trading 101: Building Your AI Trading Bot from Scratch',
    source: articleLinks.en,
    preferredArticleId: 'article-java-21-lock'
  }
] as const;

for (const {
  preference,
  locale,
  articleId,
  originalTitle,
  source,
  preferredArticleId
} of sharedArticles) {
  test(`shared article shows its original title before interaction with site language ${preference}`, async ({
    page,
    context
  }) => {
    test.setTimeout(120_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
    await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
    await page.getByRole('button', { name: '切换语言' }).click();
    await page.getByRole('button', { name: preference, exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    const savedPreference = await page.evaluate(() => localStorage.getItem('preferred_lang'));
    expect(savedPreference).not.toBeNull();

    const requestedSources: string[] = [];
    await context.route(source, async (route) => {
      requestedSources.push(route.request().url());
      await route.fulfill({ contentType: 'text/html', body: '<title>Article source</title>' });
    });

    const shared = await context.newPage();
    await shared.goto(`/#${articleId}`, { waitUntil: 'domcontentloaded' });
    const sharedNavbar = shared.locator('astro-island[component-export="NavBarWrapper"]');
    await expect(sharedNavbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
    const html = shared.locator('html');
    await expect(html).toHaveAttribute('lang', locale);

    const article = shared.locator(`#${articleId}:target`);
    const title = article.getByRole('heading', { name: originalTitle, exact: true });
    await expect(title).toBeVisible();
    await expect(title).toBeInViewport({ ratio: 1 });

    const original = article.getByRole('link', { name: originalTitle, exact: true });
    const [popup] = await Promise.all([shared.waitForEvent('popup'), original.click()]);
    try {
      await expect(popup).toHaveURL(source);
      expect(requestedSources).toEqual([source]);
    } finally {
      await popup.close();
    }
    await expect(html).toHaveAttribute('lang', locale);

    await shared.goto('/#blog', { waitUntil: 'domcontentloaded' });
    await expect(shared.locator(`#${articleId}`)).toBeHidden();
    await expect(shared.locator(`#${preferredArticleId}`)).toBeVisible();
    await expect(html).toHaveAttribute('lang', locale);
    expect(await shared.evaluate(() => localStorage.getItem('preferred_lang'))).toBe(
      savedPreference
    );
  });
}
