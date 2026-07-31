import type { Element } from "hast";
import { defineHastPlugin } from "satteri";

/**
 * Satteri hast 插件：把每个 `<table>` 包进 `<div class="table-scroll">`，
 * 为移动端水平滚动 + 右侧渐变遮罩提供滚动容器与定位祖先。
 *
 * 复用 satteriCallouts 的 visitor API 形态：`visit` 返回新节点即替换原节点
 *（satteri `handleVisitResult` 语义）。`filter: ['table']` 由 Rust 侧 walker
 * 按标签名匹配，覆盖任意嵌套深度。属性用 `className`（satteri 标准化键）。
 */
export const wrapTable = () =>
  defineHastPlugin({
    name: "wrap-table",
    element: {
      filter: ["table"],
      visit(node: Element) {
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"] },
          children: [node],
        } as Element;
      },
    },
  });
