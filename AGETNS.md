# AGENTS.md

## Build & Dev Commands

- Install deps: `bun install`
- Dev server: `bun run dev`
- Production build: `bun run build` — runs `astro check && astro build && pagefind --site dist --root-selector body && cp -r dist/pagefind public/`
- Preview built site: `bun run preview`
- Sync Astro types: `bun run sync`
- Lint all: `bun run lint`
- Lint single file: `bun run lint -- src/path/to/file.ts`
- Format check: `bun run format:check`
- Format write: `bun run format`

No automated test suite. Verify with lint + full build.

## Architecture

**Stack**: Astro 6 + Tailwind CSS v4 + TypeScript strict. React is used only for the Giscus comment island (`src/components/Comments.tsx`).

**i18n system**: Manual routing (`i18n.routing = "manual"` in `astro.config.ts`).

- Locale definitions: `src/i18n/config.ts` — `SUPPORTED_LOCALES` array with code, path, name, aliases, dayjs config. Default locale is `zh`.
- Translation strings: `src/data/i18n/*.yaml` (UI labels), NOT for rich content.
- Route helpers: `src/i18n/utils.ts` — `t()`, `getLocalePath()`, `getStaticPaths()`, `getLocalizedUrl()`.
- All localized pages live under `src/pages/[lang]/...` and call `getStaticPaths()` from `src/i18n/utils.ts`.
- Root-level pages (`/about`, `/search`, `/tags`, `/posts/:slug`, `/archives`) are redirect shims to the localized route.

**Content pipeline**: File-based Markdown in `src/data/blog/{en,zh}/`. Schema enforced in `src/content.config.ts` via `defineCollection` + zod. Key frontmatter fields: `lang`, `slug`, `category`, `tags`, `ccLicense`, `timezone`, `draft`, `featured`.

**URL construction**: Centralized in `src/utils/getPath.ts`. `getCanonicalSlug()` strips locale prefixes from file paths and slug overrides; `getPath()` builds full URLs with optional locale prefix. Always use `getPath()` — never handcraft `/[lang]/posts/...` URLs.

**Feature flags**: `src/config.ts` (`SITE.pages.*`, `SITE.showArchives`) control both nav rendering and static path generation. Disabled pages return empty `getStaticPaths()` and redirect runtime access to `/404`.

**Social/Share config**: Two separate systems in `src/config.ts`:

- `SOCIAL` — personal profile links (social accounts). Icons mapped in `src/constants.ts` `SOCIAL_META`.
- `SHARE` — article share-to-platform links. Icons/URLs mapped in `src/constants.ts` `SHARE_META`.
When adding a platform, update both `src/config.ts` (enable/link) AND `src/constants.ts` (metadata + icon).

**Generated outputs**:

- RSS: `src/pages/rss.xml.ts`, `src/pages/[lang]/rss.xml.ts`
- OG images: `src/pages/og.png.ts`, `src/pages/[lang]/posts/[...slug]/index.png.ts` (satori + resvg)
- Search index: Pagefind runs during `bun run build`

## Key Conventions

- Use `@/` path aliases (configured in `tsconfig.json`) over relative imports.
- Rich page content goes in Markdown data files (`src/data/index/*.md`, `src/data/about/*.md`); UI strings go in i18n YAML (`src/data/i18n/*.yaml`).
- Blog posts must live under `src/data/blog/{en,zh}/` and include `lang` in frontmatter.
- Reuse post utilities from `src/utils/`: `getSortedPosts`, `postFilter`, `getUniqueTags`, `getUniqueCategories` — don't duplicate filtering/sorting logic.
- Respect `SITE.pages.*` and `SITE.showArchives` checks in navigation, routes, and links to avoid dead links when sections are disabled.
- ESLint rule `no-console: "error"` — no console statements in production code.
- The default locale is `zh` (Chinese), not English.

## CodeGraph

CodeGraph builds a semantic knowledge graph of codebases for faster, smarter code exploration.

### If `.codegraph/` exists in the project

**NEVER call `codegraph_explore` or `codegraph_context` directly in the main session.** These tools return large amounts of source code that fills up main session context. Instead, ALWAYS spawn an Explore agent for any exploration question (e.g., "how does X work?", "explain the Y system", "where is Z implemented?").

**When spawning Explore agents**, include this instruction in the prompt:

> This project has CodeGraph initialized (.codegraph/ exists). Use `codegraph_explore` as your PRIMARY tool — it returns full source code sections from all relevant files in one call.
>
> **Rules:**
> 1. Follow the explore call budget in the `codegraph_explore` tool description — it scales automatically based on project size.
> 2. Do NOT re-read files that codegraph_explore already returned source code for. The source sections are complete and authoritative.
> 3. Only fall back to grep/glob/read for files listed under "Additional relevant files" if you need more detail, or if codegraph returned no results.

**The main session may only use these lightweight tools directly** (for targeted lookups before making edits, not for exploration):

| Tool | Use For |
|------|---------|
| `codegraph_search` | Find symbols by name |
| `codegraph_callers` / `codegraph_callees` | Trace call flow |
| `codegraph_impact` | Check what's affected before editing |
| `codegraph_node` | Get a single symbol's details |

### If `.codegraph/` does NOT exist

At the start of a session, ask the user if they'd like to initialize CodeGraph:

"I notice this project doesn't have CodeGraph initialized. Would you like me to run `codegraph init -i` to build a code knowledge graph?"