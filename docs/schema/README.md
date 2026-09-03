# Databrill client schema

Every table and view Databrill declares for a client workspace, one file per table.

Generated from the schema definitions in the Databrill monorepo. Do not edit anything in this folder by hand: rerun `cd services && deno task generate:agent-schema-docs` instead.

Tenant schema version: `0.1.5`

## Groups

- `amazon/` — 97 tables, 9 views
- `walmart/` — 4 tables, 0 views
- `shopify/` — 12 tables, 0 views
- `tfl/` — 12 tables, 0 views
- `common/` — 10 tables, 4 views

Most clients sell on one channel and need one group. `common` holds what is not channel-specific: exchange rates, the brand ontology and product configuration, and the schema version row.

## How to read it

1. Pick the group for the channel the question is about.
2. Open that group's `index.tsv`. It is one tab-separated row per table, sorted by category then name, with the columns `name`, `kind`, `access`, `columns`, `category`, `description`. `kind` is `table` or `view`; `access` is `read` or `readwrite`; `columns` is the column count; `description` is the first sentence of the table's description, and is empty when the table has no description authored yet — that says nothing about whether the table holds rows.
3. Open `<name>.yaml` for each table the question needs. It carries the full description, every column with its SQL type, the primary key, indexes, foreign keys, partitioning, and — for a view — its SELECT body.

### The `columns` block

`columns` is a tab-separated table inside a YAML literal block, not a YAML list. It is the shape that costs the fewest tokens to read, and it matches `index.tsv`.

- The first line names the fields, in order. `name` and `type` are always there. `nullable`, `default`, `identity`, `check` and `description` appear only when at least one column of that table uses them, so the header differs from file to file and has to be read.
- Every later line is one column, in declaration order.
- An empty cell means the field does not apply: an empty `nullable` cell means the column is NOT NULL, an empty `description` means no description is authored yet.
- A line may end early. Its remaining fields are all empty.
- No cell contains a tab, a carriage return or a newline; a description that had one carries a space in its place.

## What this does and does not tell you

- A table being declared here is not proof that a particular workspace has it populated or current. Databrill creates a client's tables as its pipelines first write to them.
- A workspace may also hold rollups and working tables that are not declared here.
- `amazon_sales_rank__<code>` tables exist one per marketplace, built from a template, so they are not declared table by table.
- For the live truth about one workspace — which tables exist, and what is in them — use the `listTables` and `describeTable` tools.
- Table and column identifiers are case-sensitive and must be double-quoted in hand-written SQL.
