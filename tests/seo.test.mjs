import test from "node:test";
import assert from "node:assert/strict";
import { validateSitemap } from "../.build/templates/seo/validateSitemap.js";
import {
  checkCrawlerAccess,
  SEARCH_AND_ANSWER_CRAWLERS,
} from "../.build/templates/seo/checkCrawlerAccess.js";
import { auditPageHtml } from "../.build/templates/seo/auditPageHtml.js";
import { compareSeoSnapshots } from "../.build/templates/seo/compareSeoSnapshots.js";
import { runSeoDailyCheck } from "../.build/templates/seo/runSeoDailyCheck.js";

const origin = "https://bank.example.com";
const nowMs = Date.parse("2026-11-09T12:00:00Z");

const sitemapXml = (urls) =>
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map(
      ([loc, lastmod]) =>
        `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
    )
    .join("")}</urlset>`;

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", name: "Pix to stablecoin" },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How long does a Pix deposit take?",
          acceptedAnswer: { "@type": "Answer", text: "Usually seconds." },
        },
      ],
    },
  ],
});

const pageHtml = ({
  canonical,
  question = "How long does a Pix deposit take?",
}) =>
  `<html><head><title>Pix to stablecoin in seconds | Example Bank</title>
<meta name="description" content="Convert Pix to a stablecoin with a quote you approve before it executes, with fees shown upfront.">
<link rel="canonical" href="${canonical}">
<script type="application/ld+json">${faqJsonLd}</script></head>
<body><h1>Pix to stablecoin</h1><p>${"word ".repeat(300)}</p><h2>${question}</h2><p>Usually seconds.</p></body></html>`;

test("sitemap validation accepts a clean urlset and reports each defect", () => {
  const clean = validateSitemap({
    xml: sitemapXml([
      [`${origin}/`, "2026-11-08"],
      [`${origin}/pix?ref=a&amp;b=c`, "2026-11-08T10:00:00Z"],
    ]),
    origin,
    nowMs,
    requiredPaths: ["/"],
  });

  assert.equal(clean.success, true);
  assert.deepEqual(clean.data.issues, []);
  assert.equal(clean.data.entries[1].loc, `${origin}/pix?ref=a&b=c`);

  const broken = validateSitemap({
    xml: sitemapXml([
      [`http://bank.example.com/a`, "2026-11-08"],
      ["https://other.example.org/b", "2026-11-08"],
      [`${origin}/c`, "2027-01-01"],
      [`${origin}/c`, "yesterday"],
      [`${origin}/d#top`, undefined],
    ]),
    origin,
    nowMs,
    requiredPaths: ["/faq"],
  });
  const codes = broken.data.issues.map((issue) => issue.code).sort();

  assert.deepEqual(codes, [
    "DUPLICATE_URL",
    "FOREIGN_ORIGIN",
    "FUTURE_LASTMOD",
    "INSECURE_URL",
    "INVALID_LASTMOD",
    "MISSING_LASTMOD",
    "MISSING_REQUIRED_PATH",
    "URL_FRAGMENT",
  ]);
  const root = validateSitemap({
    xml: sitemapXml([
      [origin, "2026-11-08"],
      [`${origin}/`, "2026-11-08"],
    ]),
    origin,
    nowMs,
    requiredPaths: ["/"],
  });

  assert.deepEqual(
    root.data.issues.map((issue) => issue.code),
    ["DUPLICATE_URL"],
  );
  assert.equal(
    validateSitemap({ xml: "<html></html>", origin, nowMs }).code,
    "NOT_A_SITEMAP",
  );
  assert.equal(
    validateSitemap({ xml: "", origin: `${origin}/x`, nowMs }).code,
    "INVALID_ORIGIN",
  );
});

test("robots.txt picks the most specific group and the longest rule", () => {
  const robotsTxt = [
    "User-agent: *",
    "Disallow: /app/",
    "Allow: /app/public$",
    "",
    "User-agent: GPTBot",
    "User-agent: CCBot",
    "Disallow: /",
    "",
    "User-agent: OAI-SearchBot",
    "Disallow:",
    "Sitemap: https://bank.example.com/sitemap.xml",
  ].join("\n");
  const access = (path, userAgents) =>
    checkCrawlerAccess({ robotsTxt, path, userAgents }).data.map(
      (entry) => entry.allowed,
    );

  assert.deepEqual(
    access("/pix", ["Googlebot", "GPTBot", "OAI-SearchBot", "CCBot"]),
    [true, false, true, false],
  );
  assert.deepEqual(access("/app/settings", ["Googlebot"]), [false]);
  assert.deepEqual(access("/app/public", ["Googlebot"]), [true]);
  assert.deepEqual(access("/app/public/x", ["Googlebot"]), [false]);
  assert.ok(SEARCH_AND_ANSWER_CRAWLERS.includes("OAI-SearchBot"));
  assert.equal(
    checkCrawlerAccess({ robotsTxt, path: "pix", userAgents: [] }).code,
    "INVALID_PATH",
  );
});

