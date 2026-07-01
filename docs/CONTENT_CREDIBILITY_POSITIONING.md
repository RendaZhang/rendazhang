<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [内容可信度与个人定位](#%E5%86%85%E5%AE%B9%E5%8F%AF%E4%BF%A1%E5%BA%A6%E4%B8%8E%E4%B8%AA%E4%BA%BA%E5%AE%9A%E4%BD%8D)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [已确认输入](#%E5%B7%B2%E7%A1%AE%E8%AE%A4%E8%BE%93%E5%85%A5)
  - [Phase 10 目标](#phase-10-%E7%9B%AE%E6%A0%87)
  - [非目标](#%E9%9D%9E%E7%9B%AE%E6%A0%87)
  - [当前内容入口](#%E5%BD%93%E5%89%8D%E5%86%85%E5%AE%B9%E5%85%A5%E5%8F%A3)
  - [当前审计假设](#%E5%BD%93%E5%89%8D%E5%AE%A1%E8%AE%A1%E5%81%87%E8%AE%BE)
  - [内容原则](#%E5%86%85%E5%AE%B9%E5%8E%9F%E5%88%99)
  - [候选切片顺序](#%E5%80%99%E9%80%89%E5%88%87%E7%89%87%E9%A1%BA%E5%BA%8F)
  - [验证方法](#%E9%AA%8C%E8%AF%81%E6%96%B9%E6%B3%95)
  - [文档关系](#%E6%96%87%E6%A1%A3%E5%85%B3%E7%B3%BB)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 内容可信度与个人定位

- **作者**: 张人大
- **最后更新**: July 01, 2026, 12:42 (UTC+08:00)

## 文档目的

本文记录 Phase 10: Content And Credibility Polish 的公开安全规划。它用于在改写首页、
证书页、文档入口、SEO/GEO 元数据或 `llms.txt` 前，先统一个人定位、受众、可信证明、内容边界
和验证门禁。

Phase 10 的主题是内容可信度和个人定位。它承接 Phase 9 的外观与交互 polish，但不把内容工作
混入新的视觉 redesign、依赖升级、后端功能或 Nginx 运维变更。

## 已确认输入

来自站点维护者的当前方向：

| 项目 | 约定 |
| --- | --- |
| 主要受众 | 混合受众，包括招聘方、合作方、技术同行、AI/搜索摘要系统和普通访问者 |
| 核心标签 | AI 全栈开发、云原生工程 |
| 最重要的证明 | PersonalWeb、证书、工作/学习经历 |
| 首页感受 | 专业可信、技术感强、有创造力、更像个人品牌 |
| 避免感受 | 不要像简历模板 |
| 主要 CTA | 保留当前站点已有行动入口；如果内容审计证明有必要，可以新增或调整优先级 |
| 隐私边界 | 暂无额外限制；仍遵守公开仓库和站点既有敏感信息边界 |

## Phase 10 目标

Phase 10 应让访问者在短时间内理解：

- 张人大是谁，以及当前专业方向是什么。
- 为什么“AI 全栈开发”和“云原生工程”是合理定位，而不是空泛标签。
- PersonalWeb 本身如何作为工程能力证明。
- 公开证书、工作经历和学习经历如何支撑可信度。
- 访问者下一步应该看项目、看证书、阅读文档、联系、下载简历，还是打开 AI 助手。

内容表达应更像个人品牌和工程作品集，而不是传统简历页面。具体做法是优先展示主张、证据和行动入口，
再保留长经历细节给愿意深入阅读的人。

## 非目标

Phase 10 不做以下事情：

- 不重新设计视觉系统，不新增主题 palette，不重做 Phase 9 已完成的 UI polish。
- 不升级 Astro、React、Node、TypeScript、ESLint、Vitest 或其他依赖。
- 不修改后端、Nginx、Chat API、Chat Widget iframe 协议、认证流程或生产服务器服务。
- 不添加未公开的私人经历、私密联系方式、内部项目细节、客户敏感信息或运维细节。
- 不把所有内容一次性改成新的长篇叙事；内容切片必须小步修改、小步验证。

## 当前内容入口

Phase 10 主要关注以下公开 surface：

| Surface | 当前所有者 | 作用 |
| --- | --- | --- |
| 首页 hero / about / skills / experience / contact | `src/content/aboutContent.ts` 与 `src/components/sections/*` | 主要个人品牌入口和 CTA 承载面 |
| PersonalWeb 工程证明 | 当前分散在 README、docs、站点功能和运维文档中 | 可作为 AI 全栈、云原生交付、前后端协作和运维闭环的证明 |
| 证书页 | `src/content/certificationsContent.ts`、`src/constants/meta.ts`、Credly iframe | 公开 credential 证明，当前重点是 AWS SAA |
| 技术文档页 | `README.md` 渲染入口和 `docs/*` | 证明工程文档、架构、测试、部署和运维规范 |
| SEO/GEO 元数据 | `src/constants/meta.ts`、`public/llms.txt`、`public/sitemap.xml`、`docs/SEO_GEO.md` | 给搜索引擎和 AI 摘要系统提供一致公开实体信息 |
| Chat Widget / AI 聊天页 | `src/components/chat/*`、`/deepseek_chat/` | 交互能力入口；Phase 10 只评估 CTA 位置和文案，不改协议 |

## 当前审计假设

在正式 Slice 10.1 审计前，先记录以下低风险假设，后续需要用代码和页面截图核验：

- 首页已有足够多的事实信息，但当前结构更接近经历清单，PersonalWeb 作为项目证明的信号还不够集中。
- “AI 全栈开发”可以由 PersonalWeb、Chat Widget、前端交互、后端 CloudChat、Sentry/SEO/GEO、
  浏览器 smoke 和部署链路共同证明，但需要避免夸大成未展示的 AI 产品能力。
- “云原生工程”可以由 AWS/GCP、Kubernetes、Terraform、CI/CD、可观测性、后端经历和证书共同支撑。
- 证书页稳定但证明链较单点，应把 AWS SAA 与云原生/架构能力的关系说清楚。
- 工作/学习经历很完整，但对混合受众来说需要更强的信息层级：先给结论，再给细节。
- 当前 CTA 数量足够，Phase 10 更可能需要调整优先级和上下文，而不是大量新增按钮。

## 内容原则

- **证据优先**：每个强定位都应该能对应站内可见项目、证书、经历、文档或交互能力。
- **混合受众可读**：先用短句解释价值，再允许技术读者展开到具体栈、架构和验证细节。
- **双语一致**：中文和英文表达可以自然，不要求逐词直译，但定位、事实、日期和 CTA 必须一致。
- **公开安全**：公开仓库和页面不得加入 token、私有服务器信息、客户敏感信息、聊天内容或表单提交内容。
- **Schema 对齐**：可见内容、`llms.txt`、JSON-LD、Open Graph 和 sitemap 更新必须互相匹配。
- **不伪装规模**：PersonalWeb 可以展示工程完整性，但不应把个人站描述成超出事实的商业平台。

## 候选切片顺序

| Slice | 状态 | Scope |
| --- | --- | --- |
| `10.1 Content Audit And Positioning Plan` | `Ready` | 只读审计当前首页、证书、docs、SEO/GEO、`llms.txt` 和结构化数据，输出具体改文案/结构的优先级计划 |
| `10.2 Homepage Positioning And CTA Copy` | `Backlog` | 小步调整首页 hero、about、skills 摘要和 CTA 文案，让 AI 全栈/云原生定位更清楚 |
| `10.3 PersonalWeb Project Proof Surface` | `Backlog` | 把 PersonalWeb 作为项目证明沉淀到首页或 docs 入口，突出架构、部署、AI chat、SEO/GEO 和验证链路 |
| `10.4 Certifications And Learning Credibility` | `Backlog` | 强化证书页和学习经历与云原生/架构能力的关系，不改变 Credly iframe 协议 |
| `10.5 Work And Education Narrative Compression` | `Backlog` | 压缩长经历列表的信息层级，保留可验证事实，降低简历模板感 |
| `10.6 SEO GEO LLMS Alignment` | `Backlog` | 同步可见内容、JSON-LD、`llms.txt`、sitemap lastmod 和 SEO/GEO 文档 |
| `10.7 Content QA And Phase Close` | `Backlog` | 浏览器、移动端、搜索/AI 入口和公开安全复查，决定 Phase 10 是否关闭 |

实际顺序可以由 Slice 10.1 的审计结果调整。若一个切片变成纯视觉问题、依赖问题或后端问题，应移出
Phase 10。

## 验证方法

文档或计划-only 切片至少运行：

```bash
git diff --check
npm run sync
npm run lint
npm run typecheck
npm run check
pre-commit run --all-files
```

内容或元数据实现切片按风险补充：

- 修改首页/证书/docs 可见内容：运行 `npm run test:coverage` 和 `npm run smoke:browser`。
- 修改 JSON-LD：更新并运行 `src/__tests__/structuredData.test.ts` 相关覆盖。
- 修改 `llms.txt`、sitemap 或 canonical：本地构建后用 `rg`/`curl` 核对公开输出。
- 修改 CTA、导航、Chat Widget 入口或水合敏感组件：必须检查浏览器 console、移动端视口和
  Chat Widget iframe ready。

Phase 10 前端提交仍走 `master` push 触发 GitHub Actions 静态部署，不需要 SSH、重启前端服务、
重启后端或 reload Nginx。

## 文档关系

- SEO/GEO 维护见：[SEO / GEO 维护说明](./SEO_GEO.md)。
- 前端架构与 hydration 边界见：[前端架构约定](./FRONTEND_ARCHITECTURE.md)。
- 视觉 polish 已关闭，见：[外观与交互 Polish](./VISUAL_INTERACTION_POLISH.md)。
- 样式 token 和交互约定见：[样式说明](./STYLE_GUIDE.md) 和
  [交互组件标准](./INTERACTION_COMPONENT_STANDARDS.md)。
- 测试和浏览器 smoke 见：[测试指南](./TESTING.md)。
