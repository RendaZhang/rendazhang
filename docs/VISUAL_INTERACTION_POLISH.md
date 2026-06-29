<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [外观与交互 Polish](#%E5%A4%96%E8%A7%82%E4%B8%8E%E4%BA%A4%E4%BA%92-polish)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [当前基线](#%E5%BD%93%E5%89%8D%E5%9F%BA%E7%BA%BF)
  - [2026-06-30 审计记录](#2026-06-30-%E5%AE%A1%E8%AE%A1%E8%AE%B0%E5%BD%95)
  - [目标](#%E7%9B%AE%E6%A0%87)
  - [非目标](#%E9%9D%9E%E7%9B%AE%E6%A0%87)
  - [视觉与交互原则](#%E8%A7%86%E8%A7%89%E4%B8%8E%E4%BA%A4%E4%BA%92%E5%8E%9F%E5%88%99)
  - [审计对象](#%E5%AE%A1%E8%AE%A1%E5%AF%B9%E8%B1%A1)
  - [候选切片顺序](#%E5%80%99%E9%80%89%E5%88%87%E7%89%87%E9%A1%BA%E5%BA%8F)
  - [验证方法](#%E9%AA%8C%E8%AF%81%E6%96%B9%E6%B3%95)
  - [文档关系](#%E6%96%87%E6%A1%A3%E5%85%B3%E7%B3%BB)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 外观与交互 Polish

- **作者**: 张人大
- **最后更新**: June 30, 2026, 01:10 (UTC+08:00)

## 文档目的

本文记录 Phase 9: Visual And Interaction Polish 的公开安全边界。它用于在改动 UI
之前，先统一当前站点的视觉基线、交互 polish 原则、验证方式和候选切片顺序。

Phase 9 的默认方向是更鲜明、有记忆点，但仍保持专业、现代、可信。它不是内容叙事重写、
不是组件库重做，也不是依赖或框架升级阶段。

## 当前基线

只读视觉审计基于生产站点和本地代码文档。当前结论如下：

- Phase 8 已关闭，浏览器 smoke、theme palette、交互标准、SEO/GEO、结构化数据、auth
  console 噪声和 bundle warning triage 都已完成。
- Slice 9.2 已收紧首页 hero 高度，在 `1366x900` 下让下一段内容进入首屏，并把已有
  `heroTaglines`、主行动入口和继续阅读提示纳入首屏层级。
- `default`、`aurora`、`forest` palette 已可用，并通过语义 token 影响 hero overlay、导航
  hover/active、社交入口、section marker 和 Chat Widget 按钮外环。
- 主题菜单功能完整，但视觉上偏工具化，后续可以提升状态反馈、可扫读性和 palette 识别度。
- Chat Widget iframe ready 协议稳定，但打开后的 loading surface 仍有 polish 空间。
- 移动端首屏可读且没有明显横向溢出，但仍需要系统化截图、console 和交互 QA。

这些问题不是生产故障；它们是 Phase 9 的用户体验改进机会。

## 2026-06-30 审计记录

Slice 9.1 对生产站点进行了只读视觉与交互审计。Browser 自动化在完整审计脚本中超时后，
按本文验证边界改用 Playwright fallback。截图保存在 `/tmp/rendazhang-slice-9-1/`，只作为
本地审计证据，不提交到仓库。

检查范围：

- 桌面 `1366x900`：首页、主题菜单、`forest` palette、Chat Widget、`/docs/`、
  `/certifications/`。
- 移动端 `390x844`：首页、主题菜单、`forest` palette、Chat Widget。
- Console：检查 homepage load、打开主题菜单、切换 palette、打开 Chat Widget、docs 和
  certifications 页面后的 warning/error。

确认正常的部分：

- 首页、docs、certifications、主题菜单、palette 切换和 Chat Widget 打开路径没有新的
  warning/error console 输出。
- 桌面与移动端均未发现横向溢出。
- `html[data-palette]` 能在 `default` 与 `forest` 之间正确切换，主题菜单的
  `aria-expanded` 与 palette swatch 的 `aria-pressed` 状态正常。
- Chat Widget 能加载同源 `/deepseek_chat/` iframe，ready 后 iframe 带
  `is-loaded` class；当前 iframe 协议没有回归。
- `/docs/` 和 `/certifications/` 均有 SSR/SSG 可见正文，不再是空 loader。

优先级发现：

| 优先级 | 发现 | 证据 | 建议 |
| --- | --- | --- | --- |
| P1 | 桌面首屏层级需要调整 | `1366x900` 下 hero 高约 `975px`，底部落在视口外，下一段从约 `1111px` 开始，首屏看不到后续内容提示 | 下一实现 slice 优先处理 hero 高度、主信息层级、CTA/social 入口和下一段 peeking |
| P1 | Palette 影响范围仍偏小 | `default` 到 `forest` 的变化主要体现在 Chat 按钮、Chat 外壳和小 swatch；首页整体气质几乎不变 | 通过语义 token 扩大 palette 到 hero overlay、主行动入口、section marker、focus ring 和关键链接 |
| P2 | 主题菜单功能完整但偏工具化 | 桌面与移动端菜单只由小图标和小色块表达，选中态主要靠边框；可扫读性弱 | 在后续交互 polish 中改善标签、分组、触屏目标和 selected feedback，不改变 store/provider 边界 |
| P2 | Chat Widget 外壳可继续 polish | ready 协议稳定；移动端 panel 接近全屏并覆盖正文，loading/ready surface 缺少更明确的浮层层级 | 保留 iframe 协议，后续只改善外壳、loading surface、移动端边界和关闭反馈 |
| P2 | Docs 与 certifications 页面视觉层级偏原始 | docs 首屏像原始 Markdown TOC；certification card 稳定但层级和页面导读较朴素 | 放在首页/palette 后处理，避免把 Phase 9 第一片扩大成多页面 redesign |
| P3 | 移动端当前稳定 | `390x844` 首页和 Chat Widget 没有横向溢出，正文可读 | 保持为后续实现 slice 的必测证据，不作为第一实现片单独启动 |

推荐第一实现 slice：

`9.2 Homepage First Impression And Palette Impact`。该片应把最高影响的首屏层级和 palette
可见度放在一起做小范围实现：优先调整 hero/section/CTA/social/Chat toggle 等现有 surface，
通过 `data-palette` 与语义 token 扩大视觉差异，同时保留现有内容叙事、Chat Widget 协议、
SEO/GEO 元数据、依赖和运行时。

Slice 9.2 已按上述边界落地。验证截图保存在 `/tmp/rendazhang-slice-9-2/`，不提交仓库；
`1366x900` 首页截图中 hero 高约 `630px`，下一段内容顶部约 `786px`，首屏可见；`390x844`
截图未发现横向溢出。后续 Phase 9 应优先处理交互反馈一致性，而不是继续扩大首页改动范围。

## 目标

Phase 9 关注首屏观感、palette 感知、交互反馈和移动端表现：

- 让 palette 对页面气质的影响更明显，同时继续通过 token 和 `data-palette` 管理。
- 优化首页第一印象，让桌面首屏的层级、行动入口和后续内容提示更清楚。
- 提升导航、主题菜单、按钮、链接、卡片、表单和 Chat Widget 的 hover、focus、active、loading
  等反馈一致性。
- 让动效更轻量、更有方向感，并遵守 `prefers-reduced-motion`。
- 为移动端建立更稳定的视觉 QA 证据，覆盖首页、导航、主题切换和 Chat Widget。

## 非目标

Phase 9 不做以下事情：

- 不重写职业叙事、case study、项目内容或整体信息架构。
- 不升级 Astro、React、Node、TypeScript、ESLint、Vitest 或其他依赖。
- 不引入新的组件库或大规模替换现有 CSS 架构。
- 不修改后端、Nginx、Chat API 协议、Chat Widget iframe 协议或生产服务器服务。
- 不为了视觉效果绕过 token、对比度、focus、keyboard 或 reduced-motion 约束。

## 视觉与交互原则

- 更鲜明的视觉应该来自语义 token、palette 映射、局部强调面、清楚的状态反馈和更好的层级，
  不应来自散落的硬编码颜色。
- Palette 改动应影响用户能感知的关键位置，例如主行动入口、导航选中态、section marker、
  focus ring、Chat Widget 外壳和 docs 链接状态。
- 首屏 polish 应避免夸张重做；优先解决信息密度、视线引导、下一段内容提示和移动端稳定性。
- 动效应短、明确、可取消；默认使用现有 `--duration-*`、`--easing-*` token，并尊重
  `prefers-reduced-motion`。
- 交互反馈必须同时覆盖鼠标、键盘、触屏和 iframe 场景，不能只验证视觉截图。
- 新增视觉元素必须保持公开站点的专业可信风格，避免无主的大面积装饰、与内容无关的背景效果
  或单一色相堆叠。

## 审计对象

Phase 9 的主要审计对象：

- 首页：hero、头像/照片区域、主要 CTA、社交链接、section 过渡和首屏下沿。
- 导航和主题切换：light/dark、palette swatch、菜单打开/关闭、选中态、focus 和触屏目标。
- Chat Widget：右下角按钮、打开面板、loading surface、iframe ready、移动端占位和关闭行为。
- Docs：Markdown 链接、代码块、Mermaid、表格、标题锚点和 palette 对文档阅读体验的影响。
- Certifications：Credly iframe、卡片层级、外链状态和移动端嵌入体验。
- 移动端：390x844 作为默认窄屏基线，并按改动范围补充关键断点。

## 候选切片顺序

1. `9.1 Visual Interaction Audit And Polish Plan`：只读审计和计划细化，输出优先级、截图证据和
   后续 slice 边界。已完成后，推荐把首屏层级和 palette 可见度合并为第一实现片。
2. `9.2 Homepage First Impression And Palette Impact`：已完成。桌面首屏层级、下一段内容提示、
   主行动入口和 palette 在 hero、section、focus 与关键控件中的可感知范围已收紧。
3. `9.3 Interaction Feedback Consistency`：统一 hover、focus、active、loading、disabled 和
   reduced-motion 行为。
4. `9.4 Chat Widget Surface Polish`：改善 Chat Widget 按钮、面板 loading surface 和移动端表现。
5. `9.5 Docs And Certifications Surface Polish`：改善 docs 导读、Markdown 首屏层级和 certification
   card/page hierarchy。
6. `9.6 Mobile Visual QA`：补齐移动端视觉和交互 QA，整理残余问题。

实际顺序可以根据 9.1 的审计结果调整；每个实现 slice 都应保持小范围、可验证。

## 验证方法

视觉与交互 slice 的验证应以真实浏览器为准：

- 优先使用 Browser 插件进行只读或本地预览检查。
- 如果 Browser 控制超时或不可用，可以使用 Playwright fallback；截图只保存在 `/tmp` 等临时目录，
  不提交到仓库。
- 默认截图/检查视口包括桌面 `1366x900` 和移动端 `390x844`，并按改动范围补充其他断点。
- 记录 `html[data-theme]`、`html[data-palette]`、关键交互状态、console warning/error 和
  Chat Widget iframe ready 证据。
- 影响主题、导航、Chat Widget、iframe、hydration 或 CSP 的实现 slice 必须运行
  `npm run smoke:browser`。
- 文档或计划-only slice 不需要 `npm run test:coverage` 或 `npm run smoke:browser`，但最终报告要说明
  不适用原因。

## 文档关系

- Phase 8 平台基础见：[前端体验平台 RFC](./FRONTEND_EXPERIENCE_PLATFORM.md)。
- 样式 token 和 CSS 分层见：[样式说明](./STYLE_GUIDE.md)。
- Theme mode、palette 和 accent 设计见：[主题调色板 Token 模型](./THEME_PALETTE_TOKEN_MODEL.md)。
- 交互组件行为标准见：[交互组件标准](./INTERACTION_COMPONENT_STANDARDS.md)。
- 验证命令和视觉 QA 记录方式见：[测试指南](./TESTING.md)。
