import { readFile } from 'node:fs/promises';
import {
  expect as baseExpect,
  test,
  type BrowserContext,
  type Locator,
  type Page
} from '@playwright/test';

const expect = baseExpect.configure({ timeout: 45_000 });
const contactDraft = [
  ['你的名字', 'Your Name', 'Browser acceptance'],
  ['你的联系方式', 'Email or Phone', 'letter@example.invalid'],
  ['主题', 'Subject', 'Test letter'],
  ['内容描述', 'Message', 'A simulated message for the contact acceptance check.']
] as const;
const testEmail = 'account@example.invalid';
const testPassword = 'Fictional-test-47';
const simulatedUser = {
  uid: 'simulated-account',
  email: testEmail,
  phone: null,
  display_name: 'Browser acceptance',
  is_active: true
};

test.use({ actionTimeout: 40_000 });

async function visit(page: Page, url: string) {
  return page.goto(url, { waitUntil: 'domcontentloaded' });
}

async function waitForIsland(locator: Locator) {
  const island = locator.locator('xpath=ancestor::astro-island[1]');
  await expect(island).toBeAttached();
  await expect(island).not.toHaveAttribute('ssr', '');
}

async function expectNarrowPage(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => innerWidth === 390 && document.documentElement.scrollWidth <= 390)
    )
    .toBe(true);
}

async function stubAccount(context: BrowserContext) {
  const posts: Array<{ path: string; data: Record<string, string> }> = [];
  const unexpected: string[] = [];
  let signedIn = false;
  await context.route(
    (url) => /^\/(login|register|forgot_password|reset_password)\/?$/.test(url.pathname),
    async (route) => {
      if (route.request().method() !== 'POST') {
        await route.fallback();
        return;
      }
      unexpected.push('native submit ' + new URL(route.request().url()).pathname);
      await route.fulfill({ status: 405 });
    }
  );
  await context.route('**/cloudchat/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace(/^\/cloudchat\//, '');
    if (request.method() === 'GET' && path === 'auth/me') {
      await route.fulfill(
        signedIn
          ? { status: 200, json: { ok: true, user: simulatedUser } }
          : { status: 401, json: { error: 'Unauthorized' } }
      );
      return;
    }

    if (
      request.method() !== 'POST' ||
      !['auth/register', 'auth/password/forgot', 'auth/password/reset', 'auth/login'].includes(path)
    ) {
      unexpected.push(path);
      await route.abort();
      return;
    }
    posts.push({ path, data: request.postDataJSON() as Record<string, string> });
    if (path === 'auth/login') signedIn = true;
    if (path === 'auth/password/reset') {
      await route.fulfill({ status: 400, json: { error: 'Token invalid or expired' } });
    } else {
      await route.fulfill({ status: 200, json: { ok: true } });
    }
  });
  return { posts, unexpected };
}

