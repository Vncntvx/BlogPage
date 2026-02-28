# 配置指南

本指南将详细介绍如何配置这个 Astro 博客系统。

## 主要配置文件

博客系统的主要配置文件位于 `src/config.ts`，其中包含了站点的基本信息和功能配置。

### 站点配置 (SITE)

```typescript
export const SITE = {
  website: "https://blog.wenjiexu.site/", // 站点 URL
  author: "Wenjie Xu", // 作者名称
  profile: "https://wenjiexu.site/", // 作者个人资料链接
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.", // 站点描述
  title: "Blog", // 站点标题
  ogImage: "astropaper-og.jpg", // 默认 Open Graph 图片
  lightAndDarkMode: true, // 是否启用亮色/暗色模式
  postPerIndex: 4, // 首页显示的文章数量
  postPerPage: 10, // 文章列表每页显示的数量
  scheduledPostMargin: 15 * 60 * 1000, // 计划发布文章的时间边距（15分钟）
  showArchives: true, // 是否显示归档页面
  showBackButton: true, // 文章详情页是否显示返回按钮
  editPost: {
    enabled: false, // 是否启用编辑文章功能
    text: "Edit page", // 编辑按钮文本
    url: "https://github.com/satnaing/astro-paper/edit/main/", // 编辑链接前缀
  },
  dynamicOgImage: true, // 是否启用动态 OG 图片生成
  dir: "ltr", // 文本方向 ("ltr" | "rtl" | "auto")
  lang: "", // HTML 语言代码，留空则从多语言配置中解析
  timezone: "Asia/Shanghai", // 默认时区 (IANA 格式)
} as const;
```

### 页面显示开关（SITE.pages）

站点导航里的 **文章列表 / 标签 / 分类 / 关于** 四个页面可以在 `src/config.ts` 的 `SITE.pages` 一处统一配置是否启用：

- 影响导航：`src/components/Header.astro` 会根据开关决定是否展示菜单项
- 影响路由输出：对应页面的 `getStaticPaths()` 会在禁用时返回空数组（构建时不会生成静态页面）
- 影响站内链接：
  - 标签链接（`src/components/Tag.astro`）在禁用时会显示为不可点击文本
  - 分类链接（`src/components/Category.astro` / `src/layouts/PostDetails.astro`）在禁用时隐藏或不可点击

配置示例（节选）：

```ts
export const SITE = {
  // ...
  pages: {
    posts: { enabled: true },
    tags: { enabled: true },
    categories: { enabled: true },
    about: { enabled: false },
  },
} as const;
```

> 说明：`SITE.pages.posts` 会统一控制**与文章相关的入口**，包括：
>
> - 文章列表页：`/[lang]/posts`
> - 文章详情页：`/[lang]/posts/:slug`
> - 根路径重定向：`/posts/:slug`（跳转到默认语言）
> - RSS：`/rss.xml` 与 `/[lang]/rss.xml`
>
> 关闭后会避免生成对应静态路由，同时在开发环境直接访问时跳转到 `/404`，以减少死链。

### 社交站点配置（SOCIAL）

社交站点的 **开关与链接** 统一在 `src/config.ts` 的 `SOCIAL` 中配置。

支持：GitHub、Email、X、LinkedIn，以及常见中文站点（B 站、知乎、掘金、微博、CSDN、SegmentFault、豆瓣）。

配置要点：

- `enabled: true/false`：是否显示该社交图标
- `href`：链接地址（建议填完整 URL；邮箱使用 `mailto:`）

渲染逻辑：

- `src/constants.ts` 会读取 `SOCIAL` 并生成 `SOCIALS` 数组（只包含 enabled 且 href 非空的项）
- `src/components/Socials.astro` 负责把 `SOCIALS` 渲染成图标按钮
- 图标资源位于 `src/assets/icons/`（本项目新增了一组简洁风格的站点图标）

配置示例（节选）：

```ts
export const SOCIAL = {
  github: { enabled: true, href: "https://github.com/Vncntvx/astro-paper" },
  bilibili: { enabled: false, href: "https://space.bilibili.com/" },
  zhihu: { enabled: false, href: "https://www.zhihu.com/people/" },
  juejin: { enabled: false, href: "https://juejin.cn/user/" },
  weibo: { enabled: false, href: "https://weibo.com/" },
} as const;
```

### 文章分享配置（SHARE）

文章详情页底部的「分享这篇文章到」按钮组可以在 `src/config.ts` 的 `SHARE` 统一配置。

- `SHARE.enabled`：控制整组分享按钮是否展示
- `SHARE.links.<platform>.enabled`：控制单个平台是否展示（顺序按 key 书写顺序）

