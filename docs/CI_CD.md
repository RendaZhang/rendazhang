<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [CI / CD Pipeline](#ci--cd-pipeline)
  - [1. Workflow 触发条件](#1-workflow-%E8%A7%A6%E5%8F%91%E6%9D%A1%E4%BB%B6)
  - [2. 环境与密钥](#2-%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%AF%86%E9%92%A5)
  - [3. 主要步骤概览](#3-%E4%B8%BB%E8%A6%81%E6%AD%A5%E9%AA%A4%E6%A6%82%E8%A7%88)
  - [4. 环境变量映射示例](#4-%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E6%98%A0%E5%B0%84%E7%A4%BA%E4%BE%8B)
  - [5. 常见问题](#5-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# CI / CD Pipeline

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 05, 2025, 07:26 (UTC+08:00)

---

> 本仓库使用 GitHub Actions + Nginx 部署。主要工作流定义于 `.github/workflows/deploy.yml`。

## 1. Workflow 触发条件

```yaml
on:
  push:
    branches: [ master ]
```

* **仅当** 代码推送或 PR 合并到 `master` 时触发部署。
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
| Checkout            | `actions/checkout@v4`              | 拉取代码                          |
| Node setup          | `actions/setup-node@v4`            | `node-version: 20.x`          |
| Install             | `pnpm install --frozen-lockfile`   | 安装依赖                          |
| Build               | `pnpm build`                       | 产物位于 `dist/`                  |
| Upload source maps  | 由 `@sentry/astro` integration 自动完成 | 需 `SENTRY_AUTH_TOKEN`         |
| Create / update tag | `actions/github-script@v7`         | 删除旧 `vX.Y.Z` 标签并重建            |
| Publish Release     | `softprops/action-gh-release@v1`   | 附带 changelog / dist 资产        |
| Deploy to server    | `scp` / `rsync` / `ssh`            | 将 `dist/` 拷贝至 `/var/www/html` |

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
| Source map 未生成 | `build.sourcemap: true` 缺失 | 检查 `astro.config.mjs`                |
