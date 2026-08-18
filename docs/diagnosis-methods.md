# Diagnosis methods

Recipes for turning a metric into a finding. Each one is mechanical: state the
steps, run them, and the answer is defensible rather than invented. They came
out of real client analyses where guessing produced the wrong cause.

## 0. Stock first, always

When a product runs out of stock Amazon stops showing it. Sales fall, ads keep
spending against nothing, and every efficiency metric goes haywire — one cause,
none of it about advertising. Screening the 20 worst-performing products in one
store for an advertising problem, 13 were simply out of stock and had to be
filtered out by hand before a genuine advertising question could even be found.

So before diagnosing an ads or sales question on a specific product, check:

- `inventoryPacing` for the family's runway, or
- `amazon_fba_inventory_summary` for `fulfillable` by ASIN (filter merchant and
  marketplace, then sum over SKUs — see [SQL quick
  reference](sql-reference.md)), and
- `buy_box_percentage` in `amazon_sales_and_traffic`, which falls with the offer
  even when units remain.

If stock is at or near zero for the period, say so first and hand off to
`dbl-ask-inventory-pacing`. Do not attribute a stockout to bidding strategy.

## 1. A ratio alone means nothing — bring two comparisons

"ACOS is too high on this product" cannot be answered with that product's ACOS.
40% is excellent for one product and disastrous for another. Fetch both of:

- **the store's own average for the same period** — in one case 26.7%, which
  made the product's 50.9% clearly abnormal rather than merely high;
- **the same product in a prior period** — it had been 30.8%, which proves the
  better number is achievable and gives a target that is defensible instead of
  plucked from the air.

Both are one extra `loadAds` call each (`groupBy: "store"` for the baseline, a
shifted `when` for the comparison). Do this for any ratio a client calls "too
high" or "too low": ACOS, conversion rate, CPC, TACOS.

## 2. Why a cost ratio moved: the three-factor decomposition

Advertising cost as a share of sales moves for exactly three reasons:

1. **each click got more expensive** — CPC;
2. **fewer clicks turned into purchases** — conversion rate;
3. **each purchase was worth less** — average order value (revenue ÷ purchases).

`ACOS = CPC ÷ (CR × AOV)`. Measure all three across the two periods and the
culprit names itself. Run `loadAds` for both periods with `derived: true` and
compute AOV as `revenue / purchases`.

Do not skip to a guess: in one analysis clicks got *cheaper* and click-through
*improved*, while the entire deterioration sat in factors 2 and 3. A plausible
"CPC inflation" story would have been wrong.

## 3. Conversion problem or budget-mix problem?

Once factor 2 or 3 is the culprit, ask whether conversion really got worse or
whether the money simply moved to worse campaigns. Test it with a
counterfactual: hold each campaign's *current* performance fixed and restore the
*old* budget split.

```text
counterfactual_sales = Σ_campaign ( total_spend_now × share_of_spend_before
                                    × sales_per_spend_now_for_that_campaign )
```

If that closes most of the gap, it is an allocation problem, not a performance
problem. In one case it explained 69% of the damage: 60% of the budget had
drifted into the worst-performing campaign while the best had been cut by two
thirds. The fix — reallocate — is completely different from the fix for
"conversion is declining", and it produced a plan worth 38% more revenue at 18%
less spend.

Group by `campaign` in both periods to run this.

## 4. A flat store total hides everything

For a catalogue of a thousand-plus products the store total is an average that
conceals almost every real event. In one test the store was down 4.7% —
statistically nothing, and a store-level analysis correctly reported "no
meaningful drop" — while one family inside it was down 40% because it had sold
out.

So when a store-level answer is "nothing is wrong", break it down before saying
so: `loadTraffic` or `loadAds` with `groupBy: "family"` (or `parentAsin`) for
both windows, ranked by absolute change in sales. For a diversified catalogue
this is the normal case, not an edge case.

## 5. Look for absence, not just decline

The clearest evidence that the family above had sold out was not a number going
down — it was rows disappearing. The count of its products tracked in the
bestseller rankings fell from 88 to 12 in a single week.

Counting rows per period is cheap and catches what averages hide:

- distinct ASINs with rank rows per week in `amazon_sales_rank__{cc}`;
- distinct ASINs with sessions per week in `amazon_sales_and_traffic`;
- distinct ASINs with ad impressions per week.

A collapse in the count is a stockout, a suppression, or a delisting. Check it
whenever a family's sales fall faster than its traffic.

## 6. "Cut spend by how much?" — cost per extra unit

A pacing recommendation of "throttle" invites the obvious follow-up. Answer it
by comparing the period before a spend change with the period after:

| | Before | After |
| --- | --- | --- |
| ad spend / day | $1.70 | $59.00 |
| units / day | 3.0 | 6.9 |

$57.30 of extra daily spend bought 3.9 extra units per day, so an extra unit of
velocity costs about $14.70 — against a $33 selling price. Then solve backwards
for the target: to stretch the remaining stock to 30 days you need
`units/day = stock ÷ 30`, and

```text
target_spend_per_day = spend_before + (target_units_per_day - units_before)
                                      × cost_per_extra_unit
```

which in that case landed near $18/day. State the assumption plainly — that the
relationship is locally linear over the observed range, and that it holds only
near the spend levels actually seen. Do not extrapolate it to zero or to double
the maximum observed spend.

Use `loadAds` (spend) and `loadTraffic` (units) over the two windows, or
`inventoryPacing`'s `adSpendPerDay` and `velocityPerDay` for the current side.

## 7. Ad formats and campaign types

If an ad-format breakdown returns a single row, that is the answer, not an empty
result: say "this store only runs Sponsored Products; the other formats have no
spend in this period" and confirm it against the campaign list. Several stores
have never run Sponsored Brands, Sponsored Brands Video or Sponsored Display at
all.

When only one format exists, the useful breakdown is by campaign *type* —
automatic targeting, broad keyword, product targeting, manual keyword. Many
accounts encode this in campaign names (for example `{family} |DB {type}`).
Twenty-five raw campaign rows are not an answer; the same rows grouped into four
types usually make the finding immediate. Check the naming convention on the
account before grouping, and say which convention you used.
