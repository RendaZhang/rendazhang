# Theme Token 说明

`theme-tokens.css` 负责把基础 Token 映射为当前主题可直接消费的语义变量，并集中维护 `html[data-theme='dark']` 下的暗色主题覆盖。

## 所有权

- `tokens.css` 定义基础值：品牌色、中性色、状态色、间距、排版、阴影和页面专用色。
- `_gradients.css` 定义基于基础色的渐变 Token。
- `theme-tokens.css` 定义主题语义别名，例如 `--color-bg`、`--color-text`、`--color-surface`、`--color-nav-bg`、`--shadow-login`、`--overlay-surface` 和旧 Markdown 别名。
- 组件级 Token 和组件局部变量仍属于对应 `src/styles/components/*` 文件。

## 约定

- 新增全站语义主题变量时，优先放在 `theme-tokens.css`，并同时提供浅色默认值和必要的 `html[data-theme='dark']` 覆盖。
- 不在 `theme.css` 中直接维护变量映射；`theme.css` 只负责入口、导入顺序、reset、base 和保留的 overrides layer。
- 不在组件样式中重新定义全站语义变量；组件只消费这些变量，或定义自己的组件局部变量。
- 不改变 `data-theme` 契约；主题切换仍由 BaseLayout 初始化脚本和 `ThemeProvider` 同步到 `<html>`。
