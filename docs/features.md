# 功能使用指南

本指南将详细介绍博客系统的各项功能及其使用方法。

## 主要功能

### 1. 响应式设计
博客系统采用响应式设计，可在各种设备上正常显示，包括：
- 移动设备
- 平板电脑
- 桌面电脑

### 2. 亮色/暗色模式
系统支持自动检测用户的主题偏好，并提供手动切换功能：
- 自动根据系统设置切换主题
- 用户可手动切换亮色/暗色模式
- 主题切换状态会保存在本地存储中

### 3. 搜索功能
博客集成了 Pagefind 搜索功能：
- 支持全文搜索
- 搜索结果高亮显示匹配内容
- 支持多语言搜索

### 4. 分类和标签系统
- 文章可按分类组织
- 支持多标签管理
- 提供分类和标签页面

### 5. 归档功能
- 按时间归档文章
- 支持按年份和月份查看历史文章

### 6. 评论系统
使用 Giscus 作为评论系统：
- 基于 GitHub Discussions
- 支持 Markdown 格式
- 可自定义主题和语言

### 7. RSS 订阅
- 自动生成 RSS 订阅源
- 支持按分类和标签订阅

### 8. SEO 优化
- 自动生成 meta 标签
- 支持 Open Graph 图片
- 自动生成站点地图

## 页面功能

### 首页
- 显示最新文章
- 可配置首页显示的文章数量
- 包含导航菜单

### 文章列表页
- 分页显示文章
- 按时间倒序排列
- 显示文章摘要

### 文章详情页
- 显示完整文章内容
- 包含元信息（作者、日期、分类、标签）
- 目录导航（如果文章包含标题）
- 评论区
- 分享链接
- 相关文章推荐

### 分类页面
- 按分类浏览文章
- 显示分类统计信息

### 标签页面
- 按标签浏览文章
- 显示标签云

### 归档页面
- 按时间归档文章
- 便于查看历史内容

### 搜索页面
- 提供全文搜索功能
- 搜索结果按相关性排序

## 多语言支持
- 支持中英文
- 自动检测浏览器语言偏好
- 手动语言切换功能

## 无障碍功能
- 键盘导航支持
- 屏幕阅读器友好
- 语义化 HTML 结构

## 代码高亮

## 图片灯箱
点击文章中的图片可放大查看：
- 点击图片打开全屏灯箱（90vh × 90vw）
- 双指缩放（1x-4x）+ 双击切换放大
- 按 `ESC` 或点击背景关闭
- 键盘导航和屏幕阅读器无障碍支持（`role="dialog"`）
- 适配 `prefers-reduced-motion` 用户偏好
- 注意：被 `<a>` 标签包裹的图片不会触发灯箱

## 视图过渡动画
页面间导航使用 Astro View Transitions API 实现平滑过渡：
- 文章卡片标题在列表页和详情页之间平滑过渡
- 自动消毒非 ASCII 字符（中文、emoji 等），确保 CSS `view-transition-name` 合法
- `ClientRouter` 支持页面间预取和即时导航

## 阅读时间估算
每篇文章自动计算预计阅读时间：
- 英文按每分钟 200 词计算
- 中文按每分钟 300 字计算（考虑 CJK 字符密度）
- 显示在文章列表卡片和详情页中

## LaTeX 数学公式支持
- 支持 LaTeX 语法的数学公式
- 使用 KaTeX 渲染，行内和块级公式均支持
- 条件加载：仅在 `LATEX.enabled: true` 时注入 KaTeX CSS，关闭后不加载任何相关资源
- 颜色自动适配亮色/暗色主题

## 动态 OG 图片生成
- 为每篇文章自动生成 Open Graph 社交分享图
- 使用 satori（SVG 生成）+ @resvg/resvg-js（PNG 渲染）
- 模板位于 `src/utils/og-templates/`，可自定义字体和布局
- 包含文章标题、作者、发布日期
- 仅在 `SITE.dynamicOgImage: true` 且文章未设置自定义 `ogImage` 时触发

## Pagefind 全文搜索
- 构建时运行 `pagefind --site dist` 自动生成静态搜索索引
- 搜索结果页面使用 `@pagefind/default-ui` 组件
- 支持中英文搜索，搜索结果高亮匹配内容
- 索引文件位于 `dist/pagefind/`，构建后复制到 `public/pagefind/` 供开发环境使用

## 自定义配置
### 启用/禁用功能
在 `src/config.ts` 中可以启用或禁用特定功能：

```typescript
// 启用/禁用 LaTeX 支持
export const LATEX = {
  enabled: true, // 设置为 false 可禁用 LaTeX 支持
  // ...
};

// 启用/禁用评论系统
export const COMMENTS = {
  enabled: true, // 设置为 false 可禁用评论系统
  // ...
};
```

### 自定义样式
- 通过 `src/styles/global.css` 自定义全局样式
- 通过 `src/styles/typography.css` 自定义排版样式
- 使用 Tailwind CSS 进行样式定制

### 自定义组件
- 在 `src/components/` 目录下可添加自定义组件
- 可替换默认组件以实现特定功能

## 环境变量
### Google Analytics
要启用 Google Analytics，请在环境变量中设置：

```bash
PUBLIC_GOOGLE_ANALYTICS_ID=your-google-analytics-id
```

### Google 站点验证
要添加 Google 站点验证，请在环境变量中设置：

```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-site-verification-value
```

## 开发工具
### 本地开发
- 使用 `bun run dev` 启动开发服务器
- 自动热重载功能

### 构建生产版本
- 使用 `bun run build` 构建生产版本
- 自动生成站点地图和搜索索引

### 代码格式化
- 使用 `bun run format` 格式化代码
- 使用 Prettier 确保代码风格一致

### 代码检查
- 使用 `bun run lint` 检查代码质量
- 使用 ESLint 进行代码规范检查