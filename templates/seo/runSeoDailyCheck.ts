import type { Result } from "../core/types.js";
import { auditPageHtml, type PageIssueCode } from "./auditPageHtml.js";
import { checkCrawlerAccess } from "./checkCrawlerAccess.js";
import { validateSitemap, type SitemapIssueCode } from "./validateSitemap.js";

export type FetchedText = { status: number; body: string };

export type FetchText = (args: { url: string }) => Promise<Result<FetchedText>>;

export type SeoCheckEvent = {
  check: "robots" | "sitemap" | "crawler" | "page" | "llms";
  code: string;
  count: number;
};

export type SeoDailyReport = {
  sitemapUrls: number;
  pagesAudited: number;
  blocked: boolean;
  events: SeoCheckEvent[];
};

export type RunSeoDailyCheckArgs = {
  origin: string;
  samplePaths: string[];
  crawlers: string[];
  requiredPaths: string[];
  nowMs: number;
  fetchText: FetchText;
};

const BLOCKING_CODES = new Set<string>([
  "SITEMAP_UNAVAILABLE",
  "NOT_A_SITEMAP",
  "MISSING_REQUIRED_PATH",
  "FOREIGN_ORIGIN",
  "CRAWLER_BLOCKED",
  "PAGE_UNAVAILABLE",
  "NOINDEX",
  "CANONICAL_MISMATCH",
  "INVALID_JSON_LD",
]);

const countBy = (
  check: SeoCheckEvent["check"],
  codes: string[],
): SeoCheckEvent[] =>
  [...new Set(codes)].map((code) => ({
    check,
    code,
    count: codes.filter((item) => item === code).length,
  }));

const fetchOk = async (
  fetchText: FetchText,
  url: string,
): Promise<string | undefined> => {
  const response = await fetchText({ url });

  if (!response.success || response.data.status !== 200) return undefined;

  return response.data.body;
};

const crawlerCodes = (
  robotsTxt: string,
  paths: string[],
  crawlers: string[],
): string[] =>
  paths.flatMap((path) => {
    const access = checkCrawlerAccess({
      robotsTxt,
      path,
      userAgents: crawlers,
    });

    if (!access.success) return [access.code];

    return access.data
      .filter((entry) => !entry.allowed)
      .map(() => "CRAWLER_BLOCKED");
  });

const auditPaths = async (
  args: RunSeoDailyCheckArgs,
): Promise<(PageIssueCode | "PAGE_UNAVAILABLE")[]> => {
  const audits = await Promise.all(
    args.samplePaths.map(async (path) => {
      const url = new URL(path, args.origin).href;
      const html = await fetchOk(args.fetchText, url);

      if (html === undefined) return ["PAGE_UNAVAILABLE" as const];

      return auditPageHtml({ html, expectedCanonical: url }).issues;
    }),
  );

  return audits.flat();
};

/**
 * One daily pass over a live origin with an injected fetch: robots.txt, sitemap,
 * crawler access for search and answer engines, sampled page audits and llms.txt
 * presence. Emits aggregate codes only, never page bodies or full URLs, and marks
 * the run blocked when anything would stop indexing.
 */
export const runSeoDailyCheck = async (
  args: RunSeoDailyCheckArgs,
): Promise<SeoDailyReport> => {
  const robotsTxt =
    (await fetchOk(args.fetchText, `${args.origin}/robots.txt`)) ?? "";
  const declared = /^\s*sitemap:\s*(\S+)/im.exec(robotsTxt)?.[1];
  const sitemapUrl = declared ?? `${args.origin}/sitemap.xml`;
  const xml = await fetchOk(args.fetchText, sitemapUrl);
  const sitemap =
    xml === undefined
      ? undefined
      : validateSitemap({
          xml,
          origin: args.origin,
          nowMs: args.nowMs,
          requiredPaths: args.requiredPaths,
        });
  const sitemapCodes: (SitemapIssueCode | string)[] = !sitemap
    ? ["SITEMAP_UNAVAILABLE"]
    : sitemap.success
      ? sitemap.data.issues.map((issue) => issue.code)
      : [sitemap.code];
  const llms = await fetchOk(args.fetchText, `${args.origin}/llms.txt`);
  const pageCodes = await auditPaths(args);
  const events = [
    ...countBy(
      "robots",
      robotsTxt
        ? declared
          ? []
          : ["SITEMAP_NOT_DECLARED"]
        : ["ROBOTS_UNAVAILABLE"],
    ),
    ...countBy("sitemap", sitemapCodes),
    ...countBy(
      "crawler",
      crawlerCodes(robotsTxt, args.samplePaths, args.crawlers),
    ),
    ...countBy("page", pageCodes),
    ...countBy("llms", llms === undefined ? ["LLMS_TXT_ABSENT"] : []),
  ];

  return {
    sitemapUrls: sitemap?.success ? sitemap.data.entries.length : 0,
    pagesAudited: args.samplePaths.length,
    blocked: events.some((event) => BLOCKING_CODES.has(event.code)),
    events,
  };
};
