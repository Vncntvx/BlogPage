import { readFileSync } from "fs";
import { load } from "js-yaml";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "./config";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 定义所有可能的翻译键
type TranslationKeys = {
  // Navigation
  home: string;
  posts: string;
  about: string;
  archives: string;
  search: string;
  tags: string;
  categories: string;

  // Post related
  readMore: string;
  publishedOn: string;
  updatedOn: string;
  tagsLabel: string;
  sharePost: string;
  editPost: string;
  backToTop: string;
  backToHome: string;
  translationMissingTitle: string;
  translationMissingDescription: string;
  translationAvailableIn: string;
  translationGoToAvailable: string;

  // Pagination
  nextPage: string;
  prevPage: string;

  // Search
  searchPlaceholder: string;
  searchResults: string;
  noResultsFound: string;

  // Archives
  allArchives: string;
  noArchives: string;

  // Tags
  allTags: string;
  noTags: string;

  // Categories
  allCategories: string;
  noCategories: string;
  categoriesTitle: string;
  categoriesDescription: string;
  categoryTitle: string;
  categoryDescription: string;
  categoryLabel: string;
  defaultCategory: string;

  // Footer
  themeToggle: string;
  poweredBy: string;

  // Meta
  minutesRead: string;

  // Index page (UI labels)
  socialLinks: string;
  featured: string;
  recentPosts: string;
  allPosts: string;

  // NOTE: Page-specific rich content (e.g. Index/About) should live under
  // `src/data/**` like `src/data/about/*.md` and `src/data/index/*.md`.
  // Keep i18n for reusable UI strings only.

  // Posts page
  postsTitle: string;
  postsDescription: string;

  // Tags page
  tagsTitle: string;
  tagsDescription: string;

  // Tag page
  tagTitle: string;
  tagDescription: string;

  // Related posts
  relatedPosts: string;

  // Archives page
  archivesTitle: string;
  archivesDescription: string;

  // Search page
  searchTitle: string;
  searchDescription: string;

  // Header
  skipToContent: string;
  openMenu: string;
  closeMenu: string;

  // Post details
  previousPost: string;
  nextPost: string;
  sharePostOn: string;

  // Footer
  copyright: string;
  allRightsReserved: string;

  // Post copyright card
  copyrightCardText: string;
  copyrightCardContactLinkText: string;
  copyrightCardExtraSA: string;
  copyrightCardSameLicenseLinkText: string;
  copyrightCardExtraND: string;

  // Pagination
  prev: string;
  next: string;

  // Months
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;

  // Table of contents
  tableOfContents: string;
  tocCurrentSection: string;
  tocOpen: string;
  tocClose: string;
};

type TranslationListKeys = never;

// 加载翻译文件的函数
function readTranslationFile(locale: LocaleCode): TranslationKeys | null {
  try {
    const yamlPath = join(__dirname, "..", "data", "i18n", `${locale}.yaml`);
    const yamlContent = readFileSync(yamlPath, "utf8");
    return load(yamlContent) as TranslationKeys;
  } catch {
    try {
      const yamlPath = join(process.cwd(), "src/data/i18n", `${locale}.yaml`);
      const yamlContent = readFileSync(yamlPath, "utf8");
      return load(yamlContent) as TranslationKeys;
    } catch {
      return null;
    }
  }
}

const fallbackTranslation =
  readTranslationFile(DEFAULT_LOCALE.code as LocaleCode) ??
  ({} as TranslationKeys);

function loadTranslationFile(locale: LocaleCode): TranslationKeys {
  const translation = readTranslationFile(locale);
  if (translation) return translation;
  return fallbackTranslation;
}

export const translations = Object.fromEntries(
  SUPPORTED_LOCALES.map(locale => [
    locale.code,
    loadTranslationFile(locale.code as LocaleCode),
  ])
) as Record<LocaleCode, TranslationKeys>;

export type TranslationKey = Exclude<
  keyof TranslationKeys,
  TranslationListKeys
>;
export type Locale = LocaleCode;
