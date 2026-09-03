---
name: dbl-metrics-shopify-sales
description: Report Shopify store performance from the daily reports — sales, net sales, gross profit, orders, sessions, conversion rate, bounce rate, returning customers. Use when the user asks how the Shopify store is doing, Shopify revenue or traffic for a period, Shopify conversion, why Shopify sales changed, or wants a week-over-week or month-over-month Shopify trend.
metadata:
    type: metric
    audience: client
    tool: executeSql
---

# How is the Shopify store performing?

There is no dedicated MCP tool for Shopify. Use `executeSql` against
`shopify_reports_v1__SalesDaily` and `shopify_reports_v1__SessionsDaily`, one
row per `(shopId, day)`.

**Read `${CLAUDE_PLUGIN_ROOT}/docs/shopify-data-shape.md` first.** These two
tables carry more traps than any other Shopify family, and every one of them
returns a plausible wrong number rather than an error. For the declared columns
and types of any `shopify_*` table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/shopify/index.tsv` and then that table's
`.yaml` beside it.

## The four that matter most here

1. **A missing day in `SalesDaily` means zero sales.** ShopifyQL returns no row
   for a day with none, so that table is sparse while `SessionsDaily` is dense.
   Always `LEFT JOIN` sessions → sales and `COALESCE` the measures to 0.
   An `INNER JOIN` silently drops the store's worst days and inflates every
   average.
2. **`discounts` and `returns` are negative.** They are already signed; adding
   them to `gross_sales` is correct, subtracting them double counts.
3. **Rates are unit fractions**, and they are the source's own — do not recompute
   `conversion_rate` from sessions and orders, and never average a rate across
   days. `average_session_duration` is in seconds.
4. **`day` is the shop's local calendar day**, not UTC.

`conversion_rate` will not always agree with the day's own order count —
measured on one store, a day with 20 sessions and 1 order reported a
`conversion_rate` of 0. It credits a session, not an order. Do not put the two
side by side as though they must reconcile.

## Which shop

A workspace can hold several storefronts. Always start by listing them and pick
or group explicitly:

```sql
SELECT "shopId", "name", "myshopifyDomain", "currencyCode", "ianaTimezone"
FROM "shopify_shop_v1__Shop" ORDER BY "name";
```

Never present a multi-shop total as one store's performance.

## The standard daily read

```sql
SELECT sh."name",
       se."day",
       se."sessions",
       se."pageviews",
       ROUND(se."conversion_rate" * 100, 2) AS "conversionPct",
       COALESCE(sa."total_sales", 0) AS "totalSales",
       COALESCE(sa."net_sales", 0)   AS "netSales",
       COALESCE(sa."orders", 0)      AS "orders",
       COALESCE(sa."discounts", 0)   AS "discounts",   -- negative
       COALESCE(sa."returns", 0)     AS "returns",     -- negative
       sa."gross_profit",
       sa."updatedAt" AS "dayLastRevised"
FROM "shopify_reports_v1__SessionsDaily" AS se
JOIN "shopify_shop_v1__Shop" AS sh ON sh."shopId" = se."shopId"
LEFT JOIN "shopify_reports_v1__SalesDaily" AS sa
  ON sa."shopId" = se."shopId" AND sa."day" = se."day"
WHERE se."day" BETWEEN $start AND $end
ORDER BY sh."name", se."day";
```

Period totals: sum the numerators and denominators, then divide. Never average
the per-day rates.

```sql
SELECT SUM(se."sessions")                                   AS "sessions",
       SUM(COALESCE(sa."orders", 0))                        AS "orders",
       SUM(COALESCE(sa."total_sales", 0))                   AS "totalSales",
       SUM(COALESCE(sa."orders", 0)) / NULLIF(SUM(se."sessions"), 0)
                                                            AS "ordersPerSession"
FROM "shopify_reports_v1__SessionsDaily" AS se
LEFT JOIN "shopify_reports_v1__SalesDaily" AS sa
  ON sa."shopId" = se."shopId" AND sa."day" = se."day"
WHERE se."shopId" = $shop AND se."day" BETWEEN $start AND $end;
```

Note that `ordersPerSession` computed this way is **not** the source's
`conversion_rate`, which uses its own inclusion rule. Report one or the other and
say which.

## Check coverage before quoting a period

These tables can start well after the store did — measured on one workspace they
held 2026-07-24 onward only, roughly a month. Establish the range first and state
it; do not present a partial window as a full one:

```sql
SELECT "shopId", MIN("day") AS "from", MAX("day") AS "to", COUNT(*) AS "days"
FROM "shopify_reports_v1__SessionsDaily" GROUP BY "shopId";
```

For history older than the reports, go to `dbl-metrics-shopify-orders` — the
orders table on that same workspace reached back to 2015 — and say that the two
sources count differently.

## Which days are still moving

`SalesDaily.updatedAt` means _when this day's numbers last changed_, not when we
last looked. Recent days revise as returns land. If the user is comparing a
just-ended period, check whether its days are still being revised before
treating the comparison as settled. On `SessionsDaily` a completed day has never
been observed to change, so an old `updatedAt` there is normal.

## Diagnosing a change

Decompose sales-per-day into sessions × conversion × average order value, all
from these two tables, then attribute. `gross_profit` and `gross_margin` are
only as good as the merchant's per-variant cost data — a store keeping none
reads zero COGS, not null, so check `cost_of_goods_sold` before drawing a margin
conclusion. `${CLAUDE_PLUGIN_ROOT}/docs/diagnosis-methods.md` has the general
method.

## Follow-ups

`dbl-metrics-shopify-orders` for product, geography and refund breakdowns.
`dbl-metrics-shopify-inventory` for stock. This is Shopify only — Amazon's
equivalents are `dbl-metrics-traffic` and `dbl-ask-sales-drop`, and the two
channels must be reported separately.
