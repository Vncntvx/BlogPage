# 撰写与发布博客文章

本指南将详细介绍如何在博客系统中撰写和发布文章。

## 文章存储位置

所有博客文章都存储在 `src/data/blog/` 目录下，按语言分类：
- `src/data/blog/en/` - 英文文章
- `src/data/blog/zh/` - 中文文章

## 文章文件结构

每篇博客文章都是一个 Markdown 文件，包含 YAML frontmatter 和文章内容。

### Frontmatter 配置

每篇文章的顶部需要包含以下 frontmatter 配置：

```yaml
---
author: ["Wenjie Xu"]           # 作者名称（支持多个作者）
pubDatetime: 2025-01-01T00:00:00.000Z  # 发布日期时间
modDatetime: 2025-01-02T00:00:00.000Z  # 修改日期时间（可选）
title: "文章标题"                # 文章标题
slug: "custom-slug"            # 自定义 URL slug（可选）
featured: true                 # 是否为特色文章（可选）
draft: false                   # 是否为草稿（可选）
category: "技术"               # 文章分类
tags: ["Astro", "博客", "教程"] # 文章标签
ogImage: "path/to/image.jpg"   # Open Graph 图片（可选）
description: "文章描述"         # 文章描述
canonicalURL: "https://example.com/original-post"  # 规范 URL（可选）
hideEditPost: false            # 是否隐藏编辑文章按钮（可选）
showCopyright: true            # 是否在文章底部显示版权卡片（可选）
ccLicense: "by-nc-sa"          # CC 许可证组合（可选，默认 by-nc-sa）
timezone: "Asia/Shanghai"      # 时区（可选）
lang: "zh"                     # 语言代码（en/zh）
---
```

### Frontmatter 字段说明

- `author`: 文章作者，支持单个或多个作者
- `pubDatetime`: 文章发布日期时间，使用 ISO 8601 格式
- `modDatetime`: 文章最后修改时间（可选）
- `title`: 文章标题
- `slug`: URL 中的标识符，如果未指定则从标题生成。对于多语言文章，建议在 slug 中包含语言前缀（如 `zh/article-title` 或 `en/article-title`），系统会自动处理重复的语言前缀。
- `featured`: 是否在特色文章中显示（可选）
- `draft`: 是否为草稿，草稿不会在生产构建中显示
- `category`: 文章分类，用于组织和归类
- `tags`: 文章标签，支持多个标签
- `ogImage`: Open Graph 图片路径（可选）
- `description`: 文章描述，用于 SEO
- `canonicalURL`: 规范 URL，用于 SEO（可选）
- `hideEditPost`: 是否隐藏编辑文章按钮（可选）
- `showCopyright`: 是否在文章底部显示版权卡片（可选，默认不显示）
- `ccLicense`: CC 许可证组合（可选，仅在 showCopyright=true 时生效）
  - 可选值：`by` / `by-sa` / `by-nd` / `by-nc` / `by-nc-sa` / `by-nc-nd`
- `timezone`: 时区设置（可选）
- `lang`: 语言代码，支持 "en" 或 "zh"

## 创建新文章

### 1. 选择语言目录
根据文章语言选择对应的目录：
- 英文文章：`src/data/blog/en/`
- 中文文章：`src/data/blog/zh/`

### 2. 创建 Markdown 文件
在对应目录中创建新的 `.md` 文件，文件名将作为文章的默认标识符。

### 3. 添加 Frontmatter
在文件顶部添加包含必要配置的 frontmatter。

### 4. 编写文章内容
在 frontmatter 下方编写 Markdown 格式的文章内容。

## 文章内容格式

### 基本 Markdown 语法
支持标准 Markdown 语法：
- 标题：`#`, `##`, `###`
- 段落和换行
- 列表：`-`, `*`, `1.`
- 链接：`[text](url)`
- 图片：`![alt text](image-url)`
- 粗体：`**bold**`
- 斜体：`*italic*`
- 代码：`` `code` `` 或缩进代码块

### 代码块高亮
支持多种编程语言的语法高亮：

