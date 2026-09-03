# SQL quick reference

Read this before writing SQL against a client database. Every rule below cost a
failed query in testing. It does not replace inspecting the live schema — run
`listTables` / `describeTable` (or `scripts/catalog.ts`) first — but it answers
the questions that come up every time.

## Quoting

Identifiers that contain a capital letter must be double-quoted, and that
includes table names:

```sql
SELECT "merchantId", "date" FROM "amzreport_SEARCH_QUERY_PERFORMANCE" ...
```

Unquoted, Postgres folds `amzreport_SEARCH_QUERY_PERFORMANCE` to lower case and
the relation is not found. Quoting an all-lowercase name is harmless, so quote
everything.

## `ROUND` needs `::numeric`

Several columns are `double precision`, and Postgres has no
`round(double precision, int)`. `ROUND(sum("ad_spend"), 2)` fails with "function
round(double precision, integer) does not exist". Cast first:

```sql
ROUND(sum("ad_spend")::numeric, 2)
```

The same columns also carry float noise — a clicks total can come back as
`84405.9999999989` — so cast before comparing or displaying counts too.

## Date and store columns per relation

There is no single convention. Snake_case belongs to the curated views and the
rollup tables; camelCase belongs to the raw `amzreport_*` / `amzadapi_*` tables.

| Relation                                                  | Date column                               | Store columns                          |
| --------------------------------------------------------- | ----------------------------------------- | -------------------------------------- |
| `amazon_sales_and_traffic` (view)                         | `date`                                    | `merchant_id`, `marketplace_id`        |
| `amzreport_SALES_AND_TRAFFIC__skuByDay`                   | `date`                                    | `merchantId`, `marketplaceId`          |
| `amazon_fba_inventory_summary` (view)                     | `last_updated_time`                       | `merchant_id`, `marketplace_id`        |
| `product_overview_ad_asin__day`                           | `date`                                    | `merchant_id`, `marketplace_id`        |
| `amzadapi_reports_v1__search_asin_placement__byDay`       | `date`                                    | `merchantId`, `marketplaceId`          |
| `amzadapi_reports_v1__product01__byDay`                   | `date`                                    | `merchantId`, `marketplaceId`          |
| `amzreport_SEARCH_QUERY_PERFORMANCE`                      | `dateFirst` / `dateLast` (no single date) | `merchantId`, `marketplaceId`          |
| `amazon_sales_rank__{cc}`                                 | `time` (timestamptz)                      | none — one table per marketplace       |
| `brand_config_amazon_asin` / `brand_config_amazon_family` | none                                      | none — catalogue config, not per store |

Product keys vary too: `asin` in the ad and rank relations, `child_asin` /
`parent_asin` in `amazon_sales_and_traffic`, `childAsin` / `parentAsin` in
`amzreport_SALES_AND_TRAFFIC__skuByDay`, and `advertisedProductId` in the raw
`amzadapi_reports_v1__*` tables.

## Prefer the curated view over the raw report

`amazon_sales_and_traffic` exposes flat, typed columns — `sessions`,
`page_views`, `units_ordered`, `ordered_product_sales`, `buy_box_percentage`,
`unit_session_percentage` — over the same data that
`amzreport_SALES_AND_TRAFFIC__skuByDay` stores as `sales` and `traffic` JSON
documents. Use the view unless you need a field it drops.

## Sales-rank tables are partitioned; query the parent

`amazon_sales_rank__us__2026_08` is a real partition of
`amazon_sales_rank__us`, not a separate monthly extract. Query the parent with a
bounded filter on `"time"` and let partition pruning do the work — no
`UNION ALL` across months, and no need to enumerate which months exist:

```sql
SELECT "asin", "category", "time", "rank"
FROM "amazon_sales_rank__us"
WHERE "time" >= $1 AND "time" < $2 AND "asin" = ANY($3)
```

## Search Query Performance needs its whole key prefix

