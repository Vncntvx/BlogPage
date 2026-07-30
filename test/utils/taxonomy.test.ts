import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getTaxonomy, type TaxonomyTerm } from "@/utils/taxonomy";
import type { CollectionEntry } from "astro:content";

// 固定"当前时间"为 2026-07-30，确保非草稿、已发布文章通过 postFilter。
const NOW = new Date("2026-07-30T00:00:00Z").getTime();

type PostData = CollectionEntry<"blog">["data"];

function makePost(data: Partial<PostData>): CollectionEntry<"blog"> {
  return {
    id: data.title ?? "id",
    data: {
      author: ["tester"],
      pubDatetime: new Date("2020-01-01T00:00:00Z"),
      title: data.title ?? "untitled",
      category: "General",
      tags: ["others"],
      description: "",
      lang: "zh",
      toc: false,
      ...data,
    },
  } as unknown as CollectionEntry<"blog">;
}

describe("getTaxonomy", () => {
  beforeEach(() => {
    vi.stubEnv("DEV", false);
    vi.spyOn(Date, "now").mockReturnValue(NOW);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("规范化：trim + slugify 生效", () => {
    const posts = [makePost({ tags: [" Python "] })];
    const result = getTaxonomy(posts, "tags");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("python");
    expect(result[0].name).toBe("Python");
  });

  it("去重首写胜出：Python/python 合并为一条，保留首写名", () => {
    const posts = [
      makePost({ title: "a", tags: ["Python"] }),
      makePost({ title: "b", tags: ["python"] }),
    ];
    const result = getTaxonomy(posts, "tags");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Python");
    expect(result[0].count).toBe(2);
  });

  it("计数：同一标签跨多篇文章累加", () => {
    const posts = [
      makePost({ title: "a", tags: ["Thoughts"] }),
      makePost({ title: "b", tags: ["Thoughts", "Life"] }),
      makePost({ title: "c", tags: ["Thoughts"] }),
    ];
    const thoughts = getTaxonomy(posts, "tags").find(t => t.slug === "thoughts");
    expect(thoughts?.count).toBe(3);
  });

  it("排序：数量降序，同数量按名称升序", () => {
    const posts = [
      makePost({ title: "a", tags: ["zebra"] }),
      makePost({ title: "b", tags: ["alpha"] }),
      makePost({ title: "c", tags: ["alpha", "zebra"] }),
      makePost({ title: "d", tags: ["alpha"] }),
    ];
    // alpha:3, zebra:2
    const result = getTaxonomy(posts, "tags");
    expect(result.map(t => t.slug)).toEqual(["alpha", "zebra"]);
  });

  it("同数量按名称升序（验证 localeCompare 次序）", () => {
    const posts = [
      makePost({ title: "a", tags: ["banana"] }),
      makePost({ title: "b", tags: ["apple"] }),
      makePost({ title: "c", tags: ["cherry"] }),
    ];
    const result = getTaxonomy(posts, "tags");
    expect(result.map(t => t.name)).toEqual(["apple", "banana", "cherry"]);
  });

  it("中文 slug：保留原样不转拼音", () => {
    const posts = [makePost({ tags: ["韧性研究"] })];
    const result = getTaxonomy(posts, "tags");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("韧性研究");
    expect(result[0].name).toBe("韧性研究");
    expect(result[0].count).toBe(1);
  });

  it("空标签：[''] 与 [] 不产生项", () => {
    const posts = [
      makePost({ title: "a", tags: [""] }),
      makePost({ title: "b", tags: [] }),
    ];
    expect(getTaxonomy(posts, "tags")).toEqual([]);
  });

  it("0 计数：posts 为空返回 []", () => {
    expect(getTaxonomy([], "tags")).toEqual([]);
    expect(getTaxonomy([], "category")).toEqual([]);
  });

  it("草稿过滤：draft 文章不计入", () => {
    const posts = [
      makePost({ title: "live", tags: ["live-tag"] }),
      makePost({ title: "draft", tags: ["draft-tag"], draft: true }),
    ];
    const result = getTaxonomy(posts, "tags");
    expect(result.map(t => t.slug)).toEqual(["live-tag"]);
  });

  it("默认分类替换：General → defaultLabel，slug 保持 general", () => {
    const posts = [
      makePost({ title: "a", category: "General" }),
      makePost({ title: "b", category: "General" }),
    ];
    const result = getTaxonomy(posts, "category", {
      defaultLabel: "默认分类",
      defaultSlug: "general",
    });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("general");
    expect(result[0].name).toBe("默认分类");
    expect(result[0].count).toBe(2);
  });

  it("不传 defaultLabel 时保留原分类名", () => {
    const posts = [makePost({ title: "a", category: "General" })];
    const result = getTaxonomy(posts, "category");
    expect(result[0].name).toBe("General");
  });

  it("category 字段单值：每篇文章贡献一个分类", () => {
    const posts = [
      makePost({ title: "a", category: "Life" }),
      makePost({ title: "b", category: "Tools" }),
      makePost({ title: "c", category: "Life" }),
    ];
    const result = getTaxonomy(posts, "category");
    // Life:2, Tools:1
    expect(result.map(t => t.name)).toEqual(["Life", "Tools"]);
    expect(result[0].count).toBe(2);
  });

  it("返回类型满足 TaxonomyTerm 形状", () => {
    const posts = [makePost({ tags: ["x"] })];
    const result: TaxonomyTerm[] = getTaxonomy(posts, "tags");
    for (const term of result) {
      expect(typeof term.slug).toBe("string");
      expect(typeof term.name).toBe("string");
      expect(typeof term.count).toBe("number");
    }
  });
});
