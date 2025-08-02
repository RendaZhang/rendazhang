# 决策：采用特性目录结构

- **优点**：业务高内聚，相关文件放置在同一目录下，便于维护
- **缺点**：路径层级相对较深，需要在文档中保持说明

该结构将主要业务划分到 `features/` 目录，公共常量放在 `constants/`，服务请求集中在 `services/`。自定义 hooks 和领域模型分别位于 `hooks/` 与 `models/`，公用工具放在 `utils/`。

`features/` 下按照业务领域再细分 `chat/`、`auth/` 等子目录，每个子目录包含 `components/`、`hooks/` 与 `services/`，保持代码高度内聚。
