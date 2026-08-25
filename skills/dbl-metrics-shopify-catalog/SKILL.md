---
name: dbl-metrics-shopify-catalog
description: Look up the Shopify catalogue — products, variants, SKUs, prices, compare-at prices, vendor, product type, status, published state, and the SKU-to-variant mapping used to join Shopify to other sources. Use when the user asks what products or variants exist on Shopify, Shopify pricing, which products are unpublished or draft, or needs to map a Shopify SKU to a product.
metadata:
  type: metric
  audience: client
  tool: executeSql
---

# What is in the Shopify catalogue?

Use `executeSql` against `shopify_products_v1__Product` and
`shopify_products_v1__ProductVariant`, one row per `(shopId, id)`, the variant
carrying its parent `productId`.

**Read `${CLAUDE_PLUGIN_ROOT}/docs/shopify-data-shape.md` first.**

## The catalogue is a snapshot, not a history

Both tables are refreshed as a whole set per shop: every row of a successful run
is stamped with that run's instant and rows older than it are deleted. So they
describe the catalogue **as it is now**, and a product removed from Shopify
disappears here rather than being marked deleted.

For what a product was called or priced at the time of sale, use the line item's
own `title`, `sku`, `vendor` and price columns — see
`dbl-metrics-shopify-orders`. Do not reconstruct a historical price from this
table.

`shopifyUpdatedAt` is Shopify's own instant and is **not** a watermark here,
because the family is a whole-set read.

## Prices

`ProductVariant.price` and `compareAtPrice` are exact decimal strings in NUMERIC
— never cast to float. Shopify's scalar `Money` carries no currency code, so the
`currencyCode` column beside them is the **shop's** currency captured at import
time, not a per-row fact. `compareAtPrice` is usually null (420 of 445 measured
rows); a non-null value is the struck-through reference price.

## Status and visibility

- `Product.status` — `ACTIVE`, `DRAFT`, `ARCHIVED`. Stored as text, not an enum:
  Shopify may add a member in any quarterly version.
- `Product.shopifyPublishedAt` — null means unpublished (9 of 49 measured rows).
  A product can be `ACTIVE` and unpublished.
- `Product.totalInventory` is Shopify's own rollup. For anything more than a
  headline figure use `dbl-metrics-shopify-inventory`, which has the per-location
  detail and the `tracked` filter that makes the numbers mean something.
- `ProductVariant.inventoryQuantity` is null for an untracked variant.

## Joining out

- Variant → inventory: `ProductVariant.inventoryItemId` matches
  `shopify_inventory_v1__InventoryLevel.inventoryItemId`. This is the reliable
  path; do not go through the level's `variantId`, which is nullable.
- Variant → line items: `ProductVariant.id` matches `OrderLineItem.variantId`,
  nullable on the line-item side where the variant was deleted.
- Product → variants: `ProductVariant.productId`. Always carry `shopId` in the
  join too; ids are only unique within a shop.

## SKU is the cross-source key, and it is not guaranteed

`sku` is nullable on both the variant and the line item, though it measured 100%
filled on the store it was profiled against. It is how Shopify lines up with TFL
(`tfl_products_v1__SkuProduct`) and, where the merchant uses one scheme, with
Amazon seller SKUs.

Check before relying on it — a null or duplicate SKU breaks a cross-source join
silently:

```sql
SELECT COUNT(*) AS "variants",
       COUNT("sku") AS "withSku",
       COUNT(DISTINCT "sku") AS "distinctSku"
FROM "shopify_products_v1__ProductVariant" WHERE "shopId" = $shop;
```

## The catalogue listing

```sql
SELECT p."title", p."status", p."vendor", p."productType",
       p."shopifyPublishedAt" IS NOT NULL AS "published",
       v."title" AS "variant", v."sku", v."price", v."currencyCode",
       v."inventoryQuantity"
FROM "shopify_products_v1__Product" AS p
JOIN "shopify_products_v1__ProductVariant" AS v
  ON v."shopId" = p."shopId" AND v."productId" = p."id"
WHERE p."shopId" = $shop
ORDER BY p."title", v."position";
```

`v."position"` is the variant's order within its product, which is the order the
merchant sees. `variant."title"` is commonly `"Default Title"` on a
single-variant product — suppress it rather than showing it to the user.

## More than one shop

A workspace can hold several storefronts with overlapping product names and
independent id spaces. Filter to one `shopId` or group by it, and join
`shopify_shop_v1__Shop` for the name.

## Follow-ups

`dbl-metrics-shopify-inventory` for stock, `dbl-metrics-shopify-orders` for what
actually sold, `dbl-metrics-shopify-sales` for store-level performance.
