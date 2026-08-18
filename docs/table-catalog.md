# Complete Databrill client table and view catalog

This file is generated from `REMOTE_TABLES` (106 tables) and `REMOTE_VIEWS` (13 views) in `services/libs/database/src/initTablesRemote.ts`.

`workspace` in the SQL below is a placeholder. A live database may use `public` or a `w{wsid}` schema. A declared relation is not proof that its pipeline is configured, populated, or current in a particular workspace. Run `scripts/catalog.ts` against that workspace before writing a query.

Column and relation identifiers are case-sensitive where shown and must be double-quoted in hand-written SQL. JSON/JSONB columns are source documents; select only the fields needed. The generated DDL includes primary keys, constraints, indexes, and view definitions.

## Index

### Amazon account and marketplace dimensions

- [`amazon_browse_node`](#relation-1) (table)
- [`amazon_browse_node_attribute`](#relation-2) (table)
- [`amazon_country`](#relation-3) (table)
- [`amazon_marketplace`](#relation-4) (table)
- [`amazon_merchant`](#relation-7) (table)
- [`amazon_store`](#relation-8) (table)
- [`amzspapi_sellers_v1__account`](#relation-9) (table)
- [`amzspapi_sellers_v1__marketplace`](#relation-10) (table)
- [`amzspapi_sellers_v1__marketplaceParticipation`](#relation-11) (table)

### Exchange rates

- [`fx_ecb_rate_history`](#relation-5) (table)
- [`fx_ecb_rate_latest`](#relation-6) (table)

### Amazon orders

- [`amzspapi_orders_v0__Order`](#relation-12) (table)
- [`amzspapi_orders_v0__OrderItem`](#relation-13) (table)

### Amazon inventory and offers

- [`amzspapi_fbaInventory_v1__InventorySummary`](#relation-14) (table)
- [`amzop_latest__byStoreAsin`](#relation-77) (table)

### Amazon finances and profit

- [`amzspapi_finances_v20240619__Transaction`](#relation-15) (table)
- [`amzspapi_finances_v20240619__TransactionItemSummary`](#relation-16) (table)
- [`amzspapi_finances_v20240619__TransactionItemProjectionState`](#relation-17) (table)
- [`amzagg_profit__orderItem`](#relation-78) (table)
- [`amzagg_profit__orderItemProjectionState`](#relation-79) (table)
- [`amzfact_ledger_transaction`](#relation-80) (table)
- [`amzfact_ledger_posting`](#relation-81) (table)
- [`amzfact_ledger_item`](#relation-82) (table)
- [`amzfact_ledger_build`](#relation-83) (table)

### Amazon catalog

- [`amzspapi_catalog_items_v20220401__catalogitem`](#relation-18) (table)
- [`amzspapi_catalog_items_v20220401__itemattributes`](#relation-19) (table)
- [`amzspapi_catalog_items_v20220401__itemattributes_lang`](#relation-20) (table)
- [`amzspapi_catalog_items_v20220401__itemimages`](#relation-21) (table)
- [`amzspapi_searchCatalogItems_v2020__target`](#relation-22) (table)
- [`amzspapi_searchCatalogItems_v2020__scrape`](#relation-23) (table)
- [`amzspapi_searchCatalogItems_v2020__rank`](#relation-24) (table)
- [`amzspapi_searchCatalogItems_v2020__asin`](#relation-25) (table)

### Amazon notifications

- [`amzspstream_ORDER_CHANGE`](#relation-26) (table)
- [`amzspstream_ACCOUNT_STATUS_CHANGED`](#relation-27) (table)
- [`amzspstream_ANY_OFFER_CHANGED`](#relation-28) (table)
- [`amzspstream_B2B_ANY_OFFER_CHANGED`](#relation-29) (table)
- [`amzspstream_DETAIL_PAGE_TRAFFIC_EVENT`](#relation-30) (table)
- [`amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES`](#relation-31) (table)
- [`amzspstream_REPORT_PROCESSING_FINISHED`](#relation-32) (table)
- [`amzspstream_FEED_PROCESSING_FINISHED`](#relation-33) (table)
- [`amzspstream_PRICING_HEALTH`](#relation-34) (table)
- [`amzspstream_FULFILLMENT_ORDER_STATUS`](#relation-35) (table)
- [`amzspstream_FEE_PROMOTION`](#relation-36) (table)

### Amazon reports

- [`amzreport_ALL_ORDERS`](#relation-37) (table)
- [`amzreport_COUPON_PERFORMANCE`](#relation-38) (table)
- [`amzreport_FBA_CUSTOMER_RETURNS`](#relation-39) (table)
- [`amzreport_FBA_FEE_PREVIEW`](#relation-40) (table)
- [`amzreport_FBA_INVENTORY_PLANNING`](#relation-41) (table)
- [`amzreport_FBA_REIMBURSEMENTS`](#relation-42) (table)
- [`amzreport_FBA_REMOVAL_ORDER_DETAIL`](#relation-43) (table)
- [`amzreport_FBA_REMOVAL_SHIPMENT_DETAIL`](#relation-44) (table)
- [`amzreport_FBA_STORAGE_FEE`](#relation-45) (table)
- [`amzreport_LEDGER_DETAIL`](#relation-46) (table)
- [`amzreport_LEDGER_SUMMARY`](#relation-47) (table)
- [`amzreport_MERCHANT_LISTINGS_ALL`](#relation-48) (table)
- [`amzreport_OPEN_LISTINGS`](#relation-49) (table)
- [`amzreport_PROMOTION_PERFORMANCE`](#relation-50) (table)
- [`amzreport_SALES_AND_TRAFFIC__skuByDay`](#relation-51) (table)
- [`amzreport_SALES_AND_TRAFFIC__store`](#relation-52) (table)
- [`amzreport_SEARCH_CATALOG_PERFORMANCE`](#relation-53) (table)
- [`amzreport_SEARCH_QUERY_PERFORMANCE`](#relation-54) (table)
- [`amzreport_SETTLEMENT_V2`](#relation-55) (table)
- [`amzreport_SETTLEMENT_V2__summary`](#relation-56) (table)

### Amazon Ads API

- [`amzadapi_eligibility_v1__program`](#relation-57) (table)
- [`amzadapi_exports_v1__ad`](#relation-58) (table)
- [`amzadapi_exports_v1__adgroup`](#relation-59) (table)
- [`amzadapi_exports_v1__campaign`](#relation-60) (table)
- [`amzadapi_exports_v1__target`](#relation-61) (table)
- [`amzadapi_reports_v1__product01__byDay`](#relation-62) (table)
- [`amzadapi_reports_v1__search_asin_placement__byDay`](#relation-63) (table)

### Amazon Marketing Stream

- [`amzms_v1__budget_usage`](#relation-64) (table)
- [`amzms_v1__campaigns`](#relation-65) (table)
- [`amzms_v1__adgroups`](#relation-66) (table)
- [`amzms_v1__ads`](#relation-67) (table)
- [`amzms_v1__targets`](#relation-68) (table)
- [`amzms_v1__sp_traffic`](#relation-69) (table)
- [`amzms_v1__sp_conversion`](#relation-70) (table)
- [`amzms_v1__sd_traffic`](#relation-71) (table)
- [`amzms_v1__sd_conversion`](#relation-72) (table)
- [`amzms_v1__sb_traffic`](#relation-73) (table)
- [`amzms_v1__sb_conversion`](#relation-74) (table)
- [`amzms_v1__sb_clickstream`](#relation-75) (table)
- [`amzms_v1__sb_rich_media`](#relation-76) (table)

### Brand ontology and product configuration

- [`brand_config_ontology_metadata`](#relation-84) (table)
- [`brand_config_ontology_category`](#relation-85) (table)
- [`brand_config_ontology_variant`](#relation-86) (table)
- [`brand_config_amazon_family`](#relation-87) (table)
- [`brand_config_amazon_asin`](#relation-88) (table)
- [`brand_config_amazon_attributes`](#relation-89) (table)
- [`brand_config_business_attributes`](#relation-90) (table)

### Walmart

- [`wmt_orders_v3__Order`](#relation-91) (table)
- [`wmt_orders_v3__OrderLine`](#relation-92) (table)
- [`wmt_inventory_v3__Wfs`](#relation-93) (table)
- [`wmt_account_v3__profile`](#relation-94) (table)

### The Fulfillment Lab

- [`tfl_orders_v1__Order`](#relation-95) (table)
- [`tfl_orders_v1__OrderItem`](#relation-96) (table)
- [`tfl_shipments_v1__Shipment`](#relation-97) (table)
- [`tfl_products_v1__Inventory`](#relation-98) (table)
- [`tfl_products_v1__WarehouseInventory`](#relation-99) (table)
- [`tfl_products_v1__Sku`](#relation-100) (table)
- [`tfl_products_v1__SkuProduct`](#relation-101) (table)
- [`tfl_inventorySummary_v1__ProductWarehouse`](#relation-102) (table)
- [`tfl_asns_v1__Asn`](#relation-103) (table)
- [`tfl_asns_v1__AsnItem`](#relation-104) (table)
- [`tfl_otsShipments_v1__OtsShipment`](#relation-105) (table)
- [`tfl_otsShipments_v1__OtsShipmentItem`](#relation-106) (table)

### Curated views

- [`amazon_ads_ad`](#relation-107) (view)
- [`amazon_ads_adgroup`](#relation-108) (view)
- [`amazon_ads_campaign`](#relation-109) (view)
- [`amazon_ads_target`](#relation-110) (view)
- [`amazon_fba_inventory_summary`](#relation-111) (view)
- [`amazon_listing_all`](#relation-112) (view)
- [`amazon_listing_open`](#relation-113) (view)
- [`amazon_orders_by_day_and_sku`](#relation-114) (view)
- [`amazon_sales_and_traffic`](#relation-115) (view)
- [`brand_ontology_category`](#relation-116) (view)
- [`brand_ontology_variant`](#relation-117) (view)
- [`brand_ontology_amazon_family`](#relation-118) (view)
- [`brand_ontology_amazon_asin`](#relation-119) (view)

## Relation definitions

<a id="relation-1"></a>

### table: `amazon_browse_node`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amazon_browse_node" (
	"marketplace_code" TEXT NOT NULL,
	"id" BIGINT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"deleted_at" TIMESTAMPTZ,
	"name" TEXT NOT NULL,
	"store_context_name" TEXT,
	"parent_id" BIGINT,
	"path" BIGINT[] NOT NULL,
	"has_children" BOOLEAN NOT NULL,
	PRIMARY KEY ("marketplace_code", "id")
);
CREATE INDEX IF NOT EXISTS "amazon_browse_node__marketplace_code__parent_id" ON "workspace"."amazon_browse_node" ("marketplace_code", "parent_id");
CREATE INDEX IF NOT EXISTS "amazon_browse_node__updated_at" ON "workspace"."amazon_browse_node" ("updated_at");
CREATE INDEX IF NOT EXISTS "amazon_browse_node__deleted_at" ON "workspace"."amazon_browse_node" ("deleted_at");
```

<a id="relation-2"></a>

### table: `amazon_browse_node_attribute`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amazon_browse_node_attribute" (
	"marketplace_code" TEXT NOT NULL,
	"node_id" BIGINT NOT NULL,
	"name" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"deleted_at" TIMESTAMPTZ,
	"value" TEXT NOT NULL,
	PRIMARY KEY ("marketplace_code", "node_id", "name")
);
CREATE INDEX IF NOT EXISTS "amazon_browse_node_attribute__updated_at" ON "workspace"."amazon_browse_node_attribute" ("updated_at");
CREATE INDEX IF NOT EXISTS "amazon_browse_node_attribute__deleted_at" ON "workspace"."amazon_browse_node_attribute" ("deleted_at");
```

<a id="relation-3"></a>

### table: `amazon_country`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amazon_country" (
	"country_code" CHAR(2) PRIMARY KEY,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"country_name" TEXT NOT NULL,
	"region" CHAR(2) NOT NULL,
	"time_zone" TEXT NOT NULL
);
```

<a id="relation-4"></a>

### table: `amazon_marketplace`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amazon_marketplace" (
	"marketplace_id" TEXT PRIMARY KEY,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"marketplace_code" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"country_code" TEXT NOT NULL,
	"currency" TEXT NOT NULL,
	"lang" TEXT NOT NULL,
	"domain" TEXT NOT NULL,
	"time_zone" TEXT
);
CREATE INDEX IF NOT EXISTS "amazon_marketplace__marketplace_code" ON "workspace"."amazon_marketplace" ("marketplace_code");
```

<a id="relation-5"></a>

### table: `fx_ecb_rate_history`

Category: Exchange rates

```sql
CREATE TABLE IF NOT EXISTS "workspace"."fx_ecb_rate_history" (
	"unit" CHAR(3) NOT NULL,
	"timeFormat" TEXT NOT NULL,
	"period" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"value" DOUBLE PRECISION NOT NULL,
	"decimals" INTEGER NOT NULL,
	PRIMARY KEY ("unit", "timeFormat", "period")
);
```

<a id="relation-6"></a>

### table: `fx_ecb_rate_latest`

Category: Exchange rates

```sql
CREATE TABLE IF NOT EXISTS "workspace"."fx_ecb_rate_latest" (
	"unit" CHAR(3) NOT NULL,
	"timeFormat" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"period" TEXT NOT NULL,
	"value" DOUBLE PRECISION NOT NULL,
	"decimals" INTEGER NOT NULL,
	PRIMARY KEY ("unit", "timeFormat")
);
```

<a id="relation-7"></a>

### table: `amazon_merchant`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amazon_merchant" (
	"merchantId" TEXT PRIMARY KEY,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"merchantName" TEXT NOT NULL,
	"isActive" BOOLEAN NOT NULL
);
```

<a id="relation-8"></a>

### table: `amazon_store`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amazon_store" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"marketplaceCode" TEXT NOT NULL,
	"countryCode" TEXT NOT NULL,
	"storeName" TEXT NOT NULL,
	"isActive" BOOLEAN NOT NULL,
	"isReal" BOOLEAN NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId")
);
```

<a id="relation-9"></a>

### table: `amzspapi_sellers_v1__account`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_sellers_v1__account" (
	"merchantId" TEXT PRIMARY KEY,
	"doc" JSONB NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL
);
```

<a id="relation-10"></a>

### table: `amzspapi_sellers_v1__marketplace`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_sellers_v1__marketplace" (
	"id" TEXT PRIMARY KEY,
	"countryCode" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"defaultCurrencyCode" TEXT NOT NULL,
	"defaultLanguageCode" TEXT NOT NULL,
	"domainName" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"isReal" BOOLEAN NOT NULL
);
```

<a id="relation-11"></a>

### table: `amzspapi_sellers_v1__marketplaceParticipation`

Category: Amazon account and marketplace dimensions

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_sellers_v1__marketplaceParticipation" (
	"merchantId" TEXT NOT NULL,
	"id" TEXT PRIMARY KEY,
	"marketplaceId" TEXT NOT NULL,
	"doc" JSONB NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"isReal" BOOLEAN NOT NULL,
	"isActive" BOOLEAN NOT NULL,
	FOREIGN KEY ("marketplaceId") REFERENCES "workspace"."amzspapi_sellers_v1__marketplace"("id") ON DELETE CASCADE
);
```

<a id="relation-12"></a>

### table: `amzspapi_orders_v0__Order`

Category: Amazon orders

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_orders_v0__Order" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"orderKey" TEXT NOT NULL,
	"amazonOrderId" TEXT NOT NULL,
	"time" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "orderKey")
);
CREATE INDEX IF NOT EXISTS "amzspapi_orders_v0__Order__amazonOrderId" ON "workspace"."amzspapi_orders_v0__Order" ("amazonOrderId");
```

<a id="relation-13"></a>

### table: `amzspapi_orders_v0__OrderItem`

Category: Amazon orders

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_orders_v0__OrderItem" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"orderItemKey" TEXT NOT NULL,
	"orderKey" TEXT NOT NULL,
	"orderItemId" TEXT NOT NULL,
	"time" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "orderItemKey")
);
CREATE INDEX IF NOT EXISTS "amzspapi_orders_v0__OrderItem__orderKey__orderItemId" ON "workspace"."amzspapi_orders_v0__OrderItem" ("orderKey", "orderItemId");
```

<a id="relation-14"></a>

### table: `amzspapi_fbaInventory_v1__InventorySummary`

Category: Amazon inventory and offers

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_fbaInventory_v1__InventorySummary" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"sellerSku" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	"contentHash" TEXT,
	PRIMARY KEY ("merchantId", "marketplaceId", "sellerSku")
) WITH (fillfactor=75);
```

<a id="relation-15"></a>

### table: `amzspapi_finances_v20240619__Transaction`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_finances_v20240619__Transaction" (
	"merchantId" TEXT NOT NULL,
	"transactionKey" TEXT NOT NULL,
	"transactionId" TEXT NOT NULL,
	"time" TIMESTAMPTZ NOT NULL,
	"transactionType" TEXT,
	"transactionStatus" TEXT,
	"marketplaceId" TEXT,
	"orderId" TEXT,
	"doc" JSONB NOT NULL,
	"itemProjectionVersion" INTEGER CHECK ("itemProjectionVersion" IS NULL OR "itemProjectionVersion" > 0),
	"itemProjectionItemCount" INTEGER CHECK ("itemProjectionItemCount" IS NULL OR "itemProjectionItemCount" >= 0),
	"itemProjectionSourceUpdatedAt" TIMESTAMPTZ,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	PRIMARY KEY ("merchantId", "transactionKey")
);
CREATE INDEX IF NOT EXISTS "amzspapi_finances_v20240619__Transaction__merchantId_orderId" ON "workspace"."amzspapi_finances_v20240619__Transaction" ("merchantId", "orderId") WHERE "orderId" IS NOT NULL;
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__Transaction"."merchantId" IS 'Amazon Seller ID';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__Transaction"."transactionKey" IS 'UUID v7-like key from makeKey_transactionKey(postedDate, transactionId); time-prefixed so postedDate-range scans hit a contiguous PK range without an extra index';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__Transaction"."transactionId" IS 'The API''s unique transaction identifier';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__Transaction"."time" IS 'The transaction''s postedDate';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__Transaction"."doc" IS 'The full Transaction object from the API; persisted as JSONB';
```

<a id="relation-16"></a>

### table: `amzspapi_finances_v20240619__TransactionItemSummary`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_finances_v20240619__TransactionItemSummary" (
	"merchantId" TEXT NOT NULL,
	"transactionKey" TEXT NOT NULL,
	"itemIndex" INTEGER NOT NULL CHECK ("itemIndex" >= 0),
	"contextType" TEXT,
	"sku" TEXT,
	"asin" TEXT,
	"quantityShipped" INTEGER,
	"amazonFeesAmount" DOUBLE PRECISION NOT NULL,
	"digitalServicesFeeAmount" DOUBLE PRECISION NOT NULL,
	"allTopLevelBreakdownsAmount" DOUBLE PRECISION NOT NULL,
	"feeCurrencyCodes" TEXT[] NOT NULL,
	"topLevelCurrencyCodes" TEXT[] NOT NULL,
	"feeBreakdownCount" INTEGER NOT NULL CHECK ("feeBreakdownCount" >= 0),
	"topLevelBreakdownCount" INTEGER NOT NULL CHECK ("topLevelBreakdownCount" >= 0),
	"feeMissingCurrencyCount" INTEGER NOT NULL CHECK ("feeMissingCurrencyCount" >= 0),
	"topLevelMissingCurrencyCount" INTEGER NOT NULL CHECK ("topLevelMissingCurrencyCount" >= 0),
	"refundPhaseKey" TEXT,
	"extractorVersion" INTEGER NOT NULL CHECK ("extractorVersion" > 0),
	"sourceUpdatedAt" TIMESTAMPTZ NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	PRIMARY KEY ("merchantId", "transactionKey", "itemIndex"),
	FOREIGN KEY ("merchantId", "transactionKey") REFERENCES "workspace"."amzspapi_finances_v20240619__Transaction"("merchantId", "transactionKey") ON DELETE CASCADE ON UPDATE CASCADE
);
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."merchantId" IS 'Amazon Seller ID; parent-key member';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."transactionKey" IS 'Parent amzspapi_finances_v20240619__Transaction.transactionKey';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."itemIndex" IS 'Zero-based position of this item in the source doc.items array';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."amazonFeesAmount" IS 'Sum of every top-level AmazonFees breakdown amount; zero when none';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."digitalServicesFeeAmount" IS 'Sum of every top-level DigitalServicesFee breakdown amount; zero when none';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."allTopLevelBreakdownsAmount" IS 'Sum of every top-level breakdown amount; zero when none';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."feeCurrencyCodes" IS 'Sorted distinct non-empty currency codes seen on the relevant fee breakdowns';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."topLevelCurrencyCodes" IS 'Sorted distinct non-empty currency codes seen on all top-level breakdowns';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."feeBreakdownCount" IS 'Count of top-level AmazonFees + DigitalServicesFee breakdowns';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."topLevelBreakdownCount" IS 'Count of all top-level breakdowns';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."feeMissingCurrencyCount" IS 'Relevant fee breakdowns whose amount carried no currency code';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."topLevelMissingCurrencyCount" IS 'Top-level breakdowns whose amount carried no currency code';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."extractorVersion" IS 'Version of the pure extractor that produced this row; first version is 1';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemSummary"."sourceUpdatedAt" IS 'The parent Transaction updatedAt value this row was extracted from';
```

<a id="relation-17"></a>

### table: `amzspapi_finances_v20240619__TransactionItemProjectionState`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState" (
	"merchantId" TEXT PRIMARY KEY,
	"extractorVersion" INTEGER NOT NULL CHECK ("extractorVersion" > 0),
	"status" TEXT NOT NULL CHECK ("status" IN ('BACKFILLING', 'VERIFYING', 'READY', 'STALE', 'FAILED')),
	"cursorTransactionKey" TEXT,
	"snapshotMaxTransactionKey" TEXT,
	"processedTransactionCount" INTEGER NOT NULL CHECK ("processedTransactionCount" >= 0),
	"sourceTransactionCount" INTEGER NOT NULL CHECK ("sourceTransactionCount" >= 0),
	"sourceItemCount" INTEGER NOT NULL CHECK ("sourceItemCount" >= 0),
	"projectedItemCount" INTEGER NOT NULL CHECK ("projectedItemCount" >= 0),
	"invalidTransactionCount" INTEGER NOT NULL CHECK ("invalidTransactionCount" >= 0),
	"mismatchedTransactionCount" INTEGER NOT NULL CHECK ("mismatchedTransactionCount" >= 0),
	"startedAt" TIMESTAMPTZ NOT NULL,
	"verifiedAt" TIMESTAMPTZ,
	"lastError" TEXT,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."merchantId" IS 'Amazon Seller ID; the whole primary key';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."extractorVersion" IS 'Extractor version this state describes; first version is 1';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."status" IS 'BACKFILLING | VERIFYING | READY | STALE | FAILED';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."processedTransactionCount" IS 'Transactions processed by the current run';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."sourceTransactionCount" IS 'Source Transactions counted at the last verification';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."sourceItemCount" IS 'Expected item count summed from parent markers at the last verification';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."projectedItemCount" IS 'Item-summary rows counted at the last verification';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."invalidTransactionCount" IS 'Transactions whose extraction produced an invalid diagnostic';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."mismatchedTransactionCount" IS 'Transactions whose markers, ordinals, counts or source times disagreed';
COMMENT ON COLUMN "workspace"."amzspapi_finances_v20240619__TransactionItemProjectionState"."startedAt" IS 'Start of the current backfill/verification run';
```

<a id="relation-18"></a>

### table: `amzspapi_catalog_items_v20220401__catalogitem`

Category: Amazon catalog

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_catalog_items_v20220401__catalogitem" (
	"marketplace_code" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"modified_at" TIMESTAMPTZ NOT NULL,
	"dimensions" JSONB,
	"identifiers" JSONB,
	"thumbnail" TEXT,
	"product_type" TEXT,
	"parent_asin" TEXT,
	"variation_theme" JSONB,
	"summaries" JSONB,
	PRIMARY KEY ("marketplace_code", "asin")
);
```

<a id="relation-19"></a>

### table: `amzspapi_catalog_items_v20220401__itemattributes`

Category: Amazon catalog

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_catalog_items_v20220401__itemattributes" (
	"marketplace_code" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"modified_at" TIMESTAMPTZ NOT NULL,
	"data" JSONB NOT NULL,
	PRIMARY KEY ("marketplace_code", "asin")
);
```

<a id="relation-20"></a>

### table: `amzspapi_catalog_items_v20220401__itemattributes_lang`

Category: Amazon catalog

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_catalog_items_v20220401__itemattributes_lang" (
	"marketplace_code" TEXT NOT NULL,
	"lang" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"modified_at" TIMESTAMPTZ NOT NULL,
	"data" JSONB NOT NULL,
	PRIMARY KEY ("marketplace_code", "lang", "asin")
);
```

<a id="relation-21"></a>

### table: `amzspapi_catalog_items_v20220401__itemimages`

Category: Amazon catalog

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_catalog_items_v20220401__itemimages" (
	"marketplace_code" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"modified_at" TIMESTAMPTZ NOT NULL,
	"images" JSONB NOT NULL,
	PRIMARY KEY ("marketplace_code", "asin")
);
```

<a id="relation-22"></a>

### table: `amzspapi_searchCatalogItems_v2020__target`

Category: Amazon catalog

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_searchCatalogItems_v2020__target" (
	"targetId" BIGINT PRIMARY KEY,
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"keyword" TEXT NOT NULL,
	"locale" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "amzspapi_searchCatalogItems_v2020__target__merchantId__marketplaceId__keyword__locale" ON "workspace"."amzspapi_searchCatalogItems_v2020__target" ("merchantId", "marketplaceId", "keyword", "locale");
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__target"."targetId" IS 'Signed BIGINT primary key; deterministic hash of (wsid, merchantId, marketplaceId, keyword, locale), computed identically to the central schedule table';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__target"."merchantId" IS 'Amazon Seller ID';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__target"."marketplaceId" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__target"."keyword" IS 'The search term scraped from SP-API''s searchCatalogItems endpoint';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__target"."locale" IS 'Resolved marketplace defaultLanguageCode for this scrape unit';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__target"."createdAt" IS 'When this target row was first created';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__target"."updatedAt" IS 'When this target row was last updated';
```

<a id="relation-23"></a>

### table: `amzspapi_searchCatalogItems_v2020__scrape`

Category: Amazon catalog

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_searchCatalogItems_v2020__scrape" (
	"targetId" BIGINT NOT NULL,
	"scrapeTime" TIMESTAMPTZ NOT NULL,
	"depthPages" INTEGER NOT NULL,
	"pageCount" INTEGER NOT NULL,
	"itemCount" INTEGER NOT NULL,
	"status" TEXT NOT NULL,
	"error" TEXT,
	PRIMARY KEY ("targetId", "scrapeTime")
);
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__scrape"."targetId" IS 'Signed BIGINT; the scrape unit this run belongs to (see __target)';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__scrape"."scrapeTime" IS 'When this scrape ran (TIMESTAMPTZ); the second half of the PK';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__scrape"."depthPages" IS 'Number of result pages requested for this scrape';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__scrape"."pageCount" IS 'Number of result pages actually fetched';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__scrape"."itemCount" IS 'Total number of ranked items recorded for this scrape';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__scrape"."status" IS 'Outcome of the scrape: always ''ok'' — abandoned scrapes are header-less (engine rebuild)';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__scrape"."error" IS 'Reserved; always NULL now that only completed (''ok'') scrapes write a header';
```

<a id="relation-24"></a>

### table: `amzspapi_searchCatalogItems_v2020__rank`

Category: Amazon catalog

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_searchCatalogItems_v2020__rank" (
	"targetId" BIGINT NOT NULL,
	"scrapeTime" TIMESTAMPTZ NOT NULL,
	"rank" INTEGER NOT NULL,
	"asin" TEXT NOT NULL,
	PRIMARY KEY ("targetId", "scrapeTime", "rank")
) PARTITION BY RANGE ("scrapeTime");
CREATE INDEX IF NOT EXISTS "amzspapi_searchCatalogItems_v2020__rank__asin__targetId__scrapeTime" ON "workspace"."amzspapi_searchCatalogItems_v2020__rank" ("asin", "targetId", "scrapeTime");
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__rank"."targetId" IS 'Signed BIGINT; the scrape unit this rank belongs to (see __target)';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__rank"."scrapeTime" IS 'When the scrape ran (TIMESTAMPTZ); the monthly partition key and part of the PK';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__rank"."rank" IS '1-based rank, continuous across page boundaries';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__rank"."asin" IS 'The ranked ASIN at this position';
```

<a id="relation-25"></a>

### table: `amzspapi_searchCatalogItems_v2020__asin`

Category: Amazon catalog

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspapi_searchCatalogItems_v2020__asin" (
	"marketplaceId" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"itemName" TEXT,
	"brandName" TEXT,
	"imageUrl" TEXT,
	"parentAsin" TEXT,
	"summaries" JSONB,
	"firstSeenAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	PRIMARY KEY ("marketplaceId", "asin")
);
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."marketplaceId" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."asin" IS 'The ASIN this metadata describes';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."itemName" IS 'Item title, from summaries[0].itemName';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."brandName" IS 'Brand, from summaries[0].brandName';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."imageUrl" IS 'MAIN-variant image link, from images[0].images';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."parentAsin" IS 'Parent ASIN from a CHILD variation relationship; NULL for standalone items';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."summaries" IS 'Remaining summaries[0] fields stored as JSONB (open set): browseNode, colorName, manufacturer, modelNumber, sizeName, styleName';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."firstSeenAt" IS 'When this ASIN was first recorded';
COMMENT ON COLUMN "workspace"."amzspapi_searchCatalogItems_v2020__asin"."updatedAt" IS 'When this ASIN''s metadata was last overwritten';
```

<a id="relation-26"></a>

### table: `amzspstream_ORDER_CHANGE`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_ORDER_CHANGE" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"amazonOrderId" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS "amzspstream_ORDER_CHANGE__amazonOrderId" ON "workspace"."amzspstream_ORDER_CHANGE" ("amazonOrderId");
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."eventTime" IS 'Notification EventTime';
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."merchantId" IS 'Seller id from OrderChangeNotification.SellerId';
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."marketplaceId" IS 'Marketplace id from the notification Summary';
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."amazonOrderId" IS 'Amazon order id the change pertains to';
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."notificationVersion" IS 'SP-API NotificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."payloadVersion" IS 'SP-API PayloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_ORDER_CHANGE"."payload" IS 'Unwrapped OrderChangeNotification with SellerId/AmazonOrderId stripped (JSONB)';
```

<a id="relation-27"></a>

### table: `amzspstream_ACCOUNT_STATUS_CHANGED`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"previousAccountStatus" TEXT NOT NULL,
	"currentAccountStatus" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."eventTime" IS 'Notification eventTime';
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."merchantId" IS 'Merchant id resolved from the metadata subscriptionId (the body carries none)';
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."previousAccountStatus" IS 'Account status before the change (e.g. NORMAL, AT_RISK, DEACTIVATED)';
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."currentAccountStatus" IS 'Account status after the change (e.g. NORMAL, AT_RISK, DEACTIVATED)';
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."notificationVersion" IS 'SP-API notificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."payloadVersion" IS 'SP-API payloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_ACCOUNT_STATUS_CHANGED"."payload" IS 'Unwrapped accountStatusChangeNotification with previousAccountStatus/currentAccountStatus stripped (JSONB)';
```

<a id="relation-28"></a>

### table: `amzspstream_ANY_OFFER_CHANGED`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_ANY_OFFER_CHANGED" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."eventTime" IS 'Notification EventTime';
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."merchantId" IS 'Seller id from AnyOfferChangedNotification.SellerId';
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."marketplaceId" IS 'Marketplace id from OfferChangeTrigger.MarketplaceId';
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."asin" IS 'ASIN from OfferChangeTrigger.ASIN';
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."notificationVersion" IS 'SP-API NotificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."payloadVersion" IS 'SP-API PayloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_ANY_OFFER_CHANGED"."payload" IS 'Unwrapped AnyOfferChangedNotification with SellerId stripped (JSONB)';
```

<a id="relation-29"></a>

### table: `amzspstream_B2B_ANY_OFFER_CHANGED`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."eventTime" IS 'Notification EventTime';
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."merchantId" IS 'Seller id from B2BAnyOfferChangedNotification.SellerId';
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."marketplaceId" IS 'Marketplace id from OfferChangeTrigger.MarketplaceId';
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."asin" IS 'ASIN from OfferChangeTrigger.ASIN';
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."notificationVersion" IS 'SP-API NotificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."payloadVersion" IS 'SP-API PayloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_B2B_ANY_OFFER_CHANGED"."payload" IS 'Unwrapped B2BAnyOfferChangedNotification with SellerId stripped (JSONB)';
```

<a id="relation-30"></a>

### table: `amzspstream_DETAIL_PAGE_TRAFFIC_EVENT`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"startTime" TEXT NOT NULL,
	"endTime" TEXT NOT NULL,
	"glanceViews" INTEGER NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."id" IS 'Deterministic UUIDv7 keyed on (notificationId, asin, startTime, endTime) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."eventTime" IS 'Notification EventTime';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."merchantId" IS 'Merchant code parsed from the element accountId (amzn1.merchant.o.<merchantId>)';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."marketplaceId" IS 'Marketplace id from the traffic-event element';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."asin" IS 'ASIN from the traffic-event element';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."startTime" IS 'Start of the traffic-aggregation window (ISO-8601, also part of the PK discriminator)';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."endTime" IS 'End of the traffic-aggregation window (ISO-8601, also part of the PK discriminator)';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."glanceViews" IS 'Glance views in the window for this asin/marketplace';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."notificationVersion" IS 'SP-API NotificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."payloadVersion" IS 'SP-API PayloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_DETAIL_PAGE_TRAFFIC_EVENT"."payload" IS 'Traffic-event element with promoted fields stripped (JSONB)';
```

<a id="relation-31"></a>

### table: `amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"fnsku" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."id" IS 'Deterministic UUIDv7 keyed on (notificationId, marketplaceId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."eventTime" IS 'Notification EventTime';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."merchantId" IS 'Seller id from Payload.SellerId';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."sku" IS 'Seller SKU from Payload.SKU';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."fnsku" IS 'Fulfillment network SKU from Payload.FNSKU';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."asin" IS 'ASIN from Payload.ASIN';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."marketplaceId" IS 'Marketplace id from the FulfillmentInventoryByMarketplace entry';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."notificationVersion" IS 'SP-API NotificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."payloadVersion" IS 'SP-API PayloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_FBA_INVENTORY_AVAILABILITY_CHANGES"."payload" IS 'FulfillmentInventoryByMarketplace entry with MarketplaceId stripped (JSONB)';
```

<a id="relation-32"></a>

### table: `amzspstream_REPORT_PROCESSING_FINISHED`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_REPORT_PROCESSING_FINISHED" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"reportId" TEXT NOT NULL,
	"reportType" TEXT NOT NULL,
	"processingStatus" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."eventTime" IS 'Notification eventTime';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."merchantId" IS 'Seller id from reportProcessingFinishedNotification.sellerId';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."reportId" IS 'Report id from reportProcessingFinishedNotification.reportId';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."reportType" IS 'Report type from reportProcessingFinishedNotification.reportType';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."processingStatus" IS 'Processing status from reportProcessingFinishedNotification.processingStatus';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."notificationVersion" IS 'SP-API notificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."payloadVersion" IS 'SP-API payloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_REPORT_PROCESSING_FINISHED"."payload" IS 'Unwrapped reportProcessingFinishedNotification with promoted keys stripped (JSONB)';
```

<a id="relation-33"></a>

### table: `amzspstream_FEED_PROCESSING_FINISHED`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_FEED_PROCESSING_FINISHED" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"feedId" TEXT NOT NULL,
	"feedType" TEXT NOT NULL,
	"processingStatus" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."eventTime" IS 'Notification eventTime';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."merchantId" IS 'Seller id from feedProcessingFinishedNotification.sellerId';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."feedId" IS 'Feed id from feedProcessingFinishedNotification.feedId';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."feedType" IS 'Feed type from feedProcessingFinishedNotification.feedType';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."processingStatus" IS 'Processing status from feedProcessingFinishedNotification.processingStatus';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."notificationVersion" IS 'SP-API notificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."payloadVersion" IS 'SP-API payloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_FEED_PROCESSING_FINISHED"."payload" IS 'Unwrapped feedProcessingFinishedNotification with sellerId/feedId/feedType/processingStatus stripped (JSONB)';
```

<a id="relation-34"></a>

### table: `amzspstream_PRICING_HEALTH`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_PRICING_HEALTH" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"issueType" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."eventTime" IS 'Notification EventTime';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."merchantId" IS 'Seller id from payload.sellerId';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."issueType" IS 'Pricing health issue type from payload.issueType';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."marketplaceId" IS 'Marketplace id from payload.offerChangeTrigger.marketplaceId';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."asin" IS 'ASIN from payload.offerChangeTrigger.asin';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."notificationVersion" IS 'SP-API NotificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."payloadVersion" IS 'SP-API PayloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_PRICING_HEALTH"."payload" IS 'Unwrapped payload with sellerId/issueType stripped (JSONB)';
```

<a id="relation-35"></a>

### table: `amzspstream_FULFILLMENT_ORDER_STATUS`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"sellerFulfillmentOrderId" TEXT NOT NULL,
	"eventType" TEXT NOT NULL,
	"fulfillmentOrderStatus" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."eventTime" IS 'Notification EventTime';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."merchantId" IS 'Seller id from FulfillmentOrderStatusNotification.SellerId';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."sellerFulfillmentOrderId" IS 'Seller fulfillment order id from FulfillmentOrderStatusNotification.SellerFulfillmentOrderId';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."eventType" IS 'Event type from FulfillmentOrderStatusNotification.EventType';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."fulfillmentOrderStatus" IS 'Fulfillment order status from FulfillmentOrderStatusNotification.FulfillmentOrderStatus';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."notificationVersion" IS 'SP-API NotificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."payloadVersion" IS 'SP-API PayloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_FULFILLMENT_ORDER_STATUS"."payload" IS 'Unwrapped FulfillmentOrderStatusNotification with the four promoted keys stripped (JSONB)';
```

<a id="relation-36"></a>

### table: `amzspstream_FEE_PROMOTION`

Category: Amazon notifications

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzspstream_FEE_PROMOTION" (
	"id" TEXT PRIMARY KEY,
	"eventTime" TIMESTAMPTZ NOT NULL,
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"feePromotionType" TEXT NOT NULL,
	"receivedAt" TIMESTAMPTZ NOT NULL,
	"notificationVersion" TEXT NOT NULL,
	"payloadVersion" TEXT NOT NULL,
	"payload" JSONB NOT NULL
);
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."id" IS 'Deterministic UUIDv7 = generateDeterministicUuidV7(eventTime, notificationId) (primary key)';
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."eventTime" IS 'Notification EventTime';
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."merchantId" IS 'Merchant id from FeePromotionNotification.MerchantId';
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."marketplaceId" IS 'Marketplace id from FeePromotionNotification.MarketplaceId';
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."feePromotionType" IS 'Fee promotion type from FeePromotionNotification.FeePromotionType';
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."receivedAt" IS 'When the consumer processed the message';
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."notificationVersion" IS 'SP-API NotificationVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."payloadVersion" IS 'SP-API PayloadVersion from the envelope';
COMMENT ON COLUMN "workspace"."amzspstream_FEE_PROMOTION"."payload" IS 'Unwrapped FeePromotionNotification with MerchantId/MarketplaceId/FeePromotionType stripped (JSONB)';
```

<a id="relation-37"></a>

### table: `amzreport_ALL_ORDERS`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_ALL_ORDERS" (
	"merchant_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"amazon_order_id" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"localdate" DATE,
	"merchant_order_id" TEXT,
	"purchase_date" TEXT,
	"last_updated_date" TEXT,
	"order_status" TEXT,
	"fulfillment_channel" TEXT,
	"sales_channel" TEXT,
	"order_channel" TEXT,
	"ship_service_level" TEXT,
	"asin" TEXT,
	"item_status" TEXT,
	"quantity" NUMERIC,
	"quantity_shipped" NUMERIC,
	"quantity_unshipped" NUMERIC,
	"currency" TEXT,
	"item_price" NUMERIC,
	"item_tax" NUMERIC,
	"shipping_price" NUMERIC,
	"shipping_tax" NUMERIC,
	"gift_wrap_price" NUMERIC,
	"gift_wrap_tax" NUMERIC,
	"item_promotion_discount" NUMERIC,
	"ship_promotion_discount" NUMERIC,
	"ship_city" TEXT,
	"ship_state" TEXT,
	"ship_postal_code" TEXT,
	"ship_country" TEXT,
	"promotion_ids" TEXT,
	"is_business_order" BOOLEAN,
	"purchase_order_number" TEXT,
	"price_designation" TEXT,
	"is_amazon_invoiced" BOOLEAN,
	"vat_exclusive_item_price" NUMERIC,
	"vat_exclusive_shipping_price" NUMERIC,
	"vat_exclusive_giftwrap_price" NUMERIC,
	"extras" JSONB,
	PRIMARY KEY ("merchant_id", "marketplace_id", "amazon_order_id", "sku")
);
CREATE INDEX IF NOT EXISTS "amzreport_ALL_ORDERS__merchant_id__marketplace_id__localdate" ON "workspace"."amzreport_ALL_ORDERS" USING BTREE ("merchant_id", "marketplace_id", "localdate");
```

<a id="relation-38"></a>

### table: `amzreport_COUPON_PERFORMANCE`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_COUPON_PERFORMANCE" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"couponId" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"startDateTime" TIMESTAMPTZ NOT NULL,
	"endDateTime" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	"asins" TEXT[] NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "couponId")
);
```

<a id="relation-39"></a>

### table: `amzreport_FBA_CUSTOMER_RETURNS`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_FBA_CUSTOMER_RETURNS" (
	"merchant_id" TEXT NOT NULL,
	"return_date" TIMESTAMPTZ NOT NULL,
	"order_id" TEXT NOT NULL,
	"fnsku" TEXT NOT NULL,
	"index" INTEGER NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"sku" TEXT,
	"asin" TEXT,
	"quantity" NUMERIC,
	"fulfillment_center_id" TEXT,
	"detailed_disposition" TEXT,
	"reason" TEXT,
	"status" TEXT,
	"license_plate_number" TEXT,
	"customer_comments" TEXT,
	PRIMARY KEY ("merchant_id", "return_date", "order_id", "fnsku", "index")
);
```

<a id="relation-40"></a>

### table: `amzreport_FBA_FEE_PREVIEW`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_FBA_FEE_PREVIEW" (
	"merchant_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"deleted_at" TIMESTAMPTZ,
	"fnsku" TEXT,
	"asin" TEXT,
	"product_group" TEXT,
	"fulfilled_by" TEXT,
	"your_price" NUMERIC,
	"sales_price" NUMERIC,
	"longest_side" NUMERIC,
	"median_side" NUMERIC,
	"shortest_side" NUMERIC,
	"length_and_girth" NUMERIC,
	"unit_of_dimension" TEXT,
	"item_package_weight" NUMERIC,
	"unit_of_weight" TEXT,
	"currency" TEXT,
	"estimated_referral_fee_per_unit" NUMERIC,
	"estimated_variable_closing_fee" NUMERIC,
	"estimated_order_handling_fee_per_order" NUMERIC,
	"estimated_pick_pack_fee_per_unit" NUMERIC,
	"estimated_weight_handling_fee_per_unit" NUMERIC,
	"expected_fulfillment_fee_per_unit" NUMERIC,
	"extras" JSONB,
	PRIMARY KEY ("merchant_id", "marketplace_id", "sku")
);
```

<a id="relation-41"></a>

### table: `amzreport_FBA_INVENTORY_PLANNING`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_FBA_INVENTORY_PLANNING" (
	"merchant_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"deleted_at" TIMESTAMPTZ,
	"snapshot_date" DATE NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("merchant_id", "marketplace_id", "sku")
);
```

<a id="relation-42"></a>

### table: `amzreport_FBA_REIMBURSEMENTS`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_FBA_REIMBURSEMENTS" (
	"merchant_id" TEXT NOT NULL,
	"reimbursement_id" TEXT NOT NULL,
	"index" INTEGER NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"approval_date" TIMESTAMPTZ,
	"case_id" TEXT,
	"amazon_order_id" TEXT,
	"reason" TEXT,
	"sku" TEXT,
	"fnsku" TEXT,
	"asin" TEXT,
	"condition" TEXT,
	"currency_unit" TEXT,
	"amount_total" NUMERIC,
	"quantity_reimbursed_cash" NUMERIC,
	"quantity_reimbursed_inventory" NUMERIC,
	"original_reimbursement_id" TEXT,
	"original_reimbursement_type" TEXT,
	PRIMARY KEY ("merchant_id", "reimbursement_id", "index")
);
```

<a id="relation-43"></a>

### table: `amzreport_FBA_REMOVAL_ORDER_DETAIL`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_FBA_REMOVAL_ORDER_DETAIL" (
	"merchant_id" TEXT NOT NULL,
	"request_time" TIMESTAMPTZ NOT NULL,
	"order_id" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"index" INTEGER NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"fnsku" TEXT,
	"order_source" TEXT,
	"order_type" TEXT,
	"order_status" TEXT,
	"last_updated_date" TIMESTAMPTZ,
	"disposition" TEXT,
	"requested_quantity" NUMERIC,
	"cancelled_quantity" NUMERIC,
	"disposed_quantity" NUMERIC,
	"shipped_quantity" NUMERIC,
	"in_process_quantity" NUMERIC,
	"removal_fee" NUMERIC,
	"currency" TEXT,
	"extras" JSONB,
	PRIMARY KEY ("merchant_id", "request_time", "order_id", "sku", "index")
);
```

<a id="relation-44"></a>

### table: `amzreport_FBA_REMOVAL_SHIPMENT_DETAIL`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_FBA_REMOVAL_SHIPMENT_DETAIL" (
	"merchant_id" TEXT NOT NULL,
	"request_time" TIMESTAMPTZ NOT NULL,
	"order_id" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"index" INTEGER NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"fnsku" TEXT,
	"shipment_date" TIMESTAMPTZ,
	"disposition" TEXT,
	"shipped_quantity" NUMERIC,
	"carrier" TEXT,
	"tracking_number" TEXT,
	"removal_order_type" TEXT,
	PRIMARY KEY ("merchant_id", "request_time", "order_id", "sku", "index")
);
```

<a id="relation-45"></a>

### table: `amzreport_FBA_STORAGE_FEE`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_FBA_STORAGE_FEE" (
	"merchant_id" TEXT NOT NULL,
	"country_code" TEXT NOT NULL,
	"month_of_charge" TEXT NOT NULL,
	"fnsku" TEXT NOT NULL,
	"fulfillment_center" TEXT NOT NULL,
	"index" INTEGER NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"asin" TEXT,
	"longest_side" NUMERIC,
	"median_side" NUMERIC,
	"shortest_side" NUMERIC,
	"measurement_units" TEXT,
	"weight" NUMERIC,
	"weight_units" TEXT,
	"item_volume" NUMERIC,
	"volume_units" TEXT,
	"average_quantity_on_hand" NUMERIC,
	"average_quantity_pending_removal" NUMERIC,
	"currency" TEXT,
	"surcharge_age_of_inventory" NUMERIC,
	"quantity_with_long_term_storage_fee_charge" NUMERIC,
	"per_unit_volume" NUMERIC,
	"extras" JSONB,
	PRIMARY KEY ("merchant_id", "country_code", "month_of_charge", "fnsku", "fulfillment_center", "index")
);
```

<a id="relation-46"></a>

### table: `amzreport_LEDGER_DETAIL`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_LEDGER_DETAIL" (
	"merchant_id" TEXT NOT NULL,
	"date" DATE NOT NULL,
	"fnsku" TEXT NOT NULL,
	"event_type" TEXT NOT NULL,
	"index" INTEGER NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"asin" TEXT,
	"sku" TEXT,
	"reference_id" TEXT,
	"quantity" NUMERIC,
	"fulfillment_center" TEXT,
	"disposition" TEXT,
	"reason" TEXT,
	"country" TEXT,
	"reconciled_quantity" NUMERIC,
	"unreconciled_quantity" NUMERIC,
	"date_and_time" TIMESTAMPTZ,
	"extras" JSONB,
	PRIMARY KEY ("merchant_id", "date", "fnsku", "event_type", "index")
);
```

<a id="relation-47"></a>

### table: `amzreport_LEDGER_SUMMARY`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_LEDGER_SUMMARY" (
	"merchant_id" TEXT NOT NULL,
	"time_unit" TEXT NOT NULL,
	"date_first" DATE NOT NULL,
	"location_level" TEXT NOT NULL,
	"location" TEXT NOT NULL,
	"fnsku" TEXT NOT NULL,
	"disposition" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"asin" TEXT,
	"sku" TEXT,
	"starting_warehouse_balance" NUMERIC,
	"in_transit_between_warehouses" NUMERIC,
	"receipts" NUMERIC,
	"customer_shipments" NUMERIC,
	"customer_returns" NUMERIC,
	"vendor_returns" NUMERIC,
	"warehouse_transfer_in_out" NUMERIC,
	"found" NUMERIC,
	"lost" NUMERIC,
	"damaged" NUMERIC,
	"disposed" NUMERIC,
	"other_events" NUMERIC,
	"unknown_events" NUMERIC,
	"extras" JSONB,
	PRIMARY KEY ("merchant_id", "time_unit", "date_first", "location_level", "location", "fnsku", "disposition")
);
```

<a id="relation-48"></a>

### table: `amzreport_MERCHANT_LISTINGS_ALL`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_MERCHANT_LISTINGS_ALL" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"sellerSku" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"deletedAt" TIMESTAMPTZ,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "sellerSku")
);
CREATE INDEX IF NOT EXISTS "amzreport_MERCHANT_LISTINGS_ALL__updatedAt" ON "workspace"."amzreport_MERCHANT_LISTINGS_ALL" ("updatedAt");
```

<a id="relation-49"></a>

### table: `amzreport_OPEN_LISTINGS`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_OPEN_LISTINGS" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"sellerSku" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"deletedAt" TIMESTAMPTZ,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "sellerSku")
);
CREATE INDEX IF NOT EXISTS "amzreport_OPEN_LISTINGS__updatedAt" ON "workspace"."amzreport_OPEN_LISTINGS" ("updatedAt");
```

<a id="relation-50"></a>

### table: `amzreport_PROMOTION_PERFORMANCE`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_PROMOTION_PERFORMANCE" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"promotionId" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"promotionName" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"status" TEXT NOT NULL,
	"glanceViews" INTEGER NOT NULL,
	"unitsSold" INTEGER NOT NULL,
	"revenue" NUMERIC NOT NULL,
	"revenueCurrencyCode" TEXT NOT NULL,
	"startDateTime" TIMESTAMPTZ NOT NULL,
	"endDateTime" TIMESTAMPTZ NOT NULL,
	"createdDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"includedProducts" JSONB NOT NULL,
	"asins" TEXT[] NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "promotionId")
);
```

<a id="relation-51"></a>

### table: `amzreport_SALES_AND_TRAFFIC__skuByDay`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_SALES_AND_TRAFFIC__skuByDay" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"date" DATE NOT NULL,
	"sku" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"parentAsin" TEXT NOT NULL,
	"childAsin" TEXT NOT NULL,
	"sales" JSONB NOT NULL,
	"traffic" JSONB NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "date", "sku")
);
CREATE INDEX IF NOT EXISTS "amzreport_sales_traffic_skuByDay__childAsin_date" ON "workspace"."amzreport_SALES_AND_TRAFFIC__skuByDay" ("childAsin", "date");
```

<a id="relation-52"></a>

### table: `amzreport_SALES_AND_TRAFFIC__store`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_SALES_AND_TRAFFIC__store" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"dateGranularity" TEXT NOT NULL,
	"date" DATE NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"sales" JSONB NOT NULL,
	"traffic" JSONB NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "dateGranularity", "date")
);
```

<a id="relation-53"></a>

### table: `amzreport_SEARCH_CATALOG_PERFORMANCE`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_SEARCH_CATALOG_PERFORMANCE" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"timeUnit" TEXT NOT NULL,
	"dateFirst" DATE NOT NULL,
	"dateLast" DATE NOT NULL,
	"asin" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"impressionData" JSONB NOT NULL,
	"clickData" JSONB NOT NULL,
	"cartAddData" JSONB NOT NULL,
	"purchaseData" JSONB NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "timeUnit", "dateFirst", "asin")
);
```

<a id="relation-54"></a>

### table: `amzreport_SEARCH_QUERY_PERFORMANCE`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_SEARCH_QUERY_PERFORMANCE" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"timeUnit" TEXT NOT NULL,
	"dateFirst" DATE NOT NULL,
	"dateLast" DATE NOT NULL,
	"asin" TEXT NOT NULL,
	"searchQuery" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"searchQueryScore" INTEGER NOT NULL,
	"searchQueryVolume" INTEGER NOT NULL,
	"impressionData" JSONB NOT NULL,
	"clickData" JSONB NOT NULL,
	"cartAddData" JSONB NOT NULL,
	"purchaseData" JSONB NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "timeUnit", "dateFirst", "asin", "searchQuery")
);
```

<a id="relation-55"></a>

### table: `amzreport_SETTLEMENT_V2`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_SETTLEMENT_V2" (
	"merchant_id" TEXT NOT NULL,
	"settlement_id" TEXT NOT NULL,
	"index" INTEGER NOT NULL,
	"transaction_type" TEXT,
	"order_id" TEXT,
	"merchant_order_id" TEXT,
	"adjustment_id" TEXT,
	"shipment_id" TEXT,
	"marketplace_name" TEXT,
	"amount_type" TEXT,
	"amount_description" TEXT,
	"amount" NUMERIC,
	"fulfillment_id" TEXT,
	"posted_date_time" TIMESTAMPTZ,
	"order_item_code" TEXT,
	"merchant_order_item_id" TEXT,
	"merchant_adjustment_item_id" TEXT,
	"sku" TEXT,
	"quantity_purchased" INTEGER,
	"promotion_id" TEXT,
	PRIMARY KEY ("merchant_id", "settlement_id", "index")
);
CREATE INDEX IF NOT EXISTS "amzreport_SETTLEMENT_V2__posted_date_time" ON "workspace"."amzreport_SETTLEMENT_V2" USING BRIN ("posted_date_time");
CREATE INDEX IF NOT EXISTS "amzreport_SETTLEMENT_V2__merchant_id__order_id__sku" ON "workspace"."amzreport_SETTLEMENT_V2" ("merchant_id", "order_id", "sku");
```

<a id="relation-56"></a>

### table: `amzreport_SETTLEMENT_V2__summary`

Category: Amazon reports

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzreport_SETTLEMENT_V2__summary" (
	"merchant_id" TEXT NOT NULL,
	"settlement_id" TEXT NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"settlement_start_date" TIMESTAMPTZ NOT NULL,
	"settlement_end_date" TIMESTAMPTZ NOT NULL,
	"deposit_date" TIMESTAMPTZ NOT NULL,
	"total_amount" NUMERIC NOT NULL,
	"currency" TEXT NOT NULL,
	PRIMARY KEY ("merchant_id", "settlement_id")
);
```

<a id="relation-57"></a>

### table: `amzadapi_eligibility_v1__program`

Category: Amazon Ads API

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzadapi_eligibility_v1__program" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"program" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"deletedAt" TIMESTAMPTZ,
	"eligible" BOOLEAN NOT NULL,
	"reasons" JSONB,
	PRIMARY KEY ("merchantId", "marketplaceId", "program")
);
COMMENT ON COLUMN "workspace"."amzadapi_eligibility_v1__program"."merchantId" IS 'Amazon merchant/seller ID';
COMMENT ON COLUMN "workspace"."amzadapi_eligibility_v1__program"."marketplaceId" IS 'Amazon marketplace ID (from API response)';
COMMENT ON COLUMN "workspace"."amzadapi_eligibility_v1__program"."program" IS 'Ad program identifier (e.g., SP, SB, SD, DTC, MAAS, SPOT, RAS)';
COMMENT ON COLUMN "workspace"."amzadapi_eligibility_v1__program"."createdAt" IS 'When this eligibility record was first created';
COMMENT ON COLUMN "workspace"."amzadapi_eligibility_v1__program"."updatedAt" IS 'When this eligibility record was last updated';
COMMENT ON COLUMN "workspace"."amzadapi_eligibility_v1__program"."deletedAt" IS 'When this program was soft-deleted (null if active)';
COMMENT ON COLUMN "workspace"."amzadapi_eligibility_v1__program"."eligible" IS 'Whether the merchant is eligible for this program';
COMMENT ON COLUMN "workspace"."amzadapi_eligibility_v1__program"."reasons" IS 'JSON array of {code, description, level} explaining eligibility status';
```

<a id="relation-58"></a>

### table: `amzadapi_exports_v1__ad`

Category: Amazon Ads API

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzadapi_exports_v1__ad" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"adId" TEXT NOT NULL,
	"creationDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"adGroupId" TEXT NOT NULL,
	"campaignId" TEXT NOT NULL,
	"adProduct" TEXT NOT NULL,
	"state" TEXT NOT NULL,
	"adType" TEXT NOT NULL,
	"creative" JSONB NOT NULL,
	"deliveryStatus" TEXT NOT NULL,
	"deliveryReasons" JSONB,
	"adVersionId" TEXT,
	"name" TEXT,
	PRIMARY KEY ("merchantId", "marketplaceId", "adId")
);
CREATE INDEX IF NOT EXISTS "amzadapi_exports_v1__ad__campaign_not_delivering" ON "workspace"."amzadapi_exports_v1__ad" ("merchantId", "marketplaceId", "campaignId") WHERE state = 'ENABLED' AND "deliveryStatus" = 'NOT_DELIVERING';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."merchantId" IS 'Amazon merchant ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."marketplaceId" IS 'Amazon marketplace ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."adId" IS 'Amazon advertising ad ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."creationDateTime" IS 'Ad creation timestamp from Amazon';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."lastUpdatedDateTime" IS 'Ad last updated timestamp from Amazon';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."adGroupId" IS 'Amazon advertising ad group ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."campaignId" IS 'Amazon advertising campaign ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."adProduct" IS 'Ad product type: SPONSORED_DISPLAY, SPONSORED_BRANDS, SPONSORED_PRODUCTS';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."state" IS 'Ad state: ENABLED, PAUSED';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."adType" IS 'Ad type: PRODUCT_AD, VIDEO, BRAND_VIDEO, PRODUCT_COLLECTION';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."creative" IS 'Creative configuration: products, videos, customImages, brandLogo, landingPage, headline, brandName (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."deliveryStatus" IS 'Delivery status: NOT_DELIVERING, DELIVERING';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."deliveryReasons" IS 'Delivery reasons array (e.g., CAMPAIGN_PAUSED) (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."adVersionId" IS 'Ad version ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__ad"."name" IS 'Ad name (often ASIN value)';
```

<a id="relation-59"></a>

### table: `amzadapi_exports_v1__adgroup`

Category: Amazon Ads API

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzadapi_exports_v1__adgroup" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"adGroupId" TEXT NOT NULL,
	"creationDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"campaignId" TEXT NOT NULL,
	"adProduct" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"state" TEXT NOT NULL,
	"deliveryStatus" TEXT NOT NULL,
	"bid" JSONB,
	"deliveryReasons" JSONB,
	"creativeType" TEXT,
	"optimization" JSONB,
	PRIMARY KEY ("merchantId", "marketplaceId", "adGroupId")
);
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."merchantId" IS 'Amazon merchant ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."marketplaceId" IS 'Amazon marketplace ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."adGroupId" IS 'Amazon advertising ad group ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."creationDateTime" IS 'Ad group creation timestamp from Amazon';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."lastUpdatedDateTime" IS 'Ad group last updated timestamp from Amazon';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."campaignId" IS 'Amazon advertising campaign ID that this ad group belongs to';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."adProduct" IS 'Ad product type: SPONSORED_DISPLAY, SPONSORED_BRANDS, SPONSORED_PRODUCTS';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."name" IS 'Ad group name';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."state" IS 'Ad group state: PAUSED, ENABLED';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."deliveryStatus" IS 'Delivery status: NOT_DELIVERING, DELIVERING';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."bid" IS 'Bid configuration: defaultBid, currencyCode (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."deliveryReasons" IS 'Delivery reasons array (e.g., CAMPAIGN_PAUSED) (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."creativeType" IS 'Creative type: IMAGE, VIDEO';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__adgroup"."optimization" IS 'Optimization settings: bidStrategy, goalSetting, autoPlacementBidAdjustments (JSONB)';
```

<a id="relation-60"></a>

### table: `amzadapi_exports_v1__campaign`

Category: Amazon Ads API

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzadapi_exports_v1__campaign" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"campaignId" TEXT NOT NULL,
	"creationDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"adProduct" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"startDate" DATE NOT NULL,
	"state" TEXT NOT NULL,
	"deliveryStatus" TEXT NOT NULL,
	"budgetCaps" JSONB NOT NULL,
	"optimization" JSONB,
	"targetingSettings" TEXT,
	"deliveryReasons" JSONB,
	"tags" JSONB,
	"portfolioId" TEXT,
	"endDate" DATE,
	"costType" TEXT,
	"isMultiAdGroupsEnabled" BOOLEAN,
	"brandEntityId" TEXT,
	PRIMARY KEY ("merchantId", "marketplaceId", "campaignId")
);
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."merchantId" IS 'Amazon merchant ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."marketplaceId" IS 'Amazon marketplace ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."campaignId" IS 'Amazon advertising campaign ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."creationDateTime" IS 'Campaign creation timestamp from Amazon';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."lastUpdatedDateTime" IS 'Campaign last updated timestamp from Amazon';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."adProduct" IS 'Ad product type: SPONSORED_DISPLAY, SPONSORED_BRANDS, SPONSORED_PRODUCTS';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."name" IS 'Campaign name';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."startDate" IS 'Campaign start date (YYYY-MM-DD format)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."state" IS 'Campaign state: PAUSED, ENABLED';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."deliveryStatus" IS 'Delivery status: NOT_DELIVERING, DELIVERING';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."budgetCaps" IS 'Budget caps configuration (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."optimization" IS 'Optimization settings: bidStrategy, goalSetting, autoPlacementBidAdjustments (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."targetingSettings" IS 'Targeting settings: T00030, T00020, AUTO';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."deliveryReasons" IS 'Delivery reasons array (e.g., CAMPAIGN_PAUSED) (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."tags" IS 'Campaign tags array (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."portfolioId" IS 'Portfolio ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."endDate" IS 'Campaign end date (YYYY-MM-DD format)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."costType" IS 'Cost type: CPC';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."isMultiAdGroupsEnabled" IS 'Whether multi ad groups is enabled';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__campaign"."brandEntityId" IS 'Brand entity ID';
```

<a id="relation-61"></a>

### table: `amzadapi_exports_v1__target`

Category: Amazon Ads API

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzadapi_exports_v1__target" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"targetId" TEXT NOT NULL,
	"creationDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"campaignId" TEXT NOT NULL,
	"adProduct" TEXT NOT NULL,
	"state" TEXT NOT NULL,
	"negative" BOOLEAN NOT NULL,
	"targetDetails" JSONB NOT NULL,
	"targetType" TEXT NOT NULL,
	"targetLevel" TEXT NOT NULL,
	"deliveryStatus" TEXT NOT NULL,
	"deliveryReasons" JSONB,
	"adGroupId" TEXT,
	"bid" JSONB,
	PRIMARY KEY ("merchantId", "marketplaceId", "targetId")
);
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."merchantId" IS 'Amazon merchant ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."marketplaceId" IS 'Amazon marketplace ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."targetId" IS 'Amazon advertising target ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."creationDateTime" IS 'Target creation timestamp from Amazon';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."lastUpdatedDateTime" IS 'Target last updated timestamp from Amazon';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."campaignId" IS 'Amazon advertising campaign ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."adProduct" IS 'Ad product type: SPONSORED_PRODUCTS, SPONSORED_DISPLAY, SPONSORED_BRANDS';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."state" IS 'Target state: ENABLED, PAUSED';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."negative" IS 'Whether this is a negative target';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."targetDetails" IS 'Target details configuration (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."targetType" IS 'Target type: AUTO, KEYWORD, PRODUCT, PRODUCT_AUDIENCE, PRODUCT_CATEGORY';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."targetLevel" IS 'Target level: AD_GROUP, CAMPAIGN';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."deliveryStatus" IS 'Delivery status: DELIVERING, NOT_DELIVERING';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."deliveryReasons" IS 'Delivery reasons array (e.g., CAMPAIGN_PAUSED) (JSONB)';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."adGroupId" IS 'Amazon advertising ad group ID';
COMMENT ON COLUMN "workspace"."amzadapi_exports_v1__target"."bid" IS 'Bid configuration: bid amount and currency code (JSONB)';
```

<a id="relation-62"></a>

### table: `amzadapi_reports_v1__product01__byDay`

Category: Amazon Ads API

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzadapi_reports_v1__product01__byDay" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"date" DATE NOT NULL,
	"adProduct" TEXT NOT NULL,
	"campaignId" TEXT NOT NULL,
	"adGroupId" TEXT NOT NULL,
	"adId" TEXT NOT NULL,
	"advertisedProductId" TEXT NOT NULL,
	"advertisedProductSku" TEXT NOT NULL,
	"convertedProductId" TEXT NOT NULL,
	"convertedProductMarketplace" TEXT NOT NULL,
	"productRelevance" TEXT NOT NULL,
	"campaignCountry" TEXT NOT NULL,
	"budgetCurrency" TEXT NOT NULL,
	"convertedProductParentProductId" TEXT NOT NULL,
	"purchases" INTEGER NOT NULL,
	"purchasesFromClicks" INTEGER NOT NULL,
	"purchasesFromViews" INTEGER NOT NULL,
	"purchasesPromoted" INTEGER NOT NULL,
	"purchasesFromClicksPromoted" INTEGER NOT NULL,
	"purchasesFromViewsPromoted" INTEGER NOT NULL,
	"purchasesHalo" INTEGER NOT NULL,
	"purchasesFromClicksHalo" INTEGER NOT NULL,
	"purchasesFromViewsHalo" INTEGER NOT NULL,
	"sales" NUMERIC NOT NULL,
	"salesFromClicks" NUMERIC NOT NULL,
	"salesFromViews" NUMERIC NOT NULL,
	"salesPromoted" NUMERIC NOT NULL,
	"salesFromClicksPromoted" NUMERIC NOT NULL,
	"salesFromViewsPromoted" NUMERIC NOT NULL,
	"salesHalo" NUMERIC NOT NULL,
	"unitsSold" INTEGER NOT NULL,
	"unitsSoldFromClicks" INTEGER NOT NULL,
	"unitsSoldFromViews" INTEGER NOT NULL,
	"unitsSoldPromoted" INTEGER NOT NULL,
	"unitsSoldFromClicksPromoted" INTEGER NOT NULL,
	"unitsSoldFromViewsPromoted" INTEGER NOT NULL,
	"unitsSoldHalo" INTEGER NOT NULL,
	"newToBrandPurchases" INTEGER NOT NULL,
	"newToBrandPurchasesFromClicks" INTEGER NOT NULL,
	"newToBrandPurchasesFromViews" INTEGER NOT NULL,
	"newToBrandPurchasesPromoted" INTEGER NOT NULL,
	"newToBrandPurchasesHalo" INTEGER NOT NULL,
	"newToBrandSales" NUMERIC NOT NULL,
	"newToBrandSalesPromoted" NUMERIC NOT NULL,
	"newToBrandSalesHalo" NUMERIC NOT NULL,
	"newToBrandUnitsSold" INTEGER NOT NULL,
	"newToBrandUnitsSoldPromoted" INTEGER NOT NULL,
	"newToBrandUnitsSoldHalo" INTEGER NOT NULL,
	"detailPageViews" INTEGER NOT NULL,
	"detailPageViewsFromClicks" INTEGER NOT NULL,
	"detailPageViewsFromViews" INTEGER NOT NULL,
	"detailPageViewsPromoted" INTEGER NOT NULL,
	"detailPageViewsHalo" INTEGER NOT NULL,
	"addToCart" INTEGER NOT NULL,
	"addToCartFromClicks" INTEGER NOT NULL,
	"addToCartFromViews" INTEGER NOT NULL,
	"addToCartPromoted" INTEGER NOT NULL,
	"brandedSearches" INTEGER NOT NULL,
	"brandedSearchesFromClicks" INTEGER NOT NULL,
	"brandedSearchesFromViews" INTEGER NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "date", "adProduct", "campaignId", "adGroupId", "adId", "advertisedProductId", "advertisedProductSku", "convertedProductId", "convertedProductMarketplace", "productRelevance")
);
```

<a id="relation-63"></a>

### table: `amzadapi_reports_v1__search_asin_placement__byDay`

Category: Amazon Ads API

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzadapi_reports_v1__search_asin_placement__byDay" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"date" DATE NOT NULL,
	"adProduct" TEXT NOT NULL,
	"campaignId" TEXT NOT NULL,
	"adGroupId" TEXT NOT NULL,
	"adId" TEXT NOT NULL,
	"advertisedProductId" TEXT NOT NULL,
	"advertisedProductSku" TEXT NOT NULL,
	"targetMatchType" TEXT NOT NULL,
	"target" TEXT NOT NULL,
	"searchTerm" TEXT NOT NULL,
	"placementClassification" TEXT NOT NULL,
	"budgetCurrency" TEXT NOT NULL,
	"impressions" INTEGER NOT NULL,
	"clicks" INTEGER NOT NULL,
	"viewableImpressions" INTEGER NOT NULL,
	"purchases" INTEGER NOT NULL,
	"purchasesFromClicks" INTEGER NOT NULL,
	"purchasesFromViews" INTEGER NOT NULL,
	"purchasesPromoted" INTEGER NOT NULL,
	"purchasesFromClicksPromoted" INTEGER NOT NULL,
	"purchasesFromViewsPromoted" INTEGER NOT NULL,
	"purchasesHalo" INTEGER NOT NULL,
	"purchasesFromClicksHalo" INTEGER NOT NULL,
	"purchasesFromViewsHalo" INTEGER NOT NULL,
	"unitsSold" INTEGER NOT NULL,
	"unitsSoldFromClicks" INTEGER NOT NULL,
	"unitsSoldFromViews" INTEGER NOT NULL,
	"unitsSoldPromoted" INTEGER NOT NULL,
	"unitsSoldFromClicksPromoted" INTEGER NOT NULL,
	"unitsSoldFromViewsPromoted" INTEGER NOT NULL,
	"unitsSoldHalo" INTEGER NOT NULL,
	"unitsSoldFromClicksHalo" INTEGER NOT NULL,
	"unitsSoldFromViewsHalo" INTEGER NOT NULL,
	"newToBrandPurchases" INTEGER NOT NULL,
	"newToBrandPurchasesFromClicks" INTEGER NOT NULL,
	"newToBrandPurchasesFromViews" INTEGER NOT NULL,
	"newToBrandPurchasesPromoted" INTEGER NOT NULL,
	"newToBrandPurchasesHalo" INTEGER NOT NULL,
	"newToBrandUnitsSold" INTEGER NOT NULL,
	"newToBrandUnitsSoldFromClicks" INTEGER NOT NULL,
	"newToBrandUnitsSoldFromViews" INTEGER NOT NULL,
	"newToBrandUnitsSoldPromoted" INTEGER NOT NULL,
	"newToBrandUnitsSoldHalo" INTEGER NOT NULL,
	"detailPageViews" INTEGER NOT NULL,
	"detailPageViewsFromClicks" INTEGER NOT NULL,
	"detailPageViewsFromViews" INTEGER NOT NULL,
	"detailPageViewsPromoted" INTEGER NOT NULL,
	"detailPageViewsHalo" INTEGER NOT NULL,
	"addToCart" INTEGER NOT NULL,
	"addToCartFromClicks" INTEGER NOT NULL,
	"addToCartFromViews" INTEGER NOT NULL,
	"addToCartPromoted" INTEGER NOT NULL,
	"brandedSearches" INTEGER NOT NULL,
	"brandedSearchesFromClicks" INTEGER NOT NULL,
	"brandedSearchesFromViews" INTEGER NOT NULL,
	"totalCost" NUMERIC NOT NULL,
	"sales" NUMERIC NOT NULL,
	"salesFromClicks" NUMERIC NOT NULL,
	"salesFromViews" NUMERIC NOT NULL,
	"salesPromoted" NUMERIC NOT NULL,
	"salesFromClicksPromoted" NUMERIC NOT NULL,
	"salesFromViewsPromoted" NUMERIC NOT NULL,
	"salesHalo" NUMERIC NOT NULL,
	"salesFromClicksHalo" NUMERIC NOT NULL,
	"salesFromViewsHalo" NUMERIC NOT NULL,
	"newToBrandSales" NUMERIC NOT NULL,
	"newToBrandSalesFromClicks" NUMERIC NOT NULL,
	"newToBrandSalesFromViews" NUMERIC NOT NULL,
	"newToBrandSalesPromoted" NUMERIC NOT NULL,
	"newToBrandSalesHalo" NUMERIC NOT NULL,
	PRIMARY KEY ("merchantId", "marketplaceId", "date", "adProduct", "campaignId", "adGroupId", "adId", "advertisedProductId", "targetMatchType", "target", "searchTerm", "placementClassification")
);
CREATE INDEX IF NOT EXISTS "amzadapi_reports_v1__search_asin_placement__byDay__date_plus" ON "workspace"."amzadapi_reports_v1__search_asin_placement__byDay" ("date", "merchantId", "marketplaceId", "campaignId") INCLUDE ("impressions", "totalCost");
```

<a id="relation-64"></a>

### table: `amzms_v1__budget_usage`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__budget_usage" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"usage_updated_timestamp" TIMESTAMPTZ NOT NULL,
	"budget_scope_id" TEXT NOT NULL,
	"budget_scope_type" TEXT NOT NULL,
	"advertising_product_type" TEXT NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "usage_updated_timestamp", "budget_scope_id", "budget_scope_type", "advertising_product_type")
);
COMMENT ON COLUMN "workspace"."amzms_v1__budget_usage"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__budget_usage"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__budget_usage"."usage_updated_timestamp" IS 'Timestamp when budget usage was updated (from message)';
COMMENT ON COLUMN "workspace"."amzms_v1__budget_usage"."budget_scope_id" IS 'Budget scope identifier (campaign or portfolio id)';
COMMENT ON COLUMN "workspace"."amzms_v1__budget_usage"."budget_scope_type" IS 'Budget scope type: CAMPAIGN or PORTFOLIO';
COMMENT ON COLUMN "workspace"."amzms_v1__budget_usage"."advertising_product_type" IS 'Ad product (sp/sb/sd); empty string for portfolio scopes';
COMMENT ON COLUMN "workspace"."amzms_v1__budget_usage"."doc" IS 'Complete message payload as JSONB';
```

<a id="relation-65"></a>

### table: `amzms_v1__campaigns`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__campaigns" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"campaignId" TEXT NOT NULL,
	"version" INTEGER NOT NULL,
	"adProduct" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"state" TEXT NOT NULL,
	"creationDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "campaignId")
);
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."campaignId" IS 'Amazon advertising campaign ID';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."version" IS 'Monotonic per-entity snapshot version (newest wins)';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."adProduct" IS 'Ad product, e.g. SPONSORED_PRODUCTS';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."name" IS 'Campaign name';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."state" IS 'Campaign state (stream delivers ENABLED/PAUSED; ARCHIVE is silent)';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."creationDateTime" IS 'Entity creation timestamp (audit.creationDateTime)';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."lastUpdatedDateTime" IS 'Entity last-updated timestamp (audit.lastUpdatedDateTime)';
COMMENT ON COLUMN "workspace"."amzms_v1__campaigns"."doc" IS 'Complete event payload as JSONB (full entity snapshot)';
```

<a id="relation-66"></a>

### table: `amzms_v1__adgroups`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__adgroups" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"adGroupId" TEXT NOT NULL,
	"campaignId" TEXT NOT NULL,
	"version" INTEGER NOT NULL,
	"adProduct" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"state" TEXT NOT NULL,
	"creationDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "adGroupId")
);
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."adGroupId" IS 'Amazon advertising ad group ID';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."campaignId" IS 'Parent campaign ID';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."version" IS 'Monotonic per-entity snapshot version (newest wins)';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."adProduct" IS 'Ad product, e.g. SPONSORED_PRODUCTS';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."name" IS 'Ad group name';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."state" IS 'Ad group state (stream delivers ENABLED/PAUSED; ARCHIVE is silent)';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."creationDateTime" IS 'Entity creation timestamp (audit.creationDateTime)';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."lastUpdatedDateTime" IS 'Entity last-updated timestamp (audit.lastUpdatedDateTime)';
COMMENT ON COLUMN "workspace"."amzms_v1__adgroups"."doc" IS 'Complete event payload as JSONB (full entity snapshot)';
```

<a id="relation-67"></a>

### table: `amzms_v1__ads`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__ads" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"adId" TEXT NOT NULL,
	"adGroupId" TEXT NOT NULL,
	"campaignId" TEXT NOT NULL,
	"version" INTEGER NOT NULL,
	"adProduct" TEXT NOT NULL,
	"state" TEXT NOT NULL,
	"creationDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "adId")
);
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."adId" IS 'Amazon advertising ad ID';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."adGroupId" IS 'Parent ad group ID';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."campaignId" IS 'Parent campaign ID';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."version" IS 'Monotonic per-entity snapshot version (newest wins)';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."adProduct" IS 'Ad product, e.g. SPONSORED_PRODUCTS';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."state" IS 'Ad state (stream delivers ENABLED/PAUSED; ARCHIVE is silent)';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."creationDateTime" IS 'Entity creation timestamp (audit.creationDateTime)';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."lastUpdatedDateTime" IS 'Entity last-updated timestamp (audit.lastUpdatedDateTime)';
COMMENT ON COLUMN "workspace"."amzms_v1__ads"."doc" IS 'Complete event payload as JSONB (full entity snapshot)';
```

<a id="relation-68"></a>

### table: `amzms_v1__targets`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__targets" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"targetId" TEXT NOT NULL,
	"campaignId" TEXT NOT NULL,
	"adGroupId" TEXT,
	"version" INTEGER NOT NULL,
	"adProduct" TEXT NOT NULL,
	"targetType" TEXT NOT NULL,
	"negative" BOOLEAN NOT NULL,
	"state" TEXT NOT NULL,
	"creationDateTime" TIMESTAMPTZ NOT NULL,
	"lastUpdatedDateTime" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "targetId")
);
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."targetId" IS 'Amazon advertising target ID';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."campaignId" IS 'Parent campaign ID';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."adGroupId" IS 'Parent ad group ID (absent on campaign-level targets)';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."version" IS 'Monotonic per-entity snapshot version (newest wins)';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."adProduct" IS 'Ad product, e.g. SPONSORED_PRODUCTS';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."targetType" IS 'Target expression type, e.g. KeywordTarget / ProductCategoryTarget / AutoTarget';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."negative" IS 'Whether this is a negative target';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."state" IS 'Target state (stream delivers ENABLED/PAUSED; ARCHIVE is silent)';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."creationDateTime" IS 'Entity creation timestamp (audit.creationDateTime)';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."lastUpdatedDateTime" IS 'Entity last-updated timestamp (audit.lastUpdatedDateTime)';
COMMENT ON COLUMN "workspace"."amzms_v1__targets"."doc" IS 'Complete event payload as JSONB (full entity snapshot)';
```

<a id="relation-69"></a>

### table: `amzms_v1__sp_traffic`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__sp_traffic" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"time_window_start" TIMESTAMPTZ NOT NULL,
	"idempotency_id" TEXT NOT NULL,
	"campaign_id" TEXT,
	"ad_group_id" TEXT,
	"ad_id" TEXT,
	"keyword_id" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "time_window_start", "idempotency_id")
);
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."time_window_start" IS 'Start of the hourly aggregation window the metrics belong to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."idempotency_id" IS 'Per-stream event identity; corrections arrive as new ids';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."campaign_id" IS 'Campaign ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."ad_group_id" IS 'Ad group ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."ad_id" IS 'Ad ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."keyword_id" IS 'Keyword/targeting-expression ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_traffic"."doc" IS 'Complete event payload as JSONB (metrics live here)';
```

<a id="relation-70"></a>

### table: `amzms_v1__sp_conversion`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__sp_conversion" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"time_window_start" TIMESTAMPTZ NOT NULL,
	"idempotency_id" TEXT NOT NULL,
	"campaign_id" TEXT,
	"ad_group_id" TEXT,
	"ad_id" TEXT,
	"keyword_id" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "time_window_start", "idempotency_id")
);
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."time_window_start" IS 'Start of the hourly aggregation window the metrics belong to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."idempotency_id" IS 'Per-stream event identity; corrections arrive as new ids';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."campaign_id" IS 'Campaign ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."ad_group_id" IS 'Ad group ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."ad_id" IS 'Ad ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."keyword_id" IS 'Keyword/targeting-expression ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sp_conversion"."doc" IS 'Complete event payload as JSONB (metrics live here)';
```

<a id="relation-71"></a>

### table: `amzms_v1__sd_traffic`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__sd_traffic" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"time_window_start" TIMESTAMPTZ NOT NULL,
	"idempotency_id" TEXT NOT NULL,
	"campaign_id" TEXT,
	"ad_group_id" TEXT,
	"ad_id" TEXT,
	"target_id" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "time_window_start", "idempotency_id")
);
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."time_window_start" IS 'Start of the hourly aggregation window the metrics belong to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."idempotency_id" IS 'Per-stream event identity; corrections arrive as new ids';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."campaign_id" IS 'Campaign ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."ad_group_id" IS 'Ad group ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."ad_id" IS 'Ad ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."target_id" IS 'Targeting-expression ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_traffic"."doc" IS 'Complete event payload as JSONB (metrics live here)';
```

<a id="relation-72"></a>

### table: `amzms_v1__sd_conversion`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__sd_conversion" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"time_window_start" TIMESTAMPTZ NOT NULL,
	"idempotency_id" TEXT NOT NULL,
	"campaign_id" TEXT,
	"ad_group_id" TEXT,
	"ad_id" TEXT,
	"target_id" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "time_window_start", "idempotency_id")
);
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."time_window_start" IS 'Start of the hourly aggregation window the metrics belong to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."idempotency_id" IS 'Per-stream event identity; corrections arrive as new ids';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."campaign_id" IS 'Campaign ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."ad_group_id" IS 'Ad group ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."ad_id" IS 'Ad ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."target_id" IS 'Targeting-expression ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sd_conversion"."doc" IS 'Complete event payload as JSONB (metrics live here)';
```

<a id="relation-73"></a>

### table: `amzms_v1__sb_traffic`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__sb_traffic" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"time_window_start" TIMESTAMPTZ NOT NULL,
	"idempotency_id" TEXT NOT NULL,
	"campaign_id" TEXT,
	"ad_group_id" TEXT,
	"ad_id" TEXT,
	"keyword_id" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "time_window_start", "idempotency_id")
);
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."time_window_start" IS 'Start of the hourly aggregation window the metrics belong to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."idempotency_id" IS 'Per-stream event identity; corrections arrive as new ids';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."campaign_id" IS 'Campaign ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."ad_group_id" IS 'Ad group ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."ad_id" IS 'Ad ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."keyword_id" IS 'Keyword/targeting-expression ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_traffic"."doc" IS 'Complete event payload as JSONB (metrics live here)';
```

<a id="relation-74"></a>

### table: `amzms_v1__sb_conversion`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__sb_conversion" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"time_window_start" TIMESTAMPTZ NOT NULL,
	"idempotency_id" TEXT NOT NULL,
	"campaign_id" TEXT,
	"ad_group_id" TEXT,
	"ad_id" TEXT,
	"keyword_id" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "time_window_start", "idempotency_id")
);
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."time_window_start" IS 'Start of the hourly aggregation window the metrics belong to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."idempotency_id" IS 'Per-stream event identity; corrections arrive as new ids';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."campaign_id" IS 'Campaign ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."ad_group_id" IS 'Ad group ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."ad_id" IS 'Ad ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."keyword_id" IS 'Keyword/targeting-expression ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_conversion"."doc" IS 'Complete event payload as JSONB (metrics live here)';
```

<a id="relation-75"></a>

### table: `amzms_v1__sb_clickstream`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__sb_clickstream" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"time_window_start" TIMESTAMPTZ NOT NULL,
	"idempotency_id" TEXT NOT NULL,
	"campaign_id" TEXT,
	"ad_group_id" TEXT,
	"ad_id" TEXT,
	"keyword_id" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "time_window_start", "idempotency_id")
);
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."time_window_start" IS 'Start of the hourly aggregation window the metrics belong to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."idempotency_id" IS 'Per-stream event identity; corrections arrive as new ids';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."campaign_id" IS 'Campaign ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."ad_group_id" IS 'Ad group ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."ad_id" IS 'Ad ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."keyword_id" IS 'Keyword/targeting-expression ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_clickstream"."doc" IS 'Complete event payload as JSONB (metrics live here)';
```

<a id="relation-76"></a>

### table: `amzms_v1__sb_rich_media`

Category: Amazon Marketing Stream

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzms_v1__sb_rich_media" (
	"advertiser_id" TEXT NOT NULL,
	"marketplace_id" TEXT NOT NULL,
	"time_window_start" TIMESTAMPTZ NOT NULL,
	"idempotency_id" TEXT NOT NULL,
	"campaign_id" TEXT,
	"ad_group_id" TEXT,
	"ad_id" TEXT,
	"keyword_id" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("advertiser_id", "marketplace_id", "time_window_start", "idempotency_id")
);
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."advertiser_id" IS 'Amazon Advertiser ID (same as merchantId)';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."marketplace_id" IS 'Amazon Marketplace ID';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."time_window_start" IS 'Start of the hourly aggregation window the metrics belong to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."idempotency_id" IS 'Per-stream event identity; corrections arrive as new ids';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."campaign_id" IS 'Campaign ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."ad_group_id" IS 'Ad group ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."ad_id" IS 'Ad ID the metrics are attributed to (numeric on the wire, stored as text)';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."keyword_id" IS 'Keyword/targeting-expression ID the metrics are attributed to';
COMMENT ON COLUMN "workspace"."amzms_v1__sb_rich_media"."doc" IS 'Complete event payload as JSONB (metrics live here)';
```

<a id="relation-77"></a>

### table: `amzop_latest__byStoreAsin`

Category: Amazon inventory and offers

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzop_latest__byStoreAsin" (
	"type" TEXT NOT NULL,
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"asin" TEXT NOT NULL,
	"time" TIMESTAMPTZ NOT NULL,
	"deleted" BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY ("type", "merchantId", "marketplaceId", "asin")
);
```

<a id="relation-78"></a>

### table: `amzagg_profit__orderItem`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzagg_profit__orderItem" (
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"kind" TEXT NOT NULL CHECK ("kind" IN ('sale', 'refund', 'adjustment')),
	"orderId" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"sourceKey" TEXT NOT NULL,
	"currency" TEXT NOT NULL,
	"dateOrder" DATE,
	"dateBooked" DATE NOT NULL,
	"asin" TEXT,
	"title" TEXT,
	"orderStatus" TEXT NOT NULL,
	"fulfillment" TEXT CHECK ("fulfillment" IN ('FBA', 'FBM')),
	"returned" BOOLEAN NOT NULL,
	"units" INTEGER NOT NULL,
	"refundedUnits" INTEGER NOT NULL,
	"returnedUnits" INTEGER NOT NULL,
	"sellableReturnUnits" INTEGER NOT NULL,
	"sales" DOUBLE PRECISION NOT NULL,
	"promo" DOUBLE PRECISION NOT NULL,
	"shipPromotionDiscount" DOUBLE PRECISION NOT NULL,
	"refundCost" DOUBLE PRECISION NOT NULL,
	"reimbursements" DOUBLE PRECISION NOT NULL,
	"amazonFees" DOUBLE PRECISION NOT NULL,
	"cogs" DOUBLE PRECISION NOT NULL,
	"cogsCredit" DOUBLE PRECISION NOT NULL,
	"shipping" DOUBLE PRECISION NOT NULL,
	"unitCogs" DOUBLE PRECISION,
	"feesEstimated" BOOLEAN NOT NULL,
	"promotionIds" TEXT,
	PRIMARY KEY ("merchantId", "marketplaceId", "kind", "orderId", "sku", "sourceKey")
);
CREATE INDEX IF NOT EXISTS "amzagg_profit__orderItem__marketplaceId__dateBooked" ON "workspace"."amzagg_profit__orderItem" ("marketplaceId", "dateBooked");
COMMENT ON TABLE "workspace"."amzagg_profit__orderItem" IS 'Materialized P&L order-item atom: one row per (merchantId, marketplaceId, kind, orderId, sku, sourceKey). A product total is a fold of these rows. Money is signed as it contributes to profit; gross profit, net profit, margin, ROI and unit price are derived at read time and deliberately not stored.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."merchantId" IS 'Amazon Seller ID that owns the atom';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."marketplaceId" IS 'Marketplace the atom is attributed to. On refund and adjustment rows this is an attribution, possibly the writer''s single-marketplace context default, not a fact reported by the source.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."kind" IS 'Which atom this is, and therefore which date books it: sale | refund | adjustment';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."orderId" IS 'Amazon order id; the empty string for an inventory-level reimbursement that names no order (Lost_Warehouse, Lost_Inbound, Damaged_Warehouse, Reimbursement_Reversal).';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."sku" IS 'Seller SKU; the empty string where the event is not attributable to one';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."sourceKey" IS 'Discriminator carrying the source aggregate''s remaining GROUP BY columns, built with makeCompositeKey: empty on a sale; (dateBooked, currency) on a refund; (return:, dateBooked) or (reimb:, dateBooked, currency, reason) on an adjustment. It makes the primary key unique per source aggregate, not per real-world event.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."currency" IS 'ISO currency of every money column on the row. On refund and adjustment rows this is an attribution derived from the settlement summary, the reimbursement''s currency_unit or the marketplace default, not necessarily a fact on the source row.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."dateOrder" IS 'Marketplace-local date of the originating order, YYYY-MM-DD. Equal to dateBooked on a sale, carried from the originating order on a refund when it resolves, and null on an adjustment.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."dateBooked" IS 'Marketplace-local date the row is booked on, YYYY-MM-DD. This is the period filter: order date for a sale, settlement posted date for a refund, return or approval date for an adjustment.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."asin" IS 'ASIN as reported by the source, or null when it is unknown';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."title" IS 'Seller listing title, falling back to the catalog item name; null when neither is known';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."orderStatus" IS 'Order status as reported (Shipped, Pending, ...); the empty string on every non-sale row';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."fulfillment" IS 'Fulfilment channel normalized to FBA or FBM; null when the source does not report one';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."returned" IS 'True when the order and sku have a refund or a customer return on record on ANY date, not only within the projected period. Always true on a refund or return row, false on a reimbursement.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."units" IS 'Units sold on this line; 0 on refund and adjustment rows';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."refundedUnits" IS 'Units refunded by this row; 0 on sale and adjustment rows. Refund settlement rows never carry a quantity, so this is estimated from the refunded principal over the original unit price and clamped into [1, ordered units] per grouped local day.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."returnedUnits" IS 'Units physically returned by this row, all dispositions; non-zero only on a return row';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."sellableReturnUnits" IS 'Of returnedUnits, those that came back SELLABLE and are credited back to COGS';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."sales" IS 'Revenue: item + shipping + gift wrap, NET of the shipping promotion. Positive. Add back shipPromotionDiscount to get the gross-of-shipping-promotion definition the dashboard uses.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."promo" IS 'Item promotion discount, negative. Excludes the shipping promotion.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."shipPromotionDiscount" IS 'Shipping promotion, negative, already netted inside sales. Stored separately so both the exporter''s split (shipping promotion nets revenue) and the dashboard''s split (shipping promotion is a promotion) stay derivable from one projection.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."refundCost" IS 'Net money movement of a refund event, signed and normally negative: returned principal and shipping, the commission Amazon gives back, and the refund commission it keeps.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."reimbursements" IS 'FBA reimbursement money, signed: a reimbursement is positive, a reversal negative';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."amazonFees" IS 'Amazon order-item fees, negative. Settled from SETTLEMENT_V2 when a settlement has posted, otherwise forecast from the FBA fee preview; feesEstimated says which.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."cogs" IS 'Landed cost of the units sold, negative; 0 when no UNIT_COGS attribute covers the sku';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."cogsCredit" IS 'Landed cost credited back, positive: sellable customer returns and units Amazon put back into stock instead of paying for. Without it every returned unit is charged to COGS and never recovered.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."shipping" IS 'Seller-paid shipping (FBM), negative; not modelled yet, always 0';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."unitCogs" IS 'Resolved landed unit cost as of the projection''s as-of date, or null when no UNIT_COGS attribute covers the sku. Not derivable from cogs, which is 0 on a zero-unit row.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."feesEstimated" IS 'True when amazonFees is a fee-preview forecast rather than a settled amount. The row is retired and recomputed when the real event arrives, never on an age threshold.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItem"."promotionIds" IS 'Promotion ids attached to the order line, comma-separated as Amazon reports them';
```

<a id="relation-79"></a>

### table: `amzagg_profit__orderItemProjectionState`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzagg_profit__orderItemProjectionState" (
	"merchantId" TEXT PRIMARY KEY,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"projectionVersion" INTEGER NOT NULL CHECK ("projectionVersion" > 0),
	"status" TEXT NOT NULL CHECK ("status" IN ('BACKFILLING', 'READY', 'STALE', 'FAILED')),
	"dateCoveredFirst" DATE,
	"dateCoveredLast" DATE,
	"rowCount" INTEGER NOT NULL CHECK ("rowCount" >= 0),
	"startedAt" TIMESTAMPTZ NOT NULL,
	"completedAt" TIMESTAMPTZ,
	"lastError" TEXT
);
COMMENT ON TABLE "workspace"."amzagg_profit__orderItemProjectionState" IS 'Completeness state of the amzagg_profit__orderItem projection, one row per merchant. READY-gating on this row, including the covered date window, is what makes a delete-and-replace rebuild safe to serve.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."merchantId" IS 'Amazon Seller ID; the whole primary key, one row per merchant';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."projectionVersion" IS 'Projection version this state describes; the first version is 1';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."status" IS 'BACKFILLING | READY | STALE | FAILED';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."dateCoveredFirst" IS 'First marketplace-local bookedDate the last completed rebuild covered, YYYY-MM-DD; null before one completes. Reads outside this window are not served by this table.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."dateCoveredLast" IS 'Last marketplace-local bookedDate the last completed rebuild covered, YYYY-MM-DD; null before one completes.';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."rowCount" IS 'Atoms written by the last completed rebuild of this merchant';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."startedAt" IS 'Start of the current or most recent rebuild run';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."completedAt" IS 'Completion time of the last successful rebuild; null until one succeeds';
COMMENT ON COLUMN "workspace"."amzagg_profit__orderItemProjectionState"."lastError" IS 'Sanitized failure detail; never contains documents or business identifiers';
```

<a id="relation-80"></a>

### table: `amzfact_ledger_transaction`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzfact_ledger_transaction" (
	"transactionId" TEXT PRIMARY KEY,
	"projectionVersion" INTEGER NOT NULL CHECK ("projectionVersion" > 0),
	"kind" TEXT NOT NULL CHECK ("kind" IN ('sale', 'refund', 'adjustment', 'expense', 'titleTransfer', 'retrocharge', 'payout', 'ledgerAdjustment', 'chargebackRefund', 'debtRecovery', 'advertisingPayment', 'removalShipment')),
	"transactionType" TEXT NOT NULL,
	"transactionStatus" TEXT,
	"description" TEXT NOT NULL,
	"merchantId" TEXT NOT NULL,
	"marketplaceId" TEXT NOT NULL,
	"currency" TEXT NOT NULL,
	"status" TEXT NOT NULL CHECK ("status" IN ('provisional', 'authoritative')),
	"postedAt" TEXT NOT NULL,
	"bookedDate" DATE NOT NULL,
	"provisionalAt" TEXT,
	"authoritativeAt" TEXT,
	"supersededTransactionId" TEXT,
	"orderId" TEXT NOT NULL,
	"groupId" TEXT NOT NULL,
	"groupIdName" TEXT,
	"settlementId" TEXT,
	"financialEventGroupId" TEXT,
	"deferredTransactionId" TEXT,
	"shipmentId" TEXT,
	"refundId" TEXT,
	"totalAmount" DOUBLE PRECISION NOT NULL,
	"residual" DOUBLE PRECISION NOT NULL
);
CREATE INDEX IF NOT EXISTS "amzfact_ledger_transaction__merchantId__bookedDate" ON "workspace"."amzfact_ledger_transaction" ("merchantId", "bookedDate");
COMMENT ON TABLE "workspace"."amzfact_ledger_transaction" IS 'One Amazon Finances document as a balanced double-entry transaction: the resolved, deduplicated, flattened form of the source document. Its postings live in amzfact_ledger_posting and its per-SKU dimension in amzfact_ledger_item.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."transactionId" IS 'Amazon''s Finances document id; the whole primary key, since one document is one transaction';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."projectionVersion" IS 'Which compiled projection logic wrote this row; the first version is 1. Without wholesale rebuilds, rows written by older logic persist after a change and this is the only thing that marks them.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."kind" IS 'Which economic event this is, read from transactionType and description together';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."transactionType" IS 'Amazon''s own transactionType, carried as metadata rather than folded into an account name';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."transactionStatus" IS 'Amazon''s transactionStatus: RELEASED, DEFERRED, DEFERRED_RELEASED';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."description" IS 'Amazon''s document description; part of what decides the kind';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."merchantId" IS 'Amazon sellingPartnerId; the account names carry exactly this value';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."marketplaceId" IS 'Marketplace the document belongs to. Never an attribution here: every posting names its own marketplace through the account''s Amazon:<sp>:<mp> scope segments.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."currency" IS 'ISO currency of every money column on the row and on its postings. The document''s own code where it states one, the marketplace default otherwise.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."status" IS 'Whether the amounts are Amazon''s forecast or the settled figure. Authoritative exactly when transactionStatus is RELEASED, so provisional IS the deferred state; it is the only carrier of that.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."postedAt" IS 'Finances postedDate of the surviving emission, as the exact string the export writes: YYYY-MM-DDTHH:MM:SSZ. TEXT, not a timestamp — see the table docblock.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."bookedDate" IS 'Marketplace-local date of postedAt, YYYY-MM-DD. This is what a period filters on.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."provisionalAt" IS 'postedDate of the superseded provisional emission, or null when we hold none';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."authoritativeAt" IS 'postedDate of the released emission, or null while still deferred';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."supersededTransactionId" IS 'Document id this emission supersedes (Amazon''s DEFERRED_TRANSACTION_ID), or null. This is what the writer deletes by, instead of deleting a date range.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."orderId" IS 'Amazon order id; the empty string on a document that names no order';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."groupId" IS 'SHIPMENT_ID for a sale, REFUND_ID for a refund, the document id otherwise. Refunds never carry a shipment id, so the discriminator has to be per-kind or partial refunds merge.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."groupIdName" IS 'Which identifier supplied groupId; null when the document carries none';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."deferredTransactionId" IS 'Amazon''s DEFERRED_TRANSACTION_ID as the document carries it';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."totalAmount" IS 'The document''s own totalAmount, UNNEGATED: what the settlement leg posts. Amazon published it independently of the breakdown tree, which is why the two agreeing is a fact being checked.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_transaction"."residual" IS 'Sum of every posting. Zero exactly when totalAmount agrees with the breakdown tree AND every leaf found an account; non-zero names the size of whichever failed. A document is UNBALANCED when abs(residual) >= 0.005, which is how that diagnostic is derived rather than stored twice.';
```

<a id="relation-81"></a>

### table: `amzfact_ledger_posting`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzfact_ledger_posting" (
	"transactionId" TEXT NOT NULL,
	"ordinal" INTEGER NOT NULL CHECK ("ordinal" >= 0),
	"account" TEXT NOT NULL,
	"amount" DOUBLE PRECISION NOT NULL,
	"path" JSONB NOT NULL,
	"sku" TEXT,
	"asin" TEXT,
	PRIMARY KEY ("transactionId", "ordinal")
);
COMMENT ON TABLE "workspace"."amzfact_ledger_posting" IS 'One posting of a ledger transaction: a signed amount against an account. The postings of one transactionId sum to zero. Keyed on (transactionId, ordinal) because a multi-unit line produces postings identical in every other column.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_posting"."transactionId" IS 'The amzfact_ledger_transaction this posting belongs to';
COMMENT ON COLUMN "workspace"."amzfact_ledger_posting"."ordinal" IS 'Position within the transaction''s postings, from 0. Required: a multi-unit line can produce several postings identical in every other column. Also the order the beancount export prints.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_posting"."account" IS 'Full account name, e.g. Income:Amazon:<sellingPartnerId>:<marketplaceId>:ProductCharges. The scope segments are why two marketplaces can never share an account and a multi-currency total is unrepresentable rather than merely avoided. Profit is derived from the ROOT, never a list.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_posting"."amount" IS 'Signed amount: Amazon''s breakdown amount NEGATED, or the document''s totalAmount unnegated on the settlement leg. The postings of one transaction sum to zero.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_posting"."path" IS 'Breakdown path from level 1 to the deepest node, as a JSONB array. EMPTY on the settlement leg and the imbalance plug, and that emptiness is the discriminator readers test.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_posting"."sku" IS 'The item this posting came from; null at document grain and on the settlement leg. Null rather than an empty-string sentinel, because a sentinel type-checks everywhere a real SKU is expected and would flow silently into per-SKU joins.';
```

<a id="relation-82"></a>

### table: `amzfact_ledger_item`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzfact_ledger_item" (
	"transactionId" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"asin" TEXT,
	"units" INTEGER NOT NULL,
	PRIMARY KEY ("transactionId", "sku")
);
COMMENT ON TABLE "workspace"."amzfact_ledger_item" IS 'A ledger transaction''s per-SKU dimension: SKU, ASIN and units, one row per (transactionId, sku). Carries no money and is not derivable from the postings — units appear on no posting, and a free replacement''s SKU appears in no posting at all.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_item"."transactionId" IS 'The amzfact_ledger_transaction this item belongs to';
COMMENT ON COLUMN "workspace"."amzfact_ledger_item"."sku" IS 'Seller SKU, or the empty string where the document''s money is not attributable to one. Read back as null; no real SKU is the empty string.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_item"."asin" IS 'ASIN as the source reported it, or null when unknown';
COMMENT ON COLUMN "workspace"."amzfact_ledger_item"."units" IS 'quantityShipped summed over the document''s items sharing this SKU. Zero on an itemless document. Carried nowhere else: no posting has a unit count.';
```

<a id="relation-83"></a>

### table: `amzfact_ledger_build`

Category: Amazon finances and profit

```sql
CREATE TABLE IF NOT EXISTS "workspace"."amzfact_ledger_build" (
	"merchantId" TEXT NOT NULL,
	"dateFirst" DATE NOT NULL,
	"dateLast" DATE NOT NULL,
	"projectionVersion" INTEGER NOT NULL CHECK ("projectionVersion" > 0),
	"writtenAt" TIMESTAMPTZ NOT NULL,
	"transactionsWritten" INTEGER NOT NULL CHECK ("transactionsWritten" >= 0),
	"postingsWritten" INTEGER NOT NULL CHECK ("postingsWritten" >= 0),
	"transactionsSuperseded" INTEGER NOT NULL CHECK ("transactionsSuperseded" >= 0),
	"unmapped" JSONB NOT NULL,
	"excludedTypes" JSONB NOT NULL,
	"attributionHolds" JSONB NOT NULL,
	PRIMARY KEY ("merchantId", "dateFirst", "dateLast")
);
COMMENT ON TABLE "workspace"."amzfact_ledger_build" IS 'What one ledger write covered and what it could not place, one row per (merchantId, dateFirst, dateLast). Not a gating table: no status, no READY check. It records the three things a run encountered that produced no transaction and no posting.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."merchantId" IS 'Amazon sellingPartnerId this write covered, across every marketplace';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."dateFirst" IS 'First marketplace-local bookedDate the write covered, YYYY-MM-DD';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."dateLast" IS 'Last marketplace-local bookedDate the write covered, YYYY-MM-DD';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."projectionVersion" IS 'Compiled projection version that wrote it; matches the transaction rows';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."writtenAt" IS 'When this write completed';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."transactionsSuperseded" IS 'Rows deleted because the source named them superseded by a released emission';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."unmapped" IS 'Breakdown paths no placement covers. Their money IS booked, into Equity:…:Imbalance; this records which path caused it, which the imbalance posting''s empty path cannot say.';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."excludedTypes" IS 'Transaction types in the source but outside the allow-list, with their money: the standing explanation for Assets:…:Clearing drift';
COMMENT ON COLUMN "workspace"."amzfact_ledger_build"."attributionHolds" IS 'Orders the SKU join refused to resolve. The money is booked in full; only the SKU dimension is withheld.';
```

<a id="relation-84"></a>

### table: `brand_config_ontology_metadata`

Category: Brand ontology and product configuration

```sql
CREATE TABLE IF NOT EXISTS "workspace"."brand_config_ontology_metadata" (
	"property" TEXT PRIMARY KEY,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"description" TEXT,
	"valueType" TEXT NOT NULL,
	"valuesAllowed" JSONB,
	"appliesTo" TEXT NOT NULL DEFAULT 'BOTH' CHECK ("appliesTo" IN ('CATEGORY', 'VARIANT', 'BOTH'))
);
```

<a id="relation-85"></a>

### table: `brand_config_ontology_category`

Category: Brand ontology and product configuration

```sql
CREATE TABLE IF NOT EXISTS "workspace"."brand_config_ontology_category" (
	"category" TEXT PRIMARY KEY,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"description" TEXT,
	"data" JSONB NOT NULL,
	"dataResolved" JSONB NOT NULL DEFAULT '{}'::jsonb
);
```

<a id="relation-86"></a>

### table: `brand_config_ontology_variant`

Category: Brand ontology and product configuration

```sql
CREATE TABLE IF NOT EXISTS "workspace"."brand_config_ontology_variant" (
	"msku" TEXT PRIMARY KEY,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"category" TEXT NOT NULL,
	"data" JSONB NOT NULL,
	"dataResolved" JSONB NOT NULL DEFAULT '{}'::jsonb,
	FOREIGN KEY ("category") REFERENCES "workspace"."brand_config_ontology_category"("category") ON DELETE RESTRICT ON UPDATE CASCADE
);
```

<a id="relation-87"></a>

### table: `brand_config_amazon_family`

Category: Brand ontology and product configuration

```sql
CREATE TABLE IF NOT EXISTS "workspace"."brand_config_amazon_family" (
	"family" TEXT PRIMARY KEY,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"category" TEXT,
	"msku" TEXT,
	"label" TEXT,
	"description" TEXT,
	FOREIGN KEY ("category") REFERENCES "workspace"."brand_config_ontology_category"("category") ON DELETE RESTRICT ON UPDATE CASCADE
);
```

<a id="relation-88"></a>

### table: `brand_config_amazon_asin`

Category: Brand ontology and product configuration

```sql
CREATE TABLE IF NOT EXISTS "workspace"."brand_config_amazon_asin" (
	"asin" TEXT PRIMARY KEY,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"msku" TEXT,
	"family" TEXT,
	"countryToFamily" JSONB,
	"labelInFamily" TEXT,
	"countryToLabelInFamily" JSONB,
	"labelStandalone" TEXT,
	"description" TEXT,
	FOREIGN KEY ("msku") REFERENCES "workspace"."brand_config_ontology_variant"("msku") ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY ("family") REFERENCES "workspace"."brand_config_amazon_family"("family") ON DELETE RESTRICT ON UPDATE CASCADE
);
```

<a id="relation-89"></a>

### table: `brand_config_amazon_attributes`

Category: Brand ontology and product configuration

```sql
CREATE TABLE IF NOT EXISTS "workspace"."brand_config_amazon_attributes" (
	"merchantId" TEXT NOT NULL,
	"scope" TEXT NOT NULL,
	"scopeId" TEXT NOT NULL,
	"country" TEXT NOT NULL,
	"attribute" TEXT NOT NULL,
	"dateFirst" DATE NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"dateLast" DATE,
	"value" NUMERIC NOT NULL,
	"currency" TEXT,
	"source" TEXT NOT NULL,
	"confidence" TEXT NOT NULL,
	"notes" TEXT,
	PRIMARY KEY ("merchantId", "scope", "scopeId", "country", "attribute", "dateFirst")
);
COMMENT ON COLUMN "workspace"."brand_config_amazon_attributes"."source" IS 'ACTUAL | INFERRED | DEFAULT';
COMMENT ON COLUMN "workspace"."brand_config_amazon_attributes"."confidence" IS 'HIGH | MED | LOW';
```

<a id="relation-90"></a>

### table: `brand_config_business_attributes`

Category: Brand ontology and product configuration

```sql
CREATE TABLE IF NOT EXISTS "workspace"."brand_config_business_attributes" (
	"scope" TEXT NOT NULL,
	"scopeId" TEXT NOT NULL,
	"attribute" TEXT NOT NULL,
	"dateFirst" DATE NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"dateLast" DATE,
	"value" NUMERIC NOT NULL,
	"currency" TEXT,
	"source" TEXT NOT NULL,
	"confidence" TEXT NOT NULL,
	"notes" TEXT,
	PRIMARY KEY ("scope", "scopeId", "attribute", "dateFirst")
);
COMMENT ON COLUMN "workspace"."brand_config_business_attributes"."source" IS 'ACTUAL | INFERRED | DEFAULT';
COMMENT ON COLUMN "workspace"."brand_config_business_attributes"."confidence" IS 'HIGH | MED | LOW';
```

<a id="relation-91"></a>

### table: `wmt_orders_v3__Order`

Category: Walmart

```sql
CREATE TABLE IF NOT EXISTS "workspace"."wmt_orders_v3__Order" (
	"connectorId" TEXT NOT NULL,
	"purchaseOrderId" TEXT NOT NULL,
	"customerOrderId" TEXT,
	"customerEmailId" TEXT,
	"time" TIMESTAMPTZ NOT NULL,
	"estimatedDeliveryDate" TIMESTAMPTZ,
	"estimatedShipDate" TIMESTAMPTZ,
	"shipNodeType" TEXT,
	"shippingInfo" JSONB,
	"doc" JSONB NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	PRIMARY KEY ("connectorId", "purchaseOrderId")
);
COMMENT ON COLUMN "workspace"."wmt_orders_v3__Order"."connectorId" IS 'SovConnector.connectorId of the walmart_marketplace connector that fetched this order';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__Order"."purchaseOrderId" IS 'Walmart''s purchase order identifier; `order.purchaseOrderId`';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__Order"."time" IS 'The order''s orderDate; `order.orderDate`, which arrives as EPOCH MILLISECONDS (inventory''s dates are ISO 8601 strings — the two families are opposite). No PST/PDT conversion is applied or needed';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__Order"."doc" IS 'The full verbatim order payload from the API; persisted as JSONB. Typed `Unknown` rather than a struct because no vendored API type exists to pin a struct against, and because the payload''s undeclared extras are exactly what this column exists to retain';
```

<a id="relation-92"></a>

### table: `wmt_orders_v3__OrderLine`

Category: Walmart

```sql
CREATE TABLE IF NOT EXISTS "workspace"."wmt_orders_v3__OrderLine" (
	"connectorId" TEXT NOT NULL,
	"purchaseOrderId" TEXT NOT NULL,
	"lineNumber" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"productName" TEXT,
	"quantity" INTEGER NOT NULL,
	"unitPrice" NUMERIC,
	"shippingPrice" NUMERIC,
	"taxAmount" NUMERIC,
	"status" TEXT NOT NULL,
	"fulfillmentType" TEXT,
	"trackingNumber" TEXT,
	"carrierName" TEXT,
	"time" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	PRIMARY KEY ("connectorId", "purchaseOrderId", "lineNumber")
);
COMMENT ON COLUMN "workspace"."wmt_orders_v3__OrderLine"."connectorId" IS 'SovConnector.connectorId of the walmart_marketplace connector that fetched this line';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__OrderLine"."purchaseOrderId" IS 'The parent order''s `order.purchaseOrderId`';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__OrderLine"."lineNumber" IS '`orderLine.lineNumber`; a string in the payload, not a number';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__OrderLine"."sku" IS '`orderLine.item.sku`';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__OrderLine"."quantity" IS '`orderLine.orderLineQuantity.amount`, which arrives as a STRING and is parsed to an int';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__OrderLine"."status" IS '`orderLineStatuses.orderLineStatus[0].status`, falling back to the literal ''Unknown''. This is the ONLY place Walmart exposes order status — the order header carries none. Examples: Created, Acknowledged, Shipped, Delivered, Cancelled';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__OrderLine"."time" IS 'The PARENT ORDER''s orderDate (epoch millis inbound), copied onto the line so the line table can be scanned by order date without a join';
COMMENT ON COLUMN "workspace"."wmt_orders_v3__OrderLine"."doc" IS 'The full verbatim orderLine payload, INCLUDING the complete orderLineStatus array that the `status` column collapses to element [0]; persisted as JSONB. Typed `Unknown` rather than a struct because no vendored API type exists to pin a struct against';
```

<a id="relation-93"></a>

### table: `wmt_inventory_v3__Wfs`

Category: Walmart

```sql
CREATE TABLE IF NOT EXISTS "workspace"."wmt_inventory_v3__Wfs" (
	"connectorId" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"offerId" TEXT,
	"shipNodeType" TEXT NOT NULL,
	"shipNode" TEXT NOT NULL,
	"availToSellQty" INTEGER,
	"onHandQty" INTEGER,
	"firstInStockDate" TIMESTAMPTZ,
	"modifiedDate" TIMESTAMPTZ,
	"time" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	PRIMARY KEY ("connectorId", "sku", "shipNodeType", "shipNode")
);
COMMENT ON COLUMN "workspace"."wmt_inventory_v3__Wfs"."connectorId" IS 'OURS, not from the payload: SovConnector.connectorId of the walmart_marketplace connector that took the snapshot; the tenant key';
COMMENT ON COLUMN "workspace"."wmt_inventory_v3__Wfs"."sku" IS 'ITEM-level (`item.sku`)';
COMMENT ON COLUMN "workspace"."wmt_inventory_v3__Wfs"."shipNodeType" IS 'NODE-level (`node.shipNodeType`). From the RESPONSE BODY, NEVER from the request: /v3/fulfillment/inventory takes no shipNodeType parameter (that is /v3/orders). The node''s CLASS, not its identifier';
COMMENT ON COLUMN "workspace"."wmt_inventory_v3__Wfs"."shipNode" IS 'NODE-level (`node.shipNode`). The node''s IDENTIFIER — distinct from shipNodeType, which is its class. IN THE PRIMARY KEY: two nodes of the same shipNodeType but different shipNode are DISTINCT rows, not a collision. The API marks it optional; when the payload omits it the Worker writes the empty-string SENTINEL '''' (a PK column cannot be NULL), so '''' means `node.shipNode` was absent';
COMMENT ON COLUMN "workspace"."wmt_inventory_v3__Wfs"."time" IS 'OURS, not from the payload: the snapshot time of the latest run that touched this row. NOT IN THE PRIMARY KEY (ruling A4) — it is overwritten on every run rather than appended. It is the ONLY staleness signal this table has: compare it against op_wmt_inventory_v3__run.lastSnapshotAt and treat older rows as stale, not as zero';
COMMENT ON COLUMN "workspace"."wmt_inventory_v3__Wfs"."doc" IS 'THE NODE (`node`) verbatim, NOT the item — the row''s grain IS the node, so the node is its verbatim payload. Consequence: sibling nodes of the same item are not recoverable from any single row''s doc, and sku/offerId appear only as their own columns. Persisted as JSONB; typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-94"></a>

### table: `wmt_account_v3__profile`

Category: Walmart

```sql
CREATE TABLE IF NOT EXISTS "workspace"."wmt_account_v3__profile" (
	"connectorId" TEXT PRIMARY KEY,
	"name" TEXT,
	"businessRegistrationNumber" TEXT,
	"countryOfIncorporation" TEXT,
	"doc" JSONB NOT NULL,
	"time" TIMESTAMPTZ NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL
);
COMMENT ON COLUMN "workspace"."wmt_account_v3__profile"."connectorId" IS 'OURS, not from the payload: SovConnector.connectorId of the walmart_marketplace connector whose entity-match profile this is; the tenant key (a globally-unique UUIDv7, 1:1 with wsid, so wsid is not in the PK)';
COMMENT ON COLUMN "workspace"."wmt_account_v3__profile"."doc" IS 'The verbatim entitymatchprofile response body (the `body` wrapper plus `status`). Persisted as JSONB; typed `Unknown` because no vendored API type exists to pin a struct against (see the header''s `.assert.ts` note)';
COMMENT ON COLUMN "workspace"."wmt_account_v3__profile"."time" IS 'OURS, not from the payload: the time this profile was fetched from Walmart';
```

<a id="relation-95"></a>

### table: `tfl_orders_v1__Order`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_orders_v1__Order" (
	"connectorId" TEXT NOT NULL,
	"id" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"cartOrderId" TEXT NOT NULL,
	"cartOrderNumber" TEXT,
	"status" TEXT,
	"storeName" TEXT,
	"financialStatus" TEXT,
	"shipmentId" INTEGER,
	"warehouseId" INTEGER,
	"warehouseName" TEXT,
	"shipMethod" TEXT,
	"tracking" TEXT,
	"trackingUrl" TEXT,
	"dhlEcomNumber" TEXT,
	"city" TEXT,
	"state" TEXT,
	"country" TEXT,
	"orderDate" TIMESTAMPTZ NOT NULL,
	"shipDate" TIMESTAMPTZ,
	"gfsCreatedAt" TIMESTAMPTZ NOT NULL,
	"gfsModifiedAt" TIMESTAMPTZ,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "id")
);
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this order';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."id" IS 'GFS''s own integer order id; `order.id`. MEASURED unique 337/337';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."cartOrderId" IS '`order.cartOrderId` — the MERCHANT''s cart order id (a Shopify order id, or an Amazon order number). The cross-connector join key to the Shopify connector. A join key, never the identity';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."cartOrderNumber" IS '`order.cartOrderNumber`; the merchant-facing order number, a string';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."status" IS '`order.status`; observed Canceled / Shipped and others. Vendor string';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."storeName" IS '`order.storeName`. Non-null on 337/337 corpus rows but RELAXED to nullable: one account''s storefront naming is not evidence about every account''s';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."financialStatus" IS '`order.financialStatus`. MEASURED distinct=1 with only "paid" ever observed, which makes a refund or unpaid state plausible and merely unobserved — hence nullable, and hence NOT a Schema.Literal';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."shipmentId" IS '`order.shipmentId`, joining to `tfl_shipments_v1__Shipment.id` by convention (no declared FK). Non-null on 337/337 but RELAXED to nullable: an unshipped order plausibly carries none';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."warehouseId" IS '`order.warehouseId`; MEASURED null on 2/337 rows';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."warehouseName" IS '`order.warehouseName`; MEASURED null on 2/337 rows';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."shipMethod" IS '`order.shipMethod`; the merchant''s shipping option label';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."tracking" IS '`order.tracking`; MEASURED null on 16/337 rows (unshipped orders)';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."trackingUrl" IS '`order.trackingUrl`; MEASURED null on 16/337 rows';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."dhlEcomNumber" IS '`order.dhlEcomNumber`; MEASURED null on 16/337 rows';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."city" IS '`order.city`; geography, not person-identifying on its own';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."state" IS '`order.state`; MEASURED null on 1/337 rows (a non-US address)';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."country" IS '`order.country`; ISO alpha-2, observed AU and US';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."orderDate" IS 'SOURCE ZONE: US EASTERN WALL TIME (America/New_York), localised on ingestion. `order.orderDate` carries NO offset designator, so nothing in the value reveals its zone. MEASURED (Q05) by differencing against `order.createdAt`: exactly 4h apart in July and 5h in January, which is the America/New_York offset pair. The raw string survives in `doc`, so this decision is reversible without a re-fetch';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."shipDate" IS 'SOURCE ZONE: US EASTERN WALL TIME (America/New_York), localised on ingestion, on the same Q05 measurement as `orderDate`. `order.shipDate`; MEASURED null on 16/337 rows';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."gfsCreatedAt" IS 'SOURCE ZONE: UTC, parsed directly with NO localisation. `order.createdAt`, prefixed `gfs` so it does not collide with our own `createdAt` bookkeeping column. MEASURED (Q05): it runs exactly 4h ahead of `orderDate` in July and 5h ahead in January, on 100% and 98% of rows respectively — the signature of a UTC stamp beside an Eastern one';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."gfsModifiedAt" IS 'SOURCE ZONE: US EASTERN WALL TIME (America/New_York) BY DECREE, localised on ingestion — and the source was MEASURED MIXED. Q05 found `order.modifiedAt`''s offset splitting three ways in winter: Eastern for cart-side stamps, UTC when GFS itself touched the row. So SOME STORED VALUES ARE KNOWABLY DISPLACED BY 4-5 HOURS. THIS COLUMN MUST NEVER BE USED AS A WATERMARK OR IN ANY SYNC LOGIC. The raw string is kept verbatim in `doc` for anyone who needs to re-derive it';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__Order"."doc" IS 'The full verbatim order payload from the API; persisted as JSONB. Holds the buyer PII that is deliberately not promoted, the ten always-null fields, and the RAW timestamp strings — which is what makes every localisation decision above recoverable from stored data without a re-fetch. Typed `Unknown` rather than a struct because no vendored API type exists to pin a struct against';
```

<a id="relation-96"></a>

### table: `tfl_orders_v1__OrderItem`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_orders_v1__OrderItem" (
	"connectorId" TEXT NOT NULL,
	"id" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"orderId" INTEGER NOT NULL,
	"sku" TEXT,
	"name" TEXT,
	"quantity" INTEGER NOT NULL,
	"retailValue" DOUBLE PRECISION NOT NULL,
	"gfsCreatedAt" TIMESTAMPTZ NOT NULL,
	"gfsModifiedAt" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "id")
);
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this order item';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."id" IS '`items[].id`, the line''s own GFS id. MEASURED unique across the corpus';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."orderId" IS '`items[].orderId`, joining to `tfl_orders_v1__Order.id`. No foreign key is declared, matching the wmt_* target-table precedent';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."sku" IS '`items[].sku`, joining to `tfl_products_v1__Sku.sku` by convention';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."name" IS '`items[].name`; the product name as the cart supplied it';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."quantity" IS '`items[].quantity`; MEASURED integral (1-5) across the detail corpus';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."retailValue" IS '`items[].retailValue`, the line''s retail amount. MEASURED NON-INTEGRAL (1.47, 41.79), so Schema.Int would truncate it. Stored DOUBLE PRECISION rather than NUMERIC: the repo''s position is that money-adjacent analytics values take DOUBLE PRECISION, which postgres.js returns as a real JS number, while NUMERIC comes back as a string';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."gfsCreatedAt" IS 'SOURCE ZONE: UTC, parsed directly with NO localisation. `items[].createdAt`. MEASURED (eval03) within 0-7 ms of the parent order''s `createdAt` on 14/14 rows, and that parent field is itself measured UTC. Prefixed `gfs` so it does not collide with our own `createdAt` bookkeeping column';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."gfsModifiedAt" IS 'SOURCE ZONE: UTC, parsed directly with NO localisation — DELIBERATELY UNLIKE the order-level `gfsModifiedAt`, which is Eastern. ONE PAYLOAD CARRIES BOTH READINGS: MEASURED (eval03), `items[].modifiedAt` sits within milliseconds of the order''s UTC `createdAt` on 14/14 rows while the same rows'' order-level `modifiedAt` reads four hours behind. Localising this value from America/New_York would shift it 4-5 hours';
COMMENT ON COLUMN "workspace"."tfl_orders_v1__OrderItem"."doc" IS 'The full verbatim `items[]` element from the order detail payload; persisted as JSONB. Keeps the raw timestamp strings, so the UTC reading above is recoverable from stored data without a re-fetch. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-97"></a>

### table: `tfl_shipments_v1__Shipment`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_shipments_v1__Shipment" (
	"connectorId" TEXT NOT NULL,
	"id" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"cartOrderIds" TEXT[] NOT NULL,
	"fulfillmentCharge" DOUBLE PRECISION NOT NULL,
	"containerCharge" DOUBLE PRECISION NOT NULL,
	"shippingCharge" DOUBLE PRECISION NOT NULL,
	"totalCharge" DOUBLE PRECISION NOT NULL,
	"shipDate" TIMESTAMPTZ NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "id")
);
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this shipment';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."id" IS '`shipment.id`, GFS''s own shipment id. MEASURED unique 282/282';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."cartOrderIds" IS '`shipment.cartOrderIds` — the MERCHANT cart order ids this shipment covers, stored as TEXT[]. MEASURED 284 elements over 282 rows with 2 rows carrying more than one id, so multi-order shipments occur in this account and the array must not be flattened. Joins to `tfl_orders_v1__Order.cartOrderId`';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."fulfillmentCharge" IS '`shipment.fulfillmentCharge`. MEASURED non-integral, range 0.95-3.45; DOUBLE PRECISION';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."containerCharge" IS '`shipment.containerCharge`. MEASURED non-integral, range 0.23-1; DOUBLE PRECISION';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."shippingCharge" IS '`shipment.shippingCharge`. MEASURED non-integral, range 5.70-25.47; DOUBLE PRECISION';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."totalCharge" IS '`shipment.totalCharge`. MEASURED non-integral, range 6.92-29.92; DOUBLE PRECISION';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."shipDate" IS 'SOURCE ZONE: US EASTERN WALL TIME (America/New_York), localised on ingestion. `shipment.shipDate` carries NO offset designator, so nothing in the value reveals its zone; MEASURED (Q05) to sit in the Eastern family alongside `order.shipDate`. The raw string survives in `doc`, so the decision is reversible without a re-fetch';
COMMENT ON COLUMN "workspace"."tfl_shipments_v1__Shipment"."doc" IS 'The full verbatim shipment payload from the API; persisted as JSONB, including the raw `shipDate` string. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-98"></a>

### table: `tfl_products_v1__Inventory`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_products_v1__Inventory" (
	"connectorId" TEXT NOT NULL,
	"productId" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"productName" TEXT,
	"quantity" INTEGER NOT NULL,
	"allocated" INTEGER NOT NULL,
	"available" INTEGER NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "productId")
);
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this product';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."productId" IS '`product.productId`, GFS''s own product id. MEASURED unique 45/45';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."productName" IS '`product.productName`. The only clean product name in the API — MEASURED 45 distinct names over 45 rows. Nullable per the connector-wide rule that a promoted string is nullable unless the corpus proves otherwise, since a NOT NULL violation would abort the whole snapshot page rather than one row';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."quantity" IS '`product.quantity`, total on hand. MEASURED integral, 0-13216';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."allocated" IS '`product.allocated`, reserved against open orders. MEASURED integral';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."available" IS '`product.available`, sellable on hand. MEASURED integral, 0-13212';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Inventory"."doc" IS 'The full verbatim product payload from the API; persisted as JSONB. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-99"></a>

### table: `tfl_products_v1__WarehouseInventory`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_products_v1__WarehouseInventory" (
	"connectorId" TEXT NOT NULL,
	"localdate" DATE NOT NULL,
	"productId" INTEGER NOT NULL,
	"warehouseId" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"warehouseName" TEXT,
	"quantity" INTEGER NOT NULL,
	"allocated" INTEGER NOT NULL,
	"available" INTEGER NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "localdate", "productId", "warehouseId")
);
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this snapshot row';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."localdate" IS 'SOURCE ZONE: AMERICA/NEW_YORK. The `yyyy-MM-dd` Eastern calendar day of OUR FETCH, not of a payload field — the endpoint carries no timestamp. Not the UTC day: a poll between midnight UTC and midnight Eastern would be mislabelled. Stored DATE, matching the repo''s `localdate` convention so joins to `amzreport_ALL_ORDERS.localdate` line up';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."productId" IS '`row.productId`, joining to `tfl_products_v1__Inventory.productId` by convention';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."warehouseId" IS '`row.warehouseId`. In the key even at one warehouse: the endpoint exists to split by warehouse, and a key cannot be widened later because these tables have no ALTER path';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."warehouseName" IS '`row.warehouseName` (observed: Tampa). Nullable per the connector-wide rule that a promoted string is nullable unless the corpus proves otherwise';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."quantity" IS '`row.quantity`, on hand at this warehouse on `localdate`. MEASURED integral';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."allocated" IS '`row.allocated`, reserved at this warehouse on `localdate`. MEASURED integral';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."available" IS '`row.available`, sellable at this warehouse on `localdate`. MEASURED integral';
COMMENT ON COLUMN "workspace"."tfl_products_v1__WarehouseInventory"."doc" IS 'The full verbatim warehouse-inventory row from the API; persisted as JSONB, including the `productName` that is deliberately not promoted here. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-100"></a>

### table: `tfl_products_v1__Sku`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_products_v1__Sku" (
	"connectorId" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"type" TEXT,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "sku")
);
COMMENT ON COLUMN "workspace"."tfl_products_v1__Sku"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this SKU';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Sku"."sku" IS '`sku.sku`, the merchant''s SKU string. MEASURED unique 218/218 and used as the identity';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Sku"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Sku"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Sku"."type" IS '`sku.type`; observed "Shippable Sku", "Excluded Sku" and one more. Schema.String and NOT Schema.Literal ON PURPOSE: these are vendor strings that can gain members without notice, and a Literal would make a new value a decode failure for the whole page';
COMMENT ON COLUMN "workspace"."tfl_products_v1__Sku"."doc" IS 'The full verbatim SKU payload from the API, including the `products[]` array that is materialised into `tfl_products_v1__SkuProduct`; persisted as JSONB. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-101"></a>

### table: `tfl_products_v1__SkuProduct`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_products_v1__SkuProduct" (
	"connectorId" TEXT NOT NULL,
	"sku" TEXT NOT NULL,
	"productId" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"productName" TEXT,
	"qtyMultiplier" INTEGER NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "sku", "productId")
);
COMMENT ON COLUMN "workspace"."tfl_products_v1__SkuProduct"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this mapping';
COMMENT ON COLUMN "workspace"."tfl_products_v1__SkuProduct"."sku" IS 'The parent SKU''s `sku.sku`, joining to `tfl_products_v1__Sku.sku`';
COMMENT ON COLUMN "workspace"."tfl_products_v1__SkuProduct"."productId" IS '`sku.products[].productId`, joining to `tfl_products_v1__Inventory.productId`. Keyed on the id rather than the name because two productIds were MEASURED sharing one name';
COMMENT ON COLUMN "workspace"."tfl_products_v1__SkuProduct"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_products_v1__SkuProduct"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_products_v1__SkuProduct"."productName" IS '`sku.products[].productName`, promoted for readability only. NOT an identity and NOT joinable: two productIds were MEASURED sharing the name "Shipping Protection" inside this array. Use `productId` and `tfl_products_v1__Inventory` for anything real';
COMMENT ON COLUMN "workspace"."tfl_products_v1__SkuProduct"."qtyMultiplier" IS '`sku.products[].qtyMultiplier` — how many units of this product one unit of the SKU ships, i.e. how bundles are expressed. MEASURED integral, range 1-4 over 210 elements';
COMMENT ON COLUMN "workspace"."tfl_products_v1__SkuProduct"."doc" IS 'The verbatim `products[]` element from the SKU payload; persisted as JSONB. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-102"></a>

### table: `tfl_inventorySummary_v1__ProductWarehouse`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_inventorySummary_v1__ProductWarehouse" (
	"connectorId" TEXT NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE NOT NULL,
	"productName" TEXT NOT NULL,
	"warehouseName" TEXT NOT NULL CHECK ("warehouseName" <> 'ALL'),
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"productId" INTEGER,
	"beginningInventory" INTEGER NOT NULL,
	"shipped" INTEGER NOT NULL,
	"returnsToInventory" INTEGER NOT NULL,
	"miscellaneousAdjustments" INTEGER NOT NULL,
	"otsShipments" INTEGER NOT NULL,
	"received" INTEGER NOT NULL,
	"endingInventory" INTEGER NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "startDate", "endDate", "productName", "warehouseName")
);
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this summary row';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."startDate" IS 'The window''s inclusive first `yyyy-MM-dd` calendar day, ALWAYS an EASTERN (America/New_York) calendar month bound (e.g. 2026-07-01) — the bound is derived in Eastern, never in UTC, because deriving it in UTC would mint a second, silently incompatible key family for the same month. A trailing 31-day window would mint a new primary key every day and pile up overlapping windows that cannot be summed. Stored DATE, not TIMESTAMPTZ';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."endDate" IS 'The window''s inclusive last `yyyy-MM-dd` calendar day, ALWAYS an EASTERN (America/New_York) calendar month bound (e.g. 2026-07-31), derived in Eastern and never in UTC, on the same reasoning as `startDate`. Asked for in full even mid-month: MEASURED (exp07), a window clamped to today differs from the full-month window on 46 of 84 rows, every one with LOWER `shipped`, so clamping silently drops activity. Stored DATE, not TIMESTAMPTZ';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."productName" IS '`row.productName` STORED VERBATIM — no trim, no case folding, no whitespace collapsing, no unicode normalisation. It is the ONLY identity this payload carries, and any normalisation would stop the stored key matching tomorrow''s payload, breaking the upsert-in-place identity irreparably under the no-ALTER constraint. MEASURED max length 55 characters';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."warehouseName" IS '`row.warehouseSummaries[].warehouseName` (observed: Tampa). A CHECK constraint forbids the value ''ALL'': GFS returns an ALL rollup row per product which we validate against the sum of the real rows, log on mismatch, and DISCARD — storing it would double every unfiltered SUM, a silent wrong answer rather than an error';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."productId" IS 'DERIVED, not from this payload: resolved from the `/products/inventory` response the same work unit fetched. NULL means the name did not resolve — the earliest signal of a product rename — or that it resolved AMBIGUOUSLY, which yields NULL rather than an arbitrary pick. Never part of the key: it is derived, nullable, and can change for a row already stored';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."beginningInventory" IS '`warehouseSummaries[].beginningInventory`; level at the window''s start';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."shipped" IS '`warehouseSummaries[].shipped`; units shipped within the window';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."returnsToInventory" IS '`warehouseSummaries[].returnsToInventory`; units returned to stock';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."miscellaneousAdjustments" IS '`warehouseSummaries[].miscellaneousAdjustments`. GOES NEGATIVE — MEASURED -300 to 68. INTEGER is signed; no constraint, coercion or clamp may reject or alter a negative value';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."otsShipments" IS '`warehouseSummaries[].otsShipments`; movement attributed to off-the-shelf shipments. GOES NEGATIVE — MEASURED as low as -6000. INTEGER is signed; do not clamp';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."received" IS '`warehouseSummaries[].received`; units received into the warehouse';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."endingInventory" IS '`warehouseSummaries[].endingInventory`; level at the window''s end';
COMMENT ON COLUMN "workspace"."tfl_inventorySummary_v1__ProductWarehouse"."doc" IS 'The verbatim `warehouseSummaries[]` element together with its parent `productName`; persisted as JSONB. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-103"></a>

### table: `tfl_asns_v1__Asn`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_asns_v1__Asn" (
	"connectorId" TEXT NOT NULL,
	"id" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"asnNumber" TEXT,
	"asnStatusId" INTEGER NOT NULL,
	"categoryId" INTEGER NOT NULL,
	"warehouseId" INTEGER NOT NULL,
	"carrier" TEXT,
	"carrierWebAddress" TEXT,
	"trackingNumber" TEXT,
	"referenceNumber" TEXT,
	"specialInstructions" TEXT,
	"shippingContainer" TEXT,
	"estimatedDeliveryDate" TEXT,
	"expectedQuantity" INTEGER NOT NULL,
	"receivedQuantity" INTEGER NOT NULL,
	"deliveredQuantity" INTEGER NOT NULL,
	"detailsFetchedAt" TIMESTAMPTZ,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "id")
);
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this ASN';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."id" IS '`asn.id`, GFS''s own ASN id. MEASURED unique 263/263';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."asnNumber" IS '`asn.asnNumber`, the human-facing ASN reference. A STRING even when it looks numeric';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."asnStatusId" IS '`asn.asnStatusId`; MEASURED 1-4. The API exposes no matching status text';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."categoryId" IS '`asn.categoryId`; MEASURED constant 1 across the corpus';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."warehouseId" IS '`asn.warehouseId`; MEASURED 1 and 11, which is the standing evidence that this account will not stay single-warehouse and why `warehouseId` is in the warehouse-inventory key';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."carrier" IS '`asn.carrier`; a free-text vendor string, casing not normalised by GFS';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."carrierWebAddress" IS '`asn.carrierWebAddress`; MEASURED null on 195/263 rows';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."trackingNumber" IS '`asn.trackingNumber`. Can hold SEVERAL comma-separated numbers in one string, so it must not be treated as a single identifier';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."referenceNumber" IS '`asn.referenceNumber`; MEASURED null on 62/263 rows';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."specialInstructions" IS '`asn.specialInstructions`; MEASURED null on 248/263 rows';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."shippingContainer" IS '`asn.shippingContainer`; observed "boxes" and "pallets"';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."estimatedDeliveryDate" IS 'SOURCE ZONE: GENUINELY UNMEASURED — stored VERBATIM as TEXT and NEVER parsed or timezone-converted. `asn.estimatedDeliveryDate`. MEASURED only that it is round-hour (06:00, 16:00) on 263/263 rows with no fractional seconds and no designator, which reads as a human-scheduled appointment slot rather than a system timestamp; it matches none of the serializer families we did measure. A zone guess here would produce a plausible-looking lie in a column with no ALTER path';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."expectedQuantity" IS '`asn.expectedQuantity`; MEASURED integral, 0-150';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."receivedQuantity" IS '`asn.receivedQuantity` at header level; MEASURED 0 on every corpus row';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."deliveredQuantity" IS '`asn.deliveredQuantity`; MEASURED integral, 0-150';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."detailsFetchedAt" IS 'OURS, NOT GFS''S: when this ASN''s detail route was successfully fetched and its items written. NULL means still pending. MUST be excluded from `updateColumns` on the header upsert, or the daily header refresh nulls it on any doc change and details are re-fetched forever. Stamped by a dedicated update AFTER the child-item upsert succeeds, so a crash in between simply leaves it null and the next run retries';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__Asn"."doc" IS 'The full verbatim ASN payload from the API; persisted as JSONB, including the always-null `carrierPhoneNumber` and the raw `estimatedDeliveryDate` string. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-104"></a>

### table: `tfl_asns_v1__AsnItem`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_asns_v1__AsnItem" (
	"connectorId" TEXT NOT NULL,
	"asnId" INTEGER NOT NULL,
	"kind" TEXT NOT NULL,
	"id" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"itemId" INTEGER,
	"expectedQuantity" INTEGER,
	"receivedQuantity" INTEGER,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "asnId", "kind", "id")
);
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this ASN item';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."asnId" IS 'The parent ASN''s `asn.id`, joining to `tfl_asns_v1__Asn.id`';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."kind" IS 'Which ASN array this element came from. Renders TEXT. In the key because a line id is not proven unique ACROSS the three arrays — `inserts` and `containers` were empty on all 12 sampled ASNs, so there is no evidence either way and the key cannot be widened later';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."id" IS 'The element''s own LINE id (`products[].id`). NOT the product reference — see `itemId`';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."itemId" IS '`products[].itemId` — the PRODUCT reference, joining to `tfl_products_v1__Inventory.productId`. MEASURED: ASN 6741''s itemId 21759 is a real productId while its `id` is 10799, so the two are different numbers with different meanings. Nullable because the `insert` and `container` element shapes are unobserved';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."expectedQuantity" IS '`products[].expectedQuantity`; units this line was expected to deliver. Nullable because the `insert` and `container` element shapes are unobserved';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."receivedQuantity" IS '`products[].receivedQuantity`; units actually received against this line. Nullable because the `insert` and `container` element shapes are unobserved';
COMMENT ON COLUMN "workspace"."tfl_asns_v1__AsnItem"."doc" IS 'The verbatim array element from the ASN detail payload; persisted as JSONB. This is the only place the unobserved `insert` and `container` shapes will be recorded in full when they first appear. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-105"></a>

### table: `tfl_otsShipments_v1__OtsShipment`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_otsShipments_v1__OtsShipment" (
	"connectorId" TEXT NOT NULL,
	"id" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"warehouseId" INTEGER NOT NULL,
	"warehouse" TEXT,
	"statusId" INTEGER NOT NULL,
	"status" TEXT,
	"categoryId" INTEGER NOT NULL,
	"category" TEXT,
	"hubspotTicketNumber" TEXT,
	"clientReferenceId" TEXT,
	"gfsCreatedAt" TIMESTAMPTZ NOT NULL,
	"completedDate" TIMESTAMPTZ,
	"detailsFetchedAt" TIMESTAMPTZ,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "id")
);
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this OTS shipment';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."id" IS '`otsShipment.id`, GFS''s own id. MEASURED unique 371/371';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."warehouseId" IS '`otsShipment.warehouseId`; MEASURED constant 1 across the corpus';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."warehouse" IS '`otsShipment.warehouse` (observed: Tampa). Note the name has no `Name` suffix here, unlike `warehouseName` elsewhere in this API — the payload field is spelled this way';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."statusId" IS '`otsShipment.statusId`; MEASURED 3-5';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."status" IS '`otsShipment.status`; observed Canceled / Completed / Pulled. A vendor string, so NOT a Schema.Literal — a new status must not become a decode failure';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."categoryId" IS '`otsShipment.categoryId`; MEASURED 1-3';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."category" IS '`otsShipment.category`; observed Disposal / Legacy / Outbound';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."hubspotTicketNumber" IS '`otsShipment.hubspotTicketNumber`; a free-text field that MEASURED holds non-numeric values such as "email" and the empty string, so it must not be parsed as a number';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."clientReferenceId" IS '`otsShipment.clientReferenceId`; merchant-supplied free text, frequently the empty string';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."gfsCreatedAt" IS 'SOURCE ZONE: UTC BY INFERENCE, NOT BY MEASUREMENT — parsed directly with no localisation. `otsShipment.createdAt` has no partner stamp to difference against, so its zone cannot be measured. The inference''s basis: every `createdAt` measured anywhere in this API is UTC, and the same payload''s `completedDate` carries an explicit Z on the detail route, so the serializer family is UTC and a wall-time reading has zero supporting instances. If wrong, the error is a bounded 4-5 hour shift recoverable from `doc`';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."completedDate" IS 'SOURCE ZONE: UTC, MEASURED — the detail route serialises an explicit `Z` (eval03), which the list route truncates. `otsShipment.completedDate`; MEASURED null on 16/371 rows';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."detailsFetchedAt" IS 'OURS, NOT GFS''S: when this shipment''s detail route was successfully fetched and its items written. NULL means still pending. MUST be excluded from `updateColumns` on the header upsert, or the daily header refresh nulls it on any doc change and details are re-fetched forever. Stamped AFTER the child-item upsert succeeds, so a crash in between leaves it null and the next run retries';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipment"."doc" IS 'The full verbatim OTS shipment payload from the API; persisted as JSONB, including the raw `createdAt` string that makes the UTC inference above reversible. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-106"></a>

### table: `tfl_otsShipments_v1__OtsShipmentItem`

Category: The Fulfillment Lab

```sql
CREATE TABLE IF NOT EXISTS "workspace"."tfl_otsShipments_v1__OtsShipmentItem" (
	"connectorId" TEXT NOT NULL,
	"otsShipmentId" INTEGER NOT NULL,
	"productId" INTEGER NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,
	"productName" TEXT,
	"quantity" INTEGER NOT NULL,
	"doc" JSONB NOT NULL,
	PRIMARY KEY ("connectorId", "otsShipmentId", "productId")
);
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipmentItem"."connectorId" IS 'SovConnector.connectorId of the thefulfillmentlab connector that fetched this OTS item';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipmentItem"."otsShipmentId" IS 'The parent shipment''s `otsShipment.id`, joining to `tfl_otsShipments_v1__OtsShipment.id`';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipmentItem"."productId" IS '`items[].productId`, joining to `tfl_products_v1__Inventory.productId`. It is in the key because the payload carries NO line id — there is no alternative — which is why a repeated productId must be aggregated by the transform rather than written twice';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipmentItem"."createdAt" IS 'OUR row bookkeeping: when this row was first written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipmentItem"."updatedAt" IS 'OUR row bookkeeping: when this row was last written. Not a GFS field';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipmentItem"."productName" IS '`items[].productName`, promoted for readability only. NOT an identity: `tfl_products_v1__Inventory` is the authoritative product dimension and `productId` is the join key';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipmentItem"."quantity" IS '`items[].quantity`, MEASURED integral. Holds the SUM across every `items[]` entry sharing this productId within the shipment, because the payload has no line id to separate them by';
COMMENT ON COLUMN "workspace"."tfl_otsShipments_v1__OtsShipmentItem"."doc" IS 'The verbatim `items[]` element from the OTS detail payload; persisted as JSONB. When several elements were aggregated into one row this holds the LAST of them, so the aggregated `quantity` column can exceed the quantity inside `doc` — the only place in this connector where a column and `doc` legitimately disagree. Typed `Unknown` because no vendored API type exists to pin a struct against';
```

<a id="relation-107"></a>

### view: `amazon_ads_ad`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_ads_ad" WITH (security_invoker) AS
SELECT
  COALESCE(e."merchantId", s."advertiser_id") AS merchant_id,
  COALESCE(e."marketplaceId", s."marketplace_id") AS marketplace_id,
  COALESCE(e."adId", s."adId") AS ad_id,
  COALESCE(e."adGroupId", s."adGroupId") AS ad_group_id,
  COALESCE(e."campaignId", s."campaignId") AS campaign_id,
  COALESCE(e."adProduct", s."adProduct") AS ad_product,
  CASE WHEN s."lastUpdatedDateTime" > COALESCE(e."lastUpdatedDateTime", '-infinity')
    THEN s."state" ELSE e."state" END AS state,
  e."name" AS name,
  e."adType" AS ad_type,
  e."creative" AS creative,
  e."deliveryStatus" AS delivery_status,
  e."deliveryReasons" AS delivery_reasons,
  e."adVersionId" AS ad_version_id,
  COALESCE(e."creationDateTime", s."creationDateTime") AS creation_date_time,
  GREATEST(e."lastUpdatedDateTime", s."lastUpdatedDateTime") AS last_updated_date_time,
  e."lastUpdatedDateTime" AS export_last_updated_date_time,
  s."lastUpdatedDateTime" AS stream_last_updated_date_time,
  s."version" AS stream_version
FROM "amzadapi_exports_v1__ad" e
FULL OUTER JOIN "amzms_v1__ads" s
  ON e."merchantId" = s."advertiser_id"
  AND e."marketplaceId" = s."marketplace_id"
  AND e."adId" = s."adId";
COMMENT ON COLUMN "workspace"."amazon_ads_ad"."state" IS 'Fresher of Export/stream state (ENABLED/PAUSED)';
COMMENT ON COLUMN "workspace"."amazon_ads_ad"."name" IS 'Export-only ad name';
COMMENT ON COLUMN "workspace"."amazon_ads_ad"."creative" IS 'Export-only creative payload (JSONB)';
COMMENT ON COLUMN "workspace"."amazon_ads_ad"."delivery_status" IS 'Export-only serving status';
COMMENT ON COLUMN "workspace"."amazon_ads_ad"."delivery_reasons" IS 'Export-only delivery reasons (JSONB)';
COMMENT ON COLUMN "workspace"."amazon_ads_ad"."last_updated_date_time" IS 'Newest lastUpdatedDateTime across Export and stream';
COMMENT ON COLUMN "workspace"."amazon_ads_ad"."stream_version" IS 'Latest stream snapshot version (null: no stream row)';
```

<a id="relation-108"></a>

### view: `amazon_ads_adgroup`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_ads_adgroup" WITH (security_invoker) AS
SELECT
  COALESCE(e."merchantId", s."advertiser_id") AS merchant_id,
  COALESCE(e."marketplaceId", s."marketplace_id") AS marketplace_id,
  COALESCE(e."adGroupId", s."adGroupId") AS ad_group_id,
  COALESCE(e."campaignId", s."campaignId") AS campaign_id,
  COALESCE(e."adProduct", s."adProduct") AS ad_product,
  CASE WHEN s."lastUpdatedDateTime" > COALESCE(e."lastUpdatedDateTime", '-infinity')
    THEN s."state" ELSE e."state" END AS state,
  CASE WHEN s."lastUpdatedDateTime" > COALESCE(e."lastUpdatedDateTime", '-infinity')
    THEN s."name" ELSE e."name" END AS name,
  e."deliveryStatus" AS delivery_status,
  e."deliveryReasons" AS delivery_reasons,
  e."bid" AS bid,
  e."creativeType" AS creative_type,
  e."optimization" AS optimization,
  COALESCE(e."creationDateTime", s."creationDateTime") AS creation_date_time,
  GREATEST(e."lastUpdatedDateTime", s."lastUpdatedDateTime") AS last_updated_date_time,
  e."lastUpdatedDateTime" AS export_last_updated_date_time,
  s."lastUpdatedDateTime" AS stream_last_updated_date_time,
  s."version" AS stream_version
FROM "amzadapi_exports_v1__adgroup" e
FULL OUTER JOIN "amzms_v1__adgroups" s
  ON e."merchantId" = s."advertiser_id"
  AND e."marketplaceId" = s."marketplace_id"
  AND e."adGroupId" = s."adGroupId";
COMMENT ON COLUMN "workspace"."amazon_ads_adgroup"."state" IS 'Fresher of Export/stream state (ENABLED/PAUSED)';
COMMENT ON COLUMN "workspace"."amazon_ads_adgroup"."name" IS 'Fresher of Export/stream ad group name';
COMMENT ON COLUMN "workspace"."amazon_ads_adgroup"."delivery_status" IS 'Export-only serving status';
COMMENT ON COLUMN "workspace"."amazon_ads_adgroup"."delivery_reasons" IS 'Export-only delivery reasons (JSONB)';
COMMENT ON COLUMN "workspace"."amazon_ads_adgroup"."last_updated_date_time" IS 'Newest lastUpdatedDateTime across Export and stream';
COMMENT ON COLUMN "workspace"."amazon_ads_adgroup"."stream_version" IS 'Latest stream snapshot version (null: no stream row)';
```

<a id="relation-109"></a>

### view: `amazon_ads_campaign`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_ads_campaign" WITH (security_invoker) AS
SELECT
  COALESCE(e."merchantId", s."advertiser_id") AS merchant_id,
  COALESCE(e."marketplaceId", s."marketplace_id") AS marketplace_id,
  COALESCE(e."campaignId", s."campaignId") AS campaign_id,
  COALESCE(e."adProduct", s."adProduct") AS ad_product,
  CASE WHEN s."lastUpdatedDateTime" > COALESCE(e."lastUpdatedDateTime", '-infinity')
    THEN s."state" ELSE e."state" END AS state,
  CASE WHEN s."lastUpdatedDateTime" > COALESCE(e."lastUpdatedDateTime", '-infinity')
    THEN s."name" ELSE e."name" END AS name,
  e."deliveryStatus" AS delivery_status,
  e."deliveryReasons" AS delivery_reasons,
  e."portfolioId" AS portfolio_id,
  e."startDate" AS start_date,
  e."endDate" AS end_date,
  e."budgetCaps" AS budget_caps,
  e."optimization" AS optimization,
  e."targetingSettings" AS targeting_settings,
  e."tags" AS tags,
  e."costType" AS cost_type,
  e."isMultiAdGroupsEnabled" AS is_multi_ad_groups_enabled,
  e."brandEntityId" AS brand_entity_id,
  COALESCE(e."creationDateTime", s."creationDateTime") AS creation_date_time,
  GREATEST(e."lastUpdatedDateTime", s."lastUpdatedDateTime") AS last_updated_date_time,
  e."lastUpdatedDateTime" AS export_last_updated_date_time,
  s."lastUpdatedDateTime" AS stream_last_updated_date_time,
  s."version" AS stream_version
FROM "amzadapi_exports_v1__campaign" e
FULL OUTER JOIN "amzms_v1__campaigns" s
  ON e."merchantId" = s."advertiser_id"
  AND e."marketplaceId" = s."marketplace_id"
  AND e."campaignId" = s."campaignId";
COMMENT ON COLUMN "workspace"."amazon_ads_campaign"."state" IS 'Fresher of Export/stream state (ENABLED/PAUSED)';
COMMENT ON COLUMN "workspace"."amazon_ads_campaign"."name" IS 'Fresher of Export/stream campaign name';
COMMENT ON COLUMN "workspace"."amazon_ads_campaign"."delivery_status" IS 'Export-only serving status';
COMMENT ON COLUMN "workspace"."amazon_ads_campaign"."delivery_reasons" IS 'Export-only delivery reasons (JSONB)';
COMMENT ON COLUMN "workspace"."amazon_ads_campaign"."budget_caps" IS 'Export budget caps (JSONB)';
COMMENT ON COLUMN "workspace"."amazon_ads_campaign"."last_updated_date_time" IS 'Newest lastUpdatedDateTime across Export and stream';
COMMENT ON COLUMN "workspace"."amazon_ads_campaign"."stream_version" IS 'Latest stream snapshot version (null: no stream row)';
```

<a id="relation-110"></a>

### view: `amazon_ads_target`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_ads_target" WITH (security_invoker) AS
SELECT
  COALESCE(e."merchantId", s."advertiser_id") AS merchant_id,
  COALESCE(e."marketplaceId", s."marketplace_id") AS marketplace_id,
  COALESCE(e."targetId", s."targetId") AS target_id,
  COALESCE(e."adGroupId", s."adGroupId") AS ad_group_id,
  COALESCE(e."campaignId", s."campaignId") AS campaign_id,
  COALESCE(e."adProduct", s."adProduct") AS ad_product,
  CASE WHEN s."lastUpdatedDateTime" > COALESCE(e."lastUpdatedDateTime", '-infinity')
    THEN s."state" ELSE e."state" END AS state,
  COALESCE(e."negative", s."negative") AS negative,
  COALESCE(e."targetType", s."targetType") AS target_type,
  e."targetLevel" AS target_level,
  e."targetDetails" AS target_details,
  e."bid" AS bid,
  e."deliveryStatus" AS delivery_status,
  e."deliveryReasons" AS delivery_reasons,
  COALESCE(e."creationDateTime", s."creationDateTime") AS creation_date_time,
  GREATEST(e."lastUpdatedDateTime", s."lastUpdatedDateTime") AS last_updated_date_time,
  e."lastUpdatedDateTime" AS export_last_updated_date_time,
  s."lastUpdatedDateTime" AS stream_last_updated_date_time,
  s."version" AS stream_version
FROM "amzadapi_exports_v1__target" e
FULL OUTER JOIN "amzms_v1__targets" s
  ON e."merchantId" = s."advertiser_id"
  AND e."marketplaceId" = s."marketplace_id"
  AND e."targetId" = s."targetId";
COMMENT ON COLUMN "workspace"."amazon_ads_target"."state" IS 'Fresher of Export/stream state (ENABLED/PAUSED)';
COMMENT ON COLUMN "workspace"."amazon_ads_target"."target_level" IS 'Export-only target level';
COMMENT ON COLUMN "workspace"."amazon_ads_target"."target_details" IS 'Export-only target details incl. resolved fields (JSONB)';
COMMENT ON COLUMN "workspace"."amazon_ads_target"."bid" IS 'Export-only bid';
COMMENT ON COLUMN "workspace"."amazon_ads_target"."delivery_status" IS 'Export-only serving status';
COMMENT ON COLUMN "workspace"."amazon_ads_target"."delivery_reasons" IS 'Export-only delivery reasons (JSONB)';
COMMENT ON COLUMN "workspace"."amazon_ads_target"."last_updated_date_time" IS 'Newest lastUpdatedDateTime across Export and stream';
COMMENT ON COLUMN "workspace"."amazon_ads_target"."stream_version" IS 'Latest stream snapshot version (null: no stream row)';
```

<a id="relation-111"></a>

### view: `amazon_fba_inventory_summary`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_fba_inventory_summary" WITH (security_invoker) AS
SELECT
    "merchantId" as merchant_id,
    "marketplaceId" as marketplace_id,
    "sellerSku" as sku,
    doc->>'asin' as asin,
    doc->>'fnSku' as fnsku,
    doc->>'condition' as condition,
    (doc->'inventoryDetails'->'fulfillableQuantity')::int as fulfillable,
    (doc->'inventoryDetails'->'inboundWorkingQuantity')::int as inbound_working,
    (doc->'inventoryDetails'->'inboundShippedQuantity')::int as inbound_shipped,
    (doc->'inventoryDetails'->'inboundReceivingQuantity')::int as inbound_receiving,
    (doc->'inventoryDetails'->'reservedQuantity'->'totalReservedQuantity')::int as total_reserved,
    (doc->'inventoryDetails'->'reservedQuantity'->'pendingCustomerOrderQuantity')::int as pending_customer_order,
    (doc->'inventoryDetails'->'reservedQuantity'->'pendingTransshipmentQuantity')::int as pending_transshipment,
    (doc->'inventoryDetails'->'reservedQuantity'->'fcProcessingQuantity')::int as fc_processing,
    (doc->'inventoryDetails'->'researchingQuantity'->'totalResearchingQuantity')::int as total_researching,
    (doc->'inventoryDetails'->'unfulfillableQuantity'->'totalUnfulfillableQuantity')::int as total_unfulfillable,
    (doc->'inventoryDetails'->'unfulfillableQuantity'->'customerDamagedQuantity')::int as customer_damaged,
    (doc->'inventoryDetails'->'unfulfillableQuantity'->'warehouseDamagedQuantity')::int as warehouse_damaged,
    (doc->'inventoryDetails'->'unfulfillableQuantity'->'distributorDamagedQuantity')::int as distributor_damaged,
    (doc->'inventoryDetails'->'unfulfillableQuantity'->'carrierDamagedQuantity')::int as carrier_damaged,
    (doc->'inventoryDetails'->'unfulfillableQuantity'->'defectiveQuantity')::int as defective,
    (doc->'inventoryDetails'->'unfulfillableQuantity'->'expiredQuantity')::int as expired,
    (doc->'totalQuantity')::int  as total,
    NULLIF(btrim(doc->>'lastUpdatedTime'), '')::timestamptz as last_updated_time,
    doc->>'productName' as product_name
FROM "amzspapi_fbaInventory_v1__InventorySummary";
```

<a id="relation-112"></a>

### view: `amazon_listing_all`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_listing_all" WITH (security_invoker) AS
SELECT
	l."merchantId" AS merchant_id,
	l."marketplaceId" AS marketplace_id,
	l."sellerSku" AS seller_sku,
	m.country_code,
	l.doc->>'asin1' AS asin,
	l.doc->>'listing-id' AS listing_id,
	l.doc->>'item-name' AS item_name,
	l.doc->>'item-description' AS item_description,
	l.doc->>'item-note' AS item_note,
	l.doc->>'item-condition' AS item_condition,
	CASE l.doc->>'item-condition'
		WHEN '1' THEN 'Used - Like New'
		WHEN '2' THEN 'Used - Very Good'
		WHEN '3' THEN 'Used - Good'
		WHEN '4' THEN 'Used - Acceptable'
		WHEN '5' THEN 'Collectible - Like New'
		WHEN '6' THEN 'Collectible - Very Good'
		WHEN '7' THEN 'Collectible - Good'
		WHEN '8' THEN 'Collectible - Acceptable'
		WHEN '10' THEN 'Refurbished'
		WHEN '11' THEN 'New'
		ELSE l.doc->>'item-condition'
	END AS item_condition_name,
	l.doc->>'status' AS status,
	l.doc->>'fulfillment-channel' AS fulfillment_channel,
	CASE
		WHEN l.doc->>'fulfillment-channel' LIKE 'AMAZON%' THEN 'FBA'
		ELSE 'FBM'
	END AS fulfillment_channel_type,
	(l.doc->>'price')::NUMERIC AS price,
	(l.doc->>'quantity')::INTEGER AS quantity,
	(l.doc->>'pending-quantity')::INTEGER AS pending_quantity,
	l.doc->>'product-id' AS product_id,
	l.doc->>'product-id-type' AS product_id_type,
	TO_TIMESTAMP(
		REGEXP_REPLACE(l.doc->>'open-date', ' (PST|PDT|MST|MDT|CST|CDT|EST|EDT)$', ''),
		'YYYY-MM-DD HH24:MI:SS'
	) AS open_date,
	l.doc->>'merchant-shipping-group' AS merchant_shipping_group,
	l.doc->>'item-is-marketplace' AS item_is_marketplace
FROM "amzreport_MERCHANT_LISTINGS_ALL" l
LEFT JOIN amazon_marketplace m ON l."marketplaceId" = m.marketplace_id
WHERE l."deletedAt" IS NULL;
COMMENT ON COLUMN "workspace"."amazon_listing_all"."merchant_id" IS 'Merchant identifier (part of primary key)';
COMMENT ON COLUMN "workspace"."amazon_listing_all"."marketplace_id" IS 'Amazon marketplace identifier (part of primary key)';
COMMENT ON COLUMN "workspace"."amazon_listing_all"."seller_sku" IS 'Seller SKU (part of primary key)';
COMMENT ON COLUMN "workspace"."amazon_listing_all"."country_code" IS 'Country code derived from marketplace (US, CA, MX, etc.)';
COMMENT ON COLUMN "workspace"."amazon_listing_all"."asin" IS 'Amazon Standard Identification Number';
COMMENT ON COLUMN "workspace"."amazon_listing_all"."item_condition" IS 'Amazon condition code (11=New, 4=Used Acceptable, etc.)';
COMMENT ON COLUMN "workspace"."amazon_listing_all"."item_condition_name" IS 'Human-readable condition name';
COMMENT ON COLUMN "workspace"."amazon_listing_all"."status" IS 'Listing status: Active, Inactive, or Incomplete';
COMMENT ON COLUMN "workspace"."amazon_listing_all"."fulfillment_channel_type" IS 'FBA or FBM derived from fulfillment_channel';
```

<a id="relation-113"></a>

### view: `amazon_listing_open`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_listing_open" WITH (security_invoker) AS
SELECT
	l."merchantId" AS merchant_id,
	l."marketplaceId" AS marketplace_id,
	l."sellerSku" AS seller_sku,
	m.country_code,
	l.doc->>'asin' AS asin,
	(l.doc->>'price')::NUMERIC AS price,
	(l.doc->>'Business Price')::NUMERIC AS business_price,
	(l.doc->>'quantity')::INTEGER AS quantity,
	l.doc->>'Quantity Price Type' AS quantity_price_type,
	(l.doc->>'Quantity Lower Bound 1')::INTEGER AS quantity_lower_bound_1,
	(l.doc->>'Quantity Price 1')::NUMERIC AS quantity_price_1,
	(l.doc->>'Quantity Lower Bound 2')::INTEGER AS quantity_lower_bound_2,
	(l.doc->>'Quantity Price 2')::NUMERIC AS quantity_price_2,
	(l.doc->>'Quantity Lower Bound 3')::INTEGER AS quantity_lower_bound_3,
	(l.doc->>'Quantity Price 3')::NUMERIC AS quantity_price_3,
	(l.doc->>'Quantity Lower Bound 4')::INTEGER AS quantity_lower_bound_4,
	(l.doc->>'Quantity Price 4')::NUMERIC AS quantity_price_4,
	(l.doc->>'Quantity Lower Bound 5')::INTEGER AS quantity_lower_bound_5,
	(l.doc->>'Quantity Price 5')::NUMERIC AS quantity_price_5
FROM "amzreport_OPEN_LISTINGS" l
LEFT JOIN amazon_marketplace m ON l."marketplaceId" = m.marketplace_id
WHERE l."deletedAt" IS NULL;
COMMENT ON COLUMN "workspace"."amazon_listing_open"."merchant_id" IS 'Merchant identifier (part of primary key)';
COMMENT ON COLUMN "workspace"."amazon_listing_open"."marketplace_id" IS 'Amazon marketplace identifier (part of primary key)';
COMMENT ON COLUMN "workspace"."amazon_listing_open"."seller_sku" IS 'Seller SKU (part of primary key)';
COMMENT ON COLUMN "workspace"."amazon_listing_open"."country_code" IS 'Country code derived from marketplace';
COMMENT ON COLUMN "workspace"."amazon_listing_open"."price" IS 'Consumer listing price';
COMMENT ON COLUMN "workspace"."amazon_listing_open"."business_price" IS 'B2B base price (may be NULL)';
COMMENT ON COLUMN "workspace"."amazon_listing_open"."quantity_price_type" IS 'B2B tiered pricing type (percent_off, fixed, etc.)';
```

<a id="relation-114"></a>

### view: `amazon_orders_by_day_and_sku`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_orders_by_day_and_sku" WITH (security_invoker) AS
SELECT
	'day'::text AS time_unit,
	date(o."time" AT TIME ZONE COALESCE(m.time_zone, c.time_zone, 'UTC')) AS local_date_first,
	date(o."time" AT TIME ZONE COALESCE(m.time_zone, c.time_zone, 'UTC')) AS local_date_last,
	o."merchantId" AS merchant_id,
	o."marketplaceId" AS marketplace_id,
	o."doc"->>'SellerSKU' AS sku,
	o."doc"->>'ASIN' AS asin,
	(o."doc"->'ItemPrice')->>'CurrencyCode' AS currency,
	count(*) AS order_count,
	sum((o."doc"->'QuantityOrdered')::integer) AS total_quantity_ordered,
	sum((o."doc"->'QuantityShipped')::integer) AS total_quantity_shipped,
	sum(((o."doc"->'ItemPrice')->>'Amount')::numeric) AS total_price,
	sum(((o."doc"->'ItemTax')->>'Amount')::numeric) AS total_tax,
	sum(((o."doc"->'PromotionDiscount')->>'Amount')::numeric) AS total_promo,
	sum(((o."doc"->'PromotionDiscountTax')->>'Amount')::numeric) AS total_promo_tax,
	sum(
		COALESCE(((o."doc"->'ItemPrice')->>'Amount')::numeric, 0)
		- COALESCE(((o."doc"->'PromotionDiscount')->>'Amount')::numeric, 0)
	) AS total_excl_tax,
	sum(
		COALESCE(((o."doc"->'ItemPrice')->>'Amount')::numeric, 0)
		+ COALESCE(((o."doc"->'ItemTax')->>'Amount')::numeric, 0)
		- COALESCE(((o."doc"->'PromotionDiscount')->>'Amount')::numeric, 0)
		- COALESCE(((o."doc"->'PromotionDiscountTax')->>'Amount')::numeric, 0)
	) AS total_incl_tax,
	avg(((o."doc"->'ItemPrice')->>'Amount')::numeric)::numeric(12,2) AS avg_line_price,
	min(o."time") AS first_order_time,
	max(o."time") AS last_order_time
FROM "amzspapi_orders_v0__OrderItem" o
LEFT JOIN "amazon_marketplace" m ON o."marketplaceId" = m."marketplace_id"
LEFT JOIN "amazon_country" c ON m."country_code" = c."country_code"
WHERE (o."doc"->'QuantityOrdered')::integer > 0
GROUP BY
	date(o."time" AT TIME ZONE COALESCE(m.time_zone, c.time_zone, 'UTC')),
	o."merchantId",
	o."marketplaceId",
	o."doc"->>'SellerSKU',
	o."doc"->>'ASIN',
	(o."doc"->'ItemPrice')->>'CurrencyCode'
ORDER BY
	date(o."time" AT TIME ZONE COALESCE(m.time_zone, c.time_zone, 'UTC')) DESC,
	o."doc"->>'SellerSKU';;
```

<a id="relation-115"></a>

### view: `amazon_sales_and_traffic`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."amazon_sales_and_traffic" WITH (security_invoker) AS
SELECT
  "merchantId" as merchant_id,
  "marketplaceId" as marketplace_id,
  "date" as date,
  "sku" as sku,
  "parentAsin" as parent_asin,
  "childAsin" as child_asin,
  "createdAt" as created_at,
  "updatedAt" as updated_at,

  -- Sales metrics
  (sales->>'unitsOrdered')::decimal as units_ordered,
  (sales->>'totalOrderItems')::decimal as total_order_items,
  (sales->>'unitsOrderedB2B')::decimal as units_ordered_b2b,
  (sales->>'totalOrderItemsB2B')::decimal as total_order_items_b2b,
  (sales->'orderedProductSales'->>'amount')::decimal as ordered_product_sales,
  (sales->'orderedProductSalesB2B'->>'amount')::decimal as ordered_product_sales_b2b,

  -- Traffic metrics
  (traffic->>'sessions')::decimal as sessions,
  (traffic->>'pageViews')::decimal as page_views,
  (traffic->>'sessionsB2B')::decimal as sessions_b2b,
  (traffic->>'pageViewsB2B')::decimal as page_views_b2b,
  (traffic->>'browserSessions')::decimal as browser_sessions,
  (traffic->>'browserPageViews')::decimal as browser_page_views,
  (traffic->>'buyBoxPercentage')::decimal as buy_box_percentage,
  (traffic->>'mobileAppSessions')::decimal as mobile_app_sessions,
  (traffic->>'sessionPercentage')::decimal as session_percentage,
  (traffic->>'browserSessionsB2B')::decimal as browser_sessions_b2b,
  (traffic->>'mobileAppPageViews')::decimal as mobile_app_page_views,
  (traffic->>'browserPageViewsB2B')::decimal as browser_page_views_b2b,
  (traffic->>'buyBoxPercentageB2B')::decimal as buy_box_percentage_b2b,
  (traffic->>'pageViewsPercentage')::decimal as page_views_percentage,
  (traffic->>'mobileAppSessionsB2B')::decimal as mobile_app_sessions_b2b,
  (traffic->>'mobileAppPageViewsB2B')::decimal as mobile_app_page_views_b2b,
  (traffic->>'unitSessionPercentage')::decimal as unit_session_percentage,
  (traffic->>'browserSessionPercentage')::decimal as browser_session_percentage,
  (traffic->>'unitSessionPercentageB2B')::decimal as unit_session_percentage_b2b,
  (traffic->>'browserPageViewsPercentage')::decimal as browser_page_views_percentage,
  (traffic->>'mobileAppSessionPercentage')::decimal as mobile_app_session_percentage,
  (traffic->>'mobileAppPageViewsPercentage')::decimal as mobile_app_page_views_percentage

FROM "amzreport_SALES_AND_TRAFFIC__skuByDay"
ORDER BY
  date desc,
  sku asc;
```

<a id="relation-116"></a>

### view: `brand_ontology_category`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."brand_ontology_category" WITH (security_invoker) AS
SELECT
	c."category",
	c."description",
	c."dataResolved" AS "data",
	c."data"         AS "dataSelf"
FROM "brand_config_ontology_category" c;
```

<a id="relation-117"></a>

### view: `brand_ontology_variant`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."brand_ontology_variant" WITH (security_invoker) AS
SELECT
	v."msku",
	v."category",
	v."dataResolved" AS "data"
FROM "brand_config_ontology_variant" v;
```

<a id="relation-118"></a>

### view: `brand_ontology_amazon_family`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."brand_ontology_amazon_family" WITH (security_invoker) AS
SELECT
	f."family",
	f."category",
	f."msku",
	f."label",
	f."description",
	c."dataResolved" AS "data"
FROM "brand_config_amazon_family" f
JOIN "brand_config_ontology_category" c ON c."category" = f."category";
```

<a id="relation-119"></a>

### view: `brand_ontology_amazon_asin`

Category: Curated views

```sql
CREATE OR REPLACE VIEW "workspace"."brand_ontology_amazon_asin" WITH (security_invoker) AS
SELECT
	a."asin",
	a."msku",
	a."family",
	a."countryToFamily",
	a."labelInFamily",
	a."countryToLabelInFamily",
	a."labelStandalone",
	a."description",
	v."category"     AS "variantCategory",
	f."category"     AS "familyCategory",
	v."dataResolved" AS "data"
FROM "brand_config_amazon_asin" a
LEFT JOIN "brand_config_ontology_variant" v ON v."msku" = a."msku"
LEFT JOIN "brand_config_amazon_family" f    ON f."family" = a."family"
WHERE v."msku" IS NOT NULL OR f."category" IS NOT NULL;
```


