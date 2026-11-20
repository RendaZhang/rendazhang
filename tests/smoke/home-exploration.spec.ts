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
    const leeSummary = lee.locator('summary');
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
    await skills.locator('summary').filter({ hasText: '云端交付' }).press('Space');
    await page.getByRole('link', { name: '阅读 Michaels 经历', exact: true }).press('Enter');
    const michaels = foldAt(page, '#experience-michaels');
    await expect(page.locator('#experience-michaels:target')).toBeVisible();
    await expect(michaels).toHaveAttribute('open', '');
    await expect(michaels.getByText(/多环境部署/)).toBeVisible();

    await page.goto('/#skills', { waitUntil: 'domcontentloaded' });
    await skills.locator('summary').filter({ hasText: 'AI 与前端' }).press('Enter');
    await page.getByRole('link', { name: '试玩《请求旅程》', exact: true }).press('Enter');
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
    await samsung.locator('summary').tap();
    await expect(samsung.getByText(/盖乐世社区与盖乐世空间合并期间的反馈模块/)).toBeVisible();

    await page.goto('/#education', { waitUntil: 'domcontentloaded' });
    const lee = foldAt(page, '#education-lee');
    await lee.locator('summary').tap();
    await expect(lee.getByText(/越野跑.*数学辅导/)).toBeVisible();

    await page.goto('/#skills', { waitUntil: 'domcontentloaded' });
    const skills = page.locator('#skills.c-skill-index');
    await skills.locator('summary').filter({ hasText: '云端交付' }).tap();
    await page.getByRole('link', { name: '阅读 Michaels 经历', exact: true }).tap();
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
      page.locator('#resumeLink a:visible'),
      '个人简历_张人大_20250922.pdf'
    );

    const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
    await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
    await page.getByRole('button', { name: '切换语言' }).tap();
    await page.getByRole('button', { name: 'English', exact: true }).tap();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(lee).toHaveAttribute('open', '');
    await expect(lee.getByText(/cross.country.*math tutor/i)).toBeVisible();
    await page.goto('/#article-quant-trading-ai-bot', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#article-quant-trading-ai-bot:target')).toBeInViewport();
    await expect(original).toHaveAttribute('href', articleLinks.en);
    await expect(original).toContainText('Building Your AI Trading Bot from Scratch');
    await expect(article).toContainText('Medium');
    await expect(article.locator('time')).toHaveAttribute('datetime', '2024-03-15');
    await expectResumeDownload(
      page,
      page.locator('#resumeLink a:visible'),
      'Resume_RendaZhang_20250922.pdf'
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    expect(chat).toEqual([]);
  });
});
