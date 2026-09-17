---
name: dbl-metrics-amazon-inventory
description: Report how many units of Amazon FBA stock a store holds right now — on-hand, fulfillable, inbound, reserved, unfulfillable — by ASIN, FNSKU, or seller SKU. Use when the user asks how much Amazon inventory they have, what is in stock, what is inbound, how much is unsellable or damaged, or wants an FBA stock list for one marketplace. Do not use for The Fulfillment Lab stock, and do not use for an ads pacing decision.
metadata:
    type: metric
    audience: client
    tool: executeSql
---

# How much Amazon FBA stock is there?

On a user- or organization-scoped connector, call `listWorkspaces`, select the
workspace, and pass its `wsid` explicitly to every data tool. A workspace-scoped
connector URL supplies that `wsid`. Never infer it from `stores` or from a
`listWorkspaces` result with one entry.

There is no dedicated MCP tool for FBA stock levels yet. Answer with the `core`
MCP server's `executeSql` against **`amzfact_fnsku_fbaInventory_latest`**, and use no
other table for a units total.

## Use `amzfact_fnsku_fbaInventory_latest`, not the raw summary table

`amzfact_fnsku_fbaInventory_latest` holds one row per
`(merchantId, marketplaceId, fnsku)` — one row per _FNSKU_.

`amzspapi_fbaInventory_v1__InventorySummary` and the
`amazon_fba_inventory_summary` view are keyed by _seller SKU_. A commingled FNSKU
is repeated once per seller SKU pointing at it, each repetition carrying the
same quantities, so summing them counts the same physical units several times.
On a catalogue with commingled stock the per-seller-SKU total, on-hand and
fulfillable alike, runs substantially above the per-FNSKU total.

Never total the per-seller-SKU tables. Use them only when the question is
genuinely about a label (which SKU is which), and get identity from
`amzfact_sku_identity` instead where you can.

## Always filter to ONE marketplace

FNSKUs are not unique across marketplaces — the same FNSKU value appears in more
than one marketplace, so a total over several marketplaces double counts.

Every query MUST carry a `"marketplaceId" = ...` predicate. If the user asks for
a cross-marketplace or worldwide total, say that this table cannot answer it and
report per-marketplace figures instead. Do not sum them into one number.

