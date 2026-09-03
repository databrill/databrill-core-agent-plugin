---
name: dbl-metrics-rank
description: Track Best Sellers Rank (BSR) / organic rank trend per ASIN over time, by subcategory. Use when the user asks about BSR, best sellers rank, organic rank, category rank, rank trend, or whether a product's rank is rising or falling.
metadata:
    type: metrics
    audience: client
    tool: loadRank
---

# Best Sellers Rank (BSR) trend

Fetch rank snapshots from the **`core`** MCP server's **`loadRank`**
tool.

## Call

If the connector exposes `listWorkspaces`, select the intended workspace and
pass its `wsid`; do not merge rank histories across accounts.

`loadRank` parameters:

- **`stores`** (required), **`when`** (required) — as for the other tools.
- `products` — recommended filter (family / parent / child ASIN); rank tables
  are large, so scope to the products in question.

Example: "is B012345678's rank in US improving" →
`loadRank({ stores: "US", when: "P4W", products: "B012345678" })`.

`products` also takes a family name, which is usually what a client means by "the
product" — a family can hold 90+ variants
(`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`).

## Read the output

`data[]` points: `country, asin, date, rank, category, categoryName`. **Lower
rank = better** (rank 1 is the top seller). A rising integer over time = the
product is slipping. `meta.missingRankTables` lists any requested country that
has no rank table (no data for it).

Caveat: `categoryName` only resolves where the client DB has
`amazon_browse_node`; otherwise it falls back to `subcategory <code>` (the rank
numbers are still exact).

A drop in the _number of ASINs with rank rows_ is a strong stockout signal — one
family fell from 88 tracked products to 12 in a week when it sold out. Count
rows, not just ranks.

## SQL fallback

Source: `amazon_sales_rank__{cc}` (per marketplace; `time, asin, category,
rank`) and `amazon_browse_node` for names. The date column is `time`
(timestamptz), not `date`.

`amazon_sales_rank__us__2026_08` is a real partition of `amazon_sales_rank__us`,
not a separate extract: query the parent with a bounded filter on `"time"` and
let partition pruning work. No `UNION ALL` across months. Scope by `asin` too —
these tables are large. Double-quote identifiers; see
`${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md`.

For the declared columns and types of any Amazon table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it. The per-marketplace `amazon_sales_rank__{cc}` tables are
built from a template and are not declared there.
