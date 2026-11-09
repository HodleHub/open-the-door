---
name: seo
description: Run the SEO, GEO and AEO loop for a public neobank site built from this kit. Validate the sitemap and crawler access, run the daily check, compare windows of search and answer-engine numbers, and ship ranked improvements as reviewed pull requests. Use for "validate sitemap", "daily SEO check", "why did traffic drop", "are we cited by ChatGPT/Claude/Perplexity", "SEO improvement round" or llms.txt questions. Not for paid media.
---

# Skill: SEO, GEO and AEO loop

One loop, three audiences: classic search results (SEO), generative answers that
cite sources (GEO) and direct answers or snippets that quote one page (AEO). The
same page wins all three when it is crawlable, server-rendered, specific and
honest. Read [SEO, GEO and AEO](../../docs/growth/seo.md) and the
[daily loop](../../docs/growth/seo-daily.md) before the first run.

```
1 VALIDATE  robots.txt, sitemap, crawler access, sampled pages   runSeoDailyCheck
2 MEASURE   one snapshot per fixed window, stored append-only    SeoSnapshot
3 COMPARE   current window vs previous window                    compareSeoSnapshots
4 DIAGNOSE  every regression gets a cause before a fix           read, do not guess
5 IMPROVE   ranked list -> one pull request per improvement      human merges
6 VERIFY    re-run 1 on the deployed site; record the result     next window confirms
```

Each step gates the next. A blocked step 1 is an incident, not a ranking project.

## 1. Validate (daily, scheduled)

Run [`runSeoDailyCheck`](../../templates/seo/runSeoDailyCheck.ts) against the live
origin with a bounded fetch. It checks robots.txt (and the `Sitemap:` line), the
sitemap through [`validateSitemap`](../../templates/seo/validateSitemap.ts), access
for every crawler in
[`SEARCH_AND_ANSWER_CRAWLERS`](../../templates/seo/checkCrawlerAccess.ts), sampled
pages through [`auditPageHtml`](../../templates/seo/auditPageHtml.ts) and llms.txt
presence. `blocked: true` means something stops indexing today: page the owner.

The sample is fixed and versioned: the home page, every money-path landing page
(Pix, stablecoin, Bitcoin, pricing, FAQ) and the newest page from the sitemap.
`requiredPaths` lists the URLs that must always be in the sitemap.

## 2. Measure (weekly snapshot, daily optional)

Write one [`SeoSnapshot`](../../templates/seo/compareSeoSnapshots.ts) per window to
append-only storage. Use complete days only: search console data lags two to three
days, so a seven-day window ends three days before the run. Answer-engine fields
come from the fixed prompt panel described in the daily loop manual: same prompts,
same engines, same count, every time. Changing the panel resets the baseline.

## 3. Compare

Run `compareSeoSnapshots({ previous, current })` on equal-length windows.
Thresholds treat low volume as noise. Report the verdict with the deltas table:

| Metric | Previous | Current | Change | Reading |
| ------ | -------- | ------- | ------ | ------- |

Also compare the same window four weeks earlier before calling a trend; one week
is weather.

## 4. Diagnose

For each regression, find the cause before proposing work, in this order:
indexing (step 1 events, search console coverage), a deploy that changed the
affected URLs, a search or answer-engine update, seasonality, then competition.
Write the cause and the evidence. "Algorithm" is not a cause without a date match.

## 5. Improve

Rank candidates by impact x ease and keep the top five. Each candidate names one
URL, one primary query or prompt, one intent and the metric it should move.
Typical order: indexing blockers, missing answer-first paragraphs on money pages,
FAQ that matches real questions, internal links from strong pages, structured data
that matches visible content, new pages for uncovered questions.

Open one pull request per improvement with the before/after evidence (the audit
codes, a screenshot of the rendered block, the sitemap entry). Do not merge or
deploy: a human reviews both. Never claim yields, regulatory status, custody or
partnerships the operator has not confirmed in writing.

## 6. Verify

After deploy, re-run step 1 against production and record the events. Read the
metric the change targeted only after two full windows. A change that moved
nothing is information: record it next to the hypothesis.

## Hard rules

- One URL, one primary query, one intent. Two intents are two linked pages.
- Structured data describes visible content only (FAQ schema needs the visible FAQ).
- Server-render the answer. Content that appears only after client JavaScript is
  invisible to several answer-engine crawlers.
- Blocking a training crawler is a policy choice; blocking a search or user-fetch
  crawler removes the site from that engine's answers. Decide per crawler.
- Logs and dashboards hold aggregate codes and counts, never page bodies, query
  strings with identifiers or customer data.
- Do not invent keywords or prompts; derive them from search console queries,
  support questions and live result pages.
