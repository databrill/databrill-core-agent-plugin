---
name: dbl-metrics-ads
description: Analyze Amazon PPC advertising performance metrics including impressions, clicks, orders, spend, sales, CTR, CR, CPC, ACOS, and ROAS. Use when the user asks about ad performance, PPC metrics, advertising efficiency, campaign analysis, ACOS/ROAS, or spend by ad type (SP/SB/SBV/SD).
metadata:
    type: metrics
    audience: client
    tool: loadAds
---

# Ad performance (PPC)

Fetch advertising metrics from the **`core`** MCP server's
**`loadAds`** tool. Do not write SQL for this — call the tool.

## Call

On user- and organization-scoped connectors, call `listWorkspaces` and pass the
selected `wsid`. A workspace-scoped connector supplies it in the URL. Never
infer a target from `stores` or a `listWorkspaces` result with one entry. Query
workspaces separately and keep currencies separate.

`loadAds` parameters:

- **`stores`** (required) — country code (e.g. `US`, `DE`), region (`na`, `eu`,
  `fe`), a marketplaceId, `*`, or `{merchantId}-{scope}`.
- **`when`** (required) — ISO 8601 interval or duration:
  `2026-04-13/2026-04-19`, `P7D`, `P4W/2026-04-19`.
- **`groupBy`** (required) — comma-separated:
  `asin, family, parentAsin, campaign,
  adType, placement, target, adgroup, country, store, merchant, marketplaceId`.
  Use `store` if no breakdown is needed.
- `timeUnit` — `DAY|WEEK|MONTH|QUARTER|YEAR` (optional).
- `products` — family names, parent ASINs (auto-expanded), or child ASINs
  (optional).
- `filter` — e.g. `campaignName:=:value` (optional).
- `derived` — include `ctr, cr, cpc, acos, roas` (default false).
- `nested` — nest halo metrics into `adStats*` objects (default false).

Example: "how did SBV do in the US last 4 weeks" →
`loadAds({ stores: "US", when: "P4W", groupBy: "adType", derived: true })`.
If that breakdown returns one row, the store runs one ad format — say so
explicitly rather than reporting an empty-looking result.

Group by `family` (or `parentAsin`) whenever the question is about a product:
a single variant may sell too few units to conclude anything while its family
sells enough to. See
`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`.

## Read the output

`data[]` rows carry
`impressions, clicks, addToCart, purchases, units, spend,
revenue`, halo
(`*HaloOut`, `*HaloIn`), and — with `derived` — `ctr, cr, cpc, acos,
roas`.
`meta.dateDataLatest` shows how fresh the ad data is (Amazon's ad reports
lag 1–2 days).

State each metric with its value and attach the ASIN/family to any named entity
(see voice guidance). ACOS = spend/sales (lower is better); ROAS = sales/spend.
`revenue` is total attributed sales and already includes halo out; the
`*HaloOut` / `*HaloIn` fields break it down, so never add them on top.

## Diagnose, don't restate

Read `${CLAUDE_PLUGIN_ROOT}/docs/diagnosis-methods.md` before answering "ACOS is
too high" or "why did efficiency drop". The short form:

1. **Check stock first.** A stockout wrecks every ad metric with a cause that
   has nothing to do with ads. Check `inventoryPacing` or `fulfillable` and
   `buy_box_percentage`; if stock is at or near zero, say so and hand off to
   `dbl-ask-inventory-pacing`.
2. **Never report a ratio alone.** Fetch the store-wide figure for the same
   period (`groupBy: "store"`) and the same product in a prior period. A
   product's ACOS only means something against its store's average and its own
   earlier value — which also gives a defensible target.
3. **Decompose a move.** `ACOS = CPC ÷ (CR × AOV)`. Measure all three across
   both periods; the culprit names itself instead of being guessed.
4. **Then test allocation.** If conversion or AOV is the culprit, hold each
   campaign's current performance fixed and restore the old budget split. If
   that closes most of the gap it is a budget-mix problem, not a performance
   problem — a completely different fix.

With one ad format, break down by campaign _type_ (auto / broad / product
targeting / manual keyword), which an account may encode in its campaign names.

## SQL fallback (only for things the tool can't express)

Read `${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md` first — it has the date/store
column table, quoting and `::numeric` rules, and which ad relation holds which
numbers. For the declared columns and types of any Amazon table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it.

- `amzadapi_reports_v1__search_asin_placement__byDay` — adds `adProduct`,
  `campaignId`, `target`, `searchTerm`, `placementClassification`, `totalCost`;
  search-term grain, so aggregate before use.
- `amzadapi_exports_v1__campaign` — campaign names, states, budgets.
- `amzadapi_reports_v1__product01__byDay` — **has no impressions, clicks or
  cost**, despite the name. It carries the ad-format and halo breakdown only;
  advertising efficiency cannot be computed from it.

Always double-quote identifiers.
