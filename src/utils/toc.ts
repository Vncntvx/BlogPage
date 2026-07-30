import type { MarkdownHeading } from "astro";

/**
 * TOC data utilities.
 *
 * Headings come from `render(post).headings` (Sätteri → github-slugger), so
 * the `slug` already matches the real heading `id` and is de-duplicated. We
 * only surface H2/H3 — H4+ are intentionally excluded to keep navigation
 * light (see project plan). The flat list is folded into a nested tree so each
 * form (sidebar / drawer / bottom sheet) can render H2 groups with indented
 * H3 children from a single shared structure.
 */

export interface TocItem {
  depth: number;
  slug: string;
  text: string;
}

export interface TocNode extends TocItem {
  children: TocNode[];
}

/** Keep only H2 and H3 headings. */
export function filterTocHeadings(
  headings: MarkdownHeading[],
  maxDepth = 3
): TocItem[] {
  return headings
    .filter(h => h.depth >= 2 && h.depth <= maxDepth)
    .map(({ depth, slug, text }) => ({ depth, slug, text }));
}

/**
 * Fold a flat, depth-ordered heading list into a nested tree.
 *
 * Each node owns the headings strictly after it that are deeper than itself,
 * up to the next sibling at the same (or shallower) depth. Depth jumps such
 * as H2 → H4 (no H3) are tolerated: an H4 simply attaches to the nearest
 * shallower node — but since `filterTocHeadings` already drops H4+, callers
 * normally only ever pass H2/H3 here.
 */
export function buildTocTree(items: TocItem[]): TocNode[] {
  const roots: TocNode[] = [];
  // Stack of (depth, node) for the current ancestor chain.
  const stack: TocNode[] = [];

  for (const item of items) {
    const node: TocNode = { ...item, children: [] };

    // Pop until the top of the stack is shallower than this node.
    while (stack.length > 0 && stack[stack.length - 1].depth >= node.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }

  return roots;
}

/** Convenience: flat headings → TOC tree in one call. */
export function getTocTree(
  headings: MarkdownHeading[],
  maxDepth = 3
): TocNode[] {
  return buildTocTree(filterTocHeadings(headings, maxDepth));
}

/** Count top-level (H2) sections — used for the "2 / 7" indicator. */
export function countTopLevel(tree: TocNode[]): number {
  return tree.length;
}
