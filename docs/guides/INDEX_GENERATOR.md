<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [索引文件自动生成脚本](#%E7%B4%A2%E5%BC%95%E6%96%87%E4%BB%B6%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E8%84%9A%E6%9C%AC)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
  - [维护建议](#%E7%BB%B4%E6%8A%A4%E5%BB%BA%E8%AE%AE)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 索引文件自动生成脚本

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 04, 2025, 22:34 (UTC+08:00)

---

## 简介

该脚本使用 Node.js 的 `fs/promises` 与 `path` 递归扫描 `src` 目录，为每个包含 JS/TS 模块的目录生成或更新 `index.js` 文件，自动同步具名与默认导出。脚本位于 `scripts/generateIndex.mjs`。

## 使用方法

在项目根目录执行：

```bash
npm run generate-index
```

生成器会覆盖现有 `index.js`（如有）或创建新文件，确保目录导出完整。该命令也会在 `pre-commit` 钩子中自动运行，无需手动执行即可保持导出同步。

默认导出会使用原始文件名作为导出别名，从而保持大小写一致。例如：

```
// src/hooks/useChatHistory.js
export default function useChatHistory() {}

// 生成的 src/hooks/index.js 片段
export { default as useChatHistory } from './useChatHistory.js';
```

## 维护建议

- 新增或移动模块后可手动运行脚本确认导出正确。
- 如需支持更多文件类型或自定义规则，可修改 `scripts/generateIndex.mjs`。
- 确保本地环境 Node.js 版本符合项目要求（建议 v18+）。
