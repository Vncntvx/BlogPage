import { defineConfig, envField, svgoOptimizer } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { katex } from "@nullpinter/satteri-katex";
import satteriCallouts from "satteri-callouts";
import { tocCollapse } from "./src/utils/satteri-plugins/toc-collapse";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
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
  prefetch: {
    defaultStrategy: "hover",
  },
  i18n: {
    defaultLocale: defaultAstroLocale,
    locales: astroLocales,
    routing: "manual",
  },
  integrations: [
    sitemap({
      filter: page => {
        if (!SITE.showArchives && page.endsWith("/archives")) return false;
        const url = new URL(page);
        const path = url.pathname.replace(/\/$/, "");
        const segments = path.split("/").filter(Boolean);
        // Exclude root-level redirect pages (no locale prefix)
        const localePaths = astroLocales.map(l => l.path);
        const firstSegment = segments[0];
        if (segments.length > 0 && !localePaths.includes(firstSegment))
          return false;
        // Exclude root path / (JS redirect page)
        if (segments.length === 0) return false;
        return true;
      },
    }),
  ],
  markdown: {
    processor: satteri({
      features: {
        math: LATEX.enabled,
        gfm: true,
        frontmatter: true,
      },
      mdastPlugins: [
        ...(LATEX.enabled ? [katex()] : []),
        tocCollapse(),
      ],
      hastPlugins: [satteriCallouts()],
    }),
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
    svgOptimizer: svgoOptimizer(),
    clientPrerender: true,
  },
});
