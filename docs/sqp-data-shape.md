# Search Query Performance data shape

`loadSqp` handles this correctly. Read this before writing SQL against
`amzreport_SEARCH_QUERY_PERFORMANCE` yourself, or before interpreting anyone
else's search-term numbers — there are two ways to be confidently wrong by an
order of magnitude.

## One row = one ASIN × one search query × one period

Columns: `merchantId`, `marketplaceId`, `timeUnit` (`WEEK` / `MONTH`),
`dateFirst`, `dateLast`, `asin`, `searchQuery`, `searchQueryScore`,
`searchQueryVolume`, and four JSONB blocks.

Each block holds **our** counts for that ASIN and the **whole market's** totals
for that search query:

| Block            | Ours                                                                | Market                                                                                            |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `impressionData` | `asinImpressionCount`, `asinImpressionShare`                        | `totalQueryImpressionCount`                                                                       |
| `clickData`      | `asinClickCount`, `asinClickShare`, `asinMedianClickPrice`          | `totalClickCount`, `totalClickRate`, `totalMedianClickPrice`, `total{One,Two,Same}Day…ClickCount` |
| `cartAddData`    | `asinCartAddCount`, `asinCartAddShare`, `asinMedianCartAddPrice`    | `totalCartAddCount`, `totalCartAddRate`, `totalMedianCartAddPrice`                                |
| `purchaseData`   | `asinPurchaseCount`, `asinPurchaseShare`, `asinMedianPurchasePrice` | `totalPurchaseCount`, `totalPurchaseRate`, `totalMedianPurchasePrice`                             |

`*Share` fields are percentages, already computed as ours ÷ market.
`*MedianPrice` fields are `{ "amount": …, "currencyCode": … }` and can be null
when we had no event of that type.

## Trap 1: market totals repeat, they do not add up

The `total*` numbers are the same market figure copied onto every one of our
ASIN rows for that query and week. `SUM(totalQueryImpressionCount)` inflates the
market by however many of our ASINs happened to appear on the term — in a
verified week, 151 rows for one query, so a 151× overstatement, and the derived
"impression share" collapses to nonsense.

Take `MAX` within (search query, period) first, then sum across periods:

```sql
WITH per_period AS (
  SELECT "searchQuery", "dateFirst",
         max(("impressionData"->>'totalQueryImpressionCount')::numeric) AS mkt_impr,
         max(("clickData"->>'totalClickCount')::numeric)                AS mkt_clicks,
         max("searchQueryVolume")                                       AS volume,
         sum(("impressionData"->>'asinImpressionCount')::numeric)       AS our_impr,
         sum(("clickData"->>'asinClickCount')::numeric)                 AS our_clicks
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

## Trap 2: `totalClickRate` is not a click-through rate

`totalClickRate`, `totalCartAddRate` and `totalPurchaseRate` are divided by
`searchQueryVolume` (distinct searches), **not** by impressions. On a verified
week the term "garlic press" reported `totalClickRate` 32.01 while the real
market click-through rate — 49,977 clicks over 4,226,486 impressions — was
1.18%. Using the field as a CTR overstates it by roughly 27×, and the factor
varies by term, so it cannot be corrected with a constant.

Compute market rates yourself from the counts:

- market CTR = `totalClickCount ÷ totalQueryImpressionCount`
- market cart-add rate = `totalCartAddCount ÷ totalClickCount`
- market purchase rate = `totalPurchaseCount ÷ totalClickCount`

Report the raw `total*Rate` fields only if you also say they are per search, not
per impression.

## Analyse at family level

Individual ASINs get 0–2 purchases on a given search term per week, which is too
few to conclude anything. Filter to a family — `loadSqp({ products: "…" })`, or
join `brand_config_amazon_asin` in SQL (see
[Product families](product-hierarchy.md)) — before comparing conversion.

## Use the price fields

`asinMedianClickPrice` versus `totalMedianClickPrice` gives our typical price
against the market's typical price for the same search term, and
`asinMedianPurchasePrice` versus `totalMedianPurchasePrice` does the same for
purchases. When a term shows healthy click share and weak purchase share, this
pair usually explains it — and it is already in the row, no extra query needed.
Watch the currency code and never compare across marketplaces without
converting.

## Coverage

Amazon only emits an ASIN-query row above an impression threshold, and the
report lags. A missing row is a low-velocity signal, not a zero. Say which weeks
the data actually covers.
