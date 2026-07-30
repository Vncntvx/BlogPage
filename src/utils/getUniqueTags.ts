import type { CollectionEntry } from "astro:content";
import { getTaxonomy, type TaxonomyTerm } from "./taxonomy";

/**
 * 返回去重、计数并排序后的标签列表。
 *
 * 返回 `TaxonomyTerm[]`（`{ slug, name, count }`），按数量降序、名称升序排序。
 * 去重按 slug，首写胜出。
 */
const getUniqueTags = (posts: CollectionEntry<"blog">[]): TaxonomyTerm[] =>
  getTaxonomy(posts, "tags");

export default getUniqueTags;
export type { TaxonomyTerm };
