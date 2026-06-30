import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';

const AUTH_ME_PATH = '/cloudchat/auth/me';
const CHAT_PAGE_PATH = '/deepseek_chat/';
const THEME_STORAGE_KEY = 'preferred_theme';
const THEME_PALETTE_STORAGE_KEY = 'preferred_palette';

const blockingWarningPatterns = [
  /hydration/i,
  /mismatch/i,
  /server rendered html/i,
  /content security policy/i,
  /refused to execute/i,
  /refused to frame/i,
  /postmessage/i,
  /sentry/i
];

function attachConsoleAudit(page: Page, label: string) {
  const issues: string[] = [];

  const onConsole = (message: ConsoleMessage) => {
    const text = message.text();

    if (message.type() === 'error') {
      issues.push(`${label} console.error: ${text}`);
      return;
    }

    if (
      message.type() === 'warning' &&
      blockingWarningPatterns.some((pattern) => pattern.test(text))
    ) {
      issues.push(`${label} console.warning: ${text}`);
    }
  };

  const onPageError = (error: Error) => {
    issues.push(`${label} pageerror: ${error.message}`);
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  return {
    async assertClean() {
      await page.waitForTimeout(300);
      expect(issues, `${label} should not emit blocking browser console errors`).toEqual([]);
    }
  };
}

async function settlePage(page: Page): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout: 8_000 });
  } catch {
    // Some third-party static assets can keep the page busy; DOM assertions are the gate.
  }
  await page.waitForTimeout(250);
}

async function routeLoggedOutAuthProbe(page: Page): Promise<() => number> {
  let authProbeRequests = 0;

  await page.route(`**${AUTH_ME_PATH}`, async (route) => {
    authProbeRequests += 1;
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Unauthorized' })
    });
  });

  return () => authProbeRequests;
}

test('homepage loads without blocking browser console errors', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'homepage');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', /^(light|dark)$/);
  await expect(page.locator('html')).toHaveAttribute('data-palette', /^(default|aurora|forest)$/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('button', { name: /Open Assistant/i })).toBeVisible();
  await expect(page.locator('.c-about-section')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const aboutTop = document.querySelector('.c-about-section')?.getBoundingClientRect().top;
        return {
          nextSectionVisible: typeof aboutTop === 'number' && aboutTop < window.innerHeight,
          overflowX: document.documentElement.scrollWidth > window.innerWidth
        };
      })
    )
    .toEqual({ nextSectionVisible: true, overflowX: false });
  await settlePage(page);

  expect(authProbeCount(), 'logged-out homepage should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('/deepseek_chat/ loads without hydration mismatch signals', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'deepseek_chat');

  await page.goto(CHAT_PAGE_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.c-chat-wrapper')).toBeVisible();
  await expect(page.locator('.c-message-input')).toBeEnabled();
  await expect(page.locator('.c-chat-widget-toggle')).toHaveCount(0);
  await settlePage(page);

  expect(authProbeCount(), 'logged-out chat page should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('Chat Widget opens a same-origin iframe and reaches ready UI', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'chat widget');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await settlePage(page);
  const toggle = page.getByRole('button', { name: /Open Assistant/i });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(page.getByRole('button', { name: /Close Assistant/i })).toHaveAttribute(
    'aria-expanded',
    'true'
  );

  const frameWrapper = page.locator('.c-chat-widget-frame-wrapper');
  const iframe = page.locator('iframe.c-chat-widget-iframe');
  await expect(frameWrapper).toHaveAttribute('aria-busy', 'true');
  await expect(iframe).toHaveAttribute('src', CHAT_PAGE_PATH);
  expect(new URL((await iframe.getAttribute('src')) ?? '', page.url()).origin).toBe(
    new URL(page.url()).origin
  );

  const chatFrame = page.frameLocator('iframe[title="AI Chat"]');
  await expect(chatFrame.locator('.c-chat-wrapper')).toBeVisible();
  await expect(chatFrame.locator('.c-message-input')).toBeEnabled({ timeout: 30_000 });
  await expect(frameWrapper).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
  await expect(iframe).toHaveClass(/is-loaded/);
  await page.getByRole('button', { name: /Close Assistant/i }).click();
  await expect(frameWrapper).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Open Assistant/i })).toHaveAttribute(
    'aria-expanded',
    'false'
  );
  await settlePage(page);

  expect(authProbeCount(), 'logged-out Chat Widget path should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('theme controls keep DOM state, selected state, and storage coherent', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'theme toggle');

  await page.addInitScript(
    ({ paletteStorageKey, themeStorageKey }) => {
      window.localStorage.setItem(themeStorageKey, JSON.stringify('light'));
      window.localStorage.setItem(paletteStorageKey, JSON.stringify('default'));
    },
    {
      paletteStorageKey: THEME_PALETTE_STORAGE_KEY,
      themeStorageKey: THEME_STORAGE_KEY
    }
  );

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'default');

  const themeButton = page.getByRole('button', { name: /^(Theme|切换主题)$/ });
  await themeButton.click();
  await page.getByRole('button', { name: /^(Switch to Dark Mode|切换到深色模式)$/ }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect
    .poll(async () =>
      page.evaluate((storageKey) => {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? (JSON.parse(raw) as unknown) : null;
      }, THEME_STORAGE_KEY)
    )
    .toBe('dark');

  await themeButton.click();
  await page.getByRole('button', { name: /^(Switch to Forest Palette|切换到森林调色板)$/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
  await expect
    .poll(async () =>
      page.evaluate((storageKey) => {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? (JSON.parse(raw) as unknown) : null;
      }, THEME_PALETTE_STORAGE_KEY)
    )
    .toBe('forest');

  await themeButton.click();
  await expect(
    page.getByRole('button', { name: /^(Switch to Dark Mode|切换到深色模式)$/ })
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('button', { name: /^(Switch to Light Mode|切换到浅色模式)$/ })
  ).toHaveAttribute('aria-pressed', 'false');
  await expect(
    page.getByRole('button', { name: /^(Switch to Forest Palette|切换到森林调色板)$/ })
  ).toHaveAttribute('aria-pressed', 'true');
  await settlePage(page);

  expect(authProbeCount(), 'logged-out theme control path should not probe auth/me').toBe(0);
  await audit.assertClean();
});
