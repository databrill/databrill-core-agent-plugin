# Use the Databrill database from n8n

This guide assumes Databrill has already provisioned a PostgreSQL credential in
n8n. Do not copy its password into a Code node, expression, workflow note,
exported workflow, or chat.

Use the Postgres node's Execute Query operation. Prefer the read-only `agent`
database user where available.

## Query rules

- Double-quote every schema, table, view, and column identifier.
- Use `$1`, `$2`, and so on for values; put expressions in Query Parameters.
- Select explicit columns and a bounded date range.
- Add a deterministic `ORDER BY` and a reasonable limit while developing.
- Do not build identifiers or SQL fragments from untrusted workflow input.
- Check the source maximum date and currency before sending a report.
- Use the declared views (kind `view` in a group's `index.tsv`) when they
  already express the required grain.

The n8n Postgres node sanitizes Query Parameters. See the
[official Postgres node documentation](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/).

## Find the configured schema

Run:

```sql
SELECT
	current_database() AS "database",
	current_schema() AS "currentSchema",
	current_schemas(FALSE) AS "searchPath";
```

If the credential's search path is correct, queries can use
`"amazon_sales_and_traffic"`. Otherwise qualify the relation as
`"public"."amazon_sales_and_traffic"` or `"w100000001"."..."` using the schema
Databrill supplied. Never guess or reuse another client's wsid.

## Discover live relations and columns

```sql
SELECT
	"table_name" AS "relation",
	"table_type" AS "kind"
FROM "information_schema"."tables"
WHERE "table_schema" = current_schema()
ORDER BY "table_name";
```

```sql
SELECT
	"ordinal_position" AS "position",
	"column_name" AS "column",
	"data_type" AS "type",
	"is_nullable" AS "nullable"
FROM "information_schema"."columns"
WHERE "table_schema" = current_schema()
	AND "table_name" = $1
ORDER BY "ordinal_position";
```

Set Query Parameters to an array containing the requested relation name, for
example `{{ ["amazon_sales_and_traffic"] }}`. The exact n8n expression wrapper
can differ by n8n version; use the node UI's Query Parameters field rather than
string interpolation in the SQL.

## Example: a parameterized date/store report

First inspect the view in the live schema and adapt only to columns that exist.
The safe workflow shape is:

1. Schedule Trigger or Form Trigger.
2. Edit Fields node producing `marketplace`, `dateFirst`, and `dateLast`.
3. Postgres Execute Query node with `$1`, `$2`, `$3` placeholders.
4. Aggregate or Code node only for presentation, not metric redefinition.
5. Spreadsheet, email, Slack, or another destination.

Query pattern:

```sql
SELECT
	"date",
	"marketplace_id",
	SUM("ordered_product_sales") AS "sales",
	SUM("units_ordered") AS "units",
	SUM("sessions") AS "sessions"
FROM "amazon_sales_and_traffic"
WHERE "marketplace_id" = $1
	AND "date" >= $2::DATE
	AND "date" <= $3::DATE
GROUP BY "date", "marketplace_id"
ORDER BY "date", "marketplace_id";
```

These names match the declared view. Confirm that the view exists in the
database and matches its declaration (`amazon_sales_and_traffic` in the
[Amazon group index](schema/amazon/index.tsv), with the full column list in
`schema/amazon/amazon_sales_and_traffic.yaml`) before saving the workflow.

## Multi-workspace n8n workflows

A direct PostgreSQL credential normally points to one database/search path. For
several workspaces, use one Databrill-provisioned credential per allowed target
or a specifically provisioned database role/search path. Keep workspace
selection as an allowlisted branch; do not accept an arbitrary schema name from
a webhook and concatenate it into SQL.

When aggregating outputs, preserve workspace and currency columns. A workflow
must not silently merge unlike currencies or report a partial cross-workspace
total when one branch fails.

## Before activating

- Run the query over a short range and inspect row count.
- Confirm uniqueness at the intended output grain.
- Check min/max dates and nulls.
- Reconcile one total manually.
- Verify the database credential cannot insert, update, delete, or run DDL.
- Remove sample payloads that contain customer data from node pins and execution
  history when they are no longer needed.