```javascript
// JavaScript 代码示例
function helloWorld() {
  console.log("Hello, world!");
}
```

### 代码块特殊标记
使用 Shiki 的特殊标记功能：

```javascript
// [!code highlight]
function highlightedCode() {
  // 这行会被高亮
}

// [!code --]
function removedCode() {
  // 这行会被标记为删除
}

// [!code ++]
function addedCode() {
  // 这行会被标记为新增
}
```

### Callout 提示框

使用 Obsidian 风格的 callout 语法在文章中插入提示框：

```markdown
> [!NOTE]
> 这是一个普通笔记。

> [!TIP]
> 这是一个实用提示。

> [!WARNING]
> 这是一个警告信息。

> [!DANGER]
> 这是一个危险警告。
```

提示框会自动适配亮色/暗色主题。支持的类型包括：`NOTE`、`TIP`、`INFO`、`WARNING`、`DANGER`、`SUCCESS`、`QUESTION`、`BUG`、`EXAMPLE`、`QUOTE`、`ABSTRACT`、`TODO`、`FAILURE`。

> 带标题的 callout：`> [!TIP] 最佳实践` 可以在类型后添加自定义标题。

> 可折叠 callout：在类型后添加 `+`（默认展开）或 `-`（默认折叠），如 `> [!NOTE]- 点击展开`。

### LaTeX 数学公式
如果启用了 LaTeX 支持，可以使用数学公式：

```latex
行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 目录

文章目录（TOC）通过 frontmatter 的 `toc` 字段控制，而非在正文中插入特殊标题：

```yaml
---
title: 我的文章
toc: true   # 渲染响应式目录；留空或不写则不渲染
---
```

开启后，目录会从文章的 H2/H3 标题自动构建（H4 及以下不收录，重名标题自动去重），并随视口宽度切换三种形态：

- **宽屏（≥1280px）**：正文左侧常驻 sticky 侧栏，当前章节用左指示线 + 字重 + 背景三重高亮。
- **中屏（768–1279px）**：标题滚出后顶部出现粘性「当前章节」栏（标题 + 「N / M」序号 + 展开按钮），点开是右侧抽屉。
- **手机（<768px）**：同上的章节栏，点开是底部 Bottom Sheet（适配 `safe-area-inset-bottom`）。

无需在正文写任何额外标记——只要标题层级正确，目录自动生成。锚点已与标题 `id` 对齐（中文标题亦然），点击即可定位。

## 草稿管理

### 创建草稿
将 frontmatter 中的 `draft` 设置为 `true`：

```yaml
draft: true
```

草稿文章在开发模式下可见，但在生产构建中会被排除。

### 发布草稿
将 `draft` 设置为 `false` 或从 frontmatter 中移除该字段。

## 特色文章

将 frontmatter 中的 `featured` 设置为 `true` 可将文章标记为特色文章：

```yaml
featured: true
```

特色文章会在首页或其他特色区域突出显示。

## 图片管理

### 本地图片
将图片放在 `public/` 目录下，然后在文章中引用：

```markdown
![图片描述](/path/to/image.jpg)
```

### Open Graph 图片
为每篇文章设置自定义 Open Graph 图片：

```yaml
ogImage: "astropaper-og.jpg"
```

如果未指定，系统会自动生成动态 OG 图片。

## 日期管理

### 发布日期
使用 `pubDatetime` 字段设置文章发布日期：

```yaml
pubDatetime: 2025-01-01T00:00:00.000Z
```

### 修改日期
使用 `modDatetime` 字段记录文章最后修改时间：

```yaml
modDatetime: 2025-01-02T00:00:00.000Z
```

### 时区设置
使用 `timezone` 字段指定文章的时区：

```yaml
timezone: "Asia/Shanghai"
```

## 分类和标签

### 分类设置
使用 `category` 字段设置文章分类：

```yaml
category: "技术"
```

### 标签设置
使用 `tags` 字段设置文章标签：

```yaml
tags: ["Astro", "博客", "教程"]
```

标签支持多个值，有助于文章的组织和检索。

## 多语言文章

### 创建多语言版本
为同一篇文章创建不同语言版本：

- `src/data/blog/en/my-article.md` - 英文版本
- `src/data/blog/zh/my-article.md` - 中文版本

### 语言标识
在 frontmatter 中指定语言：

```yaml
lang: "en"  # 或 "zh"
```

### Slug 规范

在多语言博客中，为了保持一致性和清晰性，建议在 slug 中包含语言前缀：

#### 推荐的 Slug 格式
- 中文文章：`slug: zh/article-title`
- 英文文章：`slug: en/article-title`

#### 系统处理机制
系统会自动处理 slug 中的语言前缀，避免 URL 中出现重复的语言代码：

- 如果设置 `slug: zh/customizing-astropaper-theme-color-schemes`，最终 URL 为 `/zh/posts/customizing-astropaper-theme-color-schemes`
- 系统会自动移除 slug 中的语言前缀，然后根据文章的语言设置重新添加正确的语言路径

#### 实际示例
```yaml
# 中文文章
---
title: "自定义 AstroPaper 主题配色方案"
slug: zh/customizing-astropaper-theme-color-schemes
lang: zh
---

