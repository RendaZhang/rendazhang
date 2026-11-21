import { expect, test, type BrowserContext, type Locator, type Page } from '@playwright/test';

const certPath = '/certifications/';
const docsPath = '/docs/';
const certQuestion = 'Renda 的 AWS 认证涵盖什么？';
const projectQuestion = 'Renda 在 PersonalWeb 里做了什么？';
const englishProjectQuestion = 'What did Renda build in PersonalWeb?';
const mockReply = 'Simulated answer for browser acceptance.';
const awsVerification = 'https://aws.amazon.com/verification';
const credlyVerification =
  'https://www.credly.com/badges/8a7e15fc-374b-4335-a86e-e30e5255836d/public_url';

test.use({ actionTimeout: 20_000 });

async function mockChat(context: BrowserContext) {
  const messages: Array<Record<string, unknown>> = [];
  const unexpected: string[] = [];
  await context.route('**/cloudchat/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (/\/deepseek_chat\/?$/.test(path) && request.method() === 'POST') {
      messages.push(request.postDataJSON() as Record<string, unknown>);
      await route.fulfill({
        status: 200,
        contentType: 'application/x-ndjson',
        body: JSON.stringify({ text: mockReply }) + '\n'
      });
    } else {
      unexpected.push(`${request.method()} ${path}`);
      await route.abort();
    }
  });
  return { messages, unexpected };
}

