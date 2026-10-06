<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Git Workflow](#git-workflow)
  - [1. 一个主干，两种工作方式](#1-%E4%B8%80%E4%B8%AA%E4%B8%BB%E5%B9%B2%E4%B8%A4%E7%A7%8D%E5%B7%A5%E4%BD%9C%E6%96%B9%E5%BC%8F)
  - [2. Slice 开工检查](#2-slice-%E5%BC%80%E5%B7%A5%E6%A3%80%E6%9F%A5)
  - [3. 验证与发布](#3-%E9%AA%8C%E8%AF%81%E4%B8%8E%E5%8F%91%E5%B8%83)
  - [4. Slice 收尾清理](#4-slice-%E6%94%B6%E5%B0%BE%E6%B8%85%E7%90%86)
  - [5. Dependabot 分支](#5-dependabot-%E5%88%86%E6%94%AF)
  - [6. 发布分支与标签](#6-%E5%8F%91%E5%B8%83%E5%88%86%E6%94%AF%E4%B8%8E%E6%A0%87%E7%AD%BE)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Git Workflow

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: October 06, 2026, 23:50 (UTC+08:00)

## 1. 一个主干，两种工作方式

`master` 是唯一日常开发与生产发布主干，不使用常驻 `develop` 或多层 Git Flow。

| 改动 | 工作方式 |
| --- | --- |
| 文档、文案、范围明确的小修复 | 在干净且已同步的 `master` 上修改、验证、提交 |
| 依赖升级、架构调整、较大 UI 改动、后端或 Nginx 行为变更 | 从最新 `master` 创建 `codex/<short-description>` 短分支；验证后快进合入主干 |
| 需要讨论、外部贡献或多人评审 | 使用 Pull Request；目标为 `master` |

PR 不是每个 Slice 的强制步骤。分支用于隔离尚未验收的修改，不是长期存放已完成工作的地方。
前端当前 workflow 由 `master` push 或手动 dispatch 触发，不要假定 PR 已自动运行前端 CI。
发布流程见 [CI / CD](CI_CD.md)，验证命令见 [Testing](TESTING.md)。

## 2. Slice 开工检查

1. 先运行 `git status --short --branch`，阅读 `AGENTS.md` 和相关文档。
2. 确认没有其他任务正在写同一 checkout；检查 `git worktree list`。
   切换分支不能隔离同一目录内的两个任务。确需并行写入时使用独立 worktree。
3. 刷新远程引用并核对主干；只有工作区干净、分支正确时才执行 `git pull --ff-only origin master`。
   有未提交修改或分叉时先判断归属，不自动 reset、stash 或覆盖他人的工作。
4. 检查上一 Slice 是否留下已合并且不再使用的分支。只清理已核实的具体名称，
   不因名称看似过期就批量删除。
5. 写清本次范围、验证方式和是否获准发布，再按上表选择主干或短分支。

## 3. 验证与发布

- 保持小提交，使用清晰的 Conventional Commit 信息；检查暂存 diff，不混入无关文件。
- 使用项目锁定的运行时。运行与风险匹配的检查、`git diff --check` 和正常 hooks。
  不使用 `--no-verify`，不 force push。
- 短分支通过检查后，回到干净主干，刷新远程，使用 `git merge --ff-only <slice-branch>`。
  如果主干已前进导致无法快进，先整合新主干并重新验证，不强行覆盖。
- `git push origin master` 会触发生产部署；没有发布授权时停在本地提交或分支交付。
  多仓库变更串行发布：一个仓库的部署与健康检查完成后再推送下一个。
- 以本次 source SHA 对应的 push workflow 和部署步骤成功为准，而非列表里的任意绿灯。
  常规交付不另行 SSH/pull/restart。回退用 `git revert` 的新提交，不重写主干历史。

## 4. Slice 收尾清理

1. 确认本次提交已进入 `master`、对应部署成功，且必要的线上只读检查通过。
2. 确认没有其他任务、worktree 或未关闭 PR 仍依赖该分支。
3. 用 `git merge-base --is-ancestor <slice-branch> master` 确认提交已在主干，
   再用 `git branch -d <slice-branch>` 删除本地分支；若推过远程，再删除对应远程分支。
4. GitHub 已启用合并 PR 后自动删除 head 分支；它不会清理本地分支，也不会代替
   本地快进交付后的远程分支清理。必要时 `git fetch --prune origin` 清理失效远程引用。
5. 停止本次临时服务，移除本次确认可丢弃的临时文件，报告最终分支、工作区、提交和部署状态。
   失败或未完成的 Slice 保留诊断所需内容并说明原因，不为了“干净”丢掉工作。

未合并分支或 stash 只有在所有者明确放弃后才能直接删除，不需要为已明确取消的方案另建归档。
不要删除 `master`、CI 维护的 `release/*`、发布标签、其他任务的 worktree/stash，
也不要使用宽泛的清理命令删除依赖目录、证据、生产备份或运行态数据。

## 5. Dependabot 分支

- 先核对 PR 的实际 diff、对应 advisory、当前 lockfile 和已完成的安全补丁。
- 已被主干修复或替代的旧 PR：说明对应现有版本与提交，关闭 PR，再删除旧分支；不要为清理而合并旧依赖快照。
- 仍有必要的更新：纳入一个有界的依赖 Slice，验证后正常交付；不盲目自动合并。
- 关闭过期 PR 不等于消除所有漏洞。不要顺便 dismiss 未解决的告警、禁用 Dependabot，
  或增加永久 ignore 规则；当前风险以 [风险登记表](DEPENDENCY_SECURITY_RISK_REGISTER.md) 为准。

## 6. 发布分支与标签

前端 CI 将构建产物写入 `release/<tag>` 并维护发布标签。这些是现行流水线的产物引用，
不是待合并的开发分支；普通分支清理不得删除、合回源码主干或手工重建它们。
