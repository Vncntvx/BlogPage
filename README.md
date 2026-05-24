# Blog

Wenjie Xu 的个人博客，基于 [AstroPaper](https://github.com/satnaing/astro-paper) 模板深度定制。

**线上地址**: [blog.wenjiexu.site](https://blog.wenjiexu.site/)

## 定制特性

- **中英双语** — 完整的 i18n 系统，支持手动路由与语言切换
- **中文社交平台** — 知乎、微博、B站、掘金、CSDN 等，含对应图标
- **中文分享** — 支持分享到微博、QQ、微信等平台
- **Giscus 评论** — 基于 GitHub Discussions 的评论系统
- **KaTeX 数学排版** — 文章内 LaTeX 公式渲染
- **CC 版权卡片** — 文章底部可选的 Creative Commons 许可声明
- **动态 OG 图片** — 自动为每篇文章生成社交分享图
- **Pagefind 搜索** — 静态站内全文搜索
- **阅读时间估算** — 支持 CJK 字符的阅读时长计算

## 技术栈

| 层级   | 技术                                        |
| ------ | ------------------------------------------- |
| 框架   | [Astro](https://astro.build/)               |
| 样式   | [Tailwind CSS v4](https://tailwindcss.com/) |
| 交互   | [React](https://react.dev/)（评论组件）     |
| 数学   | remark-math + rehype-katex                  |
| 搜索   | [Pagefind](https://pagefind.app/)           |
| 评论   | [Giscus](https://giscus.app/)               |
| OG 图  | satori + @resvg/resvg-js                    |
| 包管理 | [Bun](https://bun.sh/)                      |

## 本地运行

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 预览构建结果
bun run preview
```

## 项目结构

```text
/
├── public/              # 静态资源
├── src/
│   ├── assets/          # 图标、图片
│   ├── components/      # Astro & React 组件
│   ├── data/
│   │   ├── blog/        # 博客文章（en/ zh/）
│   │   ├── i18n/        # 翻译文件（YAML）
│   │   ├── about/       # 关于页内容
│   │   └── index/       # 首页内容
│   ├── i18n/            # 国际化配置与工具
│   ├── layouts/         # 页面布局
│   ├── pages/           # 路由页面
│   │   └── [lang]/      # 多语言路由
│   ├── styles/          # 全局样式
│   ├── utils/           # 工具函数
│   ├── config.ts        # 站点配置
│   ├── constants.ts     # 社交/分享平台元数据
│   └── content.config.ts # 内容集合 schema
└── astro.config.ts
```

## 常用命令

| 命令              | 说明                              |
| ----------------- | --------------------------------- |
| `bun run dev`     | 启动开发服务器 (`localhost:4321`) |
| `bun run build`   | 类型检查 + 构建 + 生成搜索索引    |
| `bun run preview` | 本地预览构建结果                  |
| `bun run format`  | Prettier 格式化                   |
| `bun run lint`    | ESLint 检查                       |

## 致谢

本项目基于 [AstroPaper](https://github.com/satnaing/astro-paper)（MIT License）开发，感谢 [Sat Naing](https://satnaing.dev) 及其贡献者。

## License

[MIT](LICENSE)
