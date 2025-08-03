<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [语言工具函数](#语言工具函数)
  - [简介](#简介)
  - [API](#api)
    - [`getCurrentLang()`](#getcurrentlang)
  - [使用示例](#使用示例)
  - [注意事项](#注意事项)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 语言工具函数

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 04, 2025, 00:54 (UTC+8)

---

## 简介

`src/utils/langUtils.js` 提供与语言相关的辅助方法。它优先读取 `<html>` 标签的 `lang` 属性，其次检查统一的 `storage` 中的 `LANG_STORAGE_KEY`，最后默认返回 `zh-CN`。

---

## API

### `getCurrentLang()`

返回当前页面语言，执行顺序如下：

1. `document.documentElement.lang`
2. `storage.get(LANG_STORAGE_KEY)`
3. `'zh-CN'`

---

## 使用示例

```js
import { getCurrentLang } from '@/utils/langUtils';

const lang = getCurrentLang();
console.log(lang); // 'zh-CN'
```

---

## 注意事项

 - 依赖 [`storage` 工具](./STORAGE_UTILS.md)，在不支持 `localStorage` 的环境中也能读取语言设置。
- 如需扩展更多语言相关逻辑，可在此文件中继续封装。
