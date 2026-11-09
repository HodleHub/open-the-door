import type { Result } from "../core/types.js";

export type SitemapKind = "urlset" | "index";

export type SitemapEntry = { loc: string; lastmod?: string };

export type SitemapIssueCode =
  | "INVALID_URL"
  | "INSECURE_URL"
  | "FOREIGN_ORIGIN"
  | "URL_FRAGMENT"
  | "DUPLICATE_URL"
  | "MISSING_LASTMOD"
  | "INVALID_LASTMOD"
  | "FUTURE_LASTMOD"
  | "TOO_MANY_URLS"
  | "MISSING_REQUIRED_PATH";

export type SitemapIssue = { code: SitemapIssueCode; loc?: string };

export type SitemapReport = {
  kind: SitemapKind;
  entries: SitemapEntry[];
  issues: SitemapIssue[];
};

export type ValidateSitemapArgs = {
  xml: string;
  origin: string;
  nowMs: number;
  requiredPaths?: string[];
};

const MAXIMUM_BYTES = 52_428_800;
const MAXIMUM_URLS = 50_000;
const FUTURE_TOLERANCE_MS = 86_400_000;
const W3C_DATETIME =
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/;
const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

const decode = (text: string): string =>
  text.replace(
    /&(?:amp|lt|gt|quot|apos);/g,
    (entity) => ENTITIES[entity] ?? entity,
  );

const readTag = (block: string, tag: string): string | undefined => {
  const match = new RegExp(`<${tag}>\\s*([^<]*?)\\s*</${tag}>`).exec(block);

  return match?.[1] ? decode(match[1]) : undefined;
};

const normalize = (loc: string): string =>
  URL.canParse(loc) ? new URL(loc).href : loc;

const issue = (code: SitemapIssueCode, loc?: string): SitemapIssue =>
  loc === undefined ? { code } : { code, loc };

const checkLoc = (loc: string, origin: string): SitemapIssue[] => {
  if (!URL.canParse(loc)) return [issue("INVALID_URL", loc)];

  const url = new URL(loc);

  if (url.protocol !== "https:") return [issue("INSECURE_URL", loc)];

  if (url.origin !== origin) return [issue("FOREIGN_ORIGIN", loc)];

  if (url.hash) return [issue("URL_FRAGMENT", loc)];

  return [];
};

const checkLastmod = (entry: SitemapEntry, nowMs: number): SitemapIssue[] => {
  if (entry.lastmod === undefined) return [issue("MISSING_LASTMOD", entry.loc)];

  const time = Date.parse(entry.lastmod);

  if (!W3C_DATETIME.test(entry.lastmod) || Number.isNaN(time)) {
    return [issue("INVALID_LASTMOD", entry.loc)];
  }

  if (time > nowMs + FUTURE_TOLERANCE_MS) {
    return [issue("FUTURE_LASTMOD", entry.loc)];
  }

  return [];
};

const findDuplicates = (entries: SitemapEntry[]): SitemapIssue[] =>
  entries
    .filter(
      (entry, index) =>
        entries.findIndex(
          (other) => normalize(other.loc) === normalize(entry.loc),
        ) !== index,
    )
    .map((entry) => issue("DUPLICATE_URL", entry.loc));

const findMissingPaths = (
  entries: SitemapEntry[],
  origin: string,
  requiredPaths: string[],
): SitemapIssue[] => {
  const locs = new Set(entries.map((entry) => normalize(entry.loc)));

  return requiredPaths
    .map((path) => new URL(path, origin).href)
    .filter((href) => !locs.has(href))
    .map((href) => issue("MISSING_REQUIRED_PATH", href));
};

/**
 * Validate sitemap XML text for one origin: absolute HTTPS URLs on that origin, no
 * duplicates, W3C lastmod that is not in the future, protocol size limits and the
 * paths the site must always expose. Parsing failures are returned as codes.
 */
export const validateSitemap = (
  args: ValidateSitemapArgs,
): Result<SitemapReport> => {
  if (
    !URL.canParse(args.origin) ||
    new URL(args.origin).origin !== args.origin
  ) {
    return { success: false, code: "INVALID_ORIGIN" };
  }

  if (new TextEncoder().encode(args.xml).byteLength > MAXIMUM_BYTES) {
    return { success: false, code: "SITEMAP_TOO_LARGE" };
  }

  const kind: SitemapKind | undefined = /<urlset[\s>]/.test(args.xml)
    ? "urlset"
    : /<sitemapindex[\s>]/.test(args.xml)
      ? "index"
      : undefined;

  if (kind === undefined) return { success: false, code: "NOT_A_SITEMAP" };

  const tag = kind === "urlset" ? "url" : "sitemap";
  const blocks = [
    ...args.xml.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g")),
  ];
  const parsed = blocks.map((block) => {
    const body = block[1] ?? "";
    const loc = readTag(body, "loc") ?? "";
    const lastmod = readTag(body, "lastmod");

    return lastmod === undefined ? { loc } : { loc, lastmod };
  });
  const entries: SitemapEntry[] = parsed;
  const issues: SitemapIssue[] = [
    ...entries.flatMap((entry) => checkLoc(entry.loc, args.origin)),
    ...entries.flatMap((entry) => checkLastmod(entry, args.nowMs)),
    ...findDuplicates(entries),
    ...(entries.length > MAXIMUM_URLS ? [issue("TOO_MANY_URLS")] : []),
    ...(kind === "urlset"
      ? findMissingPaths(entries, args.origin, args.requiredPaths ?? [])
      : []),
  ];

  return { success: true, data: { kind, entries, issues } };
};
