import { describe, expect, it } from "vitest";
import type { MarkdownHeading } from "astro";
import {
  buildTocTree,
  countTopLevel,
  filterTocHeadings,
  getTocTree,
} from "../src/utils/toc";

/** Helper: build a heading list from [depth, text] pairs. Slugs equal text
 * (callers that need de-dup use `dedupHeadings` instead). */
function headings(pairs: [number, string][]): MarkdownHeading[] {
  return pairs.map(([depth, text]) => ({ depth, slug: text, text }));
}

/** Helper: build headings where repeated text gets the -1 / -2 suffix, like
 * github-slugger does, so we can assert de-dup behavior end-to-end. */
function dedupHeadings(pairs: [number, string][]): MarkdownHeading[] {
  const seen = new Map<string, number>();
  return pairs.map(([depth, text]) => {
    const count = seen.get(text) ?? 0;
    seen.set(text, count + 1);
    return {
      depth,
      slug: count === 0 ? text : `${text}-${count}`,
      text,
    };
  });
}

describe("filterTocHeadings", () => {
  it("keeps only H2 and H3 by default", () => {
    const items = headings([
      [1, "Title"],
      [2, "Intro"],
      [3, "Sub"],
      [4, "Deep"],
      [5, "Deeper"],
      [2, "Outro"],
    ]);
    const result = filterTocHeadings(items);
    expect(result.map(h => h.depth)).toEqual([2, 3, 2]);
  });

  it("respects a custom maxDepth", () => {
    const items = headings([
      [2, "A"],
      [3, "B"],
      [4, "C"],
    ]);
    const result = filterTocHeadings(items, 4);
    expect(result.map(h => h.depth)).toEqual([2, 3, 4]);
  });

  it("drops H1 and anything shallower than H2", () => {
    const items = headings([
      [1, "H1"],
      [2, "H2"],
    ]);
    const result = filterTocHeadings(items);
    expect(result.map(h => h.text)).toEqual(["H2"]);
  });

  it("returns an empty array for no headings", () => {
    expect(filterTocHeadings([])).toEqual([]);
  });

  it("preserves slug and text verbatim", () => {
    const items = headings([[2, "安装与配置"]]);
    const [head] = filterTocHeadings(items);
    expect(head).toEqual({
      depth: 2,
      slug: "安装与配置",
      text: "安装与配置",
    });
  });
});

describe("buildTocTree", () => {
  it("nests H3 under its preceding H2", () => {
    const items = filterTocHeadings(
      headings([
        [2, "A"],
        [3, "A.1"],
        [3, "A.2"],
        [2, "B"],
      ])
    );
    const tree = buildTocTree(items);
    expect(tree).toHaveLength(2);
    expect(tree[0].text).toBe("A");
    expect(tree[0].children.map(c => c.text)).toEqual(["A.1", "A.2"]);
    expect(tree[1].text).toBe("B");
    expect(tree[1].children).toEqual([]);
  });

  it("returns an empty tree for an empty list", () => {
    expect(buildTocTree([])).toEqual([]);
  });

  it("treats a lone H2 as a root with no children", () => {
    const items = filterTocHeadings(headings([[2, "Only"]]));
    const tree = buildTocTree(items);
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toEqual([]);
  });

  it("handles H3 with no preceding H2 (orphan) as a root", () => {
    // Depth-ordered but starts at H3 — no H2 ancestor, so it becomes a root.
    const items = filterTocHeadings(headings([[3, "Orphan H3"]]));
    const tree = buildTocTree(items);
    expect(tree).toHaveLength(1);
    expect(tree[0].depth).toBe(3);
  });

  it("tolerates depth jumps H2 -> H3 -> H2 -> H3", () => {
    const items = filterTocHeadings(
      headings([
        [2, "A"],
        [3, "A.1"],
        [2, "B"],
        [3, "B.1"],
      ])
    );
    const tree = buildTocTree(items);
    expect(tree.map(n => n.text)).toEqual(["A", "B"]);
    expect(tree[0].children.map(c => c.text)).toEqual(["A.1"]);
    expect(tree[1].children.map(c => c.text)).toEqual(["B.1"]);
  });

  it("does not collapse a shallower heading under a deeper one", () => {
    // H2 after H3 must become a sibling root, not a child of the H3.
    const items = filterTocHeadings(
      headings([
        [3, "Sub"],
        [2, "Top"],
      ])
    );
    const tree = buildTocTree(items);
    expect(tree).toHaveLength(2);
    expect(tree[0].depth).toBe(3);
    expect(tree[1].depth).toBe(2);
    expect(tree[0].children).toEqual([]);
  });
});

