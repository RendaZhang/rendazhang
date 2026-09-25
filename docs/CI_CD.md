<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [CI / CD Pipeline](#ci--cd-pipeline)
  - [1. Workflow 触发条件](#1-workflow-%E8%A7%A6%E5%8F%91%E6%9D%A1%E4%BB%B6)
  - [2. 环境与密钥](#2-%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%AF%86%E9%92%A5)
  - [3. 主要步骤概览](#3-%E4%B8%BB%E8%A6%81%E6%AD%A5%E9%AA%A4%E6%A6%82%E8%A7%88)
  - [4. 环境变量映射示例](#4-%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E6%98%A0%E5%B0%84%E7%A4%BA%E4%BE%8B)
  - [5. 常见问题](#5-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
  - [6. Deploy Log Notes](#6-deploy-log-notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# CI / CD Pipeline

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: September 25, 2026, 08:46 (UTC+08:00)

---

> 本仓库使用 GitHub Actions + Nginx 部署。主要工作流定义于 `.github/workflows/deploy.yml`。

> 本功能分支准备原子发布工作流，尚未启用生产迁移。新流程串行执行 master/manual-master 发布，
> 保留一次构建和 Sentry 上传，在不可变产物预览及来源站验收后才发布固定版本镜像。
> Checkpoint A 只运行无生产密钥、环境或 SSH 的分支 CI；完整约束和重试命令见
> [发布引擎](./RELEASE_ENGINE.md)。当前缺少已审阅的 `SSH_KNOWN_HOSTS`，不得自动信任扫描结果。
> 下列旧步骤概览描述迁移前的已部署基线，不是候选工作流的执行顺序；迁移后禁止重跑历史破坏式上传。

## 1. Workflow 触发条件

```yaml
on:
  push:
    branches: [ master ]
  workflow_dispatch:
```

* 代码推送或 PR 合并到 `master` 时自动触发部署。
* 维护者也可以通过 GitHub Actions 的 `workflow_dispatch` 手动触发同一部署流程。
* 如需测试环境，可新增 `staging` 分支与相应 workflow。

## 2. 环境与密钥

| 类型   | 存储位置                                   | 调用方式                         | 说明                     |
| ---- | -------------------------------------- | ---------------------------- | ---------------------- |
| 公共变量 | *Environment → production → Variables* | `${{ vars.VAR_NAME }}`       | 例如 `PUBLIC_TAG_NAME`   |
| 私密信息 | *Environment → production → Secrets*   | `${{ secrets.SECRET_NAME }}` | 例如 `SENTRY_AUTH_TOKEN` |

> Job 须声明 `environment: production`，并在 `env:` 块显式映射到进程变量。

## 3. 主要步骤概览

| Step                | 关键命令 / Action                      | 说明                            |
| ------------------- | ---------------------------------- | ----------------------------- |
| Checkout            | `actions/checkout@v5`              | 拉取代码；Action 自身使用 Node 24 runtime |
| Node setup          | `actions/setup-node@v6`            | `node-version: '24.17.0'`；项目构建 runtime 使用 Node 24 LTS |
| Install             | `npm ci`                           | 使用 `package-lock.json` 安装依赖，保证 CI 可复现 |
| Checks and tests    | `npm run sync && npm run lint && npm run typecheck && npm run check && npm run test:coverage` | 构建前执行同步、Lint、TypeScript、Astro 和覆盖率检查 |
| Build               | `npm run build`                    | 产物位于 `dist/`                  |
| Upload source maps  | 由 `@sentry/astro` integration 自动完成 | 需 `SENTRY_AUTH_TOKEN`         |
| Upload coverage     | `actions/upload-artifact@v6`       | 上传 `coverage/` 报告；Action 自身使用 Node 24 runtime |
| Create / update tag | `actions/github-script@v8`         | 删除旧 `vX.Y.Z` 标签并重建            |
| Publish release branch | `peaceiris/actions-gh-pages@v4`  | 将 `dist/` 推送到 `release/<tag>` 分支 |
| Publish Release     | `softprops/action-gh-release@v3`   | 附带 changelog / dist 资产        |
| Deploy to server    | `scp` / `rsync` / `ssh`            | 将 `dist/` 拷贝至 `/var/www/html` |

> Workflow 中的 JavaScript action 和项目构建 runtime 均使用 Node 24。

> 服务器侧 Nginx 配置示例可参考我维护的另一个 Nginx 仓库中的配置文件：[`rendazhang.conf`](https://github.com/RendaZhang/nginx-conf/blob/master/sites-available/rendazhang.conf)。

## 4. 环境变量映射示例

```yaml
env:
  PUBLIC_TAG_NAME: ${{ vars.PUBLIC_TAG_NAME }}
  TAG_NAME:        ${{ vars.PUBLIC_TAG_NAME }}
  SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
```

## 5. 常见问题

| 症状             | 可能原因                       | 解决方案                                 |
| -------------- | -------------------------- | ------------------------------------ |
| `undefined` 变量 | Job 未绑定 `environment`      | 在 job 顶部添加 `environment: production` |
| Sentry 上传 403  | `SENTRY_AUTH_TOKEN` 未注入    | 确认 secrets 名称与 workflow 匹配           |
| Source map 未生成 | `build.sourcemap: true` 缺失 | 检查 `astro.config.ts`                 |
| 本地与 CI 依赖不一致 | 使用了 `npm install` 或其他包管理器更新依赖 | CI 以 `package-lock.json` 和 `npm ci` 为准；依赖变更需提交更新后的 lockfile |

## 6. Deploy Log Notes

Routine deploy inspection commands and accepted log-noise classifications live in
[Operations Maintenance Guide](./OPERATIONS.md#frontend-deploy-inspection).
Dependency audit decisions, accepted residuals, and escalation thresholds live in
[Dependency Security Risk Register](./DEPENDENCY_SECURITY_RISK_REGISTER.md).

Recurring lines that still need their final step outcome checked:

* Vite may report large Mermaid dynamic chunks after minification.
* Storage/auth tests intentionally exercise failure paths and can print controlled stderr.
* `gh run view --log` may label recent logs as `UNKNOWN STEP`; verify the run conclusion and job
  steps before treating this as a workflow defect.
* Sentry source-map upload can print an early "no matching sources" warning before a later upload
  report and success line.

Historical, pre-migration logs may also contain release-tag propagation retries from
`softprops/action-gh-release`, `peaceiris/actions-gh-pages` cleanup messages, or the old CDN
purge warning branch. Those actions are not part of the candidate atomic publication path.
In that path a failed artifact publication or CDN purge fails the run, reports distribution
incomplete, and leaves an already accepted origin serving. Do not classify those failures as
accepted noise or rerun the old destructive workflow to repair them.
