import { expect, test } from '@playwright/test';

test.describe('skip to main content without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const [path, firstControl] of [
    ['/', '.c-home-resumes a'],
    ['/docs/', '.c-docs-route-switch input:checked']
  ]) {
    test(`starts in the main content on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const skip = page.getByRole('link', { name: '跳到正文', exact: true });
      const main = page.getByRole('main');
      await expect(skip).toHaveCSS('clip-path', 'inset(50%)');
      await page.keyboard.press('Tab');
      await expect(skip).toBeFocused();
      await expect(skip).toHaveCSS('clip-path', 'none');
      await expect(skip).toBeInViewport({ ratio: 1 });
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#main-content$/);
      await expect(main).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(main.locator(firstControl).first()).toBeFocused();
    });
  }
});

test('visible contact labels preserve all four values across languages at 390px', async ({
  page
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  const submissions: string[] = [];
  await page.route('https://formspree.io/**', async (route) => {
    submissions.push(route.request().method());
    await route.abort();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const form = page.locator('.contact-form');
  const language = page.getByRole('button', { name: 'Switch to English' });
  await form.scrollIntoViewIfNeeded();
  for (const locator of [form, language]) {
    const island = locator.locator('xpath=ancestor::astro-island[1]');
    await expect(island).toBeAttached();
    await expect(island).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
  }

  const fields = [
    ['你的名字', 'Your Name', 'Example'],
    ['你的联系方式', 'Email or Phone', 'example@example.invalid'],
    ['主题', 'Subject', 'Test subject'],
    ['内容描述', 'Message', 'Test draft']
  ];
  for (const [zh, , value] of fields) {
    const label = form.locator('label').filter({ hasText: zh });
    const control = form.getByRole('textbox', { name: zh, exact: true });
    await label.click();
    await expect(control).toBeFocused();
    await control.fill(value);
    await expect(label).toBeVisible();
  }

  await language.click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  for (const [, en, value] of fields) {
    const label = form.locator('label').filter({ hasText: en });
    const control = form.getByRole('textbox', { name: en, exact: true });
    await expect(label).toBeVisible();
    await expect(control).toHaveValue(value);
  }
  await page.locator('.c-skip-link').focus();
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  expect(submissions).toEqual([]);
});
