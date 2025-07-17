<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [前端 BUG 跟踪数据库](#%E5%89%8D%E7%AB%AF-bug-%E8%B7%9F%E8%B8%AA%E6%95%B0%E6%8D%AE%E5%BA%93)
  - [文档说明](#%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E)
  - [文档说明](#%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E-1)
  - [BUG 记录格式要求](#bug-%E8%AE%B0%E5%BD%95%E6%A0%BC%E5%BC%8F%E8%A6%81%E6%B1%82)
  - [BUG 详情](#bug-%E8%AF%A6%E6%83%85)
    - [BUG-001: Mermaid 图表渲染异常](#bug-001-mermaid-%E5%9B%BE%E8%A1%A8%E6%B8%B2%E6%9F%93%E5%BC%82%E5%B8%B8)
    - [BUG-002: highlight.js 与 Mermaid 冲突](#bug-002-highlightjs-%E4%B8%8E-mermaid-%E5%86%B2%E7%AA%81)
  - [问题状态](#%E9%97%AE%E9%A2%98%E7%8A%B6%E6%80%81)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 前端 BUG 跟踪数据库

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: July 17, 2025, 21:10 (UTC+8)

---

## 文档说明

本文档用于系统化跟踪前端项目中的 BUG，包含以下内容：

1. 详细 BUG 记录模板
2. 解决方案知识库

> 本文档系统化记录前端项目中的 BUG，包含问题现象、根本原因、解决方案及修复状态跟踪

---

## 文档说明

1. **目的**：建立可追溯的 BUG 知识库，避免重复问题
2. **更新流程**：
   - 新 BUG 发现后 24 小时内记录
   - 解决后更新状态和解决方案
3. **严重等级**：
   - ⚠️ 紧急（阻塞核心功能）
   - ⚠️ 高（影响用户体验）
   - ⚠️ 中（非核心功能问题）
   - ⚠️ 低（视觉/文案问题）

---

## BUG 记录格式要求

统一的记录格式便于后续检索和统计，推荐模版如下：

```markdown
### BUG-<编号>: <标题>

- **发现日期**：YYYY-MM-DD
- **重现环境**：浏览器版本、系统环境
- **问题现象**：
  - 描述 1
  - 描述 2
- **根本原因**：
  - 原因 1
- **解决方案**：
  - 步骤 1
- **验证结果**：✅/❌
- **经验总结**：可选的额外说明
```

状态跟踪通过在「问题状态」章节中的勾选框体现：`[ ]` 表示未解决，`[x]` 表示已修复。

---

## BUG 详情

### BUG-001: Mermaid 图表渲染异常

- **发现日期**：2025-07-17
- **重现环境**：Chrome 115+, macOS Ventura
- **问题现象**：
  - Mermaid 图表成功渲染后 1 秒内被还原为原始代码
  - 仅影响图表渲染，代码高亮功能正常
- **根本原因**：
  - React 重渲染覆盖了 Mermaid 生成的 SVG DOM
  - 状态更新导致组件重新渲染原始 Markdown
- **解决方案**：
  - 使用 ref 直接管理图表容器 DOM
  - 将 Mermaid 渲染移出 React 生命周期控制
  - 添加渲染状态持久化机制
- **相关代码**：
  ```jsx
  // AIMessage 组件修改
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = html;
      // Mermaid 渲染逻辑...
    }
  }, [html]);
  ```
- **验证结果**：✅ 所有图表渲染稳定
- **经验总结**：第三方 DOM 操作库需要与 React 渲染机制解耦

### BUG-002: highlight.js 与 Mermaid 冲突

- **发现日期**：2025-07-18
- **重现环境**：Chrome 138.0.7204.101, Windows 11
- **问题现象**：
  - 控制台出现 `WARN: Could not find the language 'mermaid'` 提示
- **根本原因**：
  - highlight.js 尝试解析 `language-mermaid` 代码块，但未加载对应语言模块
- **解决方案**：
  - 在高亮逻辑中忽略 `.language-mermaid` 区块
- **验证结果**：✅ WARN 消失，Mermaid 渲染正常
- **相关代码**：
  ```jsx
  document.querySelectorAll('pre code:not(.language-mermaid)').forEach(block => {
    hljs.highlightElement(block);
  });
  ```

---

## 问题状态

- [x] BUG-001: Mermaid 图表渲染异常
- [x] BUG-002: highlight.js 与 Mermaid 冲突
