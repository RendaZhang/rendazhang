import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

test('exact artifact is usable at the explicit origin without paid Chat calls', async ({
  page,
  context
}, testInfo) => {
  const origin = process.env.RELEASE_ORIGIN!;
  const expected = JSON.parse(
    readFileSync(join(process.env.RELEASE_BUNDLE!, 'identity.json'), 'utf8')
  );
  const issues: string[] = [];
  let chatCalls = 0;
  page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (
      message.type() === 'error' ||
      (message.type() === 'warning' &&
        /hydration|mismatch|content security policy|refused to|postmessage/i.test(message.text()))
    ) {
      issues.push(`console.${message.type()}: ${message.text()}`);
    }
  });
  page.on('response', (response) => {
    if (new URL(response.url()).origin === origin && response.status() >= 400) {
      issues.push(`same-origin HTTP ${response.status()}: ${new URL(response.url()).pathname}`);
    }
  });
  page.on('requestfailed', (request) => {
    if (
      new URL(request.url()).origin === origin &&
      request.failure()?.errorText !== 'net::ERR_ABORTED'
    ) {
      issues.push(`same-origin request failed: ${new URL(request.url()).pathname}`);
    }
  });
  await context.route('**/cloudchat/**', async (route) => {
    if (route.request().method() !== 'GET') {
      chatCalls += 1;
      await route.abort();
    } else {
      await route.continue();
    }
  });
  await context.addInitScript(() => {
    localStorage.setItem('preferred_theme', JSON.stringify('light'));
  });
  const marker = await context.request.get(
    `${origin}/release-identity.json?browser_acceptance=${Date.now()}`,
    {
      headers: { 'Cache-Control': 'no-cache, no-store' },
      timeout: 10_000
    }
  );
  expect(marker.status()).toBe(200);
  expect(await marker.json()).toEqual(expected);
  const go = async (path: string) => {
    await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' });
    expect(new URL(page.url()).origin).toBe(origin);
  };
  const noOverflow = async () => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  };

  await go('/');
  await expect(page.locator('#heroHeading')).toBeVisible();
  await expect(page.locator('astro-island[component-export="NavBarWrapper"]')).not.toHaveAttribute(
    'ssr',
    ''
  );
  await page.getByRole('button', { name: /^(Theme|切换主题)$/ }).click();
  await page.getByRole('button', { name: /^(Switch to Dark Mode|切换到深色模式)$/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await noOverflow();
  await page.screenshot({ path: testInfo.outputPath('desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  const hamburger = page.locator('.c-hamburger-btn');
  await hamburger.click();
  await expect(page.locator('.c-side-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.c-side-menu')).toHaveCount(0);
  await expect(hamburger).toBeFocused();
  await noOverflow();
  await page.screenshot({ path: testInfo.outputPath('mobile.png') });
  await page.getByRole('button', { name: /Open Assistant/i }).click();
  const frame = page.locator('iframe.c-chat-widget-iframe');
  await expect(frame).toHaveAttribute('src', '/deepseek_chat/');
  await expect(
    page.frameLocator('iframe[title="AI Chat"]').locator('.c-message-input')
  ).toBeEnabled();
  await expect(page.locator('.c-chat-widget-frame-wrapper')).toHaveAttribute('aria-busy', 'false');
  await page.getByRole('button', { name: /Close Assistant/i }).click();
  await expect(frame).toHaveCount(0);

  await go('/docs/');
  await expect(
    page.locator('#content-zh .language-mermaid[data-processed="true"] svg')
  ).toHaveCount(2);
  await page.getByRole('button', { name: '切换语言' }).click();
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('#content-en')).toBeVisible();
  await expect(
    page.locator('#content-en .language-mermaid[data-processed="true"] svg')
  ).toHaveCount(2);
  await page.getByRole('button', { name: 'Change language' }).click();
  await page.getByRole('button', { name: '中文' }).click();
  await expect(
    page.locator('#content-zh .language-mermaid[data-processed="true"] svg')
  ).toHaveCount(2);
  await noOverflow();
  await go('/deepseek_chat/');
  await expect(page.locator('.c-message-input')).toBeEnabled();
  await expect(page.locator('.c-chat-widget-toggle')).toHaveCount(0);
  await noOverflow();
  await go('/certifications/');
  const badge = page.locator('iframe[src^="https://www.credly.com/"]');
  await expect(badge).toBeVisible();
  expect(await badge.getAttribute('src')).toMatch(/^https:\/\/www\.credly\.com\/embedded_badge\//);
  await expect
    .poll(() =>
      page
        .frames()
        .some((frame) => frame.url().startsWith('https://www.credly.com/embedded_badge/'))
    )
    .toBe(true);
  await noOverflow();
  expect(chatCalls, 'no paid model or mutating backend request is permitted').toBe(0);
  expect(issues, 'browser failures remain blocking evidence').toEqual([]);
});
