---
name: dbl-metrics-traffic
description: Analyze Sales & Traffic per ASIN — sessions, page views, units ordered, ordered-product sales, and session conversion rate. Use when the user asks about sessions, traffic, page views, conversion rate, units/sales per ASIN, or listing performance over time.
metadata:
    type: metrics
    audience: client
    tool: loadTraffic
---

# Sales & Traffic (sessions / units / sales / CR)

Fetch per-ASIN (or per-family) Sales & Traffic metrics from the
**`core`** MCP server's **`loadTraffic`** tool.

## Call

On user- and organization-scoped connectors, call `listWorkspaces` and pass the
selected `wsid`. A workspace-scoped connector supplies it in the URL. Never
infer a target from `stores` or a one-entry directory. Query workspaces
separately and keep currencies separate.

`loadTraffic` parameters:

- **`stores`** (required) — same spec as the other tools (country / region /
  marketplaceId / `*` / `{merchantId}-{scope}`).
- **`when`** (required) — ISO interval or duration (`P4W`,
  `2026-03-30/2026-04-26`).
- `groupBy` — `asin` (default) or `family`.
- `timeUnit` — `WEEK` (default), `DAY`, or `MONTH`.
- `products` — optional family / parent-ASIN / child-ASIN filter.

Example: "weekly conversion rate for the Garlic Press family in the US" →
`loadTraffic({ stores: "US", when: "P8W", groupBy: "family", products: "Garlic_Press" })`.

## Read the output

Each `data[]` row:
`country, marketplaceId, period, asin|family, sessions, units,
sales, cr` (cr =
units/sessions, percent). A falling `cr` with steady `sessions` points at the
listing/offer; falling `sessions` points at traffic (ads/rank).

Group by `family` whenever the question is about a product rather than one
variant — a variant selling two units a week carries no signal while its family
sells hundreds (`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`).

## SQL fallback

Prefer the curated view `amazon_sales_and_traffic`: flat snake_case columns
(`date`, `merchant_id`, `marketplace_id`, `parent_asin`, `child_asin`,
`sessions`, `page_views`, `units_ordered`, `ordered_product_sales`,
`buy_box_percentage`, `unit_session_percentage`) over the same data.
`buy_box_percentage` is the fastest way to spot an offer/stock problem behind a
conversion fall.

The raw table `amzreport_SALES_AND_TRAFFIC__skuByDay` keeps JSON documents —
`traffic->>'sessions'`, `sales->>'unitsOrdered'`,
`sales->'orderedProductSales'->>'amount'`, keyed by `childAsin`,
`marketplaceId`, `date` (camelCase here, unlike the view). Use it only for a
field the view drops. Double-quote identifiers; see
`${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md`.

For the declared columns and types of any Amazon table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it.
