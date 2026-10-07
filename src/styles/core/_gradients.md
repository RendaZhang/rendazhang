# 渐变 Token 说明

`_gradients.css` 基于 `tokens.css` 中的颜色变量，提供了一组常用的渐变 Token。

## 通用渐变

- `--gradient-direction`：默认渐变方向。
- `--gradient-primary`：品牌主色渐变，常用于按钮或强调背景。
- `--gradient-dark`：深色主题下的主渐变。

三套主题在语义层把主渐变解析为同色双端点，以兼容现有 background 消费者；hover/active
采用明确实色，不做 brightness 放大。Hero 使用共享中性遮罩，保留原图与布局。

## 404 页面

- `--gradient-404-bg`：404 页背景。
- `--gradient-404-circle-1/2/3`：背景装饰圆形。
- `--gradient-404-signature-line`：签名线渐变。
- `--gradient-404-btn-primary`、`--gradient-404-btn-primary-hover`：主按钮渐变及悬停态。

## 50x 页面

- `--gradient-50x-bg`：50x 页背景。
- `--gradient-50x-decor-1/2`：装饰图形。
- `--gradient-50x-icon`：错误图标渐变。
- `--gradient-50x-signature-line`：签名线渐变。

所有渐变变量均通过 `var(--gradient-*)` 引用，避免在组件中直接定义线性渐变。
