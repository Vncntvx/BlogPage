import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { SITE } from "@/config";
import { DEFAULT_LOCALE, LOCALE_CODES } from "@/i18n/config";

export const BLOG_PATH = "src/data/blog";

const LOCALE_ENUM_VALUES = LOCALE_CODES as [string, ...string[]];
const CC_LICENSE_VALUES = [
  "by",
  "by-sa",
  "by-nd",
  "by-nc",
  "by-nc-sa",
  "by-nc-nd",
] as const;

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z
        .union([z.string(), z.array(z.string())])
        .default(SITE.author)
        .transform(value => (Array.isArray(value) ? value : [value])),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      slug: z.string().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      category: z.string().default("General"),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      showCopyright: z.boolean().optional(),
      ccLicense: z.enum(CC_LICENSE_VALUES).optional(),
      timezone: z.string().optional(),
      lang: z.enum(LOCALE_ENUM_VALUES).default(DEFAULT_LOCALE.code),
          toc: z.boolean().optional().default(false),
    }),
});

export const collections = { blog };