test("page audit passes a complete page and flags answer-engine traps", () => {
  const canonical = `${origin}/pix`;
  const good = auditPageHtml({
    html: pageHtml({ canonical }),
    expectedCanonical: canonical,
  });

  assert.deepEqual(good.issues, []);
  assert.deepEqual(
    auditPageHtml({
      html: pageHtml({ canonical: origin }),
      expectedCanonical: `${origin}/`,
    }).issues,
    [],
  );
  assert.deepEqual(good.signals.jsonLdTypes, ["WebPage", "FAQPage"]);

  const hidden = auditPageHtml({
    html: pageHtml({
      canonical: `${origin}/other`,
      question: "Something else",
    }).replace("<h1>", '<meta name="robots" content="noindex"><h1>'),
    expectedCanonical: canonical,
  });

  assert.deepEqual(hidden.issues.sort(), [
    "CANONICAL_MISMATCH",
    "FAQ_NOT_VISIBLE",
    "NOINDEX",
  ]);
  assert.ok(
    auditPageHtml({
      html: "<html><h1>a</h1><h1>b</h1></html>",
      expectedCanonical: canonical,
    }).issues.includes("H1_COUNT"),
  );
});

const snapshot = (overrides) => ({
  windowEnd: "2026-11-01",
  sitemapUrls: 40,
  indexedUrls: 36,
  clicks: 400,
  impressions: 10000,
  averagePosition: 12,
  answerPrompts: 30,
  answerMentions: 9,
  answerCitations: 6,
  aiReferralSessions: 120,
  ...overrides,
});

test("snapshot comparison separates regressions, improvements and noise", () => {
  const regressed = compareSeoSnapshots({
    previous: snapshot({}),
    current: snapshot({
      windowEnd: "2026-11-08",
      clicks: 250,
      averagePosition: 9,
      answerCitations: 12,
      aiReferralSessions: 125,
    }),
  });

  assert.equal(regressed.data.verdict, "regressed");
  assert.deepEqual(regressed.data.regressions, ["clicks", "ctr"]);
  assert.deepEqual(regressed.data.improvements, [
    "averagePosition",
    "citationShare",
  ]);

  const quiet = compareSeoSnapshots({
    previous: snapshot({ clicks: 10, impressions: 200 }),
    current: snapshot({ windowEnd: "2026-11-08", clicks: 4, impressions: 200 }),
  });

  assert.ok(!quiet.data.regressions.includes("clicks"));
  assert.equal(
    compareSeoSnapshots({ previous: snapshot({}), current: snapshot({}) }).code,
    "SNAPSHOTS_OUT_OF_ORDER",
  );
  assert.equal(
    compareSeoSnapshots({
      previous: snapshot({ answerCitations: 31 }),
      current: snapshot({}),
    }).code,
    "INVALID_SNAPSHOT",
  );
});

test("daily check emits aggregate codes and blocks on indexing failures", async () => {
  const canonical = `${origin}/pix`;
  const pages = {
    [`${origin}/robots.txt`]:
      "User-agent: *\nAllow: /\nSitemap: https://bank.example.com/sitemap.xml",
    [`${origin}/sitemap.xml`]: sitemapXml([[canonical, "2026-11-08"]]),
    [canonical]: pageHtml({ canonical }),
  };
  const fetchText = async ({ url }) =>
    url in pages
      ? { success: true, data: { status: 200, body: pages[url] } }
      : { success: true, data: { status: 404, body: "" } };
  const healthy = await runSeoDailyCheck({
    origin,
    samplePaths: ["/pix"],
    crawlers: SEARCH_AND_ANSWER_CRAWLERS,
    requiredPaths: ["/pix"],
    nowMs,
    fetchText,
  });

  assert.equal(healthy.blocked, false);
  assert.equal(healthy.sitemapUrls, 1);
  assert.deepEqual(healthy.events, [
    { check: "llms", code: "LLMS_TXT_ABSENT", count: 1 },
  ]);

  const broken = await runSeoDailyCheck({
    origin,
    samplePaths: ["/pix", "/missing"],
    crawlers: ["Googlebot"],
    requiredPaths: ["/faq"],
    nowMs,
    fetchText,
  });
  const codes = broken.events.map((event) => event.code);

  assert.equal(broken.blocked, true);
  assert.ok(codes.includes("MISSING_REQUIRED_PATH"));
  assert.ok(codes.includes("PAGE_UNAVAILABLE"));
  assert.ok(!JSON.stringify(broken.events).includes("<html"));
});