test('a keyboard-written letter keeps its bilingual draft after failure and is stamped once', async ({
  page,
  context
}) => {
  test.setTimeout(210_000);
  const requests: Record<string, string>[] = [];
  let finishFailure!: () => void;
  const holdFailure = new Promise<void>((resolve) => {
    finishFailure = resolve;
  });
  await context.route('https://formspree.io/**', async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      await route.abort();
      return;
    }
    const attempt = requests.push(
      Object.fromEntries(new URLSearchParams(request.postData() ?? ''))
    );
    if (attempt === 1) await holdFailure;
    await route.fulfill({
      status: attempt === 1 ? 503 : 200,
      headers: { 'access-control-allow-origin': '*' },
      json: { ok: true }
    });
  });

  await visit(page, '/#contact');
  const form = page.locator('#contact .contact-form');
  const heading = page.locator('#contact-title');
  await expect(form).toBeVisible();
  await waitForIsland(form);
  const submit = form.locator('button[type="submit"]');
  await expect(submit).toBeEnabled();
  const nameInput = form.getByRole('textbox', { name: contactDraft[0][0], exact: true });
  const contactInput = form.getByRole('textbox', { name: contactDraft[1][0], exact: true });
  await submit.press('Enter');
  await expect(nameInput).toBeFocused();
  await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('.c-contact-field-error:visible')).toHaveCount(4);
  expect(requests).toEqual([]);
  await heading.focus();
  for (const [zh, , value] of contactDraft) {
    const control = form.getByRole('textbox', { name: zh, exact: true });
    await page.keyboard.press('Tab');
    await expect(control).toBeFocused();
    await expect(control).toHaveCSS('outline-style', 'solid');
    await page.keyboard.insertText(value);
  }

  await contactInput.fill('invalid@');
  await submit.press('Enter');
  await expect(contactInput).toBeFocused();
  await expect(contactInput).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('.c-contact-field-error:visible')).toHaveCount(1);
  expect(requests).toEqual([]);
  await contactInput.fill(contactDraft[1][2]);

  const language = page.getByRole('button', { name: 'Switch to English' });
  await waitForIsland(language);
  await language.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const expectDraft = async () => {
    for (const [, name, value] of contactDraft) {
      await expect(form.getByRole('textbox', { name, exact: true })).toHaveValue(value);
    }
  };
  await expectDraft();

  const stamp = form.locator('.c-contact-stamp');
  try {
    await submit.press('Enter');
    await expect.poll(() => requests.length).toBe(1);
    await expect(submit).toBeDisabled();
    await form.evaluate((element: HTMLFormElement) => element.requestSubmit());
    await expect(stamp).toHaveCount(0);
    expect(requests).toHaveLength(1);
  } finally {
    finishFailure();
  }

  await expect(form.getByRole('alert')).toContainText(/draft|try again/i);
  await expect(stamp).toHaveCount(0);
  await expectDraft();
  await submit.press('Enter');
  await expect(stamp).toHaveCount(1);
  await expect(stamp.getByText('Sent', { exact: true })).toBeVisible();
  await expect(form.getByRole('alert')).toBeEmpty();
  const [name, contact, _subject, message] = contactDraft.map(([, , value]) => value);
  expect(requests).toEqual(Array.from({ length: 2 }, () => ({ name, contact, _subject, message })));

  await page.setViewportSize({ width: 390, height: 844 });
  await expectNarrowPage(page);
  const fieldsFit = await form.getByRole('textbox').evaluateAll((fields) =>
    fields.every((field) => {
      const bounds = field.getBoundingClientRect();
      const letter = field.closest('form')?.getBoundingClientRect();
      return letter && bounds.left >= letter.left && bounds.right <= letter.right;
    })
  );
  expect(fieldsFit).toBe(true);
});

test.describe('account first paint', () => {
  test.use({ javaScriptEnabled: false });

  test('the static recovery form waits for its submit handler', async ({ page }) => {
    test.setTimeout(135_000);
    await visit(page, '/forgot_password/');
    const form = page.getByRole('main').locator('form');
    const submit = form.locator('button[type="submit"]');
    await expect(form.getByRole('textbox', { name: '邮箱', exact: true })).toBeDisabled();
    await expect(submit).toBeDisabled();
    await submit.evaluate((button: HTMLButtonElement) => button.click());
    await expect(page).toHaveURL(/\/forgot_password\/?$/);
    await page
      .getByRole('main')
      .getByRole('link', { name: '返回登录', exact: true })
      .press('Enter');
    await expect(page).toHaveURL(/\/login\/?$/);
  });
});

