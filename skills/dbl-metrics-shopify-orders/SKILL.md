---
name: dbl-metrics-shopify-orders
description: Analyze Shopify orders and line items — units sold by product or SKU, revenue, refunds, discounts, shipping and tax, order counts, geography, customers and repeat purchase. Use when the user asks what sold on Shopify, best sellers, Shopify refunds or returns, where Shopify orders ship, Shopify customer or repeat-order questions, or wants Shopify sales history older than the daily reports.
metadata:
    type: metric
    audience: client
    tool: executeSql
---

# What sold on Shopify?

On a user- or organization-scoped connector, call `listWorkspaces`, select the
workspace, and pass its `wsid` explicitly to every data tool. A workspace-scoped
connector URL supplies that `wsid`. Never infer it from stores or from a registry
that happens to contain one entry.

Use `executeSql` against `shopify_orders_v1__Order` (one row per
`(shopId, id)`) and `shopify_orders_v1__OrderLineItem` (one row per line, parent
`orderId`).

**Read `${CLAUDE_PLUGIN_ROOT}/docs/shopify-data-shape.md` first.** For the
declared columns and types of any `shopify_*` table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/shopify/index.tsv` and then that table's
`.yaml` beside it.

## Before any revenue number

- **`WHERE NOT "test"`.** Test orders are real rows.
- **Use the `*ShopAmount` columns**, not `*Presentment`, and check the matching
  `*ShopCurrency`. One shop can carry rows in more than one currency, so an
  unfiltered `SUM` adds two currencies together. Filter or group by currency.
- **Net revenue is `"totalPriceShopAmount" - "totalRefundedShopAmount"`.** The
  refund column is 0, never null, on an unrefunded order.
- **Decide on cancellations.** `shopifyCancelledAt` is filled on a small
  percentage of orders. Exclude them or say you did not.
- **These totals will not match `shopify_reports_v1__SalesDaily`**, by design —
  over the same window the two disagree on revenue and on the number of orders.
  Pick the source the question is about and name it. See
  `dbl-metrics-shopify-sales`.

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
line items, and a shipping-protection or warranty line can outrank real products
by units in a month on very little revenue. Check the titles, drop the
non-products, and say you did.

## Joining to the catalogue

`productId` and `variantId` on a line item are **nullable, and null is
meaningful** — Shopify severs the reference when a product is deleted, on a
small but steady fraction of rows. `LEFT JOIN` to
`shopify_products_v1__Product` / `shopify_products_v1__ProductVariant` and
report the unmatched rows as "deleted products" rather than dropping them. The
line item keeps `title`, `sku` and `vendor` as they were at the time of sale,
which is often the better source for a historical report anyway.

## Geography

`shippingCountryCodeV2`, `shippingProvinceCode`, `shippingCity` and the billing
equivalents are promoted onto the order; street lines, zip and phone stay in
`doc` and should not be selected for a report. The address itself is nullable.

## Customers and repeat purchase

`Order.customerId` joins to `shopify_customers_v1__Customer.id` (nullable — guest
or removed customer). That table carries `numberOfOrders`, `lastOrderId`,
`amountSpent` and `state`.

**Do not reconcile `amountSpent` against a sum of the customer's order totals.**
`amountSpent` is in one currency for every customer while the orders corpus can
carry more than one, so the two can be in different currencies with no
conversion available. Store-level repeat-customer rates are better taken from
`shopify_reports_v1__SalesDaily.returning_customer_rate`, which is the source's
own.

Customer identity fields — email, phone, name, addresses — live in `doc`. Select
them only when the task genuinely needs them, and never dump the column.

## Discounts

`shopify_discounts_v1__Discount` is one row per `(shopId, id)`, and **`id` here
is a GID string**, not the numeric id every other table uses:
`gid://shopify/DiscountCodeNode/<n>` or `gid://shopify/DiscountAutomaticNode/<n>`.
`shopify_discounts_v1__DiscountRedeemCode.discountGid` joins to it, also a GID.

`fetchedAt` is the refresh marker — **this family has no `updatedAt` column at
all**. It is read as a whole set with no watermark, and rows the latest
successful run did not return are deleted.

### It is a union of eight member types, so most nulls mean "not declared"

`discountType` is the discriminator: `DiscountCode{Basic,Bxgy,FreeShipping,App}`
and `DiscountAutomatic{Basic,Bxgy,FreeShipping,App}`. Only eleven fields are
declared by every member; the rest are null on the members that do not declare
them, which is **not the same as an empty value**. `nodeType` is the coarse
code-versus-automatic split, derived from the GID independently of
`discountType`, so the two can be checked against each other.

In practice `DiscountCodeBasic` is the overwhelming majority of the rows, and
the other members appear in small numbers or not at all — so a report that only
ever sees Basic rows has still not been tested against the union.

The nulls that will mislead a report:

- **`usageLimit` is null for two indistinguishable reasons** — an automatic
  discount does not declare the field at all, and a code discount declares it
  null meaning _unlimited_. It is non-null on only a small minority of rows.
  Never render a null as "unlimited" without checking `nodeType` first.
- **`summary` is absent on the two App members**, so it is null on every App
  row. For those, `appDiscountTypeTitle` is the closest thing to a description.
- **`shortSummary` is declared only by the Basic and FreeShipping members** —
  null on every Bxgy and App row.
- **`totalSalesAmount` null means never redeemed**, not missing: it is non-null
  on roughly half the rows. Paired with `totalSalesCurrency`, null exactly when
  it is.
- **`endsAt` null means no end date.**
- **`appliesOncePerCustomer` null means the discount is automatic.**
- **`codeCount` is null on automatic discounts** and, where present, equals the
  number of `DiscountRedeemCode` rows for that discount — the importer verifies
  that rather than assuming it, so a mismatch is worth reporting rather than
  working around.

### The rest

`status` is `ACTIVE`, `EXPIRED` or `SCHEDULED`, stored as text rather than an
enum so a new Shopify member arrives as a row instead of an ingest failure.
`discountClasses` is a JSONB array over `PRODUCT` / `ORDER` / `SHIPPING`, not a
scalar. `asyncUsageCount` is a redemption count on both tables and is **not** a
freshness signal — whether a redemption moves `shopifyUpdatedAt` has never been
observed. Member-specific fields no column promotes stay in `doc`, which does
**not** contain the redeem codes; those are their own rows.

The table may cover fewer shops than the workspace has — one workspace had
discounts on 2 of its 3 shops.

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
