---
name: dbl-db
description: Answer Databrill data questions that do not fit a dedicated metric skill by selecting the right MCP tool or a safe read-only Deno/n8n database workflow. Use for arbitrary database exploration, table or column discovery, SQL, CSV exports, orders, listings, returns, reimbursements, fees, settlements, Walmart, The Fulfillment Lab data, or questions about what data is available.
---

# Explore Databrill data safely

Prefer a dedicated MCP tool whenever it covers the requested metric. Read
`${CLAUDE_PLUGIN_ROOT}/docs/common-questions.md` and
`${CLAUDE_PLUGIN_ROOT}/docs/data-coverage.md` to route the question.

On user- and organization-scoped connectors, call `listWorkspaces` and pass the
selected `wsid` to every data tool. A workspace-scoped connector supplies the
wsid in its URL. Never infer a target from `stores` or from a `listWorkspaces`
result with one entry.

If no MCP tool covers it, answer with `executeSql`. Find the relation and its
columns first: read `${CLAUDE_PLUGIN_ROOT}/docs/schema/<group>/index.tsv` for
the channel (`amazon`, `walmart`, `shopify`, `tfl`; exchange rates, brand
configuration and the schema version row are in `common`; a cross-channel
question reads `common` plus each channel it touches), then
`${CLAUDE_PLUGIN_ROOT}/docs/schema/<group>/<name>.yaml` for each table you pick
(its `columns` key is a tab-separated table whose first line names the fields,
and an empty cell means the field does not apply). Confirm with `listTables` and
`describeTable`, because a workspace can lack a declared table, have it empty,
or hold extra rollups the declared schema does not list.
`${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md` has the date/store column table,
quoting, `::numeric`, partitioned rank tables, and the relations whose names
mislead.

Keep the query bounded and read-only, with double-quoted identifiers, and scoped
to one workspace, marketplace, period, grain and currency. Before answering,
check the result for duplicate keys at the intended grain, nulls, min/max dates,
row count and totals; return the query with the answer, and name any source that
was missing or stale.

These three MCP tools need no local setup and are the normal path. Fall back to
`${CLAUDE_PLUGIN_ROOT}/scripts/catalog.ts` and
`${CLAUDE_PLUGIN_ROOT}/scripts/query.ts` (Deno, direct credential required) or
an n8n Postgres node only when the MCP tools are unavailable or the user asks
for a reusable script — `${CLAUDE_PLUGIN_ROOT}/docs/deno.md` and
`${CLAUDE_PLUGIN_ROOT}/docs/n8n.md`. Use `$1` parameters in anything you hand
back as a saved script.

For product families and the empty-`brand_ontology_*` trap, read
`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`. To _change_ a
`brand_config_*` table — families, ASIN mapping, the ontology layer, or an
effective-dated cost or rate — use `dbl-brand-config`; reading them stays here.
For any `shopify_*` table, read
`${CLAUDE_PLUGIN_ROOT}/docs/shopify-data-shape.md` first — that connector's
money columns, refresh markers and sparse report days each produce a plausible
wrong number rather than an error.

Do not guess columns. `executeSql` takes no bind parameters, so an ad-hoc query
carries its values as quoted literals; the `$1` rule above is for saved scripts.
Do not use database data from one workspace to answer for another. Do not
average rates or monetary ratios across rows; aggregate their numerators and
denominators. Do not claim that a declared table is populated without checking
it in the database.
