---
name: dbl-metrics-profitability
description: Assess per-ASIN advertising profitability — ad spend, ad cost per sale, halo revenue, and (when cost inputs are provided) net margin and net profit per ad sale with and without halo. Use when the user asks whether ads/PPC are profitable, net margin, profit per sale, "is this product making money", or break-even ACOS.
metadata:
    type: metrics
    audience: client
    tool: loadEconomics
---

# Advertising profitability

Fetch the per-advertised-ASIN rollup and profitability from the
**`core`** MCP server's **`loadEconomics`** tool.

## Call

If the connector exposes `listWorkspaces`, select the intended workspace and
pass its `wsid`. Cost inputs and currencies belong to that workspace only.

`loadEconomics` parameters:

- **`stores`** (required), **`when`** (required) — as for the other tools.
- `products` — optional family / ASIN filter.
- `economics` — **cost inputs**, since COGS/price/fees are **not** in the client
  DB:
  `{ "perAsin": { "B0...": { "price": 39.99, "cogs": 9.5, "fbaPickPack": 5.2,
  "referralPct": 0.15, "storage": 0.3 } }, "familyDefault": { ... } }`.

Example (no cost data yet): `loadEconomics({ stores: "US", when: "P4W" })` →
returns the ad rollup (spend, ad cost per sale, halo) with margins zeroed and
`source: "missing"`. Provide `economics` to get real margins.

## Read the output

- `rollup[]` — per ASIN:
  `totalSpend, totalDirectOrders, totalDirectRev,
  totalHaloRev, avgCpc, avgCr, avgAcos, avgRoas`.
- `economics[]` — per ASIN:
  `netBeforeAds, netMarginPct, avgAdCostPerSale,
  netPerAdSaleNoHalo, haloProfitPerAdSale, netPerAdSaleWithHalo, source`.

If `meta.hasCostInputs` is false, say so explicitly — margins are not real until
the caller supplies COGS. Ask the user for cost inputs (or the cost sheet) when
they want a true profitability answer.

Cost inputs are usually per family rather than per variant; use `familyDefault`
and pass a family to `products` when the client thinks in families
(`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`).

## SQL fallback

The rollup comes from the ad tables (see `dbl-metrics-ads` and
`${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md` for which one holds spend and
revenue). There is no COGS source in the DB — that is an input, not a query.

For the declared columns and types of any Amazon table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it.
