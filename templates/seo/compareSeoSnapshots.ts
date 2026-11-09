import type { Result } from "../core/types.js";

/**
 * Aggregate of one fixed window (for example the last 7 complete days). Search
 * fields come from the search console export; answer fields come from a fixed
 * prompt panel run against answer engines with the same prompts every time.
 */
export type SeoSnapshot = {
  windowEnd: string;
  sitemapUrls: number;
  indexedUrls: number;
  clicks: number;
  impressions: number;
  averagePosition: number;
  answerPrompts: number;
  answerMentions: number;
  answerCitations: number;
  aiReferralSessions: number;
};

export type SeoMetric =
  | "indexedRatio"
  | "clicks"
  | "impressions"
  | "ctr"
  | "averagePosition"
  | "mentionShare"
  | "citationShare"
  | "aiReferralSessions";

export type MetricDelta = {
  metric: SeoMetric;
  previous: number;
  current: number;
  change: number;
};

export type SeoVerdict = "improved" | "stable" | "regressed";

export type SeoComparison = {
  deltas: MetricDelta[];
  regressions: SeoMetric[];
  improvements: SeoMetric[];
  verdict: SeoVerdict;
};

export type CompareSeoSnapshotsArgs = {
  previous: SeoSnapshot;
  current: SeoSnapshot;
};

const RELATIVE_THRESHOLD = 0.2;
const SHARE_THRESHOLD = 0.1;
const POSITION_THRESHOLD = 2;
const MINIMUM_VOLUME = 50;

const ratio = (part: number, whole: number): number =>
  whole > 0 ? part / whole : 0;

const project = (snapshot: SeoSnapshot): Record<SeoMetric, number> => ({
  indexedRatio: ratio(snapshot.indexedUrls, snapshot.sitemapUrls),
  clicks: snapshot.clicks,
  impressions: snapshot.impressions,
  ctr: ratio(snapshot.clicks, snapshot.impressions),
  averagePosition: snapshot.averagePosition,
  mentionShare: ratio(snapshot.answerMentions, snapshot.answerPrompts),
  citationShare: ratio(snapshot.answerCitations, snapshot.answerPrompts),
  aiReferralSessions: snapshot.aiReferralSessions,
});

const direction = (delta: MetricDelta): -1 | 0 | 1 => {
  const { metric, previous, current, change } = delta;

  if (metric === "averagePosition") {
    if (Math.abs(change) < POSITION_THRESHOLD || previous === 0) return 0;

    return change < 0 ? 1 : -1;
  }

  if (
    metric.endsWith("Share") ||
    metric.endsWith("Ratio") ||
    metric === "ctr"
  ) {
    if (Math.abs(change) < SHARE_THRESHOLD * Math.max(previous, current, 0.1))
      return 0;

    return change > 0 ? 1 : -1;
  }

  if (Math.max(previous, current) < MINIMUM_VOLUME) return 0;

  if (Math.abs(change) < RELATIVE_THRESHOLD * Math.max(previous, 1)) return 0;

  return change > 0 ? 1 : -1;
};

const isValid = (snapshot: SeoSnapshot): boolean =>
  Object.values(snapshot).every((value) =>
    typeof value === "string"
      ? !Number.isNaN(Date.parse(value))
      : Number.isFinite(value) && value >= 0,
  ) &&
  snapshot.answerMentions <= snapshot.answerPrompts &&
  snapshot.answerCitations <= snapshot.answerPrompts &&
  snapshot.clicks <= snapshot.impressions;

/**
 * Compare two equal-length windows and classify each SEO, GEO and AEO metric as a
 * regression, an improvement or noise. Lower average position is better. Small
 * volumes are treated as noise so a quiet day does not page anyone.
 */
export const compareSeoSnapshots = (
  args: CompareSeoSnapshotsArgs,
): Result<SeoComparison> => {
  if (!isValid(args.previous) || !isValid(args.current)) {
    return { success: false, code: "INVALID_SNAPSHOT" };
  }

  if (
    Date.parse(args.current.windowEnd) <= Date.parse(args.previous.windowEnd)
  ) {
    return { success: false, code: "SNAPSHOTS_OUT_OF_ORDER" };
  }

  const before = project(args.previous);
  const after = project(args.current);
  const metrics = Object.keys(before).filter(
    (key): key is SeoMetric => key in after,
  );
  const deltas = metrics.map((metric) => ({
    metric,
    previous: before[metric],
    current: after[metric],
    change: after[metric] - before[metric],
  }));
  const regressions = deltas
    .filter((delta) => direction(delta) < 0)
    .map((delta) => delta.metric);
  const improvements = deltas
    .filter((delta) => direction(delta) > 0)
    .map((delta) => delta.metric);
  const verdict: SeoVerdict = regressions.length
    ? "regressed"
    : improvements.length
      ? "improved"
      : "stable";

  return {
    success: true,
    data: { deltas, regressions, improvements, verdict },
  };
};
