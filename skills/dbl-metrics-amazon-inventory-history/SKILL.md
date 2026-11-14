---
name: dbl-metrics-amazon-inventory-history
description: Report how much Amazon FBA stock a store held on past days — daily units per FNSKU or ASIN, and which products ran out of stock and when. Use when the user asks whether there were stockouts in a month, whether a product was in stock on a date, when it ran out or came back, or how stock moved over a period. When a product ran out and whether it came back is answered by loadAmazonFbaStockouts; stock levels on past days come from the inventory ledger through executeSql. Do not use for stock right now, for The Fulfillment Lab or Shopify stock, or for an ads pacing decision.
metadata:
    type: metric
    audience: client
    tool: loadAmazonFbaStockouts, executeSql
---

# How much Amazon FBA stock was there on past days?

On a user- or organization-scoped connector, call `listWorkspaces`, select the
workspace, and pass its `wsid` explicitly to every data tool. A workspace-scoped
connector URL supplies that `wsid`. Never infer it from `stores` or from a
`listWorkspaces` result with one entry.

For when a product ran out of stock and whether it came back, the `core` MCP
server has **`loadAmazonFbaStockouts`** (next section). For units on past days,
use `executeSql` against **`amzfact_fnsku_ledger_history`**: Amazon's FBA
Inventory Ledger, one row per merchant, fulfilment centre, FNSKU, disposition and
day (the sections after it). For stock right now, use
`dbl-metrics-amazon-inventory` instead.

## Stockout episodes: `loadAmazonFbaStockouts`

The tool returns one row per stockout episode per merchant, marketplace and
FNSKU, with the FNSKU's current `asin` and every seller SKU pointing at it in
`sellerSkus`, so an FNSKU with several seller SKUs is one row. Its inputs are
`stores` (required, the usual store grammar), `when` (an ISO interval, or a
duration ending on the latest local today of the selected stores' marketplaces;
the last 90 days when omitted), `products` (child or parent ASINs, family names,
FNSKUs or seller SKUs, each token also matched exactly as an FNSKU and as a
seller SKU) and `limit`.

It reads two sources, and each episode end says which one dated it:

- From the day a store's FBA inventory history starts, that history
  (`amzfact_fnsku_fbaInventory_history`). A `CLOSED_OUT` episode starts on the
  first day fulfillable stock closes at zero after a day closing in stock, and
  ends on the first later day closing in stock. A day that reached zero but
  closed in stock, after a day closing in stock, is a one-day `INTRADAY_DIP`; a
  back-in-stock day is not also a dip. These ends have the basis `FULFILLABLE`.
- For the days of the range before a store's history starts, the inventory
  ledger. An episode is a run of recorded days on which no centre of the
  store's centre countries holds a SELLABLE ending balance above zero, after a
  day on which one did. These ends have the basis `LEDGER_SELLABLE`.
- An episode still open on a store's last ledger day and one out on the FNSKU's
  first history row are one row: `stockoutBasis` `LEDGER_SELLABLE`,
  `backInStockBasis` `FULFILLABLE`.

What the values mean, and what each source cannot see:

- Future supply never decides a stockout. `futureSupplyBuyableMax` is the
  highest buyable future supply on the episode's history days, which Amazon may
  still sell through In-Stock Head Start; it is null for an episode with no
  history day.
- The ledger is a lower bound. Units reserved for orders, transfers or centre
  processing count in its balance, so a stockout with reserved units does not
  show there, and no ledger episode does not mean the product was in stock.
- A day with no ledger row for the merchant is a missing summary report: not
  recorded, never a day out. An episode whose days on both sides of it are out
  spans it. `meta.stores[].ledgerDaysWithoutReport` lists those days.
- The ledger is read up to `ledgerSummaryDateLast`, the merchant's newest
  summary day. A store's ledger days after it are in neither source, and for a
  store with no FBA inventory history, a ledger episode still out was out on
  that day.
- Centre countries (`meta.stores[].ledgerCenterCountryCodes`): a pan-European
  marketplace pools the centres of the Pan-European FBA countries, which leave
  out GB; GB, each North American country and every other marketplace count
  their own country's centres. The merchant's centres with no country in
  `amazon_fulfillment_center`, or missing from it, count in none; those with
  rows on the ledger days read are named in `meta.ledgerCentersWithoutCountry`.
