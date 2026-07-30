import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

export interface TaxonomyTerm {
  slug: string;
  name: string;
  count: number;
}

type Field = "tags" | "category";

interface GetTaxonomyOptions {
  defaultLabel?: string;
  defaultSlug?: string;
}

/**
 * 规范化、去重、计数并排序一组分类法术语（标签或分类）。
 *
 * - 去重按 slug，**首写胜出**（不覆盖已记录的显示名），与聚合页历史行为一致。
 * - 计数为构建时统计（SSG），无客户端 JS。
 * - 排序：数量降序，同数量按名称升序（localeCompare）。
 * - category 字段单值；tags 字段多值。
 * - defaultLabel/defaultSlug 用于把默认分类（如 General）替换为本地化显示名。
 */
export function getTaxonomy(
  posts: CollectionEntry<"blog">[],
  field: Field,
  options?: GetTaxonomyOptions
): TaxonomyTerm[] {
  const filtered = posts.filter(postFilter);
  const map = new Map<string, { name: string; count: number }>();

  for (const post of filtered) {
    const rawValues: string[] =
      field === "tags"
        ? (post.data.tags ?? [])
        : [post.data.category ?? ""].filter(Boolean);

    for (const raw of rawValues) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const slug = slugifyStr(trimmed);
      if (!slug) continue;

      const isDefault =
        field === "category" &&
        !!options?.defaultSlug &&
        slug === options.defaultSlug;
      const displayName =
        isDefault && options?.defaultLabel ? options.defaultLabel : trimmed;

      const existing = map.get(slug);
      if (existing) {
        existing.count += 1; // 首写胜出：不覆盖 name
      } else {
        map.set(slug, { name: displayName, count: 1 });
      }
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) =>
      b.count !== a.count ? b.count - a.count : a.name.localeCompare(b.name)
    );
}
