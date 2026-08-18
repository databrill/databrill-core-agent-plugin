---
name: dbl-ask-inventory-pacing
description: Recommend how advertising should respond to inventory — pause, throttle, hold, or ramp spend based on each product's runway. Use when the user asks "should we pause ads before the stockout", "we're low on stock, what about ads", "should we cut spend to stretch inventory", "we restocked — ramp back up?", "how do we sell down overstock", "long-term storage fee risk", or wants an inventory-driven ad pacing decision.
metadata:
  type: question
  audience: client
  tool: inventoryPacing
---

# How should ads respond to inventory?

Answer with the **`core`** MCP server's **`inventoryPacing`** tool.
Per family it joins the **runway** (days of stock at current velocity) with
current ad spend and returns a concrete action — don't reconstruct this
yourself.

## Call

If the connector exposes `listWorkspaces`, select the intended workspace and
pass its `wsid`; do not fan this analysis out silently.

`inventoryPacing` parameters:

- **`stores`** (required) — country / region / marketplaceId / `*` /
  `{merchantId}-{scope}`.
- `velocityDays` (default 7) — window for units/day.
- `spendWindowDays` (default 7) — window for ad spend/day.
- `criticalDays` (7), `lowDays` (21), `overstockDays` (90) — the runway bands.
- `minSpendPerDay` (1), `minVelocity` (0.2) — noise floors.

Example: "we're low on the Garlic Presses in the US — what about ads?" →
`inventoryPacing({ stores: "US" })` (then read the Garlic_Press row).

## Read the output

Each `data[]` row is a family with `runwayDays`, `available`, `inbound`,
`velocityPerDay`, `adSpendPerDay`, `tacos`, and the recommendation: **`action`**
(`pause` / `throttle` / `hold` / `ramp`), `severity`, and a `rationale`. Rows
are sorted most-actionable first (pause → throttle → ramp → hold).

The logic:

- **pause** — runway ≤ critical and ad spend is active with no inbound relief:
  ads are paying to accelerate an imminent stockout.
- **throttle** — critical/low but inbound restock bridges the gap, or low runway
  with spend to trim.
- **ramp** — overstock (≥ `overstockDays`, storage-fee risk): push spend/deals
  to sell down.
- **hold** — healthy, or too slow to be inventory-driven, or nothing to cut.

**Worst-variant caveat:** pacing acts on the family, but stockouts are
per-variant. A healthy family can carry a `rationale` caveat naming a child ASIN
that's critically low — restock or exclude it; don't push spend onto an
out-of-stock child.

## Answer "by how much?"

The tool returns a category; clients always ask the follow-up. Get a number by
comparing the period before a spend change with the period after:

| | Before | After |
| --- | --- | --- |
| ad spend / day | $1.70 | $59.00 |
| units / day | 3.0 | 6.9 |

$57.30 of extra daily spend bought 3.9 extra units/day → about $14.70 per extra
unit, against a $33 selling price. Then solve backwards for the target:

```text
target_units_per_day = available ÷ target_runway_days
target_spend_per_day = spend_before + (target_units_per_day - units_before)
                                      × cost_per_extra_unit
```

which in that case gave about $18/day to stretch the stock to 30 days. Use
`loadAds` (spend) and `loadTraffic` (units) for the two windows. State the
assumption: the relationship is locally linear over the spend range actually
observed — don't extrapolate to zero or past the maximum seen.
`${CLAUDE_PLUGIN_ROOT}/docs/diagnosis-methods.md` has the full method.

## Caveats

- Runway can overestimate when FBA inventory is pooled across EU marketplaces
  (no programmatic split). Cross-check with `dbl-metrics-traffic` velocity if a
  call is close.
- When a tool's output is too large to return inline it is written to a file
  instead. Don't re-run with narrower parameters as a first move — `grep` that
  file for the family or ASIN you care about.

## Follow-ups

Pair with `dbl-metrics-traffic` (velocity) and `dbl-metrics-ads` (where the
spend is).