async function useLanguage(page: Page, option: '中文' | 'English') {
  const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
  await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
  await page.locator('.c-language-selector-main').click();
  await page.getByRole('button', { name: option, exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', option === '中文' ? /^zh/ : /^en/);
}

async function visit(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}

async function openCertificateNote(page: Page, touch = false) {
  const summary = page.locator('#cert-coverage > summary');
  if (touch) await summary.tap();
  else await summary.press('Enter');
  await expect(page.locator('#cert-coverage')).toHaveAttribute('open', '');
  return page.locator('#cert-coverage');
}

async function clickVerification(context: BrowserContext, link: Locator, destination: string) {
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', destination);
  const request = context.waitForEvent('request', {
    predicate: (request) => request.isNavigationRequest() && request.url() === destination,
    timeout: 40_000
  });
  await link.press('Enter');
  expect((await request).url()).toBe(destination);
}

async function expectArchitectureHeading(page: Page, locale: 'zh' | 'en') {
  const heading = page.locator(locale === 'zh' ? '#zh-参考架构' : '#en-reference-architecture');
  await expect(heading).toBeVisible();
  await expect(heading).toBeInViewport({ ratio: 1 });
}

async function chooseRoute(page: Page, name: string, touch = false) {
  const radio = page.getByRole('radio', { name, exact: true });
  if (touch) {
    const id = await radio.getAttribute('id');
    await page.locator(`label[for="${id}"]`).tap();
  } else {
    await radio.press('Space');
  }
  await expect(radio).toBeChecked();
}

function routeInk(page: Page) {
  return page.locator('.c-docs-route-node, .c-docs-node-connector').evaluateAll((segments) =>
    segments.map((segment) => {
      const style = getComputedStyle(segment);
      return [style.display, style.borderColor, style.color, style.boxShadow];
    })
  );
}

async function selectFlask(page: Page, touch = false) {
  const node = page.locator('details[data-docs-node="flask"]');
  const opener = node.locator('summary');
  const chapter = node.getByRole('link', { name: /后端实现|Backend implementation/ });
  await expect(chapter).toBeHidden();
  if (touch) await opener.tap();
  else await opener.press('Enter');
  await expect(node).toHaveAttribute('open', '');
  await expect(chapter).toBeVisible();
  return node;
}

async function followSameSiteSource(page: Page, target: RegExp, touch = false) {
  const hint = page.locator('.c-chat-source-hint-link[href]').filter({ visible: true });
  const findRelevant = () =>
    hint.evaluateAll(
      (links, pattern) =>
        links.findIndex((link) => new RegExp(pattern).test(link.getAttribute('href') ?? '')),
      target.source
    );
  await expect.poll(findRelevant).toBeGreaterThanOrEqual(0);
  const relevant = await findRelevant();
  const [opened] = await Promise.all([
    page.waitForEvent('popup'),
    touch ? hint.nth(relevant).tap() : hint.nth(relevant).click()
  ]);
  await expect(opened).toHaveURL(target);
  return opened;
}

test('certificate verification and both architecture links work from the keyboard', async ({
  page,
  context,
  baseURL
}) => {
  test.setTimeout(140_000);
  if (new URL(baseURL ?? '').hostname !== 'www.rendazhang.com') {
    for (const dest of [credlyVerification, awsVerification]) {
      await context.route(dest, (route) =>
        route.fulfill({ body: 'Public verification destination' })
      );
    }
  }
  const chat = await mockChat(context);
  await visit(page, certPath);
  await expect(page.locator('#aws-saa-c03 h1')).toContainText(/SAA-C03/);
  const badge = page.locator('#aws-saa-c03 img.c-cert-badge-image');
  await expect(badge).toBeVisible();
  await expect
    .poll(() =>
      badge.evaluate((image: HTMLImageElement) => ({
        width: image.naturalWidth,
        height: image.naturalHeight
      }))
    )
    .toEqual({ width: 500, height: 500 });
  await expect(page.locator('#aws-saa-c03 iframe')).toHaveCount(0);
  await expect(page.locator('#aws-saa-c03 time[datetime="2025-06-16"]')).toBeVisible();
  await expect(page.locator('#aws-saa-c03 time[datetime="2028-06-16"]')).toBeVisible();
  const credly = page.locator(`a.c-verify-btn[href="${credlyVerification}"]`);
  const aws = page.locator(`a.c-verify-btn[href="${awsVerification}"]`);
  await clickVerification(context, credly, credlyVerification);
  await clickVerification(context, aws, awsVerification);

  const note = await openCertificateNote(page);
  for (const topic of ['可用性', '故障隔离', '成本']) await expect(note).toContainText(topic);
  const chinese = note.locator('a:visible[href*="#zh-"]');
  const zhLink = await chinese.getAttribute('href');
  expect(decodeURIComponent(zhLink ?? '')).toBe('/docs/#zh-参考架构');
  await chinese.press('Enter');
  await expectArchitectureHeading(page, 'zh');

  const zhTab = await context.newPage();
  await visit(zhTab, zhLink!);
  await expectArchitectureHeading(zhTab, 'zh');
  await zhTab.close();

  const opening = page.getByRole('radio', { name: '打开页面', exact: true });
  await expect(opening).toBeChecked();
  const staticInk = await routeInk(page);
  expect(staticInk.length).toBeGreaterThan(0);
  await chooseRoute(page, '发送问题');
  await expect.poll(() => routeInk(page)).not.toEqual(staticInk);
  const flask = await selectFlask(page);
  const section = flask.locator('a[href^="#zh-"]:visible').first();
  await expect(section).toBeVisible();
  await section.press('Enter');
  await expect(page.locator(':target')).toBeInViewport({ ratio: 1 });

  const nginx = page.locator('details[data-docs-node="nginx"]');
  await nginx.locator('summary').press('Enter');
  await nginx.locator('a[href="/certifications/"]').press('Enter');
  await expect(page).toHaveURL(/\/certifications\/$/);
  await useLanguage(page, 'English');
  const english = (await openCertificateNote(page)).locator('a:visible[href*="#en-"]');
  const enLink = await english.getAttribute('href');
  expect(enLink).toBe('/docs/#en-reference-architecture');
  const enTab = await context.newPage();
  await visit(enTab, enLink!);
  await expectArchitectureHeading(enTab, 'en');
  await enTab.close();
  expect(chat.messages).toEqual([]);
  expect(chat.unexpected).toEqual([]);
});

test('Docs routes and original contents remain visible when the diagram fails', async ({
  page
}) => {
  test.setTimeout(80_000);
  const failedAssets: string[] = [];
  await page.route(/\/_astro\/(?:flowDiagram-|mermaid\.core\.)[^/]+\.js$/, async (route) => {
    failedAssets.push(route.request().url());
    await route.abort();
  });
  await visit(page, docsPath);
  await expect.poll(() => failedAssets.length, { timeout: 30_000 }).toBeGreaterThan(0);
  await expect(page.locator('#content-zh')).toBeVisible();
  await expect(
    page.locator('#content-zh').getByRole('link', { name: '参考架构', exact: true }).first()
  ).toBeVisible();
  await expect(page.locator('#zh-参考架构')).toBeVisible();
  await expect(page.locator('#content-zh code.language-mermaid').first()).toContainText(
    /graph|flowchart/i
  );
  await expect(page.locator('.c-docs-plate')).toContainText('静态');
  await chooseRoute(page, '发送问题');
  const flask = await selectFlask(page);
  await expect(flask.locator('a[href^="#zh-"]:visible').first()).toBeVisible();
  await expect(flask.locator('.c-docs-node-note')).toContainText('Flask 校验消息');
});

test('Chat previews from both routes stay quiet until an explicit send', async ({
  page,
  context
}) => {
  test.setTimeout(140_000);
  const chat = await mockChat(context);
  await visit(page, certPath);
  const note = await openCertificateNote(page);
  await note.locator('a[href="/deepseek_chat/?preset=certification_context"]').click();
  const draft = page.locator('.c-message-input');
  await expect(draft).toHaveValue(certQuestion);
  await expect(page).toHaveURL(/\?preset=certification_context$/);
  await page.locator('[data-preset-id="personalweb_proof"]').click();
  await expect(draft).toHaveValue(projectQuestion);
  await page.goBack();
  await expect(draft).toHaveValue(certQuestion);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(draft).toHaveValue(certQuestion);
  await draft.evaluate((input) => {
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
        isComposing: true
      })
    );
    input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
    const candidate = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    });
    Object.defineProperty(candidate, 'keyCode', { value: 229 });
    input.dispatchEvent(candidate);
  });
  expect(chat.messages).toEqual([]);
  await page.locator('#send-btn').click();
  await expect(page.locator('.c-ai-message').last()).toContainText(mockReply);
  expect(chat.messages).toEqual([
    {
      message: certQuestion,
      guideMode: 'public_site',
      presetId: 'certification_context',
      locale: 'zh'
    }
  ]);
  await (await followSameSiteSource(page, /\/certifications\/?$/)).close();

  await visit(page, docsPath);
  await chooseRoute(page, '发送问题');
  const flask = await selectFlask(page);
  await flask.locator('a[href="/deepseek_chat/?preset=personalweb_proof"]').click();
  await expect(draft).toHaveValue(projectQuestion);
  expect(chat.messages).toHaveLength(1);
  await draft.press('End');
  await draft.press('Shift+Enter');
  await expect(draft).toHaveValue(/\n/);
  expect(chat.messages).toHaveLength(1);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(draft).toHaveValue(projectQuestion);
  await page.locator('#send-btn').click();
  await expect.poll(() => chat.messages.length).toBe(2);
  expect(chat.messages[1]).toEqual({
    message: projectQuestion,
    guideMode: 'public_site',
    presetId: 'personalweb_proof',
    locale: 'zh'
  });
  await (await followSameSiteSource(page, /\/docs\/?$/)).close();

  await page.locator('[data-preset-id="certification_context"]').click();
  await expect(draft).toHaveValue(certQuestion);
  await page.locator('#reset-btn').click();
  await expect(page.getByRole('dialog')).toContainText('确定要重置会话吗？');
  await page.getByRole('button', { name: '取消', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(draft).toHaveValue(certQuestion);
  await draft.fill('我想看看静态页面怎样发布。');
  expect(chat.messages).toHaveLength(2);
  await page.locator('#send-btn').click();
  await expect.poll(() => chat.messages.length).toBe(3);
  expect(chat.messages[2]).toEqual({ message: '我想看看静态页面怎样发布。' });
  expect(chat.unexpected).toEqual([]);
});

