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

On user- and organization-scoped connectors, call `listWorkspaces` and pass the
selected `wsid`. A workspace-scoped connector supplies it in the URL. Never
infer a target from `stores` or a `listWorkspaces` result with one entry. Cost
inputs and currencies belong to that workspace only.

`loadEconomics` parameters:

- **`stores`** (required), **`when`** (required) — as for the other tools.
- `products` — optional family / ASIN filter.
- `economics` — **cost inputs**, which the tool does not read itself. Read them
  from the client DB and pass them in: the price, referral fee and FBA fee per
  unit from `amzreport_FBA_FEE_PREVIEW` (`your_price`,
  `estimated_referral_fee_per_unit`, `expected_fulfillment_fee_per_unit`, per SKU
  with its `asin`), and the unit cost from the `UNIT_COGS` attribute of
  `brand_config_amazon_attributes` (the `dbl-brand-config` skill covers it).
  Pass `referralPct` as `estimated_referral_fee_per_unit` ÷ the price you pass.
  In a VAT marketplace (UK, EU) `your_price` includes VAT, which the tool does
  not take out, so pass the price net of VAT:
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
the caller supplies the cost inputs. Read them from the two tables above first,
then call again with `economics`; ask the user only for what they lack (no
`UNIT_COGS` configured, for example).

Cost inputs are usually per family rather than per variant; use `familyDefault`
and pass a family to `products` when the client thinks in families
(`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`).

## SQL fallback

The rollup comes from the ad tables (see `dbl-metrics-ads` and
`${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md` for which one holds spend and
revenue). The cost inputs come from `amzreport_FBA_FEE_PREVIEW` (price and
Amazon's per-unit fee estimates) and the `UNIT_COGS` attribute of
`brand_config_amazon_attributes` (the configured unit cost).

For the declared columns and types of any Amazon table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it.