(The cross-marketplace total would need `amzreport_LEDGER_SUMMARY` or
`amzreport_LEDGER_DETAIL`. That route is not explored yet, Amazon's ledger
reports lag by several days, and a workspace may not have those tables at all.
Do not reach for them without the operator's direction.)

Summing across _merchants_ within one marketplace is fine: different merchants
own different physical units.

Common marketplace ids: US `ATVPDKIKX0DER`, CA `A2EUQ1WTGCTBG2`,
UK `A1F83G8C2ARO7P`, DE `A1PA6795UKMFR9`. Read `amazon_marketplace` when unsure.

## Columns

Key: `merchantId`, `marketplaceId`, `fnsku`. Denormalised: `asin`, `condition`.

Quantities, all nullable — **NULL means Amazon did not report it, not zero**, so
use `COALESCE(...,0)` when you sum and say so if a figure is mostly NULL:

- `totalQuantity` — everything Amazon holds for the FNSKU.
- `fulfillableQuantity` — sellable now. This is the number for "in stock".
- `inboundWorkingQuantity`, `inboundShippedQuantity`, `inboundReceivingQuantity`.
- `totalReservedQuantity` and its parts `pendingCustomerOrderQuantity`,
  `pendingTransshipmentQuantity`, `fcProcessingQuantity`.
- `totalUnfulfillableQuantity` and its parts `customerDamagedQuantity`,
  `warehouseDamagedQuantity`, `distributorDamagedQuantity`,
  `carrierDamagedQuantity`, `defectiveQuantity`, `expiredQuantity`.
- `totalResearchingQuantity` and its short/mid/long-term parts.
- `futureSupplyBuyableQuantity` — units Amazon already lets customers buy ahead
  of their arrival (future supply). Not part of `totalQuantity`, and an FNSKU can
  be buyable through it while `fulfillableQuantity` is 0.
  `reservedFutureSupplyQuantity` is the reserved part of future supply.

Freshness: `observedAtPoll` is the instant Amazon reported the state, not our
write clock. Report `MAX("observedAtPoll")` alongside any total.
`observedAtStream` is null until the stream writer exists — ignore it.

An FNSKU that has gone to zero keeps its row, so filter
`COALESCE("totalQuantity",0) > 0` for a "what do we hold" list.

This table is the current state only. `amzfact_fnsku_fbaInventory_history` has
one row per FNSKU per marketplace-local day on which its state changed, with the
lowest, highest, first and last fulfillable and buyable future-supply quantities
among the changes recorded that day. A missing day means unchanged since the
previous row, and there are no rows before the history table was deployed to the
workspace.

`…Last` is exact. `…First`, `…Min` and `…Max` leave out the value the FNSKU
carried into the day, so an FNSKU at 10 all morning that drops to 0 at 15:00 has
`fulfillableMax` 0. For the whole day, read the previous row's `…Last` with
`LAG`:

```sql
SELECT "fnsku", "date",
       COALESCE("prevLast", "fulfillableFirst") AS "openingFulfillable",
       GREATEST("fulfillableMax", "prevLast")   AS "dayMaxFulfillable",
       LEAST("fulfillableMin", "prevLast")      AS "dayMinFulfillable",
       "fulfillableLast"                        AS "closingFulfillable"
FROM (
  SELECT *, LAG("fulfillableLast") OVER (
           PARTITION BY "merchantId", "marketplaceId", "fnsku" ORDER BY "date") AS "prevLast"
  FROM "amzfact_fnsku_fbaInventory_history"
  WHERE "marketplaceId" = 'ATVPDKIKX0DER'
) h
WHERE "date" >= DATE '2026-09-01';
```

Filter on `date` outside the subquery, as above, so the first day in range still
sees the row before it.

For the declared columns and types of any Amazon table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it.

## Query shapes

Store total, with freshness:

```sql
SELECT SUM(COALESCE("totalQuantity", 0))       AS "totalUnits",
       SUM(COALESCE("fulfillableQuantity", 0)) AS "fulfillable",
       SUM(COALESCE("inboundShippedQuantity", 0)
         + COALESCE("inboundReceivingQuantity", 0)
         + COALESCE("inboundWorkingQuantity", 0)) AS "inbound",
       SUM(COALESCE("totalUnfulfillableQuantity", 0)) AS "unfulfillable",
       MAX("observedAtPoll") AS "asOf"
FROM "amzfact_fnsku_fbaInventory_latest"
WHERE "marketplaceId" = 'ATVPDKIKX0DER';
```

By ASIN (an FNSKU has one ASIN, so this needs no dedupe):

```sql
SELECT "asin",
       SUM(COALESCE("fulfillableQuantity", 0)) AS "fulfillable",
       SUM(COALESCE("totalQuantity", 0))       AS "totalUnits"
FROM "amzfact_fnsku_fbaInventory_latest"
WHERE "marketplaceId" = 'ATVPDKIKX0DER' AND "asin" IS NOT NULL
GROUP BY "asin"
ORDER BY "fulfillable" DESC
LIMIT 50;
```

By seller SKU — join identity, and note that several SKUs can share one FNSKU, so
the FNSKU's units are shown against each label and must not be totalled:

```sql
SELECT i."sku", i."asin", f."fnsku",
       COALESCE(f."fulfillableQuantity", 0) AS "fnskuFulfillable"
FROM "amzfact_sku_identity" AS i
JOIN "amzfact_fnsku_fbaInventory_latest" AS f
  ON f."merchantId" = i."merchantId" AND f."fnsku" = i."fnsku"
WHERE f."marketplaceId" = 'ATVPDKIKX0DER'
ORDER BY "fnskuFulfillable" DESC
LIMIT 50;
```

## If the table is missing or empty

`amzfact_fnsku_fbaInventory_latest` is created on first write, so a workspace the
fact writer has not reached yet has no table. Say the fact table is not populated in
that workspace and that the raw per-seller-SKU table overstates units; do not
silently fall back to it, and do not report zero stock.

## Follow-ups

`dbl-ask-inventory-pacing` for the ads decision — read its accuracy caveat
first. `dbl-metrics-tfl-inventory` for The Fulfillment Lab stock and
`dbl-metrics-shopify-inventory` for Shopify. Those are three different fulfilment
networks, and Shopify's locations may BE the TFL warehouse, so never add them
together without saying which figure came from where and as of when.
