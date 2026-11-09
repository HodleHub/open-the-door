# Daily SEO loop: check, observe, compare, improve

The loop has a daily technical check, a weekly numbers comparison and an
improvement step that ships pull requests. Concepts are in
[SEO, GEO and AEO](seo.md); the agent procedure is the [SEO skill](../../skills/seo/SKILL.md).

## Daily check

Schedule one run per day against production, after the usual deploy window.
Inject a bounded fetch (timeout, size limit, identifying user agent without
personal contact data) into [runSeoDailyCheck](../../templates/seo/runSeoDailyCheck.ts):

```ts
const report = await runSeoDailyCheck({
  origin: "https://bank.example.com",
  samplePaths: ["/", "/pix", "/stablecoins", "/bitcoin", "/fees", "/faq"],
  requiredPaths: ["/", "/fees", "/faq"],
  crawlers: SEARCH_AND_ANSWER_CRAWLERS,
  nowMs: Date.now(),
  fetchText,
});
```

Any scheduler works. A GitHub Actions example (keep it in `.github/workflows/` of
your application, not in this kit):

```yaml
on:
  schedule:
    - cron: "0 9 * * *"
  workflow_dispatch: {}
jobs:
  seo:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci && node scripts/seoDaily.mjs
```

The script exits non-zero when `report.blocked` is true, so the failed run is the
alert. Also run it after every production deploy of the public site.

## Observability

Emit `report.events` as structured logs or counters labelled by `check` and `code`
only (bounded label set). Never log page bodies, full URLs with query strings,
search queries tied to a person or answer-engine transcripts with customer data.

| Signal                                   | Alert when                               |
| ---------------------------------------- | ---------------------------------------- |
| `blocked`                                | true on any run                          |
| `sitemap` / `MISSING_REQUIRED_PATH`      | count above zero                         |
| `crawler` / `CRAWLER_BLOCKED`            | count above zero for an allowed crawler  |
| `page` / `NOINDEX`, `CANONICAL_MISMATCH` | count above zero                         |
| sitemap URL count                        | drops more than 10% day over day         |
| server logs: crawler hits per agent      | an allowed crawler stops visiting 7 days |
| server logs: 4xx/5xx served to crawlers  | rate above the normal baseline           |

Crawler hits come from your edge or server access logs grouped by verified agent
(check reverse DNS or published IP ranges; user-agent strings are spoofed).

## Numbers to compare

Store one [SeoSnapshot](../../templates/seo/compareSeoSnapshots.ts) per seven-day
window, append-only. Compare with `compareSeoSnapshots` week over week and against
four weeks earlier.

| Field                                                | Source                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| `sitemapUrls`                                        | daily check                                                  |
| `indexedUrls`                                        | search console page indexing or URL inspection on the sample |
| `clicks`, `impressions`, `averagePosition`           | search console performance export (complete days only)       |
| `answerPrompts`, `answerMentions`, `answerCitations` | fixed prompt panel (below)                                   |
| `aiReferralSessions`                                 | analytics sessions referred by answer-engine domains         |

Search console data arrives with a two to three day delay; end each window three
days before the run. Pull Bing Webmaster Tools data as a second engine when
available.

### Prompt panel for GEO and AEO

Keep 20 to 50 real questions from search console queries and support tickets
("how to buy USDT with Pix", "Pix to Bitcoin fee", brand comparisons). Run the same
list weekly on the same answer engines with web search enabled and record, per
prompt, whether the answer mentions the brand and whether it cites one of your
URLs. Store counts and cited URLs only. Answers vary between runs, so read trends
over several windows; change the panel deliberately and restart the baseline when
you do.

## Improve and verify

Turn each regression into a diagnosed cause, then rank candidate fixes by impact
and ease. Each fix is one pull request naming the URL, the target query or prompt,
the expected metric and the evidence (audit codes before and after, rendered
screenshot, sitemap entry). A human merges and deploys. After deploy, the daily
check must stay green; judge the metric after two full windows and record the
outcome next to the hypothesis.
