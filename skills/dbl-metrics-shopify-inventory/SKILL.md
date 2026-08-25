---
name: dbl-metrics-shopify-inventory
description: Report Shopify stock — available, on hand, committed, incoming — by SKU, variant, location, or shop. Use when the user asks what stock the Shopify store holds, what is available on the website, stock at a Shopify location or warehouse, or which Shopify products are low. Do not use for Amazon FBA stock or The Fulfillment Lab stock.
metadata:
  type: metric
  audience: client
  tool: executeSql
---

# How much Shopify stock is there?

Cross-cutting shape and traps for every `shopify_*` table:
`${CLAUDE_PLUGIN_ROOT}/docs/shopify-data-shape.md`.

There is no dedicated MCP tool for Shopify. Answer with the `core` MCP server's
`executeSql` against **`shopify_inventory_v1__InventoryLevel`**, one row per
`(shopId, locationId, inventoryItemId)`.

## Filter to tracked items or the number is wrong

`tracked` says whether a quantity means anything. Shopify keeps returning levels
for untracked items, and their numbers do not move with sales. Most levels are
untracked: measured on a live store on 2026-08-25, 119 of 514. Including the
untracked rows moved available stock from 72,375 to 62,916 — a 9,459-unit error
in the *opposite* direction from what you would guess, because untracked rows
carry large negative values.

**Put `WHERE "tracked"` on every stock total**, and say so when you report the
figure. If the user genuinely wants the untracked rows, report the two groups
separately rather than in one sum.

## The other traps

- **Negative quantities are real.** `available` and `onHand` are stored as they
  arrive and go negative on oversold items. Do not clamp them to zero, and do not
  treat a negative total as a data error.
- **Freshness is `fetchedAt`, never `shopifyUpdatedAt`.** Shopify's own
  `updatedAt` does not always move when a quantity does. `fetchedAt` carries the
  run instant on every row of a successful refresh, changed or not; rows older
  than it are deleted for that shop. Report `MAX("fetchedAt")`. Never filter on
  `shopifyUpdatedAt`.
- **NULL is not zero.** `available`, `onHand`, `committed` and `incoming` are
  always present. `reserved`, `safetyStock`, `damaged` and `qualityControl` are
  nullable because they depend on what the merchant's plan enables — a NULL means
  the state was absent from the response, not that it was empty.
- **`incoming` is untested here.** It was zero on every measured row, so anything
  keyed on it is unproven. Say so if you use it.
- **`levelGid` is provenance, not a key or a join.** Shopify returns a GID with a
  query string whose numeric part is shared by every level at a location. Key on
  `(shopId, locationId, inventoryItemId)`.

## Joins

- Location name: `shopify_locations_v1__Location` on
  `("shopId", "id") = ("shopId", "locationId")`. `hasActiveInventory` is the
  cheap answer to "why does this location have no stock rows" — a location with
  it false returns no levels at all. Pass through inactive locations too; a
  deactivated location can still hold stock.
- Variant and product: `shopify_products_v1__ProductVariant` on
  `("shopId", "id") = ("shopId", "variantId")`, then
  `shopify_products_v1__Product`. `variantId` is nullable on the schema's
  authority — an inventory item need not belong to a variant — so use a LEFT
  JOIN.
- `sku` is denormalised onto the level itself, so a plain stock report needs no
  join at all.

## More than one shop

`shopId` is part of the key and a workspace can hold several shops (a live
workspace had 3 shops across 7 locations on 2026-08-25). Group by `shopId`, or
state which shop a figure covers. Do not present a multi-shop total as one
store's stock. Join `shopify_shop_v1__Shop` for the name.

## Query shapes

Tracked stock for the whole workspace, with freshness:

```sql
SELECT "shopId",
       SUM("available")  AS "available",
       SUM("onHand")     AS "onHand",
       SUM("committed")  AS "committed",
       COUNT(*)          AS "trackedLevels",
       MAX("fetchedAt")  AS "asOf"
FROM "shopify_inventory_v1__InventoryLevel"
WHERE "tracked"
GROUP BY "shopId";
```

By SKU, worst first:

```sql
SELECT "sku",
       SUM("available") AS "available",
       SUM("onHand")    AS "onHand"
FROM "shopify_inventory_v1__InventoryLevel"
WHERE "tracked" AND "sku" IS NOT NULL
GROUP BY "sku"
ORDER BY "available" ASC
LIMIT 50;
```

By location:

```sql
SELECT l."name" AS "location", l."hasActiveInventory",
       SUM(v."available") AS "available",
       MAX(v."fetchedAt") AS "asOf"
FROM "shopify_inventory_v1__InventoryLevel" AS v
JOIN "shopify_locations_v1__Location" AS l
  ON l."shopId" = v."shopId" AND l."id" = v."locationId"
WHERE v."tracked"
GROUP BY l."name", l."hasActiveInventory"
ORDER BY "available" DESC;
```

## Follow-ups

`dbl-metrics-shopify-sales` for store performance,
`dbl-metrics-shopify-orders` for what sold, `dbl-metrics-shopify-catalog` for the
catalogue and prices.

## Three networks, never one number

Shopify, Amazon FBA (`dbl-metrics-amazon-inventory`) and The Fulfillment Lab
(`dbl-metrics-tfl-inventory`) are three separate fulfilment networks with three
separate stock pools, three grains and three freshness clocks. Report them as
three labelled figures. Only add them together if the user explicitly asks for a
combined position, and then say which part came from where and as of when —
units can also be physically the same stock seen twice where TFL fulfils Shopify
orders, so a combined total is an estimate, not a measurement.

That overlap is not hypothetical. On a live workspace on 2026-08-25 every
Shopify location was a TFL location ("The Fulfillment Lab", "The Fulfillment Lab
- GFS", and two more), so the Shopify levels describe TFL's warehouse, not a
separate pool — and the two sources still disagreed: 72,375 available in Shopify
against 35,395 in TFL's own snapshot the day before. Do not reconcile them by
arithmetic and do not present one as a check on the other. Report each with its
source and its timestamp, and say the gap is unexplained if the user needs one
number.
