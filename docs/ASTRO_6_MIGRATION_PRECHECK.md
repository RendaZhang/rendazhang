<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Astro 6 迁移预检](#astro-6-%E8%BF%81%E7%A7%BB%E9%A2%84%E6%A3%80)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [7.1 预检基线](#71-%E9%A2%84%E6%A3%80%E5%9F%BA%E7%BA%BF)
  - [官方资料摘要](#%E5%AE%98%E6%96%B9%E8%B5%84%E6%96%99%E6%91%98%E8%A6%81)
  - [当前代码影响面](#%E5%BD%93%E5%89%8D%E4%BB%A3%E7%A0%81%E5%BD%B1%E5%93%8D%E9%9D%A2)
    - [Astro 页面与 layout](#astro-%E9%A1%B5%E9%9D%A2%E4%B8%8E-layout)
    - [CSP 与脚本](#csp-%E4%B8%8E%E8%84%9A%E6%9C%AC)
    - [Hydration 与 React islands](#hydration-%E4%B8%8E-react-islands)
    - [Chat Widget 与 iframe](#chat-widget-%E4%B8%8E-iframe)
    - [Sentry 与 sourcemap](#sentry-%E4%B8%8E-sourcemap)
  - [7.2 建议目标包集合](#72-%E5%BB%BA%E8%AE%AE%E7%9B%AE%E6%A0%87%E5%8C%85%E9%9B%86%E5%90%88)
  - [7.2 执行结果](#72-%E6%89%A7%E8%A1%8C%E7%BB%93%E6%9E%9C)
  - [预期 audit 结果](#%E9%A2%84%E6%9C%9F-audit-%E7%BB%93%E6%9E%9C)
  - [7.2 验证清单](#72-%E9%AA%8C%E8%AF%81%E6%B8%85%E5%8D%95)
  - [回滚策略](#%E5%9B%9E%E6%BB%9A%E7%AD%96%E7%95%A5)
  - [Go / No-Go](#go--no-go)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Astro 6 迁移预检

- **作者**: 张人大
- **最后更新**: June 21, 2026, 14:49 (UTC+08:00)

## 文档目的

本文记录当前 Astro 5 前端迁移到 Astro 6 前必须确认的包版本、兼容性风险、验证清单和回滚策略。

本文是 Slice 7.1 的预检结果，不执行 Astro 升级，不修改依赖或 lockfile，不改变 UI、Chat、API、运行时、后端、Nginx 或生产服务器服务。

> Slice 1.8 之后，当前前端项目 runtime 已切换到 Node 24 LTS。下方 7.1/7.2 中的 Node
> 信息保留为历史执行基线，不再代表当前运行时。

## 7.1 预检基线

以下基线来自 Slice 7.1 执行时的 `package.json`、`package-lock.json`、`astro.config.ts`、
`.github/workflows/deploy.yml` 和本地只读命令，用于说明升级前状态。

| 项目 | 当前状态 | 迁移含义 |
| --- | --- | --- |
| Node | Slice 7.1 历史基线：本地 `v22.16.0`；`package.json` 为 22.x；GitHub Actions 使用 22.x | Astro 6.4.8 和 Vite 7 要求 22.12+；Slice 7.2 当时继续使用 22.x，并确认 CI 实际解析到满足要求的版本 |
| npm | Slice 7.1 历史基线：`10.9.2`；`packageManager` 为 npm 10.9.2 | 与当时 npm major 10 的 engines 约束一致 |
| Astro | `astro@5.18.2` | 生产 audit 剩余主链要求 Astro 6.4.8 |
| React integration | `@astrojs/react@4.4.2` | Astro 6 目标应与 `@astrojs/react@5.0.7` 一起评估 |
| React | `react@19.1.0`、`react-dom@19.1.0` | `@astrojs/react@5.0.7` peer 仍支持 React 19 |
| Vite | `vite@6.4.3` | Astro 6.4.8 / `@astrojs/react@5.0.7` 会把 Vite 带到 7.3.x |
| Vitest | `vitest@3.2.6`，`vitest.config.ts` 使用 `astro/config` 的 `getViteConfig` | Vitest 3 peer 支持 Vite 7；Vitest 4 是独立 major，不应混入 7.2 最小升级 |
| TypeScript | `typescript@5.8.3` | `@astrojs/check@0.9.9` peer 支持 TS 5 或 TS 6；不需要在 7.2 强制升 TS 6 |
| Sentry | `@sentry/astro@10.58.0`、`@sentry/react@10.58.0`、直接 `@sentry/vite-plugin@4.9.1` | `@sentry/astro` 自带 nested `@sentry/vite-plugin@5.3.0`；直接 Vite plugin 目前未被源码 import，7.2 只在必要时处理 |
| 构建配置 | `astro.config.ts` 使用 `react()`、`sentry()`、`loadEnv()`、`vite.define`、`server.proxy`、`build.sourcemap: true` | 迁移时必须保留 env 注入、proxy、sourcemap 和 Sentry release 配置 |

当前 `npm audit --omit=dev --audit-level=low` 报告 2 个生产 finding：Astro advisories 和 Astro nested esbuild dev server advisory。完整 `npm audit --audit-level=low` 报告 7 个 finding，额外链路来自 `@astrojs/check` / language-server / YAML。

`npm install --package-lock-only --dry-run astro@6.4.8 @astrojs/react@5.0.7` 已只读执行，未产生文件 diff。实际 audit 结果必须等 7.2 在临时升级分支生成 lockfile 后重新验证。

## 官方资料摘要

预检参考的公开官方资料：

- [Astro 6 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Vite 7 migration guide](https://v7.vite.dev/guide/migration.html)
- [Sentry for Astro](https://docs.sentry.io/platforms/javascript/guides/astro/)
- [Sentry Astro source maps](https://docs.sentry.io/platforms/javascript/guides/astro/sourcemaps/)
- npm metadata for `astro@6.4.8`, `@astrojs/react@5.0.7`, `vite@7.3.2`, `@sentry/astro@10.59.0`, `@sentry/vite-plugin@5.3.0`, `vitest@4.1.9`, and `typescript`.

相关结论：

- Astro 6 的官方升级路径建议同时升级 Astro 和官方 integrations。
- Astro 6.4.8 npm metadata 要求 Node `>=22.12.0`，并依赖 Vite `^7.3.2`。
- Vite 7 migration guide 要求 Node 20.19+ 或 22.12+，并更新默认 browser target。
- `@astrojs/react@5.0.7` 要求 Node `>=22.12.0`，peer 支持 React 17、18、19。
- Sentry Astro 文档仍以 Astro integration 和 Vite plugin 处理 sourcemap 上传；当前项目已有 `loadEnv()` 和 `telemetry: false`，这两点应保留。

## 当前代码影响面

### Astro 页面与 layout

当前 `src/pages` 都通过 `BaseLayout` 挂载页面壳和 React islands。主要页面使用 `client:load`，全局 Chat Widget 使用 `client:visible`。迁移时需要重点回归：

- 首页 `/`
- Chat 页面 `/deepseek_chat/`
- 登录、注册、profile、forgot/reset password 页面
- docs 和 certifications 页面
- 404/500 静态错误页

当前未发现 `Astro.glob()`、`getStaticPaths()`、`astro:content`、content collections、server islands、Astro Actions、View Transitions、adapter API 或自定义 Astro integration hook。`src/content` 当前是 TypeScript 内容常量目录，不是 Astro content collection。

### CSP 与脚本

`BaseLayout.astro` 和相关页面有 CSP 敏感点：

- `/js/base-layout-init.js` 是渲染前外部脚本，负责 theme、language、title 和 auth DOM 标记。
- `astro.config.ts` 中 Sentry Vite plugin 必须继续使用 `release.inject: false`，避免构建产物注入不符合生产 CSP 的 inline release module。
- `BaseLayout` 的 JSON-LD、登录页 redirect script 和 `/deepseek_chat/` iframe class script 是现有例外，迁移不应引入新的 inline executable script。

7.2 需要在构建产物中检查：

```bash
rg -n "SENTRY_RELEASE|__SENTRY|new Function|eval\\(" dist
```

如发现由升级引入的新 inline release 注入或不符合 CSP 的脚本，应停止部署并回滚升级分支。

### Hydration 与 React islands

当前活跃 hydration 指令只有：

- `client:load`
- `client:visible`

迁移后要观察浏览器控制台和 deploy 日志是否新增 hydration mismatch、island load failure、React recoverable error 或 dynamic import failure。重点 island：

- `NavBarWrapper`
- `AboutContent`
- `DeepseekChatContent`
- `LoginContent` / `RegisterContent` / auth forms
- `CertificationsContent` / `CertificationsEffects`
- `DocsEffects`
- `ChatWidget`
- `BackToTopButton`

`@astrojs/react` 文档说明 Astro 项目通过该 integration 渲染和客户端水合 React components。当前项目只使用 React 一个 JSX framework，因此不需要多 framework `include` 配置。

### Chat Widget 与 iframe

Chat Widget 协议必须保持不变：

- 父页面只接受同源 `/deepseek_chat/` iframe 的 `chat-enhancement-ready`。
- 校验仍必须包含 `event.origin === window.location.origin` 和 `event.source === iframe.contentWindow`。
- `/deepseek_chat/` 内页必须继续 `showChatWidget={false}`。
- 子页 readiness 消息不应被迁移改成跨域、broadcast 或 auth/session 消息。

详见 [Chat Widget 协议说明](./CHAT_WIDGET_PROTOCOL.md)。

### Sentry 与 sourcemap

当前构建流程：

- `vite.build.sourcemap: true`
- GitHub Actions build step 注入 `SENTRY_AUTH_TOKEN`、`SENTRY_ORG`、`SENTRY_PROJECT`、`PUBLIC_SENTRY_DSN`、`PUBLIC_TAG_NAME`
- Sentry integration 使用 `sourceMapsUploadOptions`
- 生产构建后删除 `dist/**/*.map`
- release 名称来自 `PUBLIC_TAG_NAME || SENTRY_RELEASE`
- `release.inject: false`

7.2 不应改变 release 命名、sourcemap 上传、生产删除 `.map` 或 telemetry 禁用策略。直接 `@sentry/vite-plugin@4.9.1` 当前没有源码 import；是否更新或移除应根据 7.2 lockfile diff 和构建结果判断，不应先做无关清理。

## 7.2 建议目标包集合

最小可评估集合：

| 包 | 建议目标 | 说明 |
| --- | --- | --- |
| `astro` | `6.4.8` | npm audit 当前建议的 Astro 6 目标；必须验证 audit 是否实际消除 Astro/esbuild 链 |
| `@astrojs/react` | `5.0.7` | 与 Astro 6 / Vite 7 同步；peer 支持 React 19 |
| `vite` | lockfile 解析到 `7.3.x` | 由 Astro / React integration 带入；不需要在 `package.json` 增加 direct dependency |
| `@vitejs/plugin-react` | lockfile 解析到 `5.2.x` | 由 `@astrojs/react` 带入 |
| `react` / `react-dom` | 保持 `19.1.x` | React 19.2 是独立更新，不属于 Astro 6 最小迁移 |
| `typescript` | 保持 `5.8.x`，或只在 check 明确需要时升到 5.9.x | TS 6 不属于最小迁移 |
| `vitest` / coverage / UI | 保持 `3.2.6` | Vitest 4 是独立 major；当前 Vitest 3 peer 支持 Vite 7 |
| `@astrojs/check` | 保持 `0.9.9`，除非 check/audit 给出更安全的可验证路径 | npm latest 仍为 0.9.9；dev-only YAML finding 可能仍残留 |
| `@sentry/astro` / `@sentry/react` | 保持 10.x；可接受同 major patch/minor if lockfile naturally updates | 不把 Sentry major/tooling cleanup 混入 Astro 最小迁移 |
| `@sentry/vite-plugin` | 不主动变更，除非构建或 peer 冲突要求 | 当前 direct dependency 未被源码 import，`@sentry/astro` 自带 5.3.0 |

7.2 当时应同时把 22.x 下限从宽泛 22.x 明确为 22.12+，或至少在 PR/commit 说明中记录本地和 CI 均满足 22.12+。这一步当时不是 Node 24 升级；当前 runtime 切换由后续 Slice 1.8 处理。

## 7.2 执行结果

Slice 7.2 按最小范围执行 Astro 6 upgrade：

- `astro` 升级到 `6.4.8`。
- `@astrojs/react` 升级到 `5.0.7`。
- npm 将 transitive `vite` 解析到 `7.3.5`，`@vitejs/plugin-react` 解析到 `5.2.0`，
  `esbuild` 解析到 `0.27.7`。
- `package.json` / `package-lock.json` 的 Node engine 下限在 Slice 7.2 当时收紧到 22.12+；
  项目当时仍保持 22.x，不升级到 Node 24。当前 runtime 切换由后续 Slice 1.8 处理。
- `react` / `react-dom` 保持 `19.1.0`，`vitest` 保持 `3.2.6`，TypeScript 保持 `5.8.3`，
  Sentry package 版本保持不变。
- `vitest.config.ts` 从 Astro 的完整 `getViteConfig()` 改为 `vitest/config` 的最小 jsdom
  测试配置，并显式 dedupe `react` / `react-dom`。原因是 Astro 6 / `@astrojs/react` 5 的
  Vite integration 配置进入 Vitest 3 后会让 React 组件测试触发重复 dispatcher 的
  invalid hook call；生产 Astro build 仍使用 `astro.config.ts`。
- `astro.config.ts` 中 Sentry `release.inject: false`、sourcemap、env define 和 dev proxy 配置保持
  不变。
- Chat Widget 同源 iframe protocol、hydration 指令、auth/profile/contact form/API 代码和 UI
  行为未做功能性修改。

## 预期 audit 结果

7.2 的目标是减少或消除生产 audit 中的 Astro advisories。升级后必须重新运行：

```bash
npm audit --omit=dev --audit-level=low
npm audit --audit-level=low
npm ls astro @astrojs/react @astrojs/check @sentry/astro @sentry/react @sentry/vite-plugin vite vitest typescript
```

接受条件：

- 生产 audit 中 Astro XSS / SSRF advisories 消失，或如仍存在，必须有具体 npm advisory / package constraint 解释。
- esbuild finding 如果仍存在，必须确认是否来自 Astro/Vite semver range，不能笼统标为已解决。
- dev-only `@astrojs/check` / YAML finding 可作为残余风险保留，但必须记录 `@astrojs/check@0.9.9` 仍为 npm latest，且任何 downgrade/force path 不属于 Astro 6 最小迁移。

实际结果：

- Astro high advisories 已消失。
- `npm audit --omit=dev --audit-level=low` 仍报告 2 个 low finding，来自
  `astro@6.4.8 -> esbuild@0.27.7`。npm 的 force fix 路径会安装 `astro@5.17.2`，这会回退
  Astro major，不能作为本 slice 的安全修复。
- `npm audit --audit-level=low` 仍报告 7 个 finding：2 个 low 来自上述 esbuild 链，5 个
  moderate 来自 dev-only `@astrojs/check` / `yaml-language-server` / `yaml` 链。npm force
  path 会安装 `@astrojs/check@0.9.2`，不属于本 slice。

## 7.2 验证清单

升级分支本地验证：

```bash
node -v
npm -v
npm audit --omit=dev --audit-level=low
npm audit --audit-level=low
npm outdated
npm ls astro @astrojs/react @astrojs/check @sentry/astro @sentry/react @sentry/vite-plugin vite vitest typescript
git diff --check
npm run sync
npm run lint
npm run typecheck
npm run check
npm run test:coverage
npm run build
pre-commit run --all-files
```

构建产物和 hydration/CSP 只读检查：

```bash
rg -n "SENTRY_RELEASE|new Function|eval\\(" dist
rg -n "island|hydration|mismatch|client:|Sentry|source map|warning|error" dist .astro
```

部署后只读检查：

```bash
gh run list --workflow deploy.yml --branch master --limit 1
gh run watch <run-id> --exit-status
gh run view <run-id> --log | rg -n "Node.js|deprecated|warning|error|hydration|mismatch|Sentry|source map|CDN purge"
curl -I https://www.rendazhang.com/
curl -I https://www.rendazhang.com/deepseek_chat/
curl -sS -i https://www.rendazhang.com/cloudchat/auth/healthz
```

人工 smoke：

- `/` 页面首屏、语言切换、主题切换、导航和回到顶部。
- `/deepseek_chat/` 独立页面，输入框聚焦、发送请求、Markdown 增强库加载、reset modal。
- 任意普通页面打开浮动 Chat Widget，确认 skeleton 到 iframe ready 的过渡。
- 登录页已登录 redirect 行为。
- certifications Credly iframe 加载/失败兜底。
- docs 页面代码高亮和滚动效果。
- 404/500 页面 metadata 和主题初始化。

## 回滚策略

7.2 应使用单独 commit，避免混入 UI、API、Sentry cleanup 或 tooling-major 改动。

如本地失败：

1. 不提交生成的 dependency diff。
2. 用 `git diff package.json package-lock.json` 确认范围。
3. 仅回退本 slice 生成的依赖文件改动，保留无关用户改动。
4. 在 roadmap 记录阻塞原因、失败命令和最后安全 commit。

如 push 后 deploy 失败：

1. 先用 `gh run view <run-id> --log` 做只读诊断。
2. 不 SSH、不重启服务、不 reload Nginx。
3. 如需回滚 frontend，优先 `git revert <upgrade-commit>` 后正常 push `master` 触发静态部署。

如生产 smoke 失败：

1. 记录具体 URL、HTTP 状态、浏览器 console 或 deploy 日志片段。
2. 如果失败影响首屏、Chat、auth 或 CSP，立即 revert 升级 commit。
3. 如果仅是 dev-only audit 残留或非阻塞 install warning，在 roadmap 记录残余风险并继续后续专门 slice。

## Go / No-Go

结论：`Go`，但仅限受控的 Slice 7.2 dependency upgrade branch。

进入 7.2 的前置条件：

- Slice 7.2 当时继续使用 22.x，不升 Node 24。
- 确认当时本地和 GitHub Actions Node 都满足 22.12+。
- 仅升级 Astro 6 最小目标包集合。
- 保留 `release.inject: false`、Sentry sourcemap 上传、`BaseLayout` 初始化脚本、Chat Widget 同源 iframe 协议和当前 hydration 指令。
- 升级后必须以 audit、build、test、deploy log、CSP grep、生产只读 smoke 共同决定是否发布。

若 7.2 发现 Astro 6.4.8 仍无法消除生产 audit，或 Vite 7 / Sentry integration 引入 CSP、hydration、Chat iframe、auth redirect 回归，则停止发布，记录阻塞原因，并把后续拆成更小的 compatibility slice。
