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

const ignoredConsolePatterns = [
  // The local static preview has no backend. Tests route auth/me to a safe
  // synthetic user, but keep this guard for browser-level auth probe noise.
  /cloudchat\/auth\/me/i
];

function shouldIgnoreConsoleMessage(text: string): boolean {
  return ignoredConsolePatterns.some((pattern) => pattern.test(text));
}

function attachConsoleAudit(page: Page, label: string) {
  const issues: string[] = [];

  const onConsole = (message: ConsoleMessage) => {
    const text = message.text();
    if (shouldIgnoreConsoleMessage(text)) {
      return;
    }

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

async function routeAuthenticatedAuth(page: Page): Promise<void> {
  await page.route(`**${AUTH_ME_PATH}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        user: {
          id: 1,
          uid: 'smoke-user',
          email: null,
          phone: null,
          display_name: 'Smoke User',
          is_active: true
        }
      })
    });
  });
}

test.beforeEach(async ({ page }) => {
  await routeAuthenticatedAuth(page);
});

test('homepage loads without blocking browser console errors', async ({ page }) => {
  const audit = attachConsoleAudit(page, 'homepage');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', /^(light|dark)$/);
  await expect(page.locator('html')).toHaveAttribute('data-palette', /^(default|aurora|forest)$/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('button', { name: /Open Assistant/i })).toBeVisible();
  await settlePage(page);

  await audit.assertClean();
});

test('/deepseek_chat/ loads without hydration mismatch signals', async ({ page }) => {
  const audit = attachConsoleAudit(page, 'deepseek_chat');

  await page.goto(CHAT_PAGE_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.c-chat-wrapper')).toBeVisible();
  await expect(page.locator('.c-message-input')).toBeEnabled();
  await expect(page.locator('.c-chat-widget-toggle')).toHaveCount(0);
  await settlePage(page);

  await audit.assertClean();
});

test('Chat Widget opens a same-origin iframe and reaches ready UI', async ({ page }) => {
  const audit = attachConsoleAudit(page, 'chat widget');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Open Assistant/i }).click();

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
  await settlePage(page);

  await audit.assertClean();
});

test('theme controls keep DOM state, selected state, and storage coherent', async ({ page }) => {
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

  await audit.assertClean();
});
