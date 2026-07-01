<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [内容可信度与个人定位](#%E5%86%85%E5%AE%B9%E5%8F%AF%E4%BF%A1%E5%BA%A6%E4%B8%8E%E4%B8%AA%E4%BA%BA%E5%AE%9A%E4%BD%8D)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [已确认输入](#%E5%B7%B2%E7%A1%AE%E8%AE%A4%E8%BE%93%E5%85%A5)
  - [Phase 10 目标](#phase-10-%E7%9B%AE%E6%A0%87)
  - [非目标](#%E9%9D%9E%E7%9B%AE%E6%A0%87)
  - [当前内容入口](#%E5%BD%93%E5%89%8D%E5%86%85%E5%AE%B9%E5%85%A5%E5%8F%A3)
  - [当前审计假设](#%E5%BD%93%E5%89%8D%E5%AE%A1%E8%AE%A1%E5%81%87%E8%AE%BE)
  - [Slice 10.1 审计结果](#slice-101-%E5%AE%A1%E8%AE%A1%E7%BB%93%E6%9E%9C)
    - [审计后的切片顺序](#%E5%AE%A1%E8%AE%A1%E5%90%8E%E7%9A%84%E5%88%87%E7%89%87%E9%A1%BA%E5%BA%8F)
    - [需要 owner 决策的问题](#%E9%9C%80%E8%A6%81-owner-%E5%86%B3%E7%AD%96%E7%9A%84%E9%97%AE%E9%A2%98)
  - [内容原则](#%E5%86%85%E5%AE%B9%E5%8E%9F%E5%88%99)
  - [候选切片顺序](#%E5%80%99%E9%80%89%E5%88%87%E7%89%87%E9%A1%BA%E5%BA%8F)
  - [验证方法](#%E9%AA%8C%E8%AF%81%E6%96%B9%E6%B3%95)
  - [文档关系](#%E6%96%87%E6%A1%A3%E5%85%B3%E7%B3%BB)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 内容可信度与个人定位

- **作者**: 张人大
- **最后更新**: July 01, 2026, 12:57 (UTC+08:00)

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

## Slice 10.1 审计结果

审计时间：2026-07-01。审计对象包括 `src/content/aboutContent.ts`、
`src/content/certificationsContent.ts`、`src/constants/meta.ts`、`public/llms.txt`、
`public/sitemap.xml`、首页 section 组件、`README.md` / `README_EN.md`、`/docs/`
渲染入口和证书页入口。

总体结论：

- 当前内容对 Java/Spring 后端、云原生平台、金融科技和保险平台经历的证明较强。
- “AI 全栈开发”仍主要由 Chat Widget、`/deepseek_chat/`、React/Astro 前端、Flask/OpenAI
  后端和文档体系间接体现，首页首屏和元信息尚未形成清晰主张。
- PersonalWeb 是最强的自有项目证明，但证据分散在 README、架构文档、Chat Widget、
  SEO/GEO、CI/CD、测试和部署说明中，需要被包装成一个可扫读的旗舰项目证明。
- 证书页稳定可验证，但当前只展示单个 AWS SAA 证书，缺少它与云原生架构能力之间的短解释。
- 工作/学习经历可信且完整，但长列表更像简历正文；混合受众需要先看到摘要判断，再进入细节。
- 现有 CTA 数量足够，下一步应优先调整语境和优先级，而不是新增大量入口。

| Surface | 当前强项 | 主要缺口 | 对 Phase 10 定位的支撑 | 建议后续动作 |
| --- | --- | --- | --- | --- |
| 首页 hero 与首屏 CTA | 有姓名、后端、云原生、金融科技、Kubernetes/Terraform 和经历/联系入口 | 没有直接表达 AI full-stack；首屏 CTA 更偏“经历/联系”，没有把 PersonalWeb、docs 或证书作为证明入口 | 强支撑 cloud-native 和 work proof；弱支撑 AI full-stack 与 flagship proof | Slice 10.2 调整 hero/kicker/tagline 和 CTA 语境，保持现有入口集合 |
| About 段落与个人信息 | 覆盖深圳、Java/Spring、OneConnect、AWS/GCP、Kubernetes、Terraform、可观测性、前端协作、AWS SAA 和学历 | 信息密度高且偏履历；PersonalWeb 和 AI chat 没有作为当前能力证明出现 | 支撑专业可信，但 personal-brand 主张不够集中 | Slice 10.2 先改摘要顺序，Slice 10.5 再压缩长经历 |
| Skills | 云平台、微服务、API、数据、消息、CI/CD、可观测性、React/TypeScript/SSR 等覆盖完整 | AI / LLM 应用能力没有被安全、具体地表达；前端能力在列表中靠后 | 支撑 full-stack 基础，但 AI full-stack 标签需要更明确证据链 | Slice 10.2 小范围重排/改写技能摘要，不新增夸大能力 |
| Experience 与 Education | 有公司、角色、摘要、交付、Kubernetes/GCP、CI/CD、团队扩张、压测、业务结果和学历事实 | Michaels 与早期经历 bullet 较长，读者需要先看到 proof summary；教育信息可更紧凑 | 强支撑 work/education proof；resume-template 风险最高 | Slice 10.5 做 summary-first 压缩，保留可验证事实 |
| PersonalWeb / README / docs | README 和 docs 已说明 Astro/React、Flask/OpenAI、Nginx、GitHub Actions、Chat Widget、SEO/GEO、测试、架构和维护规范 | 更像维护文档目录，不像面向访问者的项目 proof surface；证据分散 | 最强支撑 AI full-stack、cloud-native delivery 和工程闭环 | Slice 10.3 增加/强化 PersonalWeb 项目证明入口 |
| Certifications | AWS SAA 标题、日期、过期日期、Credly 和 AWS 验证入口稳定 | 页面缺少证书与云原生架构/平台能力的短叙事；单证书页面证明链较薄 | 强支撑 cloud-native credibility，弱支撑 broader proof hierarchy | Slice 10.4 加短解释，不改 Credly iframe 协议 |
| SEO/GEO 与 JSON-LD | Person、WebSite、ProfilePage、WebPage、CollectionPage、Credential 和 breadcrumb 已集中在 `meta.ts` | 当前元描述和 `knowsAbout` 仍更偏 backend/cloud/FinTech；AI full-stack 与 PersonalWeb proof 需等可见内容确定后同步 | 支撑搜索实体一致性，但不应先于可见内容改写 | Slice 10.6 在 visible content 完成后统一同步 |
| `llms.txt` 与 sitemap | Canonical、主页面、public profiles、隐私边界和 primary/secondary page 区分清楚 | `llms.txt` 未体现新的 AI full-stack 主标签；sitemap `lastmod` 需要跟随主要内容变化 | 支撑 AI 摘要入口，但应避免提前承诺未落地内容 | Slice 10.6 同步 `llms.txt`、sitemap lastmod 和 metadata |
| CTA surfaces | 首页经历/联系、简历下载、联系表单、导航 docs/certifications/AI chat、Chat Widget 都已存在 | 证明型 CTA 分散在导航和页面底层，首屏没有建立“先看证据”的路径 | CTA 集合足够，层级需要更贴合 mixed audience | Slice 10.2 优先调整文案和顺序，不新增复杂流程 |

### 审计后的切片顺序

| 优先级 | Slice | 结论 |
| --- | --- | --- |
| 1 | `10.2 Homepage Positioning And CTA Copy` | 作为下一片。先让首页首屏、about 摘要、技能摘要和 CTA 语境承接 AI full-stack / cloud-native 主张，为后续 proof surface 铺路 |
| 2 | `10.3 PersonalWeb Project Proof Surface` | 把 PersonalWeb 从分散维护材料整理成可扫读的旗舰项目证明，覆盖前端、后端、AI chat、SEO/GEO、CI/CD、测试和部署闭环 |
| 3 | `10.4 Certifications And Learning Credibility` | 解释 AWS SAA 如何支撑云原生架构可信度，同时保留现有 Credly/AWS 验证方式 |
| 4 | `10.5 Work And Education Narrative Compression` | 把长经历列表改成 summary-first proof，减少简历模板感 |
| 5 | `10.6 SEO GEO LLMS Alignment` | 在可见内容稳定后统一同步 JSON-LD、Open Graph、`llms.txt`、sitemap 和 SEO/GEO 文档 |
| 6 | `10.7 Content QA And Phase Close` | 进行浏览器、移动端、metadata、公开安全和中英文一致性 QA，决定是否关闭 Phase 10 |

### 需要 owner 决策的问题

以下问题不阻塞 Slice 10.2，但在 10.3 或 10.5 前需要确认：

- PersonalWeb 项目证明应该放在首页新 section，还是优先放在 `/docs/` / README 入口中并从首页链接过去？
- 是否允许把可见职业标签从“Backend / Cloud / FinTech”扩展为“AI Full-Stack / Cloud-Native /
  FinTech”，前提是文案只引用站内已公开的 Chat Widget、前端、后端和部署证据？
- Work/education 压缩时，是否保留全部公司 bullet，只改变层级，还是允许把较旧 freelance / early-career
  bullet 合并成更短摘要？

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
| `10.1 Content Audit And Positioning Plan` | `Done` | 已完成当前首页、证书、docs、SEO/GEO、`llms.txt` 和结构化数据审计，并确认后续优先级 |
| `10.2 Homepage Positioning And CTA Copy` | `Ready` | 小步调整首页 hero、about、skills 摘要和 CTA 文案，让 AI 全栈/云原生定位更清楚 |
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
