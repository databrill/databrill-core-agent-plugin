# What data the MCP returns

The hosted MCP offers curated analytics and workspace-scoped SQL. Curated
tools return bounded, interpreted results for common commercial questions;
SQL tools query the selected workspace's granted tables and views. This is
not unrestricted database access, and the tools do not expose credentials.
SQL reads are available in both read-only and read-write sessions. `writeSql`
requires `/rw` and existing write authority; see
[Configuration and workspace scopes](configuration.md#read-write-add-rw-to-any-of-the-three).

## Available MCP tools

### `listTables`

Lists supported tables and views in the workspace's own schema, with their
object types. Start here before writing SQL, then use `describeTable` for
column details. It does not discover other workspaces or system catalogs.

### `describeTable`

Returns column names, data types, nullability and defaults for one relation.
Pass its exact bare name from `listTables`, without a schema qualifier or
added quotes.

### `executeSql`

Runs one read-only SQL statement after discovery with `listTables` and
`describeTable`. Results default to 500 rows, with a maximum of 1000, a 2 MiB
compact JSON result cap and a 15-second statement timeout. Check the result's
truncation metadata. SQL applies no curated metric logic: attribution,
marketplace grain and report deduplication remain the query author's
responsibility.

### `writeSql`

Runs one statement against granted `brand_config_*` configuration tables.
It requires a `/rw` session and existing write authority; selecting the mode
grants no permission. Pipeline data tables are not writable through this tool.
Result caps limit only the response, not the committed write, and do not undo
it. Never repeat a truncated write; use `executeSql` to read any remaining
results.

### `loadProducts`

Discovers products before choosing subjects for analysis. The default
`level: "family"` lists configured families with labels and ASIN counts across
the workspace; it ignores `stores`. Use `parentAsin`, `asin` or `sku` for detail
in the resolved active real stores, defaulting to all of them. Configured
family and Amazon parent ASIN are independent groupings, not nested levels.

`stores` accepts comma-separated countries, regions, marketplace IDs, `*` or
merchant-qualified scopes, as in `loadAds`. `products` accepts comma-separated
family names, parent ASINs or child ASINs; parent ASINs expand to children
separately in each selected marketplace. `search` matches a literal,
case-insensitive substring in title or family, including family labels at
family level.

`columns` selects a comma-separated projection. Defaults are small;
`meta.columnsAvailable` lists the level's allowed fields, and unknown names
are refused. Depending on the level and requested columns, results include
family labels/counts, parent titles and their configured families, ASIN
`title`, `brand`, `productType`, `family` and `parentAsin`, or SKU listing
`price`, `quantity` and `fulfillmentChannel`. Missing labels remain null.
Localized ASIN titles and parent links use the first available country in
`meta.titleCountryPriority`. Parent titles come from the parent catalog row;
SKU titles come from listing snapshots.

SKU rows are non-deleted listing snapshots, not listing history or proof of
open/active listing status. Their quantity is not an FBA stock total; use the
FNSKU inventory source described below for that.

`includeUnassigned` defaults to true. False excludes ASINs/SKUs without a
family; at parent level it excludes unassigned children while retaining parents
with assigned children. `meta.unassignedCount` reports matching unassigned
products before exclusion: ASINs at `asin`, SKUs at `sku`, and distinct child
ASINs at family/parent level.

Results default to 200 rows, with a maximum `limit` of 2000 and an `offset`
default of 0. `meta.totalCount` is the full matching count after inclusion
filtering; `meta.rowCount` is the number returned. `meta.isTruncated` and
`meta.truncatedBy` report whether more rows remain and whether the cap was
`rows` or `bytes` (null when not truncated). The shared 2 MiB compact-JSON cap
includes metadata. Advance `offset` by `meta.rowCount`; if no row fits the byte
cap, request fewer columns rather than retrying the same page.

`meta.missingTables` names absent sources. A missing core configuration,
catalog or listing table produces empty data. Missing optional traffic tables
disable only the parent fallback; missing ontology tables disable only the
population check. Neither optional absence forces an empty result, and
`meta.ontologyPopulated: false` does not mean configured families are absent.

### `loadAds`

Returns Amazon advertising impressions, clicks, add-to-cart, purchases, units,
spend, revenue, halo metrics, and optional CTR, conversion rate, CPC, ACOS, and
ROAS. It can group by product, campaign, ad type, placement, target, store, and
time. Amazon's advertising reports commonly lag by one or two days; use
`meta.dateDataLatest`, which is null when the selected stores have no ad data.
Rows with `haloInOnly: true` carry halo-in sales only.

### `loadTraffic`

Returns Amazon Sales & Traffic sessions, units, ordered-product sales, and
session conversion rate by ASIN or configured product family and period.

### `loadSqp`

Returns Search Query Performance periods and top queries, comparing a client's
impressions, clicks, and purchases with Amazon's market totals. SQP is reported
by Amazon in week/month buckets, has thresholds, and lags.

### `loadRank`

Returns Best Sellers Rank by ASIN, category and day: the latest snapshot of each
marketplace-local day, with each row marked as a subcategory or department rank.
Lower rank is better. Rank availability differs by marketplace.

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
pause, throttle, hold, or ramp by product family. It counts each commingled
FNSKU once per merchant and marketplace. For the unit counts themselves, query
`amzfact_fnsku_fbaInventory_latest` via `executeSql`. There is no dedicated MCP
tool for FBA stock levels yet.

### `loadAmazonFbaStockouts`

Returns FBA stockout episodes per merchant, marketplace and FNSKU: when
fulfillable stock ran out and whether it came back, with the FNSKU's ASIN and
every seller SKU pointing at it. It reads FBA inventory history from the day a
store's history starts, and the FBA inventory ledger's SELLABLE balance for the
days of the range before that; ledger episodes are a lower bound, since
reserved units count in that balance. `meta.stores` says per store where
history starts and which days came from the ledger.
`dbl-metrics-amazon-inventory-history` describes its fields.

### `loadTflInventory`

It appears in Claude's tool list when Databrill has enabled The Fulfillment
Lab MCP access for at least one workspace covered by the connection. On user-
and organization-scoped connections, its required `wsid` choices include only
workspaces with that access enabled; it cannot query other workspaces. On a
workspace-scoped connection, it appears only if that workspace has access
enabled, and no `wsid` argument is needed.

It returns product inventory from each connector's latest daily warehouse
snapshot, or the latest snapshot on/before a requested date. It includes
product ids/names, warehouse, on-hand, allocated, available, and product-id-based
SKU mappings. It can filter by exact product id/name/SKU, warehouse, or maximum
available units.

### `listWorkspaces`

Every returned workspace includes its id, label, merchants, and countries on all
connector scopes. A workspace-scoped connector returns one entry for its active
workspace, including that workspace's merchant and country metadata. The URL
fixes the target, so data tools need no `wsid` argument. On organization-
and user-scoped connectors, select a workspace from the `listWorkspaces` result
and pass its `wsid` to every data tool; that result never selects one
implicitly.

## Present in client databases but not yet exposed by a dedicated MCP tool

Depending on the workspace's configured pipelines, the database may also
contain:

- Amazon orders and order items;
- listing status/history, catalog attributes beyond the `loadProducts`
  projection, images, and offer snapshots;
- returns, reimbursements, removals, storage fees, coupons, and promotions;
- settlement, ledger, transaction, posting, and projected-profit data;
- advertising campaign/entity exports and Amazon Marketing Stream events;
- FBA stock levels at the FNSKU grain (`amzfact_fnsku_fbaInventory_latest`,
  with `amzfact_sku_identity` for the seller-SKU mapping) — the only correct
  source for a units total, per marketplace;
- FBA stock on past days (`amzfact_fnsku_ledger_history`, Amazon's inventory
  ledger by fulfilment centre and day, as far back as Amazon serves it) —
  `dbl-metrics-amazon-inventory-history`;
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
- brand ontology;
- exchange rates and marketplace/store dimensions.

Use `executeSql`, or the read-only Deno or n8n path, for these sources.
`loadProducts` exposes selected catalog and listing fields for discovery, as
listed above; it does not replace SQL for the remaining fields or history.
`loadTflInventory` reads TFL daily warehouse stock. `inventoryPacing` remains a
separate tool that reads Amazon FBA inventory; do not present either source as
the other, and never add Amazon, TFL and Shopify units together without saying
which network each figure belongs to — Shopify's locations may be the TFL
warehouse rather than a separate pool.

## Declared does not mean ingested

The [declared schema](schema/README.md) is a generated reference for the
declared tables and views, with one index per channel group. The per-marketplace
`amazon_sales_rank__<code>` tables are built from a template and are absent from
the generated index.

A particular workspace may lack a relation, have an empty relation, or have
stale data because the corresponding pipeline is not configured. Inspect the
workspace with `listTables` and `describeTable`, or `scripts/catalog.ts`, and
check the maximum source date before interpreting results.

A workspace may also hold rollup tables that the declared schema does not
declare, such as `custom_report_*` / `r26*_*` relations. Neither inclusion in nor
omission from the generated index establishes whether a relation exists in a
workspace. Use `listTables` for the workspace you are querying.

Prefer these views for human-authored SQL where they fit:

- `amazon_sales_and_traffic`
- `amazon_orders_by_day_and_sku`
- `amazon_listing_all` and `amazon_listing_open`
- `amazon_ads_campaign`, `amazon_ads_adgroup`, `amazon_ads_ad`, and
  `amazon_ads_target`

The `brand_ontology_*` views are the exception. They can be **empty** even when
`brand_config_amazon_asin` and `brand_config_amazon_family` underneath are
complete, because they require an ontology category/variant layer a workspace
may not fill in. Read row counts before trusting an empty result, and
see [Product families](product-hierarchy.md).

JSON/document columns preserve source payloads and can be large. Select only the
fields needed for the question. Relations beginning `op_` are operational state,
not business facts; the declared schema contains no `op_` table.