- History has a row only on a day the FNSKU's inventory changed, so a missing
  day is unchanged or not polled, and an FNSKU whose inventory did not change in
  the range has no episode. A ledger FNSKU with no SELLABLE row in its range has
  none either. NULL history quantities are not reported and read as 0.
- The window edge: an episode already out where its source starts being read
  has a null `stockoutDate` (and `stockoutBasis`), and `outOnOrBefore` is a day
  on which it was already out. `daysOut` is null unless the start is known and
  either the end is known or the episode is still out.
- An episode with no `backInStockDate` has `isStillOut` true only when the range
  reaches the store's local today.
- `meta.stores[]` says, per store, whether history starts before the range
  (`historyStartsBeforeDateFirst`), its first history day in the range
  (`historyStartsAt`), and which days came from the ledger (`ledgerDateFirst`,
  `ledgerDateLast`). A store with no history reads `false`, `null` and ledger
  dates; a store with history throughout reads `true` and no ledger dates.
- Episodes still out come first, then by start, newest first. `meta.isTruncated`
  is true when more episodes matched than `limit` returned. When a required
  table is missing, `data` is empty and `meta.missingTables` names it.

## Units on past days: the inventory ledger

The sections below read `amzfact_fnsku_ledger_history` with `executeSql` for
units on past days.

## A missing row is zero stock, so build the calendar

The ledger lists a key on a day only when it held units or moved. A day on which
an FNSKU sat at zero in a fulfilment centre has **no row**, so summing the rows
that exist never shows a stockout. Generate the days with `generate_series`,
`LEFT JOIN` the summed rows, and `COALESCE` to 0. Never carry the previous day's
balance forward.

The one exception: a day with no rows at all for a merchant is a ledger report
Amazon returned empty, not a day of zero stock: such a day is missing, not a day
out. The coverage check below lists those days.

## Units sit in fulfilment centres, not marketplaces

There is no marketplace column. `fulfillmentCenter` is where the units physically
were, and a merchant's units move between centres in different countries. To
answer for one country, join `amazon_fulfillment_center` on `fulfillmentCenter`
and filter on its `countryCode`.

A centre with a null `countryCode`, or missing from that table, has no known
country. Its units drop out of a country filter, and the check below lists
them; their country is unresolved, since the shape of a centre code does not
establish its country.

Because every unit is in exactly one centre, adding centres never double counts,
so a total across countries is correct here, unlike in the current-stock table.

## What the balance counts

- `disposition = 'SELLABLE'` is stock that can be sold. The other dispositions
  (`CUSTOMER_DAMAGED`, `WAREHOUSE_DAMAGED`, `DEFECTIVE` and so on) are not, and
  are not in-stock units.
- `endingWarehouseBalance` is the units physically in the centre at the end of
  the day. Units reserved for orders not yet shipped still count, so a small
  positive balance does not prove the listing was buyable.
- Units moving between centres are in `inTransitBetweenWarehouses`, not in the
  balance. A zero day with units in transit is a transfer, not necessarily a
  stockout customers saw.
- `date` is the business day in the region's local time zone.

Coverage: the earliest day in the table is as far back as Amazon serves the
ledger (under two years) and nothing earlier can be fetched. The newest day
trails today by a few days, the delay Amazon's ledger reports carry. For the
last few days, `amzfact_fnsku_fbaInventory_history` holds fulfillable units per
marketplace, but only from the day the workspace began recording it;
`dbl-metrics-amazon-inventory` has its rules. That is a different measure from
the ledger balance, so the two are separate series, not parts of one.

## Query shapes

Coverage first: days in the period with no ledger rows for a merchant.

```sql
SELECT m."merchantId", d::date AS "missingDay"
FROM (SELECT DISTINCT "merchantId" FROM "amzfact_fnsku_ledger_history") AS m
CROSS JOIN generate_series(DATE '2025-12-01', DATE '2025-12-31', INTERVAL '1 day') AS d
WHERE NOT EXISTS (
  SELECT 1 FROM "amzfact_fnsku_ledger_history" AS h
  WHERE h."merchantId" = m."merchantId" AND h."date" = d::date)
ORDER BY 1, 2;
```

Units and days at zero in one country and month. `keys` takes every FNSKU that held stock in
the country from a month before the period, so a product that was already out
on the first day still appears. Change the dates and `'US'` together.

