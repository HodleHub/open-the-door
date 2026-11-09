# SEO, GEO and AEO

A neobank site is found three ways: a search result (SEO), a generated answer that
cites it (GEO, generative engine optimization) and a direct answer, snippet or
voice reply that quotes one passage (AEO, answer engine optimization). They share
one foundation, so build one page well rather than three variants.

## Foundation: crawlable and indexable

- `robots.txt` reachable, declaring `Sitemap:`, and allowing every crawler you want
  answers from. Check with [checkCrawlerAccess](../../templates/seo/checkCrawlerAccess.ts).
- `sitemap.xml` generated from the same route registry as the pages, absolute HTTPS
  URLs on one origin, real `lastmod`, no redirects or noindex URLs. Check with
  [validateSitemap](../../templates/seo/validateSitemap.ts).
- Self-referencing absolute canonical, one `h1`, a unique title and description.
- Content in the server HTML. Several answer-engine fetchers do not execute
  JavaScript, so a client-rendered FAQ does not exist for them.
- Application routes (dashboard, KYC, wallet) stay out of the sitemap and behind
  authentication; they are not landing pages.

## SEO: rank for a query

One URL targets one primary query and one intent (learn, compare or sign up). Put
the query in the slug, title, `h1` and first sentence; give each secondary query
its own `h2`. Link from strong pages (home, footer, pricing) to the new page with a
descriptive anchor, and from the page to at least two related pages. Keep Core Web
Vitals in budget: sized images, no layout shift, no render-blocking animation.

## AEO: be the quoted answer

Answer the question in the first 40 to 60 words under the heading that asks it,
then expand. Use the phrasing people actually search (search console queries,
"people also ask", support tickets). Mark up the visible FAQ with `FAQPage`, the
page with `WebPage` and navigation with `BreadcrumbList`; [auditPageHtml](../../templates/seo/auditPageHtml.ts)
fails a page whose FAQ schema is not visible. Tables for fees, limits and timing
are quoted more often than prose.

## GEO: be cited in generated answers

Generated answers cite pages that state verifiable specifics: supported networks,
fee formulas, settlement times, limits, the date the numbers were checked and who
operates the service. Name entities consistently (company, product, assets) across
the site and its public profiles. Original data, clear comparisons and an honest
"when not to use this" section earn citations; generic marketing copy does not.

Crawler policy is per agent. Search and user-triggered fetchers (for example
OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot) decide
whether you appear in those answers. Training crawlers (for example GPTBot,
ClaudeBot, Google-Extended) are a separate choice. Confirm current agent names in
each provider's documentation before changing `robots.txt`.

`llms.txt` is an optional curated index for language-model tools. Publish one if it
is cheap to keep accurate; it does not replace the sitemap and is not a ranking
signal any engine has committed to.

## Financial content boundary

Search engines treat money pages as high-stakes. Every page names the operator,
links to terms and fees, dates its numbers and avoids promises: no guaranteed
return, no regulatory status, custody model or partnership the operator has not
confirmed. A page that overclaims risks both trust and the operator's licence.

Run this on a schedule with the [daily loop](seo-daily.md); the agent procedure is
the [SEO skill](../../skills/seo/SKILL.md).
