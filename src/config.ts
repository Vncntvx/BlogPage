export const SITE = {
  website: "https://blog.wenjiexu.site/", // 自己的网站地址
  author: "Wenjie Xu",
  profile: "https://wenjiexu.site/",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5, // 最新文章在首页显示的数量
  postPerPage: 10, // 文章列表每页显示的数量
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  /**
   * 页面级功能开关（是否显示/是否生成）
   *
   * 说明：这里的 "页面" 指站点导航中的独立页面（文章、标签、分类、关于）。
   * - 关闭后：导航不显示、对应路由不生成（静态构建时不会输出）；开发环境直接访问会重定向到 /404。
   * - posts 关闭后：文章列表页、文章详情页、RSS 等与文章相关的入口都会被统一关闭，避免死链与误导入口。
   */
  pages: {
    posts: { enabled: true },
    tags: { enabled: true },
    categories: { enabled: true },
    about: { enabled: false },
  },
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-CN", // html lang code. Set this empty and default will be resolved from locales
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;

/**
 * 社交站点配置（是否启用 + 链接）
 *
 * 只在此处维护链接与开关；图标与渲染逻辑在 src/constants.ts 与组件中。
 */
export const SOCIAL = {
  // Global
  github: { enabled: true, href: "https://github.com/Vncntvx" },
  email: { enabled: true, href: "mailto:wenjie.xu.cn@outlook.com" },
  x: { enabled: false, href: "https://x.com/username" },
  linkedin: { enabled: false, href: "https://www.linkedin.com/in/username/" },
  bilibili: { enabled: false, href: "https://space.bilibili.com/" },
  zhihu: { enabled: true, href: "https://www.zhihu.com/people/wayne-67-86-29" },
  juejin: { enabled: false, href: "https://juejin.cn/user/" },
  weibo: { enabled: true, href: "https://weibo.com/u/6577473146" },
  csdn: { enabled: false, href: "https://blog.csdn.net/" },
  segmentfault: { enabled: false, href: "https://segmentfault.com/u/" },
  douban: { enabled: false, href: "https://www.douban.com/people/" },
} as const;

/**
 * 文章详情页底部「分享这篇文章到」配置
 *
 * 说明：这里的分享链接是“把当前文章 URL 分享到平台”的入口，
 * 与上面的 SOCIAL（个人主页/社交账号链接）是两套不同概念。
 */
export const SHARE = {
  enabled: true,
  /**
   * 平台显示顺序以此对象的 key 顺序为准。
   * - enabled=false：不显示该平台
   * - 需要添加新平台：同时在 src/constants.ts 的 SHARE_META 中补充
   */
  links: {
    email: { enabled: true },
    weibo: { enabled: true },
    whatsapp: { enabled: true },
    facebook: { enabled: true },
    x: { enabled: true },
    telegram: { enabled: true },
    pinterest: { enabled: true },
    wechat: { enabled: false },
    qq: { enabled: false },
    qzone: { enabled: false },
    linkedin: { enabled: false },
  },
} as const;

// 功能开关与配置
export const LATEX = {
  enabled: true,
  katexCdn: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
} as const;

export const COMMENTS = {
  enabled: true,
  provider: "giscus" as const,
  giscus: {
    repo: "Vncntvx/BlogComments",
    repoId: "R_kgDOMFTH3A",
    category: "Announcements",
    categoryId: "DIC_kwDOMFTH3M4Cf4dF",
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    lang: "zh-CN",
    theme: "preferred_color_scheme",
    lightTheme: "light",
    darkTheme: "dark",
  },
} as const;

// 多语言配置：从 i18n/config.ts 统一导出
import { SUPPORTED_LOCALES } from "./i18n/config";

export const LANGUAGES = Object.fromEntries(
  SUPPORTED_LOCALES.map(locale => [
    locale.code,
    { name: locale.name, code: locale.code, path: locale.path },
  ])
) as Record<string, { name: string; code: string; path: string }>;

export type LanguageCode = import("./i18n/config").LocaleCode;