describe("getTocTree (integration)", () => {
  it("filters then nests in one call", () => {
    const tree = getTocTree(
      headings([
        [1, "Doc"],
        [2, "A"],
        [3, "A.1"],
        [4, "A.1.deep"], // dropped — H4 not surfaced
        [2, "B"],
      ])
    );
    expect(tree.map(n => n.text)).toEqual(["A", "B"]);
    expect(tree[0].children.map(c => c.text)).toEqual(["A.1"]);
  });

  it("handles real-world duplicate H3 slugs (github-slugger de-dup)", () => {
    // Mirrors the Python post: two "### 安装与配置" under different H2s.
    const tree = getTocTree(
      dedupHeadings([
        [2, "Conda"],
        [3, "安装与配置"],
        [2, "uv"],
        [3, "安装与配置"],
      ])
    );
    expect(tree).toHaveLength(2);
    const [conda, uv] = tree;
    expect(conda.children[0].slug).toBe("安装与配置");
    expect(uv.children[0].slug).toBe("安装与配置-1");
  });

  it("returns empty for an H1-only document (no H2)", () => {
    const tree = getTocTree(headings([[1, "Title"]]));
    expect(tree).toEqual([]);
  });

  it("returns a single root for a one-H2 post", () => {
    // Mirrors the Word formatting post (H2 = 1).
    const tree = getTocTree(headings([[2, "唯一章节"]]));
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toEqual([]);
  });

  it("handles a post with H2s but no H3s", () => {
    // Mirrors the "build-your-records" post (H2 = 4, H3 = 0).
    const tree = getTocTree(
      headings([
        [2, "一"],
        [2, "二"],
        [2, "三"],
        [2, "四"],
      ])
    );
    expect(tree.map(n => n.text)).toEqual(["一", "二", "三", "四"]);
    expect(tree.every(n => n.children.length === 0)).toBe(true);
  });

  it("surfaces a long LLM-wiki-style structure without losing items", () => {
    // 15 H2 + 29 H3 + 7 H4 — H4s must be dropped, H2/H3 preserved & nested.
    const pairs: [number, string][] = [];
    for (let i = 0; i < 15; i++) {
      pairs.push([2, `H2-${i}`]);
      for (let j = 0; j < 2; j++) pairs.push([3, `H2-${i}-H3-${j}`]); // 30 H3
      if (i % 2 === 0) pairs.push([4, `H2-${i}-H4`]); // 8 H4, dropped
    }
    const tree = getTocTree(headings(pairs));
    expect(tree).toHaveLength(15);
    // Every H2 has exactly 2 H3 children; no H4 leaked through.
    for (const node of tree) {
      expect(node.children).toHaveLength(2);
      expect(node.children.every(c => c.depth === 3)).toBe(true);
    }
  });
});

describe("countTopLevel", () => {
  it("counts H2 roots", () => {
    const tree = getTocTree(
      headings([
        [2, "A"],
        [2, "B"],
        [2, "C"],
      ])
    );
    expect(countTopLevel(tree)).toBe(3);
  });

  it("is 0 for an empty tree", () => {
    expect(countTopLevel([])).toBe(0);
  });

  it("counts roots regardless of H3 children", () => {
    const tree = getTocTree(
      headings([
        [2, "A"],
        [3, "A.1"],
        [3, "A.2"],
        [2, "B"],
      ])
    );
    expect(countTopLevel(tree)).toBe(2);
  });
});
