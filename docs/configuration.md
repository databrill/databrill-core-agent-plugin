# Configuration and workspace scopes

The plugin has one setting: `mcp_url`. Leaving it empty is the normal setup: the
plugin then uses the user-scoped URL `https://mcp.databrill.com/mcp/user`, which
covers every workspace the signed-in Databrill user can access. Most users have
exactly one workspace, so that is the workspace they get, without anyone having
to look up an id.

Set the value only to narrow the scope deliberately, using a URL supplied by
Databrill. The shared package contains no client ids, workspace ids, database
passwords, or other client-specific configuration.

Whatever the URL, OAuth permissions remain authoritative: a narrower URL can
restrict what a session sees, but no URL grants access the signed-in user does
not already have.

## Hosted MCP URL choices

### Default: everything the signed-in user can access

Leave `mcp_url` empty, which is equivalent to setting:

```text
https://mcp.databrill.com/mcp/user
```

The connector exposes every workspace the signed-in user can currently access,
including workspaces in different organizations. It exposes `listWorkspaces`,
and data tools accept an optional `wsid`. For a single-workspace user this
behaves like a single-workspace connector.

### One workspace

Use:

```text
https://mcp.databrill.com/mcp/workspace/{wsid}
```

All metric tools operate in that workspace, so their calls do not need a `wsid`
parameter, and the connector does not expose `listWorkspaces`. Choose this when
a user has access to several workspaces but a session should stay in one of
them.

### Several workspaces in one organization

Use:

```text
https://mcp.databrill.com/mcp/org/{orgId}
```

The connector exposes `listWorkspaces`. Data tools accept an optional `wsid`.
Choose this when the intended workspaces are in one Databrill organization and
unrelated user memberships should remain outside the Claude session.

### Read-write: add `/rw` to any of the three

Any of the URLs above can carry a trailing mode segment:

```text
https://mcp.databrill.com/mcp/user/rw
https://mcp.databrill.com/mcp/workspace/{wsid}/rw
https://mcp.databrill.com/mcp/org/{orgId}/rw
```

The mode is a path segment, always last, and never a query parameter. A URL with
no trailing `ro` or `rw` segment — every form shown above this section — is
read-only. The segment is matched exactly and in lower case, so `RO`, `readonly`
and a trailing slash are rejected rather than corrected.

`/rw` is a selector, not a permission grant: it chooses among the capabilities
the signed-in user already has, and grants nothing new. `ro` is the other
direction, withholding the write tools from a user who could otherwise use them.
This is why the plugin's default stays read-only — a session gets write tools
only when the URL asks for them.

On a read-only session the write tools are not listed at all. So "the write tool
is missing" is a statement about the URL, not about permissions or about the
plugin version, and calling such a tool by hand on a read-only session is refused
anyway. Writing configuration is what these tools are for; the skill that uses
them is `dbl-brand-config`.

## Multi-workspace query rules

`listWorkspaces` returns workspace ids, labels, merchants, and countries. For
each analysis:

1. list and identify the intended workspaces;
2. make one metric call per workspace, passing `wsid` when required;
3. preserve each workspace label and marketplace in the result;
4. compare like periods and definitions;
5. do not add monetary values in different currencies without an explicit FX
   method;
6. say which workspaces failed or had no data.

The server may infer a workspace when a merchant or country belongs to exactly
one workspace. Pass `wsid` explicitly whenever the choice is ambiguous. One tool
call never silently fans out across all workspaces.

Example:

```text
Call listWorkspaces. For each workspace, load the last 4 complete weeks of ad
performance grouped by store. Return one section per workspace. Keep original
currencies separate and identify any workspace with missing or stale data.
```

## Authorization and privacy

The URL is routing information, not a permission grant, which is why the
user-scoped default is safe: the hosted server checks the OAuth user's current
Databrill memberships on every request, and a user with one workspace sees one
workspace. Never share another client's scoped URL as a template and never put
credentials in a skill, prompt, repository, n8n expression, or screenshot.

## Direct database scripts

The optional Deno helpers use a separate database configuration. They do not use
the hosted MCP URL or OAuth token.

Single database:

```bash
export POSTGRES_URL='postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require'
export PGSCHEMA='public'
```

If the database uses a workspace schema, set `PGSCHEMA=w{wsid}`.

Multiple databases or schemas:

```bash
export DATABRILL_CONFIG='/absolute/path/to/databrill.config.json'
export WORKSPACE_A_POSTGRES_URL='postgresql://...'
export WORKSPACE_B_POSTGRES_URL='postgresql://...'
```

Example `databrill.config.json`:

```json
{
	"version": 1,
	"workspaces": {
		"100000001": {
			"label": "Example A",
			"database": {
				"postgresUrl": "${WORKSPACE_A_POSTGRES_URL}",
				"schema": "w100000001"
			},
			"merchants": {}
		},
		"100000002": {
			"label": "Example B",
			"database": {
				"postgresUrl": "${WORKSPACE_B_POSTGRES_URL}",
				"schema": "w100000002"
			},
			"merchants": {}
		}
	}
}
```

Select one with `--wsid 100000001`. Environment placeholders keep secrets out of
the JSON file. Use a Databrill-provisioned read-only `agent` credential where
available. See [Installing Deno and running the helpers](deno.md).

## Local MCP development

Client installations should use the hosted connector. Databrill developers can
run the source MCP over stdio from the full-stack repository:

```bash
cd mcp-local
POSTGRES_URL='postgresql://...' deno run --allow-env --allow-net --allow-read \
  bin/stdio.ts
```

That developer workflow is not needed in Cowork and is not a client support
prerequisite.
