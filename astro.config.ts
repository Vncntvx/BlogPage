import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE, LATEX } from "./src/config";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./src/i18n/config";

type AstroLocale = { path: string; codes: [string, ...string[]] };

const astroLocales: AstroLocale[] = SUPPORTED_LOCALES.map(locale => ({
  path: locale.path,
  codes: [locale.code, ...(locale.aliases ?? [])] as [string, ...string[]],
}));

const defaultAstroLocale = DEFAULT_LOCALE.code as AstroLocale["codes"][number];

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  i18n: {
    defaultLocale: defaultAstroLocale,
    locales: astroLocales,
    routing: "manual",
  },
  integrations: [
    react(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [
      ...(LATEX.enabled ? [remarkMath] : []),
      [remarkToc, { heading: "目录|Table of contents" }],
      [remarkCollapse, { test: "目录|Table of contents" }],
    ],
    rehypePlugins: LATEX.enabled ? [rehypeKatex] : [],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          const message =
            typeof warning.message === "string" ? warning.message : "";

          if (
            warning.code === "UNUSED_EXTERNAL_IMPORT" ||
            message.includes("@astrojs/internal-helpers/remote")
          ) {
            return;
          }

          defaultHandler(warning);
        },
      },
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
      PUBLIC_GOOGLE_ANALYTICS_ID: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgo: true,
  },
});
