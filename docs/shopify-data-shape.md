# Shopify data shape

Read this before writing SQL against any `shopify_*` table. Every rule below is
a way to be confidently wrong, and most of them are silent — the query runs and
returns a number that is not the number asked for.

There is no dedicated Shopify MCP tool. Everything goes through `executeSql`.

## The tables

| Table                                      | Grain                                   | Refresh                        |
| ------------------------------------------ | --------------------------------------- | ------------------------------ |
| `shopify_shop_v1__Shop`                    | one shop                                | whole set, nothing deleted     |
| `shopify_orders_v1__Order`                 | `(shopId, id)`                          | incremental; nothing deleted   |
| `shopify_orders_v1__OrderLineItem`         | `(shopId, id)`, parent `orderId`        | whole set **per parent order** |
| `shopify_products_v1__Product`             | `(shopId, id)`                          | whole set per shop             |
| `shopify_products_v1__ProductVariant`      | `(shopId, id)`, parent `productId`      | whole set per shop             |
| `shopify_inventory_v1__InventoryLevel`     | `(shopId, locationId, inventoryItemId)` | whole set per shop             |
| `shopify_locations_v1__Location`           | `(shopId, id)`                          | whole set per shop             |
| `shopify_customers_v1__Customer`           | `(shopId, id)`                          | incremental                    |
| `shopify_discounts_v1__Discount`           | `(shopId, id)`                          | whole set per shop             |
| `shopify_discounts_v1__DiscountRedeemCode` | `(shopId, id)`                          | whole set per shop             |
| `shopify_reports_v1__SalesDaily`           | `(shopId, day)`                         | time series, never deleted     |
| `shopify_reports_v1__SessionsDaily`        | `(shopId, day)`                         | time series, never deleted     |

## Trap 1: a workspace holds more than one shop

`shopId` is part of every key. A workspace can carry several unrelated
storefronts — one live workspace holds three (Pure Dogs Co, Pure Micronutrients,
Blyss Nutrition), and the discounts table covers only two of them.

Group by `shopId` or filter to one, and name the shop in the answer. Join
`shopify_shop_v1__Shop` for `name`, `myshopifyDomain`, `currencyCode` and
`ianaTimezone`. A total across shops is a portfolio figure, not a store's
performance, and is only meaningful when every shop shares a currency.

## Trap 2: two money conventions, and each amount carries its own currency

Orders promote both halves of Shopify's `MoneyBag`:

- `*ShopAmount` / `*ShopCurrency` — the shop's own currency. **Use this for
  totals.**
- `*PresentmentAmount` / `*PresentmentCurrency` — what the buyer was charged in.
  Use it only for a question about what buyers paid.

Line items carry **shopMoney only** — there is no presentment pair there.

`Order.currencyCode` is metadata about the order, **not** the denomination of
any column. Every amount has its own currency column beside it. On a measured
store the shop half was USD on 49,897 rows and AUD on 188, so
`SUM("totalPriceShopAmount")` across all rows adds two currencies into one
meaningless number. Either filter on the currency column or group by it.

`ProductVariant.price` is different again: Shopify's scalar `Money` carries no
code, so `currencyCode` there is the shop's currency captured at import time.

All money is an exact decimal string in NUMERIC. Never cast to float.

## Trap 3: the daily reports do not agree with the orders table, by design

`shopify_reports_v1__SalesDaily` is ShopifyQL's `sales` dataset — the numbers
the merchant sees in their own admin. It uses different inclusion rules from a
row count over the orders table. Measured on Pure Micronutrients,
2026-08-01 to 2026-08-24:

|        | Report    | Orders table |
| ------ | --------- | ------------ |
| sales  | 49,685.19 | 51,885.43    |
| orders | 967       | 977          |

Neither is wrong. Pick the one the question is about — the merchant's own
reported revenue, or the orders you can break down by product and geography —
say which you used, and never present one as a check on the other.

`SessionsDaily.sessions_that_completed_checkout` is a third count again: it
counts sessions, not orders.

## Trap 4: a missing day in SalesDaily means zero sales, not missing data

ShopifyQL returns no row for a day with no sales, so `SalesDaily` is sparse
while `SessionsDaily` is dense. Measured over 2026-07-24 to 2026-08-24: Pure
Micronutrients had 32 sales days of 32, Pure Dogs Co 27, Blyss Nutrition 24 —
and every absent day had sessions and zero orders.

Consequences:

- **`LEFT JOIN` from sessions to sales**, never `INNER JOIN`, or the zero-sales
  days vanish and every per-day average is inflated.
- `COALESCE` the sales measures to 0 after the join.
- A `COUNT(*)` over `SalesDaily` is not a number of days elapsed.

`conversion_rate` also disagrees with a day's own order count more often than
you would expect: measured on Blyss Nutrition, 2026-08-20 carried 20 sessions,
1 order and a `conversion_rate` of 0. It attributes a completed checkout to a
session, and an order can be placed in a session the report does not credit.
Report it as returned and do not present it beside an order count as though the
two must agree.

## Trap 5: `day` is a shop-local calendar day

The `day` column of both report tables is a `DATE` in the shop's own timezone
(`Shop.ianaTimezone`). Order timestamps are instants in UTC. To line an order up
with a report day, convert:

```sql
("shopifyProcessedAt" AT TIME ZONE sh."ianaTimezone")::date
```

