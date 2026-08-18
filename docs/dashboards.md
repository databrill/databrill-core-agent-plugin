# Build a dashboard from Databrill data

A useful dashboard begins with decisions, not charts. Define what someone should
notice and do, then choose the smallest set of measures and dimensions that can
support that decision.

## 1. Write the dashboard contract

State:

- audience and decision;
- workspace, stores, products, and currency;
- refresh cadence and latest acceptable source date;
- comparison periods;
- measures and exact definitions;
- dimensions and drill-down grain;
- filters;
- output format: Claude artifact, CSV, spreadsheet, n8n-fed destination, or code
  project.

Example:

```text
Audience: weekly commercial review
Decision: find products needing traffic, conversion, or ad-efficiency action
Scope: US, one workspace, last 8 complete weeks
Measures: sales, sessions, units, conversion, ad spend, ad revenue, ACOS
Grain: week × product family, drill to child ASIN
Freshness: show source max date for traffic and ads separately
```

## 2. Choose sources

Use MCP tools for curated metrics:

- `loadTraffic` for sessions, units, sales, and conversion;
- `loadAds` for spend, attributed sales, ACOS, and ROAS;
- `loadSqp` for search share;
- `loadRank` for BSR;
- `loadTflInventory` for current or as-of TFL warehouse stock;
- `inventoryPacing` for inventory action;
- `salesDropDiagnosis` for a driver summary.

MCP calls can have different grains and freshness dates. Do not join rows merely
because labels look similar. Prefer a configured family or exact ASIN key.

Use Deno/n8n SQL only for measures not exposed by MCP, such as detailed orders,
returns, listings, TFL, Walmart, or settlement data.

## 3. Validate before drawing

For every dataset:

1. record workspace, marketplace, time zone, period boundaries, and currency;
2. record the tool's latest data date or the table's max source date;
3. verify that the intended grain is unique;
4. distinguish zero from missing data;
5. reconcile a total against a simpler source or a second aggregation;
6. keep ratios derived from summed numerators and denominators. Do not average
   ACOS, conversion rates, or shares across rows.

## 4. Match charts to questions

- KPI cards: current value plus period-over-period change and freshness.
- Line chart: a metric over time; do not mix incompatible units on one axis.
- Ranked bars: product/campaign contribution or opportunity.
- Table: exact values, status, sparse dimensions, and operational follow-up.
- Scatter plot: relationship such as spend versus return, with enough points to
  justify it.
- Waterfall: an additive decomposition such as the sales-drop causes.

Avoid pie charts with many categories, truncated axes that exaggerate movement,
and color-only status. Put units in labels and keep marketplace/currency
visible.

## 5. Make refresh reproducible

For an MCP-driven dashboard, save the exact prompt, tool parameters, and
response metadata. For a database-driven dashboard, save versioned SQL using
parameters, not interpolated values. In n8n, keep the query in the Postgres node
and pass dates/stores through Query Parameters.

## 6. Ask Claude for an artifact

Anup-style exploration prompt:

```text
Use Databrill to build an exploratory dashboard for [decision]. First state the
workspace, stores, periods, metric definitions, and source freshness. Use the MCP
for supported metrics and tell me before using any database script. Validate the
grain and totals. Produce KPI cards, no more than three charts, and an exception
table with concrete follow-up actions. Include the exact tool parameters and any
SQL so the dashboard can be refreshed.
```

Cross-workspace prompt:

```text
Call listWorkspaces first. Run the same dashboard inputs separately for each
selected workspace. Keep original currencies separate, show one workspace column,
and report missing/stale sources. Do not silently total across workspaces.
```
