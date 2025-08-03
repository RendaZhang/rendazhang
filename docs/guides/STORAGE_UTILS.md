<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [存储工具函数](#%E5%AD%98%E5%82%A8%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [API](#api)
    - [`get(key, type?)`](#getkey-type)
    - [`set(key, value, type?, options?)`](#setkey-value-type-options)
    - [`remove(key, type?)`](#removekey-type)
    - [IndexedDB 异步方法](#indexeddb-%E5%BC%82%E6%AD%A5%E6%96%B9%E6%B3%95)
  - [使用示例](#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)
  - [注意事项](#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 存储工具函数

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 03, 2025, 16:44 (UTC+8)

---

## 简介

`src/utils/storage.js` 提供统一的存储操作接口，封装 `localStorage`、`sessionStorage`、Cookies、内存对象以及异步 `IndexedDB` 的读写逻辑，保证在不同环境下的兼容性。

---

## API

### `get(key, type?)`

读取指定 key 的值，`type` 默认为 `'local'`，可选 `'session'`、`'cookie'`。

### `set(key, value, type?, options?)`

写入指定 key 的值，`type` 同上。对于 `'cookie'` 类型，可通过 `options.days` 指定过期天数。

### `remove(key, type?)`

删除指定 key 的值，`type` 默认为 `'local'`。

### IndexedDB 异步方法

提供 `getIndexedDB`、`setIndexedDB` 与 `removeIndexedDB` 三个 Promise API，用于读写 `IndexedDB`。

---

## 使用示例

```js
import storage from '@/utils/storage';

storage.set('THEME_STORAGE_KEY', 'dark');
const theme = storage.get('THEME_STORAGE_KEY');
// theme === 'dark'
```

---

## 注意事项

- 在不支持 Web Storage 的环境下会回退到内存存储。
- Cookie 和 IndexedDB 操作仅在浏览器环境下有效。
- 若需要跨环境共享存储逻辑，请优先使用该工具而非直接操作 `localStorage`/`sessionStorage`。
