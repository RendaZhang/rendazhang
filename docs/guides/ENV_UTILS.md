<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [环境变量工具函数](#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [API](#api)
    - [`getEnv(key)`](#getenvkey)
    - [`isProduction()`](#isproduction)
    - [`getCdnUrl(path)`](#getcdnurlpath)
  - [使用示例](#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)
  - [注意事项](#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 环境变量工具函数

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 05, 2025, 16:19 (UTC+08:00)

---

## 简介

`src/utils/env.js` 提供统一的环境变量访问层，可在 Node、浏览器与 SSR 环境中使用。

所有环境变量请通过该模块读取，避免在代码中直接访问 `process.env` 或 `import.meta.env`。

---

## API

### `getEnv(key)`

根据提供的 `key` 返回对应环境变量值，支持自动判断运行环境并处理 `PUBLIC_` 前缀。

### `isProduction()`

当 `NODE_ENV` 为 `'production'` 时返回 `true`。

### `getCdnUrl(path)`

基于 `CDN_BASE` 构建资源的完整 CDN 地址。

---

## 使用示例

```js
import { getEnv, isProduction, getCdnUrl } from '@/utils/env.js';

const baseUrl = getEnv('API_BASE_URL');
if (!isProduction()) {
  console.log('Current API:', baseUrl);
}

const logo = getCdnUrl('/images/logo.png');
```

---

## 注意事项

- 所有新代码应通过 `getEnv` 访问环境变量。
- 如需新增变量，在 `env.js` 的 `envKeyMap` 中添加映射。
