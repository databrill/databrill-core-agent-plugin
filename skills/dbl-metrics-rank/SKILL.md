---
name: dbl-metrics-rank
description: Track Best Sellers Rank (BSR) / organic rank trend per ASIN over time, by subcategory. Use when the user asks about BSR, best sellers rank, organic rank, category rank, rank trend, or whether a product's rank is rising or falling.
metadata:
    type: metrics
    audience: client
    tool: loadRank
---

# Best Sellers Rank (BSR) trend

Fetch daily Best Sellers Rank from the **`core`** MCP server's **`loadRank`**
tool.

## Call

On user- and organization-scoped connectors, call `listWorkspaces` and pass the
selected `wsid`. A workspace-scoped connector supplies it in the URL. Never
infer a target from `stores` or a `listWorkspaces` result with one entry; do not
merge rank histories across accounts.

`loadRank` parameters:

- **`stores`** (required), **`when`** (required) — as for the other tools.
- `products` — recommended filter (family / parent / child ASIN); rank tables
  are large, so scope to the products in question.

Example: "is B012345678's rank in US improving" →
`loadRank({ stores: "US", when: "P4W", products: "B012345678" })`.

`products` also takes a family name, which may be what a client means by "the
product" — a family can hold many variants
(`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`).

## Read the output

`data[]` rows: `country, asin, date, observedAt, rank, category, categoryKind,
categoryName` — one row per ASIN, category and day, holding the latest rank
Amazon reported that day. `date` is the marketplace's local calendar day and
`observedAt` that snapshot's time in UTC. **Lower rank = better** (rank 1 is the
top seller). A rising integer over time = the
product is slipping. `meta.missingRankTables` lists any requested country that
has no rank table (no data for it).

An ASIN is ranked in more than one category at once. `categoryKind` is
`subcategory` for a numeric browse-node category and `department` for a
top-level category such as `home_improvement`; compare ranks only within one
category, never a subcategory rank against a department rank. A subcategory's
`categoryName` resolves where the client DB has `amazon_browse_node`, otherwise
it reads `subcategory <code>`; a department's `categoryName` is its key. The
rank numbers are exact either way.

A drop in the _number of ASINs with rank rows_ is a strong stockout signal — a
family that sells out loses its products from the rankings. Count the ASINs
with a row on each day, not just ranks.

## SQL fallback

Source: `amazon_sales_rank__{cc}` (per marketplace; `time, asin, category,
rank`) and `amazon_browse_node` for names. The date column is `time`
(timestamptz), not `date`.

The table can hold several snapshots of one ASIN and category on one day. Keep
the latest of each marketplace-local day (`DISTINCT ON`, ordered by `"time"`
descending) before averaging or counting, or days with more snapshots weigh
more.

`amazon_sales_rank__us__2026_08` is a real partition of `amazon_sales_rank__us`,
not a separate extract: query the parent with a bounded filter on `"time"` and
let partition pruning work. No `UNION ALL` across months. Scope by `asin` too —
these tables are large. Double-quote identifiers; see
`${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md`.

For the declared columns and types of any Amazon table, read
`${CLAUDE_PLUGIN_ROOT}/docs/schema/amazon/index.tsv` and then that table's
`.yaml` beside it. The per-marketplace `amazon_sales_rank__{cc}` tables are
built from a template and are not declared there.