```sql
WITH "days" AS (
  SELECT d::date AS "date"
  FROM generate_series(DATE '2025-12-01', DATE '2025-12-31', INTERVAL '1 day') AS d),
"stock" AS (
  SELECT h."merchantId", h."fnsku", h."date",
         SUM(h."endingWarehouseBalance") AS "units",
         SUM(COALESCE(h."inTransitBetweenWarehouses", 0)) AS "inTransit"
  FROM "amzfact_fnsku_ledger_history" AS h
  JOIN "amazon_fulfillment_center" AS c ON c."fulfillmentCenter" = h."fulfillmentCenter"
  WHERE h."disposition" = 'SELLABLE' AND c."countryCode" = 'US'
    AND h."date" BETWEEN DATE '2025-11-01' AND DATE '2025-12-31'
  GROUP BY 1, 2, 3),
"keys" AS (
  SELECT "merchantId", "fnsku" FROM "stock" GROUP BY 1, 2 HAVING MAX("units") > 0),
"filled" AS (
  SELECT k."merchantId", k."fnsku", d."date",
         COALESCE(s."units", 0) AS "units", COALESCE(s."inTransit", 0) AS "inTransit"
  FROM "keys" AS k
  CROSS JOIN "days" AS d
  LEFT JOIN "stock" AS s
    ON s."merchantId" = k."merchantId" AND s."fnsku" = k."fnsku" AND s."date" = d."date"),
"labels" AS (
  SELECT "merchantId", "fnsku", string_agg(DISTINCT "sku", ', ') AS "skus", MIN("asin") AS "asin"
  FROM "amzfact_sku_identity"
  GROUP BY 1, 2)
SELECT f."fnsku", l."asin", l."skus",
       MAX(f."units") FILTER (WHERE f."date" = DATE '2025-12-01') AS "unitsFirstDay",
       MAX(f."units") FILTER (WHERE f."date" = DATE '2025-12-31') AS "unitsLastDay",
       MAX(f."units") AS "maxUnits",
       COUNT(*) FILTER (WHERE f."units" = 0) AS "daysAtZero",
       COUNT(*) FILTER (WHERE f."units" = 0 AND f."inTransit" > 0) AS "zeroDaysInTransit",
       string_agg(to_char(f."date", 'MM-DD'), ' ' ORDER BY f."date")
         FILTER (WHERE f."units" = 0) AS "zeroDays"
FROM "filled" AS f
LEFT JOIN "labels" AS l ON l."merchantId" = f."merchantId" AND l."fnsku" = f."fnsku"
GROUP BY f."merchantId", f."fnsku", l."asin", l."skus"
HAVING COUNT(*) FILTER (WHERE f."units" = 0) > 0
ORDER BY "maxUnits" DESC
LIMIT 100;
```

Units in centres with no known country, which a country filter leaves out:

```sql
SELECT h."fulfillmentCenter",
       SUM(h."endingWarehouseBalance") FILTER (WHERE h."date" = DATE '2025-12-31') AS "unitsLastDay",
       COUNT(DISTINCT h."date") AS "daysWithStock"
FROM "amzfact_fnsku_ledger_history" AS h
LEFT JOIN "amazon_fulfillment_center" AS c ON c."fulfillmentCenter" = h."fulfillmentCenter"
WHERE h."disposition" = 'SELLABLE' AND c."countryCode" IS NULL
  AND h."date" BETWEEN DATE '2025-12-01' AND DATE '2025-12-31'
GROUP BY 1
ORDER BY 2 DESC NULLS LAST;
```

For daily units of one product, keep `days`, `stock` and `filled`, filter
`keys` to its FNSKU, and select `filled` ordered by `date`.

## Reading the result

One list of "days at zero" mixes very different cases:

- ran out during the period: stock on the first day, then zero days;
- already out at the start and restocked;
- out all period, with stock before it;
- dips of a day or two with units in transit, which are transfers.

Products that only ever held a unit or two have days at zero as well, beside
the products that held meaningful stock and then ran out.

For the declared columns of any of these tables, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it.

## Follow-ups

`dbl-metrics-amazon-inventory` for stock right now. `dbl-metrics-traffic` for
sales and buy box on given days. `dbl-ask-sales-drop` when the
question is why sales fell. `dbl-ask-inventory-pacing` for the ads decision.
