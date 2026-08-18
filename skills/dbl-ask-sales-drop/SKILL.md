---
name: dbl-ask-sales-drop
description: Diagnose why a store's sales dropped — decompose the change into traffic, conversion, and price, and flag ad-channel and ad-efficiency causes. Use when the user asks "why did sales drop / fall / decline", "sales are down", "revenue dropped", "why did orders fall", "what happened to sales (week-over-week)", or wants a sales-decrease diagnosis for a marketplace.
metadata:
  type: question
  audience: client
  tool: salesDropDiagnosis
---

# Why did sales drop?

Answer with the **`core`** MCP server's **`salesDropDiagnosis`** tool
— it decomposes the change in daily sales into an exact, additive set of causes,
so you don't reconstruct the math yourself.

Identity (per day): `sales = sessions × units/session × ASP`. Logs make the
three factors additive, so each factor's share of the total change is a
defensible attribution.

## Call

If the connector exposes `listWorkspaces`, select the intended workspace and
pass its `wsid`; do not fan this diagnosis out silently.

`salesDropDiagnosis` parameters:

- `stores` — a merchantId, country code, or `{merchantId}-{site}`. Omit to use
  the client's configured countries; `allStores: true` includes every store with
  data.
- `recentDays` (default 7), `baselineDays` (default 28) — recent window vs the
  prior baseline, anchored to each store's latest date.
- `dropThreshold` (default 0.10) — fractional fall in sales/day that flags a
  drop.

Example: "why did UK sales fall this week" →
`salesDropDiagnosis({ stores: "GB", recentDays: 7, baselineDays: 28 })`.

## Read the output

Per store: `deltaPct` (sales/day change), `isDrop`, ranked **`causes`** (traffic
/ conversion / price — `share` sums to ~100%; a factor that _rose_ and cushioned
the drop has a negative share; shares are suppressed for near-flat stores), and
**`signals`** (ad vs organic channel, ad CR / CPC moves). When sessions are
missing for a window, `notes` says traffic and conversion couldn't be separated.

Read it as: which factor moved most, then which channel/efficiency signal
explains it. If organic drove the fall with healthy inventory, suspect rank /
buy-box — pull `dbl-metrics-rank` and `dbl-metrics-traffic` to confirm.

## Check stock before diagnosing

A stockout produces a sales fall, a conversion collapse and wrecked ad
efficiency from a single cause that has nothing to do with demand. Check
`inventoryPacing`, or `fulfillable` in `amazon_fba_inventory_summary` and
`buy_box_percentage` in `amazon_sales_and_traffic`, before assigning any other
cause. If stock is at or near zero, say so and hand off to
`dbl-ask-inventory-pacing`.

## "The store looks fine" is usually not the answer

This tool works at store level, and for a catalogue of a thousand-plus products
the store total is an average that hides almost everything. A store down 4.7% —
statistically nothing — can contain a family down 40% that has sold out.

So when the store-level verdict is "no meaningful drop", break it down before
reporting that: `loadTraffic` or `loadAds` with `groupBy: "family"` (or
`parentAsin`) over the same two windows, ranked by absolute change in sales. For
a diversified catalogue this is the normal case, not an edge case. See
`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`.

Also look for **absence, not just decline**. The clearest evidence a family had
sold out was rows disappearing — the count of its products tracked in the
bestseller rankings fell from 88 to 12 in one week. Count distinct ASINs with
rank rows, with sessions, or with ad impressions per period; a collapse in the
count means stockout, suppression, or delisting.
`${CLAUDE_PLUGIN_ROOT}/docs/diagnosis-methods.md` has both methods in full.

## Follow-ups

Pair with `dbl-metrics-traffic` (sessions/CR), `dbl-metrics-ads`
(spend/efficiency), and `dbl-metrics-rank` (organic rank) to confirm the
suspected cause.
