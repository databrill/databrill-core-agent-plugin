# Diagnosis methods

Recipes for turning a metric into a finding. Each one is mechanical: state the
steps, run them, and the answer is defensible rather than invented. Each exists
because the obvious guess for its question names the wrong cause.

## 0. Stock first, always

When a product runs out of stock Amazon stops showing it. Sales fall, ads keep
spending against nothing, and every efficiency metric goes haywire — one cause,
none of it about advertising. A screen for the worst-performing products
therefore puts stocked-out products at the top of every efficiency ranking at
once, and they have to be filtered out before a genuine advertising question can
even be found.

So before diagnosing an ads or sales question on a specific product, check:

- `inventoryPacing` for the family's runway, or
- `amazon_fba_inventory_summary` for `fulfillable` by ASIN (filter merchant and
  marketplace, then sum over SKUs — see [SQL quick reference](sql-reference.md)), and
- `buy_box_percentage` in `amazon_sales_and_traffic`, which falls with the offer
  even when units remain.

If stock is at or near zero for the period, say so first and hand off to
`dbl-ask-inventory-pacing`. Do not attribute a stockout to bidding strategy.

## 1. A ratio alone means nothing — bring two comparisons

"ACOS is too high on this product" cannot be answered with that product's ACOS.
The same ACOS is excellent for one product and disastrous for another. Fetch
both of:

- **the store's own average for the same period** — a product well above its
  store's average is abnormal, not merely high;
- **the same product in a prior period** — a better value in the past proves the
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

Do not skip to a guess: clicks can get _cheaper_ and click-through can _improve_
while the entire deterioration sits in factors 2 and 3, and a plausible "CPC
inflation" story is then wrong.

## 3. Conversion problem or budget-mix problem?

Once factor 2 or 3 is the culprit, ask whether conversion really got worse or
whether the money simply moved to worse campaigns. Test it with a
counterfactual: hold each campaign's _current_ performance fixed and restore the
_old_ budget split.

```text
counterfactual_sales = Σ_campaign ( total_spend_now × share_of_spend_before
                                    × sales_per_spend_now_for_that_campaign )
```

If that closes most of the gap, it is an allocation problem, not a performance
problem: the budget has drifted into worse-performing campaigns and away from
better ones. The fix — reallocate — is completely different from the fix for
"conversion is declining", and because it moves spend to campaigns that return
more sales per unit of spend, it can raise revenue while cutting spend. The
counterfactual above is the first draft of that plan.

Group by `campaign` in both periods to run this.

## 4. A flat store total hides everything

For a large catalogue the store total is an average that conceals almost every
real event. A store can be down by a statistically meaningless amount — so a
store-level analysis correctly reports "no meaningful drop" — while one family
inside it has collapsed because it sold out.

So when a store-level answer is "nothing is wrong", break it down before saying
so: `loadTraffic` or `loadAds` with `groupBy: "family"` (or `parentAsin`) for
both windows, ranked by absolute change in sales. For a diversified catalogue
this is the normal case, not an edge case.

## 5. Look for absence, not just decline

Evidence that a family has sold out need not be a number going down — it can be
rows disappearing. A product that stops selling drops out of the bestseller
rankings, so the count of the family's ranked products collapses.

Counting rows per period is cheap and catches what averages hide:

- distinct ASINs with rank rows per week in `amazon_sales_rank__{cc}`;
- distinct ASINs with sessions per week in `amazon_sales_and_traffic`;
- distinct ASINs with ad impressions per week.

A collapse in the count is a stockout, a suppression, or a delisting. Check it
whenever a family's sales fall faster than its traffic.

## 6. "Cut spend by how much?" — cost per extra unit

A pacing recommendation of "throttle" invites the obvious follow-up. Answer it
by comparing the period before a spend change with the period after, taking ad
spend per day and units per day in each:

```text
cost_per_extra_unit = (spend_after - spend_before)
                      ÷ (units_after - units_before)
```

Set that cost against the product's selling price to see whether an extra unit
of velocity is worth what it costs to buy. Then solve backwards for the target:
to stretch the remaining stock to a target runway you need
`units/day = stock ÷ target_runway_days`, and

```text
target_spend_per_day = spend_before + (target_units_per_day - units_before)
                                      × cost_per_extra_unit
```

State the assumption plainly — that the relationship is locally linear over the
observed range, and that it holds only near the spend levels actually seen. Do
not extrapolate it to zero or to double the maximum observed spend.

Use `loadAds` (spend) and `loadTraffic` (units) over the two windows, or
`inventoryPacing`'s `adSpendPerDay` and `velocityPerDay` for the current side.

## 7. Ad formats and campaign types

If an ad-format breakdown returns a single row, that is the answer, not an empty
result: say "this store only runs Sponsored Products; the other formats have no
spend in this period" and confirm it against the campaign list. A store need not
run Sponsored Brands, Sponsored Brands Video or Sponsored Display at all.

When only one format exists, the useful breakdown is by campaign _type_ —
automatic targeting, broad keyword, product targeting, manual keyword. An
account may encode this in its campaign names. A long list of raw campaign rows
is not an answer; the same rows grouped into four types make the finding
readable. Check the naming convention on the account before grouping, and say
which convention you used.
