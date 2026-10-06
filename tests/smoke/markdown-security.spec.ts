import { expect, test } from '@playwright/test';

const fixture = [
  '**Safe text** and [Safe link](/docs/).',
  '`<script>literal code</script>`',
  '<script>window.__sanitizerExecuted=true</script>',
  '<img alt="Sanitizer fixture" src="/__sanitizer-fixture__.png" onerror="window.__sanitizerExecuted=true">',
  '<a href="java&#x73;cript:window.__sanitizerExecuted=true" onclick="window.__sanitizerExecuted=true">Unsafe link</a>',
  '```typescript\nconst safe = 1;\n```',
  '```mermaid\nflowchart LR\n A[Safe start] --> B[Safe end]\n```',
  '```mermaid\nflowchart LR\n C["$$x^2$$"] --> D[Math label]\n```'
].join('\n\n');

for (const viewport of [
  { width: 1366, height: 900 },
  { width: 390, height: 844 }
]) {
  test.describe(`local Markdown boundary ${viewport.width}px`, () => {
    test.use({ viewport });

    test.beforeEach(async ({ page, baseURL }) => {
      // Never send security fixtures or test Chat requests to a public host.
      expect(new URL(baseURL ?? '').hostname).toMatch(/^(127\.0\.0\.1|localhost|\[::1\])$/);
      await page.route('**/cloudchat/**', (route) => route.abort());
    });

    test('sanitizes response DOM and renders bundled Mermaid including benign math', async ({
      page
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      let requests = 0;
      await page.route('**/__sanitizer-fixture__.png', (route) =>
        route.fulfill({ contentType: 'text/plain', body: 'not an image' })
      );
      await page.route('**/cloudchat/deepseek_chat', async (route) => {
        requests++;
        expect(route.request().postDataJSON()).toEqual({ message: 'Local rendering fixture' });
        await route.fulfill({
          contentType: 'application/x-ndjson',
          body: `${JSON.stringify({ text: fixture })}\n`
        });
      });
      await page.goto('/deepseek_chat/');
      // Positive control: a CSP-blocked handler cannot make this test appear safe.
      expect(
        await page.evaluate(() => {
          const control = document.createElement('button');
          control.setAttribute('onclick', "this.dataset.executed='yes'");
          control.click();
          return control.dataset.executed;
        })
      ).toBe('yes');
      await page.locator('.c-message-input').fill('Local rendering fixture');
      await page.getByRole('button', { name: 'Send', exact: true }).click();
      const answer = page.locator('.c-ai-message');
      await expect(answer.locator('strong')).toHaveText('Safe text');
      await expect(answer.locator('a[href="/docs/"]')).toHaveText('Safe link');
      await expect(answer.locator('p > code')).toHaveText('<script>literal code</script>');
      await expect(answer.locator('pre code.language-typescript.hljs')).toContainText(
        'const safe = 1;'
      );
      await expect(answer.locator('svg[id^="mmd-"]')).toHaveCount(2);
      await expect(answer.locator('svg .katex').first()).toBeVisible();
      await expect(answer.locator('script')).toHaveCount(0);
      await expect(answer.getByText('Unsafe link', { exact: true })).not.toHaveAttribute('href');
      expect(
        await answer.evaluate((element) =>
          Array.from(element.querySelectorAll('*')).flatMap((node) =>
            Array.from(node.attributes)
              .filter(
                (attribute) =>
                  /^on/i.test(attribute.name) ||
                  (/^(href|src|xlink:href)$/i.test(attribute.name) &&
                    /^(javascript:|vbscript:|data:text\/html)/i.test(
                      attribute.value.replace(/\s/g, '')
                    ))
              )
              .map((attribute) => attribute.name)
          )
        )
      ).toEqual([]);
      await answer.locator('img').dispatchEvent('error');
      await answer.getByText('Unsafe link', { exact: true }).click();
      expect(await page.evaluate(() => Reflect.get(window, '__sanitizerExecuted'))).toBeUndefined();
      expect(requests).toBe(1);
      expect(errors).toEqual([]);
    });

    test('retains malformed diagram code and completes enhancement without an unhandled error', async ({
      page
    }) => {
      const errors: string[] = [];
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.route('**/cloudchat/deepseek_chat', (route) =>
        route.fulfill({
          contentType: 'application/x-ndjson',
          body: `${JSON.stringify({ text: '```mermaid\nnot a diagram\n```' })}\n`
        })
      );
      await page.goto('/deepseek_chat/');
      await page.locator('.c-message-input').fill('Local malformed diagram fixture');
      await page.getByRole('button', { name: 'Send', exact: true }).click();
      await expect(page.locator('.c-ai-message pre code.language-mermaid')).toHaveText(
        'not a diagram\n'
      );
      await expect
        .poll(() => errors.filter((text) => text.includes('Mermaid render error:')).length)
        .toBeGreaterThan(0);
      await expect(page.getByRole('button', { name: 'Send', exact: true })).toBeEnabled();
      await expect(page.locator('.c-ai-message svg')).toHaveCount(0);
      expect(errors.filter((text) => !text.includes('Mermaid render error:'))).toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  });
}
