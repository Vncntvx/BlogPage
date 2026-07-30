import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import { getTaxonomy, type TaxonomyTerm } from "./taxonomy";

export const DEFAULT_CATEGORY = "General";
export const DEFAULT_CATEGORY_SLUG = slugifyStr(DEFAULT_CATEGORY);

/**
 * 返回去重、计数并排序后的分类列表。
 *
 * 返回 `TaxonomyTerm[]`（`{ slug, name, count }`），按数量降序、名称升序排序。
 * 去重按 slug，首写胜出。`defaultLabel` 用于把默认分类（General）替换为本地化显示名。
 */
const getUniqueCategories = (
  posts: CollectionEntry<"blog">[],
  defaultLabel?: string
): TaxonomyTerm[] =>
  getTaxonomy(posts, "category", {
    defaultLabel,
    defaultSlug: DEFAULT_CATEGORY_SLUG,
  });

export default getUniqueCategories;
export type { TaxonomyTerm };
