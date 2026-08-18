# Common questions and how to answer them

Use an MCP tool when one matches the question. It applies Databrill's metric
definitions, bounds the query, and returns freshness metadata. Use a Deno or n8n
query only for data that has no matching tool or for a grain the tool cannot
express.

Before every answer, establish:

- workspace, marketplace/store, and product scope;
- complete comparison periods and the latest available source date;
- the requested grain and currency;
- whether missing rows mean zero, unavailable data, or an unconfigured source;
- whether the product was in stock — a stockout explains a sales fall, a
  conversion collapse and ruined ad efficiency at once, and is by far the most
  common cause of all three.

Two habits change most answers from a number into a finding: report every ratio
against a baseline (the store's own average and the same product in a prior
period), and break a flat store total down by family before concluding nothing
happened. [Diagnosis methods](diagnosis-methods.md) has both, plus the
decompositions behind "why did ACOS move" and "cut spend by how much".

## Advertising

Question: How are ads performing, and where is spend inefficient?

Preferred path: `loadAds` with the requested stores and period, `derived: true`,
grouped first by store or ad type, then by product/campaign for the weak
segment.

Report impressions, clicks, spend, attributed revenue, CTR, conversion, CPC,
ACOS, and ROAS. State that advertising attribution and source data lag. If the
ad-type breakdown returns a single row, say that the store runs only that format
rather than presenting an empty-looking result.

Question: Why is ACOS too high / why did efficiency drop?

Preferred path: confirm stock first, then `loadAds` three times — the product,
the store average for the same period, and the product in a prior period —
before decomposing the move into CPC, conversion rate, and average order value,
and testing whether the budget mix moved rather than performance. See
[Diagnosis methods](diagnosis-methods.md).

Question: Are ads profitable?

Preferred path: `loadEconomics`. If the caller has not supplied cost inputs,
report only the ad rollup and explicitly say that net margin is not yet real.
Never invent COGS or fees.

## Sales, traffic, and conversion

Question: Why did sales drop?

Preferred path: `salesDropDiagnosis`, followed by `loadTraffic`, `loadAds`, and
`loadRank` only for the largest suspected cause. Keep the recent and baseline
windows explicit.

Question: Which listings have a conversion problem?

Preferred path: `loadTraffic`, grouped by ASIN and week. Look for falling
conversion with stable sessions. Use `loadRank` for organic visibility and
`loadAds` for paid efficiency before assigning a cause.

Question: How many orders did we receive by SKU/day/status?

Database path: query `amazon_orders_by_day_and_sku` when its grain fits, or the
`amzspapi_orders_v0__Order` and `amzspapi_orders_v0__OrderItem` tables for order
detail. First inspect the live catalog, because the exact source coverage and
status fields matter.

## Search and rank

Question: Which search terms are opportunities?

Preferred path: `loadSqp`. Rank queries by market impressions, then compare
impression, click, and purchase share. A large market with weak impression share
is an acquisition opportunity; strong clicks with weak purchases suggests a
conversion or offer problem — check our median price against the market's median
price for that term before saying so. Work at family level; per-ASIN purchase
counts are too small to interpret. If you drop to SQL, read [Search Query
Performance data shape](sqp-data-shape.md) first: the market totals repeat
across our ASIN rows, and `totalClickRate` is not a click-through rate.

Question: Is organic rank improving?

Preferred path: `loadRank` scoped to the ASIN and marketplace. Lower numeric BSR
is better. Compare like categories; a product can have several category ranks.

## Inventory

Question: Should advertising change because of Amazon inventory?

Preferred path: `inventoryPacing`. It combines Amazon FBA inventory runway and
ad spend. Call out the worst-variant caveat and any inbound stock.

Question: What stock is held by The Fulfillment Lab?

Preferred path when the connector announces it: `loadTflInventory`. It selects
the latest daily warehouse snapshot independently for each TFL connector and
joins names and SKU mappings by `productId`. Use `maxAvailable` for a low-stock
list and `asOf` for the latest snapshot on/before a past date. Its absence means
TFL MCP access is not enabled for that workspace, not that stock is zero.

Database fallback: run `scripts/examples/tfl-inventory.sql`. Use
`tfl_inventorySummary_v1__ProductWarehouse` only for monthly movements; its
beginning/ending values and shipped/received/adjustment measures are
window-relative and must not be confused with the daily warehouse snapshot.

Question: Which products are at risk of storage fees or overstock?

Amazon path: start with `inventoryPacing`, then inspect
`amzreport_FBA_INVENTORY_PLANNING` or `amazon_fba_inventory_summary` if the MCP
does not return the required age/storage-fee detail.

## Listings and catalog

Question: Which listings are open, missing, inactive, or changing price?

Database path: start with `amazon_listing_open` and `amazon_listing_all`. Use
raw listing or offer tables only when the views omit a required field. Select
columns explicitly instead of returning entire JSON payloads.

Question: Which child ASIN belongs to which family?

Preferred path: the metric tools take family names in `products` and
`groupBy: "family"` — no SQL needed.

Database path: use `brand_config_amazon_asin` (ASIN → family) and
`brand_config_amazon_family`. The better-named `brand_ontology_amazon_asin` and
`brand_ontology_amazon_family` views are frequently **empty** even when the
config tables underneath are complete, because they require an ontology
category/variant layer many workspaces do not fill in. An empty view is not
evidence that the catalogue has no families. Keep parent ASIN, child ASIN, SKU,
and configured family distinct. See [Product families](product-hierarchy.md).

## Returns, reimbursements, fees, and settlement

Question: What is driving returns or reimbursements?

Database path: inspect `amzreport_FBA_CUSTOMER_RETURNS` and
`amzreport_FBA_REIMBURSEMENTS`; group by reason, disposition, marketplace, SKU,
and complete period. Do not equate returned units with refunded revenue without
a defensible join.

Question: Reconcile settlement or ledger totals.

Database path: use the settlement summary/detail or ledger fact relations. State
the currency and whether the query follows event, posted, settlement, or payout
dates. Reconciliation deserves a saved SQL file and validation totals, not an
ad-hoc dashboard-only query.

## Walmart

Question: What are Walmart orders or WFS inventory?

Database path: inspect `wmt_orders_v3__Order`, `wmt_orders_v3__OrderLine`, and
`wmt_inventory_v3__Wfs`. There is no dedicated Walmart MCP metric tool yet.

## A safe off-menu workflow

1. Read [What data the MCP returns](data-coverage.md).
2. Run `listTables` for the selected workspace (or `scripts/catalog.ts` with a
   direct credential).
3. Find candidate relations in [the complete catalog](table-catalog.md), keeping
   in mind that a workspace may also hold rollups the catalog does not list.
4. Inspect exact live column names and types with `describeTable`; never guess.
   [SQL quick reference](sql-reference.md) has the ones that differ per relation.
5. Write one bounded, read-only query with double-quoted identifiers and
   parameter placeholders.
6. Check row count, duplicates at the intended grain, nulls, min/max dates, and
   currency before interpreting the result.
7. Save the SQL beside the exported result so the answer is reproducible.

See [Installing Deno and running the helpers](deno.md) and
[Using the database from n8n](n8n.md).