Never compare `day` to a UTC date directly, and never bucket orders by UTC date
and call the result a daily sales report.

## Trap 6: signs and units in the report measures

- `discounts` and `returns` are **negative** in normal operation — measured
  negative on 1,195 and 557 of 1,201 days. Do not negate them again, and do not
  `ABS()` them into a positive "discount total" without saying so.
- `taxes` and `cost_of_goods_sold` admit either sign.
- Every rate is a **unit fraction**: `bounce_rate` 0.7658 means 76.58%, and
  `returning_customer_rate` likewise. Multiply by 100 for display.
- `average_session_duration` is in **seconds**, the only column in that family
  that is not money, a count or a fraction.
- `gross_margin` can exceed 1.0 when the merchant's cost data is incomplete
  (1.215 was measured). It is stored as returned rather than clamped.
- `average_order_value`, `gross_margin`, `returning_customer_rate`,
  `bounce_rate` and `conversion_rate` are **derived by the source**. Report them
  as returned; do not recompute them from the columns beside them, and never
  average a rate across days — sum the numerator and denominator instead.
- `cost_of_goods_sold` and everything derived from it are only as good as the
  merchant's per-variant cost data. A store that keeps none reads **zero**, not
  null.

## Trap 7: freshness columns are not interchangeable

Three different conventions live in this schema:

- `shopifyCreatedAt` / `shopifyUpdatedAt` — **Shopify's** instants. Prefixed so
  they cannot be confused with our own bookkeeping. `shopifyUpdatedAt` is
  returned **truncated to the second**, so it is not a watermark and must not be
  used to detect recent changes.
- `createdAt` / `updatedAt` — **our** row bookkeeping. On most tables `updatedAt`
  is the whole-set refresh marker, stamped on every row of a successful run
  whether or not anything changed, with older rows deleted.
- On the two `shopify_reports_v1__*` tables `updatedAt` means something else and
  more useful: **when that day's numbers last changed**, because nothing in that
  family is ever deleted. Reading it tells you which days are still being
  revised. On `SessionsDaily` a completed day has never been observed to change,
  so an old `updatedAt` there is normal.
- Three tables have **no `updatedAt` column at all** and use `fetchedAt` as the
  run marker: `shopify_inventory_v1__InventoryLevel`,
  `shopify_discounts_v1__Discount` and
  `shopify_discounts_v1__DiscountRedeemCode`. On inventory this matters twice
  over, because its `shopifyUpdatedAt` does not always move when a quantity
  does.

## Trap 8: on the discounts table, most nulls mean "this member does not declare it"

`Discount` is a union of eight member types discriminated by `discountType`, and
only eleven fields are declared by all of them. A null on any other column is
usually the member not declaring the field rather than an empty value. The one
that actively misleads is `usageLimit`, which is null both for an automatic
discount (no such field) and for a code discount with no limit (_unlimited_) —
two different facts that the column cannot tell apart. See
`dbl-metrics-shopify-orders` for the full list.

## Trap 9: null is not zero, and a severed reference is not a bug

- `OrderLineItem.productId` is null on 2,275 of 78,124 measured rows. That is the
  fingerprint of a **deleted product**, not a dangling id. `variantId` likewise.
  Use `LEFT JOIN` and report the unmatched rows rather than dropping them.
- `Order.customerId` is null on a small number of orders. Guest or removed
  customer.
- Inventory's `reserved`, `safetyStock`, `damaged` and `qualityControl` are null
  when the merchant's plan does not enable that state.

## Trap 10: test and cancelled orders are real rows

`Order.test` is a real boolean with real `true` rows. Filter `WHERE NOT "test"`
on any revenue question. `shopifyCancelledAt` is filled on about 1.66% of orders
and `totalRefundedShopAmount` is 0 rather than null on an unrefunded order, so
net revenue is `totalPriceShopAmount - totalRefundedShopAmount` and needs no
COALESCE.

## Trap 11: not every line item is a product

Add-on services sell as ordinary line items. On a measured store "Shipping
Protection" (SKU `NVDPROTECTION-…`) ranked third by units in a month, above real
products. A best-seller list that does not exclude these is wrong in the way the
client will notice first. Its `productId` is usually null, so it also inflates any
"deleted product" count. Check the titles before presenting a ranking, exclude
non-products, and say that you did.

## Trap 12: `quantity` is not `currentQuantity`

`OrderLineItem.quantity` is what was ordered. `currentQuantity` is what remains
after refunds and removals. "Units sold" almost always means `currentQuantity`;
"units ordered" means `quantity`. Say which one you used.

## Ids

Every id is a numeric string in a `BIGINT` column — the REST `legacyResourceId`,
not a GID — **except the discounts family**, where `Discount.id` and
`DiscountRedeemCode.id` are full GID strings
(`gid://shopify/DiscountCodeNode/<n>`, `gid://shopify/DiscountAutomaticNode/<n>`)
and `DiscountRedeemCode.discountGid` joins on one. The full GID is `gid://shopify/<Type>/<id>` and is not stored because
nothing here rebuilds one. The exception is `OrderLineItem.id`, which is the
numeric tail of the LineItem GID.

`InventoryLevel.levelGid` is provenance only: Shopify returns a GID carrying a
query string whose numeric part is shared by every level at a location. Never
join or key on it.
