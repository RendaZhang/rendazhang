import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [scenario, ownedRoot] = process.argv.slice(2);
const require = createRequire(import.meta.url);
const readPackage = (name, consumer = require) => {
  let directory = dirname(consumer.resolve(name));
  while (dirname(directory) !== directory) {
    const manifest = join(directory, 'package.json');
    if (existsSync(manifest)) {
      const parsed = JSON.parse(readFileSync(manifest, 'utf8'));
      if (parsed.name === name) return parsed;
    }
    directory = dirname(directory);
  }
  throw new Error(`No package manifest for resolved ${name}`);
};

async function mockerCase() {
  const { createServer } = await import('vite');
  const { interceptorPlugin } = await import('@vitest/mocker/node');
  const { MockerRegistry } = await import('@vitest/mocker');
  const root = join(realpathSync(ownedRoot), 'allowed');
  mkdirSync(root);
  const sentinel = 'SYNTHETIC_BLOCKED_MARKER';
  writeFileSync(join(ownedRoot, 'outside.js'), `export const value = '${sentinel}';`);
  writeFileSync(join(root, 'denied.js'), `export const value = '${sentinel}';`);
  writeFileSync(join(root, 'allowed.js'), "export const value = 'ALLOWED_FIXTURE';");
  const registry = new MockerRegistry();
  const id = join(root, 'mocked.js');
  const controlled = scenario === 'controlled-registry';
  if (controlled) registry.register('redirect', '', id, '/mocked.js', join(root, 'allowed.js'));
  const registrations = [];
  let socket;
  const server = await createServer({
    root,
    configFile: false,
    envDir: false,
    cacheDir: join(ownedRoot, 'cache'),
    logLevel: 'silent',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: {
      host: '127.0.0.1',
      port: 0,
      fs: { strict: true, allow: [root], deny: ['**/denied.js'] }
    },
    plugins: [
      {
        name: 'observe-registration-without-replacing-handlers',
        enforce: 'pre',
        configureServer(server) {
          const on = server.ws.on.bind(server.ws);
          server.ws.on = (event, ...args) => {
            registrations.push(event);
            return on(event, ...args);
          };
          server.ws.on('fixture:barrier', () => server.ws.send('fixture:barrier:result'));
        },
        resolveId(source) {
          if (source === '/mocked.js') return id;
        }
      },
      interceptorPlugin({ registry, registerWebSocketEvents: !controlled })
    ]
  });
  try {
    await server.listen();
    const address = server.httpServer.address();
    assert.equal(address.address, '127.0.0.1');
    const origin = `http://127.0.0.1:${address.port}`;
    const source = await fetch(`${origin}/allowed.js`, { signal: AbortSignal.timeout(3000) });
    assert.equal(source.status, 200);
    assert.match(await source.text(), /ALLOWED_FIXTURE/);
    assert.equal(registrations.includes('vitest:interceptor:register'), !controlled);
    socket = new WebSocket(`ws://127.0.0.1:${address.port}`, 'vite-hmr');
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('socket open timeout')), 3000);
      socket.addEventListener(
        'open',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true }
      );
      socket.addEventListener(
        'error',
        () => {
          clearTimeout(timer);
          reject(new Error('socket error'));
        },
        { once: true }
      );
    });
    const target =
      scenario === 'outside-root'
        ? 'fixture:../outside.js'
        : scenario === 'denied-root-file' || controlled
          ? 'fixture:denied.js'
          : 'fixture:allowed.js';
    let acknowledgements = 0;
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('registration barrier timeout')), 3000);
      socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.event === 'vitest:interceptor:register:result') acknowledgements++;
        if (message.event === 'fixture:barrier:result') {
          clearTimeout(timer);
          resolve();
        }
      });
      socket.send(
        JSON.stringify({
          type: 'custom',
          event: 'vitest:interceptor:register',
          data: {
            type: 'redirect',
            raw: '',
            id,
            url: '/mocked.js',
            redirect: target
          }
        })
      );
      // Ordered socket messages prove the disabled handler was not merely slow.
      socket.send(JSON.stringify({ type: 'custom', event: 'fixture:barrier' }));
    });
    assert.equal(acknowledgements, controlled ? 0 : 1);
    const allowed = controlled || scenario === 'allowed-redirect';
    assert.equal(Boolean(registry.getById(id)), allowed);
    const response = await fetch(`${origin}/mocked.js`, { signal: AbortSignal.timeout(3000) });
    const body = await response.text();
    assert(!body.includes(sentinel));
    if (allowed) {
      assert.equal(response.status, 200);
      assert.match(body, /ALLOWED_FIXTURE/);
      assert.equal(registry.getById(id).redirect, join(root, 'allowed.js'));
    } else {
      assert.notEqual(response.status, 200);
      const deniedPath =
        scenario === 'outside-root'
          ? `/@fs/${join(realpathSync(ownedRoot), 'outside.js')}`
          : '/denied.js';
      const denied = await fetch(origin + deniedPath, { signal: AbortSignal.timeout(3000) });
      assert.equal(denied.status, 403);
      assert(!(await denied.text()).includes(sentinel));
    }
  } finally {
    if (socket && socket.readyState !== WebSocket.CLOSED) socket.close();
    await server.close();
  }
}