支持平台会随项目迭代增加，当前包含：Email、WeChat（二维码）、QQ、QZone、Weibo，以及部分海外平台（LinkedIn、WhatsApp、Facebook、X、Telegram、Pinterest）。

配置示例（节选）：

```ts
export const SHARE = {
  enabled: true,
  links: {
    email: { enabled: true },
    wechat: { enabled: true },
    qq: { enabled: true },
    qzone: { enabled: true },
    weibo: { enabled: true },
    // 其他平台...
  },
} as const;
```

### LaTeX 支持配置 (LATEX)

```typescript
export const LATEX = {
  enabled: true, // 是否启用 LaTeX 数学公式支持
  katexCdn: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css", // KaTeX CDN 链接
} as const;
```

### 评论系统配置 (COMMENTS)

```typescript
export const COMMENTS = {
  enabled: true, // 是否启用评论功能
  provider: "giscus" as const, // 评论提供商，当前支持 giscus
  giscus: {
    repo: "Vncntvx/BlogComments", // GitHub 仓库名称
    repoId: "R_kgDOMFTH3A", // 仓库 ID
    category: "Announcements", // 评论分类
    categoryId: "DIC_kwDOMFTH3M4Cf4dF", // 分类 ID
    mapping: "pathname", // 评论映射方式
    strict: "0", // 严格模式
    reactionsEnabled: "1", // 是否启用反应表情
    emitMetadata: "0", // 是否发送元数据
    inputPosition: "top", // 输入框位置
    lang: "zh-CN", // 评论系统语言
    theme: "preferred_color_scheme", // 主题模式
    lightTheme: "light", // 亮色主题
    darkTheme: "dark", // 暗色主题
  },
} as const;
```

## Astro 配置 (astro.config.ts)

Astro 的主要配置文件位于项目根目录的 `astro.config.ts`，其中包含以下主要配置：

### 集成配置

- `@astrojs/react`: React 组件支持
- `@astrojs/sitemap`: 站点地图生成
- `tailwindcss`: Tailwind CSS 支持

### Markdown 配置

- `remark-toc`: 自动生成目录
- `remark-collapse`: 可折叠内容块
- `remark-math` 和 `rehype-katex`: LaTeX 数学公式支持
- `shikiConfig`: 代码高亮配置

### 环境变量配置

项目支持以下环境变量：

```bash
# Google 站点验证 (可选)
PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-site-verification-value

# Google Analytics ID (可选)
PUBLIC_GOOGLE_ANALYTICS_ID=your-google-analytics-id
```

## 多语言配置

多语言配置位于 `src/i18n/config.ts`，支持以下语言：

- 英语 (en)
- 中文 (zh)

每种语言的配置包括：

- 代码 (code)
- URL 路径 (path)
- 显示名称 (name)
- HTML 语言标签 (htmlLang)
- 文本方向 (dir)
- 日期格式 (dateFormat)
- 别名 (aliases)

## 内容配置

博客文章的配置位于 `src/content.config.ts`，定义了文章的元数据结构，包括：

- 作者 (author)
- 发布日期 (pubDatetime)
- 修改日期 (modDatetime)
- 标题 (title)
- slug (slug)
- 是否特色文章 (featured)
- 是否草稿 (draft)
- 分类 (category)
- 标签 (tags)
- OG 图片 (ogImage)
- 描述 (description)
- 规范 URL (canonicalURL)
- 语言 (lang)

## 构建和部署配置

在 `package.json` 中定义了以下主要脚本：

- `dev`: 启动开发服务器
- `build`: 构建生产版本
- `preview`: 预览构建结果
- `format`: 代码格式化
- `lint`: 代码检查

构建过程会自动生成站点地图、RSS 订阅，并集成 Pagefind 搜索功能。

## 页面内容与 i18n 的分工（推荐约定）

为了避免“页面内容被拆成一堆 i18n 字段导致配置割裂”，建议保持如下分工：

- **页面内容（可富文本 / 含链接 / 段落结构）**：放在 `src/data/**` 的 Markdown 中
  - 首页文案：`src/data/index/*.md`
  - 关于页内容：`src/data/about/*.md`
- **通用 UI 文案（导航项、按钮、提示语、标签名等）**：放在 `src/data/i18n/*.yaml`
  - 例如：导航 `posts/tags/categories/about`，以及首页的 UI 标签 `socialLinks/featured/recentPosts/allPosts`

这样做的收益：

- 页面内容更容易编辑（Markdown 一段写完，不用拆字段再拼）
- i18n 更“干净”（只承担 UI 文案，避免与 data 内容重复）
