<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Git Workflow](#git-workflow)
  - [1. 分支类型与命名](#1-%E5%88%86%E6%94%AF%E7%B1%BB%E5%9E%8B%E4%B8%8E%E5%91%BD%E5%90%8D)
  - [2. 提交流程](#2-%E6%8F%90%E4%BA%A4%E6%B5%81%E7%A8%8B)
  - [3. 标签和版本](#3-%E6%A0%87%E7%AD%BE%E5%92%8C%E7%89%88%E6%9C%AC)
  - [4. 分支清理](#4-%E5%88%86%E6%94%AF%E6%B8%85%E7%90%86)
  - [5. FAQ](#5-faq)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Git Workflow

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 05, 2025, 07:26 (UTC+08:00)

---

> 项目分支模型采用「主干发布 + 开发集成」双主线，兼容 Git Flow / GitHub Flow。此文档说明各分支用途、命名规范与合并流向。

## 1. 分支类型与命名

| 分支类型 | 作用 | 创建自 | 命名规范 | 合并目标 |
| -------- | ---- | ------ | -------- | -------- |
| **master** | 生产发布 | —— | master | — |
| **develop** | 日常集成 | master | develop | master |
| **feature** | 新功能 | develop | `feature/<feature-name>` | develop |
| **hotfix** | 线上紧急修复 | master | `hotfix/<desc>` | master + develop |
| **experiment** | 探索/原型 | develop | `experiment/<desc>` | develop 或关闭 |

> **命名规则**：仅使用小写字母、数字、短横线；避免空格与特殊字符。

## 2. 提交流程

1. **派生分支**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/<feature-name>
   ```
2. **开发 & 自测**
   * 提交时遵循 Conventional Commits（例：`feat(login): 支持 SSO 登录`）。
3. **创建 PR**
   * 目标分支为 `develop`（或 hotfix 直接对 `master`）。
   * 至少 1 名 reviewer 通过后允许合并。
4. **集成测试**
   * CI 会在 `develop` 上运行完整测试。
   * 若测试通过，Maintainer 可点击 *Merge*。
5. **发布流程**
   * Maintainer 发 PR 将 `develop` 合并至 `master`。
   * 合并触发 GitHub Actions `deploy.yml`，自动打标签、发布 Release 并推送到服务器（见《CI / CD》文档）。

## 3. 标签和版本

* 遵循 [SemVer 2.0.0](https://semver.org/)：`MAJOR.MINOR.PATCH`。
* CI 会删除旧标签并重建同名标签（内部仓库可接受；若改为开源发布，建议递增版本而非覆盖）。

## 4. 分支清理

* 已合并的 `feature/*`、`experiment/*` 分支，可通过 **“Delete branch”** 或定期脚本清理。
* `hotfix/*` 分支在回合 `master` 与 `develop` 后立即删除。

## 5. FAQ

* **Q: 可以直接推到 master 吗？**
  A: 除 CI 机器人外，任何人不得直接推送 `master`；必须通过 PR。
* **Q: 如何回滚？**
  A: 使用 `git revert <commit>` 创建新的 revert 提交，不强推。
