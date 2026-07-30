# 主题定制

本指南将详细介绍如何定制博客主题和样式。

## 样式文件

### 全局样式
全局样式定义在 `src/styles/global.css` 中，包含：

- 基础样式重置
- CSS 变量定义
- 主题颜色配置
- 响应式断点

### 排版样式
排版样式定义在 `src/styles/typography.css` 中，包含：

- 字体设置
- 标题样式
- 段落样式
- 引用样式
- 代码样式

## 颜色主题

### 主题色变量

本项目使用 Tailwind CSS v4，主题色通过 `src/styles/global.css` 中的 CSS 自定义属性控制。亮色和暗色各有一套独立的颜色值：

```css
:root,
html[data-theme="light"] {
  --background: #fdfdfd;   /* 页面背景 */
  --foreground: #282728;   /* 文字前景 */
  --accent: #006cac;       /* 强调色 */
  --muted: #e6e6e6;        /* 弱化背景 */
  --border: #ece9e9;       /* 边框颜色 */
}

html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60;
  --border: #ab4b08;
}
```

这些 CSS 变量通过 `@theme inline` 映射为 Tailwind 工具类，因此可以直接使用 `bg-background`、`text-foreground`、`text-accent`、`bg-muted`、`border-border` 等类名。

### 自定义颜色

修改 `src/styles/global.css` 中的变量值即可更改主题色：

1. 修改变量值（`--accent`、`--background` 等）
2. 亮色和暗色各自独立设置
3. 保存后热更新即时生效

### 暗色主题切换

主题通过 `<html>` 标签的 `data-theme` 属性控制：
- `data-theme="light"` → 亮色
- `data-theme="dark"` → 暗色
- 无属性时跟随系统偏好（通过 `prefers-color-scheme` 媒体查询）

主题切换按钮会更新 `data-theme` 属性并持久化到 `localStorage`，刷新后保持用户选择。

### 添加新颜色变量

如需添加更多自定义颜色，在 `:root` / `html[data-theme="dark"]` 中定义变量，然后在 `@theme inline` 中注册：

```css
:root {
  --highlight: #ffdd57;
}

html[data-theme="dark"] {
  --highlight: #ffab00;
}

@theme inline {
  --color-highlight: var(--highlight);
}
```

之后即可使用 `bg-highlight`、`text-highlight` 等 Tailwind 类名。

## Tailwind CSS 配置

### 无需 tailwind.config.js

本项目使用 **Tailwind CSS v4**，采用 CSS-first 配置方式。所有 Tailwind 配置（主题颜色、自定义变体、工具类）均直接写在 `src/styles/global.css` 中，无需 `tailwind.config.js` 文件。

### 当前自定义配置

```css
/* 自定义暗色变体：匹配 data-theme 属性 */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

/* 颜色变量映射 */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --color-border: var(--border);
}

/* 自定义工具类 */
@utility max-w-app {
  @apply max-w-3xl;
}
```

如需扩展，直接在 `global.css` 中添加 `@theme inline` 变量或 `@utility` 工具类即可，无需额外配置文件。

## 组件定制

### 布局组件
布局组件位于 `src/components/` 目录：

- `Header.astro` - 页面头部
- `Footer.astro` - 页面底部
- `Layout.astro` - 主布局
- `PostDetails.astro` - 文章详情布局

### 功能组件
功能组件包括：

- `BackToTopButton.astro` - 返回顶部按钮
- `Breadcrumb.astro` - 面包屑导航
- `Card.astro` - 卡片组件
- `Pagination.astro` - 分页组件
- `Socials.astro` - 社交链接
- `ShareLinks.astro` - 分享链接

### 自定义组件
可以在 `src/components/` 目录中创建自定义组件：

```astro
---
// src/components/CustomComponent.astro
---

<div class="custom-class">
  <slot />
</div>
```

## 字体定制

### 字体配置
在 `src/config.ts` 中配置字体：

```typescript
// 虽然没有直接的字体配置，但可以在 CSS 中定义
```

### Google Fonts
如需使用 Google Fonts，可以在 `src/layouts/Layout.astro` 中添加：

```astro
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
```

## 图标定制

### 图标文件
图标位于 `src/assets/icons/` 目录，使用 SVG 格式。

### 添加新图标
1. 将 SVG 文件放入 `src/assets/icons/` 目录
2. 在组件中导入并使用：

```astro
---
import IconName from '~/assets/icons/IconName.svg';
---

<IconName />
```

## 响应式设计

### 断点配置
响应式断点在 CSS 中定义：

```css
/* 在 global.css 中 */
@media (min-width: 640px) {
  /* 小屏幕断点 */
}

@media (min-width: 768px) {
  /* 中等屏幕断点 */
}

@media (min-width: 1024px) {
  /* 大屏幕断点 */
}

@media (min-width: 1280px) {
  /* 超大屏幕断点 */
}
```

## 动画和过渡

### CSS 过渡
在 CSS 中定义过渡效果：

```css
.transition {
  transition: all 0.3s ease;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
```

## 自定义页面

### 创建新页面
在 `src/pages/` 目录中创建新页面：

```astro
---
// src/pages/custom-page.astro
import Layout from '~/layouts/Layout.astro';
---

<Layout title="自定义页面">
  <h1>自定义页面内容</h1>
</Layout>
```

### 自定义布局
创建自定义布局组件：

```astro
---
// src/layouts/CustomLayout.astro
import { SITE } from '~/config';
import Header from '~/components/Header.astro';
import Footer from '~/components/Footer.astro';

export interface Props {
  title?: string;
  description?: string;
  image?: string;
  layout?: string;
  fullWidth?: boolean;
  lang?: string;
}

const props = Astro.props;
---

<html lang={props.lang ?? SITE.lang}>
  <head>
    <title>{props.title ? `${props.title} | ${SITE.title}` : SITE.title}</title>
    <meta name="description" content={props.description ?? SITE.desc} />
    {props.image && <meta property="og:image" content={props.image} />}
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

## 性能优化

### 图片优化
系统使用 Astro 的图片优化功能：

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/my-image.jpg';
---

<Image src={myImage} alt="描述" />
```

### 代码分割
Astro 自动处理代码分割，但可以使用动态导入优化：

```astro
---
const { default: Component } = await import('../components/HeavyComponent.astro');
---

<Component />
```

## 自定义元数据

### SEO 优化
在页面中自定义元数据：

```astro
---
// 在页面 frontmatter 或组件中
const title = "页面标题";
const description = "页面描述";
const image = "/path/to/og-image.jpg";
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

## 主题切换

### 手动切换
系统提供主题切换功能，用户可以手动切换亮色/暗色模式。

### 自动检测
系统会自动检测用户的系统偏好设置。

## 自定义构建配置

### Astro 配置
在 `astro.config.ts` 中可以自定义构建配置：

```typescript
export default defineConfig({
  // ...
  vite: {
    // Vite 配置
    plugins: [
      // 添加额外的 Vite 插件
    ],
  },
  // ...
});
```

## 调试和开发

### 开发模式
使用以下命令启动开发服务器：

```bash
bun run dev
```

### 构建检查
使用以下命令检查构建问题：

```bash
bun run build
```

### 代码格式化
使用以下命令格式化代码：

```bash
bun run format
```

## 最佳实践

### 样式组织
- 使用 CSS 变量保持一致性
- 遵循 BEM 命名规范
- 保持样式模块化

### 组件设计
- 保持组件单一职责
- 使用插槽 (slots) 提供灵活性
- 提供清晰的组件 API

### 性能考虑
- 优化图片资源
- 使用适当的缓存策略
- 减少不必要的依赖