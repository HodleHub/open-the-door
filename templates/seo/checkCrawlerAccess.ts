import type { Result } from "../core/types.js";

export type CrawlerAccess = { userAgent: string; allowed: boolean };

export type CheckCrawlerAccessArgs = {
  robotsTxt: string;
  path: string;
  userAgents: string[];
};

type Rule = { allow: boolean; pattern: string };

type Group = { agents: string[]; rules: Rule[] };

/** Search and answer-engine crawlers worth checking daily. Verify names upstream. */
export const SEARCH_AND_ANSWER_CRAWLERS: string[] = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
];

const MAXIMUM_ROBOTS_BYTES = 512_000;

const parseLine = (line: string): [string, string] | undefined => {
  const content = line.split("#")[0]?.trim() ?? "";
  const separator = content.indexOf(":");

  if (separator < 1) return undefined;

  return [
    content.slice(0, separator).trim().toLowerCase(),
    content.slice(separator + 1).trim(),
  ];
};

const parseGroups = (robotsTxt: string): Group[] =>
  robotsTxt.split(/\r?\n/).reduce<Group[]>((groups, line) => {
    const pair = parseLine(line);

    if (!pair) return groups;

    const [field, value] = pair;
    const last = groups.at(-1);

    if (field === "user-agent") {
      if (last && last.rules.length === 0) {
        return [
          ...groups.slice(0, -1),
          { ...last, agents: [...last.agents, value.toLowerCase()] },
        ];
      }

      return [...groups, { agents: [value.toLowerCase()], rules: [] }];
    }

    if ((field !== "allow" && field !== "disallow") || !last) return groups;

    if (value === "") return groups;

    const rule: Rule = { allow: field === "allow", pattern: value };

    return [...groups.slice(0, -1), { ...last, rules: [...last.rules, rule] }];
  }, []);

const selectRules = (groups: Group[], userAgent: string): Rule[] => {
  const agent = userAgent.toLowerCase();
  const specific = groups.filter((group) =>
    group.agents.some((token) => token !== "*" && agent.includes(token)),
  );
  const chosen = specific.length
    ? specific
    : groups.filter((group) => group.agents.includes("*"));

  return chosen.flatMap((group) => group.rules);
};

const toRegExp = (pattern: string): RegExp => {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");

  return new RegExp(`^${body}${anchored ? "$" : ""}`);
};

const isAllowed = (rules: Rule[], path: string): boolean => {
  const matching = rules
    .filter((rule) => toRegExp(rule.pattern).test(path))
    .sort(
      (a, b) =>
        b.pattern.length - a.pattern.length ||
        Number(b.allow) - Number(a.allow),
    );

  return matching[0]?.allow ?? true;
};

/**
 * Evaluate robots.txt for each crawler on one path: the most specific user-agent
 * group applies, the longest matching rule wins and Allow wins a tie. A path no
 * rule matches is allowed.
 */
export const checkCrawlerAccess = (
  args: CheckCrawlerAccessArgs,
): Result<CrawlerAccess[]> => {
  if (
    new TextEncoder().encode(args.robotsTxt).byteLength > MAXIMUM_ROBOTS_BYTES
  ) {
    return { success: false, code: "ROBOTS_TOO_LARGE" };
  }

  if (!args.path.startsWith("/"))
    return { success: false, code: "INVALID_PATH" };

  const groups = parseGroups(args.robotsTxt);

  return {
    success: true,
    data: args.userAgents.map((userAgent) => ({
      userAgent,
      allowed: isAllowed(selectRules(groups, userAgent), args.path),
    })),
  };
};
