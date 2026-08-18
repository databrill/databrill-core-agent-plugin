import postgres from "npm:postgres@3.4.8";
import { parseWsidArgument, resolveConnection } from "./lib/config.ts";

interface CatalogRow {
  readonly relation: string;
  readonly kind: string;
  readonly position: number;
  readonly column: string;
  readonly dataType: string;
  readonly nullable: string;
}

function cell(value: string | number): string {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function renderMarkdown(
  connectionLabel: string,
  schema: string,
  rows: readonly CatalogRow[],
): string {
  const lines = [
    "# Live Databrill database catalog",
    "",
    `Connection: ${connectionLabel}`,
    `Schema: \`${schema}\``,
    "",
    "| Relation | Kind | Position | Column | Type | Nullable |",
    "| --- | --- | ---: | --- | --- | --- |",
  ];

  for (const row of rows) {
    lines.push(
      `| ${cell(row.relation)} | ${cell(row.kind)} | ${cell(row.position)} | ${cell(row.column)} | ${
        cell(row.dataType)
      } | ${cell(row.nullable)} |`,
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
  const { wsid, rest } = parseWsidArgument(Deno.args);
  if (rest.length > 0) {
    throw new Error(`Unknown argument(s): ${rest.join(" ")}`);
  }

  const connection = await resolveConnection(wsid);
  const sql = postgres(connection.postgresUrl, {
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
  });
  try {
    const rows = await sql<CatalogRow[]>`
			SELECT
				"columns"."table_name" AS "relation",
				"tables"."table_type" AS "kind",
				"columns"."ordinal_position" AS "position",
				"columns"."column_name" AS "column",
				CASE
					WHEN "columns"."data_type" = 'ARRAY'
						THEN "columns"."udt_name"
					ELSE "columns"."data_type"
				END AS "dataType",
				"columns"."is_nullable" AS "nullable"
			FROM "information_schema"."columns" AS "columns"
			INNER JOIN "information_schema"."tables" AS "tables"
				ON "tables"."table_schema" = "columns"."table_schema"
				AND "tables"."table_name" = "columns"."table_name"
			WHERE "columns"."table_schema" = ${connection.schema}
			ORDER BY "columns"."table_name", "columns"."ordinal_position"
		`;
    const label = connection.wsid === undefined
      ? "POSTGRES_URL"
      : `${connection.label ?? "workspace"} (${connection.wsid})`;
    console.log(renderMarkdown(label, connection.schema, rows));
  } finally {
    await sql.end();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    Deno.exitCode = 1;
  });
}
