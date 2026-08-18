export interface ConnectionConfig {
  readonly postgresUrl: string;
  readonly schema: string;
  readonly wsid?: string;
  readonly label?: string;
}

interface WorkspaceConfig {
  readonly label?: unknown;
  readonly database?: unknown;
}

interface DatabaseConfig {
  readonly postgresUrl?: unknown;
  readonly schema?: unknown;
}

function expandEnvironment(text: string): string {
  const missing = new Set<string>();
  const expanded = text.replace(
    /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g,
    (_match, name: string) => {
      const value = Deno.env.get(name);
      if (value === undefined || value === "") {
        missing.add(name);
        return "";
      }
      return value;
    },
  );

  if (missing.size > 0) {
    throw new Error(
      `Configuration references unset environment variable(s): ${[...missing].join(", ")}`,
    );
  }

  return expanded;
}

function parseObject(
  value: unknown,
  description: string,
): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${description} must be a JSON object`);
  }
  return Object.fromEntries(Object.entries(value));
}

function workspaceConnection(raw: unknown, wsid: string): ConnectionConfig {
  const workspace = parseObject(
    raw,
    `Workspace ${wsid}`,
  ) satisfies WorkspaceConfig;
  const database = parseObject(
    workspace.database,
    `Workspace ${wsid} database`,
  ) satisfies DatabaseConfig;
  const postgresUrl = database.postgresUrl;
  if (typeof postgresUrl !== "string" || postgresUrl === "") {
    throw new Error(
      `Workspace ${wsid} database.postgresUrl must be a non-empty string`,
    );
  }

  const schema = typeof database.schema === "string" && database.schema !== "" ? database.schema : `w${wsid}`;
  const label = typeof workspace.label === "string" ? workspace.label : undefined;
  return { postgresUrl, schema, wsid, label };
}

export async function resolveConnection(
  wsidArgument?: string,
): Promise<ConnectionConfig> {
  const configPath = Deno.env.get("DATABRILL_CONFIG");
  if (configPath === undefined || configPath === "") {
    const postgresUrl = Deno.env.get("POSTGRES_URL");
    if (postgresUrl === undefined || postgresUrl === "") {
      throw new Error(
        "Set POSTGRES_URL, or set DATABRILL_CONFIG and pass --wsid",
      );
    }
    return {
      postgresUrl,
      schema: Deno.env.get("PGSCHEMA") || "public",
      wsid: wsidArgument,
    };
  }

  const text = await Deno.readTextFile(configPath);
  const parsed: unknown = JSON.parse(expandEnvironment(text));
  const root = parseObject(parsed, "Configuration root");
  const workspaces = parseObject(root.workspaces, "Configuration workspaces");
  const wsids = Object.keys(workspaces);
  if (wsids.length === 0) {
    throw new Error("Configuration workspaces must not be empty");
  }

  const wsid = wsidArgument ?? (wsids.length === 1 ? wsids[0] : undefined);
  if (wsid === undefined) {
    throw new Error(`Pass --wsid to choose one workspace: ${wsids.join(", ")}`);
  }
  if (!(wsid in workspaces)) {
    throw new Error(
      `Unknown wsid ${wsid}. Configured workspaces: ${wsids.join(", ")}`,
    );
  }

  return workspaceConnection(workspaces[wsid], wsid);
}

export function parseWsidArgument(
  args: readonly string[],
): { readonly wsid?: string; readonly rest: readonly string[] } {
  const rest: string[] = [];
  let wsid: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--wsid") {
      const value = args[index + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new Error("--wsid requires a value");
      }
      wsid = value;
      index += 1;
      continue;
    }
    rest.push(argument);
  }

  return { wsid, rest };
}
