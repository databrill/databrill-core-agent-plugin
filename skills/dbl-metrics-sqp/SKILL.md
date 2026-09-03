---
name: dbl-metrics-sqp
description: Analyze Search Query Performance — our impressions/clicks/purchases vs the whole-market totals (impression/click/purchase share), and the top search queries. Use when the user asks about SQP, search query performance, impression share, click share, market share on keywords, or which search terms drive the category.
metadata:
    type: metrics
    audience: client
    tool: loadSqp
---

# Search Query Performance (our vs market)

Fetch SQP from the **`core`** MCP server's **`loadSqp`** tool. SQP
reports, per search query and ASIN, our counts and the whole-market totals — so
"share" = ours ÷ market.

## Call

If the connector exposes `listWorkspaces`, select the intended workspace and
pass its `wsid`; keep search shares separate by account and marketplace.

`loadSqp` parameters:

- **`stores`** (required), **`when`** (required) — as for the other tools.
- `timeUnit` — `WEEK` (default) or `MONTH`. (SQP is pre-aggregated by Amazon to
  these periods — this selects rows, it does not re-bucket.)
- `products` — optional family / ASIN filter (scopes "our" counts).
- `keywordLimit` — top-N queries by market impressions (default 25).

Example: "what's our impression share in the US and the top terms" →
`loadSqp({ stores: "US", when: "P8W" })`.

## Read the output

- `periods[]` — per marketplace per period: `ourImpr/marketImpr`, clicks,
  purchases, and `imprShare/clickShare/purchShare` (percent). Rising market
  impressions with a flat `imprShare` means the category is growing faster than
  us.
- `keywords[]` — top queries with our `imprShare/clickShare/purchShare`. Low
  impr share on a high-`mktImpr` term = an acquisition opportunity.

Note: SQP only emits ASIN-keyword rows above an impression threshold, and lags;
missing rows can themselves be a low-velocity signal.

Each row also carries our median price and the market's median price for that
search term (`asinMedianClickPrice` vs `totalMedianClickPrice`, same for cart
adds and purchases). When click share is healthy but purchase share is weak,
that pair usually explains it — no extra query needed.

Work at family level. Individual ASINs get 0–2 purchases per search term per
week, far too few to conclude anything: pass a family to `products`, or join
`brand_config_amazon_asin` in SQL
(`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`).

## SQL fallback

Read `${CLAUDE_PLUGIN_ROOT}/docs/sqp-data-shape.md` before writing this SQL —
two traps produce confidently wrong numbers:

- **Market totals repeat, they don't add up.** Each row is one ASIN × one query
  × one period, and the `total*` figures are the same market number copied onto
  every one of our ASIN rows. Summing them inflates the market by however many
  of our ASINs appeared on the term, often by two orders of magnitude. Take
  `MAX` within (search query, period), then sum across periods; our own `asin*`
  counts are summed normally.
- **`totalClickRate` is not a click-through rate.** It is divided by
  `searchQueryVolume`, not impressions, so it reads far above the real market
  CTR. Compute market CTR as `totalClickCount ÷ totalQueryImpressionCount`
  yourself.

Source: `amzreport_SEARCH_QUERY_PERFORMANCE` (`impressionData`, `clickData`,
`cartAddData`, `purchaseData` JSONB; `timeUnit`, `merchantId`, `marketplaceId`,
`asin`, `searchQuery`, `dateFirst`, `dateLast`, `searchQueryVolume`). Queries
must filter `merchantId`, `marketplaceId`, `timeUnit` and a bounded `dateFirst`
range together or they time out — the index leads with `merchantId`.

For the declared columns and types of any Amazon table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it.