Counting or grouping `amzreport_SEARCH_QUERY_PERFORMANCE` times out unless
`merchantId`, `marketplaceId`, `timeUnit` and a bounded range on `dateFirst` are
**all** supplied together. The primary key leads with `merchantId`, so filtering
on marketplace or date alone cannot use the index. Nothing is broken; the
columns have to be supplied as a set. If a query times out, check that all four
are present before assuming the table is unusable.

See [Search Query Performance data shape](sqp-data-shape.md) for how to
aggregate it correctly once it responds.

## FBA inventory fans out — filter, then aggregate

`amazon_fba_inventory_summary` holds one row per (merchant, marketplace, SKU),
so one ASIN legitimately appears many times: in a live workspace the busiest
ASIN returned 425 rows across 7 marketplaces, 60 SKUs and 2 merchants. Filter
merchant and marketplace together, then sum over SKUs:

```sql
SELECT "asin", sum("fulfillable") AS fulfillable, sum("total") AS total
FROM "amazon_fba_inventory_summary"
WHERE "merchant_id" = $1 AND "marketplace_id" = $2
GROUP BY "asin"
```

Never deduplicate with `SELECT DISTINCT`: two marketplaces holding the same unit
count collapse into one row and real stock disappears.

## Which advertising table has which numbers

| Relation                                            | Has                                                                                                                         | Lacks                                                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `product_overview_ad_asin__day`                     | `ad_impressions`, `ad_clicks`, `ad_orders`, `ad_spend`, `ad_revenue` per ASIN per day                                       | campaign, ad format, search term                                         |
| `amzadapi_reports_v1__search_asin_placement__byDay` | `impressions`, `clicks`, `totalCost`, `sales`, `adProduct`, `campaignId`, `target`, `searchTerm`, `placementClassification` | nothing relevant — but it is search-term grain, so aggregate before use  |
| `amzadapi_reports_v1__product01__byDay`             | `adProduct`, purchases/sales/units incl. `*Halo*`, `detailPageViews`, `brandedSearches`                                     | **impressions, clicks and cost** — efficiency cannot be computed from it |

`amzadapi_reports_v1__product01__byDay` has 61 columns and a name that sounds
like the advertising performance table. It is not. Reach for
`product_overview_ad_asin__day` for per-ASIN efficiency, and
`search_asin_placement__byDay` when the question needs campaign, ad format,
placement, or search term.

`product_overview_ad_asin__day` is the same rollup that `loadAds` reads. On a
verified week it matched `loadAds` exactly — spend `25782.34`, revenue
`102247.47`, 56,350 clicks, 1,768,695 impressions, 3,528 orders. Its
`ad_revenue` is total attributed sales, which **includes** halo sales on other
ASINs (`sales` = `salesPromoted` + `salesHalo` in the source table). It is not
inflated and does not double-count, but do not add `loadAds`'s `revenueHaloOut`
on top of `revenue` — that is a breakdown of it, not an addition to it. For
promoted-ASIN-only revenue, subtract `revenueHaloOut`.

Note also that `adProduct` can be an empty string on a small number of rows;
treat `''` as "unclassified", not as a fifth ad format.

## Workspace-specific relations

`product_overview_ad_asin__day` and other rollups (`custom_report_*`, `r26*_*`)
are provisioned per workspace and are not in the declared schema (for Amazon,
[`schema/amazon/index.tsv`](schema/amazon/index.tsv); the other groups are
listed in [`schema/README.md`](schema/README.md)), which only covers the tables
Databrill creates everywhere. Always `listTables` for the workspace you are
actually querying rather than assuming either direction.

## Checklist before interpreting a result

1. Is every capitalised identifier quoted?
2. Are merchant and marketplace both filtered, or is the fan-out intentional?
3. Is the date range bounded, and does it use that relation's date column?
4. Are rates computed from summed numerators and denominators rather than
   averaged per row?
5. Does the row count match the grain you expect, or did a join duplicate rows?