test.describe('390 px account forms', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
    contextOptions: { reducedMotion: 'reduce' }
  });

  test('register, recover a missing or expired link, and view a simulated profile', async ({
    page,
    context
  }) => {
    test.setTimeout(330_000);
    const { posts, unexpected } = await stubAccount(context);

    await visit(page, '/login/');
    const main = page.getByRole('main');
    const field = (id: string) => main.locator('#' + id);
    const link = (path: string) => main.locator(`a:is([href="${path}"], [href="${path}/"])`);
    const submit = main.locator('button[type="submit"]');
    await expect(field('email')).toHaveAttribute('autocomplete', 'username');
    await expect(field('password')).toHaveAttribute('autocomplete', 'current-password');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true
    );
    await expectNarrowPage(page);

    await link('/register').tap();
    await expect(page).toHaveURL(/\/register\/?$/);
    await expect(field('password')).toHaveAttribute('autocomplete', 'new-password');
    await waitForIsland(submit);
    await field('email').fill(testEmail);
    await field('username').fill(simulatedUser.display_name);
    await field('password').fill(testPassword);
    await field('confirm').fill(testPassword);
    await field('agree').tap();
    await expectNarrowPage(page);
    await submit.tap();
    await expect(page).toHaveURL(/\/login\/?$/);

    await link('/forgot_password').tap();
    await expect(page).toHaveURL(/\/forgot_password\/?$/);
    await waitForIsland(submit);
    await field('email').fill(testEmail);
    await submit.tap();
    await expect(main).toContainText(/已发送|发送了/);
    await expect(link('/login')).toBeVisible();

    await visit(page, '/reset_password/');
    await expect(main).toContainText('链接无效或已过期');
    await expect(main.locator('form')).toHaveCount(0);
    await expectNarrowPage(page);
    await link('/forgot_password').tap();
    await expect(page).toHaveURL(/\/forgot_password\/?$/);

    const fixture = 'synthetic-expired-link';
    await visit(page, '/reset_password/#token=' + fixture);
    await expect(page).toHaveURL(/\/reset_password\/?$/);
    await expect(field('password')).toHaveAttribute('autocomplete', 'new-password');
    await waitForIsland(submit);
    await field('password').fill(testPassword);
    await field('confirm').fill(testPassword);
    await submit.tap();
    await expect(main).toContainText('链接无效或已过期');
    await expect(link('/forgot_password')).toBeVisible();

    await visit(page, '/profile/');
    await expect(page).toHaveURL(/\/login\/?$/);
    await waitForIsland(submit);
    await field('email').fill(testEmail);
    await field('password').fill(testPassword);
    await submit.tap();
    await expect(page).toHaveURL(/\/$/);
    await visit(page, '/profile/');
    const profile = main.locator('dl');
    await expect(profile.locator('dt')).toContainText([
      'UID',
      '邮箱',
      '手机号',
      '显示名称',
      '账号状态'
    ]);
    await expect(
      profile.locator('dd').filter({ hasText: simulatedUser.display_name })
    ).toBeVisible();
    await expect(profile.locator('dd').filter({ hasText: testEmail })).toBeVisible();
    await expectNarrowPage(page);
    expect(unexpected).toEqual([]);
    expect(posts).toEqual([
      {
        path: 'auth/register',
        data: { email: testEmail, password: testPassword, display_name: simulatedUser.display_name }
      },
      { path: 'auth/password/forgot', data: { identifier: testEmail } },
      { path: 'auth/password/reset', data: { token: fixture, password: testPassword } },
      { path: 'auth/login', data: { identifier: testEmail, password: testPassword } }
    ]);
  });
});

test('a missing address returns HTTP 404 and the keyboard leads home', async ({ page }) => {
  test.setTimeout(135_000);
  const response = await visit(page, '/service-pages-acceptance-missing-21-6/');
  expect(response?.status()).toBe(404);
  const main = page.getByRole('main');
  const link = main.getByRole('link', { name: '返回首页', exact: true });
  await expect(main.locator('[data-error-code="404"] .c-error-art')).toBeVisible();
  await expect(link).toHaveAttribute('href', '/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '跳到正文', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/$/);
});

test('local build renders a distinct 500 with a clear way home', async ({ page, baseURL }) => {
  test.skip(
    new URL(baseURL ?? '').hostname !== '127.0.0.1',
    'Validate 500 against the local build'
  );
  const html = await readFile('dist/500.html', 'utf8');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('preferred_lang', JSON.stringify('en')));
  await page.route('**/service-pages-simulated-server-error', (route) =>
    route.fulfill({ status: 500, contentType: 'text/html', body: html })
  );
  const response = await visit(page, '/service-pages-simulated-server-error');
  expect(response?.status()).toBe(500);
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { name: 'Server Error' })).toBeVisible();
  await expect(main.locator('[data-error-code="500"] .c-error-art')).toBeVisible();
  await expect(main).toContainText(/try again later/i);
  await expect(main.getByRole('link')).toHaveCount(1);
  await expect(main.getByRole('link').first()).toHaveAttribute('href', '/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expectNarrowPage(page);
});