test('home Chat Widget shares preview and explicit send and restores launcher focus', async ({
  page,
  context
}) => {
  test.setTimeout(100_000);
  const chat = await mockChat(context);
  await visit(page, '/');
  const launcher = page.getByRole('button', { name: '打开聊天', exact: true });
  await launcher.press('Enter');
  const frame = page.frameLocator('iframe[title="AI Chat"]');
  await expect(page.locator('.c-chat-widget-frame-wrapper')).toHaveAttribute('aria-busy', 'false', {
    timeout: 40_000
  });
  const preset = frame.locator('[data-preset-id="certification_context"]');
  await preset.click();
  await expect(frame.locator('.c-message-input')).toHaveValue(certQuestion);
  expect(chat.messages).toHaveLength(0);
  await frame.locator('#send-btn').click();
  await expect(frame.locator('.c-ai-message').last()).toContainText(mockReply);
  expect(chat.messages).toHaveLength(1);
  expect(chat.messages[0].presetId).toBe('certification_context');
  await page.getByRole('button', { name: '关闭聊天', exact: true }).press('Enter');
  await expect(page.locator('iframe[title="AI Chat"]')).toHaveCount(0);
  await expect(launcher).toBeFocused();
  expect(chat.unexpected).toEqual([]);
});

test.describe('exploration at 390 px', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
    contextOptions: { reducedMotion: 'reduce' }
  });

  test('tap from certificate to architecture and Chat, then follow the answer source', async ({
    page,
    context
  }) => {
    test.setTimeout(130_000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        (/Content Security Policy|hydration/i.test(message.text()) ||
          message.location().url.startsWith(new URL(page.url()).origin + '/_astro/'))
      ) {
        errors.push(message.text());
      }
    });
    const chat = await mockChat(context);
    await page.addInitScript(() => {
      window.localStorage.setItem('preferred_lang', JSON.stringify('en'));
      window.localStorage.setItem('preferred_theme', JSON.stringify('dark'));
    });
    await visit(page, certPath);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    await expect(page.locator('#aws-saa-c03 img.c-cert-badge-image')).toBeVisible();
    await expect(page.locator('#aws-saa-c03 h1')).toContainText(/SAA-C03/);
    const verifyLinks = page.locator('#aws-saa-c03 .c-verify-btn');
    await expect(verifyLinks).toHaveCount(2);
    for (const control of await verifyLinks.all()) {
      const size = await control.boundingBox();
      expect(size?.width).toBeGreaterThanOrEqual(44);
      expect(size?.height).toBeGreaterThanOrEqual(44);
    }
    const note = await openCertificateNote(page, true);
    await note.locator('a[href="/docs/#en-reference-architecture"]').tap();
    await expectArchitectureHeading(page, 'en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true
    );
    const staticInk = await routeInk(page);
    await chooseRoute(page, 'Send a question', true);
    await expect.poll(() => routeInk(page)).not.toEqual(staticInk);
    const flask = await selectFlask(page, true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    await flask.locator('a[href="/deepseek_chat/?preset=personalweb_proof"]').tap();
    await expect(page.locator('html')).toHaveAttribute('lang', /^en/);
    await expect(page.getByRole('textbox', { name: 'Your question' })).toHaveValue(
      englishProjectQuestion
    );
    expect(chat.messages).toHaveLength(0);
    await page.locator('#send-btn').tap();
    await expect.poll(() => chat.messages.length).toBe(1);
    expect(chat.messages[0].presetId).toBe('personalweb_proof');
    expect(chat.messages[0].locale).toBe('en');
    await (await followSameSiteSource(page, /\/docs\/?$/, true)).close();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    expect(chat.unexpected).toEqual([]);
    expect(errors).toEqual([]);
  });
});
