<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [决策 001：采用特性目录结构](#%E5%86%B3%E7%AD%96-001%E9%87%87%E7%94%A8%E7%89%B9%E6%80%A7%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 决策 001：采用特性目录结构

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 04, 2025, 18:05 (UTC+8)

---

- **优点**：业务高内聚，相关文件放置在同一目录下，便于维护
- **缺点**：路径层级相对较深，需要在文档中保持说明

该结构将主要业务划分到 `features/` 目录，公共常量放在 `constants/`，服务请求集中在 `services/`。自定义 hooks 和领域模型分别位于 `hooks/` 与 `models/`，公用工具放在 `utils/`。

`features/` 下按照业务领域再细分 `chat/`、`auth/` 等子目录，每个子目录包含 `components/`、`hooks/` 与 `services/`，保持代码高度内聚。
