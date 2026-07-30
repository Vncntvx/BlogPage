import { slugifyStr } from "./slugify";

/**
 * Sanitize a post title into a valid CSS custom-ident for view-transition-name.
 *
 * CSS <custom-ident> only allows [a-zA-Z0-9_-] plus non-ASCII codepoints
 * (U+00A0+), encoded as hex. This function:
 * 1. Slugifies the title (handles Latin and non-Latin)
 * 2. Encodes non-ASCII characters as `u` + 6-char hex codepoint
 * 3. Replaces remaining invalid characters with hyphens
 * 4. Prepends `p-` if the result starts with a digit
 * 5. Falls back to `"post"` if the result is empty
 */
export function toTransitionName(title: string): string {
  // Replace dots with hyphens (prevents CSS ident parsing issues)
  const preprocessed = title.replaceAll(".", "-");

  // Base slugification
  const slugified = slugifyStr(preprocessed);

  // Encode non-ASCII characters as hex
  let encoded = "";
  for (const ch of slugified) {
    const code = ch.codePointAt(0)!;
    if (code > 127) {
      encoded += "u" + code.toString(16).padStart(6, "0");
    } else {
      encoded += ch;
    }
  }

  // Replace remaining invalid characters with hyphens
  let sanitized = encoded.replace(/[^a-zA-Z0-9_-]/g, "-");

  // Collapse consecutive hyphens and trim leading/trailing hyphens
  sanitized = sanitized.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");

  // CSS idents cannot start with a digit
  if (/^\d/.test(sanitized)) {
    sanitized = "p-" + sanitized;
  }

  // Fallback if sanitization produces an empty string
  if (!sanitized) {
    return "post";
  }

  return sanitized;
}
