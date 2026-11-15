# Search Query Performance data shape

`loadSqp` handles this correctly. Read this before writing SQL against
`amzreport_SEARCH_QUERY_PERFORMANCE` yourself, or before interpreting anyone
else's search-term numbers — there are two ways to be confidently and badly
wrong.

## One row = one ASIN × one search query × one period

Identity: `merchantId`, `marketplaceId`, `timeUnit` (`WEEK` / `MONTH` / `QUARTER`),
`dateFirst`, `dateLast`, `asin`, `searchQuery`. Every other column is a plain number:

- The query: `searchQueryScore`, `searchQueryVolume` (distinct searches).
- **Our** counts for that ASIN: `asinImpressionCount`, `asinClickCount`,
  `asinCartAddCount`, `asinPurchaseCount`.
- The **whole market's** totals for that search query: `totalQueryImpressionCount`,
  `totalClickCount`, `totalCartAddCount`, `totalPurchaseCount`.
- The market's counts by shipping speed:
  `total{SameDay,OneDay,TwoDay}Shipping{Click,CartAdd,Purchase}Count`.
- Six median prices: `asinMedianClickPrice` and `totalMedianClickPrice`, and the
  same pair for `CartAdd` and `Purchase`. Each is an amount in the marketplace's
  default currency, null when there was no event of that kind and sometimes
  otherwise.

Amazon's rates and shares are not stored. Each is 100 × numerator ÷ denominator,
null when the denominator is 0:

- `asinImpressionShare` = `asinImpressionCount` ÷ `totalQueryImpressionCount`
- `totalClickRate` = `totalClickCount` ÷ `searchQueryVolume`
- `asinClickShare` = `asinClickCount` ÷ `totalClickCount`
- `totalCartAddRate` = `totalCartAddCount` ÷ `searchQueryVolume`
- `asinCartAddShare` = `asinCartAddCount` ÷ `totalCartAddCount`
- `totalPurchaseRate` = `totalPurchaseCount` ÷ `searchQueryVolume`
- `asinPurchaseShare` = `asinPurchaseCount` ÷ `totalPurchaseCount`

The counts are integers, so cast to `numeric` before dividing, or the division
truncates to a whole number. Over more than one row, apply a formula to the
summed counts (after Trap 1's `MAX`), never average the per-row percentages.

## Trap 1: market totals repeat, they do not add up

The `total*` numbers are the same market figure copied onto every one of our
ASIN rows for that query and week. `SUM(totalQueryImpressionCount)` inflates the
market by however many of our ASINs happened to appear on the term, and the
derived "impression share" collapses to nonsense.

Take `MAX` within (search query, period) first, then sum across periods:

```sql
WITH per_period AS (
  SELECT "searchQuery", "dateFirst",
         max("totalQueryImpressionCount")::numeric AS mkt_impr,
         max("totalClickCount")::numeric           AS mkt_clicks,
         max("searchQueryVolume")::numeric         AS volume,
         sum("asinImpressionCount")::numeric       AS our_impr,
         sum("asinClickCount")::numeric            AS our_clicks
  FROM "amzreport_SEARCH_QUERY_PERFORMANCE"
  WHERE "merchantId" = $1 AND "marketplaceId" = $2 AND "timeUnit" = 'WEEK'
    AND "dateFirst" >= $3 AND "dateFirst" < $4
  GROUP BY 1, 2
)
SELECT "searchQuery",
       sum(mkt_impr)   AS mkt_impr,
       sum(our_impr)   AS our_impr,
       ROUND((sum(our_impr)  / NULLIF(sum(mkt_impr), 0)   * 100)::numeric, 3) AS impr_share_pct,
       ROUND((sum(mkt_clicks)/ NULLIF(sum(mkt_impr), 0)   * 100)::numeric, 3) AS mkt_ctr_pct
FROM per_period
GROUP BY 1
ORDER BY mkt_impr DESC
```

Our own `asin*` counts are genuinely per ASIN, so they are summed, not maxed.
All four key columns are required — see the index note in
[SQL quick reference](sql-reference.md).

## Trap 2: Amazon's per-search rates are not click-through rates

Amazon's `totalClickRate`, `totalCartAddRate` and `totalPurchaseRate` are not
stored, and are computed against `searchQueryVolume` (distinct searches),
**not** impressions. Reading one as a click-through rate overstates it by a large
factor, and the factor varies by term, so it cannot be corrected with a constant.

Compute market rates from the counts:

- market CTR = `totalClickCount ÷ totalQueryImpressionCount`
- market cart-add rate = `totalCartAddCount ÷ totalClickCount`
- market purchase rate = `totalPurchaseCount ÷ totalClickCount`

Report a per-search rate (`totalClickCount ÷ searchQueryVolume`) only if you also
say it is per search, not per impression.

## Analyse at family level

An individual ASIN can get too few purchases on a search term in a week to
conclude anything. Filter to a family — `loadSqp({ products: "…" })`, or
join `brand_config_amazon_asin` in SQL (see
[Product families](product-hierarchy.md)) — before comparing conversion.

## Use the price fields

`asinMedianClickPrice` versus `totalMedianClickPrice` gives our typical price
against the market's typical price for the same search term, and
`asinMedianPurchasePrice` versus `totalMedianPurchasePrice` does the same for
purchases. When a term shows healthy click share and weak purchase share, this
pair is the first place to look — and it is already in the row, no extra query
needed.
Each price is in its marketplace's default currency: never compare prices across
marketplaces without converting.

## Coverage

Amazon only emits an ASIN-query row above an impression threshold, and the
report lags. A missing row is a low-velocity signal, not a zero. Say which weeks
the data actually covers.

Amazon's report leaves the search term empty on some rows. The empty term stands
for a different, unnamed search in each period and marketplace, so it cannot be
summed across them like a named term. `loadSqp` leaves it out of both its period
totals and its keyword list; SQL that ranks or totals terms should add
`"searchQuery" <> ''` too.
