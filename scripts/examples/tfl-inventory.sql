WITH "latestSnapshot" AS (
	SELECT
		"connectorId",
		MAX("localdate") AS "snapshotDate"
	FROM "tfl_products_v1__WarehouseInventory"
	GROUP BY "connectorId"
),
"skuMap" AS (
	SELECT
		"connectorId",
		"productId",
		JSONB_AGG(
			JSONB_BUILD_OBJECT(
				'sku', "sku",
				'qtyMultiplier', "qtyMultiplier"
			)
			ORDER BY "sku"
		) AS "skus"
	FROM "tfl_products_v1__SkuProduct"
	GROUP BY "connectorId", "productId"
)
SELECT
	"warehouse"."localdate" AS "snapshotDate",
	"warehouse"."connectorId",
	"warehouse"."warehouseId",
	"warehouse"."warehouseName",
	"warehouse"."productId",
	"product"."productName",
	"warehouse"."quantity",
	"warehouse"."allocated",
	"warehouse"."available",
	COALESCE("skuMap"."skus", '[]'::JSONB) AS "skus"
FROM "tfl_products_v1__WarehouseInventory" AS "warehouse"
INNER JOIN "latestSnapshot"
	ON "latestSnapshot"."connectorId" = "warehouse"."connectorId"
	AND "latestSnapshot"."snapshotDate" = "warehouse"."localdate"
LEFT JOIN "tfl_products_v1__Inventory" AS "product"
	ON "product"."connectorId" = "warehouse"."connectorId"
	AND "product"."productId" = "warehouse"."productId"
LEFT JOIN "skuMap"
	ON "skuMap"."connectorId" = "warehouse"."connectorId"
	AND "skuMap"."productId" = "warehouse"."productId"
ORDER BY
	"warehouse"."available" ASC,
	"product"."productName" ASC,
	"warehouse"."warehouseName" ASC;
