<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [语言工具函数](#%E8%AF%AD%E8%A8%80%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [API](#api)
    - [`getCurrentLang()`](#getcurrentlang)
  - [使用示例](#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)
  - [注意事项](#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 语言工具函数

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 04, 2025, 18:05 (UTC+8)

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