switch (scenario) {
  case 'consumer-resolution': {
    const family = [
      'vitest',
      ...[
        'ui',
        'coverage-v8',
        'expect',
        'mocker',
        'pretty-format',
        'runner',
        'snapshot',
        'spy',
        'utils'
      ].map((name) => `@vitest/${name}`)
    ];
    for (const name of family) {
      const manifest = readPackage(name);
      assert.equal(manifest.version, '4.1.11');
      const consumer = createRequire(require.resolve(`${name}/package.json`));
      for (const [child, range] of Object.entries(manifest.dependencies || {})) {
        if (family.includes(child)) {
          assert.equal(range, '4.1.11');
          assert.equal(readPackage(child, consumer).version, '4.1.11');
        }
      }
      if (manifest.peerDependencies?.vitest)
        assert.equal(manifest.peerDependencies.vitest, '4.1.11');
    }
    const runner = createRequire(require.resolve('vitest/package.json'));
    const coverage = createRequire(require.resolve('@vitest/coverage-v8/package.json'));
    assert.equal(readPackage('vite', runner).version, '8.1.3');
    assert.equal(readPackage('magicast', coverage).version, '0.5.3');
    for (const [name, version] of Object.entries({
      chai: '6.3.0',
      'expect-type': '1.4.0',
      'std-env': '4.3.0',
      tinyrainbow: '3.2.0'
    })) {
      assert.equal(readPackage(name, runner).version, version);
    }
    break;
  }
  case 'allowed-redirect':
  case 'outside-root':
  case 'denied-root-file':
  case 'controlled-registry':
    await mockerCase();
    break;
  case 'local-env':
  case 'github-env': {
    const env = await import('std-env');
    const github = scenario === 'github-env';
    assert.equal(env.runtime, 'node');
    assert.equal(env.isNode, true);
    assert.equal(env.nodeVersion, process.versions.node);
    assert.equal(env.nodeMajorVersion, 24);
    assert.equal(env.provider, github ? 'github_actions' : '');
    assert.equal(env.isCI, github);
    assert.equal(env.isColorSupported, github);
    assert.equal(env.isTest, true);
    assert.equal(env.isAgent, false);
    assert.equal(env.hasTTY, false);
    break;
  }
  case 'colors': {
    const { createColors, getDefaultColors } = await import('tinyrainbow');
    const disabled = getDefaultColors();
    const forced = createColors({ force: true });
    assert.equal(disabled.red('plain'), 'plain');
    assert.equal(disabled.red(Symbol('fixture')), 'Symbol(fixture)');
    assert.equal(forced.red('plain'), '\x1b[31mplain\x1b[39m');
    assert.equal(forced.red(`a${forced.blue('b')}c`), '\x1b[31ma\x1b[34mb\x1b[31mc\x1b[39m');
    assert.equal(forced.rgb(1, 2, 3)('rgb'), '\x1b[38;2;1;2;3mrgb\x1b[39m');
    assert.equal(forced.hex('#abc')('hex'), '\x1b[38;2;170;187;204mhex\x1b[39m');
    assert.throws(() => forced.red(Symbol('fixture')), TypeError);
    break;
  }
  case 'symbol-reporter': {
    const runner = dirname(require.resolve('vitest/package.json'));
    const testImport = pathToFileURL(join(runner, 'dist/index.js')).href;
    writeFileSync(
      join(ownedRoot, 'reporter.test.mjs'),
      `import { test, expect } from ${JSON.stringify(testImport)};
test('symbol diagnostic fixture', () => { expect(Symbol('reporter-safe')).toBe('different'); });`
    );
    const config = join(ownedRoot, 'vitest.config.mjs');
    writeFileSync(
      config,
      `export default { root: ${JSON.stringify(ownedRoot)}, envDir: false, test: { environment: 'node', include: ['reporter.test.mjs'], watch: false, coverage: { enabled: false } } };`
    );
    const child = spawnSync(
      process.execPath,
      [join(runner, 'vitest.mjs'), 'run', '--config', config, '--reporter=verbose'],
      {
        cwd: ownedRoot,
        encoding: 'utf8',
        timeout: 8000,
        killSignal: 'SIGKILL',
        maxBuffer: 128 * 1024,
        env: {
          PATH: dirname(process.execPath),
          HOME: ownedRoot,
          TMPDIR: ownedRoot,
          FORCE_COLOR: '1'
        }
      }
    );
    assert.equal(child.error, undefined);
    assert.equal(child.signal, null);
    assert.equal(child.status, 1);
    const output = child.stdout + child.stderr;
    assert.match(output, /symbol diagnostic fixture/);
    assert.match(output, /Symbol\(reporter-safe\)/);
    assert.match(output, /AssertionError/);
    assert(!/Cannot convert a Symbol|Unhandled Error|Unhandled Rejection/.test(output));
    break;
  }
  default:
    throw new Error('Unknown bounded scenario');
}
process.stdout.write(`${scenario}: after-checks\n`);
