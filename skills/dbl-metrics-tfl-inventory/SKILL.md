---
name: dbl-metrics-tfl-inventory
description: Fetch or analyze The Fulfillment Lab (TFL/GFS) warehouse inventory, on-hand, allocated, available, low-stock products, product names, and SKU mappings. Use when the user asks what stock TFL holds, current TFL inventory, warehouse inventory, TFL low stock, inventory as of a date, or stock for a TFL product or SKU. Do not use for Amazon FBA inventory pacing.
---

# The Fulfillment Lab inventory

Call the `core` MCP server's `loadTflInventory` tool only when it is
present in the connector's announced tools. It appears only for a
TFL-configured workspace. If it is absent, say that TFL MCP access is not
enabled in this workspace; do not imply zero inventory or try another workspace
without the user's direction.

The tool reads the latest daily TFL warehouse snapshot independently for each
connector. It is not Amazon FBA inventory and does not make advertising
recommendations.

## Parameters

- `products`: optional comma-separated exact product ids, product names, or
  SKUs. Names and SKUs match case-insensitively.
- `warehouses`: optional comma-separated exact warehouse ids or names.
- `asOf`: optional `YYYY-MM-DD`; selects each connector's latest snapshot on or
  before that date.
- `maxAvailable`: optional maximum sellable units for low-stock questions.
- `limit`: 1–1000 rows, default 250.

On a multi-workspace connector, call `listWorkspaces` and pass the intended
`wsid`. TFL tools cannot infer a workspace from an Amazon country.

## Read the result

`data[]` is product × warehouse and includes `snapshotDate`, `productId`,
`productName`, `warehouseId`, `warehouseName`, `quantity`, `allocated`,
`available`, and `skus[]` with each bundle's `qtyMultiplier`.

Use `meta.snapshotDates` to report freshness per connector. Totals in `meta`
reflect only rows returned after filters and `limit`; do not describe them as the
whole account when `meta.isTruncated` is true.

If `meta.missingTables` is non-empty, the TFL pipeline is unavailable in that
workspace. Do not treat it as zero stock.

## Monthly movements

The MCP tool returns daily stock levels, not monthly movements. For beginning
inventory, shipped, received, returns, adjustments, or ending inventory over a
calendar month, route through `dbl-db` and inspect
`tfl_inventorySummary_v1__ProductWarehouse`. Its measures are window-relative
and include signed adjustments.
