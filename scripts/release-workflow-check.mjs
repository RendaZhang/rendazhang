import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const deployText = readFileSync('.github/workflows/deploy.yml', 'utf8');
const deploy = parse(deployText);
assert.deepEqual(deploy.on.push.branches, ['master']);
assert.equal(deploy.concurrency['cancel-in-progress'], false);
assert.equal(deploy.concurrency.group, 'frontend-production-transaction');
assert.match(deploy.jobs['build-and-deploy'].if, /github.ref == 'refs\/heads\/master'/);
const steps = deploy.jobs['build-and-deploy'].steps;
const find = (fragment) => steps.findIndex((step) => step.name?.includes(fragment));
assert.ok(find('Install locked') < find('Build exactly once'));
assert.ok(find('Build exactly once') < find('Retain immutable'));
assert.ok(find('Retain immutable') < find('Verify artifact'));
assert.ok(find('Verify artifact') < find('Guarded origin'));
assert.match(steps[find('Build exactly once')].if, /inputs.mirror_run_id == ''/);
assert.match(steps[find('Download and bind')].if, /inputs.mirror_run_id != ''/);
assert.equal(steps.filter((step) => /run build/.test(step.run || '')).length, 1);
assert.doesNotMatch(deployText, /scp-action|rm: true|--force|no-verify|nginx|systemctl restart/);
assert.match(steps[find('Remove only')].if, /always\(\)/);
const fixtureText = readFileSync('.github/workflows/release-engine-validation.yml', 'utf8');
const fixture = parse(fixtureText);
assert.equal(fixture.permissions.contents, 'read');
assert.doesNotMatch(
  fixtureText,
  /secrets\.|environment:|workflow_dispatch:|ssh |deploy\.yml --ref/
);
for (const job of Object.values(fixture.jobs)) assert.equal(job['runs-on'], 'ubuntu-24.04');
process.env.SMOKE_MODE = 'external';
process.env.RELEASE_ORIGIN = 'http://127.0.0.1:4322';
process.env.RELEASE_BUNDLE = '/tmp/workflow-contract-fixture';
const { default: browser } = await import('../playwright.acceptance.config.ts');
assert.equal(Object.hasOwn(browser, 'webServer'), false);
assert.equal(browser.globalTimeout, 90_000);
assert.equal(browser.use.baseURL, process.env.RELEASE_ORIGIN);
console.log(
  'WORKFLOW structured master/concurrency/build-once/preview/cleanup/isolated-CI contracts passed'
);
