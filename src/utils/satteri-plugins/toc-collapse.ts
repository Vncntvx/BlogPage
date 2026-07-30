import { defineMdastPlugin } from "satteri";

const TOC_PATTERN = /^(目录|Table of contents)$/i;

function getText(node: any): string {
  if (node.type === "text") return node.value;
  if (node.children) return node.children.map(getText).join("");
  return "";
}

interface TocEntry {
  depth: number;
  text: string;
  slug: string;
}

/**
 * Sätteri MDAST plugin that replaces `remark-toc` + `remark-collapse` in a
 * single pass.
 *
 * 1. Finds a level-2 heading matching "目录" or "Table of contents".
 * 2. Collects all subsequent headings from the document and builds a nested
 *    <ul>-based table of contents.
 * 3. Wraps the heading + generated TOC in a collapsible
 *    `<details><summary>` element.
 *
 * This keeps the TOC heading visible while allowing the list to be collapsed.
 */
export function tocCollapse() {
  return defineMdastPlugin({
    name: "toc-collapse",

    root(children: any[], _ctx: any) {
      const hIdx = children.findIndex(
        (c: any) =>
          c.type === "heading" &&
          c.depth === 2 &&
          TOC_PATTERN.test(getText(c))
      );
      if (hIdx === -1) return;

      const heading: any = children[hIdx];
      const headingText = getText(heading);

      // ---- 1. Collect all subsequent headings in the document ----
      const entries: TocEntry[] = [];
      for (let i = hIdx + 1; i < children.length; i++) {
        const c = children[i] as any;
        if (c.type !== "heading") continue;
        if (c.depth < 2 || c.depth > 4) continue;
        const text = getText(c);
        const slug = text
          .toLowerCase()
          .replace(/[^\w一-鿿]+/g, "-")
          .replace(/^-+|-+$/g, "");
        entries.push({ depth: c.depth, text, slug });
      }

      // ---- 2. Build nested <ul> HTML ----
      function buildList(items: TocEntry[], minDepth: number): string {
        let html = "<ul>";
        let i = 0;
        while (i < items.length) {
          const item = items[i];
          if (item.depth < minDepth) break;
          html += `<li><a href="#${item.slug}">${item.text}</a>`;
          // Collect children at deeper depth
          const subItems: TocEntry[] = [];
          let j = i + 1;
          while (j < items.length && items[j].depth > item.depth) {
            subItems.push(items[j]);
            j++;
          }
          if (subItems.length > 0) {
            html += buildList(subItems, item.depth + 1);
          }
          html += "</li>";
          i = j > i + 1 ? j : i + 1;
        }
        html += "</ul>";
        return html;
      }

      const tocHtml = entries.length > 0 ? buildList(entries, 2) : "";

      // ---- 3. Find range end (next heading of depth <= heading.depth) ----
      let endIdx = children.length;
      for (let i = hIdx + 1; i < children.length; i++) {
        const c = children[i] as any;
        if (c.type === "heading" && c.depth <= heading.depth) {
          endIdx = i;
          break;
        }
      }

      // ---- 4. Replace [heading, ...content, nextHeading) with wrapped version ----
      const detailsOpen = {
        type: "html" as const,
        value: `<details><summary>${headingText}</summary>`,
      };
      const detailsClose = {
        type: "html" as const,
        value: "</details>",
      };
      const tocNode = tocHtml
        ? [{ type: "html" as const, value: tocHtml }]
        : [];

      // heading stays visible, then details wraps TOC + in-between content
      const inner = children.slice(hIdx + 1, endIdx);
      children.splice(
        hIdx,
        endIdx - hIdx,
        heading,
        detailsOpen,
        ...tocNode,
        ...inner,
        detailsClose
      );
    },
  });
}
