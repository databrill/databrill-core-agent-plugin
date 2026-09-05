---
name: dbl-dashboard
description: Design or construct a dashboard, report, chart, table, or recurring analysis from Databrill MCP or database data. Use when the user asks to explore their data visually, build a dashboard or artifact, chart trends, make a management report, export a reporting dataset, or compare several accounts/workspaces.
---

# Build Databrill dashboards

Read `${CLAUDE_PLUGIN_ROOT}/docs/dashboards.md` before selecting data or charts.

On a user- or organization-scoped connector, call `listWorkspaces`, select the
workspace, and pass its `wsid` explicitly to every data tool. A workspace-scoped
connector URL supplies that `wsid`. Never infer it from stores or from a registry
that happens to contain one entry.

Start by writing the dashboard contract: audience/decision, workspace and
stores, complete periods, freshness, metric definitions, grain, filters,
currency, and output. Use dedicated MCP tools for supported measures; use
`dbl-db` only for off-menu data.

Validate the data before visualizing it. Preserve source freshness, workspace,
marketplace, currency, and grain in the output. Derive rates from aggregated
numerators and denominators rather than averaging row-level percentages.

Product family is usually the right grain for a catalogue of hundreds of ASINs;
per-variant rows are mostly noise. See
`${CLAUDE_PLUGIN_ROOT}/docs/product-hierarchy.md`. For any hand-written SQL
behind a panel, read `${CLAUDE_PLUGIN_ROOT}/docs/sql-reference.md` first —
column naming, quoting and `::numeric` differ per relation. Show a metric
against a baseline (store average, prior period) rather than alone; a bare ratio
is not a finding.

Use KPI cards for a few decision measures, lines for time, ranked bars for
contribution, and tables for exact operational follow-up. Keep the display small
enough to scan. Include the exact MCP parameters or SQL so it can be refreshed.

For multi-workspace work, call `listWorkspaces`, query each selected workspace
separately, and show partial failures. Never silently fan out or combine
currencies.
