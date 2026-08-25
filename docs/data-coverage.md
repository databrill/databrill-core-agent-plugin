# What data the MCP returns

The hosted MCP is a curated analytics layer, not a general SQL endpoint. Its
tools return bounded, interpreted result sets for common commercial questions.
They do not expose credentials or arbitrary tables.

## Available MCP tools

### `loadAds`

Returns Amazon advertising impressions, clicks, add-to-cart, purchases, units,
spend, revenue, halo metrics, and optional CTR, conversion rate, CPC, ACOS, and
ROAS. It can group by product, campaign, ad type, placement, target, store, and
time. Advertising data commonly lags by one or two days; use
`meta.dateDataLatest`.

### `loadTraffic`

Returns Amazon Sales & Traffic sessions, units, ordered-product sales, and
session conversion rate by ASIN or configured product family and period.

### `loadSqp`

Returns Search Query Performance periods and top queries, comparing a client's
impressions, clicks, and purchases with Amazon's market totals. SQP is reported
by Amazon in week/month buckets, has thresholds, and lags.

### `loadRank`

Returns Best Sellers Rank snapshots by ASIN and category. Lower rank is better.
Rank availability differs by marketplace.

### `loadEconomics`

Returns an advertising economics rollup. True net margin requires price, COGS,
FBA, referral, and storage inputs supplied with the call; those costs are not
assumed to exist in the database.

### `salesDropDiagnosis`

Compares a recent window with a prior baseline and attributes sales-per-day
change to traffic, conversion, and average selling price, with advertising and
organic-channel signals.

### `inventoryPacing`

Joins Amazon FBA inventory runway with current advertising spend and recommends
pause, throttle, hold, or ramp by product family. It reads the per-seller-SKU
inventory table, so its unit counts and runways are overstated wherever stock is
commingled; take the units themselves from `amzfact_fnsku_fbaInventory` via
`executeSql`. There is no dedicated MCP tool for FBA stock levels yet.

### `loadTflInventory`

Workspace-specific. It appears in Claude's tool list only when Databrill has
enabled The Fulfillment Lab for the selected workspace. It returns product
inventory from each connector's latest daily warehouse snapshot, or the latest
snapshot on/before a requested date. It includes product ids/names, warehouse,
on-hand, allocated, available, and product-id-based SKU mappings. It can filter
by exact product id/name/SKU, warehouse, or maximum available units.

### `listWorkspaces`

Available only on organization- and user-scoped connectors. It returns the
currently authorized workspace directory used to select one workspace for a
subsequent tool call.

## Present in client databases but not yet exposed by a dedicated MCP tool

Depending on the workspace's configured pipelines, the database may also
contain:

- Amazon orders and order items;
- listings, catalog attributes, images, and offer snapshots;
- returns, reimbursements, removals, storage fees, coupons, and promotions;
- settlement, ledger, transaction, posting, and projected-profit data;
- advertising campaign/entity exports and Amazon Marketing Stream events;
- FBA stock levels at the physical-pool grain (`amzfact_fnsku_fbaInventory`,
  with `amzfact_sku_identity` for the seller-SKU mapping) — the only correct
  source for a units total, per marketplace;
- FBA inventory planning and per-seller-SKU inventory summaries;
- Shopify stock levels, orders and line items, products and variants, customers,
  discounts, locations, and the daily sales/sessions reports (`shopify_*_v1__*`)
  — no dedicated MCP tool. `dbl-metrics-shopify-sales`,
  `dbl-metrics-shopify-orders`, `dbl-metrics-shopify-catalog` and
  `dbl-metrics-shopify-inventory` cover them, over the shared shape and trap
  reference in `docs/shopify-data-shape.md`;
- Amazon notification streams;
- Walmart orders, order lines, inventory, and account profile;
- The Fulfillment Lab orders, shipments, monthly inventory movements, ASNs, and
  OTS shipments beyond the current inventory tool;
- brand ontology and product-family configuration;
- exchange rates and marketplace/store dimensions.

Use `executeSql`, or the read-only Deno or n8n path, for these sources.
`loadTflInventory` reads TFL daily warehouse stock. `inventoryPacing` remains a
separate tool that reads Amazon FBA inventory; do not present either source as
the other, and never add Amazon, TFL and Shopify units together without saying
which network each figure belongs to — Shopify's locations may be the TFL
warehouse rather than a separate pool.

## Declared does not mean ingested

[The complete table catalog](table-catalog.md) lists every relation Databrill is
designed to create in a client target database. A particular workspace may lack
a relation, have an empty relation, or have stale data because the corresponding
pipeline is not configured. Inspect the live schema with `scripts/catalog.ts`
and check the maximum source date before interpreting results.

A workspace may also hold rollup tables that the catalog does not declare —
`product_overview_ad_asin__day` (the per-ASIN daily ad rollup behind `loadAds`)
and various `custom_report_*` / `r26*_*` relations. `listTables` for the
workspace is authoritative in both directions.

Prefer these views for human-authored SQL where they fit:

- `amazon_sales_and_traffic`
- `amazon_orders_by_day_and_sku`
- `amazon_fba_inventory_summary` (per seller SKU — for labels only, never for a
  units total; use `amzfact_fnsku_fbaInventory` for units)
- `amazon_listing_all` and `amazon_listing_open`
- `amazon_ads_campaign`, `amazon_ads_adgroup`, `amazon_ads_ad`, and
  `amazon_ads_target`

The `brand_ontology_*` views are the exception. They are frequently empty while
`brand_config_amazon_asin` and `brand_config_amazon_family` underneath are
fully populated, because they require an ontology category/variant layer many
workspaces never fill in. Read row counts before trusting an empty result, and
see [Product families](product-hierarchy.md).

JSON/document columns preserve source payloads and can be large. Select only the
fields needed for the question. Relations beginning `op_` are operational state,
not business facts; the current client-target catalog contains no `op_`
relation.
