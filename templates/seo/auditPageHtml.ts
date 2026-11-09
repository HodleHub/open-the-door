export type PageIssueCode =
  | "MISSING_TITLE"
  | "TITLE_LENGTH"
  | "MISSING_DESCRIPTION"
  | "DESCRIPTION_LENGTH"
  | "CANONICAL_MISMATCH"
  | "H1_COUNT"
  | "NOINDEX"
  | "INVALID_JSON_LD"
  | "FAQ_NOT_VISIBLE"
  | "THIN_CONTENT";

export type PageSignals = {
  title: string;
  wordCount: number;
  jsonLdTypes: string[];
  faqQuestions: string[];
};

export type PageAudit = { issues: PageIssueCode[]; signals: PageSignals };

export type AuditPageHtmlArgs = {
  html: string;
  expectedCanonical: string;
  minimumWords?: number;
};

const TITLE_RANGE = { minimum: 10, maximum: 65 } as const;
const DESCRIPTION_RANGE = { minimum: 50, maximum: 165 } as const;
const DEFAULT_MINIMUM_WORDS = 250;

const firstMatch = (html: string, pattern: RegExp): string | undefined =>
  pattern.exec(html)?.[1]?.trim();

const visibleText = (html: string): string =>
  html
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const readJsonLd = (html: string): { valid: boolean; nodes: unknown[] } => {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  try {
    const values: unknown[] = blocks.map((block) => JSON.parse(block[1] ?? ""));
    const nodes = values.flatMap((value) =>
      Array.isArray(value) ? value : [value],
    );
    const graph = nodes.flatMap((node) =>
      node &&
      typeof node === "object" &&
      "@graph" in node &&
      Array.isArray(node["@graph"])
        ? node["@graph"]
        : [node],
    );

    return { valid: true, nodes: graph };
  } catch {
    return { valid: false, nodes: [] };
  }
};

const typeOf = (node: unknown): string[] => {
  if (!node || typeof node !== "object" || !("@type" in node)) return [];

  const value = node["@type"];

  return (Array.isArray(value) ? value : [value]).filter(
    (item): item is string => typeof item === "string",
  );
};

const faqQuestionsOf = (nodes: unknown[]): string[] =>
  nodes
    .filter((node) => typeOf(node).includes("FAQPage"))
    .flatMap((node) =>
      node &&
      typeof node === "object" &&
      "mainEntity" in node &&
      Array.isArray(node.mainEntity)
        ? node.mainEntity
        : [],
    )
    .map((question: unknown) =>
      question && typeof question === "object" && "name" in question
        ? question.name
        : undefined,
    )
    .filter((name): name is string => typeof name === "string");

const sameUrl = (left: string | undefined, right: string): boolean =>
  left !== undefined &&
  URL.canParse(left) &&
  URL.canParse(right) &&
  new URL(left).href === new URL(right).href;

const outside = (
  length: number,
  range: { minimum: number; maximum: number },
): boolean => length < range.minimum || length > range.maximum;

/**
 * Heuristic on-page audit of server-rendered HTML for search and answer engines:
 * metadata, a single h1, canonical, indexability, parseable JSON-LD and FAQ schema
 * that matches visible text. Use a real HTML parser where precision matters.
 */
export const auditPageHtml = (args: AuditPageHtmlArgs): PageAudit => {
  const title = firstMatch(args.html, /<title[^>]*>([\s\S]*?)<\/title>/i) ?? "";
  const description = firstMatch(
    args.html,
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
  );
  const canonical = firstMatch(
    args.html,
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i,
  );
  const robots = firstMatch(
    args.html,
    /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i,
  );
  const h1Count = [...args.html.matchAll(/<h1[\s>]/gi)].length;
  const text = visibleText(args.html);
  const wordCount = text ? text.split(" ").length : 0;
  const jsonLd = readJsonLd(args.html);
  const faqQuestions = faqQuestionsOf(jsonLd.nodes);
  const checks: [boolean, PageIssueCode][] = [
    [!title, "MISSING_TITLE"],
    [Boolean(title) && outside(title.length, TITLE_RANGE), "TITLE_LENGTH"],
    [description === undefined, "MISSING_DESCRIPTION"],
    [
      description !== undefined &&
        outside(description.length, DESCRIPTION_RANGE),
      "DESCRIPTION_LENGTH",
    ],
    [!sameUrl(canonical, args.expectedCanonical), "CANONICAL_MISMATCH"],
    [h1Count !== 1, "H1_COUNT"],
    [/noindex/i.test(robots ?? ""), "NOINDEX"],
    [!jsonLd.valid, "INVALID_JSON_LD"],
    [
      faqQuestions.some((question) => !text.includes(question)),
      "FAQ_NOT_VISIBLE",
    ],
    [wordCount < (args.minimumWords ?? DEFAULT_MINIMUM_WORDS), "THIN_CONTENT"],
  ];

  return {
    issues: checks.filter(([failed]) => failed).map(([, code]) => code),
    signals: {
      title,
      wordCount,
      jsonLdTypes: [...new Set(jsonLd.nodes.flatMap(typeOf))],
      faqQuestions,
    },
  };
};
