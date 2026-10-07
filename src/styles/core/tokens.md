# 颜色 Token 说明

`tokens.css` 集中定义基础配色变量，组件应通过 `var(--token)` 引用颜色，以便统一维护与主题切换。面向当前主题的语义别名和 `html[data-theme='dark']` 覆盖由 `theme-tokens.css` 维护。

## 品牌色 (Brand)

`--palette-ink-light-*` / `--palette-ink-dark-*` 是默认墨与朱的完整 sRGB 参考值，包含
canvas、surface、subtle、text、muted、边界、primary/on-primary、状态及其背景。
`--palette-ink-hero` 与三个 shadow 值约束遮罩/阴影。它们通过语义层消费，不能覆盖绝对
白/黑或原始灰阶。`--palette-cobalt-light/dark-*` 和 `--palette-pine-light/dark-*`
提供其余四组完整值，包含独立的 accent/decoration。旧 Aurora/Forest 品牌别名映射新浅色参考值；
状态、遮罩和阴影继续共享已验收的 Ink 参考值。完整色表见
[Personal Theme Palettes](../../../docs/PERSONAL_THEME_PALETTES.md)。

| 变量                      | 说明                                 | 作用范围 |
| ------------------------- | ------------------------------------ | -------- |
| `--color-brand`           | 主品牌色，用于链接和主按钮等主要操作 | 全局     |
| `--color-accent`          | 强调色，用于高亮和焦点               | 全局     |
| `--color-brand-secondary` | 品牌次级色，常用于悬停或渐变搭配     | 全局     |
| `--color-brand-tertiary`  | 品牌三级色，用于渐变和淡色背景       | 全局     |
| `--color-brand-blue`      | 信息类蓝色，用于提示或链接           | 全局     |
| `--color-spinner`         | 加载指示器颜色                       | 组件     |

## 语义色 (Semantic)

| 变量                     | 说明                   |
| ------------------------ | ---------------------- |
| `--color-success`        | 成功状态（提示、按钮） |
| `--color-warning`        | 警告状态               |
| `--color-error`          | 错误或危险操作         |
| `--color-warning-accent` | 警告背景或边框的强调色 |

## 中性色 (Neutral)

用于文本、背景和边框的灰度层级。

- `--color-gray-900`：浅色背景下的最高对比文本。
- `--color-gray-800`：深色表面背景。
- `--color-gray-100`：卡片和面板背景。
- `--color-gray-50`：页面背景。
- `--color-text-muted`、`--color-text-darker`、`--color-text-deep`：不同层级的文字色。
- `--color-border-light`、`--color-border-muted`、`--color-border-soft`、`--color-border-neutral`：边框色阶。
- `--color-subtle-bg`、`--color-subtle-bg-alt`、`--color-subtle-bg-hover`：中性背景与悬停态。
- 其他变量如 `--color-gray-medium`、`--color-light-gray` 等用于图标或占位符。

## 阴影与遮罩 (Shadows & Overlays)

统一的阴影和遮罩通过 `--shadow-*` 与 `--overlay-*` Token 提供。

- `--focus-ring`：键盘焦点环。
- `--shadow-elevation-1/2/3`：基础海拔阴影。
- `--overlay-modal-bg`：模态框背景遮罩。

## Markdown 与页面专用

- `--color-md-*`：Markdown 渲染所用色彩。
- `--color-404-*`、`--color-50x-*`：错误页专用色彩。

如需新增颜色 Token，请在 `tokens.css` 中定义，并在此文件补充说明。

如需新增全站主题语义别名，请在 `theme-tokens.css` 中定义，并在 `theme-tokens.md` 中补充说明。