# 英文文章
---
title: "Customizing AstroPaper Theme Color Schemes"
slug: en/customizing-astropaper-theme-color-schemes
lang: en
---
```

#### 最佳实践
1. **一致性**：所有文章的 slug 都包含语言前缀，保持统一的命名规范
2. **清晰性**：从 slug 就能看出文章的语言版本
3. **避免冲突**：不同语言的同名文章可以通过语言前缀区分
4. **系统处理**：让系统自动处理语言前缀的移除和添加，无需担心 URL 重复

### 创建多语言版本
为同一篇文章创建不同语言版本：

- `src/data/blog/en/my-article.md` - 英文版本
- `src/data/blog/zh/my-article.md` - 中文版本

### 语言标识
在 frontmatter 中指定语言：

```yaml
lang: "en"  # 或 "zh"
```

## 文章链接和导航

### 内部链接
使用相对路径链接到其他文章：

```markdown
[相关文章](./other-article.md)
```

### 锚点链接
在文章中创建锚点并链接到它们：

```markdown
[跳转到章节](#章节标题)
```

## SEO 优化

### 描述设置
在 frontmatter 中提供详细的文章描述：

```yaml
description: "这是一篇关于如何撰写博客文章的详细教程..."
```

### 规范 URL
如果文章在其他地方发布过，使用 `canonicalURL` 避免重复内容问题：

```yaml
canonicalURL: "https://original-site.com/article"
```

## 文章预览

### 本地预览
使用以下命令启动本地开发服务器：

```bash
bun run dev
```

访问 `http://localhost:4321` 预览文章。

### 生产构建预览
使用以下命令构建并预览生产版本：

```bash
bun run build
bun run preview
```

## 发布流程

### 1. 完成文章内容
确保文章内容完整，格式正确。

### 2. 检查 Frontmatter
验证所有 frontmatter 字段正确无误。

### 3. 预览文章
在本地预览文章，确保显示正常。

### 4. 设置为非草稿
将 `draft` 字段设置为 `false` 或移除该字段。

### 5. 提交更改
提交文章文件到版本控制系统。

### 6. 部署
部署到生产环境，文章将自动出现在网站上。

## 最佳实践

### 命名约定
- 文件名使用小写字母和连字符
- 避免特殊字符和空格

### 内容组织
- 使用清晰的标题层级
- 保持段落简短易读
- 使用列表组织复杂信息

### SEO 考虑
- 提供有意义的标题和描述
- 使用相关的分类和标签
- 优化图片文件大小

### 可访问性
- 为图片提供有意义的 alt 文本
- 使用语义化的 HTML 结构
- 确保链接文本清晰描述目标

## 故障排除

### 文章不显示
- 检查 `draft` 字段是否为 `false`
- 验证 frontmatter 格式是否正确
- 确认文件位于正确的语言目录中

### 日期显示错误
- 检查日期格式是否为 ISO 8601
- 验证时区设置是否正确

### 图片不显示
- 确认图片路径是否正确
- 检查图片文件是否存在
- 验证图片格式是否支持