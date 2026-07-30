import { describe, it, expect } from "vitest";
import { t } from "@/i18n/utils";

describe("breadcrumb 相关翻译键", () => {
  // 覆盖 Breadcrumb.astro:59-65 漏译 categories 的根因：
  // 确认 categories 键存在且 t() 能在两种语言下取到本地化值。
  it("categories 在中英文下均有翻译", () => {
    expect(t("categories", "zh")).toBe("分类");
    expect(t("categories", "en")).toBe("Categories");
  });

  it("tags / home / posts 翻译正确（面包屑常用项）", () => {
    expect(t("tags", "zh")).toBe("标签");
    expect(t("tags", "en")).toBe("Tags");
    expect(t("home", "zh")).toBe("首页");
    expect(t("home", "en")).toBe("Home");
    expect(t("posts", "zh")).toBe("文章");
    expect(t("posts", "en")).toBe("Posts");
  });

  it("archives / about / search 翻译正确（面包屑其余项）", () => {
    expect(t("archives", "zh")).toBe("归档");
    expect(t("about", "zh")).toBe("关于");
    expect(t("search", "zh")).toBe("搜索");
  });

  // postCount 是本任务新增的 i18n 键，确认它在两种语言下可取到。
  it("postCount 模板存在且支持 {count} 替换", () => {
    expect(t("postCount", "zh")).toBe("{count} 篇文章");
    expect(t("postCount", "en")).toBe("{count} posts");
    expect(t("postCount", "zh").replace("{count}", "12")).toBe("12 篇文章");
    expect(t("postCount", "en").replace("{count}", "1")).toBe("1 posts");
  });

  it("defaultCategory 本地化（分类详情页 General 替换）", () => {
    expect(t("defaultCategory", "zh")).toBe("默认分类");
    expect(t("defaultCategory", "en")).toBe("General");
  });
});
