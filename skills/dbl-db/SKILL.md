---
name: dbl-db
description: Answer Databrill data questions that do not fit a dedicated metric skill by selecting the right MCP tool or a safe read-only Deno/n8n database workflow. Use for arbitrary database exploration, table or column discovery, SQL, CSV exports, orders, listings, returns, reimbursements, fees, settlements, Walmart, The Fulfillment Lab data, or questions about what data is available.
---

# Explore Databrill data safely

Prefer a dedicated MCP tool whenever it covers the requested metric. Read
`${CLAUDE_PLUGIN_ROOT}/docs/common-questions.md` and
`${CLAUDE_PLUGIN_ROOT}/docs/data-coverage.md` to route the question.

If no MCP tool covers it:

1. identify the workspace, marketplace, period, grain, and currency;
2. identify the channel — Amazon, Walmart, Shopify or The Fulfillment Lab — and
   read `${CLAUDE_PLUGIN_ROOT}/docs/schema/<group>/index.tsv` for it (`amazon`,
   `walmart`, `shopify`, `tfl`; exchange rates, brand configuration and the
   schema version row are in `common`; a cross-channel question reads `common`
   plus each channel it touches), then
   `${CLAUDE_PLUGIN_ROOT}/docs/schema/<group>/<name>.yaml` for each table you
   pick (its `columns` key is a tab-separated table whose first line names the
   fields, and an empty cell means the field does not apply); then run
   `listTables` to see what this workspace actually has and
   `describeTable` for the exact columns in the database, because a workspace
   can lack a declared table, have it empty, or hold extra rollups the declared
   schema does not list;
3. read `${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md` for the date/store column
   table, quoting, `::numeric`, partitioned rank tables, and the relations whose
   names mislead;
4. write one bounded read-only query with double-quoted identifiers;
5. run it with `executeSql`;
6. validate uniqueness, nulls, min/max dates, row count, and totals;
7. return the query and explain missing or stale sources.

These three MCP tools need no local setup and are the normal path. Fall back to
`${CLAUDE_PLUGIN_ROOT}/scripts/catalog.ts` and
`${CLAUDE_PLUGIN_ROOT}/scripts/query.ts` (Deno, direct credential required) or
an n8n Postgres node only when the MCP tools are unavailable or the user asks
for a reusable script — `${CLAUDE_PLUGIN_ROOT}/docs/deno.md` and
`${CLAUDE_PLUGIN_ROOT}/docs/n8n.md`. Use `$1` parameters in anything you hand
back as a saved script.

For product families and the empty-`brand_ontology_*` trap, read
`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`. For any `shopify_*` table,
read `${CLAUDE_PLUGIN_ROOT}/docs/shopify-data-shape.md` first — that connector's
money columns, refresh markers and sparse report days each produce a plausible
wrong number rather than an error.

Do not guess columns. Do not interpolate values into SQL. Do not use database
data from one workspace to answer for another. Do not average rates or monetary
ratios across rows; aggregate their numerators and denominators. Do not claim
that a declared table is populated without live evidence.
