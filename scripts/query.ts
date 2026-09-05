import postgres from "npm:postgres@3.4.8";
import { parseWsidArgument, resolveConnection } from "./lib/config.ts";

type OutputFormat = "json" | "csv";
type QueryParameter =
	| null
	| string
	| number
	| boolean
	| readonly QueryParameter[]
	| { readonly [key: string]: QueryParameter };

interface QueryArguments {
	readonly file: string;
	readonly format: OutputFormat;
	readonly output?: string;
	readonly params: readonly QueryParameter[];
	readonly wsid: string;
}

const ALLOWED_START = /^(SELECT|WITH|EXPLAIN|SHOW|TABLE|VALUES)\b/i;
const MODIFYING_KEYWORD =
	/\b(INSERT|UPDATE|DELETE|MERGE|UPSERT|CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE|COPY|CALL|DO|VACUUM|ANALYZE|REFRESH|REINDEX|CLUSTER|COMMENT|SECURITY|SET|RESET|COMMIT|ROLLBACK|BEGIN|LOCK|DISCARD|LISTEN|NOTIFY|UNLISTEN|PREPARE|EXECUTE|DEALLOCATE)\b/i;

function takeValue(
	args: readonly string[],
	index: number,
	option: string,
): string {
	const value = args[index + 1];
	if (value === undefined || value.startsWith("--")) {
		throw new Error(`${option} requires a value`);
	}
	return value;
}

function validateJsonValue(value: unknown): QueryParameter {
	if (
		value === null || typeof value === "string" || typeof value === "number" ||
		typeof value === "boolean"
	) {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map(validateJsonValue);
	}
	if (typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map((
				[key, nested],
			) => [key, validateJsonValue(nested)]),
		);
	}
	throw new Error("--params contains a value that JSON cannot represent");
}

function parseParams(value: string): readonly QueryParameter[] {
	const parsed: unknown = JSON.parse(value);
	if (!Array.isArray(parsed)) {
		throw new Error("--params must be a JSON array");
	}
	return parsed.map(validateJsonValue);
}

function parseArguments(args: readonly string[]): QueryArguments {
	const withWsid = parseWsidArgument(args);
	const positional: string[] = [];
	let format: OutputFormat = "json";
	let output: string | undefined;
	let params: readonly QueryParameter[] = [];

	for (let index = 0; index < withWsid.rest.length; index += 1) {
		const argument = withWsid.rest[index];
		if (argument === "--format") {
			const value = takeValue(withWsid.rest, index, "--format");
			if (value !== "json" && value !== "csv") {
				throw new Error("--format must be json or csv");
			}
			format = value;
			index += 1;
			continue;
		}
		if (argument === "--output") {
			output = takeValue(withWsid.rest, index, "--output");
			index += 1;
			continue;
		}
		if (argument === "--params") {
			params = parseParams(takeValue(withWsid.rest, index, "--params"));
			index += 1;
			continue;
		}
		if (argument.startsWith("--")) {
			throw new Error(`Unknown option ${argument}`);
		}
		positional.push(argument);
	}

	if (positional.length !== 1) {
		throw new Error(
			"Usage: query.ts --wsid ID [--format json|csv] [--output FILE] [--params JSON_ARRAY] QUERY.sql",
		);
	}

	return { file: positional[0], format, output, params, wsid: withWsid.wsid };
}

function validationText(sqlText: string): string {
	return sqlText
		.replace(/\/\*[\s\S]*?\*\//g, " ")
		.replace(/--[^\n]*/g, " ")
		.replace(/'(?:''|[^'])*'/g, "''")
		.replace(/"(?:""|[^"])*"/g, '""')
		.trim();
}

export function assertReadOnlyStatement(sqlText: string): string {
	const trimmed = sqlText.trim();
	const inspected = validationText(trimmed);
	const inspectedBody = inspected.endsWith(";") ? inspected.slice(0, -1).trimEnd() : inspected;
	if (inspectedBody === "") {
		throw new Error("SQL file is empty");
	}
	if (inspectedBody.includes(";")) {
		throw new Error("Only one SQL statement is allowed");
	}

	if (!ALLOWED_START.test(inspectedBody)) {
		throw new Error(
			"Statement must begin with SELECT, WITH, EXPLAIN, SHOW, TABLE, or VALUES",
		);
	}
	if (MODIFYING_KEYWORD.test(inspectedBody)) {
		throw new Error(
			"Statement contains a modifying or session-control keyword",
		);
	}

	return trimmed;
}

function csvCell(value: unknown): string {
	if (value === null || value === undefined) {
		return "";
	}
	const plain = typeof value === "object" ? JSON.stringify(value) : String(value);
	return /[",\r\n]/.test(plain) ? `"${plain.replaceAll('"', '""')}"` : plain;
}

function renderCsv(rows: readonly Record<string, unknown>[]): string {
	if (rows.length === 0) {
		return "";
	}
	const columns = Object.keys(rows[0]);
	const lines = [columns.map(csvCell).join(",")];
	for (const row of rows) {
		lines.push(columns.map((column) => csvCell(row[column])).join(","));
	}
	return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
	const args = parseArguments(Deno.args);
	const statement = assertReadOnlyStatement(await Deno.readTextFile(args.file));
	const connection = await resolveConnection(args.wsid);
	const sql = postgres(connection.postgresUrl, {
		max: 1,
		idle_timeout: 5,
		connect_timeout: 10,
	});

	try {
		const result = await sql.begin("read only", async (transaction) => {
			return await transaction.unsafe(statement, [...args.params]);
		});
		const rows: readonly Record<string, unknown>[] = Array.from(result);
		const rendered = args.format === "csv" ? renderCsv(rows) : `${JSON.stringify(rows, null, "\t")}\n`;
		if (args.output === undefined) {
			console.log(rendered.trimEnd());
		} else {
			await Deno.writeTextFile(args.output, rendered);
			console.error(`Wrote ${rows.length} row(s) to ${args.output}`);
		}
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
