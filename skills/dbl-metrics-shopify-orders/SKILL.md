---
name: dbl-metrics-shopify-orders
description: Analyze Shopify orders and line items — units sold by product or SKU, revenue, refunds, discounts, shipping and tax, order counts, geography, customers and repeat purchase. Use when the user asks what sold on Shopify, best sellers, Shopify refunds or returns, where Shopify orders ship, Shopify customer or repeat-order questions, or wants Shopify sales history older than the daily reports.
metadata:
  type: metric
  audience: client
  tool: executeSql
---

# What sold on Shopify?

Use `executeSql` against `shopify_orders_v1__Order` (one row per
`(shopId, id)`) and `shopify_orders_v1__OrderLineItem` (one row per line, parent
`orderId`).

**Read `${CLAUDE_PLUGIN_ROOT}/docs/shopify-data-shape.md` first.**

## Before any revenue number

- **`WHERE NOT "test"`.** Test orders are real rows.
- **Use the `*ShopAmount` columns**, not `*Presentment`, and check the matching
  `*ShopCurrency`. A measured store carried USD on 49,897 rows and AUD on 188, so
  an unfiltered `SUM` adds two currencies together. Filter or group by currency.
- **Net revenue is `"totalPriceShopAmount" - "totalRefundedShopAmount"`.** The
  refund column is 0, never null, on an unrefunded order.
- **Decide on cancellations.** `shopifyCancelledAt` is filled on about 1.66% of
  orders. Exclude them or say you did not.
- **These totals will not match `shopify_reports_v1__SalesDaily`**, by design —
  measured 51,885.43 here against 49,685.19 there over the same 24 days, and 977
  order rows against the report's 967. Pick the source the question is about and
  name it. See `dbl-metrics-shopify-sales`.

## Which date column

- `shopifyProcessedAt` — when the payment provider processed it. Use this for
  revenue by day; it is what the reports align to.
- `shopifyCreatedAt` — when the order was placed.
- `shopifyUpdatedAt` — **not** a change feed. Shopify truncates it to the second.
  Never filter on it to find recent changes.

All three are UTC instants. To bucket by the shop's own day, convert through
`Shop.ianaTimezone`:

```sql
(o."shopifyProcessedAt" AT TIME ZONE sh."ianaTimezone")::date AS "shopDay"
```

## Units sold: `currentQuantity`, not `quantity`

`quantity` is what was ordered; `currentQuantity` is what remains after refunds
and removals. "Units sold" means `currentQuantity` unless the user asks about
what was originally ordered. Say which you used.

Line-item money is **shopMoney only** — there is no presentment pair.
`discountedTotalAmount` is after line discounts, `originalTotalAmount` before.

```sql
SELECT li."sku", li."title",
       SUM(li."currentQuantity")      AS "unitsSold",
       SUM(li."discountedTotalAmount") AS "revenue",
       li."discountedTotalCurrency"    AS "currency"
FROM "shopify_orders_v1__OrderLineItem" AS li
JOIN "shopify_orders_v1__Order" AS o
  ON o."shopId" = li."shopId" AND o."id" = li."orderId"
WHERE o."shopId" = $shop AND NOT o."test"
  AND o."shopifyProcessedAt" >= $start AND o."shopifyProcessedAt" < $end
GROUP BY li."sku", li."title", li."discountedTotalCurrency"
ORDER BY "unitsSold" DESC
LIMIT 50;
```

Note the join carries `shopId` on both sides. `orderId` alone is not unique
across shops.

**Exclude add-on services before presenting a ranking.** They sell as ordinary
line items — on a measured store "Shipping Protection" ranked third by units in a
month, above real products, on $283.71 of revenue. Check the titles, drop the
non-products, and say you did.

## Joining to the catalogue

`productId` and `variantId` on a line item are **nullable, and null is
meaningful** — Shopify severs the reference when a product is deleted (2,275 of
78,124 measured rows). `LEFT JOIN` to `shopify_products_v1__Product` /
`shopify_products_v1__ProductVariant` and report the unmatched rows as "deleted
products" rather than dropping them. The line item keeps `title`, `sku` and
`vendor` as they were at the time of sale, which is often the better source for a
historical report anyway.

## Geography

`shippingCountryCodeV2`, `shippingProvinceCode`, `shippingCity` and the billing
equivalents are promoted onto the order; street lines, zip and phone stay in
`doc` and should not be selected for a report. The address itself is nullable.

## Customers and repeat purchase

`Order.customerId` joins to `shopify_customers_v1__Customer.id` (nullable — guest
or removed customer). That table carries `numberOfOrders`, `lastOrderId`,
`amountSpent` and `state`.

**Do not reconcile `amountSpent` against a sum of the customer's order totals.**
Measured on one store, every `amountSpent` was USD while the orders corpus
carried AUD on some rows, so the two are in different currencies with no
conversion available. Store-level repeat-customer rates are better taken from
`shopify_reports_v1__SalesDaily.returning_customer_rate`, which is the source's
own.

Customer identity fields — email, phone, name, addresses — live in `doc`. Select
them only when the task genuinely needs them, and never dump the column.

## Discounts

`shopify_discounts_v1__Discount` holds one row per discount with `title`,
`status`, `discountType`, `summary`, `startsAt`/`endsAt`, `usageLimit` and
`asyncUsageCount`; `shopify_discounts_v1__DiscountRedeemCode` holds its codes,
joined on the discount's `id`. `asyncUsageCount` is a redemption count, **not** a
freshness signal. Note the table may cover fewer shops than the workspace has —
one workspace had it on 2 of 3.

Order-level discount money is `totalDiscountsShopAmount` on the order, and it is
positive there (unlike the report table's `discounts`, which is negative).

## History

This family reaches much further back than the daily reports — one workspace held
orders from 2015 while the reports started a month ago. It is the right source
for any long-run trend, provided you say it counts differently from the reports.

## Follow-ups

`dbl-metrics-shopify-sales` for the merchant's own reported revenue and traffic,
`dbl-metrics-shopify-catalog` for the current catalogue and pricing,
`dbl-metrics-shopify-inventory` for stock.
